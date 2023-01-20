import { Formik } from "formik";
import { useState } from "react";
import { BiErrorAlt } from "react-icons/bi";
import { Link } from "react-router-dom";
import * as yup from "yup";
import { useAppDispatch } from "../../app/hooks";
import InputGroup from "../../common/components/Forms/InputGroup";
import { authSignIn } from "../../features/auth/authSlice";
import { signup } from "../../lib/auth";
import iconList from "../../lib/iconList";

type SignUpForm = {
    name: string;
    email: string;
    gender: "male" | "female" | "custom";
    password: string;
    confirmPassword: string;
};

const SignUp = () => {
    const dispatch = useAppDispatch();
    const [viewPass, setViewPass] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<null | string>(null);

    const toggleViewPass = (): void => {
        setViewPass((prevState) => !prevState);
    };

    const onSubmitHandler = async (
        { name, email, gender, password }: SignUpForm,
        { resetForm }: { resetForm: () => void }
    ) => {
        setErrorMsg(null);
        try {
            const response = await signup({ name, email, password, gender });
            if (!response) throw "something went to wrong. please try again";
            dispatch(authSignIn(response));
            resetForm();
        } catch (error: any) {
            setErrorMsg(error);
        }
    };

    return (
        <div className="py-10">
            <h2 className="text-2xl mb-5 font-semibold flex items-center gap-1">
                <span className="text-primary-600">{iconList.signup}</span> Join
                Chirkutt
            </h2>
            {errorMsg ? (
                <p className="p-4 bg-error-600/30 rounded mb-10 max-w-[500px]">
                    {errorMsg}
                </p>
            ) : null}
            <Formik
                initialValues={{
                    name: "",
                    email: "",
                    gender: "" as "male",
                    password: "",
                    confirmPassword: "",
                }}
                validationSchema={() =>
                    yup.object().shape({
                        name: yup.string().min(2).max(20).required(),
                        email: yup.string().email().required(),
                        gender: yup
                            .string()
                            .oneOf(["male", "female", "custom"])
                            .required(),
                        password: yup.string().min(6).required(),
                        confirmPassword: yup.string().when("password", {
                            is: (val: string) => val && val.length > 0,
                            then: yup
                                .string()
                                .oneOf(
                                    [yup.ref("password")],
                                    "both password need to be same"
                                ),
                        }),
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
                }) => (
                    <form
                        className="flex flex-col gap-4"
                        onSubmit={handleSubmit}
                    >
                        <InputGroup
                            id="name"
                            name="name"
                            label="Name"
                            placeholder="your name"
                            value={values.name}
                            onChange={handleChange}
                            errorText={errors.name}
                            onBlur={handleBlur}
                        />
                        <InputGroup
                            id="email"
                            name="email"
                            label="Email"
                            placeholder="your@email.com"
                            value={values.email}
                            onChange={handleChange}
                            errorText={errors.email}
                            onBlur={handleBlur}
                        />
                        <div
                            className={`input-group`}
                            data-invalid={!!errors.gender}
                        >
                            <div className="input-group_header">
                                <label>Gender</label>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <label
                                    htmlFor="male"
                                    className="inline-flex gap-1 items-center"
                                >
                                    <input
                                        type="radio"
                                        name="gender"
                                        id="male"
                                        value={"male"}
                                        onChange={handleChange}
                                    />
                                    male
                                </label>
                                <label
                                    htmlFor="female"
                                    className="inline-flex gap-1 items-center"
                                >
                                    <input
                                        type="radio"
                                        name="gender"
                                        id="female"
                                        value={"female"}
                                        onChange={handleChange}
                                    />
                                    female
                                </label>
                                <label
                                    htmlFor="custom"
                                    className="inline-flex gap-1 items-center"
                                >
                                    <input
                                        type="radio"
                                        name="gender"
                                        id="custom"
                                        value={"custom"}
                                        onChange={handleChange}
                                    />
                                    custom
                                </label>
                            </div>

                            <div className="input-group_error">
                                <BiErrorAlt />
                                <p>{errors.gender}</p>
                            </div>
                        </div>
                        <InputGroup
                            id="password"
                            name="password"
                            label="Password"
                            placeholder={"*".repeat(8)}
                            type={viewPass ? "text" : "password"}
                            value={values.password}
                            onChange={handleChange}
                            errorText={errors.password}
                            onBlur={handleBlur}
                        >
                            <button
                                type="button"
                                className="p-1.5 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800"
                                onClick={toggleViewPass}
                            >
                                {viewPass ? iconList.eye : iconList.eye_slash}
                            </button>
                        </InputGroup>
                        <InputGroup
                            id="confirmPassword"
                            name="confirmPassword"
                            label="Confirm Password"
                            placeholder={"*".repeat(8)}
                            type={viewPass ? "text" : "password"}
                            value={values.confirmPassword}
                            onChange={handleChange}
                            errorText={errors.confirmPassword}
                            onBlur={handleBlur}
                        />

                        <button
                            className="btn btn-primary max-w-[100px] justify-center mt-5"
                            type="submit"
                        >
                            Join
                        </button>
                        <div className="flex items-center gap-2 font-normal text-sm">
                            <p>already have a account?</p>
                            <Link
                                to={"/signin"}
                                className="text-primary-600 hover:underline"
                            >
                                log in instead
                            </Link>
                        </div>
                    </form>
                )}
            </Formik>
        </div>
    );
};

export default SignUp;
