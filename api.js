//const e = require('express');
const express = require('express');
const app = express();

//Configuration to the connection with the Database 
var mysql = require('mysql');
var connection = mysql.createConnection({
    socketPath : '/cloudsql/mysqlnodejs:europe-west1:mysql-api',
    user      : 'balink',
    password  : '',
    database  : 'MyDatabase'
  });

  /*var mysql = require('mysql');
  var connection = mysql.createConnection({
    host     : '35.195.147.220',
    database : 'MyDatabase',
    port     : '3306',
    user     : 'root',
    password : '',
    });
*/
app.use(express.json());
var str;
var p;
var result;
var counter = 3;
connection.connect(function(err) {
    if (err) {
        return err;
    }
    else{
        console.log("Connected!");
    }
  });
app.get('/', (req, res) => {
    //res.send('Hello World!');
    str = 'SELECT * FROM Persons WHERE id=2;';
    connection.query(str, function (err, m) {
        if (err) return res.send(err);
        res.send(m)
    });
  });

app.get("/Person", (req, res) => {
        str = 'SELECT * FROM Persons WHERE id='+req.query.id+';';
        //connection.connect();
        let x = connection.query(str, function (err, result) {
        if (err){
            return err;
        }
             return rows;
        });
        connection.end();
        res.json(x)
   });
app.post("/Person", (req,res) => {
    str = "INSERT INTO Persons (firstName,lastName,phoneNumber,city,country) VALUES ( '" ;
    if (req.body.firstName == undefined){
         res.json("error on firstname")
    }
    str+= req.body.firstName+"','";
    if (req.body.lastName == undefined){
        return res.json("error on lastName")
    }
    str+= req.body.lastName+"','";
    if (req.body.phoneNumber == undefined){
        return res.json("error on phoneNumber")
    }
    str+= req.body.phoneNumber+"','";
    if (req.body.city == undefined){
        return res.json("error on city")
    }
    str+= req.body.city+"','";
    if (req.body.country == undefined){
        return res.json("error on country")
    }
    str+= req.body.country+"' );";
    //+req.body.firstName+"','"+ req.body.lastName+"','"+req.body.phoneNumber+"','"+req.body.city +"','"+req.body.country + "' );";
    sendquery(str,'succeed the id for the person id: ',res);
   });
app.delete("/Person", (req, res, next) => {
    if(req.query.id){
        str = 'DELETE FROM Persons WHERE id ='+req.query.id+';';
        return sendquery(str,'deleted succeed',res);
    }
    res.json("error id ")
   });


//Animals table
app.get("/Animal", (req, res) => {
    if(req.query.id){
        str = 'SELECT * FROM Animals WHERE id='+req.query.id+';';
        return sendquery(str,0,res)
    }
    res.json("error id ")
   });
app.post("/Animal", (req,res) => {
    
    str = "INSERT INTO Animals (name, species) VALUES ('";
    if (req.body.name == undefined){
        return res.json("error on name")
    }
    str+= req.body.name + "','";
    if (req.body.species == undefined){
        return res.json("error on species")
    }
    str+= req.body.species  +"' );";
    sendquery(str,'succeed the id for the person id: ',res);
   });
app.post("/Animal/update", (req, res, next) => {
    if (req.query.id){
        str = 'UPDATE Animals SET WHERE id ='+req.query.id+';';
        return  sendquery(str,'update succeed',res);
    }
    res.json("error id ")


   });

//memberships table
app.get("/Memberships", (req, res) => {
    if (req.query.id){
        str = 'SELECT * FROM Memberships WHERE IdPerson='+req.query.id+';';
        return sendquery(str,0,req,res)
    }   
    res.json("error id ")
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
            str = "INSERT INTO Memberships (personId,animalId) VALUES ( "+ req.body[0]+"," + req.body[1]+" );"
                /*str = 'SELECT * FROM Persons WHERE id='+req.body[0]+';';
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
        
                }); */
        
        } 
        else {
            return res.json("already exist");
        }
    });
    connection.end();
 });
  

//connection.end();

function sendquery(str,message,res){
    connection.connect();
    connection.query(str, function(err, rows, fields) {
    if (err){
        return err;
    } 
    if (message==0){
        return rows
    }
    else{
        return message;
    }
    });
    
}
// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
