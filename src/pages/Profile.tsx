import { Link } from "react-router-dom";
import iconList from "../common/lib/iconList";

const Profile = () => {
  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-col sm:flex-row items-start gap-3 box p-3 sm:p-4 rounded">
          <img
            src="/images/logo/chirkutt-logo-primary.png"
            alt=""
            className="w-[60px]"
          />

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-semibold">Chirkutt</h2>
              <span>-</span>
              <span
                title="copy profile link"
                className="text-primary-600 text-sm hover:text-primary-700 cursor-copy"
              >
                @chirkutt
              </span>
            </div>
            <p className="text-sm">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus
              nisi iure corrupti commodi omnis consequatur magni nihil
            </p>

            <div className="flex items-center gap-1 mt-3">
              <Link to={"#"} className="btn btn-sm btn-theme ml-auto">
                {iconList.email}
                email
              </Link>
            </div>
          </div>
        </div>

        <div className="grid min-[500px]:grid-cols-2 sm:grid-cols-3 mt-5 gap-3">
          <div className="flex items-start gap-1 py-2 sm:py-2.5 px-2 sm:px-3 box rounded">
            <span className="text-[40px] text-primary-600">
              {iconList.post}
            </span>
            <div className="flex flex-col gap-0">
              <h3 className="text-xs uppercase tracking-wide">Chirkutts</h3>
              <h2 className="text-xl font-bold">20</h2>
            </div>
          </div>

          <div className="flex items-start gap-1 py-2 sm:py-2.5 px-2 sm:px-3 box rounded">
            <span className="text-[40px] text-success-600">
              {iconList.like}
            </span>
            <div className="flex flex-col gap-0">
              <h3 className="text-xs uppercase tracking-wide">Likes</h3>
              <h2 className="text-xl font-bold">200</h2>
            </div>
          </div>

          <div className="flex items-start gap-1 py-2 sm:py-2.5 px-2 sm:px-3 box rounded">
            <span className="text-[40px] text-warning-600">
              {iconList.comment}
            </span>
            <div className="flex flex-col gap-0">
              <h3 className="text-xs uppercase tracking-wide">comments</h3>
              <h2 className="text-xl font-bold">200</h2>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
