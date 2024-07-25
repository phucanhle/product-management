const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to MongoDB
mongoose.connect("mongodb+srv://admin:admin@data.yvrnpoz.mongodb.net/?retryWrites=true&w=majority&appName=Data", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

const ProductSchema = new mongoose.Schema({
    id: String,
    name: String,
    image: String,
    quantity: Number,
});
const Product = mongoose.model("Product", ProductSchema);

app.post("/products", upload.single("productImage"), async (req, res) => {
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);

    const { productId, productName, productQuantity } = req.body;
    const productImage = req.file ? `/uploads/${req.file.filename}` : null;

    if (!productId || !productName || !productQuantity || !productImage) {
        return res.status(400).json({ message: "Missing required product information." });
    }

    try {
        const newProduct = new Product({
            _id: productId,
            name: productName,
            image: productImage,
            quantity: parseInt(productQuantity, 10),
        });

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        console.error("Error adding product:", error.message || error);
        res.status(500).json({ message: "Error adding product", error: error.message || error });
    }
});

app.get("/products", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error("Error fetching products:", error.message || error);
        res.status(500).json({ message: "Error fetching products", error: error.message || error });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
