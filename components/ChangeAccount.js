// @ts-nocheck
import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import { gql, useMutation } from "@apollo/client";
import { setCookie } from "cookies-next";

//NOTE Mutation query
const UPDATE_USER = gql`
  mutation EditUser($userinput: EditUserInput) {
    editUser(userinput: $userinput) {
      id
      username
      name
      contact
      email
      role
      updatedAt
      token
    }
  }
`;

export default function ChangeAccount({ user, close }) {
  //NOTE state managing
  const [serverEmailError, setServerEmailError] = useState(null);

  //NOTE handle Mutation
  const [updateUser, { loading }] = useMutation(UPDATE_USER, {
    onCompleted(data) {
      setCookie("token", data.editUser.token);
      window.location.href = "/account";
    },

    onError(err) {
      console.log(err);
      if (err.graphQLErrors[0]) {
        const errors = err.graphQLErrors[0].extensions.errors;
        // @ts-ignore
        if (errors.email) {
          // @ts-ignore
          setServerEmailError(errors.email);
        }
      }
    },
  });

  //NOTE change handler -> error clearance
  const formikOnchangeHandler = (e, errorname) => {
    formik.handleChange(e);
    if (errorname == "email") setServerEmailError(null);
  };

  const formik = useFormik({
    initialValues: {
      name: user.name,
      contact: user.contact,
      email: user.email,
    },
    validationSchema: yup.object({
      name: yup.string().required("Required"),
      contact: yup.string().required("Required"),
      email: yup.string().email("Invalid email address").required("Required"),
    }),
    onSubmit: (values) => {
      if (
        values.email === user.email &&
        values.contact === user.contact &&
        values.name === user.name
      ) {
        toast.warning("No changes");
      } else {
        let variables = {
          userinput: {},
        };
        if (values.email !== user.email) {
          variables.userinput.email = values.email;
        }
        if (values.contact !== user.contact) {
          variables.userinput.contact = values.contact;
        }
        if (values.name !== user.name) {
          variables.userinput.name = values.name;
        }
        updateUser({ variables });
      }
    },
  });
  return (
    <div className="fixed flex justify-center items-center top-0 left-0 w-full h-full backdrop-blur-md backdrop-brightness-50">
      <form
        className="relative flex flex-col bg-gray-200 rounded gap-3 p-10"
        onBlur={formik.handleBlur}
        onSubmit={formik.handleSubmit}
      >
        <button
          className="absolute -right-3 -top-3 bg-red-800 rounded-full w-5 h-5 flex p-4 text-white justify-center items-center font-bold"
          onClick={close}
        >
          X
        </button>
        <div className="">
          <span className="text-3xl font-bold">Edit Account</span>
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-semibold" htmlFor="name">
            Name
          </label>
          {formik.touched.name && formik.errors.name ? (
            <span className="text-sm text-red-600">{formik.errors.name}</span>
          ) : null}
          <input
            name="name"
            className="p-2"
            type="text"
            onBlur={formik.handleBlur}
            value={formik.values.name}
            onChange={(e) => formikOnchangeHandler(e, "name")}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-semibold" htmlFor="email">
            Email
          </label>
          {formik.touched.email && formik.errors.email ? (
            <span className="text-sm text-red-600">{formik.errors.email}</span>
          ) : null}
          <input
            name="email"
            className="p-2"
            type="text"
            onBlur={formik.handleBlur}
            value={formik.values.email}
            onChange={(e) => formikOnchangeHandler(e, "email")}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-semibold" htmlFor="">
            Contact
          </label>
          {formik.touched.contact && formik.errors.contact ? (
            <span className="text-sm text-red-600">
              {formik.errors.contact}
            </span>
          ) : null}
          <input
            name="contact"
            className="p-2"
            type="text"
            onBlur={formik.handleBlur}
            value={formik.values.contact}
            onChange={(e) => formikOnchangeHandler(e, "contact")}
          />
          <input
            className="bg-red-900 p-2 mt-5 text-white rounded"
            type="submit"
            value={"Change"}
          />
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}
