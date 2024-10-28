const express = require("express");
const morgan = require("morgan");
require("dotenv").config();

const sellerRoute = require("./src/routes/sellerRoute");

const app = express();

app.use(express.json());
app.use(morgan("combined"));
app.use("/api", sellerRoute);
app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use((req, res) => {
    res.status(404).json({message:"404 Not Found"});
});

app.listen(process.env.PORT, () => {
    console.log("Server is running 🚀");
})