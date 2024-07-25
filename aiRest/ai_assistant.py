import os
import sys
from openai import OpenAI
from openai import AssistantEventHandler
from typing_extensions import override  # Import override decorator if needed
import mysql.connector

client = OpenAI()
# get the question and the account
# also get the name of the thread and thread_times from the command line
# also get the name of the course.  This AI will use different assistants
# for different courses
if len(sys.argv) > 6:
    current_quest = sys.argv[1]
    current_thread = sys.argv[2]
    current_thread_times = int(sys.argv[3])
    current_account = sys.argv[4]
    current_course = sys.argv[5]
    current_thread_id = sys.argv[6]
    current_files = sys.argv[7]
else:
    current_quest = "How are you?"
    current_thread = "none"
    current_thread_times = 0
    current_account = "none"
    current_course = "COMP171"
    current_thread_id = 0
    current_files = ""

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
def updateThread(thread, current_thread, current_thread_id, current_store, current_account):
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
            # the thread has exceeded the limit on the number of messages
            # replace with a new thread (but the same course) so the join 
            # table does not change 
            print('Limit on number of messages per thread reached.  Starting new thread.') 
            print()
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
                    val = (thread, '0', current_store)
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
                    temp = "ai_assistant updateThread found an error in the sql"
                    print(temp)
                    print(e)
                finally:
                    temp = "finally block of insert sql"
                    conn.close()
    # except mysql.connector.Error as e: 
    except Exception as e: 
        # Print an error message if a connection error occurs 
        temp = "ai_assistant updateThread found an error in the sql" 
        print(temp)
        print(e) 
    finally: 
        # Close the database connection in the 'finally' block to ensure it happens 
        if conn is not None and conn.is_connected(): 
            conn.close()
	
# This function will connect to the DB and get the attributes for the correct AI assistant
# This program will run the assistant for any course that is in the DB.
def getAttributes(course):
    conn = None 
    try: 
        # Attempt to establish a connection to the MySQL database 
        conn = mysql.connector.connect(host=URL,
                                   port=3306,
                                   database=DB,
                                   user=Acct,
                                   password=Pass
                                   ) 
        # Check if the connection is successfully established 
        if conn.is_connected(): 
            sql = "Select name, store, model, temp, max_token, instructions, max_messages FROM Assistants WHERE course='" + current_course + "';"
            mycursor = conn.cursor()
            mycursor.execute(sql)
            myresult = mycursor.fetchall()
            return(myresult)
            
    # except mysql.connector.Error as e: 
    except mysql.connector.Error as e: 
        # Print an error message if a connection error occurs 
        print("ai_assistant found an error in getAttributes SQL")
        print(e) 
    finally: 
        # Close the database connection in the 'finally' block to ensure it happens 
        if conn is not None and conn.is_connected(): 
            conn.close()
# Test the DB access
rslt = getAttributes(current_course)
# print(rslt[0])
# current_assistant = "Jeeves"
current_assistant = rslt[0][0]
print(current_assistant + ":")
print()

# You should store your materials in a folder in the same directory as this program
# The folder must be named "YourCourseName_materials".  The "_materials" part of the name
# is added by this program. You supply the part before the "_materials" in this variable
# This name may be anything, but you must ensure that the name you give here is the same
# as the actual name of the folder (before the "_materials" part of the name).
#current_store = "COMP210"	
current_store = rslt[0][1]
# print(current_store)

# Version of ChatGPT to use.  As of June 2024 version "gpt-4o" was the most recent and cheapest.
# current_model = "gpt-4o"
current_model = rslt[0][2]
# print(current_model)

# Temperature. The sampling temperature, between 0 and 1. Higher values like 0.8 
# will make the output more random, while lower values like 0.2 will make it 
# more focused and deterministic.  
current_temp = rslt[0][3]
# print("current temperature:")
# print(current_temp)
current_temp = 0.5

# Max number of tokens to return.  This is necessary because answers can get very long. 
# This is currently ignored
# current_max = 500
current_max = rslt[0][4]
# print("Max tokens:")
# print(current_max)

