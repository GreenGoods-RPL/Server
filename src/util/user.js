const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.findTransaction = async (transactionId, userId) => {
  const transaction = await prisma.transaction.findFirst({
    where: {
      id: parseInt(transactionId),
      userId: parseInt(userId),
    },
    include: {
      product: true,
    },
  });

  if (!transaction) {
    return res.status(404).json({
      message: `Transaction not found with id: ${transactionId}`,
    });
  }

  return transaction;
};

exports.increaseSellerIncome = async (transaction) => {
  await prisma.user.update({
    where: {
      id: transaction.product.sellerId,
    },
    data: {
      income: {
        increment: transaction.product.price,
      },
    },
  });
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
