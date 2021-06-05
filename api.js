const express = require('express');
const app = express();


var mysql = require('mysql');
/*var connection = mysql.createConnection({
host     : '35.195.147.220',
database : 'MyDatabase',
port     : '3306',
user     : 'balink',
password : '',
});*/
let config = {
     user: 'balink',
     database: 'MyDatabase',
     password: '',
}

 if ('mysqlnodejs:europe-west1:mysql-api') {
   config.socketPath = `/cloudsql/$mysqlnodejs:europe-west1:mysql-api`;
 }

let connection = mysql.createConnection(config);


  
  

app.use(express.json());
var str;
var p;
var result;
app.get('/', (req, res) => {
    res.send('Hello from App Engine!');
  });

app.get("/Person", (req, res) => {
    str = 'SELECT * FROM Persons WHERE id='+req.query.id+';';
    sendquery(str,0,req,res)
   });
app.post("/Person", (req,res) => {
    str = "INSERT INTO Persons (firstName, lastName,phoneNumber,city,country) VALUES ( '" +req.body.firstName+"','"+ req.body.lastName+"','"+req.body.phoneNumber+"','"+req.body.city +"','"+req.body.country + "' );";
    sendquery(str,'succeed the id for the person id: ',req,res);
   });
app.delete("/Person", (req, res, next) => {
    str = 'DELETE FROM Persons WHERE id ='+req.query.id+';';
    sendquery(str,'deleted succeed',req,res);
   });


//Animals table
app.get("/Animal", (req, res) => {
    str = 'SELECT * FROM Animals WHERE id='+req.query.id+';';
    sendquery(str,0,req,res)
   });
app.post("/Animal", (req,res) => {
    str = 'INSERT INTO Animals (name, species) VALUES ('+req.body.toString()+');';
    sendquery(str,'succeed the id for the person id: ',req,res);
   });
app.post("/Animal/update", (req, res, next) => {
    
    str = 'UPDATE Animals SET WHERE id ='+req.query.id+';';
    sendquery(str,'deleted succeed',req,res);
   });

//memberships table
app.get("/Memberships", (req, res) => {
    str = 'SELECT IdPerson,PersonName ,IdAnimal,AnimalName,species FROM Memberships WHERE IdPerson='+req.query.id+';';
    sendquery(str,0,req,res)
   });
app.post("/Memberships", (req,res) => {
    str = 'SELECT * FROM Memberships WHERE IdAnimal='+req.body[1]+';'; 
    p = "";
    connection.connect();
    connection.query(str, function(err, rows, fields) {

        if (err){
            console.log("error ")
            return res.json(err);
        }
        var q = Object.values(JSON.parse(JSON.stringify(rows)))
        if(!q.length){
                console.log("get in")
                str = 'SELECT * FROM Persons WHERE id='+req.body[0]+';';
                connection.query(str, function(err, p1, fields) {
                    if (err){
                        return console.log(err);
                    }  
                    result = Object.values(JSON.parse(JSON.stringify(p1)))[0];
                    p+= result.id +", '"+ result.firstName +"', '"+ result.lastName +"', '"+ result.phoneNumber  +"', '"+ result.city +"', '"+ result.country +"',";
                });
                str = 'SELECT * FROM Animals WHERE id='+req.body[1]+';';
                connection.query(str, function(err, p2, fields) {
                    if (err){
                        return console.log(err);
                    }
                    result = Object.values(JSON.parse(JSON.stringify(p2)))[0];
                    p+= result.id +", '"+result.name +"', '"+ result.species+"'";
                    console.log(p);
                    
                    str = 'INSERT INTO Memberships (IdPerson, PersonName, PersonLastName,phoneNumber,city,country,IdAnimal,AnimalName,species) VALUES (' + p + ');';
                
                    connection.query(str, function(err, rows, fields) {
                        if (err){
                            return console.log(err);
                        } 
                        return res.json("success");
                    });  
        
                }); 
        
        } 
        else {
            return res.json("already exist");
        }
    });
    //connection.end();
 });
  

//connection.end();

function sendquery(str,message,req,res){
    connection.connect();
    connection.query(str, function(err, rows, fields) {
    console.log("avivv")
    if (err){
        console.log("diii")
        return res.json(err);
    } 
    if (message==0){
        return res.json(rows);
    }
    else{
        return res.json(message);
    }
    });
    
   
    console.log("end")
}
// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
