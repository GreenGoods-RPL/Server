exports.validateTransactionStatus = async (status) => {
  const validStatuses = ["ACCEPTED", "REJECTED"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      message: "Invalid status",
    });
  }
};

exports.validateStatusFlow = async (currentStatus, status) => {
  // Validate status transitions
  if (currentStatus === "REJECTED" && status === "ACCEPTED") {
    return res.status(400).json({
      message: "Cannot accept a REJECTED transaction",
    });
  }

  if (
    currentStatus === "DELIVERED" &&
    (status === "ACCEPTED" || status === "REJECTED")
  ) {
    return res.status(400).json({
      message: "Cannot change the status of a DELIVERED transaction",
    });
  }

  // Validate status transition
  if (transaction.status === "REJECTED") {
    return res.status(400).json({
      message: "Cannot deliver a REJECTED transaction",
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
