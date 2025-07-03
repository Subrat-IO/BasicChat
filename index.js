const express = require ("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat.js");
const { publicDecrypt } = require("crypto");
const { cpSync } = require("fs");
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,"public")))
app.use(express.urlencoded({extended:true}));


app.set("view engine", "ejs");

// getting-started.js
main().then(()=>{
    console.log("connection success");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

let chat1 = new Chat  ({
    from:"subha",
    to:"riya",
    message:"send the notes",
    created_at: new Date()

})


//index route
app.get("/chats",async (req,res)=>{
let chatt = await Chat.find();
console.log(chatt);
res.render("index.ejs",{chatt});
});

// create new route
app.post("/chats",(req,res)=>{
    let {from,to,message} = req.body
    let newchat = new Chat({
      from:from,
      to:to,
      message:message,
      created_at: new Date()  
    }) ;

   newchat.save()
   .then(res =>{console.log("chat was saved")
    
   })
   .catch((err)=>{
    console.log(err)
   });
res.redirect("/chats");
});


app.get("/",(req,res) => {
    res.send("root is fully working");
})


// edit


// new route
app.get("/chats/new",(req,res)=>{
    res.render("new.ejs")
})
app.get("/chats/:id/edit", async(req,res) => {
    let {id} = req.params;

    let chat = await Chat.findById(id);
    res.render("edit.ejs",{chat});
})

// update route 
app.put("/chats/:id",async (req,res)=>{
    let {id} =  req.params;
    let {newMSg} = req.body;
    let updatechat = await Chat.findByIdAndUpdate(id,{message:newMSg},{runValidators:true, new:true});
    console.log(updatechat);
    res.redirect("/chats");
})

app.delete("/chats/:id", async(req,res)=>{
    let {id} = req.params;
    let DeletedChat = await Chat.findByIdAndDelete(id);
    console.log(DeletedChat);
    res.redirect("/chats");
})
app.get("/chats", async (req, res) => {
  let chatt = await Chat.find();
  res.render("index.ejs", { chatt });  // ✅ MATCHES FILE NAME
});

app.listen(8080,()=>{
    console.log("server is listening at 8080")
})
