import os
import sys
from openai import OpenAI
from openai import AssistantEventHandler
from typing_extensions import override  # Import override decorator if needed
import mysql.connector

client = OpenAI()
# create a new thread 
if len(sys.argv) > 4:
    current_thread = sys.argv[1]
    # current_thread_times = int(sys.argv[2])
    current_account = sys.argv[2]
    current_course = sys.argv[3]
    current_thread_id = sys.argv[4]
else:
    current_thread = "none"
    # current_thread_times = 0
    current_account = "none"
    current_course = "COMP171"
    current_thread_id = 0

# Now get the database configuration data
URL = ""
Acct = ""
Pass = ""
DB = ""
with open('./config.txt') as f: 
    rslt = f.read() 
    rsltArr = rslt.split('\n') 
    URL = rsltArr[0] 
    Acct = rsltArr[1] 
    Pass = rsltArr[2]
    DB = rsltArr[3]


# This function will connect to the DB and insert the new thread.
# This function is called when the code below determines that 
# there has been 10 runs on the current thread.
def updateThread(thread, current_thread, current_thread_id, course, current_account):
    conn = None 
    try: 
        # Attempt to establish a connection to the MySQL database 
        conn = mysql.connector.connect(host=URL,
                                   port=3306,
                                   database=DB,
                                   user=Acct,
                                   password=Pass
                                   ) 
        mycursor = conn.cursor()
        # Check if the connection is successfully established 
        if current_thread != "none":
            # replace with a new thread (but the same course) so the join 
            # table does not change 
            if conn.is_connected(): 
                sql = "UPDATE Threads SET name = '" + thread + "', times=" + '0' + " WHERE tid = '" + current_thread_id + "';"
                mycursor.execute(sql)
                conn.commit()
        else:
            # the current_thread is "none" so must make new entries into
            # the Threads table and the ThSjoin table
            # creating a new entry, must also update the thread join table
            if conn.is_connected(): 
                try: 
                    # We know that thread is "none" so this is a new thread entry
                    sid = 0
                    # first insert into the Threads table
                    sql = "INSERT INTO Threads (name, times, course) Values (%s, %s, %s)"
                    val = (thread, '0', course)
                    temp = "INSERT with values:"
                    mycursor.execute(sql, val)
                    temp = 'updated Threads table with rows affected: '
                    # print(temp)
                    # print(mycursor.rowcount)
                    tid = str(mycursor.lastrowid)
                    # tid = 27
                    # temp = 'selected tid from Threads table: ' + tid
                    # print(temp) 
                    # Now get the student id so that we can enter this into the ThSjoin table
                    sql = "SELECT id FROM  Student WHERE account = '" + current_account + "';" 
                    mycursor.execute(sql) 
                    myresult = mycursor.fetchall() 
                    sid = str(myresult[0][0]) 
                    # now insert into the ThSjoin table
                    sql = "INSERT INTO  ThSjoin (TID_FK, SID_FK) Values (%s, %s)";
                    val = (tid, sid)
                    # mycursor = conn.cursor()
                    mycursor.execute(sql, val)
                    conn.commit()
                except Exception as e:
                    temp = "updateThread found an error in the sql"
                    print(temp)
                    print(e)
                finally:
                    temp = "finally block of insert sql"
                    conn.close()
    # except mysql.connector.Error as e: 
    except Exception as e: 
        # Print an error message if a connection error occurs 
        temp = "updateThread found an error in the sql" 
        print(temp)
        print(e) 
    finally: 
        # Close the database connection in the 'finally' block to ensure it happens 
        if conn is not None and conn.is_connected(): 
            conn.close()
	
# Create a new conversation thread with the user's initial query
current_quest = "Hello There!"
thread = client.beta.threads.create(messages=[{"role": "user", "content": current_quest}]) 
# now update the database for this account
updateThread(thread.id, current_thread, current_thread_id, current_course, current_account)

print("Started new conversation!")
