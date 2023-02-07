import { formatDistanceToNow, parseISO } from "date-fns";
import { HashLink } from "react-router-hash-link";
import iconList from "../../lib/iconList";
import { NotificationType } from "../../types/NotificationType";

type NotificationBoxType = {
  readNotif: () => {};
} & NotificationType;

const NotificationBox = ({
  id,
  path,
  text,
  type,
  status,
  createdAt,
  readNotif,
}: NotificationBoxType) => {
  return (
    <div className="flex items-center py-3 px-3 box rounded gap-3">
      <span className="text-xl">
        {
          iconList[
            type === "LIKE"
              ? "liked"
              : type === "COMMENT"
              ? "comment"
              : "notification"
          ]
        }
      </span>
      <div className="flex flex-col gap-0.5">
        <HashLink smooth to={path} className="text-sm max-w-full">
          {text}
        </HashLink>
        <span className="text-xs opacity-70">
          {formatDistanceToNow(parseISO(new Date(createdAt).toISOString()))} ago
        </span>
      </div>
      <div className="flex items-center gap-1 ml-auto">
        <button
          className="btn btn-sm btn-icon btn-theme"
          disabled={status === "SEEN"}
          onClick={readNotif}
        >
          {iconList[status === "SEEN" ? "doublecheck" : "check"]}
        </button>
      </div>
    </div>
  );
};

export default NotificationBox;
