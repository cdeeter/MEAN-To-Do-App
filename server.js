//set up ================
var express = require("express");
var app = express();
var mongoose = require("mongoose");
var morgan = require("morgan"); //logs requests to the console (express4)
var bodyParser = require("body-parser"); //pulls info from HTML post (express4)
var methodOverride = require("method-override"); //simulate DELETE and PUT (express4)

//configuration =========
mongoose.connect("mongodb://node:nodeuser@mongo.onmodulus.net:27017/uwO3mypu");

app.use(express.static(__dirname + "/public")); //set the static files location /public/img will be /img for users
app.use(morgan("dev")); //log every request to the console
app.use(bodyParser.urlencoded({"extended": "true"})); //parse aplication/x-www-form-urlencoded
app.use(bodyParser.json()); //parse application/json
app.use(bodyParser.json({type: "application/vnd.api+json"})); //parse application/vnd.api+json
app.use(methodOverride());  

//define model ==========
var Todo = mongoose.model("Todo", {
    text: String,
    done: Boolean
});

//routes ================

    //api---------------------------------
    //get all todos
    app.get("api/todos", function(req, res) {
        //use mongoose to get all todos in the database
        Todo.find(function(err, todos) {
            if (err)
                res.send(err)
            res.json(todos); //return all todos in JSON format
        });
    });

    //create a todo and send back all todos after creation
    app.post("/api/todos", function(req, res) {
        //create a todo, informatino comes from AJAX request from Angular
        Todo.create({
            text: req.body.text,
            done: false
        }, function(err, todo) {
            if (err) 
                res.send(err);
            
            Todo.find(function(err, todos) {
                if (err)
                    res.send(err)
                res.json(todos);
            });
        });
    });

    //update todo if done
    app.put("/api/todos/:todo_id/:todo_completed", function(req, res) {
        Todo.findById(req.params.todo_id, function(err, todo) {
            todo.update({
                done: req.params.todo_completed
            }, function(err, todo) {
                if (err) 
                    res.send(err);

                Todo.find(function(err, todos) {
                    if (err)
                        res.send(err)
                    res.json(todos);
                });
            });
        });
    });
            

    //delete a todo
    app.delete("/api/todos/:todo_id", function(req, res) {
        Todo.remove({
            _id: req.params.todo_id
        }, function(err, todo) {
            if (err)
                res.send(err);
            
            Todo.find(function(err, todos) {
                if (err) 
                    res.send(err)
                res.json(todos);
            });
        });
    });

//application --------------------------
app.get("", function(req, res) {
    res.sendfile("./public/index.html"); //load the single view file 
});

//listen (start app with node server.js)
app.listen(8080);
console.log("App listening on port 8080");
