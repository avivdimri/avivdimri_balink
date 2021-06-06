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
connection.connect(function(err) {
    if (err) {
        return err;
    }
    console.log("Connected!");
  });
app.get('/', (req, res) => {
    res.send("Hello it's my Api!");
  });

app.get("/Person", (req, res) => {
    if(req.query.id){
        str = 'SELECT * FROM Persons WHERE id='+req.query.id+';';
        return connection.query(str, function (err, result) {
        if (err){
            return res.json(err);
        }
        let r = Object.values(JSON.parse(JSON.stringify(result)))
        if(!r.length){
            return res.json("person with id: " + req.query.id + " doesn’t exist");
        }
        return res.json(result)
        });
    }
    else{
        res.json("The given field isn’t available .Please use 'id' as identifier ")
    }
   });
app.post("/Person", (req,res) => {
    str = "INSERT INTO Persons (firstName,lastName,phoneNumber,city,country) VALUES ( '" ;
    var str2 = "select id from Persons where firstName='"
    if (req.body.firstName == undefined){
         res.json("error on firstname")
    }
    str+= req.body.firstName+"','";
    str2+=req.body.firstName+"' AND lastName='";
    if (req.body.lastName == undefined){
        return res.json("error on lastName")
    }
    str+= req.body.lastName+"','";
    str2+=req.body.lastName+"' AND phoneNumber='";
    if (req.body.phoneNumber == undefined){
        return res.json("error on phoneNumber")
    }
    str+= req.body.phoneNumber+"','";
    str2+=req.body.phoneNumber+"' AND city='";
    if (req.body.city == undefined){
        return res.json("error on city")
    }
    str+= req.body.city+"','";
    str2+=req.body.city+"' AND country='";
    if (req.body.country == undefined){
        return res.json("error on country")
    }
    str+= req.body.country+"' );";
    str2+=req.body.country+"';";
    connection.query(str2,str, function (err, result) {
        if (err){
            return res.json(err)  
        }
        var table = Object.values(JSON.parse(JSON.stringify(result)))
        if(table.length>0){

                return res.json("Person is already created the person id is: "+Object.values(JSON.parse(JSON.stringify(table)))[0].id);
        }
        connection.query(str, function (err, result) {
        if (err){
           return res.json(err);
        }
            connection.query(str2, function (err, result) {
            if (err){
               return res.json(err);
            }   
                return res.json("created person, the id is: "+Object.values(JSON.parse(JSON.stringify(result)))[0].id);
            });
           
        });
       
    });
            
   });
    
app.delete("/Person", (req, res, next) => {
    if(req.query.id){
        str = 'DELETE FROM Persons WHERE id ='+req.query.id+';';
        connection.query(str, function (err, result) {
            if (err){
                return res.json(err);
            }
                return res.json("Person was deleted Successfully");
            });
       }
    else{
        res.json("The given field isn’t available .Please use 'id' as identifier ")
    }
   });

app.get("/Animal", (req, res) => {
    if(req.query.id){
        str = 'SELECT * FROM Animals WHERE id='+req.query.id+';';
        connection.query(str, function (err, result) {
            if (err){
                return res.json(err);
            }
            let r = Object.values(JSON.parse(JSON.stringify(result)))
            if(!r.length){
                return res.json("animal isn't exist");
            }
            return res.json(result)
            });
    }
    else{
        res.json("error id ")
    }
   });
app.post("/Animal", (req,res) => {
    
    str = "INSERT INTO Animals (name, species) VALUES ('";
    var str2 = "select id from Animals where name='"
    if (req.body.name == undefined){
        return res.json("error on name")
    }
    str+= req.body.name + "','";
    str2+=req.body.name+"' AND species='";
    if (req.body.species == undefined){
        return res.json("error on species")
    }
    str+= req.body.species  +"' );";
    str2+=req.body.species+"' ;";
    return connection.query(str2,str, function (err, result) {
        if (err){
            return res.json(err)  
        }
        var table = Object.values(JSON.parse(JSON.stringify(result)))
        if(table.length>0){
                return res.json("Animal is already created");
        }
        connection.query(str, function (err, result) {
        if (err){
           return res.json(err);
        }
            connection.query(str2, function (err, result) {
            if (err){
               return res.json(err);
            }   
                return res.json("The Person was created Successfully , the person id is: "+Object.values(JSON.parse(JSON.stringify(result)))[0].id);
            });
           
        });
       
    });
   });

app.post("/Animal/update", (req, res, next) => {
    if (req.body.id){
        str = "UPDATE Animals SET name = '"+req.body.newName+"' WHERE id ="+req.body.id+';';
        connection.query(str, function (err, result) {
            if (err){
                return res.json(err);
            }
            return res.json("updated animal")
            });
    }
    else {
        res.json("error id ")
    }

   });


app.get("/Memberships", (req, res) => {
    if (req.query.id){
        str = 'SELECT * FROM Memberships WHERE personId='+req.query.id+';';
        return connection.query(str, function (err, result) {
            if (err){
                return res.json(err);
            }
            let r = Object.values(JSON.parse(JSON.stringify(result)))
            if(!r.length){
                return res.json("Memberships doesn't exist");
            }
            return res.json(result)
            });
    }   
    else {
        res.json("error id ")
    }
   });

app.post("/Memberships", (req,res) => {
    str = "INSERT INTO Memberships (personId,animalId) VALUES ( "+ req.body.personId+"," + req.body.animalId+");"
    return connection.query(str, function(err, result) {
        if (err){
            return res.json(err);
        }  
        str = 'SELECT * FROM Memberships WHERE animalId='+req.body.animalId+';'; 
        connection.query(str, function(err, result) {
            if (err){
                return res.json(err);
            }  
            res.json("Membership was created Successfully");  
        });  
    });
    /*str = 'SELECT * FROM Memberships WHERE animalId='+req.body.animalId+';'; 
    connection.query(str, function (err, result)  {
        if (err){
            return res.json(err);
        }
        var q = Object.values(JSON.parse(JSON.stringify(result)))
     
        if(!q.length){
            str = "INSERT INTO Memberships (personId,animalId) VALUES ( "+ req.body.personId+"," + req.body.animalId+");"
                return connection.query(str, function(err, result) {
                    if (err){
                        return res.json(err);
                    }  
                    str = 'SELECT * FROM Memberships WHERE animalId='+req.body.animalId+';'; 
                    connection.query(str, function(err, result) {
                        if (err){
                            return res.json(err);
                        }  
                        res.json("Membership was created Successfully");  
                    });  
                });
               
        
        } 
        else {
            return res.json("The wanted membership exists");
        }
    });*/
 });
  


// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
