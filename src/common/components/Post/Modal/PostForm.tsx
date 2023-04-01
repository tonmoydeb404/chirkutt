import { Formik } from "formik";
import * as yup from "yup";
import { useAppDispatch } from "../../../../app/hooks";
import { closePostModal } from "../../../../features/postModal/postModalSlice";
import iconList from "../../../../lib/iconList";
import TextGroup from "../../forms/TextGroup";

type PostFormProps = {
  defaultValue: string;
  onSubmit: (text: string) => Promise<any>;
  title: string;
  buttonText: string;
};

const PostForm = ({
  defaultValue,
  onSubmit,
  title,
  buttonText,
}: PostFormProps) => {
  const dispatch = useAppDispatch();
  const close = () => dispatch(closePostModal());

  // submit handler
  const onSubmitHandler = async (
    { text }: { text: string },
    { resetForm }: { resetForm: () => void }
  ) => {
    await onSubmit(text);
    // reset form state
    resetForm();
    // close form
    close();
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        text: defaultValue,
      }}
      validationSchema={() =>
        yup.object().shape({
          text: yup.string().min(1).max(300).required(),
        })
      }
      onSubmit={onSubmitHandler}
    >
      {({
        values,
        errors,
        handleChange,
        handleBlur,
        handleSubmit,
        resetForm,
      }) => (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col rounded box w-full h-screen min-[501px]:h-auto flex-1 min-[501px]:flex-none min-[501px]:w-[400px] py-3 px-4 gap-3"
        >
          <div className="flex items-center">
            <h2 className="font-medium mr-auto text-lg">{title}</h2>

            <button
              type="button"
              className="btn-icon btn-sm btn-ghost text-lg"
              onClick={close}
            >
              {iconList.close}
            </button>
          </div>
          <div className="">
            <TextGroup
              id="newpost"
              placeholder="share your chirkutt"
              inputClass="h-[150px] bg-neutral-900"
              name="text"
              value={values.text}
              onChange={handleChange}
              errorText={errors.text}
              onBlur={handleBlur}
            />
          </div>
          <div className="flex items-center justify-end gap-1">
            <button className="btn btn-primary" type="submit">
              {buttonText}
            </button>
            <button
              type="button"
              className="btn btn-theme"
              onClick={async () => {
                close();
                resetForm();
              }}
            >
              cancel
            </button>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default PostForm;
