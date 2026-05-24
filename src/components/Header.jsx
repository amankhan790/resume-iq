import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/react";
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const Header = () => {
  return (
    <nav className="flex justify-between bg-green-300/10 border-b border-black/10 py-4 px-6 lg:px-20 fixed top-0 left-0 right-0 z-50 border backdrop-blur-2xl">
      <Link to="/" className="text-2xl font-bold">
        ResumeIq
      </Link>
      <div className="flex items-center gap-2 lg:gap-4">
        <Show when="signed-out">
          <SignInButton mode="modal">
            <Button className="bg-white text-black border border-black">
              Sign In
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button>Get Started</Button>
          </SignUpButton>
          <UserButton />
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </div>
    </nav>
  );
};

export default Header;
