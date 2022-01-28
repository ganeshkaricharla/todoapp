const express = require("express")
const bodyParser = require("body-parser");
const mongoose = require("mongoose")


const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"))
app.set("view engine","ejs");

mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true});

const itemsSchema = {
    name: String
}

const Item = mongoose.model("item",itemsSchema);

const item1 = new Item({
    name:"Hello" 
})

app.get("/",function(req,res) {

    Item.find({}, function(err, foundItems){
        if(foundItems.length == 0) {
            Item.insertMany([item1],function(err){
                if(err){
                    console.log(err)
                }else{
                    console.log("succesful.")
                }
            });
            res.redirect("/");
        } else{
            res.render('list',{todoTasks:foundItems});
        }
    })
    
    
})

app.post("/delete",function(req,res){
    const text = req.body.checkbox;
    Item.findByIdAndRemove(text,function(err) {
        if(!err) {
            console.log("Succesfully deleted");
            res.redirect("/");
        }
    });
    
})
app.post("/",function(req,res) {
    var text = req.body.inputTask;
    const item = new Item({
        name:text
    });
    item.save();
    res.redirect("/")
}) 

app.listen(3000,function() {
    console.log("Server up and running");
})