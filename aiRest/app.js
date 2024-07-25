//var express = require('express')
import express from 'express';
//var mysql = require('mysql'); // access to mysql
import mysql from 'mysql'; // access to mysql
//var cors = require('cors'); // use to disable cors
import cors from 'cors'; // use to disable cors
// const fs = require('fs'); // use to get file listing and upload files
import fs from 'fs'; // use to get file listing and upload files
//const formidable = require('formidable');
import formidable, {errors as formidableErrors} from 'formidable';
import multer from 'multer';

//const createDOMPurify = require('dompurify');
import createDOMPurify from 'dompurify';
//const { JSDOM } = require('jsdom');
import { JSDOM } from 'jsdom';

//const  { exec, spawn } = require("child_process");
import  { exec, spawn } from "child_process";

const app = express();

// this will be used in the /addfiles route to upload form data and files
const upload = multer({ dest: './uploads/', limits: { fieldSize: 33 * 1024 * 1024 } })

// these lines are necessary to enable uploading large files
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

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
  console.error(err);
}

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

// Connectionconnection.connect(); // <---- AND HERE

// all environments
//app.set('port', process.env.PORT || 21957);
const PORT = 21962;
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

    //q = "SELECT full_name, id, account FROM Student WHERE account ='" + account + "';";
    //connection.query(q, function(err, rows, fields)
    // get a connection from the pool
//
app.post('/auth', function(request, response){
    const account = request.body.account;
    const pass = request.body.pass;

    // check to see if the pool still exists
    if (!pool){
        createPool();
    }

  pool.getConnection(function(err, connection){
    if (err) {
        // connection.release();
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
      // we're finished with the connection
     connection.release();
  }); // end pool.getconnection
});  // end app.post('/auth')

    //connection.query('SELECT * FROM health_records where id = ?', [data.id], (err, rows) => {
    //q = "SELECT full_name, id, account, gender, age, major, year FROM Student WHERE account ='" + account + "';";

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
            //console.error('An error occurred when selecting from Student table');
            //console.error(err);
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
    // we're finished with the connection
    connection.release();
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
    // we're finished with the connection
    connection.release();
  });  // end getConnection
});  // end /update

    //function(request, response){
app.post('/ask', upload.array("files"), function(request, response, next){
    /*
    console.log("fields from multer:");
    console.log(request.fields);
    console.log("files from multer:");
    console.log(request.files);
    if (request.files.length > 0){
      console.log("name of first file from multer:");
      console.log(request.files[0].originalname);
    }
    else{
     console.log("no image files found");
    }
    */
    const account = request.body.account;
    const aType = request.body.aType;
    const quest = request.body.quest;
    let thread = "none"; // we need to pass a thread to the assistant
    let thread_times = 0;
    let thread_tid = 0;
    //q = "SELECT thread, thread_times FROM Student WHERE account ='" + account + "';";

    // check to see if the DB pool still exists
    if (!pool){
        createPool();
    }

    // get a connection to the DB from the pool
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
              let q = "UPDATE Threads SET times =" + (thread_times + 1) + " WHERE  tid='" + thread_tid + "';";
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
            response.header("Access-Control-Allow-Origin", "*");
            response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            response.writeHead(200, { 'Content-Type': 'application/json'});

       /* Now move the images that were uploaded to the /tmp file
        * and create an array of image names for the ai_assistant to use
        */
      let cmd = "";
      let name = "";
      let finalName = "";
      let filesToSend = [];
      request.files.forEach( (file) => {
        name = file.originalname.trim();
        // get rid of spaces and quotes in the file name
        name = name.replace(/[\s'"]/g, "");
        finalName = "./tmp/" + name;
        cmd = "mv ./uploads/" + file.filename + " " + finalName;
        filesToSend.push(name);
        //console.log("trimed name is: " + name);
        //console.log("using command: " + cmd);
        exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        //console.log(`stdout: ${stdout}`);
        });
    }
    );
   //console.log("/ask after search for files with filesToSend = " + filesToSend);
   //console.log("/ask after search for files length of filesToSend = " + filesToSend.length);
   if (filesToSend.length === 0){
       filesToSend = "";
   }

   /* Found a thread, now send the thread, question, and images to the openai assistant */
    if (request.files.length > 0){
       console.log("/ask is ready to call the assistant.  filesToSend is " + filesToSend);
    }
   let runPy = new Promise(function(success, nosuccess) {

    let assistant = "./ai_assistant.py";
    //console.log("Calling ai_assistant with question: " + quest);
    const pyprog = spawn('python3',[assistant, quest, thread, thread_times, account, aType, thread_tid, filesToSend]);

    pyprog.stdout.on('data', function(data) {

        success(data);
    });

    pyprog.stderr.on('data', (data) => {

        nosuccess(data);
    });
}).then((rslt) =>{
    console.log("\n/ask received from python: \n\n" + rslt);
    // purify the result to ensure that there no XSS attack
    // We use dompurity and jsdom to perform the cleaning
    const newRslt = String.fromCharCode.apply(null, rslt);
    //const window = new JSDOM('').window;
    //const purify = createDOMPurify(window);
    //const clean = purify.sanitize(newRslt);
    //response.end(JSON.stringify(clean));
    response.end(JSON.stringify(newRslt));
  }).catch((e) => {
      console.log("/ask error from assistant: " + e);
      response.end(JSON.stringify("assistant failed"));
  });
           //rslt = getAnswer(rows[0].thread, rows[0].thread_times);
           //console.log("Server side ask received: " + rslt);
           //response.end(JSON.stringify(rows));
    }); // end connection.query
    // we're finished with the connection
    connection.release();
  }); // end getconnection
}); // end /ask

