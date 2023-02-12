const PostCardSekeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="box min-h-[150px] p-3 rounded flex flex-col gap-3">
        <div className="flex gap-2">
          <div className="w-[38px] h-[38px] rounded-sm bg-neutral-200 dark:bg-neutral-600"></div>
          <div className="flex flex-col gap-1.5">
            <div className="w-[100px] h-[12px] rounded-sm bg-neutral-200 dark:bg-neutral-600"></div>
            <div className="w-[60px] h-[6px] rounded-sm bg-neutral-200 dark:bg-neutral-600"></div>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="w-full h-[10px] rounded-sm bg-neutral-200 dark:bg-neutral-600"></div>
          <div className="w-full h-[7px] rounded-sm bg-neutral-200 dark:bg-neutral-600"></div>
          <div className="w-full h-[9px] rounded-sm bg-neutral-200 dark:bg-neutral-600"></div>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-[40px] h-[30px] rounded bg-neutral-200 dark:bg-neutral-600"></div>
          <div className="w-[40px] h-[30px] rounded bg-neutral-200 dark:bg-neutral-600"></div>
        </div>
      </div>
    </div>
  );
};

export default PostCardSekeleton;
