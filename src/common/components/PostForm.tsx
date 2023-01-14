import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { closePostForm, selectPostForm } from "../../features/postFormSlice";
import iconList from "../lib/iconList";
import TextGroup from "./Forms/TextGroup";

const PostForm = () => {
  const { show } = useAppSelector(selectPostForm);
  const dispatch = useAppDispatch();
  return (
    <div
      className={`absolute top-0 left-0 w-full min-h-full bg-neutral-900/60 flex-col items-center justify-center ${
        show ? "flex" : "hidden"
      }`}
    >
      <div className="flex flex-col rounded box w-full flex-1 min-[501px]:flex-none min-[501px]:w-[400px] py-3 px-4 gap-3">
        <div className="flex items-center">
          <h2 className="font-medium mr-auto text-lg">Create new post</h2>

          <button
            className="btn-icon btn-sm btn-ghost text-lg"
            onClick={() => dispatch(closePostForm())}
          >
            {iconList.close}
          </button>
        </div>
        <div className="">
          <TextGroup
            id="newpost"
            placeholder="share your chirkutt"
            inputClass="h-[150px] bg-neutral-900"
          />
        </div>
        <div className="flex items-center justify-end gap-1">
          <button className="btn btn-primary">
            save <span>{iconList.check}</span>
          </button>
          <button
            className="btn btn-theme"
            onClick={() => dispatch(closePostForm())}
          >
            cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostForm;
