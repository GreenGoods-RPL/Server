const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const productController = {
  createProduct: async (req, res) => {
    try {
      const { name, price, description, green_score, certificates, stock } = req.body;

      const newProduct = await prisma.product.create({
        data: {
          name,
          price,
          description,
          green_score,
          certificates,
          stock,
          avg_rating: 0,
          adminId: null
        },
      });
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({ error: "Failed to create product" });
    }
  },

  getProducts: async (req, res) => {
    try {
      const products = await prisma.product.findMany({
        where: {
          status: "APPROVED",
        },
      });
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve products" });
    }
  },

  getProductById: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await prisma.product.findUnique({
        where: { id: parseInt(id) },
      });

      if(!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      if (product) {
        res.status(200).json(product);
      } else {
        res.status(404).json({ error: "Product not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve product" });
    }
  },

  updateProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, price, description, green_score, certificates, stock } = req.body;
      const updatedProduct = await prisma.product.update({
        where: { id: parseInt(id) },
        data: {
          name,
          price,
          description,
          green_score,
          certificates,
          stock,
          avg_rating: 0,
        },
      });
      res.status(200).json(updatedProduct);
    } catch (error) {
      res.status(500).json({ error: "Failed to update product" });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;
      await prisma.product.delete({
        where: { id: parseInt(id) },
      });

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  },

  searchProducts: async (req, res) => {
    try {
      const { maxPrice, minPrice, rating, minEcoScore } = req.query;

      const products = await prisma.product.findMany({
        where: {
          price: {
            gte: parseFloat(minPrice) || undefined,
            lte: parseFloat(maxPrice) || undefined,
          },
          avg_rating: {
            gte: parseFloat(rating) || undefined,
          },
          green_score: {
            gte: parseFloat(minEcoScore) || undefined,
          },
        },
      });

      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to search products" });
    }
  }
};

module.exports = productController;