app.post('/newthread', function(request, response){
    const account = request.body.account;
    const aType = request.body.aType;
    let thread = "none"; // we need to find a thread 
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
    connection.query("SELECT name, tid FROM Threads INNER JOIN ThSjoin ON Threads.tid = ThSjoin.TID_FK AND Threads.course = ? INNER JOIN Student ON Student.id = ThSjoin.SID_FK AND Student.account = ? ", [aType, account], 
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
           // thread_times = 0;
         }else{
            thread = rows[0].name;
            // thread_times = rows[0].times;
            thread_tid = rows[0].tid;
            /* update the DB with a new thread_times */
         }
            response.header("Access-Control-Allow-Origin", "*");
            response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            response.writeHead(200, { 'Content-Type': 'application/json'});

           /* now call the python program that will create a new thread */
   let runPy = new Promise(function(success, nosuccess) {

    let task = "./update_thread.py";
    const pyprog = spawn('python3',[task, thread, account, aType, thread_tid]);

    pyprog.stdout.on('data', function(data) {

        success(data);
    });

    pyprog.stderr.on('data', (data) => {

        nosuccess(data);
    });
}).then((rslt) =>{
    //console.log("\n/thread update from python: \n\n" + rslt);
    const newRslt = String.fromCharCode.apply(null, rslt);
    //console.log("putting into response: " + JSON.stringify(newRslt));
    response.end(JSON.stringify(newRslt));
  }).catch((e) => {
      console.log("error: " + e);
      response.end(JSON.stringify("none"));
  });
    }); // end connection.query
    // we're finished with the connection
    connection.release();
  }); // end getconnection
}); // end /newthread

app.get('/nav',function(request,response){

    // check to see if the pool still exists
    if (!pool){
        createPool();
    }
  pool.getConnection(function(err, connection){
    if (err) {
        // connection.release();
        throw err;
    }
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
    }); // end connection.query
    // we're finished with the connection
    connection.release();
  });  // end getConnection
} ); // end /nav

app.post('/attributes', function(request, response){
    const course = request.body.course;

    // check to see if the pool still exists
    if (!pool){
        createPool();
    }

  pool.getConnection(function(err, connection){
    if (err) {
        // connection.release();
        throw err;
    }
    connection.query("SELECT name, store, model, temp, max_token, max_messages, instructions FROM Assistants WHERE course =?", [course],
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
           response.end(JSON.stringify([{name: "fail"}]));
           return;
         }
         else{
             // console.log("/attributes returning");
             // console.log(rows);
           response.end(JSON.stringify(rows));
         }
    });  // end connection.query
    // we're finished with the connection
    connection.release();
  });  // end getConnection
}); // end /attributes

