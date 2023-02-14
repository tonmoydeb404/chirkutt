const ProfileCardSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="box min-h-[150px] p-3 sm:p-4 rounded flex flex-col sm:flex-row gap-3">
        <div className="w-[60px] h-[60px] rounded bg-neutral-200 dark:bg-neutral-600"></div>
        <div className="flex flex-col gap-3 w-full flex-1">
          <div className="w-[100px] h-[20px] rounded-sm bg-neutral-200 dark:bg-neutral-600"></div>
          <div className="flex flex-col gap-1.5 w-3/4">
            <div className="w-full h-[10px] rounded-sm bg-neutral-200 dark:bg-neutral-600"></div>
            <div className="w-full h-[7px] rounded-sm bg-neutral-200 dark:bg-neutral-600"></div>
            <div className="w-full h-[9px] rounded-sm bg-neutral-200 dark:bg-neutral-600"></div>
          </div>
          <div className="flex w-full justify-end">
            <div className="w-[70px] h-[25px] rounded-sm bg-neutral-200 dark:bg-neutral-600"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCardSkeleton;
