import React from "react";
import { isUser } from "../../lib/user";
import AdminLayout from "../../components/AdminLayout";
import { gql, useQuery } from "@apollo/client";

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
    }
  }
`;

export default function Admin({ user }) {
  //NOTE handle Query

  const { loading, error, data } = useQuery(GET_MOVIES);

  if (error) {
    return <div className="">Something went wrong</div>;
  }

  return (
    <AdminLayout user={user} size={""}>
      <div className="h-full bg-stone-900">
        <div className="px-5 p-2 flex justify-start items-center">
          <button className="bg-red-800 text-white p-2">Add Movie</button>
        </div>
        <div className="flex w-full px-5 pb-5 gap-5 justify-center items-center">
          {loading ? (
            <span className="text-white text-xl font-bold">Loading...</span>
          ) : data.getmovies.length <= 0 ? (
            <span className="text-white">No Movies Found</span>
          ) : (
            <table className="table-fixed w-full bg-stone-600 text-white rounded">
              <thead className="text-left">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Genre</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Cast</th>
                  <th className="p-3">Rating</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Ticket Price</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.getmovies.map((movie) => {
                  return (
                    <tr
                      key={
                        // @ts-ignore
                        movie.id
                      }
                    >
                      <td className="p-3">
                        {
                          // @ts-ignore
                          movie.title
                        }
                      </td>
                      <td className="p-3">
                        {
                          // @ts-ignore
                          movie.genre
                        }
                      </td>
                      <td className="truncate p-3">
                        {
                          // @ts-ignore
                          movie.description
                        }
                      </td>
                      <td className="p-3">
                        {
                          // @ts-ignore
                          movie.cast
                        }
                      </td>
                      <td className="p-3">
                        {
                          // @ts-ignore
                          movie.rating
                        }
                      </td>
                      <td className="p-3">
                        {
                          // @ts-ignore
                          movie.type
                        }
                      </td>
                      <td className="p-3">
                        {
                          // @ts-ignore
                          movie.price
                        }
                      </td>
                      <td className="p-3 flex gap-2 justify-start items-center">
                        <button className="text-purple-400">Edit</button>
                        <button className="text-purple-400">Delete</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
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
