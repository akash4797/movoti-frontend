import React from "react";
import Link from "next/link";
import { deleteCookie } from "cookies-next";

export default function AdminLayout({ children, size, user }) {
  const logoutHandler = () => {
    deleteCookie("token");
    window.location.href = "/admin/login";
  };
  return (
    <div className={`flex flex-col ${size}`}>
      <div className="h-20 px-12 flex justify-between items-center bg-black text-white">
        <Link href={"/admin"}>
          <a className="text-2xl font-semibold">MovoTi</a>
        </Link>
        <div className="">
          <span className="text-lg font-bold">{user.username}</span>
        </div>
        <div className="flex gap-3 font-semibold">
          <button
            className="text-white hover:text-red-800"
            onClick={logoutHandler}
          >
            Logout
          </button>
        </div>
      </div>
      <div className="main h-full">{children}</div>
    </div>
  );
}
