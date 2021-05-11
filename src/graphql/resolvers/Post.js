const Post = {
  likeCount: (parent) => parent.likes.length,
  commentCount: (parent) => parent.comments.length,
};
export default Post;
