const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const userController = {
  addAddress: async (req, res) => {
    try {
      const { userId } = req.user;
      
      //postalCode sesuai database
      const { street, city, country, postalCode } = req.body;

      // Verify user exists
      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
      });

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      // Create new address
      const newAddress = await prisma.address.create({
        data: {
          userId: parseInt(userId),
          street,
          city,
          country,
          //sesuaikan database
          postalCode,
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

  //View Transactions
  viewTransactions: async (req, res) => {
    try {
      const { userId } = req.user;

      // Verify user exists
      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
      });

      if (!user) {
        return res.status(404).json({
          message: "User with id 1 does not exist",
        });
      }

      // Get all transactions for user
      const transactions = await prisma.transaction.findMany({
        where: {
          userId: parseInt(userId),
        },
        select: {
          user_id: true,
          product_id: true,
          purchase_date: true,
          amount: true,
          status: true,
        },
      });

      res.status(200).json(transactions);
    } catch (error) {
      res.status(404).json({
        message: "User with id 1 does not exist",
      });
    }
  },
};

module.exports = userController;