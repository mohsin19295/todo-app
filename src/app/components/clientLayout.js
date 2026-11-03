"use client";

import ApolloWrapper from "../providers/apolloWrapper";
import AppNav from "./AppNav";
import ProgressBar from "./progressBar";

export default function ClientLayout({ children }) {
  return (
    <>
      <ProgressBar />
      <main className="flex h-full min-h-0 flex-col overflow-hidden bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] text-white">
        <AppNav />
        <div className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col px-4 pt-4 pb-4 sm:px-6">
          <ApolloWrapper>{children}</ApolloWrapper>
        </div>
      </main>
    </>
  );
}