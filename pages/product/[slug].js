import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import Image from "next/image";
import Layout from "../../components/Layout";
import { Store } from "../../utils/Store";
import db from "../../utils/db";
import Product from "../../models/Product";

export default function ProductScreen(props) {
  const { state, dispatch } = useContext(Store);
  const router = useRouter();
  const { product } = props;

  // const { query } = useRouter();
  // const { slug } = query;
  // const product = data.products.find((item) => item.slug === slug);

  if (!product) {
    return <Layout title="Produt Not Found">Produt not found</Layout>;
  }

  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      return toast.error("Sorry. Product is out of stock.");
    }

    dispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity: quantity },
    });

    router.push("/cart");
  };
  return (
    <Layout title={product.name}>
      <div className="py-2 font-bold text-xl text-slate-800 mb-3 w-36 underline decoration-slate-500 underline-offset-4">
        <Link href="/">Back to home</Link>
      </div>
      <section className="grid md:grid-cols-4 md:gap-3 mb-8">
        <article className="md:col-span-2">
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            className="rounded-lg"
          ></Image>
        </article>
        <article>
          <ul>
            <li className="text-lg">
              <h1>{product.name}</h1>
            </li>
            <li>Category: {product.category}</li>
            <li>Brand: {product.brand}</li>
            <li>
              {product.rating} of {product.numReviews} reviews
            </li>
            <li>Description: {product.description}</li>
          </ul>
        </article>
        <article>
          <section className="card p-5">
            <article className="mb-2 flex justify-between">
              <h1>Price</h1>
              <p>${product.price}</p>
            </article>
            <article className="mb-2 flex justify-between">
              <h1>Status</h1>
              <p>{product.countInStock > 0 ? "In Stock" : "Unavailable"}</p>
            </article>

            <button
              onClick={() => addToCartHandler()}
              className="primary-button w-full"
            >
              Add to cart
            </button>
          </section>
        </article>
      </section>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;

  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();

  return {
    props: {
      product: product ? db.convertDocToObj(product) : null,
    },
  };
}
