import { formatDistanceToNow, parseISO } from "date-fns";
import { HashLink } from "react-router-hash-link";
import iconList from "../../lib/iconList";
import { NotificationType } from "../../types/NotificationType";

type NotificationCardType = {
  readNotif: () => {};
} & NotificationType;

const NotificationCard = ({
  id,
  path,
  text,
  type,
  status,
  createdAt,
  readNotif,
}: NotificationCardType) => {
  return (
    <div
      className="flex items-center py-3 px-3 box rounded gap-3 group"
      data-seen={status === "SEEN"}
    >
      <span className="text-xl group-data-[seen='true']:opacity-70">
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
        <HashLink
          smooth
          to={path}
          className="text-sm max-w-full group-data-[seen='true']:opacity-70"
          onClick={status !== "SEEN" ? readNotif : () => {}}
        >
          {text}
        </HashLink>
        <span className="text-xs opacity-70 group-data-[seen='true']:opacity-50">
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

export default NotificationCard;
