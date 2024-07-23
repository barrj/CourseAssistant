var express = require('express')
var mysql = require('mysql'); // access to mysql
var cors = require('cors'); // use to disable cors
const fs = require('fs'); // use to get file listing and upload files

// This file exists only to server the Profile REST API

const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const  { spawn } = require("child_process");

var app = express();

// read DB configuration data
let file = "./config.txt";
let URL = "";
let Account = "";
let Pass = ""
let DB = ""
try {
  const data = fs.readFileSync(file, 'utf8');
  //console.log(data);
  let temp = data.split('\n');
  URL = temp[0];
  Account = temp[1];
  Pass = temp[2];
  DB = temp[3];
} catch (err) {
  console.error("profile.js error reading file");
  console.error(err);
}

    // password: "ru^^i&Gc8r2",
//var connection = mysql.createConnection({
var pool = mysql.createPool({
    connectionLimit : 200,
    host: URL,
    user: Account,
    password: Pass,
    database: DB, 
    debug : false
});

// The SQL connection times out after 8 hours
// We will check for the connection; if not present, recreate
function createPool(){
    pool = mysql.createPool({
    connectionLimit : 200,
    host: URL,
    user: Account,
    password: Pass,
    database: DB,
    debug : false
  });
}
//connection.connect(); // <---- AND HERE

// all environments
const PORT = 21958;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/',function(request,response){

    connection.query('SELECT * FROM Section', function(err, rows, fields)
    {
            //console.log('Connection result error '+err);
            //console.log('no of records is '+rows.length);
            //console.log('rows are: '+JSON.stringify(rows));
            //response.header("Access-Control-Allow-Origin", "*");
            //response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            //response.writeHead(200, { 'Content-Type': 'application/json'});
            //response.end(JSON.stringify(rows));
    });

    connection.query('SELECT * FROM Topics', function(err, rows, fields)
    {
            //console.log('Connection result error '+err);
            //console.log('no of records is '+rows.length);
            //console.log('rows are: '+JSON.stringify(rows));
            response.header("Access-Control-Allow-Origin", "*");
            response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            response.writeHead(200, { 'Content-Type': 'application/json'});
            response.end(JSON.stringify(rows));
    });
} );

app.post('/auth', function(request, response){
    const account = request.body.account;
    const pass = request.body.pass;


    // check to see if the pool still exists
    if (!pool){
        createPool();
    }

  pool.getConnection(function(err, connection){
    if (err) {
        //connection.release();
        throw err;
    }
    connection.query("SELECT full_name, id, account FROM Student WHERE account =?",[account], 
        function(err, rows, fields)
        {
         if (err){
            console.error('An error occurred when selecting from Student table');
            console.error(err);
            response.header("Access-Control-Allow-Origin", "*");
            response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            response.writeHead(200, { 'Content-Type': 'application/json'});
            response.end(JSON.stringify([{full_name: "fail"}]));
            return;
         }
         //console.log('Connection result error '+err);
         //console.log('no of records is '+rows.length);
         //console.log('rows are: '+JSON.stringify(rows));
         response.header("Access-Control-Allow-Origin", "*");
         response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
         response.writeHead(200, { 'Content-Type': 'application/json'});
         if (rows.length == 0){
           response.end(JSON.stringify([{full_name: "fail"}]));
           return;
         }
         else{
           response.end(JSON.stringify(rows));
         }
    });  // end connection.query
  });  // end getConnection
});

app.post('/profile', function(request, response){
    const account = request.body.account;

    // check to see if the pool still exists
    if (!pool){
        createPool();
    }
  pool.getConnection(function(err, connection){
    if (err) {
        // connection.release();
        throw err;
    }
    connection.query("SELECT full_name, id, account, gender, grad_year, major, year, email, web_page, linkedin FROM Student WHERE account =?", [account],
       function(err, rows, fields)
       {
         if (err){
            console.error('An error occurred when selecting from Student table');
            console.error(err);
            response.header("Access-Control-Allow-Origin", "*");
            response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            response.writeHead(200, { 'Content-Type': 'application/json'});
            response.end(JSON.stringify([{full_name: "fail"}]));
            return;
         }
         //console.log('Connection result error '+err);
         //console.log('no of records is '+rows.length);
         //console.log('rows are: '+JSON.stringify(rows));
         response.header("Access-Control-Allow-Origin", "*");
         response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
         response.writeHead(200, { 'Content-Type': 'application/json'});
         if (rows.length == 0){
           response.end(JSON.stringify([{full_name: "fail"}]));
           return;
         }
         else{
             //console.log("/profile returning " + rows);
           response.end(JSON.stringify(rows));
         }
    });  // end connection.query
  });  // end getConnection
});  // end /profile

app.post('/update', function(request, response){
    const account = request.body.account;
    const name = request.body.name;
    const gender = request.body.gender;
    const email = request.body.email;
    const major = request.body.major;
    const year = request.body.year;
    const grad = request.body.grad;
    const web = request.body.web;
    const linkedin = request.body.linkedin;

    // check to see if the pool still exists
    if (!pool){
        createPool();
    }
  pool.getConnection(function(err, connection){
    if (err) {
        // connection.release();
        throw err;
    }
    connection.query(`UPDATE Student SET full_name=?, email=?, gender=?, grad_year=?, major=?, year=?, web_page=?, linkedin=? WHERE account =?`,  [name, email, gender, grad, major, year, web, linkedin, account], 
       function(err, rows, fields)
       {
         if (err){
            console.error('An error occurred when selecting from Student table');
            console.error(err);
            response.header("Access-Control-Allow-Origin", "*");
            response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            response.writeHead(200, { 'Content-Type': 'application/json'});
            response.end(JSON.stringify([{full_name: "fail"}]));
            return;
         }
         // console.log('Connection result error '+err);
         // console.log('no of records is '+rows.length);
         // console.log('rows are: '+JSON.stringify(rows));
         response.header("Access-Control-Allow-Origin", "*");
         response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
         response.writeHead(200, { 'Content-Type': 'application/json'});
         if (rows.length == 0){
           response.end(JSON.stringify([{full_name: "fail"}]));
           return;
         }
         else{
           response.end(JSON.stringify(rows));
         }
    });  // end connection.query
  });  // end getConnection
});  // end /update

