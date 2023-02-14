import iconList from "../../lib/iconList";

type StatCardType = {
  icon: string;
  title: string;
  count: number;
  color: "primary" | "success" | "warning";
};

const StatCard = ({ icon, title, count, color }: StatCardType) => {
  return (
    <div className="flex items-start gap-1 py-2 sm:py-2.5 px-2 lg:px-3 box rounded">
      <span
        className={`text-[40px] ${
          color === "warning"
            ? "text-warning-600"
            : color === "success"
            ? "text-success-600"
            : "text-primary-600"
        }`}
      >
        {iconList?.[icon]}
      </span>
      <div className="flex flex-col gap-0">
        <h3 className="text-xs uppercase tracking-wide">{title}</h3>
        <h2 className="text-xl font-bold">{count}</h2>
      </div>
    </div>
  );
};

export default StatCard;
