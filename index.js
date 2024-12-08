require("dotenv").config();
require('module-alias/register')
const express = require("express");
const morgan = require("morgan");
const cron = require("node-cron");
const cors = require("cors");

const authRoute = require('@src/routes/authRoute');
const sellerRoute = require("./src/routes/sellerRoute");
const userRoute = require("./src/routes/userRoute");
const productRoute = require("./src/routes/productRoute");
const leaderboardRoutes = require("./src/routes/leaderboardRoute");
const reviewRoutes = require("./src/routes/reviewRoute");
const adminRoute = require("./src/routes/adminRoute");
const leaderboardController = require("./src/controllers/leaderboardController");

const PORT = process.env.PORT || 8008;

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
  credentials: true
}));

app.use(express.json());
app.use(morgan("combined"));

app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use("/api/seller", sellerRoute);
app.use('/api/admin', adminRoute);
app.use('/api/product', productRoute);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/review", reviewRoutes);

// CRON job for leaderboard
cron.schedule("0 0 28-31 * *", leaderboardController.processMonthlyLeaderboard);

app.use((req, res) => {
    res.status(404).json({message:"404 Not Found"});
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} 🚀`);
})