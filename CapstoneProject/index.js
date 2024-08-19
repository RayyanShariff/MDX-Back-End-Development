const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const path = require('path');
const request = require('request'); 

const app = express();
mongoose.connect("mongodb://localhost:27017/MyToDoListApp");

//A schema is a blueprint that defines the structure and properties of a document in a MongoDB collection. 
//Tasks collection
const taskSchema = new mongoose.Schema({
    task: String,
});

// Models provide an interface for interacting with the MongoDB (collection) associated with the schema, allowing you to perform CRUD operations on the document
// The name of the collection is Tasks
const Tasks = mongoose.model("Tasks", taskSchema);

//Lists collection
const listSchema = new mongoose.Schema({
    name: String, // Home Work Personal
    tasks: [taskSchema]
});

const List = mongoose.model("Lists", listSchema);



app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

app.get("/", function (req, res) {
    request(`https://api.open-meteo.com/v1/forecast?latitude=25.0772&longitude=55.3093&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m`, function(error, response, body) {
        if (error) {
            console.error(error);
            res.status(500).send('Error fetching weather data');
            return;
        }
        var weather = JSON.parse(body).current;
        res.render('home', { weather }); // Pass the weather data to the EJS template
    });
});

app.post("/", function (req, res) {
    const name = req.body.btn;
    console.log("listname from form " + name);
    res.redirect("/" + name);
});

app.get("/:customListName", async function (req, res) {
    const customListName = req.params.customListName;
    const result = await List.find({ name: customListName});
    if (result.length == 0) {
        const item = new List({
            name: customListName,
            tasks: []
        });
        item.save();
        res.redirect("/" + customListName);
    }else{
        res.render("list.ejs", { list: result, listName: customListName });
    }
});

app.post("/addTask", async function (req, res) {
    try{
        // Get the list name from the form submission
        const listName = req.body.list;
        console.log("listname from addTask ", listName);

        // The task to be added
        const task = req.body.task;

        // Creates a new task item
        const item = new Tasks({
            task: task
        });

        // Find the list by name using findOne, which returns a single document
        const result = await List.findOne({ name: listName });

        if (result) {
            // Add the task to the list
            result.tasks.push(item);

            // Save the updated list doucumnet
            await result.save();
            res.redirect("/" + listName);
        }else{
            console.log("List not found")
            res.status(404).send("List not found");
        }

    }catch(error){
        console.error("Error adding task: ", error);
        res.status(500).send("An error occurred adding task");
    }
});



app.listen(3000, function (req, res) {
    console.log('Server is running on http://localhost:3000');
});