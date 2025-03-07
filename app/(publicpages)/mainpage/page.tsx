"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function mainpage() {
  const router = useRouter();
  useEffect(() => {
    router.push("/mainpage/1");
  }, []);

  return null;
}

export default mainpage;
