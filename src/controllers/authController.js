const { PrismaClient } = require("@prisma/client");
const { generateJWTToken } = require("../util/auth");
const { hashPassword, comparePassword } = require("../util/auth");

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
      const hashedPassword = await hashPassword(password);

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
      const hashedPassword = await hashPassword(password);

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
      const isPasswordValid = await comparePassword(password, user.password);
      
      if (!user || !isPasswordValid) {
        return res.status(401).json({
          message: "email or password incorrect",
        });
      }

      const token = generateJWTToken(user.id, user.email);

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
