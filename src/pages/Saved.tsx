import PostCard from "../common/components/PostCard";
import iconList from "../lib/iconList";

const Saved = () => {
    return (
        <>
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Saved Posts</h3>

                <button className="btn btn-sm btn-theme">
                    remove all <span>{iconList.remove}</span>
                </button>
            </div>

            <div className="flex flex-col gap-3 mt-5">
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
            </div>
        </>
    );
};

export default Saved;
