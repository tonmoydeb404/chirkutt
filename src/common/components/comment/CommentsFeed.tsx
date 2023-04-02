import { CommentDetails } from "../../../types/CommentType";
import CommentCard from "./CommentCard";
import CommentReplyCard from "./CommentReplyCard";

type CommentsFeedProps = {
  comments: CommentDetails[];
  postAuthorUID: string;
};

const CommentsFeed = ({ comments, postAuthorUID }: CommentsFeedProps) => {
  return (
    <div className="comments mt-5">
      {comments.length
        ? comments.map((commentDetails, _, arr) => {
            // avoid reply
            if (commentDetails.comment.parentID !== null) return null;

            const commentReplies = arr
              .filter(
                (replayDetails) =>
                  replayDetails.comment.parentID === commentDetails.comment.id
              )
              .sort((replayA, replayB) => {
                return replayA.comment.createdAt - replayB.comment.createdAt;
              });

            return (
              <CommentCard
                comment={commentDetails.comment}
                author={commentDetails.author}
                postAuthorUID={postAuthorUID}
                replay={!commentDetails.author.isDeleted}
                key={commentDetails.comment.id}
              >
                {commentReplies.map((replay) => {
                  return (
                    <CommentReplyCard
                      author={replay.author}
                      comment={replay.comment}
                      postAuthorUID={postAuthorUID}
                      key={replay.comment.id}
                    />
                  );
                })}
              </CommentCard>
            );
          })
        : "no comments are found"}
    </div>
  );
};

export default CommentsFeed;
