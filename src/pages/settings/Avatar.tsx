import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { toast } from "react-hot-toast";
import { BiArrowBack, BiImageAlt } from "react-icons/bi";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import InputGroup from "../../common/components/Forms/InputGroup";
import { usePrivateAuth } from "../../common/outlet/PrivateOutlet";
import { authSignIn } from "../../features/auth/authSlice";
import iconList from "../../lib/iconList";
import { useUpdateAvatarMutation } from "../../services/usersApi";

const Avatar = () => {
  const auth = usePrivateAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState<File | null>();
  const [avatarSrc, setAvatarSrc] = useState<string | ArrayBuffer | undefined>(
    undefined
  );
  const [updateAvatar, avatarResult] = useUpdateAvatarMutation();
  const [crop, setCrop] = useState<Crop>();
  const imgRef = useRef<HTMLImageElement>(null);

  const createImage = (url: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  const getCroppedImg = async (image: HTMLImageElement, crop: Crop) => {
    const canvas = document.createElement("canvas");
    /* setting canvas width & height allows us to 
    resize from the original image resolution */
    canvas.width = 250;
    canvas.height = 250;

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
          x: width / 2 - smallerSize / 2,
          y: height / 2 - smallerSize / 2,
          unit: "px",
        };

        setCrop(newCrop);
      };
    }
  };

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
      if (!avatar || !avatarSrc || !crop || imgRef.current === null)
        throw Error("invalid file");
      // updating avatar
      const blob = await getCroppedImg(imgRef.current, crop);

      const file = new File([blob], `${avatar.name}.jpeg`, {
        lastModified: Date.now(),
        type: blob.type,
      });
      const response = await updateAvatar({
        uid: auth.user.uid,
        file,
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

  // update crop
  useEffect(() => {
    if (avatarSrc) {
      handleCropSize();
    }
  }, [avatarSrc]);

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

        <div className="flex items-center justify-center w-full min-h-[300px] bg-neutral-300 dark:bg-neutral-800 mt-5 rounded p-4 bg-[url('https://th.bing.com/th/id/R.241d5d1dab79e2fab1f71db7264ffc44?rik=rPYV0euGnhN%2f3A&riu=http%3a%2f%2fbwillcreative.com%2fwp-content%2fuploads%2f2020%2f06%2fgrid-crop-overlay-915x617.jpg&ehk=vWz0GpsIxSFYgoI%2b%2ftyJ2NkNLlR%2b7KXqTtnnO4OdZrs%3d&risl=&pid=ImgRaw&r=0')] bg-cover bg-no-repeat bg-center">
          {avatarSrc ? (
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              minWidth={100}
              minHeight={100}
              aspect={1}
              keepSelection
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

export default Avatar;

// TODO: Refactor this code
