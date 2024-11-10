const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

const productController = {
  registerUser: async (req, res) => {
    try {
      const { email, username, password } = req.body;

      //cek duplikasi email
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(409).json({
          message: "email already been used",
        });
      }

      //hash password agar privasi user terjaga
      const hashedPassword = await bcrypt.hash(password, 10);

      //Bikin user baru
      const newUser = await prisma.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
        },
      });

      res.status(200).json({
        message: `Successfully created new user with id: ${newUser.id}`,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
      });
    }
  },

  registerSeller: async (req, res) => {
    try {
      const { email, username, password } = req.body;

      //cek duplikasi email
      const existingSeller = await prisma.seller.findUnique({
        where: { email },
      });

      if (existingSeller) {
        return res.status(409).json({
          message: "email already been used",
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      //new seller
      const newSeller = await prisma.seller.create({
        data: {
          email,
          username,
          password: hashedPassword,
          reputation: 0,
          income: 0,
        },
      });

      res.status(200).json({
        message: `Successfully created new Seller with id: ${newSeller.id}`,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
      });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      //cek user existence
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(404).json({
          message: "user doesn't exist",
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        res.status(401).json({
          message: "password incorrect",
        });
      }

      //generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: `1h` }
      );

      res.status(200).json({
        Token: token,
        message: "login successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  },
};

module.exports = productController;
