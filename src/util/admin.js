const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.findProduct = async (productId) => {
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
};