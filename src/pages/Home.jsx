import { useState } from "react";
import Navbar from "../components/Navbar";
import Content from "../components/Content";
import home from "../styles/home.scss";

export default function Home({ user }) {
  return (
    <div className="home">
      <Navbar user={user} />
      <Content user={user} />
    </div>
  );
}
