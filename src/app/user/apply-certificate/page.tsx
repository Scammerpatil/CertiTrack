"use client";

import { IconFile } from "@tabler/icons-react";
import { useState } from "react";

type CertificateDocs = {
  proofOfIdentity: string[];
  proofOfAddress: string[];
  otherDocs?: string[];
  mandatoryDocument?: string[];
};

type Certificate = {
  name: string;
  description: string;
  docs: CertificateDocs;
  applicationFee?: number;
};

const certificates: Certificate[] = [
  {
    name: "Affidavit",
    description: "A sworn statement for legal purposes.",
    docs: {
      proofOfIdentity: [
        "Aadhaar",
        "Passport",
        "Ration Card",
        "Voter ID",
        "Driving License",
        "Electricity Bill",
      ],
      proofOfAddress: [
        "Passport",
        "Aadhaar",
        "Ration Card",
        "Voter ID",
        "Driving License",
        "Electricity Bill",
      ],
      mandatoryDocument: ["Self Declaration"],
    },
    applicationFee: 50,
  },
  {
    name: "Non-Creamy Layer Certificate",
    description:
      "Certificate for availing reservation benefits for OBC category.",
    docs: {
      proofOfIdentity: [
        "Aadhaar",
        "Passport",
        "Ration Card",
        "Voter ID",
        "Driving License",
        "Electricity Bill",
      ],
      proofOfAddress: [
        "Aadhaar",
        "Passport",
        "Ration Card",
        "Voter ID",
        "Driving License",
        "Electricity Bill",
      ],
      otherDocs: [
        "Proof of Caste of Relative",
        "Income Proof",
        "Affidavit for Parents",
        "Proof of Caste for Self",
      ],
      mandatoryDocument: [
        "Income Proof",
        "Affidavit for caste",
        "Proof of caste for self",
      ],
    },
    applicationFee: 60,
  },
  {
    name: "Birth Certificate",
    description: "Official proof of birth date and place.",
    docs: {
      proofOfIdentity: ["Parents' Identity Proof (Aadhaar, PAN)"],
      proofOfAddress: ["Proof of Address"],
      otherDocs: [
        "Child Name",
        "Date of Birth",
        "Place of Birth",
        "Parents' Name",
        "Address",
        "Hospital Birth Record",
        "Marriage Certificate of Parents",
      ],
      mandatoryDocument: ["Self Declaration"],
    },
    applicationFee: 30,
  },
  {
    name: "Income Certificate",
    description: "Official proof of income for various purposes.",
    docs: {
      proofOfIdentity: ["Any valid government-issued ID"],
      proofOfAddress: ["Any one valid address proof"],
      otherDocs: ["Income Proof (Form 16 / Income Proof by Gram Panchayat)"],
      mandatoryDocument: ["Self Declaration"],
    },
    applicationFee: 70,
  },
  {
    name: "Domicile Certificate",
    description: "Certificate proving your residence in a state/district.",
    docs: {
      proofOfIdentity: ["Any valid government-issued ID"],
      proofOfAddress: ["Any one valid address proof"],
      otherDocs: [
        "School Leaving Certificate",
        "Father's Domicile",
        "Residency Proof",
        "Gram Panchayat Proof",
      ],
      mandatoryDocument: ["Self Declaration"],
    },
    applicationFee: 40,
  },
];

// Utility: split into chunks of n items
function chunkArray<T>(arr: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    chunks.push(arr.slice(i, i + chunkSize));
  }
  return chunks;
}

