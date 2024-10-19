const express = require("express");
const morgan = require("morgan");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(morgan("combined"));
app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use((req, res) => {
    res.status(404).json({message:"404 Not Found"});
});

app.listen(8008, () => {
    console.log("Server has started 🚀");
})