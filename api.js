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

app.use(express.json());
var str,str2;
//connect to the sql DB
connection.connect(function(err) {
    if (err) {
        return err;
    }
    console.log("Connected!");
  });

  //Home page
app.get('/', (req, res) => {
    res.send("Hello it's my Api!");
  });
//retrieve person by id 
app.get("/Person", (req, res) => {
    if(req.query.id){
        str = 'SELECT * FROM Persons WHERE id='+req.query.id+';';
        return connection.query(str, function (err, result) {
        if (err){
            //error
            return res.json(err);
        }

        let r = Object.values(JSON.parse(JSON.stringify(result)))
        if(!r.length){
            //the person doesnt exist in DB
            return res.json("person with id: " + req.query.id + " doesn’t exist");
        }
        //the person  exist in DB
        return res.json(result)
        });
    }
    else{
        //error in query id 
        res.json("The given field isn’t available .Please use 'id' as identifier ")
    }
   });


   //create person by json 
app.post("/Person", (req,res) => {
    str = "INSERT INTO Persons (firstName,lastName,phoneNumber,city,country) VALUES ( '" ;
    var str2 = "select id from Persons where firstName='"
    // check validation
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
    //check if the person exist in DB by the data
    connection.query(str2,str, function (err, result) {
        if (err){
            return res.json(err)  
        }
        var table = Object.values(JSON.parse(JSON.stringify(result)))
        if(table.length>0){
                // the person was created already
                return res.json("Person is already created the person id is: "+Object.values(JSON.parse(JSON.stringify(table)))[0].id);
        }
        // it's new person so we create it and eneter to DB
        connection.query(str, function (err, result) {
        if (err){
            //ERROR
           return res.json(err);
        }
            // return  the id of the new person 
            connection.query(str2, function (err, result) {
            if (err){
               return res.json(err);
            }   
                return res.json("created person, the id is: "+Object.values(JSON.parse(JSON.stringify(result)))[0].id);
            });
           
        });
       
    });
            
   });
    
   // delete person by id  
app.delete("/Person", (req, res, next) => {
    if(req.query.id){
        str = 'DELETE FROM Persons WHERE id ='+req.query.id+';';
        connection.query(str, function (err, result) {
            if (err){
                //error
                return res.json(err);
            }
                return res.json("Person was deleted Successfully");
            });
       }
    else{
         //error in query id 
        res.json("The given field isn’t available .Please use 'id' as identifier ")
    }
   });

// retreive animal by id 
app.get("/Animal", (req, res) => {
    if(req.query.id){
        str = 'SELECT * FROM Animals WHERE id='+req.query.id+';';
        connection.query(str, function (err, result) {
            if (err){
                //error
                return res.json(err);
            }
            let r = Object.values(JSON.parse(JSON.stringify(result)))
            if(!r.length){
                 //the Animal doesn’t exists in DB
                return res.json("Animal with id: " + req.query.id + " doesn’t exist");
            }
            //the Animal exists in DB
            return res.json(result)
            });
    }
    else{
        //error in query id 
        res.json("The given field isn’t available .Please use 'id' as identifier ")
    }
   });

// create animal 
app.post("/Animal", (req,res) => {
    str = "INSERT INTO Animals (name, species) VALUES ('";
    str2 = "select id from Animals where name='"
    // check validation
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
 //check if the Animal exist in DB by the data
    return connection.query(str2,str, function (err, result) {
        if (err){
            //error
            return res.json(err)  
        }
        var table = Object.values(JSON.parse(JSON.stringify(result)))
        if(table.length>0){
                // the animal was created already
                return res.json("Animal is already created the animal id is: "+Object.values(JSON.parse(JSON.stringify(table)))[0].id);
        }
         // it's new Animal so we create it and eneter to DB
        connection.query(str, function (err, result) {
        if (err){
           return res.json(err);
        }
        // return  the id of the new animal
            connection.query(str2, function (err, result) {
            if (err){
               return res.json(err);
            }   
                return res.json("The Animal was created Successfully , the Animal id is: "+Object.values(JSON.parse(JSON.stringify(result)))[0].id);
            });
           
        });
       
    });
   });


   // update name of animal
app.post("/Animal/update", (req, res, next) => {
    if (req.body.id){
        str = "UPDATE Animals SET name = '"+req.body.newName+"' WHERE id ="+req.body.id+';';
        connection.query(str, function (err, result) {
            if (err){
                //error
                return res.json(err);
            }
            return res.json("Animal was updated Successfully")
            });
    }
    else {
        //error in query id 
        res.json("The given field isn’t available .Please use 'id' as identifier ")
    }

   });

// retrive the membership by person id
app.get("/Memberships", (req, res) => {
    if (req.query.id){
        str = 'SELECT * FROM Memberships WHERE personId='+req.query.id+';';
        return connection.query(str, function (err, result) {
            if (err){
                //error
                return res.json(err);
            }
            let r = Object.values(JSON.parse(JSON.stringify(result)))
            if(!r.length){
                //the membership doesn’t exists in DB
                return res.json("Memberships doesn't exist");
            }
            return res.json(result)
            });
    }   
    else {
        //error in query id 
        res.json("The given field isn’t available .Please use 'id' as identifier ")
    }
   });
// create the membership by person id and animal id
app.post("/Memberships", (req,res) => {
    if ((req.body.personId)&&(req.body.animalId)){
         str = "INSERT INTO Memberships (personId,animalId) VALUES ( "+ req.body.personId+"," + req.body.animalId+");"
        return connection.query(str, function(err, result) {
        if (err){
            //error
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
        //error in query id 
        res.json("The given fields aren't available .Please use 'personId' for person and  'animalId' for animal id as identifier ")
    }
 });
  
// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
