import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-zinc-800 bg-black/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        {/* Left: Brand */}
        <button
          onClick={() => navigate("/")}
          className="text-lg font-semibold tracking-tight text-white hover:opacity-80 transition"
        >
          DemoApp
        </button>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/login")}
            className="text-sm font-medium text-zinc-300 hover:text-white transition"
          >
            Log in
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black shadow-sm hover:bg-zinc-100 transition"
          >
            Sign up
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
