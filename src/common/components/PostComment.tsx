import { ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import iconList from "../../lib/iconList";

type PostCommentProps = {
    id: string;
    avatar: string;
    name: string;
    comment: string;
    username: string;
    children?: ReactNode;
    replay: boolean;
};

const PostComment = ({
    avatar,
    name,
    comment,
    username,
    id,
    children,
    replay,
}: PostCommentProps) => {
    const [showReplay, setShowReplay] = useState(false);

    return (
        <div className="comments_thread_wrapper">
            <div className="comments_thread">
                <img src={avatar} alt={name} />
                <div className="comments_thread_body">
                    <Link
                        to={`/user/${username}`}
                        className="comments_thread_title"
                    >
                        {name}
                    </Link>
                    <p className="comments_thread_text">{comment}</p>
                    {replay ? (
                        <button
                            className="btn btn-sm btn-ghost self-end"
                            onClick={() => setShowReplay((prev) => !prev)}
                        >
                            replay
                        </button>
                    ) : null}
                </div>
            </div>

            {children ? (
                <div className="comments_thread_replies">{children}</div>
            ) : null}

            {replay && showReplay ? (
                <div className="comments_thread_form">
                    <img
                        src="/images/logo/chirkutt-logo-primary.png"
                        alt="avatar"
                    />
                    <input type="text" placeholder="leave a reply" />
                    <button className="btn btn-icon btn-sm btn-theme">
                        {iconList.send}
                    </button>
                </div>
            ) : null}
        </div>
    );
};

export default PostComment;
