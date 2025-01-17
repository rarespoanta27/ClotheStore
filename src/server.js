const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

// Configurare pentru upload imagini
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const PORT = 3001;
const MONGO_URI = "mongodb://localhost:27017/clothestoreDB";

// Conectare la MongoDB
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// Definirea modelului User
const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", UserSchema);

// Definirea modelului Product
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  image: { type: String },
  sizes: { type: [String], required: true },
});

const Product = mongoose.model("Product", ProductSchema);

// Definirea modelului Order
const OrderSchema = new mongoose.Schema({
  items: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      selectedSize: { type: String },
      quantity: { type: Number, default: 1 },
    },
  ],
  customerName: { type: String, required: true },
  address: { type: String, required: true },
  paymentMethod: { type: String, default: "Cash on Delivery" },
  date: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", OrderSchema);

// Endpoint pentru înregistrare
app.post("/api/register", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint pentru login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.status(200).json({
      fullName: user.fullName,
      email: user.email,
      userId: user._id,
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint pentru adăugarea unui produs
app.post("/api/products", upload.single("image"), async (req, res) => {
  const { name, price, description, sizes } = req.body;

  if (!name || !price || !sizes) {
    return res.status(400).json({ error: "Name, price, and sizes are required" });
  }

  const image = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const newProduct = new Product({
      name,
      price,
      description,
      image,
      sizes: JSON.parse(sizes),
    });

    await newProduct.save();

    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint pentru obținerea produselor
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint pentru plasarea comenzilor
app.post("/api/orders", async (req, res) => {
  const { items, customerName, address, paymentMethod } = req.body;

  if (!items || !customerName || !address) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newOrder = new Order({
      items,
      customerName,
      address,
      paymentMethod,
    });

    await newOrder.save();

    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (err) {
    console.error("Error placing order:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Servirea fișierelor statice
app.use("/uploads", express.static("uploads"));

// Endpoint pentru schimbarea parolei
app.post("/api/change-password", async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  if (!email || !currentPassword || !newPassword) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully!" });
  } catch (err) {
    console.error("Error during password change:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint pentru detalii utilizator
app.get("/api/user-details", async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      fullName: user.fullName,
      email: user.email,
    });
  } catch (err) {
    console.error("Error fetching user details:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Pornirea serverului
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});