import React, { Fragment, useState } from "react";
import { useMutation } from "@apollo/client";
import { Button, Confirm, Icon } from "semantic-ui-react";

import {
  DELETE_COMMENT_MUTATION,
  DELETE_POST_MUTATION,
  FETCH_POSTS_QUERY,
} from "../utils/graphqlQueries";
import MyPopup from "./MyPopup";

function DeleteButton({ postId, commentId, callback }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

  const [deletePostOrMutation] = useMutation(mutation, {
    update(proxy) {
      setConfirmOpen(false);
      /*
        why we are not updating the cache after deleting comment is because, in the server we saved the comments as an array on the post object, so when a comment is deleted, in the server

        1. get the post by the postId ==> this post will have the comments array in it
        2. filter out the deleted comment by filtering with the comments id
        3. save the updated post object to the db
        4. return the updated post object, whose array will have one less comment
        5. in our apollo client, we receive this updated post object with its updated comments array. this updated post object completely replaces the current one in the cache automatically by apollo client when it sees that the returning post id exists in the cache.
        6. the changes in the cache automatically triggers a UI update that shows that the comment has been deleted
      
      */
      if (!commentId) {
        //this proxy speaks to the cace in order to update it in real time with the changes that has occurred
        //it
        const oldData = proxy.readQuery({
          query: FETCH_POSTS_QUERY,
        });
        proxy.writeQuery({
          query: FETCH_POSTS_QUERY,
          data: {
            getAllPostsFromServer: oldData.getAllPostsFromServer.filter(
              (p) => p.id !== postId
            ),
          },
        });
      }
      if (callback) callback();
    },
    onError(err) {
      console.log(JSON.stringify(err, null, 2));
    },
    variables: {
      postId,
      commentId,
    },
  });
  return (
    <Fragment>
      <MyPopup content={commentId ? "Delete comment" : "Delete post"}>
        <Button
          as="div"
          color="red"
          floated="right"
          onClick={() => setConfirmOpen(true)}
        >
          <Icon name="trash" style={{ margin: 0 }} />
        </Button>
      </MyPopup>
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePostOrMutation}
      />
    </Fragment>
  );
}

export default DeleteButton;
