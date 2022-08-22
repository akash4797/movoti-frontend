import React from "react";
import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import ApolloProvider from "../context/ApolloProvider";
import { CartProvider } from "react-use-cart";

function MyApp({ Component, pageProps }) {
  return (
    <CartProvider>
      <ApolloProvider>
        <Component {...pageProps} />
      </ApolloProvider>
    </CartProvider>
  );
}

export default MyApp;
