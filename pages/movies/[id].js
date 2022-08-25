import React from "react";
import { useRouter } from "next/router";
import { gql, useQuery } from "@apollo/client";
import Layout from "../../components/Layout";
import { isUser } from "../../lib/user";
import { useCart } from "react-use-cart";
import { ToastContainer, toast } from "react-toastify";

//NOTE Mutation query
const GET_ONE_MOVIES = gql`
  query GetOnemovies($userinput: FindOneMovieInput) {
    getonemovie(userinput: $userinput) {
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

export default function OneMovie({ user }) {
  const router = useRouter();
  const { id } = router.query;

  const { addItem } = useCart();

  const addItemHandler = (item) => {
    addItem(item);
    toast.success("Item added sucessfully");
  };

  const { loading, error, data } = useQuery(GET_ONE_MOVIES, {
    variables: {
      userinput: {
        id: id,
      },
    },
  });

  if (error) {
    // console.log(data.getonemovie)
    console.log(error);
  }
  return (
    <Layout user={user} size={"h-screen"}>
      <div
        className="bg-stone-800 h-full text-white bg-blend-overlay"
        style={{
          backgroundImage: `url(${
            data?.getonemovie ? data.getonemovie.image : ""
          })`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        {loading ? (
          <div className="">Loading ...</div>
        ) : data.getonemovie ? (
          <div className="flex p-5 h-full gap-10 px-10 backdrop-blur-md">
            <div
              className="w-72 h-96 rounded-lg"
              style={{
                backgroundImage: `url(${data.getonemovie.image})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            ></div>
            <div className="detail flex flex-col">
              <h1 className="text-4xl font-bold">{data.getonemovie.title}</h1>
              <span className="mt-2">
                Imdb Rating: {data.getonemovie.rating}
              </span>
              <p className="mt-3">{data.getonemovie.description}</p>
              <div className="flex flex-col mt-5">
                <span className="font-semibold">Cast:</span>
                <span>{data.getonemovie.cast}</span>
              </div>
              <div className="flex gap-3 mt-5">
                {data.getonemovie.genre.split(", ").map((item, index) => {
                  return (
                    <span
                      className="bg-white text-black rounded p-2 text-xs"
                      key={index}
                    >
                      {item}
                    </span>
                  );
                })}
              </div>
              <span className="text-base mt-5 font-bold text-black bg-gray-200 w-fit p-2 rounded">
                Ticket Price: {data.getonemovie.price}
              </span>
              <button
                className="bg-red-800 text-white p-2 rounded w-fit mt-5"
                onClick={() => addItemHandler(data.getonemovie)}
              >
                Add to cart
              </button>
            </div>
          </div>
        ) : (
          <div className="">Something went wrong</div>
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
