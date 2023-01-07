import PostCard from "../common/components/PostCard";

const Home = () => {
  return (
    <>
      <PostCard
        id="1"
        text="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore, impedit"
        createdAt={new Date().toISOString()}
        modifiedAt={new Date().toISOString()}
        likes={["tonmoy", "kdsa"]}
        author={{
          name: "Tonmoy Deb",
          avatar: "/images/logo/chirkutt-logo-primary.png",
          username: "tonmoydeb",
        }}
      />
    </>
  );
};

export default Home;
