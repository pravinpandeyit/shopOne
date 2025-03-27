const Product = require("../models/Product");
const Category = require("../models/Category");
const {
  productSchema,
  imageValidation,
} = require("../validations/productValidation");
const fs = require("fs");
const path = require("path");

const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

exports.addProduct = async (req, res) => {
  try {
    const { error } = productSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const { name, description, price, categoryId, stock } = req.body;

    let product = await Product.findOne({ name });
    if (product) {
      return res
        .status(400)
        .json({ message: "Please enter unique product name" });
    }

    const fileUrls = req.files.map((file) => {
      const fileName = `${Date.now()}-${file.originalname}`;
      let filePath = path.join(uploadDir, fileName);
      filePath = filePath.replace(/\\/g, "/");
      fs.writeFileSync(filePath, file.buffer);
      return filePath;
    });

    product = new Product({
      name,
      description,
      price: parseFloat(parseFloat(price).toFixed(2)),
      categoryId,
      stock,
      images: fileUrls,
    });
    product.save();

    res.json({ message: "Product added successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error " + error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Product ID is required!" });
    }
    const product = await Product.findById(id)
      .select("name description price categoryId stock images")
      .populate("categoryId", "name");

    if (!product) {
      return res.status(400).json({ message: "Product not found!" });
    }
    res.json({ message: "Product Details", data: product });
  } catch (error) {
    res.status(500).json({ message: "Error " + error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { error } = productSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Product ID is required!" });
    }

    const { name, description, price, categoryId, stock } = req.body;

    let product = await Product.findById(id);
    if (!product) {
      return res.status(400).json({ message: "Product not found!" });
    }

    let existingImages = product.images || [];

    if (req.files || req.files.length === 0) {
      const newImages = req.files.map((file) => {
        const fileName = `${Date.now()}-${file.originalname}`;
        let filePath = path.join(uploadDir, fileName);
        filePath = filePath.replace(/\\/g, "/");
        fs.writeFileSync(filePath, file.buffer);
        return filePath;
      });
      existingImages.push(...newImages);
    }

    product.name = name;
    product.description = description;
    product.price = parseFloat(parseFloat(price).toFixed(2));
    product.categoryId = categoryId;
    product.stock = stock;
    product.images = existingImages;
    await product.save();

    res.json({ message: "Product updated successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error " + error.message });
  }
};

exports.deleteProductImage = async (req, res) => {
  try {
    const { error } = imageValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { productId, imageUrl } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({ message: "Product not found!" });
    }

    let imageName = imageUrl.split(process.env.BASE_URL + "/")[1];

    const imageIndex = product.images.findIndex((img) => img === imageName);

    if (imageIndex == -1) {
      return res.status(400).json({ message: "Image not found in product!" });
    }

    product.images.splice(imageIndex, 1);
    await product.save();

    const filePath = path.join(__dirname, "..", imageName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ message: "Image delete successfully!", data: product });
  } catch (error) {
    res.status(500).json({ message: "Error " + error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Product ID is required!" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(400).json({ message: "Product not found!" });
    }

    await Product.findByIdAndDelete(id);
    res.json({ message: "Product deleted succesfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error " + error.message });
  }
};

exports.productList = async (req, res) => {
  try {
    const searchQuery = req.query.search || "";
    const categoryFilter = req.query.category || "";
    const sortBy = req.query.sortBy || "";

    const query = {};
    if (searchQuery) {
      query.name = { $regex: searchQuery, $options: "i" };
    }

    if (categoryFilter) {
      const category = await Category.find({
        name: { $regex: categoryFilter, $options: "i" },
      });

      if (category.length > 0) {
        query.categoryId = category[0]._id;
      }
    }

    let sortingOrder = {};
    if(sortBy == "price_high"){
      sortingOrder.price = -1; // high to low
    } else if(sortBy == "price_low"){
      sortingOrder.price = 1; // low to high
    }

    const products = await Product.find(query)
      .populate("categoryId", "name")
      .select("name description price categoryId images").sort(sortingOrder);

    res.json({ message: "Product list", data: products });
  } catch (error) {
    res.status(500).json({ message: "Error " + error.message });
  }
};
