import { Form, Formik } from "formik";
import { BiSearch } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

const NavbarSearch = () => {
  const navigate = useNavigate();

  const handleSubmit = ({ query }: { query: string }) => {
    if (!query) return;
    navigate(`/search?q=${query}`);
  };

  return (
    <Formik
      initialValues={{ query: "" }}
      onSubmit={handleSubmit}
      validationSchema={() =>
        yup.object().shape({
          query: yup.string().min(1).max(500).required(),
        })
      }
    >
      {({ values, handleBlur, handleSubmit, handleChange, errors }) => {
        return (
          <Form
            onSubmit={handleSubmit}
            className="relative flex-1 sm:flex-none max-w-[300px] sm:w-[300px]"
          >
            <input
              id="query"
              type="text"
              name="query"
              className="w-full  text-sm pr-4 rounded bg-neutral-50 dark:bg-neutral-700/50 focus:outline-none border border-neutral-300 dark:border-neutral-700  focus:ring-1 focus:ring-primary-300 dark:focus:ring-primary-500 dark:placeholder:text-neutral-400"
              placeholder="search here..."
              value={values.query}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              <BiSearch />
            </button>
          </Form>
        );
      }}
    </Formik>
  );
};

export default NavbarSearch;
