"use client";

import ApolloWrapper from "../providers/apolloWrapper";
import ProgressBar from "./progressBar";

export default function ClientLayout({children}) {
  return (
      <>
      <ProgressBar/>
        <main className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] text-white">
          <ApolloWrapper>{children}</ApolloWrapper>
        </main>
      </>
  )
}