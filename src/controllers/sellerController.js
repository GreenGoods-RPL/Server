const { PrismaClient } = require("@prisma/client");
const { validateStatusFlow, validateTransactionStatus, findTransaction } = require("../util/seller");
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

  updateTransactionStatus: async (req, res) => {
    try {
      const { transactionId, status } = req.body;

      // Fetch current transaction status
      const transaction = await findTransaction(transactionId);
      // Validate status
      await validateTransactionStatus(status);
      // Validate status transition
      await validateStatusFlow(transaction.status, status);

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
      res.status(500).json({
        message: "Internal server error",
      });
    }
  },

  deliverOrder: async (req, res) => {
    try {
      const { transactionId } = req.body;

      // Fetch current transaction status
      const transaction = await findTransaction(transactionId);
      // Validate status transition
      await validateStatusFlow(transaction.status, status);

      // Update transaction status to DELIVERED
      const updatedTransaction = await prisma.transaction.update({
        where: {
          id: parseInt(transactionId),
        },
        data: {
          status: "DELIVERED",
        },
      });

      res.status(200).json(updatedTransaction);
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
      });
    }
  },
};

module.exports = sellerController;
