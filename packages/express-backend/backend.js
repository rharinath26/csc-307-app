// backend.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import "./services/user-service.js";
import userService from "./services/user-service.js";

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log("MongoDB connection error:", error));

const app = express();
const port = 8000;

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  if (name != undefined && job != undefined) {
    userService.findUserByNameAndJob(name, job)
    .then((users) => res.json({ users_list: users }))
    .catch((error) => res.status(500).send("Fetch error (findUserByNameAndJob)"));
  }
  else if (name != undefined && job == undefined) {
    userService.findUserByName(name)
    .then((users) => res.json({ users_list: users }))
    .catch((error) => res.status(500).send("Fetch error (findUserByName)"));
  } 
  else if (job != undefined && name == undefined) {
    userService.findUserByJob(job)
    .then((users) => res.json({ users_list: users }))
    .catch((error) => res.status(500).send("Fetch error (findUserByJob)"));
  }
  else {
    userService.getUsers()
    .then((users) => res.json({ users_list: users }))
    .catch((error) => res.status(500).send("Fetch error (getUsers)"));
  }
});

app.get("/users/:_id", (req, res) => {
  const id = req.params["_id"]; //or req.params.id
  userService.findUserById(id)
  .then ((user) => {
    if (!user) {
      res.status(404).send("Could not find target user ID");
    }
    else {
      res.json(user);
    }
  })
  .catch((error) => res.status(500).send("Fetch error (findUserById)"));
});

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  userService.addUser(userToAdd) //return new object
  .then ((user) => {
      res.status(201).json(user);
  })
  .catch((error) => res.status(500).send("Post error"));
});

app.delete("/users/:_id", (req, res) => {
  const id = req.params["_id"];
  userService.deleteUserById(id)
  .then ((user) => {
    if (!user) {
      res.status(404).send("Could not find ID of user to delete");
    }
    else {
      res.json(user);
    }
  })
  .catch((error) => res.status(500).send("Delete error"));
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});
