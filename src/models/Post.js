import mongoose from "mongoose";
const { Schema, model } = mongoose;
const postSchema = new Schema({
  body: String,
  username: String,
  createdAt: String,
  comments: [
    {
      body: String,
      username: String,
      createdAt: String,
    },
  ],
  likes: [
    {
      username: String,
      createdAt: String,
    },
  ],
  // to create a relation to the user model for mongoose orm
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});
//by default mongoose adds id field to every model

export default model("Post", postSchema);
