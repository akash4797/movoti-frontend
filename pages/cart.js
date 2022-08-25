import React, { useEffect, useState } from "react";
import { isUser } from "../lib/user";
import Layout from "../components/Layout";
import { useCart } from "react-use-cart";
import { ToastContainer, toast } from "react-toastify";

export default function Cart({ user }) {
  const { items, updateItemQuantity, cartTotal,emptyCart } = useCart();


  const [cartItems, setCartItem] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const checkoutHandler = ()=>{
    emptyCart();
    toast.success("Checkout!")
  }

  useEffect(() => {
    // @ts-ignore
    setCartItem(items);
    setTotalPrice(cartTotal);
  }, [items, cartTotal]);

  // console.log(cartItems[0]);
  // console.log(cartTotal);

  return (
    <Layout user={user} size={"h-full"}>
      <div className="p-5">
        <h1 className="text-3xl font-bold underline">Cart</h1>
        <ul className="flex flex-col gap-3 mt-5">
          {cartItems.map((item) => {
            return (
              <li
                className="flex gap-5"
                key={
                  // @ts-ignore
                  item.id
                }
              >
                <span>
                  Movie Name:{" "}
                  {
                    // @ts-ignore
                    item.title
                  }
                </span>
                <span>
                  Price:{" "}
                  {
                    // @ts-ignore
                    item.price
                  }
                </span>
                <span className="bg-gray-800 text-white p-1 rounded">
                  Quantity:{" "}
                  {
                    // @ts-ignore
                    item.quantity
                  }
                </span>
                <div className="flex gap-3">
                  <button
                    className="bg-red-800 text-white rounded w-10 p-1"
                    onClick={() =>
                      updateItemQuantity(
                        // @ts-ignore
                        item.id,
                        // @ts-ignore
                        item.quantity + 1
                      )
                    }
                  >
                    +
                  </button>
                  <button
                    className="bg-red-800 text-white rounded w-10 p-1"
                    onClick={() =>
                      updateItemQuantity(
                        // @ts-ignore
                        item.id,
                        // @ts-ignore
                        item.quantity - 1
                      )
                    }
                  >
                    -
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="mt-5 flex flex-col w-fit gap-3">
          <h1 className="text-2xl font-bold">Total: {totalPrice}</h1>
          {totalPrice > 0 && (
            <button className="bg-red-800 text-white rounded p-1" onClick={checkoutHandler}>
              Checkout
            </button>
          )}
        </div>
      </div>
      <ToastContainer />
    </Layout>
  );
}

export async function getServerSideProps({ req }) {
  const user = await isUser(req.cookies["token"]);
  let loggedinUser = null;
  if (user && user.user.role !== "Admin") {
    loggedinUser = user.user;
  }
  return {
    props: {
      user: loggedinUser,
    }, // Will be passed to the page component as props
  };
}
