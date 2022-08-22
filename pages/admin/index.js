import React from "react";
import { isUser } from "../../lib/user";
import AdminLayout from "../../components/AdminLayout";
import Link from "next/link";


export default function Admin({ user }) {
  return (
    <AdminLayout user={user} size={"h-screen"}>
      <div className="h-full bg-stone-900">
        <div className="flex w-full p-5 gap-5">
          <Link href={"/admin/movies"}>
          <a className="bg-white p-5 rounded hover:bg-red-800 hover:text-white">Movies</a>
          </Link>
          <Link href={"/admin/livechat"}>
          <a className="bg-white p-5 rounded hover:bg-red-800 hover:text-white">Live Chat</a>
          </Link>
          <Link href={"/admin/report"}>
          <a className="bg-white p-5 rounded hover:bg-red-800 hover:text-white">Reports</a>
          </Link>
        </div>
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
