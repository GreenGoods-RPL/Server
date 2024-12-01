const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const adminController = require("../../../src/controllers/adminController");

jest.mock("@prisma/client", () => {
  const mockPrisma = {
    product: {
      findMany: jest.fn(),
      update: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mockPrisma),
  };
});

const mockPrisma = new PrismaClient();

describe("Admin Controller", () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {
      user: { adminId: 1 },
      params: { productId: "1" },
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("getAllNewProducts", () => {
    it("should return all new products", async () => {
      const mockProducts = [
        {
          product_id: 1,
          name: "Product A",
          price: 100,
          description: "Description A",
          green_score: 90,
          avg_rating: 4.5,
          certificates: ["Cert A"],
          sellerId: 2,
          status: "PENDING",
        },
      ];
      mockPrisma.product.findMany.mockResolvedValue(mockProducts);

      await adminController.getAllNewProducts(mockReq, mockRes);

      expect(mockPrisma.product.findMany).toHaveBeenCalledWith({
        where: { status: "PENDING" },
        select: {
          product_id: true,
          name: true,
          price: true,
          description: true,
          green_score: true,
          avg_rating: true,
          certificates: true,
          sellerId: true,
          status: true,
        },
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockProducts);
    });

    it("should handle errors", async () => {
      mockPrisma.product.findMany.mockRejectedValue(new Error("Database error"));

      await adminController.getAllNewProducts(mockReq, mockRes);

      expect(mockPrisma.product.findMany).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Internal server error",
      });
    });
  });

  describe("acceptNewProduct", () => {
    it("should accept a new product", async () => {
      mockPrisma.product.update.mockResolvedValue({});

      await adminController.acceptNewProduct(mockReq, mockRes);

      expect(mockPrisma.product.update).toHaveBeenCalledWith({
        where: { id: parseInt(mockReq.params.productId, 10) },
        data: { adminId: mockReq.user.adminId, status: "APPROVED" },
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: `Successfully accepted product with id: ${mockReq.params.productId}`,
      });
    });

    it("should handle errors when accepting a product", async () => {
      mockPrisma.product.update.mockRejectedValue(new Error("Database error"));

      await adminController.acceptNewProduct(mockReq, mockRes);

      expect(mockPrisma.product.update).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Internal server error while accepting the product",
      });
    });
  });

  describe("rejectNewProduct", () => {
    it("should reject a new product", async () => {
      mockPrisma.product.update.mockResolvedValue({});

      await adminController.rejectNewProduct(mockReq, mockRes);

      expect(mockPrisma.product.update).toHaveBeenCalledWith({
        where: { id: parseInt(mockReq.params.productId, 10) },
        data: { status: "REJECTED" },
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: `Successfully rejected product with id: ${mockReq.params.productId}`,
      });
    });

    it("should handle errors when rejecting a product", async () => {
      mockPrisma.product.update.mockRejectedValue(new Error("Database error"));

      await adminController.rejectNewProduct(mockReq, mockRes);

      expect(mockPrisma.product.update).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Internal server error while rejecting the product",
      });
    });
  });
});
