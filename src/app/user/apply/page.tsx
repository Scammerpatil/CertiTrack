"use client";
import { useUser } from "@/context/UserContext";
import { useSearchParams } from "next/navigation";
import Affidavit from "./component/Affidavit";
import BirthCertificate from "./component/DomicileCertificate";
import DomicileCertificate from "./component/DomicileCertificate";
import IncomeCertificate from "./component/IncomeCertificate";
import NonCreamyLayerCertificate from "./component/NonCreamyLayer";
import Payment from "@/Components/Payment/Payment";

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
      {certificate === "birth_certificate" && <BirthCertificate />}
      {certificate === "domicile_certificate" && <DomicileCertificate />}
      {certificate === "income_certificate" && <IncomeCertificate />}
      {certificate === "non-creamy_layer_certificate" && (
        <NonCreamyLayerCertificate />
      )}
    </>
  );
}
