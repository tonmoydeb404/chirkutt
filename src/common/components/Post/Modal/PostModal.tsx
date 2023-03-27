import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import {
  closePostModal,
  selectPostModal,
} from "../../../../features/postModal/postModalSlice";
import PostCreate from "./PostCreate";
import PostUpdate from "./PostUpdate";

const PostModal = () => {
  const { post, show, type } = useAppSelector(selectPostModal);
  const dispatch = useAppDispatch();

  const close = () => dispatch(closePostModal());

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-[1000]" onClose={close}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center sm:p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="transition-all w-full min-[501px]:w-auto ">
                {type === "EDIT" && post ? (
                  <PostUpdate post={post} />
                ) : (
                  <PostCreate />
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PostModal;
