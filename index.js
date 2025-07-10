const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat.js");
const methodOverride = require("method-override");
const ExpressError = require("./ExpressError");

app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

main()
  .then(() => {
    console.log("MongoDB connection success");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/fakewhatsapp");
}

// Routes

app.get("/", (req, res) => {
  res.redirect("/chats");
});

app.get("/chats", async (req, res) => {
  let chatt = await Chat.find();
  res.render("index.ejs", { chatt });
});

app.get("/chats/new", (req, res) => {
  res.render("new.ejs");
});

app.post("/chats", async (req, res) => {
  try{
    let { from, to, message } = req.body;
  let newChat = new Chat({
    from,
    to,
    message,
    created_at: new Date(),
  });

  await newChat.save();
  res.redirect("/chats");
    } catch(err){
      next(err);
    }
});


app.get("/chats/:id/edit", async (req, res) => {
  let { id } = req.params;
  let chat = await Chat.findById(id);
  res.render("edit.ejs", { chat });
});

app.put("/chats/:id", async (req, res) => {
  let { id } = req.params;
  let { newMSg } = req.body;
  await Chat.findByIdAndUpdate(id, { message: newMSg });
  res.redirect("/chats");
});

app.delete("/chats/:id", async (req, res) => {
  let { id } = req.params;
  await Chat.findByIdAndDelete(id);
  if(!chat){
 throw new ExpressError (404, "page removed");

  }
  res.redirect("/chats");
});

// error handling middleware

app.use((err,req,res)=>{
  let {status = 500, message = "some error countered"}= err;
  res.status (status).send(message);
})

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