export default function ApplyCertificate() {
  const [selected, setSelected] = useState<Certificate | null>(null);

  return (
    <>
      <h1 className="text-4xl font-bold text-center uppercase">
        Apply for Certificate
      </h1>

      {/* Certificate Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {certificates.map((certificate) => (
          <div
            key={certificate.name}
            className="p-4 border-b border-base-content/20 bg-base-300 rounded-2xl cursor-pointer hover:shadow-lg transition"
            onClick={() => {
              setSelected(certificate);
              (
                document.getElementById("document-modal") as HTMLDialogElement
              ).showModal();
            }}
          >
            <img
              src={`/officialLogo.png`}
              alt={certificate.name}
              className="w-full h-28 object-contain mb-4"
            />
            <h2 className="text-2xl font-semibold text-center my-2">
              {certificate.name}
            </h2>
            <p className="text-base-content/50 text-base">
              {certificate.description}
            </p>
          </div>
        ))}
      </div>

      {/* Modal */}
      <dialog id="document-modal" className="modal">
        <div className="modal-box w-11/12 max-w-3xl">
          <h3 className="font-bold text-2xl mb-6 bg-primary text-primary-content p-4">
            Certificate Name : {selected?.name}
          </h3>
          <p className="text-base-content/70 mb-4 text-2xl font-extrabold">
            Application Fee: {selected?.applicationFee} ₹
          </p>
          <h4 className="font-semibold mb-2 flex items-center gap-2 bg-accent text-accent-content p-3">
            <IconFile size={24} /> Required Documents:
          </h4>

          {/* Proof of Identity */}
          {selected?.docs.proofOfIdentity?.length ? (
            <div className="mb-4 border border-b border-base-content rounded-2xl overflow-hidden">
              <h5 className="text-xl bg-secondary text-secondary-content p-2">
                Proof of Identity (Any one):
              </h5>
              {chunkArray(selected.docs.proofOfIdentity, 3).map(
                (group, groupIdx) => (
                  <div key={groupIdx} className="flex w-full justify-around">
                    {group.map((doc, docIdx) => (
                      <span key={docIdx} className="text-base p-2">
                        {groupIdx * 3 + docIdx + 1}. {doc}
                      </span>
                    ))}
                  </div>
                )
              )}
            </div>
          ) : null}

          {/* Proof of Address */}
          {selected?.docs.proofOfAddress?.length ? (
            <div className="mb-4 border border-b border-base-content rounded-2xl overflow-hidden">
              <h5 className="text-xl bg-secondary text-secondary-content p-2">
                Proof of Address (Any one):
              </h5>
              {chunkArray(selected.docs.proofOfAddress, 3).map(
                (group, groupIdx) => (
                  <div key={groupIdx} className="flex w-full justify-around">
                    {group.map((doc, docIdx) => (
                      <span key={docIdx} className="text-base p-2">
                        {groupIdx * 3 + docIdx + 1}. {doc}
                      </span>
                    ))}
                  </div>
                )
              )}
            </div>
          ) : null}

          {/* Other Documents */}
          {selected?.docs.otherDocs?.length ? (
            <div className="mb-4 border border-b border-base-content rounded-2xl overflow-hidden">
              <h5 className="text-xl bg-secondary text-secondary-content p-2">
                Other Required Documents:
              </h5>
              <ul className="list-disc pl-6">
                {selected.docs.otherDocs.map((doc, idx) => (
                  <li key={idx} className="text-base p-2">
                    {doc}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {selected?.docs.mandatoryDocument?.length ? (
            <div className="mb-4 border border-b border-base-content rounded-2xl overflow-hidden">
              <h5 className="text-xl bg-secondary text-secondary-content p-2">
                Mandatory Documents (Any one):
              </h5>
              {chunkArray(selected.docs.mandatoryDocument, 3).map(
                (group, groupIdx) => (
                  <div key={groupIdx} className="flex w-full justify-start">
                    {group.map((doc, docIdx) => (
                      <span key={docIdx} className="text-base p-4">
                        {groupIdx * 3 + docIdx + 1}. {doc} -{" "}
                        <a
                          href={`../../sampleDocuments/${selected.name
                            .split(" ")
                            .map((word) => word.toLowerCase())
                            .join("_")}.pdf`}
                          className="link"
                          download={true}
                        >
                          Download the affidavit form from here
                        </a>
                      </span>
                    ))}
                  </div>
                )
              )}
            </div>
          ) : null}

          <div className="modal-action flex justify-between items-center">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
            {selected && (
              <a
                className="btn btn-primary"
                href={`/user/apply?certificate=${encodeURIComponent(
                  selected.name
                    .split(" ")
                    .map((word) => word.toLowerCase())
                    .join("_")
                )}`}
              >
                Apply
              </a>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}
