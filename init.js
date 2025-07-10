const mongoose = require("mongoose");
const Chat = require("./models/chat");

main().then(()=>{
    console.log("connection success");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/fakewhatsapp");

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
let chats = [
  {
    from: "subha",
    to: "riya",
    message: "send the notes",
    created_at: new Date()
  },
  {
    from: "riya",
    to: "subha",
    message: "wait, I’ll send in 5 mins",
    created_at: new Date()
  },
  {
    from: "subha",
    to: "riya",
    message: "ok, no problem",
    created_at: new Date()
  },
  {
    from:"siyabn",
    to:"rishav",
    message:"your notes sent",
    created_at:new Date()
  }
];

Chat.insertMany(chats);


