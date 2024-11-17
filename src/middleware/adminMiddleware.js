const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const adminMiddleware = async (req, res, next) => {
  const { email } = req.user;
  
  try {
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      return res.status(403).json({ message: 'Unauthorized Access' });
    }

    req.admin = admin; // Attach admin to request object
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

module.exports = adminMiddleware;