app.post('/updateattributes', function(request, response){
    const aname = request.body.aname;
    const sname = request.body.sname;
    const model = request.body.model;
    const temp = request.body.temp;
    const maxT = request.body.maxT;
    const maxM = request.body.maxM;
    const instr = request.body.instr;
    const course = request.body.course;
    const oldAssist = request.body.oldAssist;
    var result = "";
    // this function is used to add the result from updating the DB
    // to a global variable to be returned to the user
    const storeResult = (rslt) => {
    result = result + rslt;
    }

  pool.getConnection(function(err, connection){
    if (err) {
        // connection.release();
        throw err;
    }
    connection.query(`UPDATE Assistants SET name=?, model=?, temp=?, max_token=?, max_messages=?, instructions=? WHERE course =?`,  [aname, model, temp, maxT, maxM, instr, course], 
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
           response.end(JSON.stringify([{rslt: "fail"}]));
           return;
         }
         else{
           /* Successfully updated assistant */
             storeResult(oldAssist + " attributes updated; ");

    let runPy = new Promise(function(success, nosuccess) {

    let d_assistant = "./delete_assistants.py";
    // console.log("Will delete the assistant " + oldAssist);
    const pyprog = spawn('python3',[d_assistant, oldAssist]);

    pyprog.stdout.on('data', function(data) {

        success(data);
    });

    pyprog.stderr.on('data', (data) => {

        nosuccess(data);
    });
}).then((rslt) =>{
    storeResult(rslt);
    console.log("\n updateattributes received from python: \n\n" + rslt);
    // console.log("putting into response: " + JSON.stringify(result));
    //response.write(JSON.stringify([{txt:result}]));
         response.end(JSON.stringify([{rslt:result}]));
  }).catch((e) => {
      console.log("error: " + e);
      response.end(JSON.stringify([{txt: "failed to update assistant"}]));
  });
           //response.end(JSON.stringify(rows));
    // console.log("/updateattribues after call to python, result = " + result);
         //  response.end(JSON.stringify([{rslt:result}]));
         }
    });  // end connection.query
    // we're finished with the connection
    connection.release();
  });  // end getConnection
}); // end updateattributes

//http.createServer(app).listen(app.get('port'), function(){
//  console.log('Express server listening on port ' + app.get('port'));
//});

app.post('/getfiles', function(request, response){
    const course = request.body.course;
    const courseDir = './' + course + '_materials'; 
    // console.log("/getfiles looking in folder " + course);
    var fileList = [];
    fs.readdirSync(courseDir).forEach(file => {
        // console.log(file);
        fileList.push(file);
    });
    // console.log(fileList);
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    response.writeHead(200, { 'Content-Type': 'application/json'});
    response.end(JSON.stringify(fileList));
});

app.post('/deletefiles', function(request, response){
    const course = request.body.course;
    const filesToDel = request.body.filesToDel;
    const courseDir = './' + course + '_materials'; 
    // console.log("/getfiles looking in folder " + course);
    var fileList = [];
    console.log("/deletefiles using directory " + courseDir);
    console.log("/deletefiles deleting files ");
    let cmd = "";
    filesToDel.forEach( (file) => {
        cmd = "rm " + courseDir + "/" + file;
        //console.log("using command: " + cmd);
        exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        });
    }
    );
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    response.writeHead(200, { 'Content-Type': 'application/json'});
    response.end(JSON.stringify("success"));
});

app.post('/addfiles', upload.array("files"), function(request, response, next){
    //console.log("fields from multer:");
    //console.log(request.fields);
    //console.log("files from multer:");
    //console.log(request.files);
    //console.log("name of first file from multer:");
    //console.log(request.files[0].originalname);

    let course = request.body.course;
    //let course = "";
    //console.log("/addfiles before parse, course = " + course);
    //console.log("/addfiles, request.body:");
    //console.log(request.body);
    //console.log("/addfiles before parse, contentToAdd = " + contentToAdd);

    let ans = "success"

    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    response.writeHead(200, { 'Content-Type': 'application/json'});

    const courseDir = './' + course + '_materials/'; 
    //var fileList = [];
    console.log("/addfiles using directory " + courseDir);
    let cmd = "";
    let name = "";
    request.files.forEach( (file) => {
        name = file.originalname.trim();
        name = name.replace(/[\s'"]/g, "");
        cmd = "mv ./uploads/" + file.filename + " " + courseDir + name;
        console.log("trimed name is: " + name);
        console.log("using command: " + cmd);
        exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        //console.log(`stdout: ${stdout}`);
        });
    }
    );
    let runPy = new Promise(function(success, nosuccess) {

    let d_vector = "./delete_vector_store.py";
    console.log("Will delete the vector store " + course);
    const pyprog = spawn('python3',[d_vector, course]);

    pyprog.stdout.on('data', function(data) {

        success(data);
    });

    pyprog.stderr.on('data', (data) => {

        nosuccess(data);
    });
}).then((result) =>{
    console.log("\n addfiles received from python: \n\n" + result);
    // console.log("putting into response: " + JSON.stringify(result));
    //response.write(JSON.stringify([{txt:result}]));
    response.end(JSON.stringify([{rslt:result}]));
  }).catch((e) => {
      console.log("error: " + e);
      response.end(JSON.stringify([{txt: "failed to update vector store"}]));
  });
    /*
    let path = "";
    if (contentToAdd){
        path = courseDir + contentToAdd;
        console.log("writing to path: " + path);
        fs.writeFile(path, contentToAdd, err => {
            if (err) {
                console.log("Error writing file: " + err);
            } else {
                console.log("Success writing " + path);
            }
        });
    }
        */
    response.end(JSON.stringify(ans));
});

app.listen(PORT, () => console.log(`Express server currently running on port ${PORT}`));

