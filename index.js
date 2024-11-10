const express = require("express");
const morgan = require("morgan");
require("dotenv").config();

const authRoute = require('./src/routes/authRoute');

const app = express();

app.use(express.json());
app.use(morgan("combined"));

app.use('/api/auth', authRoute);
app.use('/api/user', authRoute);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use((req, res) => {
    res.status(404).json({message:"404 Not Found"});
});

app.listen(process.env.PORT, () => {
    console.log("Server is running 🚀");
})