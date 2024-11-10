const express = require("express");
const morgan = require("morgan");
require("dotenv").config();

const authRoute = require('./src/routes/authRoute');
const sellerRoute = require("./src/routes/sellerRoute");
const userRoute = require("./src/routes/userRoute");

const app = express();

app.use(express.json());
app.use(morgan("combined"));

app.use('/api/auth', authRoute);
app.use("/api/seller", sellerRoute);
app.use('/api/user', userRoute);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use((req, res) => {
    res.status(404).json({message:"404 Not Found"});
});

app.listen(process.env.PORT, () => {
    console.log("Server is running 🚀");
})