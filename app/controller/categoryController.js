const CategoryModel = require("../model/categoryModel");
const UserModel = require("../model/userModel");

class CategoryController {
  async createCategory(req, res) {
    console.log("email: ", req?.user?.email, "id: ", req?.user?._id);
    const existingUser = await UserModel.findOne({ email: req?.user?.email });
    if (!existingUser) {
      return res.status(404).json({
        status: false,
        message: "No user found !!",
      });
    }
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({
        status: false,
        message: "All fields are required !!",
      });
    }

    const existingCategory = await CategoryModel.findOne({
      title: title.toLowerCase(),
    });
    if (existingCategory) {
      return res.status(409).json({
        status: false,
        message: "This category already exists !!",
      });
    }

    const newCategory = await new CategoryModel({
      title: title.toLowerCase(),
      description,
    }).save();

    return res.status(201).json({
      status: true,
      message: "New category created successfully",
      data: newCategory,
    });
  }

  async viewCategory(req, res) {
    const allCategory = await CategoryModel.find({});
    return res.status(200).json({
      status: true,
      message: "Category fetch successfully",
      data: allCategory,
    });
  }

  async updateCategory(req, res) {
    const existingUser = await UserModel.findOne({ email: req?.user?.email });
    if (!existingUser) {
      return res.status(404).json({
        status: false,
        message: "No user found !!",
      });
    }
    const existingCategory = await CategoryModel.findById(
      req.params.categoryId,
    );
    if (!existingCategory) {
      return res.status(404).json({
        status: false,
        message: "No category found !!",
      });
    }

    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      req.params.categoryId,
      { $set: req.body },
      { new: true },
    );

    return res.status(200).json({
      status: true,
      message: "Category updated successfully",
      data: updatedCategory,
    });
  }

  async deleteCategory(req, res) {
    const existingUser = await userModel.findOne({ email: req?.user?.email });
    if (!existingUser) {
      return res.status(404).json({
        status: false,
        message: "No user found !!",
      });
    }
    const existingCategory = await CategoryModel.findById(
      req.params.categoryId,
    );
    if (!existingCategory) {
      return res.status(404).json({
        status: false,
        message: "No category found !!",
      });
    }

    await CategoryModel.findByIdAndDelete(req.params.categoryId);

    return res.status(200).json({
      status: true,
      message: "Category deleted successfully",
    });
  }
}

module.exports = new CategoryController();
