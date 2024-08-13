const express=require("express");
const app=express();
const bodyParser=require("body-parser");
const request=require("request");
const path = require('path');

//parse incoming request bodies. It allows you to access the data sent in the request body, such as form data or JSON data.
app.use(bodyParser.urlencoded({extended:true}));

//Serve static files from the "public" directory
//__dirname variable represents the current directory
app.use(express.static(path.join(__dirname, 'public')));

app.get("/",function(req,res){
    res.sendFile(__dirname + "/index.html");
})

app.post("/",function(req,res){
    var category=req.body.category;
    request(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`, function(error, response, body) {
        var categorybody=JSON.parse(response.body);
        var categoryarr = categorybody.meals;
        
        let mealList = `<div>${category}</div><ul>`;
        categoryarr.forEach((meal)=>{
            mealList += `<li>${meal.strMeal}</li>
                         <img src="${meal.strMealThumb}" alt="${meal.strMeal}" style="width:100px;height:100px;">`;
        });
        mealList += `</ul>`;
        res.send(mealList);

    });
});

app.listen(3000,function(req,res){
    console.log('Server is running on http://localhost:3000');
 })