app.post('/ask', function(request, response){
    const account = request.body.account;
    const aType = request.body.aType;
    const quest = request.body.quest;
    let thread = "none"; // we need to pass a thread to the assistant
    let thread_times = 0;
    let thread_tid = 0;

    // check to see if the pool still exists
    if (!pool){
        createPool();
    }

  pool.getConnection(function(err, connection){
    if (err) {
        // connection.release();
        throw err;
    }
    connection.query("SELECT name, tid, times FROM Threads INNER JOIN ThSjoin ON Threads.tid = ThSjoin.TID_FK AND Threads.course = ? INNER JOIN Student ON Student.id = ThSjoin.SID_FK AND Student.account = ? ", [aType, account], 
       function(err, rows, fields)
       {
         if (err){
            console.error('An error occurred when selecting from Threads table');
            console.error(err);
            response.header("Access-Control-Allow-Origin", "*");
            response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            response.writeHead(200, { 'Content-Type': 'application/json'});
            response.end(JSON.stringify([{full_name: "fail"}]));
            return;
         }
         if (rows.length == 0){
           thread = "none";
           thread_times = 0;
         }else{
            thread = rows[0].name;
            thread_times = rows[0].times;
            thread_tid = rows[0].tid;
            /* update the DB with a new thread_times */
            /* if the thread exists (i.e., is not 'none')*/
            if (thread != 'none'){
              q = "UPDATE Threads SET times =" + (thread_times + 1) + " WHERE  tid='" + thread_tid + "';";
              connection.query(q, function(err2, rows2, fields2)
              {
                if (err2){
                    console.error('An error occurred when selecting from Student table: ' + err2);
                    response.end(JSON.stringify("fail"));
                    return;
               }
              });
            }
         }
             // console.log(rows[0]);
            //console.log('Connection result error '+err);
            //console.log('no of records is '+rows.length);
            //console.log('rows are: '+JSON.stringify(rows));
            response.header("Access-Control-Allow-Origin", "*");
            response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            response.writeHead(200, { 'Content-Type': 'application/json'});
            // no thread exists yet for this account/course combination
            /* Found a thread, now send the thread and question to the openai assistant */

           /* now ask the assistant for an answer; need to check the question first */
   let runPy = new Promise(function(success, nosuccess) {

       /*
    const name = "George"
    const pyprog = spawn('python3',["./test.py", name]);
    */
    //const assistant = "./" + aType + "_assistant.py";
    let assistant = "./ai_assistant.py";
    const pyprog = spawn('python3',[assistant, quest, thread, thread_times, account, aType, thread_tid]);

    pyprog.stdout.on('data', function(data) {

        success(data);
    });

    pyprog.stderr.on('data', (data) => {

        nosuccess(data);
    });
}).then((rslt) =>{
    // console.log("\nserver received from python: \n\n" + rslt);
    //console.log("putting into response: " + JSON.stringify(rslt));
    // This doesn't work:
    // purify the result to ensure that there no XSS attack
    // We use dompurity and jsdom to perform the cleaning
    const newRslt = String.fromCharCode.apply(null, rslt);
    const window = new JSDOM('').window;
    const purify = createDOMPurify(window);
    const clean = purify.sanitize(newRslt);
    response.end(JSON.stringify(clean));
  }).catch((e) => {
      console.log("error: " + e);
      response.end(JSON.stringify("none"));
  });
           //rslt = getAnswer(rows[0].thread, rows[0].thread_times);
           //console.log("Server side ask received: " + rslt);
           //response.end(JSON.stringify(rows));
    }); // end connection.query
  }); // end getconnection
}); // end /ask


app.get('/nav',function(request,response){
    q = "SELECT Section.Stext, Section.SID, Topics.Tname, Topics.TID FROM ((Section INNER JOIN TSjoin ON Section.SID = TSjoin.SID_FK) INNER JOIN Topics ON TSjoin.TID_FK = Topics.TID); ";
    connection.query(q, function(err, rows, fields)
    {
         if (err){
            console.error('An error occurred when selecting from Topics table');
            console.error(err);
            return;
         }
         //console.log('Connection result error '+err);
         //console.log('no of records is '+rows.length);
         //console.log('rows are: '+JSON.stringify(rows));
         let sections = [];
         let data = {};
         let topics = [];
         let currentSID = 0;
         let i = 0;
         while (i < rows.length){
             currentSID = i; 
             topics = [];
             data = {};
             while (i < rows.length && rows[i].SID == rows[currentSID].SID){
                 data = {concept:rows[i].Tname, cid:rows[i].TID};
                 topics.push(data);
                 i++;
             }
             data = {SectionName: rows[currentSID].Stext, sid:rows[currentSID].SID, concepts:topics};
             sections.push(data);
         };
         console.log("received from getTopics(): " + sections);
         response.header("Access-Control-Allow-Origin", "*");
         response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
         response.writeHead(200, { 'Content-Type': 'application/json'});
         response.end(JSON.stringify(sections));
    });
} );

app.listen(PORT, () => console.log(`Express server currently running on port ${PORT}`));

