const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.findTransaction = async (transactionId, userId) => {
  const transaction = await prisma.transaction.findFirst({
    where: {
      id: parseInt(transactionId),
      userId: parseInt(userId),
    }
  });

  if (!transaction) {
    return res.status(404).json({
      message: `Transaction not found with id: ${transactionId}`,
    });
  }

  return transaction;
};

exports.increaseSellerIncome = async (productId, amount) => {
  console.log("ProductId::: ", productId);
  
  try {
    // Fetch the product details including the sellerId
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        sellerId: true,
        price: true,
      },
    });

    if (!product) {
      throw new Error("Product not found for the given transaction.");
    }

    // Update the seller's income by the product price
    await prisma.seller.update({
      where: {
        id: product.sellerId,
      },
      data: {
        income: {
          increment: product.price * amount,
        },
      },
    });

    console.log(`Seller income updated for sellerId: ${product.sellerId}`);
  } catch (error) {
    console.error("Error updating seller income:", error);
    throw new Error("Failed to update seller income.");
  }
};


exports.increaseUserPoints = async (userId) => {
  await prisma.user.update({
    where: {
      id: parseInt(userId),
    },
    data: {
      points: {
        increment: 1,
      },
    },
  });
};
