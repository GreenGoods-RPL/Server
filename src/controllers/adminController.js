const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const adminController = {
  //Get All New Products
  getAllNewProducts: async (req, res) => {
    try {
      // Get all products that haven't been reviewed by admin (admin_id is null)
      const newProducts = await prisma.product.findMany({
        where: {
          admin_id: null,
        },
        select: {
          product_id: true,
          name: true,
          price: true,
          description: true,
          eco_score: true,
          avg_rating: true,
          certificates: true,
          admin_id: true,
          seller_id: true,
        },
      });

      res.status(200).json(newProducts);
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
      });
    }
  },

  //Accept New Product
  acceptNewProduct: async (req, res) => {
    try {
      const { productId } = req.params;
      const { adminId } = req.body; // Assuming we get adminId from authenticated session

      // Find product
      const product = await prisma.product.findUnique({
        where: {
          id: parseInt(productId),
        },
      });

      if (!product) {
        return res.status(404).json({
          message: "Failed to accept product with id: 1",
        });
      }

      // Update product with admin approval
      await prisma.product.update({
        where: {
          id: parseInt(productId),
        },
        data: {
          admin_id: adminId,
          status: "APPROVED",
        },
      });

      res.status(200).json({
        message: `Successfully accepted product with id: ${productId}`,
      });
    } catch (error) {
      res.status(400).json({
        message: "Failed to accept product with id: 1",
      });
    }
  },

  //Reject New Product
  rejectNewProduct: async (req, res) => {
    try {
      const { productId } = req.params;

      // Find product
      const product = await prisma.product.findUnique({
        where: {
          id: parseInt(productId),
        },
      });

      if (!product) {
        return res.status(404).json({
          message: "Failed to reject product with id: 1",
        });
      }

      // Delete or mark product as rejected
      await prisma.product.update({
        where: {
          id: parseInt(productId),
        },
        data: {
          status: "REJECTED",
        },
      });

      res.status(200).json({
        message: `Successfully rejected product with id: ${productId}`,
      });
    } catch (error) {
      res.status(400).json({
        message: "Failed to reject product with id: 1",
      });
    }
  },
};

module.exports = adminController;