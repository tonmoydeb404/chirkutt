import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { toast } from "react-hot-toast";
import { BiImageAlt } from "react-icons/bi";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useNavigate } from "react-router-dom";
import { useUpdateAvatarMutation } from "../../api/usersApi";
import { useAppDispatch } from "../../app/hooks";
import InputGroup from "../../common/components/Forms/InputGroup";
import SettingsHeader from "../../common/components/Settings/SettingsHeader";
import StatusText from "../../common/components/StatusText";
import { usePrivateAuth } from "../../common/outlet/PrivateOutlet";
import { authSignIn } from "../../features/auth/authSlice";
import { getDataUrl } from "../../utilities/getDataUrl";

const ChangeAvatar = () => {
  const auth = usePrivateAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [avatarSrc, setAvatarSrc] = useState<string | ArrayBuffer>();
  const [updateAvatar, avatarResult] = useUpdateAvatarMutation();
  const [crop, setCrop] = useState<Crop>();
  const imgRef = useRef<HTMLImageElement>(null);

  const getImageBlob = async (image: HTMLImageElement, crop: Crop) => {
    const canvas = document.createElement("canvas");
    // image resulation
    canvas.width = 250;
    canvas.height = 250;
    // maintain sizing
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const ctx = canvas.getContext("2d");
    ctx?.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    return new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
      }, "image/jpeg");
    });
  };

  const handleCropSize = () => {
    // verify image ref
    if (imgRef.current !== null) {
      const img = imgRef.current;
      img.onload = (e) => {
        const width = img.width;
        const height = img.height;
        // get smallest size from width and height
        const smallerSize = width < height ? width : height;

        const newCrop: Crop = {
          width: smallerSize,
          height: smallerSize,
          // center crop
          x: width / 2 - smallerSize / 2,
          y: height / 2 - smallerSize / 2,
          unit: "px",
        };

        setCrop(newCrop);
      };
    }
  };

  const handleAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e?.target?.files?.[0];
      // validate file
      if (!file) throw Error("invalid file");
      if (!(file.size / 1024 / 1024 < 2))
        throw Error("Image size must be of 2MB or less");

      const dataUrl = await getDataUrl(file);
      if (!dataUrl) throw Error("invalid image file");

      setAvatarSrc(dataUrl);
    } catch (error: any) {
      // console.log(error);
      toast.error(error?.message || "cannot upload file");
      // reset from
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!auth.user?.uid) throw Error("authorization error");
      if (!imgRef.current || !crop) throw Error("invalid file");
      // updating avatar
      const blob = await getImageBlob(imgRef.current, crop);
      // converting blob into file
      const file = new File([blob], `${auth.user.uid}.jpeg`, {
        lastModified: Date.now(),
        type: blob.type,
      });
      // update avatar
      const response = await updateAvatar({
        uid: auth.user.uid,
        file,
      }).unwrap();
      // handle error
      if (!response) throw Error("something wents to wrong");
      // updating local auth
      const user = response.updatedUser;
      dispatch(authSignIn(user));
      // reset state
      setAvatarSrc(response.url);
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

  // update crop
  useEffect(() => {
    if (avatarSrc) {
      handleCropSize();
    }
  }, [avatarSrc]);

  const isNewAvatar = auth.user && avatarSrc !== auth.user?.avatar;

  return (
    <>
      <Helmet>
        <title>Change Avatar - Chirkutt</title>
      </Helmet>

      <form onSubmit={handleSubmit}>
        {/* header */}
        <SettingsHeader allow={!!isNewAvatar} title={"Change Avatar"} />

        <StatusText
          isLoading={avatarResult.isLoading}
          loadingText="updating avatar!"
          isError={avatarResult.isError}
          errorText="something wents to wrong!"
          isSuccess={avatarResult.isSuccess}
          successText="successfully updated avatar"
        />

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
        <span className="uppercase mt-5 inline-block text-sm font-medium">
          Preview
        </span>
        <div className="flex items-center justify-center w-full min-h-[300px] mt-1 rounded p-4 bg-[url('/images/grid-bg.jpg')] bg-cover bg-no-repeat bg-center">
          {avatarSrc ? (
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              minWidth={100}
              minHeight={100}
              aspect={1}
              keepSelection
              disabled={!isNewAvatar}
            >
              <img
                src={avatarSrc as string}
                alt="avatar"
                className="max-w-full"
                ref={imgRef}
              />
            </ReactCrop>
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

export default ChangeAvatar;
