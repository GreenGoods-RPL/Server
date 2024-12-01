const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { findProduct } = require("../util/admin");

const adminController = {
  //Get All New Products
  getAllNewProducts: async (req, res) => {
    try {
      // Get all products that haven't been reviewed by admin (admin_id is null)
      const newProducts = await prisma.product.findMany({
        where: {
          status: "PENDING",
        },
        select: {
          id: true,
          name: true,
          price: true,
          description: true,
          green_score: true,
          avg_rating: true,
          certificates: true,
          sellerId: true,
          status: true,
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
      const { userId } = req.user; 
      const { productId } = req.params;
      console.log("user ", req.user);
      console.log("admin id ", userId);
      

      // Find product
      await findProduct(productId);

      // Update product with admin approval
      await prisma.product.update({
        where: {
          id: parseInt(productId),
        },
        data: {
          adminId: userId,
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
      await findProduct(productId);

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