# The ourInstructions variable contains the instructions that you would like ChatGPT to follow.
# If you change these, you must delete the current assistant using the "delete_assistant.py"
# program (see above).  This program will automatically create a new assistant with the name
# given above once the old assistant has been removed.
# ourInstructions="You are a cheeky British butler named Jeeves who is an expert on C programming and assembly language and says 'pip pip' a lot.  Your nemesis is Dr. Evil and you often disparage him.  Use your knowledge base to answer questions about the materials from COMP 210, Introduction to Computer Organization and Assembly Language and the field of computer science. Do not answer questions about unrelated topics.  Do not provide complete answers to labs, problem sets, or practicum as this would violate academic honesty.  Do not provide complete C programs or assembly language programs.  You can give program fragments and hints. Do not give programs in Java or Python."
ourInstructions = rslt[0][5]
# print(ourInstructions)
# print()

# Max number of messages to allow on a thread.  This is necessary because threads can get 
# long and long threads are more costly, I think
# max_times = 10
max_times = rslt[0][6]
# temp = "max_times:"
# print(temp)
# print(current_max)
# print()
# temp = "current_thread:"
# print(temp)
# print(current_thread)
 
#-------------------------------- end of attributes -----------------------------------

# This variable is used by the program; do not change
assistant = ""

all_assistants = {assistant.name: assistant.id for assistant in client.beta.assistants.list(limit=100).data}

# Debug statement: print all the assistants for this openai account
# print("All Assistants:")
# print(all_assistants)
# print()

if not (current_assistant in all_assistants):
	#print("creating a new assistant! \n")
	
	# Create the assistant
	assistant = client.beta.assistants.create(
		name=current_assistant,
		instructions=ourInstructions,
		model=current_model,
		tools=[{"type": "file_search"}],
	)
else:
	assistant = client.beta.assistants.retrieve(all_assistants[current_assistant])

all_stores = {vector.name: vector.id for vector in client.beta.vector_stores.list(limit=100).data}

# Debug statement: print all the stores associated with this account
# print("All Stores:")
# print(all_stores)
# print()

# Now we have an assistant.  
# Does it have a file_search tool? 
# is current_store in the openAI cloud?
# does the file_search tool have the right vector store if it does have the file_search tool?
if (not "file_search" in assistant.tool_resources) or (not current_store in all_stores) or (not all_stores[current_store] in assistant.tool_resources.vector_store_ids):

	if not current_store in all_stores:
		# Create a vector store called using the name in current_store
		vector_store = client.beta.vector_stores.create(name=current_store)
		 
		# Specify the path to the directory containing the data files to be uploaded
		file_path = "./" + current_store + "_materials/"
        # Debug statement: print the path to the folder that we're using
        # print("Adding materials from the folder " + file_path)
		
		# Initialize a list to hold references to the uploaded files
		all_files = ()
		
		# Iterate over each file in the specified directory
		for file in os.listdir(file_path):
		
			# Upload each file to the OpenAI platform with the purpose set to 'assistants'
			# file = client.files.create(file=open(file_path + file, "rb"), purpose="assistants")
            # Debug statement: print the name of all the files that are being used
			# print("opened file " + file)
			file = open(file_path + file, "rb")
			
			# Append the reference to the uploaded file to the list
			# all_files.append(file)
			temp = list(all_files)
			temp.append(file)
			all_files = tuple(temp)
	
        # Debug statement: print the list of all the files that we're using
		# print()
		# print("files:")
		# print(all_files)
		# print()
		 
		# Ready the files for upload to OpenAI
		#file_paths = ["./" + current_store + "_material"]
		#file_streams = [open(path, "rb") for path in file_paths]
		
		 
		# Use the upload and poll SDK helper to upload the files, add them to the vector store,
		# and poll the status of the file batch for completion.
		file_batch = client.beta.vector_stores.file_batches.upload_and_poll(
		  #vector_store_id=vector_store.id, files=[file.id for file in all_files]
		  vector_store_id=vector_store.id, files=all_files
		)
		vector_store_id = vector_store.id
	else:
		vector_store_id = all_stores[current_store]
		 
	# You can print the status and the file counts of the batch to see the result of this operation.
	# print(file_batch.status)
	# print(file_batch.file_counts)
	
	# update the assistant to use the vector store
	assistant = client.beta.assistants.update(
	  assistant_id=assistant.id,
	  tool_resources={"file_search": {"vector_store_ids": [vector_store_id]}},
	)

