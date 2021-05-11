//models
import Post from "../../models/Post";

const Query = {
  async getPosts() {
    try {
      //this is sorting the posts by createdAt property in descending order
      const posts = await Post.find().sort({ createdAt: -1 });
      return posts;
    } catch (error) {
      throw new Error(error);
    }
  },
};
export default Query;
