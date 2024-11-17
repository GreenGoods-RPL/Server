exports.validateTransactionStatus = async (status) => {
  const validStatuses = ["accepted", "rejected"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      message: "Invalid status",
    });
  }
};

exports.validateStatusFlow = async (currentStatus, status) => {
  // Validate status transitions
  if (currentStatus === "rejected" && status === "accepted") {
    return res.status(400).json({
      message: "Cannot accept a rejected transaction",
    });
  }

  if (
    currentStatus === "delivered" &&
    (status === "accepted" || status === "rejected")
  ) {
    return res.status(400).json({
      message: "Cannot change the status of a delivered transaction",
    });
  }

  // Validate status transition
  if (transaction.status === "rejected") {
    return res.status(400).json({
      message: "Cannot deliver a rejected transaction",
    });
  }
};

exports.findTransaction = async (transactionId) => {
  const transaction = await prisma.transaction.findUnique({
    where: {
      id: parseInt(transactionId),
    },
    select: {
      status: true,
    },
  });

  if (!transaction) {
    return res.status(404).json({
      message: "Transaction not found",
    });
  }

  return transaction
};
