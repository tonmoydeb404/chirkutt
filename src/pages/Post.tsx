import { Navigate, useParams } from "react-router-dom";
import TextGroup from "../common/components/Forms/TextGroup";
import PostCard from "../common/components/PostCard";
import PostComment from "../common/components/PostComment";
import iconList from "../lib/iconList";
import { useGetAllPostsQuery } from "../services/postsApi";
import { useGetAllUsersQuery } from "../services/usersApi";

const Post = () => {
  const { id } = useParams();
  if (!id) return <Navigate to={"/404"} />;

  const posts = useGetAllPostsQuery({});
  const users = useGetAllUsersQuery({});

  // error state
  if (posts.isError || users.isError) {
    return <p>something wents to wrong</p>;
  }
  // success state
  if (posts.isSuccess && posts.data && users.isSuccess && users.data) {
    const post = posts.data[id];
    const user = users.data[id];

    return (
      <>
        <PostCard {...post} author={user} />

        <div className="flex items-center justify-between mt-10">
          <h3 className="">All Comments</h3>
        </div>

        <div className="comments mt-5">
          <PostComment
            avatar="/images/logo/chirkutt-logo-secondary.png"
            name="Tonmoy Deb"
            comment="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Odit,
              consectetur?"
            id="1"
            username="tonmoydeb"
            replay
          >
            <PostComment
              avatar="/images/logo/chirkutt-logo-secondary.png"
              name="Tonmoy Deb"
              comment="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Odit,
              consectetur?"
              id="1"
              username="tonmoydeb"
              replay={false}
            />
            <PostComment
              avatar="/images/logo/chirkutt-logo-secondary.png"
              name="Tonmoy Deb"
              comment="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Odit,
              consectetur?"
              id="1"
              username="tonmoydeb"
              replay={false}
            />
          </PostComment>
          <PostComment
            avatar="/images/logo/chirkutt-logo-secondary.png"
            name="Tonmoy Deb"
            comment="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Odit,
              consectetur?"
            id="1"
            username="tonmoydeb"
            replay
          />
          <PostComment
            avatar="/images/logo/chirkutt-logo-secondary.png"
            name="Tonmoy Deb"
            comment="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Odit,
              consectetur?"
            id="1"
            username="tonmoydeb"
            replay
          />
        </div>

        <div className="flex items-center justify-between mt-10">
          <h3 className="">Write a comments</h3>
        </div>

        <div className="mt-3 flex gap-2 rounded">
          <img
            src="/images/logo/chirkutt-logo-primary.png"
            alt="Tonmoy Deb"
            className="w-[35px] h-[35px] rounded hidden min-[501px]:block"
          />
          <div className="flex-1 flex flex-col gap-2">
            <TextGroup id="new_comment" placeholder="write your comment" />
            <button className="btn btn-sm btn-primary self-end">
              submit <span>{iconList.check}</span>
            </button>
          </div>
        </div>
      </>
    );
  }

  // loading state
  return <p>loading...</p>;
};

export default Post;
