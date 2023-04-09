import iconList from "../../../../lib/iconList";

type ProfileStatProps = {
  icon: string;
  title: string;
  count: number;
  color: "primary" | "success" | "warning";
};

const ProfileStat = ({ icon, title, count, color }: ProfileStatProps) => {
  return (
    <div className={`profile-stat ${color}`}>
      <span className={`profile-stat_icon`}>{iconList?.[icon]}</span>
      <div className="flex flex-col gap-0">
        <h3 className="profile-stat_title">{title}</h3>
        <h2 className="profile-stat_amount">{count}</h2>
      </div>
    </div>
  );
};

export default ProfileStat;
