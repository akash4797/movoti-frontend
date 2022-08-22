import React, { useState } from "react";
import Layout from "../components/Layout";
import * as yup from "yup";
import { useFormik } from "formik";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { CgSpinner } from "react-icons/cg";
import { isUser } from "../lib/user";

//NOTE Mutation query
const REGISTER_USER = gql`
  mutation Register($userinput: RegisterInput) {
    register(userinput: $userinput) {
      id
      username
      email
      role
      updatedAt
      name
      contact
    }
  }
`;

export default function Signup() {
  //NOTE state managing
  const [serverUserError, setServerUserError] = useState(null);
  const [serverEmailError, setServerEmailError] = useState(null);
  const [serverPasswordError, setServerPasswordError] = useState(null);
  const [serverConfirmPasswordError, setServerConfirmPasswordError] =
    useState(null);

  //NOTE router initializing
  const router = useRouter();

  //NOTE handle Mutation
  const [registerUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, __) {
      router.push("/login");
    },

    onError(err) {
      const errors = err.graphQLErrors[0].extensions.errors;
      // @ts-ignore
      if (errors.username) {
        // @ts-ignore
        setServerUserError(errors.username);
      }

      // @ts-ignore
      if (errors.email) {
        // @ts-ignore
        setServerEmailError(errors.email);
      }

      // @ts-ignore
      if (errors.password) {
        // @ts-ignore
        setServerPasswordError(errors.password);
      }

      // @ts-ignore
      if (errors.passMatch) {
        // @ts-ignore
        setServerConfirmPasswordError(errors.passMatch);
      }
    },
  });

  //NOTE change handler -> error clearance
  const formikOnchangeHandler = (e, errorname) => {
    formik.handleChange(e);
    if (errorname == "username") setServerUserError(null);
    if (errorname == "email") setServerEmailError(null);
    if (errorname == "password") setServerPasswordError(null);
    if (errorname == "confirmpassrword") setServerConfirmPasswordError(null);
  };

  //NOTE formik form handler
  const formik = useFormik({
    initialValues: {
      username: "",
      name: "",
      contact: "",
      email: "",
      password: "",
      confirmpassword: "",
    },
    validationSchema: yup.object({
      username: yup
        .string()
        .max(15, "Must be 15 characters or less")
        .required("Required"),
      name: yup.string().required("Name is Required"),
      contact: yup.string().required("Contact is required"),
      email: yup.string().email("Invalid email address").required("Required"),
      password: yup
        .string()
        .min(5, "Minimum 5 character is required")
        .required("Required"),
      confirmpassword: yup
        .string()
        .oneOf([yup.ref("password")], "Password did not match"),
    }),
    onSubmit: (values) => {
      let variables = {
        userinput: {
          username: values.username,
          password: values.password,
          email: values.email,
          confirmPassword: values.confirmpassword,
          name: values.name,
          contact: values.contact,
        },
      };
      registerUser({ variables });
    },
  });
  return (
    <Layout size={"h-screen"} user={null}>
      <div className="bg-stone-900 h-full flex justify-center items-center">
        <form
          className="flex flex-col shadow-lg py-10 bg-white w-full md:w-1/3 justify-center items-center gap-4 rounded-lg"
          onBlur={formik.handleBlur}
          onSubmit={formik.handleSubmit}
        >
          <div>
            <h1 className="text-xl font-bold">Register</h1>
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
            {formik.touched.name && formik.errors.name ? (
              <span className="text-sm text-red-600">{formik.errors.name}</span>
            ) : null}
            <input
              type="text"
              name="name"
              className="px-3 py-2 rounded border border-black"
              placeholder="Name"
              onBlur={formik.handleBlur}
              onChange={(e) => formikOnchangeHandler(e, "name")}
              value={formik.values.name}
            />
          </div>
          <div className="flex flex-col gap-1">
            {formik.touched.contact && formik.errors.contact ? (
              <span className="text-sm text-red-600">
                {formik.errors.contact}
              </span>
            ) : null}
            <input
              type="text"
              name="contact"
              className="px-3 py-2 rounded border border-black"
              placeholder="Contact"
              onBlur={formik.handleBlur}
              onChange={(e) => formikOnchangeHandler(e, "contact")}
              value={formik.values.contact}
            />
          </div>
          <div className="flex flex-col gap-1">
            {serverEmailError != null ? (
              <span className="text-sm text-red-600">{serverEmailError}</span>
            ) : null}
            {formik.touched.email && formik.errors.email ? (
              <span className="text-sm text-red-600">
                {formik.errors.email}
              </span>
            ) : null}
            <input
              type="email"
              name="email"
              className="px-3 py-2 rounded border border-black"
              placeholder="Email"
              onBlur={formik.handleBlur}
              onChange={(e) => formikOnchangeHandler(e, "email")}
              value={formik.values.email}
            />
          </div>
          <div className="flex flex-col gap-1">
            {serverPasswordError != null ? (
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
          <div className="flex flex-col gap-1">
            {serverConfirmPasswordError != null ? (
              <span className="text-sm text-red-600">
                {serverConfirmPasswordError}
              </span>
            ) : null}
            {formik.touched.confirmpassword && formik.errors.confirmpassword ? (
              <span className="text-sm text-red-600">
                {formik.errors.confirmpassword}
              </span>
            ) : null}
            <input
              type="password"
              name="confirmpassword"
              className="px-3 py-2 rounded border border-black"
              placeholder="Confirm Password"
              onBlur={formik.handleBlur}
              onChange={(e) => formikOnchangeHandler(e, "confirmpassword")}
              value={formik.values.confirmpassword}
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
    </Layout>
  );
}

export async function getServerSideProps({ req }) {
  const user = await isUser(req.cookies["token"]);
  if (user && user.user.role !== "Admin") {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }
  return {
    props: {}, // Will be passed to the page component as props
  };
}
