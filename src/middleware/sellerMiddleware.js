const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const sellerMiddleware = async (req, res, next) => {
  const { email } = req.user;
  
  try {
    const seller = await prisma.seller.findUnique({
      where: { email },
    });

    if (!seller) {
      return res.status(403).json({ message: 'Unauthorized Access' });
    }

    req.seller = seller; // Attach seller to request object
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

module.exports = sellerMiddleware;