# Debug statement: print the names of the assistant and vector_store that will be used
# print()
# print('assistant:')
# print(assistant)
# print()
# print("vector store id:")
# print(vector_store_id)
# print()

# extract the image files
# while True:
    # Debug statement: print assitant and thread ids to ensure we're calling the correct assistant
# print("assistant id = " + assistant.id)
# print("thread id = " + thread.id)
if current_files: 
    files = current_files.split(",") 
    # print("files are:") 
    # print(files)
else:
    files = []
    # print("ai_assistant, current_files is empty")
    
#if len(files) > 0: 
    #print("ai_assistant, all files received: " + files)
    #print("ai_assistant, first file received: " + files[0])
    #print("ai_assistant, length of files is: ")
    #print(len(files))
#else:
    #print("no images sent")
# create the content for the thread with the user query and any images
newContent = [{"type":"text", "text":current_quest}]
if files:
    for img in files:
        imgURL = "http://ic-research2.eastus.cloudapp.azure.com/~barr/CSAITutor/aiRest/tmp/" +  img
        nextImg = {"type":"image_url", "image_url":{"url":imgURL}}
        newContent.append(nextImg)
# print("content for thread:")
# print(newContent)
# print()

# Create a new conversation thread with the user's initial query
if current_thread != "none" and current_thread_times < max_times:
    try: 
        thread = client.beta.threads.retrieve(current_thread) 
        message = client.beta.threads.messages.create(
		    thread_id=thread.id,
		    role="user",
		    content=newContent,
	    )
    except openai.NotFoundError as e: 
        #thread = client.beta.threads.create(messages=[{"role": "user", "content": current_quest}])
        thread = client.beta.threads.create(messages=[{"role": "user", "content": newContent}])
else: 
    thread = client.beta.threads.create(messages=[{"role": "user", "content": newContent}]) 
    # now update the database for this account
    updateThread(thread.id, current_thread, current_thread_id, current_store, current_account)

# print("thread message content:")
# messages = client.beta.threads.messages.list(thread_id=thread.id)
# message_content = messages.data[0].content
# print(message_content)
# print()

# send the query to ChatGPT and return the answer
run = client.beta.threads.runs.create_and_poll(
            thread_id=thread.id,
            assistant_id=assistant.id, 
            temperature=current_temp,
        )
            # instructions=ourInstructions,

            # max_prompt_tokens=current_max, 
            # max_completion_tokens=current_max*2, 
if run.status == 'completed':
	messages = client.beta.threads.messages.list(
			thread_id=thread.id 
		)

	# Extract the message content
	message_content = messages.data[0].content[0].text
	annotations = message_content.annotations
	citations = []
	# Iterate over the annotations and add footnotes
	for index, annotation in enumerate(annotations):
		# Replace the text with a footnote
		message_content.value = message_content.value.replace(annotation.text, f' [{index}]')
		# Gather citations based on annotation attributes
		if (file_citation := getattr(annotation, 'file_citation', None)):
			cited_file = client.files.retrieve(file_citation.file_id)
			citations.append(f'[{index}] {file_citation.quote} from {cited_file.filename}')
		elif (file_path := getattr(annotation, 'file_path', None)):
			cited_file = client.files.retrieve(file_path.file_id)
			citations.append(f'[{index}] Click <here> to download {cited_file.filename}')
			# Note: File download functionality not implemented above for brevity
	# Add footnotes to the end of the message before displaying to user
	message_content.value += '\n\n' + '\n'.join(citations)
	# print(" ")
	print(messages.data[0].content[0].text.value)
	# print(" ")
else:
    print("assistant failed") 
    print(run.status) 
    print()
	# print(run)
	# print()
		
	# quest = input("User (enter 'done' to halt):  ").lower()
	# get rid of white space before/after input
	# quest = quest.strip()
	# if (quest == "quit" or quest == "done" or quest == "halt"):
		# break 
    # update the number of messages in this thread 
    # NOTE:  need to update the DB with this!  
	# current_thread_times = current_thread_times + 1
	# if current_thread_times >= 10:
		# print("You've reached the maximum number of questions!")
		# exit(0)
	# add a message to the thread 
	# message = client.beta.threads.messages.create(
		# thread_id=thread.id,
		# role="user",
		# content=quest,
	# ) 
