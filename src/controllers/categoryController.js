const Category = require("../models/Category");
const categorySchema = require("../validations/categoryValidation");

exports.addCategory = async (req, res) => {
  try {
    const { error } = categorySchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { name } = req.body;
    let category = await Category.findOne({ name });
    if (category) {
      return res.status(400).json({ message: "Please enter unique category!" });
    }

    category = new Category({ name });
    category.save();
    res.json({ message: "Category added successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error " + error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { error } = categorySchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { name } = req.body;
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Category ID is required!" });
    }

    let category = await Category.findById(id);
    if (!category) {
      return res.status(400).json({ message: "Category not found!" });
    }

    category.name = name;
    await category.save();
    res.json({ message: "Category updated successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error " + error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Category ID is required!" });
    }

    let category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(400).json({ message: "Category not found!" });
    }
    return res.status(200).json({ message: "Category deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error " + error.message });
  }
};
