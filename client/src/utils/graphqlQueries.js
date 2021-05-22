import { gql } from "@apollo/client";

export const FETCH_POSTS_QUERY = gql`
  query getAllPosts {
    getAllPostsFromServer {
      id
      username
      body
      createdAt
      comments {
        id
        body
        username
        createdAt
      }
      likes {
        id
        username
      }
      commentCount
      likeCount
    }
  }
`;

//the mutation query definition
export const LOGIN_USER_MUTATION = gql`
  mutation loginAUser($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      username
      createdAt
      id
      email
      token
    }
  }
`;

//the mutation query definition
export const REGISTER_USER_MUTATION = gql`
  mutation registerAUser(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    registerUser(
      registerUserInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      username
      createdAt
      id
      email
      token
    }
  }
`;

export const LIKE_POST_MUTATION = gql`
  mutation toggleLikePost($postId: String!) {
    toggleLikePost(postId: $postId) {
      id
      likes {
        id
        username
      }
      likeCount
    }
  }
`;

export const FETCH_SINGLE_POST_QUERY = gql`
  query getSinglePost($postId: String!) {
    getPostFromServer(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

export const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: String!, $commentId: String!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`;

export const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: String!) {
    deletePost(postId: $postId)
  }
`;
export const SUBMIT_COMMENT_MUTATION = gql`
  mutation createComment ($postId: String!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        createdAt
        username
      }
      commentCount
    }
  }
`;
