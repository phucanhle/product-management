const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

require("dotenv").config();
const port = process.env.PORT || 3000;

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true })); // Xử lý FormData

app.use("/product-images", express.static(path.join(__dirname, "product-images")));
// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "/product-images");

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI); // Connect to MongoDB using URI from environment variable

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "product-images/"); // Thư mục lưu trữ ảnh
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Tên file
    },
});

const upload = multer({ storage }); // Sử dụng multer để xử lý FormData

// Mongoose Schema
const ProductSchema = new mongoose.Schema({
    productid: String, // Sử dụng productid cho consistency
    name: String,
    image: String,
    quantity: Number,
});

// Mongoose Model
const Product = mongoose.model("Product", ProductSchema);

// Route for adding a product
app.post("/products", upload.single("productImage"), async (req, res) => {
    const { productId, productName, productQuantity } = req.body;
    const productImage = req.file;

    if (!productId || !productName || !productQuantity || !productImage) {
        return res.status(400).json({ message: "Missing required product information." });
    }

    try {
        const newProduct = new Product({
            productid: productId, // Sử dụng productid
            name: productName,
            image: `/product-images/${productImage.filename}`, // Lưu đường dẫn hình ảnh
            quantity: parseInt(productQuantity, 10),
        });

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        console.error("Error adding product:", error.message || error);
        res.status(500).json({ message: "Error adding product", error: error.message || error });
    }
});

// Route for getting all products
app.get("/products", async (req, res) => {
    try {
        const products = await Product.find({}, { _id: 0, __v: 0 }).lean(); // Lấy tất cả sản phẩm
        res.send(products);
    } catch (error) {
        console.error("Error fetching products:", error.message || error);
        res.status(500).json({
            message: "Error fetching products",
            error: error.message || error,
        });
    }
});

app.put("/products/:productId/quantity", async (req, res) => {
    const productId = req.params.productId;
    const newQuantity = req.body.quantity;

    try {
        const product = await Product.findOne({ productid: productId });
        if (!product) {
            return res.status(404).json({ message: "Sản phẩm không tồn tại" });
        }

        await Product.findOneAndUpdate({ productid: productId }, { quantity: newQuantity });

        res.status(200).json({ message: "Số lượng sản phẩm đã được cập nhật", quantity: newQuantity });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi cập nhật số lượng sản phẩm" });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
