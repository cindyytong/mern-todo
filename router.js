const express = require('express');
const router = express.Router();

// app.use("/static", express.static("public")); // static allows us to use css files in public folder
// app.use(express.urlencoded({ extended: true }));  // allow us to extract the data from the form by adding her to the body property of the request.


// routes 
router.get('/', (req, res) => {    // test it is running with send('hellow world')
    TodoTask.find({}, (err, tasks) => {
        res.render('todo.ejs', { todoTasks: tasks } ) // renders todo vide 
    })
})

router.post('/', async (req, res) => { // await can only be used in an async function
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

router
    .route("/edit/:ed")
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
router
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



module.exports = router