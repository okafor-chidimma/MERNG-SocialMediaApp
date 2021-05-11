import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserInputError, AuthenticationError } from "apollo-server";

//models
import User from "../../models/User";
import Post from "../../models/Post";

import Config from "../../../config";
import {
  validateRegisterInput,
  validateLoginInput,
} from "../../utils/validator";
import checkAuth from "../../utils/check-auth";

const { SECRET_KEY } = Config;
//generate the token
//jwt.sign(payloadObj, secret_key, optionsObj)
const generateToken = ({ id, email, username }) => {
  return jwt.sign(
    {
      id,
      email,
      username,
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
};
const Mutation = {
  async login(_, { username, password }) {
    const { errors, valid } = validateLoginInput(username, password);

    if (!valid) {
      throw new UserInputError("Errors", { errors });
    }

    const user = await User.findOne({ username });

    if (!user) {
      errors.general = "User not found";
      throw new UserInputError("User not found", { errors });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      errors.general = "Wrong credentials";
      throw new UserInputError("Wrong credentials", { errors });
    }

    const token = generateToken(user);
    // console.log(user._doc);
    return {
      ...user._doc,
      id: user._id,
      token,
    };
  },
  //since we are not using parent, you can replace it with _
  async registerUser(
    _,
    { registerUserInput: { username, password, confirmPassword, email } }
  ) {
    // validate the fields
    const { errors, valid } = validateRegisterInput(
      username,
      email,
      password,
      confirmPassword
    );
    //if any of the inputs are not valid, it throws the error message
    if (!valid) {
      throw new UserInputError("Errors:", { errors });
    }
    //Make sure user does not exist
    const userExist = await User.findOne({ username });
    if (userExist) {
      //this throws a new error and passes a payloadObj which has the errors obj that will be consumed from the FE
      throw new UserInputError("Username is Taken", {
        errors: {
          username: "this username is taken",
        },
      });
    }
    //hash password, generate token and send back
    password = await bcrypt.hash(password, 12);
    // console.log(password, "password");
    //create the new user model to be inserted into the db
    const newUser = new User({
      username,
      password,
      email,
      createdAt: new Date().toISOString(),
    });
    //insert user into db
    const user = await newUser.save();

    //this user object has other properties but what we see when we console.log user, is just the model instance we created which is the _doc property on the user object(recall it has other properties). how we can access those other properties is by spreading them inside another object or targeting them directly

    const token = generateToken(user);
    return {
      ...user._doc,
      id: user._id,
      token,
    };
  },
  async createPost(_, { body }, context) {
    const user = checkAuth(context);
    if (body.trim() === "") {
      throw new UserInputError("Post body must not be empty", {
        errors: {
          postBody: "Post body must not be empty",
        },
      });
    }

    const newPost = new Post({
      body,
      user: user.id,
      username: user.username,
      createdAt: new Date().toISOString(),
    });
    const post = await newPost.save();
    //at this point post === post_.doc but if you try to spread out post, you will see it has other properties
    //we are able to return post directly here unlike register resolver because everything we defined in our post schema is already in post.
    //console.log(post._doc, "post");
    context.pubsub.publish("NEW_POST", {
      newPost: post,
    });
    return post;
  },
  async deletePost(_, { postId }, context) {
    //console.log(context, "from mutation");
    //first off check that the user is logged in
    const user = checkAuth(context);
    console.log(user, "user from mutation");
    try {
      //grab the post
      const post = await Post.findById(postId);
      // console.log(post, "post to delete");
      if (!post) {
        throw new UserInputError("Post does not exist", {
          errors: {
            post: `Post with ${postId} does not exist`,
          },
        });
      }
      if (post.username === user.username) {
        //same user is deleting
        await post.delete();
        return "Post deleted successfully";
      } else {
        throw new AuthenticationError("Action not allowed");
      }
    } catch (error) {
      throw new Error(error);
    }
  },
  createComment: async (_, { postId, body }, context) => {
    const { username } = checkAuth(context);
    if (body.trim() === "") {
      throw new UserInputError("Empty comment", {
        errors: {
          body: "Comment body must not empty",
        },
      });
    }

    const post = await Post.findById(postId);

    if (post) {
      //add the new comment to the beginning of the array
      post.comments.unshift({
        body,
        username,
        createdAt: new Date().toISOString(),
      });
      await post.save();
      return post;
    } else throw new UserInputError("Post not found");
  },
  async deleteComment(_, { postId, commentId }, context) {
    const { username } = checkAuth(context);
    console.log(postId, commentId, "delete comment");
    const post = await Post.findById(postId);
    console.log(post, "post");
    if (post) {
      const commentIndex = post.comments.findIndex((c) => c.id === commentId);
      if (commentIndex < 0) throw new UserInputError("Comment not found");
      //check if the user is the same as the one that created the comment
      if (post.comments[commentIndex].username === username) {
        post.comments.splice(commentIndex, 1);
        await post.save();
        return post;
      } else {
        throw new AuthenticationError("Action not allowed");
      }
    } else {
      throw new UserInputError("Post not found");
    }
  },
  async toggleLikePost(_, { postId }, context) {
    const { username } = checkAuth(context);

    const post = await Post.findById(postId);
    if (post) {
      //here a user can only like a post once or unlike it once
      if (post.likes.find((like) => like.username === username)) {
        // Post already liked, unlike it
        post.likes = post.likes.filter((like) => like.username !== username);
      } else {
        // Not liked, like post
        post.likes.push({
          username,
          createdAt: new Date().toISOString(),
        });
      }

      await post.save();
      return post;
    } else throw new UserInputError("Post not found");
  },
};
export default Mutation;
