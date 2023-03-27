const Loading = () => {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center fixed top-0 left-0 bg-white dark:bg-neutral-800 z-[1000]">
      <img
        src="/images/logo/chirkutt-logo-primary.png"
        alt="Chrikutt"
        width="60"
        height="60"
        className="inline-block animate-bounce"
      />
    </div>
  );
};

export default Loading;
