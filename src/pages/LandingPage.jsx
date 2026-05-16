import React from "react";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <section className="pt-28 lg:pt-32 text-center">
      <div className="py-16">
        <h1 className="text-6xl text-center font-bold ">
          Track Your Applications <br /> & Resumem Rating
        </h1>
        <h2 className="text-center text-2xl mt-5">
          Review your submissions and check{" "}
          <span className="text-purple-500 font-bold">AI-powered</span>{" "}
          feedback.
        </h2>
        <Link to="/upload">
          <Button className="mt-10 px-10 py-5">Upload Now</Button>
        </Link>
      </div>
    </section>
  );
};

export default LandingPage;
