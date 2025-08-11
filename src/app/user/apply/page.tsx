"use client";
import { useUser } from "@/context/UserContext";
import { useSearchParams } from "next/navigation";
import Affidavit from "./component/Affidavit";

export default function ApplyPage() {
  const searchParams = useSearchParams();
  const certificate = searchParams.get("certificate") || "";
  const { user } = useUser();

  if (!user) {
    return <p>Please log in to apply for a certificate.</p>;
  }

  return (
    <>
      <h1 className="text-4xl font-bold text-center uppercase">
        Apply for "
        {certificate
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")}
        "
      </h1>
      {certificate === "affidavit" && <Affidavit />}
    </>
  );
}
