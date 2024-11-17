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

  //View Seller Orders
  viewOrders: async (req, res) => {
    try {
      const { userId } = req.user;

      // Verify seller exists
      const seller = await prisma.seller.findUnique({
        where: {
          id: parseInt(userId),
        },
      });

      if (!seller) {
        return res.status(404).json({
          message: "Seller with id 1 does not exist",
        });
      }

      // Get all orders for the seller's products
      const orders = await prisma.transaction.findMany({
        where: {
          product: {
            userId: parseInt(userId),
          },
        },
        select: {
          user_id: true,
          product_id: true,
          purchase_date: true,
          amount: true,
          status: true,
        },
      });

      res.status(200).json(orders);
    } catch (error) {
      res.status(404).json({
        message: "Seller with id 1 does not exist",
      });
    }
  },
};

module.exports = sellerController;