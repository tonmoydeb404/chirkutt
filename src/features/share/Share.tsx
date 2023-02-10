import { toPng } from "html-to-image";
import { useCallback, useRef } from "react";
import { toast } from "react-hot-toast";
import { BiCopyAlt, BiDownload } from "react-icons/bi";
import { BsTwitter, BsWhatsapp } from "react-icons/bs";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import iconList from "../../lib/iconList";
import { socialShare } from "../../utilities/socialShare";
import { hideShare, selectShare } from "./shareSlice";

const Share = () => {
  // ref
  const downloadRef = useRef<HTMLAnchorElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  // states
  const dispatch = useAppDispatch();
  const { show, text, author } = useAppSelector(selectShare);

  const links = text ? socialShare(text) : null;

  // copy to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      toast.dismiss("copyToClipboard");
      await navigator.clipboard.writeText(text);
      toast.success("copied to clipboard", { id: "copyToClipboard" });
    } catch (error) {
      toast.error("cannot copy post", { id: "copyToClipboard" });
    }
  };

  // save as image
  const saveImage = useCallback(async () => {
    const downloadElement = downloadRef.current;
    const imageElement = imageRef.current;

    if (imageElement && downloadElement) {
      toPng(imageElement, {
        cacheBust: true,
        canvasWidth: imageElement.offsetWidth * 3,
        canvasHeight: imageElement.offsetHeight * 3,
      })
        .then((dataUrl) => {
          downloadElement.href = dataUrl;
          downloadElement.click();
        })
        .catch((err) => {
          console.log("error");
        });
    }
  }, [imageRef, downloadRef]);

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full min-h-full bg-neutral-900/60 flex-col items-center justify-center ${
        show && text ? "flex" : "hidden"
      }`}
    >
      <div className="flex flex-col rounded box w-full max-w-[300px] sm:max-w-[400px] py-1.5 sm:py-3 px-2 sm:px-4 gap-3">
        {/* header */}
        <div className="flex items-center">
          <h2 className="font-medium mr-auto text-center text-lg">
            Share post
          </h2>

          <button
            type="button"
            className="btn-icon btn-sm btn-ghost text-lg"
            onClick={() => dispatch(hideShare())}
          >
            {iconList.close}
          </button>
        </div>
        {/* body */}
        <div
          className="bg-white text-neutral-800 py-2 px-3 flex flex-col justify-center items-stretch gap-3 h-[350px] relative "
          ref={imageRef}
        >
          <p className="text-base text-center mt-auto font-medium">{text}</p>
          <div className="flex items-center mt-auto justify-between mb-1">
            <span className="font-semibold  text-sm text-center">
              @{author}
            </span>
            <span className="inline-block text-sm font-semibold tracking-wide opacity-60">
              #chirkutt
            </span>
          </div>
        </div>
        {/* footer */}
        <div className="flex gap-1 sm:gap-2 items-center flex-wrap">
          <a
            className="btn btn-theme btn-icon text-xl sm:text-2xl"
            href={links?.twitter}
            target="_blank"
          >
            <BsTwitter />
          </a>
          <a
            className="btn btn-theme btn-icon text-xl sm:text-2xl"
            href={links?.whatsapp}
            target="_blank"
          >
            <BsWhatsapp />
          </a>
          <button
            className="btn btn-theme btn-icon text-xl sm:text-2xl"
            onClick={async () => await copyToClipboard(text || "")}
          >
            <BiCopyAlt />
          </button>
          <button
            className="btn btn-theme btn-icon text-xl sm:text-2xl"
            onClick={saveImage}
          >
            <BiDownload />
          </button>
        </div>
      </div>
      {/*  */}

      <a
        href="#"
        ref={downloadRef}
        download={
          text
            ? `${text.slice(0, 15).split(" ").join("-")}.png`
            : "CHIRKUTT.png"
        }
        className="hidden"
      ></a>
    </div>
  );
};

export default Share;
