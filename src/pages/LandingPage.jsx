import React from "react";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import resumeData from "../data/data";
import { useUser, SignInButton } from "@clerk/react";

const LandingPage = () => {
  const { isSignedIn } = useUser();

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
        {!isSignedIn ? (
          <SignInButton
            mode="modal"
            signUpFallbackRedirectUrl="/upload"
            fallbackRedirectUrl="/upload"
          >
            <Button className="mt-10 text-lg bg-green-500 text-white border-none hover:bg-green-600 cursor-pointer font-bold px-8 py-5">
              Get Started
            </Button>
          </SignInButton>
        ) : (
          <Link to="/upload">
            <Button className="mt-10 text-lg bg-green-500 text-white border-none hover:bg-green-600 cursor-pointer font-bold px-8 py-5">
              Upload Now
            </Button>
          </Link>
        )}
      </div>

      <div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Featured Resumes</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumeData.map((resume) => (
            <div key={resume.id} className="bg-white rounded-lg shadow-2xl p-4">
              <h3 className="text-xl font-bold mt-4">{resume.name}</h3>
              <p className="text-gray-600 mb-4">{resume.role}</p>
              <img
                src={resume.image}
                alt={resume.name}
                className="w-full  rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingPage;
