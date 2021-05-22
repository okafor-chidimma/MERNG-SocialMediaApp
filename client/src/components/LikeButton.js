import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { Button, Icon, Label } from "semantic-ui-react";
import { LIKE_POST_MUTATION } from "../utils/graphqlQueries";
import MyPopup from "./MyPopup";

function LikeButton({ likeCount, likes, postId, user }) {
  const [liked, setLiked] = useState(false);
  //we are using the useEffect hook here because we want the inner function to run after rendering the LikeButton component
  useEffect(() => {
    if (user && likes.find((like) => like.username === user.username)) {
      setLiked(true);
    } else setLiked(false);
  }, [user, likes]);
  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: {
      postId,
    },
  });

  //there 2 ternary ops here, one is nested in another
  //if the user is logged in or not
  //if the logged in user has liked the post or not
  const likeButton = user ? (
    liked ? (
      <Button color="teal" onClick={likePost}>
        <Icon name="heart" />
      </Button>
    ) : (
      <Button color="teal" basic onClick={likePost}>
        <Icon name="heart" />
      </Button>
    )
  ) : (
    <Button as={Link} to="/login" color="teal" basic>
      <Icon name="heart" />
    </Button>
  );

  return (
    <Button as="div" labelPosition="right">
      <MyPopup content={liked ? "Unlike Post" : "Like Post"}>
        {likeButton}
      </MyPopup>

      <Label basic color="teal" pointing="left">
        {likeCount}
      </Label>
    </Button>
  );
}

export default LikeButton;
