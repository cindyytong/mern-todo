// setup the server
const express = require("express");
const app = express();
const dotenv = require("dotenv"); // setup mongodb connection
const mongoose = require("mongoose"); 

// import models 
const TodoTask = require("./TodoTask");

//app.listen(3000, () => console.log("Server up and running"));   //This is used for testing in the beginning but is replaced with mongoose.connect

dotenv.config();
app.use("/static", express.static("public")); // static allows us to use css files in public folder
app.use(express.urlencoded({ extended: true }));  // allow us to extract the data from the form by adding her to the body property of the request.


// setup mongodb 

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
    console.log("Connected to db!");
    app.listen(3000, () => console.log("Server Up and running via mongoose"));
});


// setup the embedded views
app.set("view engine", "ejs");



// routes 
app.get('/', (req, res) => {    // test it is running with send('hellow world')
    TodoTask.find({}, (err, tasks) => {
        res.render('todo.ejs', { todoTasks: tasks } ) // renders todo vide 
    })
})

app.post('/', async (req, res) => { // await can only be used in an async function
    const todoTask = new TodoTask({
        content: req.body.content
    });
    try{
        await todoTask.save();
        res.redirect('/');

    } catch(e){
        console.error(e.message);
        res.redirect('/')

    }
});

app
    .route("/edit/:id")
    .get((req, res) => {
        const id = req.params.id;
        TodoTask.find({}, (err, tasks) => {
            res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
        })
    })
    .post((req, res) => {
        const id = req.params.id;
        TodoTask.findByIdAndUpdate(id, {content: req.body.content}, err => {
            if(err) return res.send(500, err);
            res.redirect("/")
        });
    });

//UPDATE
app
.route("/edit/:id") // makes a new route 
.get((req, res) => {
    const id = req.params.id;
    TodoTask.find({}, (err, tasks) => {
    res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
});
})
.post((req, res) => {
const id = req.params.id;
TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
if (err) return res.send(500, err);
res.redirect("/");
});
});

// DELETE 
app
.route("/remove/:id")
.get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id, err => {
        if (err) {
            return res.send(500, err)
        };
        res.redirect("/");
    })
})
