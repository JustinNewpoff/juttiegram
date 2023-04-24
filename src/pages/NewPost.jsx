import React from "react";
import Navbar from "../components/Navbar";
import AddNewPost from "../components/AddNewPost";

export default function NewPost() {
  return (
    <div className="new-post">
      <Navbar />
      <AddNewPost />
    </div>
  );
}
