// const pgp = require('pg-promise')(/* options */);

// var cn = 'postgres://postgres:root@localhost:5432/Database1';
// const db=pgp(cn);
        //const res=await db.querry({rowMode:'array', text: 'Select * from test;'})
        // console.log(res[0].name)
        // await db.end();
// db.one('SELECT name FROM test', [123]) 
//   .then(test  => {
//     console.log(test.name);
//   })
//   .catch(error =>{
//     console.log('ERROR:', error);
//   });

// var http=require('http');
// var express=require('express') ;
// const hostname = 'localhost';
// const port = 3000; 
// const server = express();



const express = require('express')

const bodyParser = require('body-parser')
var cors = require('cors');

const app = express()
app.use(cors());

const port = 3000

 

app.use(bodyParser.json())

app.use(

  bodyParser.urlencoded({

    extended: true,

  })

)
var urlencodedParser=bodyParser.urlencoded({extended:false});
 

               

               

const Pool = require('pg').Pool

const pool = new Pool({

  user: 's3_dropbox_rw',

  host: 'tmaws-dev-postgres-mobility-rds.cmditfh3waie.ap-south-1.rds.amazonaws.com',

  database: 's3_dropbox',

  password: '$3D^0pboxrW@2468',

  port: 5432,

})

 

 

 

 


  app.get('/login2/', (request, response) => {
    //var temp;
    response.json({info:'Login!!'});
    pool.query("SELECT credentials FROM test where name='Ritik' ", (error, results) => {

      if (error) {
  
        throw error
  
                  }
  
                  console.log("hi")
                  
                  console.log(results.rows)
                  //temp=results.rows
                  //return results
                  //response.json({results.rows})
      //response.status(200).json(results.rows)
  
    })
    //response.json({info:temp})
  })

  app.get('/', (request, response) => {

    response.json({ info: 'Node.js, Express, and Postgres API' })
  
  })


  app.get('/login1/', (request, response) => {

    response.json({ info: 'Node.js, Express, and Postgres API' })
    console.log(request.query.username)
    pool.query("SELECT credentials FROM test where name='Ritik' ", (error, results) => {

      if (error) {
  
        throw error
  
                  }
  
                  console.log("hi")
                  
                  console.log(results.rows)
                  //temp=results.rows
                  //return results
                  //response.json({results.rows})
      //response.status(200).json(results.rows)
  
    })
  
  })
  
   

  app.post('/login/', urlencodedParser, function (req, res) {  
    //res.json({ info: 'Login!!, Express, and Postgres API' })
    // Prepare output in JSON format  
    // response = {  
    //     first_name:req.body.first_name,  
    //     last_name:req.body.last_name  
    // };  
    // console.log(req.body.username);
    // console.log(req.body.password);   
    //res.end(JSON.stringify(response));  
    var user_name =req.body.username
    var pass =req.body.password
    // console.log(user_name);
    // console.log(pass);  
    var values;
    var credential=false;
    pool.query("SELECT * FROM test where name='"+user_name+"' and credentials='"+pass+"'", (error, results) => {

      if (error) {
  
        throw error
  
                  }
  
                  
                  //values=results.rows
                  //credential=Object.values(values[0])[0]
                  console.log(results.rows)
                  return res.status(200).json(results.rows[0])
                  if((results.rows).length>0){
                   // res.send('<b>hello</b>')
                    res.end("true")
                    //credential=true
                    //res.redirect('http://localhost:3000/home')

                  }
                  else{
                    res.end("false")
                  }
                  //temp=results.rows
                  //return results
                  //response.json({results.rows})
      //response.status(200).json(results.rows)
  
    })
     //console.log(credential)
    // console.log(pass)
    // if(pass==credential){
    //   console.log("Valid")
    // }
    // else{
    //   console.log("Invalid")
    // }
 })  

  
   
  
  app.listen(port, () => {
  
    console.log(`App running on port ${port}.`)
  
  })


// app.get('/api/', (req, res, next) => {   
//   res.statusCode = 200;   
//   res.setHeader('Content-Type', 'text/plain');   
//   res.end('Hello World');
// });
// app.get('/login/', (req, res, next) => {   
//     res.statusCode = 200;   
//     res.setHeader('Content-Type', 'text/plain');   
//     res.end('Authentication');

//   //   db.one('SELECT * from test', 123)
//   // .then(function (data) {
//   //   console.log('DATA:', data)
//   // })
//   // .catch(function (error) {
//   //   console.log('ERROR:', error)
//   // })

//   });

// app.listen(port, hostname, () => {     
//   // connect to the DB
//   console.log('Server running at http://${hostname}:${port}/');
// });