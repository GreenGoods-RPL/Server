const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const sellerController = {
  viewProfile: async (req, res) => {
    try {
      const { userId } = req.user;

      // Find seller by ID
      const seller = await prisma.seller.findUnique({
        where: {
          id: parseInt(userId),
        },
        select: {
          id: true,
          username: true,
          email: true,
          password: false,
          reputation: true,
          income: true,
        },
      });

      res.status(200).json(seller);
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
      });
    }
  },

  viewOrders: async (req, res) => {
    try {
      const { userId } = req.user;

      // Get all transactions for the seller's products
      const orders = await prisma.transaction.findMany({
        where: {
          product: {
            sellerId: parseInt(userId),
          },
        },
        select: {
          id: true,
          userId: true,
          productId: true,
          purchaseDate: true,
          amount: true,
          status: true,
          product: {
            select: {
              sellerId: true,
            },
          },
        },
      });

      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
      });
    }
  },
};

module.exports = sellerController;
