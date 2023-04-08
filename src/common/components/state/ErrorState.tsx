import iconList from "../../../lib/iconList";

type ErrorStateProps = {
  text?: string;
};

const ErrorState = ({ text = "something wents to wrong" }: ErrorStateProps) => {
  return (
    <div className="w-full p-4 bg-error-600/30 dark:bg-error-800/20 border border-error-600 dark:border-error-800 rounded flex items-center gap-1">
      <span className="text-lg text-error-600">{iconList.error}</span>
      <span>{text}</span>
    </div>
  );
};

export default ErrorState;
