const mongoose = require("mongoose");
const slugify = require("slugify");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
     imageUrl: { type: String }, 
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    slug: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true }
);

blogSchema.pre("save", function (next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("Blog", blogSchema);
