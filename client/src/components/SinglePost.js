import { useQuery, useMutation } from "@apollo/client";
import React, { useContext, useRef, useState } from "react";
import moment from "moment";

import {
  Loader,
  Grid,
  Card,
  Image,
  Button,
  Icon,
  Label,
  Form,
} from "semantic-ui-react";
import {
  FETCH_SINGLE_POST_QUERY,
  SUBMIT_COMMENT_MUTATION,
} from "../utils/graphqlQueries";
import LikeButton from "./LikeButton";
import AuthContext from "../context/AuthContext";
import DeleteButton from "./DeleteButton";
import MyPopup from "./MyPopup";

function SinglePost(props) {
  const postId = props.match.params.postId;
  const { user } = useContext(AuthContext);
  //useRef is a hook that allows you to use reference in functional components
  //you can use reference to access the html dom node
  /*
    HOW TO USE IT
    1. add a ref attribute to your desired html tag. in our case we added it to the input tag and assigned it to this commentInputRef variable
    for e.g <input type="text" ref={commentInputRef} />

    2. this adds the input element to a current property that is on the commentInputRef object
    3. so we can access this dom element and add blur() to it, to remove focus from it
  */
  const commentInputRef = useRef(null);

  const [comment, setComment] = useState("");
//this data object is coming from the cache and not directly from the server. data object is equivalent to ROOT_QUERY

  const { loading, data: { getPostFromServer } = {} } = useQuery(
    FETCH_SINGLE_POST_QUERY,
    {
      variables: {
        postId,
      },
      onError(err) {
        //console.log(err.graphQLErrors[0].message, "create post");
        // console.log(err.networkError, "create post network");
        console.log(JSON.stringify(err, null, 2));
        return err;
        //call the setError state method
      },
    }
  );
  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update(_, result) {
      console.log(result);
      setComment("");
      
      commentInputRef.current.blur();
    },
    variables: {
      postId,
      body: comment,
    },
  });

  function deletePostCallback() {
    console.log("I am call back from single post");
    props.history.push("/");
  }
  let postMarkup;
  if (loading) {
    postMarkup = <Loader active>Loading Post....</Loader>;
  } else {
    const {
      id,
      body,
      createdAt,
      username,
      comments,
      likes,
      likeCount,
      commentCount,
    } = getPostFromServer;

    postMarkup = (
      <Grid>
        <Grid.Row style={{ margin: "20px" }}>
          <Grid.Column width={2}>
            <Image
              src="https://react.semantic-ui.com/images/avatar/large/molly.png"
              size="small"
              float="right"
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow(true)}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton
                  likeCount={likeCount}
                  likes={likes}
                  postId={id}
                  user={user}
                />
                <MyPopup content="Comment on post">
                  <Button
                    as="div"
                    labelPosition="right"
                    onClick={() => console.log("Comment on post")}
                  >
                    <Button basic color="blue">
                      <Icon name="comments" />
                    </Button>
                    <Label basic color="blue" pointing="left">
                      {commentCount}
                    </Label>
                  </Button>
                </MyPopup>
                {user && user.username === username && (
                  <DeleteButton postId={id} callback={deletePostCallback} />
                )}
              </Card.Content>
            </Card>
            {user && (
              <Card fluid>
                <Card.Content>
                  <p>Post a comment</p>
                  <Form>
                    <div className="ui action input fluid">
                      <input
                        type="text"
                        placeholder="Comment.."
                        name="comment"
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                        ref={commentInputRef}
                      />
                      <button
                        type="submit"
                        className="ui button teal"
                        disabled={comment.trim() === ""}
                        onClick={submitComment}
                      >
                        Submit
                      </button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}
            {comments.map((comment) => (
              <Card fluid key={comment.id}>
                <Card.Content>
                  {user && user.username === comment.username && (
                    <DeleteButton postId={postId} commentId={comment.id} />
                  )}
                  <Card.Header>{comment.username}</Card.Header>
                  <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{comment.body}</Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
  return postMarkup;
}

export default SinglePost;
