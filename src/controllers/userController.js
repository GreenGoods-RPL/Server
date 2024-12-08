const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { findTransaction, increaseSellerIncome, increaseUserPoints } = require("../util/user");

const userController = {
  viewProfile: async (req, res) => {
    try {
      const { userId } = req.user;

      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
        select: {
          id: false,
          username: true,
          email: true,
          points: true,
          password: false,
        },
      });

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error("Error:", error);
      res.status(400).json({
        message: "Failed to retrieve user profile",
      });
    }
  },

  getAddresses: async (req, res) => {
    try {
      const { userId } = req.user;

      const addresses = await prisma.address.findMany({
        where: {
          userId: parseInt(userId),
        },
        select: {
          id: true,
          street: true,
          city: true,
          country: true,
          postalCode: true,
        },
      });

      if (addresses.length === 0) {
        return res.status(404).json({
          message: "No addresses found for the user",
        });
      }

      res.status(200).json(addresses);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({
        message: "Failed to retrieve addresses",
      });
    }
  },

  getVouchers: async (req, res) => {
    try {
      const { userId } = req.user;

      // Fetch all vouchers for the user
      const vouchers = await prisma.voucher.findMany({
        where: {
          userId: parseInt(userId),
        },
        select: {
          id: true,
          code: true,
          createdAt: true,
          isRedeemed: true,
        },
      });

      if (vouchers.length === 0) {
        return res.status(404).json({
          message: "No vouchers found for the user",
        });
      }

      res.status(200).json(vouchers);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({
        message: "Failed to retrieve vouchers",
      });
    }
  },
  
  addAddress: async (req, res) => {
    try {
      const { userId } = req.user;
      const { street, city, country, postalCode } = req.body;

      await prisma.address.create({
        data: {
          userId: parseInt(userId),
          street,
          city,
          country,
          postalCode: parseInt(postalCode),
        },
      });

      res.status(200).json({
        message: `Successfully created address for user with id: ${userId}`,
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(400).json({
        message: "Failed to create new address",
      });
    }
  },

  //Delete Address
  deleteAddress: async (req, res) => {
    try {
      const { userId } = req.user;
      const { addressId } = req.params;

      //Verify address exists and belongs to user
      const address = await prisma.address.findFirst({
        where: {
          id: parseInt(addressId),
          userId: parseInt(userId),
        },
      });

      if (!address) {
        return res.status(404).json({
          message: `Address not found with id : ${addressId}`,
        });
      }

      //Delete address
      await prisma.address.delete({
        where: {
          id: parseInt(addressId),
        },
      });

      res.status(200).json({
        message: `Successfully deleted address with id: ${addressId}`,
      });
    } catch (error) {
      res.status(400).json({
        message: `Failed to delete address with id: ${addressId}`,
      });
    }
  },

  purchaseProduct: async (req, res) => {
    try {
      const { userId } = req.user;
      const { productId, amount } = req.body;
     
      const product = await prisma.product.findUnique({
        where: { id: parseInt(productId) },
      });

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      const newTransaction = await prisma.transaction.create({
        data: {
          userId: parseInt(userId),
          productId: parseInt(productId),
          amount: parseInt(amount),
          purchaseDate: new Date(),
          status: "PENDING",
        },
      });

      res.status(200).json({
        message: `Successfully purchased product with id: ${productId}`,
        transaction: newTransaction,
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(400).json({
        message: "Failed to purchase product",
      });
    }
  },

  //View Transactions
  viewTransactions: async (req, res) => {
    try {
      const { userId } = req.user;
      
      const transactions = await prisma.transaction.findMany({
        where: {
          userId: parseInt(userId),
        },
        select: {
          id: true,
          purchaseDate: true,
          amount: true,
          status: true,
          product: {
            select: {
              name: true,
              price: true,
            },
          },
        },
      });

      res.status(200).json(transactions);
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch transactions",
      });
    }
  },


  completeTransaction: async (req, res) => {
    try {
      const { userId } = req.user;
      const { transactionId } = req.params;
      
      // Verify transaction exists and belongs to user
      const transaction = await findTransaction(transactionId, userId);
      
      // Increase user points by 1
      await increaseUserPoints(userId);

      // Increase seller income by product price
      await increaseSellerIncome(transaction.productId, transaction.amount);

      // Update transaction status to finished
      await prisma.transaction.update({
        where: {
          id: parseInt(transactionId),
        },
        data: {
          status: "FINISHED",
        },
      });

      res.status(200).json({
        message: `Successfully completed transaction with id: ${transactionId}`,
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(400).json({
        message: `Failed to complete transaction`,
      });
    }
  },

  redeemVoucher: async (req, res) => {
    const { userId, code } = req.body;
  
    try {
      const voucher = await prisma.voucher.findFirst({
        where: { code, userId, isRedeemed: false },
      });
  
      if (!voucher) {
        return res.status(404).json({ error: "Voucher not found or already redeemed." });
      }
  
      if (new Date() > voucher.expiresAt) {
        return res.status(400).json({ error: "Voucher has expired." });
      }
  
      await prisma.voucher.update({
        where: { id: voucher.id },
        data: { isRedeemed: true },
      });
  
      res.json({ message: "Voucher redeemed successfully!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = userController;