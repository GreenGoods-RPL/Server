// init
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

const productController = {

    registerUser : async (req,res) => {
        try {
            const {email, username, password}=req.body;

            //cek duplikasi email
            const existingUser = await prisma.user.findUnique({
                where : {email}
            });

            if(existingUser){
                return res.status(409).json({
                    message : "email already been used"
                });
            }

            //hash password agar privasi user terjaga
            const hashedPassword = await bcrypt.hash(password, 10);

            //Bikin user baru
            const newUser = await prisma.user.create({
                data : {
                    email,
                    username,
                    password : hashedPassword
                }
            });

            res.status(200).json({
                message : `Successfully created new user with id: ${newUser.id}`
            });
        } catch (error){
            res.status(500).json({
                message:"Internal server error"
            });
        }
    },

    registerSeller: async (req,res) => {
        try {
            const {email, username, password } = req.body;

            //cek duplikasi email
            const existingSeller = await prisma.seller.findUnique({
                where : {email}
            });

            if(existingSeller){
                return res.status(409).json({
                    message: "email already been used"
                });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            
            //new seller
            const newSeller = await prisma.seller.create({
                data : {
                    email,
                    username,
                    password: hashedPassword,
                    reputation: 0,
                    income: 0
                }
            });

            res.status(200).json({
                message : `Successfully created new Seller with id: ${newSeller.id}`
            });
        }catch(error){
            res.status(500).json({
                message : "Internal server error"
            });
        }
    },

    login: async(req, res) => {
        const {email, password}=req.body;
        try {
            

            //cek user existence
            const user = await prisma.user.findUnique({
                where : {email}
            });

            if(!user){
                return res.status(404).json({
                    message : "user doesn't exist"
                });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if(!isPasswordValid){
                res.status(401).json({
                    message: "password incorrect"
                })
            };

            //generate JWT token
            const token = jwt.sign(
                {id: user.id, email: user.email},
                process.env.JWT_SECRET,
                {expiresIn: `1h`}
            );

            res.status(200).json({
                Token: token,
                message: "login successfully"
            });
        }catch(error){
            console.log(error);
            res.status(500).json({
                message : "Internal server error"
            });
        }
    },

    addAddress: async (req, res) => {
        try {
            const { userId } = req.params;
            //postalCode sesuai database
            const { street, city, country, postalCode } = req.body;

            // Verify user exists
            const user = await prisma.user.findUnique({
                where: { id: parseInt(userId) }
            });

            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            // Create new address
            const newAddress = await prisma.address.create({
                data: {
                    userId: parseInt(userId),
                    street,
                    city,
                    country,
                    //sesuaikan database
                    postalCode
                }
            });

            res.status(200).json({
                message: `Successfully created address for user with id: ${userId}`
            });
        } catch (error) {
            console.error("Error:", error); 
            res.status(400).json({
                message: "Failed to create new address"
            });
        }
    },

    //Delete Address
    deleteAddress: async(req,res) => {
        console.log("Delete address request received");
        try {
            const {userId,addressId} = req.params;

            //Verify address exists and belongs to user
            const address = await prisma.address.findFirst({
                where : {
                    id : parseInt(addressId),
                    userId : parseInt(userId)
                }
            });

            if(!address){
                return res.status(404).json({
                    message : `Failed to delete address with id : ${addressId}`
                });
            }

            //Delete address
            await prisma.address.delete({
                where: {
                    id: parseInt(addressId)
                }
            });

            res.status(200).json({
                message: `Successfully deleted address with id: ${addressId}`
            });
        }catch(error){
            res.status(400).json({
                message: `Failed to delete address with id: ${addressId}`
            });
        }
    },

    //View Transactions
    viewTransactions: async (req, res) => {
        try {
            const { userId } = req.params;

            // Verify user exists
            const user = await prisma.user.findUnique({
                where: { id: parseInt(userId) }
            });

            if (!user) {
                return res.status(404).json({
                    message: "User with id 1 does not exist"
                });
            }

            // Get all transactions for user
            const transactions = await prisma.transaction.findMany({
                where: {
                    userId: parseInt(userId)
                },
                select: {
                    user_id: true,
                    product_id: true,
                    purchase_date: true,
                    amount: true,
                    status: true
                }
            });

            res.status(200).json(transactions);
        } catch (error) {
            res.status(404).json({
                message: "User with id 1 does not exist"
            });
        }
    },

    //View Seller Profile
    viewSellerProfile: async (req, res) => {
        try {
            const { sellerId } = req.params;

            // Find seller by ID
            const seller = await prisma.seller.findUnique({
                where: {
                    id: parseInt(sellerId)
                },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    password: true,
                    reputation: true,
                    income: true
                }
            });

            if (!seller) {
                return res.status(404).json({
                    message: "Seller not found"
                });
            }

            res.status(200).json(seller);

        } catch (error) {
            res.status(500).json({
                message: "Internal server error"
            });
        }
    },

    //View Seller Orders
    viewSellerOrders: async (req, res) => {
        try {
            const { sellerId } = req.params;

            // Verify seller exists
            const seller = await prisma.seller.findUnique({
                where: {
                    id: parseInt(sellerId)
                }
            });

            if (!seller) {
                return res.status(404).json({
                    message: "Seller with id 1 does not exist"
                });
            }

            // Get all orders for the seller's products
            const orders = await prisma.transaction.findMany({
                where: {
                    product: {
                        sellerId: parseInt(sellerId)
                    }
                },
                select: {
                    user_id: true,
                    product_id: true,
                    purchase_date: true,
                    amount: true,
                    status: true
                }
            });

            res.status(200).json(orders);

        } catch (error) {
            res.status(404).json({
                message: "Seller with id 1 does not exist"
            });
        }
    },

     //Get All New Products
     getAllNewProducts: async (req, res) => {
        try {
            // Get all products that haven't been reviewed by admin (admin_id is null)
            const newProducts = await prisma.product.findMany({
                where: {
                    admin_id: null
                },
                select: {
                    product_id: true,
                    name: true,
                    price: true,
                    description: true,
                    eco_score: true,
                    avg_rating: true,
                    certificates: true,
                    admin_id: true,
                    seller_id: true
                }
            });

            res.status(200).json(newProducts);

        } catch (error) {
            res.status(500).json({
                message: "Internal server error"
            });
        }
    },

    //Accept New Product
    acceptNewProduct: async (req, res) => {
        try {
            const { productId } = req.params;
            const { adminId } = req.body; // Assuming we get adminId from authenticated session

            // Find product
            const product = await prisma.product.findUnique({
                where: {
                    id: parseInt(productId)
                }
            });

            if (!product) {
                return res.status(404).json({
                    message: "Failed to accept product with id: 1"
                });
            }

            // Update product with admin approval
            await prisma.product.update({
                where: {
                    id: parseInt(productId)
                },
                data: {
                    admin_id: adminId,
                    status: 'APPROVED'
                }
            });

            res.status(200).json({
                message: `Successfully accepted product with id: ${productId}`
            });

        } catch (error) {
            res.status(400).json({
                message: "Failed to accept product with id: 1"
            });
        }
    },

    //Reject New Product
    rejectNewProduct: async (req, res) => {
        try {
            const { productId } = req.params;

            // Find product
            const product = await prisma.product.findUnique({
                where: {
                    id: parseInt(productId)
                }
            });

            if (!product) {
                return res.status(404).json({
                    message: "Failed to reject product with id: 1"
                });
            }

            // Delete or mark product as rejected
            await prisma.product.update({
                where: {
                    id: parseInt(productId)
                },
                data: {
                    status: 'REJECTED'
                }
            });

            res.status(200).json({
                message: `Successfully rejected product with id: ${productId}`
            });

        } catch (error) {
            res.status(400).json({
                message: "Failed to reject product with id: 1"
            });
        }
    }

};

module.exports = productController;



















