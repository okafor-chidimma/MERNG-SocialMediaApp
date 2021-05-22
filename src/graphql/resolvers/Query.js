//models
import Post from "../../models/Post";

const Query = {
  async getAllPostsFromServer() {
    try {
      //this is sorting the posts by createdAt property in descending order
      const posts = await Post.find().sort({ createdAt: -1 });
      return posts;
    } catch (error) {
      throw new Error(error);
    }
  },
  async getPostFromServer(_, { postId }) {
    try {
      const post = await Post.findById(postId);
      if (!post) {
        throw new Error("Post not found");
      }
      return post;
    } catch (err) {
      throw new Error(err);
    }
  },
};
export default Query;
