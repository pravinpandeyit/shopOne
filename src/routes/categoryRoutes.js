const express = require("express");
const { addCategory, updateCategory, deleteCategory } = require("../controllers/categoryController");
const { authenticateUser, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/category/add", authenticateUser, isAdmin, addCategory);
router.put("/category/update/:id", authenticateUser, isAdmin, updateCategory);
router.delete("/category/delete/:id", authenticateUser, isAdmin, deleteCategory);

module.exports = router;
