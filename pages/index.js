import Head from "next/head";
import React from "react";
import Layout from "../components/Layout";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import { isUser } from "../lib/user";
import { gql, useQuery } from "@apollo/client";
import { useCart } from "react-use-cart";
import { ToastContainer, toast } from "react-toastify";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

import { Navigation } from "swiper";

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

export default function Home({ user }) {
  const { addItem } = useCart();

  const addItemHandler = (item) => {
    addItem(item);
    toast.success("Item added sucessfully");
  };

  const { loading, error, data } = useQuery(GET_MOVIES);

  if (error) {
    return <div className="">Something went wrong</div>;
  }

  return (
    <div>
      <Head>
        <title>MovoTi</title>
        <meta name="description" content="MovoTi" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout size={null} user={user}>
        <div
          className="h-[80vh] bg-stone-900 text-white flex justify-center items-center flex-col gap-5 bg-blend-overlay"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1625&q=80)",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <h1 className="text-4xl font-bold text-center">
            Just another online platform for movie ticket
          </h1>
          <span className="w-1/2 text-center font-light">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus
            deserunt ratione, veniam nobis blanditiis aliquam laudantium
            asperiores numquam commodi quidem?
          </span>
          <div className="flex gap-3">
            <Link href={"/movies"}>
            <a className="p-3 hover:bg-red-900 bg-red-800 mt-3 font-semibold uppercase">
              View Shows
            </a>
            </Link>
            {user ? null : (
              <Link href={"/signup"}>
                <a className="p-3 border-2 border-red-800 mt-3 font-semibold uppercase">
                  Join Now
                </a>
              </Link>
            )}
          </div>
        </div>
        {loading ? (
          <span className="text-white text-xl font-bold">Loading...</span>
        ) : data.getmovies.length <= 0 ? (
          <span className="text-white"></span>
        ) : (
          <div className="py-12 px-5 bg-stone-900 text-white">
            <h1 className="text-2xl font-bold">Trending Now</h1>
            <Swiper
              slidesPerView={4}
              spaceBetween={60}
              slidesPerGroup={4}
              loop={true}
              loopFillGroupWithBlank={true}
              navigation={true}
              modules={[Navigation]}
              className="mySwiper h-96 mt-10 text-black"
            >
              {data.getmovies.map((movie) => {
                if (movie.type === "featured") {
                  return (
                    <SwiperSlide
                      key={movie.id}
                      className="bg-white rounded-lg relative"
                      style={{
                        backgroundImage: `url(${movie.image})`,
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                      }}
                    >
                      <div className="absolute top-0 w-full bg-stone-800 p-2 rounded-t-lg bg-blend-overlay bg-opacity-75 flex flex-col justify-around items-center">
                        <span className="text-white text-lg font-semibold">
                          {movie.title}
                        </span>
                        <span className="text-white text-xs">
                          {movie.price} BDT
                        </span>
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
                    </SwiperSlide>
                  );
                }
              })}
            </Swiper>
          </div>
        )}

        {loading ? (
          <span className="text-white text-xl font-bold">Loading...</span>
        ) : data.getmovies.length <= 0 ? (
          <span className="text-white"></span>
        ) : (
          <div className="py-12 px-5 bg-stone-900 text-white">
            <h1 className="text-2xl font-bold">Latest Released</h1>
            <Swiper
              slidesPerView={4}
              spaceBetween={60}
              slidesPerGroup={4}
              loop={true}
              loopFillGroupWithBlank={true}
              navigation={true}
              modules={[Navigation]}
              className="mySwiper h-96 mt-10 text-black"
            >
              {data.getmovies.map((movie) => {
                if (movie.type === "latest") {
                  return (
                    <SwiperSlide
                      key={movie.id}
                      className="bg-white rounded-lg relative"
                      style={{
                        backgroundImage: `url(${movie.image})`,
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                      }}
                    >
                      <div className="absolute rounded-t-lg top-0 w-full bg-stone-800 p-3 bg-blend-overlay bg-opacity-75 flex flex-col justify-around items-center">
                        <span className="text-white text-lg font-semibold">
                          {movie.title}
                        </span>
                        <span className="text-white text-xs">
                          {movie.price} BDT
                        </span>
                      </div>
                      <div className="absolute rounded-b-lg bottom-0 w-full bg-stone-800 p-3 bg-blend-overlay bg-opacity-75 flex justify-around items-center">
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
                    </SwiperSlide>
                  );
                }
              })}
            </Swiper>
          </div>
        )}

        <footer className="bg-black text-white py-5 flex justify-center items-center">
          © Created by Abrar Fahim
        </footer>
      </Layout>
      <ToastContainer />
    </div>
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
