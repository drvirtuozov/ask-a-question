import mongoose from "mongoose";

const db = mongoose.connection;

mongoose.connect("mongodb://admin:admin@ds011168.mongolab.com:11168/ask-a-question");

db.on("error", err => {
  console.log("Connection error:", err);
});

db.once("open", () => {
  console.log("We're connected!");
});

export default db;