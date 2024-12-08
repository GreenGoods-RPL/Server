const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {
  validateStatusFlow,
  validateTransactionStatus,
  findTransaction,
} = require("../util/seller");

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
          purchaseDate: true,
          amount: true,
          status: true,
          user: {
            select: {
              username: true, // Fetch the customer's name
            },
          },
          product: {
            select: {
              name: true, // Fetch the product name
              price: true, // Fetch the product price
            },
          },
        },
      });

      // Calculate total price for each order
      const ordersWithTotalPrice = orders.map((order) => ({
        ...order,
        totalPrice: order.product.price * order.amount, // Add total price
      }));

      res.status(200).json(ordersWithTotalPrice);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  },

  getProductBySellerId: async (req, res) => {
    try {
      const { userId } = req.user;
      const product = await prisma.product.findMany({
        where: { sellerId: parseInt(userId) },
      });

      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve product" });
    }
  },

  updateTransactionStatus: async (req, res) => {
    try {
      const { transactionId, status } = req.body;

      // Fetch current transaction status
      const transaction = await findTransaction(transactionId);
      if (!transaction) {
        return res.status(404).json({
          message: "Transaction not found",
        });
      }

      // Validate status
      validateTransactionStatus(status);

      // Validate status transition
      validateStatusFlow(transaction.status, status);

      // Update transaction status
      const updatedTransaction = await prisma.transaction.update({
        where: {
          id: parseInt(transactionId),
        },
        data: {
          status: status,
        },
      });

      res.status(200).json(updatedTransaction);
    } catch (error) {
      if (error.statusCode) {
        // Custom validation error
        res.status(error.statusCode).json({
          message: error.message,
        });
      } else {
        // Unexpected error
        res.status(500).json({
          message: "Internal server error",
        });
      }
    }
  },
};

module.exports = sellerController;
