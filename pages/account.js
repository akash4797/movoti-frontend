import React from "react";
import Layout from "../components/Layout";
import { isUser } from "../lib/user";
import Popup from "reactjs-popup";
import ChangeAccount from "../components/ChangeAccount";

export default function Account({ user }) {
  return (
    <Layout size={"h-screen"} user={user}>
      <div
        className="h-full bg-stone-900 flex justify-center items-center bg-blend-overlay"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1625&q=80)",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="flex flex-col gap-4 bg-gray-300 p-10 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold">Account</h2>
          <span>User Name: {user.username}</span>
          <span>Name: {user.name}</span>
          <span>Email: {user.email}</span>
          <span>Contact: {user.contact}</span>
          <Popup
            trigger={
              <button className="bg-red-900 text-white p-1 rounded-lg mt-3">
                Edit
              </button>
            }
            modal
          >
            {
              // @ts-ignore
              (close) => <ChangeAccount user={user} close={close} />
            }
          </Popup>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ req }) {
  const user = await isUser(req.cookies["token"]);
  let loggedinUser = null;
  if (user && user.user.role !== "Admin") {
    loggedinUser = user.user;
  } else {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }
  return {
    props: {
      user: loggedinUser,
    }, // Will be passed to the page component as props
  };
}
