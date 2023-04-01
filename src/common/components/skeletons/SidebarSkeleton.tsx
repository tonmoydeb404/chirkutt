const SidebarSkeleton = () => (
  <div className="animate-pulse">
    <div className="flex flex-col gap-3 md:gap-4 items-stretch w-full">
      <div className="h-[45px] md:h-[60px] box rounded p-0.5 md:p-2 flex items-stretch gap-2">
        <div className="w-full md:w-[45px] rounded-sm bg-neutral-200 dark:bg-white/5"></div>
        <div className=" flex-col gap-1.5 mt-1 md:flex hidden">
          <div className="self-stretch w-[100px] h-2 bg-neutral-200 dark:bg-white/5 rounded-sm"></div>
          <div className="self-stretch w-[60px] h-2 bg-neutral-200 dark:bg-white/5 rounded-sm"></div>
        </div>
      </div>
      <div className="h-[200px] box rounded p-2 flex flex-col gap-2"></div>
    </div>
  </div>
);
export default SidebarSkeleton;
