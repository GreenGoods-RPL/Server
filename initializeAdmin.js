const { PrismaClient } = require("@prisma/client");
const { hashPassword } = require("./src/util/auth");

const prisma = new PrismaClient();

const initializeAdmin = async () => {
  console.log("Initializing admin user...");

  try {
    // If no admin exists, create one
    const adminPassword = await hashPassword("admin"); // Default password, ask admin to change it
    const admin = await prisma.admin.create({
      data: {
        email: "admin@main.com", // Default admin email
        password: adminPassword,
      },
    });
    console.log("Admin user created:", admin.email);
  } catch (error) {
    console.error("Error initializing admin:", error);
  } finally {
    await prisma.$disconnect();
  }
};

initializeAdmin();
