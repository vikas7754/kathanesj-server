const Product = require("../models/product");

const addProduct = async (req, res) => {
  try {
    const { karat, percentage, show, title, gst } = req.body;
    const newProduct = new Product({
      title,
      karat: karat || 0,
      percentage: percentage || 0,
      show,
      gst: gst || 0,
    });
    const product = await newProduct.save();
    return res.status(200).json(product);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { karat, percentage, show, title, gst } = req.body;
    const product = await Product.findByIdAndUpdate(
      { _id: req.params.id },
      {
        title,
        karat: karat || 0,
        percentage: percentage || 0,
        show,
        gst: gst || 0,
      }
    );
    return res.status(200).json(product);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

const updateShowProduct = async (req, res) => {
  try {
    const { show } = req.body;
    const product = await Product.findByIdAndUpdate(
      { _id: req.params.id },
      { show }
    );
    return res.status(200).json(product);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    return res.status(200).json(product);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({
      karat: -1,
      createdAt: 1,
    });
    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    return res.status(200).json(product);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

module.exports = {
  addProduct,
  updateProduct,
  updateShowProduct,
  deleteProduct,
  getProducts,
  getProductById,
};
