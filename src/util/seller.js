const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class ValidationError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = statusCode;
  }
}

exports.validateTransactionStatus = (status) => {
  const validStatuses = ["CONFIRMED", "REJECTED", "DELIVERED"];
  if (!validStatuses.includes(status)) {
    throw new ValidationError("Invalid status");
  }
};

exports.validateStatusFlow = (currentStatus, status) => {
  // Validate status transitions
  if (currentStatus === "REJECTED" && status === "CONFIRMED") {
    throw new ValidationError("Cannot accept a REJECTED transaction");
  }

  if (
    currentStatus === "DELIVERED" &&
    (status === "CONFIRMED" || status === "REJECTED")
  ) {
    throw new ValidationError(
      "Cannot change the status of a DELIVERED transaction"
    );
  }

  if (currentStatus === "REJECTED" && status === "DELIVERED") {
    throw new ValidationError("Cannot deliver a REJECTED transaction");
  }
};

exports.findTransaction = async (transactionId) => {
  const transaction = await prisma.transaction.findUnique({
    where: {
      id: parseInt(transactionId),
    },
  });

  if (!transaction) {
    throw new ValidationError("Transaction not found", 404);
  }

  return transaction;
};
