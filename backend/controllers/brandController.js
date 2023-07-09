import brandModel from '../models/brandModel.js'
import slugify from "slugify";
export const createBrandController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(401).send({ message: "Name is required" });
    }
    const existingBrand = await brandModel.findOne({ name });
    if (existingBrand) {
      return res.status(200).send({
        success: true,
        message: "Brand Already Exisits",
      });
    }
    const brand = await new brandModel({
      name,
      slug: slugify(name),
    }).save();
    res.status(201).send({
      success: true,
      message: "new brand created",
      brand,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Brand",
    });
  }
};

//update brand
export const updateBrandController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const brand = await brandModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    res.status(200).send({
      success: true,
      messsage: "Brand Updated Successfully",
      brand,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while updating brand",
    });
  }
};

// get all cat
export const brandControlller = async (req, res) => {
  try {
    const brand = await brandModel.find({});
    res.status(200).send({
      success: true,
      message: "All Brands List",
      brand,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting all Brands",
    });
  }
};

// single brand
export const singleBrandController = async (req, res) => {
  try {
    const brand = await brandModel.findOne({ slug: req.params.slug });
    res.status(200).send({
      success: true,
      message: "Get SIngle brand SUccessfully",
      brand,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While getting Single brand",
    });
  }
};

//delete brand
export const deleteBrandCOntroller = async (req, res) => {
  try {
    const { id } = req.params;
    await brandModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "brand Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while deleting brand",
      error,
    });
  }
};