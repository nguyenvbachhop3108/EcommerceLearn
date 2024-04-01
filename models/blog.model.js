const { model, Schema, Types, default: mongoose } = require("mongoose");

const DOCUMANT_NAME = "Blog";
const COLLECTION_NAME = "Blogs";

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    numberView: {
      type: Number,
      default: true,
    },
    likes: [{
      type: mongoose.Types.ObjectId,
      ref: "User",
    }],
    dislikes:[ {
      type: mongoose.Types.ObjectId,
      ref: "User",
    }],
    image: {
      type: String,
      default:
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.wallpaperflare.com%2Fsearch%3Fwallpaper%3Dblogging&psig=AOvVaw2BTP8IJsfw6VuDNfsJ5HXT&ust=1711970153475000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCNiGg4SwnoUDFQAAAAAdAAAAABAE",
    },
    author: {
      type: String,
      dafault: "Admin",
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
    toJSON: true,
    toObject: true,
  }
);

module.exports = { Blog: model(DOCUMANT_NAME, blogSchema) };
