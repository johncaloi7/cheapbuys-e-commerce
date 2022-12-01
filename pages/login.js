import Link from "next/link";
import React, { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import Layout from "../components/Layout";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { getError } from "../utils/getError";
import { useRouter } from "next/router";

export default function login() {
  const { data: session } = useSession();

  const router = useRouter();
  const { redirect } = router.query;

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || "/");
    }
  }, [router, session, redirect]);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const submitHandler = async ({ email, password }) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Successfully logged in");
    } catch (error) {
      toast.error(getError(error));
    }
  };
  return (
    <Layout title="Login">
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="mx-auto max-w-screen-md"
      >
        <h1 className="mb-4 text-xl">Login</h1>
        <section className="mb-4">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            {...register("email", {
              required: "Please enter email",
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: "Please enter valid email",
              },
            })}
            className="w-full"
            id="email"
            autoFocus
          ></input>
          {errors.email && (
            <div className="text-red-500">{errors.email.message}</div>
          )}
        </section>
        <section className="mb-4">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            {...register("password", {
              required: "Please enter a password.",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long.",
              },
            })}
            className="w-full"
            id="password"
            autoFocus
          ></input>
          {errors.password && (
            <div className="text-red-500">{errors.password.message}</div>
          )}
        </section>
        <section className="mb-4">
          <button className="primary-button">Login</button>
        </section>
        <section className="mb-4">
          Don't have an account? <Link href="register">Register</Link>
        </section>
      </form>
    </Layout>
  );
}
