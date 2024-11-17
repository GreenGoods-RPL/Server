const { PrismaClient } = require("@prisma/client");
const { v4: uuidv4 } = require("uuid");
const prisma = new PrismaClient();

const leaderboardController = {
  processMonthlyLeaderboard: async () => {
    try {
      const today = new Date();
      const lastDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0
      );

      if (today.getDate() === lastDayOfMonth.getDate()) {
        console.log("Processing monthly leaderboard...");

        // Get top 3 users
        const topUsers = await prisma.user.findMany({
          orderBy: { points: "desc" },
          take: 3,
        });

        for (const user of topUsers) {
          const voucherCode = uuidv4();

          // Create a voucher for each top user
          await prisma.voucher.create({
            data: {
              code: voucherCode,
              userId: user.id,
              expiresAt: new Date(today.setMonth(today.getMonth() + 1)), // Expires in 1 month
            },
          });

          console.log(`Voucher awarded to ${user.name}: ${voucherCode}`);
        }

        // Reset user points
        await prisma.user.updateMany({
          data: { points: 0 },
        });

        console.log("Leaderboard processing complete!");
      }
    } catch (error) {
      console.error("Error processing leaderboard:", error.message);
    }
  },

  getLeaderboard: async (req, res) => {
    try {
      const leaderboard = await prisma.user.findMany({
        orderBy: { points: "desc" },
        take: 10, // Top 10 users
      });
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = leaderboardController;