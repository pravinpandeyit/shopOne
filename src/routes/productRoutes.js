const express = require("express");
const {
  addProduct,
  getProductById,
  updateProduct,
  deleteProductImage,
  deleteProduct,
  productList
} = require("../controllers/productController");
const { authenticateUser, isAdmin } = require("../middleware/authMiddleware");
const { uploadMultiple } = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post(
  "/product/add",
  authenticateUser,
  isAdmin,
  uploadMultiple,
  addProduct
);
router.get("/product/:id", authenticateUser, isAdmin, getProductById);
router.put(
  "/product/update/:id",
  authenticateUser,
  isAdmin,
  uploadMultiple,
  updateProduct
);
router.delete(
  "/product/image/delete",
  authenticateUser,
  isAdmin,
  deleteProductImage
);
router.delete("/product/delete/:id", authenticateUser, isAdmin, deleteProduct);

//Routes for website
router.get("/product-list", productList);

module.exports = router;
