import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { gql, useLazyQuery } from "@apollo/client";
import { CgSpinner } from "react-icons/cg";
import { isUser } from "../../lib/user";
import { setCookie } from "cookies-next";
import { ToastContainer, toast } from "react-toastify";

//NOTE Mutation query
const LOGIN_USER = gql`
  query Login($userinput: LoginInput) {
    login(userinput: $userinput) {
      id
      username
      email
      role
      updatedAt
      token
    }
  }
`;

export default function Login() {
  //NOTE state managing
  const [serverUserError, setServerUserError] = useState(null);
  const [serverPasswordError, setServerPasswordError] = useState(null);

  //NOTE handle Mutation
  const [loginUser, { loading }] = useLazyQuery(LOGIN_USER, {
    onCompleted(data) {
      if(data.login.role === "Admin"){
        setCookie("token",data.login.token )
        window.location.href = "/admin";
      }else{
        // @ts-ignore
        setServerUserError("Username doesn't exist");
      }
    },
    onError(err) {
      if (err?.graphQLErrors[0]?.extensions.errors) {
        const errors = err.graphQLErrors[0].extensions.errors;
        // setServerError({ errors });
        // @ts-ignore
        if (errors.username) {
          // @ts-ignore
          setServerUserError(errors.username);
        }
        // @ts-ignore
        if (errors.password) {
          // @ts-ignore
          setServerPasswordError(errors.password);
        }
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  //NOTE change handler -> error clearance
  const formikOnchangeHandler = (e, errorname) => {
    formik.handleChange(e);
    if (errorname == "username") setServerUserError(null);
    if (errorname == "password") setServerPasswordError(null);
  };

  //NOTE formik form handler
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: yup.object({
      username: yup
        .string()
        .max(15, "Must be 15 characters or less")
        .required("Required"),
      password: yup
        .string()
        .min(5, "Minimum 5 character is required")
        .required("Required"),
    }),
    onSubmit: (values) => {
      let variables = {
        userinput: {
          username: values.username,
          password: values.password,
        },
      };
      loginUser({ variables });
    },
  });
  return (
    <div className="h-screen bg-stone-900">
      <div className="h-full flex justify-center items-center">
        <form
          className="flex flex-col shadow-lg py-10 bg-white w-full md:w-1/3 justify-center items-center gap-4 rounded-lg"
          onBlur={formik.handleBlur}
          onSubmit={formik.handleSubmit}
        >
          <div>
            <h1 className="text-xl font-bold">Admin Login</h1>
          </div>
          <div className="flex flex-col gap-1">
            {serverUserError != null ? (
              <span className="text-sm text-red-600">{serverUserError}</span>
            ) : null}
            {formik.touched.username && formik.errors.username ? (
              <span className="text-sm text-red-600">
                {formik.errors.username}
              </span>
            ) : null}
            <input
              type="text"
              name="username"
              className="px-3 py-2 rounded border border-black"
              placeholder="User Name"
              onBlur={formik.handleBlur}
              onChange={(e) => formikOnchangeHandler(e, "username")}
              value={formik.values.username}
            />
          </div>
          <div className="flex flex-col gap-1">
            {serverUserError == null && serverPasswordError != null ? (
              <span className="text-sm text-red-600">
                {serverPasswordError}
              </span>
            ) : null}
            {formik.touched.password && formik.errors.password ? (
              <span className="text-sm text-red-600">
                {formik.errors.password}
              </span>
            ) : null}
            <input
              type="password"
              name="password"
              className="px-3 py-2 rounded border border-black"
              placeholder="Password"
              onBlur={formik.handleBlur}
              onChange={(e) => formikOnchangeHandler(e, "password")}
              value={formik.values.password}
            />
          </div>
          <div className="flex justify-center items-center">
            <button
              type="submit"
              className=" bg-red-800 text-white px-10 py-2 rounded flex gap-2 justify-center items-center"
            >
              {loading ? (
                <div className="animate-spin h-6 w-6 flex justify-center items-center">
                  <CgSpinner color={"#c084fc"} />
                </div>
              ) : null}
              <span>Submit</span>
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export async function getServerSideProps({ req }) {
  const user = await isUser(req.cookies["token"]);
  if (user && user.user.role === "Admin") {
    return {
      redirect: {
        permanent: false,
        destination: "/admin",
      },
    };
  }
  return {
    props: {}, // Will be passed to the page component as props
  };
}
