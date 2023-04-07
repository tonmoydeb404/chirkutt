import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { toast } from "react-hot-toast";
import { useRemovePostNotificationsMutation } from "../../../../api/notificationsApi";
import { useDeletePostMutation } from "../../../../api/postsApi";
import { useAppDispatch } from "../../../../app/hooks";
import { updatePostModal } from "../../../../features/postModal/postModalSlice";
import iconList from "../../../../lib/iconList";
import { PostType } from "../../../../types/PostType";

type PostCardActionsProps = {
  post: PostType;
};
const PostCardActions = ({ post }: PostCardActionsProps) => {
  const dispatch = useAppDispatch();
  const [deletePost, result] = useDeletePostMutation();
  const [removePostNotifications] = useRemovePostNotificationsMutation();

  // handle delete
  const handleDelete = async () => {
    try {
      await deletePost(post.id).unwrap();
      await removePostNotifications(post.id);
    } catch (error) {
      toast.error("error in deleting post!", { id: "deletepost" });
    }
  };
  // handle edit
  const handleEdit = () => {
    dispatch(updatePostModal(post));
  };

  return (
    <div className="flex items-center ml-auto gap-1">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="btn btn-sm btn-icon btn-theme">
            {iconList.more}
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white dark:bg-neutral-700 dark:text-white px-2 py-2 flex flex-col items-stretch gap-1 rounded border border-neutral-400 dark:border-neutral-600 shadow">
            <Menu.Item>
              <button
                className="px-2 py-1 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-left rounded flex items-center gap-1"
                onClick={handleEdit}
              >
                <span>{iconList.pencil}</span>
                Edit
              </button>
            </Menu.Item>
            <Menu.Item>
              <button
                className="px-2 py-1 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-left rounded flex items-center gap-1"
                onClick={handleDelete}
              >
                <span>{iconList.remove}</span>
                Delete
              </button>
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default PostCardActions;
