import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect(
    "YOUR_Key"
  )
  .then(() => {
    console.log("MongoDB database connection established successfully");
  })
  .catch((err: any) => {
    console.log("MongoDB database connection failed: ", err.message);
  });

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

app.post("/api/users", async (req, res) => {
  const { username, password, email } = req.body;

  const newUser = new User({ username, password, email });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

app.get("/api/users", async (req, res) => {
  const { username, password } = req.query;

  try {
    const user = await User.findOne({ username, password });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(400).json({ message: "Invalid username or password" });
    }
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
