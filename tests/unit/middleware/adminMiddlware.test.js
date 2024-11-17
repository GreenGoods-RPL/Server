const adminMiddleware = require("../../../src/middleware/adminMiddleware");

jest.mock("@prisma/client", () => {
  const prismaMock = {
    admin: { findUnique: jest.fn() },
  };
  return { PrismaClient: jest.fn(() => prismaMock) };
});

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

describe("Admin Middleware", () => {
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

  it("should return 403 if no admin is found", async () => {
    req.user.email = "not-an-admin@example.com";
    prisma.admin.findUnique.mockResolvedValue(null);

    await adminMiddleware(req, res, next);

    expect(prisma.admin.findUnique).toHaveBeenCalledWith({
      where: { email: "not-an-admin@example.com" },
    });
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized Access" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next and attach admin to req if admin is found", async () => {
    const adminData = { id: 1, email: "admin@example.com" };
    req.user.email = "admin@example.com";
    prisma.admin.findUnique.mockResolvedValue(adminData);

    await adminMiddleware(req, res, next);

    expect(prisma.admin.findUnique).toHaveBeenCalledWith({
      where: { email: "admin@example.com" },
    });
    expect(req.admin).toEqual(adminData);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("should return 500 if Prisma throws an error", async () => {
    req.user.email = "admin@example.com";
    prisma.admin.findUnique.mockRejectedValue(new Error("Database error"));

    await adminMiddleware(req, res, next);

    expect(prisma.admin.findUnique).toHaveBeenCalledWith({
      where: { email: "admin@example.com" },
    });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal server error",
      error: "Database error",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
