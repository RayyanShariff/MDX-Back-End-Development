const express=require("express");
const bodyParser=require("body-parser");
const path = require('path');

const app=express();
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname, 'public')));

const tasksArr=[];

app.get("/",function(req,res){
    res.render("index.ejs", {data:tasksArr});

})

app.post("/",function(req,res){
    const newTask=req.body.newTask;
    // res.render("index.ejs",{data:task});
    tasksArr.push(newTask);
    res.redirect("/"); //This will place a get request to the home route

});

app.listen(3000,function(req,res){
    console.log('Server is running on http://localhost:3000');
 })