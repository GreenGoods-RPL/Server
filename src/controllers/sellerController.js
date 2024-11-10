const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.viewProfile = async (req, res) => {
  const sellerId = req.params.sellerId;
  try {
    const seller = await prisma.seller.findUnique({
      where: { id: parseInt(sellerId) }, 
    });
    res.status(200).json({ data: seller });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// exports.viewOrders = async (req, res) => {
//   const sellerId = req.params.sellerId;
//   try {
//     const seller = await prisma.seller.findUnique({
//       where: {
//         id: sellerId,
//       },
//     });
//     res.status(200).json({ data: seller });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
