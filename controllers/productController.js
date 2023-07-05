import slugify from "slugify";
import productModel from "../models/productModel.js";
import fs from "fs";

// Create Product
export const createProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    // Validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name required!" });
      case !description:
        return res.status(500).send({ error: "Description required!" });
      case !price:
        return res.status(500).send({ error: "Price required!" });
      case !category:
        return res.status(500).send({ error: "Category required!" });
      case !quantity:
        return res.status(500).send({ error: "Quantity required!" });
      case photo && photo.size > 10000000:
        return res.status(500).send({ error: "Photo required! (Size < 10MB)" });
    }

    const product = new productModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    await product.save();
    res.status(201).send({
      success: true,
      message: "Product created!",
      product,
    });
  } catch (error) {
    console.log(`Error : ${error}`.bgRed.white);
    res.status(500).send({
      sucess: false,
      message: "Could not create product!",
      error,
    });
  }
};

// Update Product
export const updateProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    // Validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name required!" });
      case !description:
        return res.status(500).send({ error: "Description required!" });
      case !price:
        return res.status(500).send({ error: "Price required!" });
      case !category:
        return res.status(500).send({ error: "Category required!" });
      case !quantity:
        return res.status(500).send({ error: "Quantity required!" });
      case photo && photo.size > 10000000:
        return res.status(500).send({ error: "Photo required! (Size < 10MB)" });
    }

    const product = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    await product.save();
    res.status(201).send({
      success: true,
      message: "Product updated!",
      product,
    });
  } catch (error) {
    console.log(`Error : ${error}`.bgRed.white);
    res.status(500).send({
      sucess: false,
      message: "Could not update product!",
      error,
    });
  }
};

// Get all Products
export const productController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(10)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      productcount: products.length,
      message: "All products fetched",
      products,
    });
  } catch (error) {
    console.log(`Error : ${error}`.bgRed.white);
    res.status(500).send({
      sucess: false,
      message: "Could not fetch all products!",
      error,
    });
  }
};

// Get single Product
export const singleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .populate("category")
      .select("-photo");
    res.status(200).send({
      success: true,
      message: "Product fetched!",
      product,
    });
  } catch (error) {
    console.log(`Error : ${error}`.bgRed.white);
    res.status(500).send({
      sucess: false,
      message: "Could not fetch the product!",
      error,
    });
  }
};

// Get product Photo
export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(`Error : ${error}`.bgRed.white);
    res.status(500).send({
      sucess: false,
      message: "Could not fetch the product photo!",
      error,
    });
  }
};

// Delete Product
export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Product deleted!",
    });
  } catch (error) {
    console.log(`Error : ${error}`.bgRed.white);
    res.status(500).send({
      sucess: false,
      message: "Could not fetch the product photo!",
      error,
    });
  }
};
