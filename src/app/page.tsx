"use client"

import Todo from "@/components/todo";
import { SessionProvider } from "next-auth/react";


export default function Home() {
  return (
    <SessionProvider>
      <Todo />
    </SessionProvider>
  )
}
