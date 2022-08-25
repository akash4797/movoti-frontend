import React from "react";
import { isUser } from "../../lib/user";
import Layout from "../../components/Layout";
import { gql, useQuery } from "@apollo/client";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import { useCart } from "react-use-cart";

//NOTE Mutation query
const GET_MOVIES = gql`
  query Getmovies {
    getmovies {
      id
      title
      genre
      description
      cast
      rating
      type
      price
      image
    }
  }
`;

export default function Movies({ user }) {
  const { loading, error, data } = useQuery(GET_MOVIES);

  const { addItem } = useCart();

  const addItemHandler = (item) => {
    addItem(item);
    toast.success("Item added sucessfully");
  };

  if (error) {
    return <div className="">Something went wrong</div>;
  }

  return (
    <Layout user={user} size={"h-full"}>
      <div className="h-full bg-stone-800 flex gap-5 w-full flex-wrap p-5">
        {loading ? (
          <div className="">Loading ...</div>
        ) : (
          data.getmovies.map((movie) => {
            return (
              <div
                className="w-60 h-96 relative rounded-lg"
                style={{
                  backgroundImage: `url(${movie.image})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
                key={movie.id}
              >
                <div className="absolute top-0 w-full bg-stone-800 p-2 rounded-t-lg bg-blend-overlay bg-opacity-75 flex flex-col justify-around items-center">
                  <span className="text-white text-lg font-semibold">
                    {movie.title}
                  </span>
                  <span className="text-white text-xs">{movie.price} BDT</span>
                </div>
                <div className="absolute bottom-0 rounded-b-lg w-full bg-stone-800 p-3 bg-blend-overlay bg-opacity-75 flex justify-around items-center">
                  <Link href={"/movies/" + movie.id}>
                    <a className="bg-red-800 text-white p-2 rounded">
                      View Details
                    </a>
                  </Link>
                  <button
                    className="bg-red-800 text-white p-2 rounded"
                    onClick={() => addItemHandler(movie)}
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            );
          })
        )}
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
