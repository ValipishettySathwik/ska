const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/RESPONSE", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected successfully to MongoDB"))
  .catch((error) => console.log("MongoDB connection error:", error));

app.use(express.json());
app.use(cors());

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", UserSchema);

const ListSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  name: { type: String, required: true },
  creationDate: { type: Date, default: Date.now },
  responseCodes: [{ type: Number, required: true }],
});

const List = mongoose.model("List", ListSchema);

app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).send({ message: "User created successfully" });
  } catch (error) {
    res.status(400).send({ error: "User already exists" });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).send({ error: "Invalid credentials" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).send({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, "secret", { expiresIn: "1h" });
    res.send({ token });
  } catch (error) {
    res.status(500).send({ error: "Internal server error" });
  }
});

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send({ error: "Unauthorized" });

  const token = authHeader.split(" ")[1];
  try {
    const { userId } = jwt.verify(token, "secret");
    req.userId = userId;
    next();
  } catch (error) {
    res.status(401).send({ error: "Unauthorized" });
  }
};

app.post("/lists", authMiddleware, async (req, res) => {
  const { name, responseCodes } = req.body;
  try {
    const list = new List({ userId: req.userId, name, responseCodes });
    await list.save();
    res.status(201).send(list);
  } catch (error) {
    res.status(400).send({ error: "Failed to create list" });
  }
});

app.get("/lists", authMiddleware, async (req, res) => {
  try {
    const lists = await List.find({ userId: req.userId });
    res.send(lists);
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch lists" });
  }
});

app.get("/lists/:id", authMiddleware, async (req, res) => {
  try {
    const list = await List.findOne({ _id: req.params.id, userId: req.userId });
    if (!list) return res.status(404).send({ error: "List not found" });
    res.send(list);
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch list" });
  }
});

app.delete("/lists/:id", authMiddleware, async (req, res) => {
  try {
    await List.deleteOne({ _id: req.params.id, userId: req.userId });
    res.send({ message: "List deleted successfully" });
  } catch (error) {
    res.status(500).send({ error: "Failed to delete list" });
  }
});

app.put("/lists/:id", authMiddleware, async (req, res) => {
  const { name, responseCodes } = req.body;
  try {
    const list = await List.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { name, responseCodes },
      { new: true },
    );
    res.send(list);
  } catch (error) {
    res.status(400).send({ error: "Failed to update list" });
  }
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
