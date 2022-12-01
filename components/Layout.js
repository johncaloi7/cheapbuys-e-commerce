import React, { useContext, useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Cookies from "js-cookie";
import Link from "next/link";
import Head from "next/head";
import { Store } from "../utils/Store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import links from "../utils/links";
import { Menu } from "@headlessui/react";

export default function Layout({ children, title }) {
  const { status, data: session } = useSession();

  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const [cartItemsCount, setCartItemsCount] = useState(0);

  const logoutHandler = () => {
    Cookies.remove("cart");
    dispatch({ type: "CART_RESET" });
    signOut({ callbackUrl: "/login" });
  };

  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
  }, [cart.cartItems]);
  return (
    <>
      <Head>
        <title>{title ? title + " - CheapBuys" : "CheapBuys"}</title>
        <meta name="description" content="CheapBuys E-Commerce" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ToastContainer position="top-left" limit={1} />

      <section className="flex flex-col min-h-screen justify-between">
        <header>
          <nav className="flex h-16 items-center px-12 justify-between shadow-md">
            <Link className="text-3xl font-bold" href="/">
              CheapBuys
            </Link>
            <div>
              <Link className="p-2 text-lg" href="/cart">
                Cart
                {cartItemsCount > 0 && (
                  <span className="ml-1 rounded-full bg-orange-400 px-2 py-1 text-xs font-bold text-white">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
              {status === "loading" ? (
                "Loading"
              ) : session?.user ? (
                <Menu>
                  <Menu.Button className="text-lg pl-2">
                    {session.user.name}
                  </Menu.Button>
                  <Menu.Items className="flex flex-col mr-4 mt-2 absolute right-0 w-56 origin-top-right bg-gray-100  shadow-lg ">
                    {links.map((link) => (
                      <Menu.Item
                        className="text-black py-4 ml-2"
                        as="a"
                        key={link.href}
                        href={link.href}
                      >
                        {link.label}
                      </Menu.Item>
                    ))}
                    <Menu.Item
                      as="a"
                      href="#"
                      onClick={logoutHandler}
                      className="text-black py-4 ml-2"
                    >
                      Logout
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              ) : (
                <Link className="p-2 text-lg" href="/login">
                  Login
                </Link>
              )}
            </div>
          </nav>
        </header>
        <main className="container m-auto mt-12 px-4">{children}</main>
        <footer className="flex h-16 justify-center items-center shadow-inner">
          <p className="font-bold">
            Copyright &copy; {new Date().getFullYear()} CheapBuys
          </p>
        </footer>
      </section>
    </>
  );
}
