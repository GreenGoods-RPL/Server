const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const reviewController = {
  getReviews: async (req, res) => {
    try {
      const { productId } = req.params;
      
      const reviews = await prisma.review.findMany({
        where: {
          productId: parseInt(productId)
        },
        include: {
          user: {
            select: {
              username: true // Include only the user's name
            }
          }
        }
      });
  

      if (!reviews) {
        return res.status(404).json({ message: "Course not found" });
      }

      // Format response 
      const response = {
        productId,
        reviews
      };

      return res.status(200).json(response);
    } catch (error) {
      console.error("Error getting reviews:", error);
      return res.status(500).json({ message: "Failed to get reviews" });
    }
  },

  createReview: async (req, res) => {
    try {
      const { productId, rating, comment } = req.body;
      const { userId } = req.user;
      console.log(productId, rating, comment);
      
  
      if (!productId || !rating || !comment) {
        return res.status(400).json({
          message: "Failed to create review",
          details: "Missing required fields",
        });
      }
  
      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          message: "Failed to create review",
          details: "Rating must be between 1 and 5",
        });
      }
  
      const newReview = await prisma.review.create({
        data: {
          productId: parseInt(productId),
          rating,
          comment,
          userId,
        },
      });
  
      const reviews = await prisma.review.findMany({
        where: { productId: parseInt(productId) },
        select: { rating: true },
      });
  
      const totalRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
      const avgRating = totalRatings / reviews.length;
  
      await prisma.product.update({
        where: { id: parseInt(productId) },
        data: { avg_rating: avgRating },
      });
  
      return res.status(201).json({
        message: `Successfully created new review with id:${newReview.id} on productId:${productId}`,
      });
    } catch (error) {
      console.error("Error creating review:", error);
      return res.status(400).json({ message: "Failed to create review" });
    }
  }
};

module.exports = reviewController;