import React from "react";
import AdminLayout from "../../components/AdminLayout";
import { isUser } from "../../lib/user";

export default function Livechat({ user }) {
  return (
    <AdminLayout user={user} size={"h-screen"}>
      <div className="text-xl text-white h-full bg-stone-800 flex justify-center items-center">
        Live Chat feature will be here. Websocket will be needed here.
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps({ req }) {
  const user = await isUser(req.cookies["token"]);
  let loggedinUser = null;
  if (user && user.user.role === "Admin") {
    loggedinUser = user.user;
  } else {
    return {
      redirect: {
        permanent: false,
        destination: "/admin/login",
      },
    };
  }
  return {
    props: {
      user: loggedinUser,
    }, // Will be passed to the page component as props
  };
}
