import React, { useContext } from "react";
import { useQuery } from "@apollo/client";
import { Grid, Transition, Loader } from "semantic-ui-react";

import PostCard from "./PostCard";
import CreatePostForm from "./CreatePostForm";

import AuthContext from "../context/AuthContext";
import { FETCH_POSTS_QUERY } from "../utils/graphqlQueries";

const Home = (props) => {
  const { user } = useContext(AuthContext);

  //this getAllPostsFromServer is from the cache because the returned data is saved in the cache in a key value pair
  //key ==> getAllPostsFromServer (this is also the name of my query resolver function in the server)
  //value ==> returned object
  //which means data is the same as Root query we are seeing in the apollo chrome extension
  //this data object is coming from the cache and it is the same as Root query
  const { loading, data: { getAllPostsFromServer: posts } = {} } =
    useQuery(FETCH_POSTS_QUERY);

  return (
    <Grid columns={3}>
      <Grid.Row className="page-title">
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {user && (
          <Grid.Column style={{ marginBottom: "20px" }}>
            <CreatePostForm />
          </Grid.Column>
        )}
        {loading ? (
          <Loader active>Loading</Loader>
        ) : posts.length === 0 ? (
          <h1>No Posts Available</h1>
        ) : (
          <Transition.Group duration={500}>
            {posts &&
              posts.map((post) => (
                <Grid.Column key={post.id} style={{ marginBottom: "20px" }}>
                  <PostCard post={post} {...props} />
                </Grid.Column>
              ))}
          </Transition.Group>
        )}
      </Grid.Row>
    </Grid>
  );
};

export default Home;
