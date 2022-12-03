import React from "react";
import Link from "next/link";

export default function ProductItem({ product, addToCartHandler }) {
  return (
    <div className="card">
      {/* product image */}
      <Link href={`/product/${product.slug}`}>
        <img
          className="rounded shadow"
          src={product.image}
          alt={product.name}
        />
      </Link>

      {/* product details */}
      <div className="flex flex-col items-center justify-center p-5">
        <Link href={`/product/${product.slug}`}>
          <h2 className="text-xl font-semibold">{product.name}</h2>
        </Link>

        <p className="mb-2">{product.brand}</p>
        <p>${product.price}</p>

        <button
          className="primary-button"
          type="button"
          onClick={() => addToCartHandler(product)}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
