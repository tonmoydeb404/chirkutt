import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { toast } from "react-hot-toast";
import { BiArrowBack, BiImageAlt } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import InputGroup from "../../common/components/Forms/InputGroup";
import { usePrivateAuth } from "../../common/outlet/PrivateOutlet";
import { authSignIn } from "../../features/auth/authSlice";
import iconList from "../../lib/iconList";
import { useUpdateAvatarMutation } from "../../services/usersApi";

const Avatar = () => {
  const [updateAvatar, avatarResult] = useUpdateAvatarMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const auth = usePrivateAuth();
  const [avatar, setAvatar] = useState<File | null>();
  const [avatarSrc, setAvatarSrc] = useState<string | ArrayBuffer | undefined>(
    undefined
  );

  const convertToBase64 = (file: File) => {
    return new Promise<ArrayBuffer | string | null>((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e?.target?.files?.[0];

      if (!file) throw Error("invalid file");
      if (!(file.size / 1024 / 1024 < 2))
        throw Error("Image size must be of 2MB or less");

      const base64 = await convertToBase64(file);
      if (!base64) throw Error("invalid image file");

      setAvatar(file);
      setAvatarSrc(base64);
    } catch (error: any) {
      console.log(error);
      toast.error(error?.message || "cannot upload file");
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if (!auth.user?.uid) throw Error("authorization error");
      if (!avatar) throw Error("invalid file");
      // updating avatar
      const response = await updateAvatar({
        uid: auth.user.uid,
        file: avatar,
      }).unwrap();
      if (!response) throw Error("something wents to wrong");
      // updating local auth
      const user = response.updatedUser;
      dispatch(authSignIn(user));
      // reset state
      setAvatar(null);
    } catch (error) {
      console.log(error);
    }
  };

  // use user image as default
  useEffect(() => {
    if (auth.status === "AUTHORIZED" && auth.user) {
      setAvatarSrc(auth.user.avatar);
    }
  }, [auth]);

  return (
    <>
      <Helmet>
        <title>Change Avatar - Chirkutt</title>
      </Helmet>

      <form onSubmit={handleSubmit}>
        {/* header */}
        <div className="flex items-center mb-5 gap-2">
          <button onClick={() => navigate(-1)} className="text-primary-600">
            <BiArrowBack />
          </button>
          <h3 className="text-lg font-medium">Change Avatar</h3>

          <div className="flex items-center gap-1 ml-auto">
            {avatar ? (
              <button className="btn btn-sm btn-primary" type="submit">
                save <span>{iconList.check}</span>
              </button>
            ) : null}
            <Link to={"/settings"} className="btn btn-sm btn-theme">
              cancel
            </Link>
          </div>
        </div>

        {avatarResult.isError ? (
          <p className="p-4 bg-error-600/30 rounded mb-10">
            {typeof avatarResult.error === "string"
              ? avatarResult.error
              : "something wents to wrong"}
          </p>
        ) : null}
        {avatarResult.isLoading ? (
          <p className="p-4 bg-warning-600/30 rounded mb-10">
            avatar updating...
          </p>
        ) : null}
        {avatarResult.isSuccess ? (
          <p className="p-4 bg-success-600/30 rounded mb-10">
            successfully updated.
          </p>
        ) : null}

        {/* form body */}
        <InputGroup
          id="avatar"
          name="avatar"
          label="upload a image"
          type="file"
          multiple={false}
          accept="image/**"
          inputClass="form-input"
          onChange={handleAvatar}
        />

        {/* form image */}

        <div className="flex items-center justify-center w-full min-h-[300px] bg-neutral-300 dark:bg-neutral-800 mt-5 rounded">
          {avatarSrc ? (
            <img
              src={avatarSrc as string}
              alt="avatar"
              className="w-[200px] h-[200px]"
            />
          ) : (
            <div className="text-neutral-500 rounded flex">
              <BiImageAlt className="text-7xl" />
            </div>
          )}
        </div>
      </form>
    </>
  );
};

export default Avatar;
