const PostCommentSekeleton = () => {
  return (
    <div className="animate-pulse flex flex-col sm:flex-row gap-2">
      <div className="w-[35px] h-[35px] rounded bg-neutral-200 dark:bg-neutral-600"></div>
      <div className="flex flex-col gap-2 w-full flex-1">
        <div className="w-[100px] h-[15px] rounded-sm bg-neutral-200 dark:bg-neutral-600"></div>
        <div className="flex flex-col gap-1.5">
          <div className="w-3/4 h-[7px] rounded-sm bg-neutral-200 dark:bg-neutral-600"></div>
          <div className="w-full h-[5px] rounded-sm bg-neutral-200 dark:bg-neutral-600"></div>
          <div className="w-full h-[8px] rounded-sm bg-neutral-200 dark:bg-neutral-600"></div>
        </div>
      </div>
    </div>
  );
};

export default PostCommentSekeleton;
