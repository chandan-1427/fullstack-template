import React from "react";
import { useAuth } from "../context/useAuth";

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <h2 className="text-sm sm:text-base font-medium text-zinc-400">
          You are not authenticated.
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950/80 p-8 shadow-xl backdrop-blur">
          <h1 className="mb-2 text-center text-2xl font-semibold tracking-tight">
            Welcome, {user.username} 👋
          </h1>
          <p className="mb-6 text-center text-sm text-zinc-400">
            {user.email}
          </p>

          <div className="mt-4 flex flex-col gap-3">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/70 px-4 py-3 text-left">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                Status
              </p>
              <p className="mt-1 text-sm text-zinc-200">
                You are signed in to DemoApp.
              </p>
            </div>

            <button
              onClick={logout}
              className="mt-4 w-full rounded-lg bg-red-500 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-400 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
