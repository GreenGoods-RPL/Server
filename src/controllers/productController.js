const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const productController = {
  createProduct: async (req, res) => {
    try {
      const { name, price, description, green_score, certificates, stock } = req.body;
      const sellerId = req.seller.id;
  
      if (!sellerId) {
        return res.status(400).json({ error: "sellerId is required" });
      }

      if(green_score < 0 || green_score > 5) {
        return res.status(400).json({ error: "Green score must be between 0 and 5" });
      }
  
      const newProduct = await prisma.product.create({
        data: {
          name,
          price,
          description,
          green_score,
          certificates,
          stock,
          avg_rating: 0,
          status: "PENDING", // Explicitly set default status, if needed
          adminId: null,
          sellerId, // Include sellerId
        },
      });

      res.status(201).json(newProduct);
    } catch (error) {
      console.error(error); // Log the actual error for debugging
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
      const { keyword } = req.query;

      if (!keyword || keyword.trim() === "") {
        return res.status(400).json({ error: "Keyword is required for search" });
      }

      const products = await prisma.product.findMany({
        where: {
          status: "APPROVED", // Ensure only approved products are returned
          OR: [
            {
              name: {
                contains: keyword,
                mode: "insensitive", // Case-insensitive search
              },
            },
            {
              description: {
                contains: keyword,
                mode: "insensitive",
              },
            },
          ],
        },
      });

      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to search for products" });
    }
  },

  filterProducts: async (req, res) => {
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
      res.status(500).json({ error: "Failed to filter products" });
    }
  }
};

module.exports = productController;
