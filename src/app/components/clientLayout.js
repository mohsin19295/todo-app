"use client";

import ApolloWrapper from "../providers/apolloWrapper";
import AppNav from "./AppNav";
import ProgressBar from "./progressBar";

export default function ClientLayout({ children }) {
  return (
    <>
      <ProgressBar />
      <main className="flex min-h-screen flex-col bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] text-white">
        <AppNav />
        <div className="flex w-full flex-1 items-start justify-center px-0 pt-8 pb-8">
          <ApolloWrapper>{children}</ApolloWrapper>
        </div>
      </main>
    </>
  );
}