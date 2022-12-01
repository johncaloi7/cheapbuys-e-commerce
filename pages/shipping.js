import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import Layout from "../components/Layout";
import CheckoutWizard from "../components/CheckoutWizard";
import { Store } from "../utils/Store";
import { useRouter } from "next/router";

export default function ShippingScreen() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm();

  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { shippingAddress } = cart;
  const router = useRouter();

  useEffect(() => {
    setValue("fullName", shippingAddress.fullName);
    setValue("address", shippingAddress.address);
    setValue("city", shippingAddress.city);
    setValue("postalCode", shippingAddress.postalCode);
    setValue("country", shippingAddress.country);
  }, [setValue, shippingAddress]);

  const submitHandler = ({ fullName, address, city, postalCode, country }) => {
    dispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: { fullName, address, city, postalCode, country },
    });
    Cookies.set(
      "cart",
      JSON.stringify({
        ...cart,
        shippingAddress: {
          fullName,
          address,
          city,
          postalCode,
          country,
        },
      })
    );

    router.push("/payment");
  };

  return (
    <Layout title="Shipping Address">
      <CheckoutWizard activeStep={1} />

      <form
        className="mx-auto max-w-screen-md my-12"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-8 text-2xl font-semibold">Shipping Address</h1>

        {/* full name */}
        <section className="mb-4">
          <label htmlFor="fullName">Full Name</label>
          <input
            className="w-full"
            id="fullName"
            autoFocus
            {...register("fullName", {
              required: "Please enter full name",
            })}
          />
          {errors.fullName && (
            <p className="text-red-500">{errors.fullName.message}</p>
          )}
        </section>

        {/* shipping address */}
        <section className="mb-4">
          <label htmlFor="address">Address</label>
          <input
            className="w-full"
            id="address"
            autoFocus
            {...register("address", {
              required: "Please enter house address",
            })}
          />
          {errors.address && (
            <p className="text-red-500">{errors.address.message}</p>
          )}
        </section>

        {/* City */}
        <section className="mb-4">
          <label htmlFor="city">City</label>
          <input
            className="w-full"
            id="city"
            autoFocus
            {...register("city", {
              required: "Please enter city",
            })}
          />
          {errors.city && <p className="text-red-500">{errors.city.message}</p>}
        </section>

        {/* Postal code */}
        <section className="mb-4">
          <label htmlFor="postalCode">Postal Code</label>
          <input
            className="w-full"
            id="postalCode"
            autoFocus
            {...register("postalCode", {
              required: "Please enter postal code",
            })}
          />
          {errors.postalCode && (
            <p className="text-red-500">{errors.postalCode.message}</p>
          )}
        </section>

        {/* Country */}
        <section className="mb-4">
          <label htmlFor="country">Country</label>
          <input
            className="w-full"
            id="country"
            autoFocus
            {...register("country", {
              required: "Please enter country",
            })}
          />
          {errors.country && (
            <p className="text-red-500">{errors.country.message}</p>
          )}
        </section>

        {/* submit */}
        <section className="mt-8 flex">
          <button className="primary-button">Next</button>
        </section>
      </form>
    </Layout>
  );
}

ShippingScreen.auth = true;
