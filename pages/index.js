import Head from "next/head";
import Sidebar from "../components/Sidebar";
import Login from "../components/Login";
import { useSession, signOut } from "next-auth/react";
import Loading from "../components/Loading";

export default function Home() {
  const { data: session, status } = useSession();

  <Head>
    <title>Whatsapp</title>
    <link rel="icon" href="/favicon.ico" />
  </Head>;

  return session && status === "authenticated" ? (
    <Sidebar />
  ) : status == "loading" ? (
    <Loading />
  ) : (
    <Login />
  );
}
