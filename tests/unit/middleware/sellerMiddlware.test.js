const sellerMiddleware = require("../../../src/middleware/sellerMiddleware");

jest.mock("@prisma/client", () => {
  const prismaMock = {
    seller: { findUnique: jest.fn() },
  };
  return { PrismaClient: jest.fn(() => prismaMock) };
});

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

describe("Seller Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = { user: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 403 if no seller is found", async () => {
    req.user.email = "not-a-seller@example.com";
    prisma.seller.findUnique.mockResolvedValue(null);

    await sellerMiddleware(req, res, next);

    expect(prisma.seller.findUnique).toHaveBeenCalledWith({
      where: { email: "not-a-seller@example.com" },
    });
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized Access" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next and attach seller to req if seller is found", async () => {
    const sellerData = { id: 2, email: "seller@example.com" };
    req.user.email = "seller@example.com";
    prisma.seller.findUnique.mockResolvedValue(sellerData);

    await sellerMiddleware(req, res, next);

    expect(prisma.seller.findUnique).toHaveBeenCalledWith({
      where: { email: "seller@example.com" },
    });
    expect(req.seller).toEqual(sellerData);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("should return 500 if Prisma throws an error", async () => {
    req.user.email = "seller@example.com";
    prisma.seller.findUnique.mockRejectedValue(new Error("Database error"));

    await sellerMiddleware(req, res, next);

    expect(prisma.seller.findUnique).toHaveBeenCalledWith({
      where: { email: "seller@example.com" },
    });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal server error",
      error: "Database error",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
