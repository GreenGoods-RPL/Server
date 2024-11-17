const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const reviewController = {
  // Get reviews for a specific product/course
  getReviews: async (req, res) => {
    try {
      const { productid } = req.params;
      
      const reviews = await prisma.course.findUnique({
        where: {
          id: parseInt(productid)
        },
        include: {
          reviews: {
            include: {
              reviewer: {
                select: {
                  name: true,
                  photoUrl: true
                }
              }
            }
          }
        }
      });

      if (!reviews) {
        return res.status(404).json({ message: "Course not found" });
      }

      // Format response 
      const response = {
        courseId: reviews.id,
        reviews: reviews.reviews.map(review => ({
          reviewId: review.id,
          reviewer: {
            name: review.reviewer.name,
            photoUrl: review.reviewer.photoUrl
          },
          rating: review.rating,
          comment: review.comment,
          date: review.createdAt.toISOString()
        }))
      };

      return res.status(200).json(response);
    } catch (error) {
      console.error("Error getting reviews:", error);
      return res.status(500).json({ message: "Failed to get reviews" });
    }
  },

  // Buat review baru
  createReview: async (req, res) => {
    try {
      // Check for authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { courseId, rating, comment } = req.body;

      // Validasi fields
      if (!courseId || !rating || !comment) {
        return res.status(400).json({ 
          message: "Failed to create review",
          details: "Missing required fields" 
        });
      }

      // Validasi rating untuk range 1-5
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ 
          message: "Failed to create review",
          details: "Rating must be between 1 and 5" 
        });
      }

      const newReview = await prisma.review.create({
        data: {
          courseId: parseInt(courseId),
          rating,
          comment,
          // You might want to get the reviewer ID from the token 
          reviewerId: 1 //Ini datang dari authenticated user
        }
      });

      return res.status(201).json({
        message: `Successfully create new review with id:${newReview.id} on courseid:${courseId}`
      });

    } catch (error) {
      console.error("Error creating review:", error);
      return res.status(400).json({ message: "Failed to create review" });
    }
  }
};

module.exports = reviewController;