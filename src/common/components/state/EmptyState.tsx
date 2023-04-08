import iconList from "../../../lib/iconList";

type EmptyStateProps = {
  text?: string;
};

const EmptyState = ({ text = "nothing is here" }: EmptyStateProps) => {
  return (
    <div className="w-full p-4 bg-primary-600/20 dark:bg-primary-800/20 border border-primary-600 dark:border-primary-800 rounded flex items-center gap-1 ">
      <span className="text-lg text-primary-600">{iconList.sad}</span>
      <span>{text}</span>
    </div>
  );
};

export default EmptyState;
