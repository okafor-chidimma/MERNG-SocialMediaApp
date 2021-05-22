import { gql } from "apollo-server";

const typeDefs = gql`
  input RegisterUserInput {
    email: String!
    username: String!
    password: String!
    confirmPassword: String!
  }
  type Post {
    id: ID!
    body: String!
    username: String!
    createdAt: String!
    comments: [Comment]!
    likes: [Like]!
    likeCount: Int!
    commentCount: Int!
  }
  type Comment {
    body: String!
    username: String!
    createdAt: String!
    id: ID!
  }
  type Like {
    username: String
    createdAt: String
    id: ID!
  }
  type User {
    id: ID!
    username: String!
    email: String!
    token: String!
    createdAt: String!
  }
  type Query {
    getAllPostsFromServer: [Post!]!
    getPostFromServer(postId: String!): Post
  }
  type Mutation {
    registerUser(registerUserInput: RegisterUserInput!): User!
    login(username: String!, password: String!): User!
    createPost(body: String!): Post!
    deletePost(postId: String!): String!
    createComment(postId: String!, body: String!): Post!
    deleteComment(postId: String!, commentId: String!): Post!
    toggleLikePost(postId: String!): Post!
  }
  type Subscription {
    newPost: Post!
  }
`;

export default typeDefs;
