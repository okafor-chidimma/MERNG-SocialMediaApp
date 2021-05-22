import React, { useContext } from "react";
import moment from "moment";
import { Card, Image, Button, Icon, Label } from "semantic-ui-react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import LikeButton from "./LikeButton";
import DeleteButton from "./DeleteButton";

function PostCard({
  post: {
    id,
    username,
    createdAt,
    body,
    likeCount,
    commentCount,
    comments: { id: commentId },
    likes,
  },
  
}) {
  const { user } = useContext(AuthContext);

  const commentOnPost = (e) => {
    console.log("commented on a post");
    //history.push(`/posts/${id}`);
  };
  return (
    <Card fluid>
      <Card.Content>
        <Image
          floated="right"
          size="mini"
          src="https://react.semantic-ui.com/images/avatar/large/steve.jpg"
        />
        <Card.Header
          style={{ textTransform: "capitalize" }}
          as={Link}
          to={`/posts/${id}`}
        >
          {username}
        </Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>
          {moment(createdAt).fromNow(true)}
        </Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <LikeButton
          likeCount={likeCount}
          likes={likes}
          postId={id}
          user={user}
        />
        <Button
          as={Link}
          to={`/posts/${id}`}
          labelPosition="right"
          onClick={commentOnPost}
        >
          <Button basic color="blue">
            <Icon name="comments" />
          </Button>
          <Label basic color="blue" pointing="left">
            {commentCount}
          </Label>
        </Button>
        {user && user.username === username && (
          <DeleteButton postId={id} commentId={commentId} />
        )}
      </Card.Content>
    </Card>
  );
}

export default PostCard;
