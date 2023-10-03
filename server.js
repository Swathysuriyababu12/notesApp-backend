const path = require("path");
const express = require("express");
const dotenv = require("dotenv").config();
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");
const cors = require("cors");

connectDB();

const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/notes", require("./routes/noteRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
