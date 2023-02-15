const NotificationCardSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="box p-3 flex items-start gap-2 rounded">
        <div className="w-[28px] h-[28px] rounded-sm bg-neutral-200 dark:bg-neutral-600"></div>
        <div className="flex flex-col gap-1.5 flex-1 w-full">
          <div className="w-3/4 h-[12px] rounded-sm bg-neutral-200 dark:bg-neutral-600"></div>
          <div className="w-2/4 h-[6px] rounded-sm bg-neutral-200 dark:bg-neutral-600"></div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCardSkeleton;
