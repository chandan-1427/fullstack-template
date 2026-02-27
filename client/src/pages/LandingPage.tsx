import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layouts/Navbar";
import Footer from "../components/layouts/Footer";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center pt-28 pb-16">
        <div className="max-w-3xl px-6 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">
            DemoApp • SaaS Starter
          </p>
          <h2 className="mb-4 text-4xl sm:text-5xl font-semibold tracking-tight">
            Build faster. Launch smarter.
          </h2>
          <p className="mb-8 text-sm sm:text-base text-zinc-400">
            A minimal starter kit built with React, TypeScript, and Tailwind CSS. 
            Ship auth, routing, and a clean UI without fighting the boilerplate.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => navigate("/signup")}
              className="w-full sm:w-auto rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black shadow-sm hover:bg-zinc-100 transition"
            >
              Get started
            </button>
            <button
              onClick={() => navigate("/login")}
              className="w-full sm:w-auto rounded-full border border-zinc-700 px-6 py-2.5 text-sm font-medium text-zinc-200 hover:border-zinc-500 hover:text-white transition"
            >
              Log in
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-zinc-900 bg-zinc-950/80 py-16">
        <div className="mx-auto grid max-w-5xl gap-6 px-6 md:grid-cols-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-indigo-400">
              🚀 Fast setup
            </p>
            <p className="text-sm text-zinc-300">
              Spin up a fully wired auth-ready SaaS shell in minutes, not days.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-indigo-400">
              🔒 Secure by default
            </p>
            <p className="text-sm text-zinc-300">
              Token-based auth, refresh flows, and protected routes ready to extend.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-indigo-400">
              ⚡ Scalable foundation
            </p>
            <p className="text-sm text-zinc-300">
              A clean React + TypeScript structure that grows with your product.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
