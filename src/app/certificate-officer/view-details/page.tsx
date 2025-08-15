"use client";

import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ApplicationDetailsPage() {
  const [application, setApplication] = useState<any>(null);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const type = searchParams.get("type");

  useEffect(() => {
    if (id && type) {
      axios
        .get(`/api/certificate/get-application-details?id=${id}&type=${type}`)
        .then((res) => setApplication(res.data.application || null))
        .catch(() => toast.error("Failed to fetch application details"));
    }
  }, [id, type]);

  if (!id || !type) {
    return (
      <div className="text-center text-error mt-10">
        No application ID or type provided
      </div>
    );
  }

  if (!application) {
    return (
      <div className="text-center h-full w-full flex items-center justify-center">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  const renderDocs = (docs: any[]) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {docs.map((doc, idx) => (
        <div key={idx} className="card bg-base-200 p-4">
          <h4 className="font-semibold uppercase">{doc.name || "Document"}</h4>
          <a
            href={doc.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link link-primary"
          >
            View / Download
          </a>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6 capitalize">
      <h1 className="text-4xl font-bold text-center uppercase">
        {application?.type || "Certificate"} Details
      </h1>

      {/* General Info */}
      {application?.generalInfo && (
        <div className="card bg-base-300 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Applicant Information</h2>
            {application.generalInfo.fullName && (
              <p>
                <strong>Full Name:</strong> {application.generalInfo.fullName}
              </p>
            )}
            {application.generalInfo.dob && (
              <p>
                <strong>Date of Birth:</strong>{" "}
                {new Date(application.generalInfo.dob).toLocaleDateString(
                  "en-IN",
                  {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }
                )}
              </p>
            )}
            {application.generalInfo.address && (
              <p>
                <strong>Address:</strong> {application.generalInfo.address}
              </p>
            )}
            {application.generalInfo.district && (
              <p>
                <strong>District:</strong> {application.generalInfo.district}
              </p>
            )}
            {application.generalInfo.taluka && (
              <p>
                <strong>Taluka:</strong> {application.generalInfo.taluka}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Child Details */}
      {application?.childName && (
        <div className="card bg-base-300 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Child Details</h2>
            <p>
              <strong>Name:</strong> {application.childName}
            </p>
            {application.gender && (
              <p>
                <strong>Gender:</strong> {application.gender}
              </p>
            )}
            {application.dob && (
              <p>
                <strong>Date of Birth:</strong>{" "}
                {new Date(application.dob).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            )}
            {application.placeOfBirth && (
              <p>
                <strong>Place of Birth:</strong> {application.placeOfBirth}
              </p>
            )}
            {application.address && (
              <p>
                <strong>Address:</strong> {application.address}
              </p>
            )}
            {application?.permanentAddress && (
              <p>
                <strong>Permanent Address:</strong>{" "}
                {application.permanentAddress}
              </p>
            )}
          </div>
        </div>
      )}
      {/* Parent Details */}
      {application?.parents && (
        <div className="card bg-base-300 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Parent Details</h2>
            {application.parents.father && (
              <p>
                <strong>Father Name:</strong> {application.parents.father}
              </p>
            )}
            {application.parents.mother && (
              <p>
                <strong>Mother Name:</strong> {application.parents.mother}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Hospital Details */}
      {application?.hospitalDetails && (
        <div className="card bg-base-300 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Hospital Details</h2>
            {application.hospitalDetails.name && (
              <p>
                <strong>Name:</strong> {application.hospitalDetails.name}
              </p>
            )}
            {application.hospitalDetails.address && (
              <p>
                <strong>Address:</strong> {application.hospitalDetails.address}
              </p>
            )}
            {application.hospitalDetails.contactNumber && (
              <p>
                <strong>Contact:</strong>{" "}
                {application.hospitalDetails.contactNumber}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Parent Identity Proof */}
      {application?.parentIdentityProof && (
        <div className="card bg-base-300 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Parent Identity Proof</h2>
            <p className="space-x-2">
              <span>{application.parentIdentityProof.type}</span>
              <span>- </span>
              <a
                href={application.parentIdentityProof.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link link-primary"
              >
                View / Download
              </a>
            </p>
          </div>
        </div>
      )}

      {/* Marriage Certificate */}
      {application?.marriageCertificate && (
        <div className="card bg-base-300 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Marriage Certificate</h2>
            <p className="space-x-2">
              <span>{application.marriageCertificate.type}</span>
              <span>- </span>
              <a
                href={application.marriageCertificate.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link link-primary"
              >
                View / Download
              </a>
            </p>
          </div>
        </div>
      )}

      {/* Proof of Identity */}
      {application?.proofOfIdentity?.fileUrl && (
        <div className="card bg-base-300 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Proof of Identity</h2>
            <p className="space-x-2">
              <span>{application.proofOfIdentity.type}</span>
              <span>- </span>
              <a
                href={application.proofOfIdentity.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link link-primary"
              >
                View / Download
              </a>
            </p>
          </div>
        </div>
      )}

      {application?.ageProof?.fileUrl && (
        <div className="card bg-base-300 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Proof of Age</h2>
            <p className="space-x-2">
              <span>{application.ageProof.type}</span>
              <span>- </span>
              <a
                href={application.ageProof.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link link-primary"
              >
                View / Download
              </a>
            </p>
          </div>
        </div>
      )}

      {application?.residencyProof?.fileUrl && (
        <div className="card bg-base-300 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Proof of Residency</h2>
            <p className="space-x-2">
              <span>{application.residencyProof.type}</span>
              <span>- </span>
              <a
                href={application.residencyProof.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link link-primary"
              >
                View / Download
              </a>
            </p>
          </div>
        </div>
      )}

      {/* Proof of Address */}
      {application?.proofOfAddress?.fileUrl && (
        <div className="card bg-base-300 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Proof of Address</h2>
            <p className="space-x-2">
              <span>{application.proofOfAddress.type}</span>
              <span>- </span>
              <a
                href={application.proofOfAddress.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link link-primary"
              >
                View / Download
              </a>
            </p>
          </div>
        </div>
      )}

      {application?.casteProof?.fileUrl && (
        <div className="card bg-base-300 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Proof of Caste</h2>
            <p className="space-x-2">
              <span>{application.casteProof.type}</span>
              <span>- </span>
              <a
                href={application.casteProof.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link link-primary"
              >
                View / Download
              </a>
            </p>
          </div>
        </div>
      )}

      {application?.incomeProof?.fileUrl && (
        <div className="card bg-base-300 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Proof of Income</h2>
            <p className="space-x-2">
              <span className="capitalize">{application.incomeProof.type}</span>
              <span>- </span>
              <a
                href={application.incomeProof.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link link-primary"
              >
                View / Download
              </a>
            </p>
          </div>
        </div>
      )}

      {application?.tMinus2Income && (
        <div className="card bg-base-300 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Income History</h2>
            <table className="table table-auto bg-base-100">
              <thead>
                <tr>
                  <th>
                    {new Date().getFullYear() - 3} -{" "}
                    {new Date().getFullYear() - 2}
                  </th>
                  <th>
                    {new Date().getFullYear() - 2} -{" "}
                    {new Date().getFullYear() - 1}
                  </th>
                  <th>
                    {new Date().getFullYear() - 1} - {new Date().getFullYear()}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{application.tMinus2Income} ₹</td>
                  <td>{application.tMinus1Income} ₹</td>
                  <td>{application.currentIncome} ₹</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Self Declaration */}
      {application?.selfDeclaration?.fileUrl && (
        <div className="card bg-base-300 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Self Declaration</h2>
            <p className="space-x-2">
              <span className="capitalize">
                {application.selfDeclaration.type}
              </span>
              <span>- </span>
              <a
                href={application.selfDeclaration.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link link-primary"
              >
                View / Download
              </a>
            </p>
          </div>
        </div>
      )}

      {/* Status & Remarks */}
      <div className="card bg-base-300 shadow-lg">
        <div className="card-body">
          <h2 className="card-title">Status</h2>
          <span
            className={`badge ${
              application.status === "Approved"
                ? "badge-success"
                : application.status === "Rejected"
                ? "badge-error"
                : "badge-warning"
            }`}
          >
            {application.status}
          </span>
          {application?.remarkByCO && (
            <p className="capitalize">
              <strong>CO Remark:</strong> {application.remarkByCO}
            </p>
          )}
          {application?.remarkBySDO && (
            <p className="capitalize">
              <strong>SDO Remark:</strong> {application.remarkBySDO}
            </p>
          )}
          {application?.remarkByDO && (
            <p className="capitalize">
              <strong>DO Remark:</strong> {application.remarkByDO}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
