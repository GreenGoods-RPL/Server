const { PrismaClient } = require("@prisma/client");
const { generateJWTToken } = require("../util/auth");
const { hashPassword, comparePassword } = require("../util/auth");

const prisma = new PrismaClient();

const authController = {
  registerUser: async (req, res) => {
    try {
      const { email, username, password } = req.body;

      // Check for duplicate email
      const existingUser = await prisma.user.findUnique({ where: { email } });

      if (existingUser) {
        return res.status(409).json({ message: "Email already in use" });
      }

      // Hash password for user privacy
      const hashedPassword = await hashPassword(password);

      // Create new user
      const newUser = await prisma.user.create({
        data: { email, username, password: hashedPassword },
      });

      res.status(201).json({ message: `User created with ID: ${newUser.id}` });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  registerSeller: async (req, res) => {
    try {
      const { email, username, password } = req.body;

      // Check for duplicate email
      const existingSeller = await prisma.seller.findUnique({ where: { email } });

      if (existingSeller) {
        return res.status(409).json({ message: "Email already in use" });
      }

      // Hash password for seller privacy
      const hashedPassword = await hashPassword(password);

      // Create new seller
      const newSeller = await prisma.seller.create({
        data: { email, username, password: hashedPassword, reputation: 0, income: 0 },
      });

      res.status(201).json({ message: `Seller created with ID: ${newSeller.id}` });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Check user existence
      let user = await prisma.user.findUnique({ where: { email } }) ||
                 await prisma.seller.findUnique({ where: { email } }) ||
                 await prisma.admin.findUnique({ where: { email } });

      if (!user || !(await comparePassword(password, user.password))) {
        return res.status(401).json({ message: "Email or password incorrect" });
      }

      const token = generateJWTToken(user.id, user.email);

      res.status(200).json({ token, message: "Login successful" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = authController;
