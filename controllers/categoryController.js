import slugify from "slugify";
import categoryModel from "../models/categoryModel.js";

// Create Category
export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(401).send({ message: "Name is required" });
    }
    const existingCategory = await categoryModel.findOne({ name });
    if (existingCategory) {
      return res.status(200).send({
        success: true,
        message: "Category already exists!",
      });
    }
    const category = await new categoryModel({
      name,
      slug: slugify(name),
    }).save();
    res.status(201).send({
      success: true,
      message: "Category created!",
      category,
    });
  } catch (error) {
    console.log(`Error : ${error}`.bgRed.white);
    res.status(500).send({
      sucess: false,
      message: "Could not create category",
      error,
    });
  }
};

// Update Category
export const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const category = await categoryModel.findByIdAndUpdate(
      id,
      { name: name, slug: slugify(name) },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Category updated!",
      category,
    });
  } catch (error) {
    console.log(`Error : ${error}`.bgRed.white);
    res.status(500).send({
      sucess: false,
      message: "Could not update category",
      error,
    });
  }
};

// Get all Categories
export const categoryController = async (req, res) => {
  try {
    const category = await categoryModel.find({});
    res.status(200).send({
      success: true,
      message: "All categories fetched",
      category,
    });
  } catch (error) {
    console.log(`Error : ${error}`.bgRed.white);
    res.status(500).send({
      sucess: false,
      message: "Could not get all categories",
      error,
    });
  }
};

// Get single Category
export const singleCategoryController = async (req, res) => {
  try {
    // const { name } = req.body;
    const category = await categoryModel.findOne({ slug: req.params.slug });

    res.status(200).send({
      success: true,
      message: "Category fetched",
      category,
    });
  } catch (error) {
    console.log(`Error : ${error}`.bgRed.white);
    res.status(500).send({
      sucess: false,
      message: "Could not fetch category",
      error,
    });
  }
};

// Delete Category
export const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Category deleted!",
    });
  } catch (error) {
    console.log(`Error : ${error}`.bgRed.white);
    res.status(500).send({
      sucess: false,
      message: "Could not delete category",
      error,
    });
  }
};
