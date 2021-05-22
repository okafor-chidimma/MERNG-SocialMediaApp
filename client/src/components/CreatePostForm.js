import React, { Fragment } from "react";
import { useMutation, gql } from "@apollo/client";
import { Button, Form } from "semantic-ui-react";
import useForm from "../hooks/useForm";
import { FETCH_POSTS_QUERY } from "../utils/graphqlQueries";

const CreatePostForm =  (props) => {
  const { onChange, onSubmit, values } = useForm(createPostCallBack, {
    body: "",
  });
  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, { data: { createPost: newPost } }) {
      //update function runs on successful completion of our query
      //result contains the response from the server ==> data:{nameOfOurQuery}just as how the server responds in apollo playground
      console.log(newPost, "type post");
      //when we use proxy, we are communicating with our cached data on the client side. so  we can read or write data to the cached memory. we can send gql queries just like we do with the server.

      //we need to add the newly created post to the cached memory array, so that the post will be added automatically on the home page without us refreshing the page but this addition to cached memory can only be done upon successful db creation hence why we defined it here

      //notice as how we are using proxy.readQuery and proxy.writeQuery on the same gql query, this is because we are trying to get all posts and add our newly created post( our newly created post, result is returned as a single post just as we specified in the server that createPost mutation will return the created post and not the posts array) to it, the FETCH_POSTS_QUERY gets the all post array and when we use proxy.writeQuery on the FETCH_POSTS_QUERY we are mutating the posts array.

      /*
        if we wanted to change the newly created post object that is in the cache, we wil write as 
        proxy.writeQuery({
          query: CREATE_POST_MUTATION
        })
        or
        proxy.writeQuery({
          query: FETCH_SINGLE_POST_QUERY 
        })
        //TODO: research on how to pass in variables to proxy in apollo client
      
      */

      //fetching from cache
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      });
      console.log(data, "posts array but from the cache");
      //persisting the data to cache
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: {
          getAllPostsFromServer: [newPost, ...data.getAllPostsFromServer],
        },
      });
      values.body = "";
    },
    onError(err) {
      //console.log(err.graphQLErrors[0].message, "create post");
      // console.log(err.networkError, "create post network");
      //console.log(JSON.stringify(err, null, 2));
      return err;
      //call the setError state method
    },
  });
  function createPostCallBack() {
    createPost();
  }

  return (
    <Fragment>
      <Form onSubmit={onSubmit}>
        <h1>Write A Post</h1>
        <Form.Field>
          <input
            placeholder="Share the news with us!!!"
            name="body"
            onChange={onChange}
            value={values.body}
            error={error ? true : false}
          />
        </Form.Field>
        <Button type="submit" color="teal" fluid>
          Post
        </Button>
      </Form>
      {error && (
        <div className="ui error message" style={{ marginBottom: 20 }}>
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </Fragment>
  );
};
const CREATE_POST_MUTATION = gql`
  mutation createAPost($body: String!) {
    createPost(body: $body) {
      id
      username
      body
      createdAt
      comments {
        id
        username
        createdAt
      }
      commentCount
      likeCount
      likes {
        username
        id
        createdAt
      }
    }
  }
`;

export default CreatePostForm;
