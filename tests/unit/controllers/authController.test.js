const { PrismaClient } = require("@prisma/client");
const { generateJWTToken, hashPassword, comparePassword } = require("../../../src/util/auth");
const authController = require("../../../src/controllers/authController");

jest.mock("@prisma/client", () => {
  const prismaMock = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    seller: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    admin: {
      findUnique: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => prismaMock) };
});


jest.mock("../../../src/util/auth", () => ({
  generateJWTToken: jest.fn(),
  hashPassword: jest.fn(),
  comparePassword: jest.fn(),
}));

const prisma = new PrismaClient();

describe("authController", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("registerUser", () => {
    it("should return 409 if email is already in use", async () => {
      req.body = { email: "test@example.com", username: "testuser", password: "password123" };
      prisma.user.findUnique.mockResolvedValue({ email: "test@example.com" });

      await authController.registerUser(req, res);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: "test@example.com" } });
      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ message: "Email already in use" });
    });

    it("should create a new user and return 201", async () => {
      req.body = { email: "test@example.com", username: "testuser", password: "password123" };
      prisma.user.findUnique.mockResolvedValue(null);
      hashPassword.mockResolvedValue("hashed_password");
      prisma.user.create.mockResolvedValue({ id: 1 });

      await authController.registerUser(req, res);

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: "test@example.com",
          username: "testuser",
          password: "hashed_password",
        },
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: "User created with ID: 1" });
    });

    it("should handle internal server errors", async () => {
      req.body = { email: "test@example.com", username: "testuser", password: "password123" };
      prisma.user.findUnique.mockRejectedValue(new Error("Database error"));

      await authController.registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
    });
  });

  describe("registerSeller", () => {
    it("should return 409 if email is already in use", async () => {
      req.body = { email: "seller@example.com", username: "selleruser", password: "password123" };
      prisma.seller.findUnique.mockResolvedValue({ email: "seller@example.com" });

      await authController.registerSeller(req, res);

      expect(prisma.seller.findUnique).toHaveBeenCalledWith({ where: { email: "seller@example.com" } });
      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ message: "Email already in use" });
    });

    it("should create a new seller and return 201", async () => {
      req.body = { email: "seller@example.com", username: "selleruser", password: "password123" };
      prisma.seller.findUnique.mockResolvedValue(null);
      hashPassword.mockResolvedValue("hashed_password");
      prisma.seller.create.mockResolvedValue({ id: 2 });

      await authController.registerSeller(req, res);

      expect(prisma.seller.create).toHaveBeenCalledWith({
        data: {
          email: "seller@example.com",
          username: "selleruser",
          password: "hashed_password",
          reputation: 0,
          income: 0,
        },
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: "Seller created with ID: 2" });
    });

    it("should handle internal server errors", async () => {
      req.body = { email: "seller@example.com", username: "selleruser", password: "password123" };
      prisma.seller.findUnique.mockRejectedValue(new Error("Database error"));

      await authController.registerSeller(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
    });
  });

  describe("login", () => {
    it("should return 401 if email or password is incorrect", async () => {
      req.body = { email: "invalid@example.com", password: "wrongpassword" };
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.seller.findUnique.mockResolvedValue(null);
      prisma.admin.findUnique.mockResolvedValue(null);

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Email or password incorrect" });
    });

    it("should return 200 and a token if login is successful", async () => {
      req.body = { email: "user@example.com", password: "password123" };
      const user = { id: 1, email: "user@example.com", password: "hashed_password" };
      prisma.user.findUnique.mockResolvedValue(user);
      comparePassword.mockResolvedValue(true);
      generateJWTToken.mockReturnValue("mocked-token");

      await authController.login(req, res);

      expect(generateJWTToken).toHaveBeenCalledWith(1, "user@example.com");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        token: "mocked-token",
        message: "Login successful",
      });
    });

    it("should handle internal server errors", async () => {
      req.body = { email: "user@example.com", password: "password123" };
      prisma.user.findUnique.mockRejectedValue(new Error("Database error"));

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
    });
  });
});
