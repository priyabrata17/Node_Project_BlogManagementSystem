const UserModel = require("../model/userModel");
const BlogModel = require("../model/blogModel");
const CategoryModel = require("../model/categoryModel");

class BlogController {
  async createBlog(req, res) {
    const existingUser = await UserModel.findOne({ email: req.user.email });
    if (!existingUser) {
      return res.status(404).json({
        status: false,
        message: "No user found !!",
      });
    }

    const { title, description, content, categoryId } = req.body;
    if (!title || !description || !content) {
      return res.status(400).json({
        status: false,
        message: "All fields are required !!",
      });
    }

    const existingCategory = await CategoryModel.findById(categoryId);
    if (!existingCategory) {
      return res.status(400).json({
        status: false,
        message: "Invalid category id !!",
      });
    }

    const newBlog = await new BlogModel({
      title: title.toLowerCase(),
      description,
      content,
      categoryId,
      author: req.user._id,
    }).save();

    return res.status(200).json({
      status: true,
      message: "Blog created successfully",
      data: newBlog,
    });
  }

  async allBlogs(req, res) {
    // const existingUser = await UserModel.findOne({ email: req.user.email });
    // if (!existingUser) {
    //   return res.status(404).json({
    //     status: false,
    //     message: "No user found !!",
    //   });
    // }

    const allBlogs = await BlogModel.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: "$category",
      },

      // AUTHOR LOOKUP
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: "$author",
      },
      {
        $project: {
          title: 1,
          description: 1,
          category: 1,

          author: {
            fullname: "$author.fullname",
            image: "$author.image",
          },
        },
      },

      {
        $group: {
          _id: "$categoryId",
          totalPosts: { $sum: 1 },
          blogs: { $push: "$$ROOT" },
        },
      },
    ]);

    return res.status(200).json({
      status: true,
      message: "Blogs fetch successfully",
      data: allBlogs,
    });
  }

  async singleBlog(req, res) {
    const existingBlog = await BlogModel.findById(req.params.blogId)
      .populate({
        path: "author",
        select: "_id fullname image",
      })
      .populate({
        path: "categoryId",
        select: "_id title description",
      });

    if (!existingBlog) {
      return res.status(404).json({
        status: false,
        message: "No blog found !!",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Blog fetch successfully",
      data: existingBlog,
    });
  }

  async editBlog(req, res) {
    const existingUser = await UserModel.findOne({ email: req.user.email });
    if (!existingUser) {
      return res.status(404).json({
        status: false,
        message: "No user found !!",
      });
    }

    const existingBlog = await BlogModel.findById(req.params.blogId);
    if (!existingBlog) {
      return res.status(404).json({
        status: false,
        message: "No blog found !!",
      });
    }

    if (!existingBlog.author.equals(req.user._id)) {
      return res.status(403).json({
        status: false,
        message: "You are not authorized to edit this post !!",
      });
    }

    let filterdData = {};
    for (let key in req.body) {
      if (req.body[key] !== "") {
        filterdData[key] = req.body[key];
      }
    }

    const updatedBlog = await BlogModel.findByIdAndUpdate(
      req.params.blogId,
      { $set: filterdData },
      { new: true },
    );

    return res.status(200).json({
      status: true,
      message: "data updated successfully",
      data: updatedBlog,
    });
  }

  async deletePost(req, res) {
    const existingUser = await UserModel.findOne({ email: req.user.email });
    if (!existingUser) {
      return res.status(404).json({
        status: false,
        message: "No user found !!",
      });
    }

    const existingBlog = await BlogModel.findById(req.params.blogId);
    if (!existingBlog) {
      return res.status(404).json({
        status: false,
        message: "No blog found !!",
      });
    }

    if (!existingBlog.author.equals(req.user._id)) {
      return res.status(403).json({
        status: false,
        message: "You are not authorized to delete this blog post",
      });
    }

    await BlogModel.findByIdAndDelete(req.params.blogId);

    return res.status(200).json({
      status: true,
      message: "Blog deleted successfully",
    });
  }
}

module.exports = new BlogController();
