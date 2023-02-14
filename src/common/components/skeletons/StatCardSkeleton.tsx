const StatCardSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="box p-3 lg:p-4 min-h-[66px] rounded flex gap-2">
        <div className="w-[40px] h-[40px] rounded bg-neutral-200 dark:bg-neutral-600"></div>
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="w-[50px] h-[10px] rounded-sm bg-neutral-200 dark:bg-neutral-600"></div>

          <div className="w-[70px] h-[20px] rounded-sm bg-neutral-200 dark:bg-neutral-600"></div>
        </div>
      </div>
    </div>
  );
};

export default StatCardSkeleton;
