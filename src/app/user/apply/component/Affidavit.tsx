import { useUser } from "@/context/UserContext";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const Affidavit = () => {
  const { user } = useUser();
  if (!user) {
    return <p>Please log in to apply for a certificate.</p>;
  }
  const [proofOfIdentity, setProofOfIdentity] = useState<File | null>(null);
  const [proofOfAddress, setProofOfAddress] = useState<File | null>(null);
  const [selfDeclaration, setSelfDeclaration] = useState<File | null>(null);
  const [folderName, setFolderName] = useState<string>("");
  const [affidavit, setAffidavit] = useState({
    applicantId: "",
    generalInfo: {
      fullName: "",
      dob: "",
      address: "",
      district: "",
      taluka: "",
    },
    proofOfIdentity: {
      type: "",
      fileUrl: "",
    },
    proofOfAddress: {
      type: "",
      fileUrl: "",
    },
    selfDeclaration: {
      type: "",
      fileUrl: "",
    },
  });

  useEffect(() => {
    setAffidavit({
      ...affidavit,
      applicantId: user._id!.toString(),
      generalInfo: {
        ...affidavit.generalInfo,
        fullName: user.name,
        taluka: user.taluka || "",
        district: user.district || "",
      },
    });
    setFolderName(`affidavit/${user._id}-${Date.now()}`);
  }, [user]);

  const handleDocumentUpload = (
    proofType: "proofOfIdentity" | "proofOfAddress" | "selfDeclaration",
    folderName: string,
    imageName: string,
    path: string
  ) => {
    if (!affidavit.generalInfo.fullName) {
      toast.error("Name is required for images");
      return;
    }
    if (
      (proofType === "proofOfIdentity" && proofOfIdentity) ||
      (proofType === "proofOfAddress" && proofOfAddress) ||
      (proofType === "selfDeclaration" && selfDeclaration)
    ) {
      const imageResponse = axios.postForm("/api/helper/upload-documents", {
        file:
          proofType === "proofOfIdentity"
            ? proofOfIdentity
            : proofType === "proofOfAddress"
            ? proofOfAddress
            : selfDeclaration,
        name: imageName,
        folderName: folderName,
      });
      toast.promise(imageResponse, {
        loading: "Uploading File...",
        success: (data: AxiosResponse) => {
          setAffidavit({
            ...affidavit,
            [path]: {
              type: affidavit[path].type,
              fileUrl: data.data.path,
            },
          });
          return "File Uploaded Successfully";
        },
        error: (err: unknown) => `This just happened: ${err}`,
      });
    } else {
      toast.error("Please select a file to upload.");
      return;
    }
  };

  const HandleApplyAffidavit = () => {
    if (
      affidavit.proofOfIdentity.fileUrl &&
      affidavit.proofOfAddress.fileUrl &&
      affidavit.selfDeclaration.fileUrl &&
      affidavit.generalInfo.address &&
      affidavit.generalInfo.dob
    ) {
      const response = axios.post("/api/certificate/affidavit/apply", {
        affidavit,
      });
      toast.promise(response, {
        loading: "Applying for affidavit...",
        success: (data) => {
          return "Affidavit applied successfully!";
        },
        error: (err) => {
          return "Failed to apply for affidavit.";
        },
      });
    } else {
      toast.error("Please upload all required files.");
    }
  };
  return (
    <>
      <div className="bg-base-300/50 border-2 rounded-md p-10 mt-6">
        <h1 className="text-lg font-semibold">Personal Details</h1>
        <hr className="my-1" />
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-base">
                Applicant ID
              </legend>
              <input
                type="text"
                className="input input-primary"
                value={affidavit.applicantId}
                readOnly
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-base">Full Name</legend>
              <input
                type="text"
                className="input input-primary"
                value={affidavit.generalInfo.fullName}
                readOnly
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-base">
                Date of Birth
              </legend>
              <input
                type="date"
                className="input input-primary"
                value={affidavit.generalInfo.dob}
                onChange={(e) =>
                  setAffidavit({
                    ...affidavit,
                    generalInfo: {
                      ...affidavit.generalInfo,
                      dob: e.target.value,
                    },
                  })
                }
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-base">District</legend>
              <input
                type="text"
                className="input input-primary"
                value={affidavit.generalInfo.district}
                readOnly
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-base">Taluka</legend>
              <input
                type="text"
                className="input input-primary"
                value={affidavit.generalInfo.taluka}
                readOnly
              />
            </fieldset>
          </div>
          <fieldset className="fieldset">
            <legend className="fieldset-legend text-base">Address</legend>
            <textarea
              className="textarea textarea-primary w-full"
              rows={3}
              value={affidavit.generalInfo.address}
              onChange={(e) =>
                setAffidavit({
                  ...affidavit,
                  generalInfo: {
                    ...affidavit.generalInfo,
                    address: e.target.value,
                  },
                })
              }
            ></textarea>
          </fieldset>
        </div>
        <div className="mt-4">
          <h1 className="text-lg font-semibold">Proof of Identity</h1>
          <hr className="my-1" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-base">Type</legend>
              <select
                name="proofOfIdentityType"
                id="proofOfIdentityType"
                className="select select-primary"
                value={affidavit.proofOfIdentity.type}
                onChange={(e) =>
                  setAffidavit({
                    ...affidavit,
                    proofOfIdentity: {
                      ...affidavit.proofOfIdentity,
                      type: e.target.value,
                    },
                  })
                }
              >
                <option value="" disabled>
                  Select Type
                </option>
                <option value="Passport">Passport</option>
                <option value="Aadhaar">Aadhaar</option>
                <option value="Voter ID">Voter ID</option>
                <option value="Driving License">Driving License</option>
                <option value="Electricity Bill">Electricity Bill</option>
              </select>
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-base">File</legend>
              <input
                type="file"
                className="file-input file-input-primary"
                onChange={(e) => setProofOfIdentity(e.target.files![0])}
                disabled={!affidavit.proofOfIdentity.type}
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-base">Preview</legend>
              {proofOfIdentity && (
                <a
                  href={URL.createObjectURL(proofOfIdentity)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  View Proof of Identity
                </a>
              )}
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-base">
                Upload Document
              </legend>
              <button
                className="btn btn-success"
                disabled={!proofOfIdentity}
                onClick={() => {
                  handleDocumentUpload(
                    "proofOfIdentity",
                    folderName,
                    `proofOfIdentity-${affidavit.applicantId}`,
                    "proofOfIdentity"
                  );
                }}
              >
                Upload
              </button>
            </fieldset>
          </div>
          <div className="mt-4">
            <h1 className="text-lg font-semibold">Proof of Address</h1>
            <hr className="my-1" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-base">Type</legend>
                <select
                  name="proofOfAddressType"
                  id="proofOfAddressType"
                  className="select select-primary"
                  value={affidavit.proofOfAddress.type}
                  onChange={(e) =>
                    setAffidavit({
                      ...affidavit,
                      proofOfAddress: {
                        ...affidavit.proofOfAddress,
                        type: e.target.value,
                      },
                    })
                  }
                >
                  <option value="" disabled>
                    Select Type
                  </option>
                  <option value="Passport">Passport</option>
                  <option value="Aadhaar">Aadhaar</option>
                  <option value="Voter ID">Voter ID</option>
                  <option value="Driving License">Driving License</option>
                  <option value="Electricity Bill">Electricity Bill</option>
                </select>
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-base">File</legend>
                <input
                  type="file"
                  className="file-input file-input-primary"
                  onChange={(e) => setProofOfAddress(e.target.files![0])}
                  disabled={!affidavit.proofOfAddress.type}
                />
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-base">Preview</legend>
                {proofOfAddress && (
                  <a
                    href={URL.createObjectURL(proofOfAddress)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    View Proof of Address
                  </a>
                )}
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-base">
                  Upload Document
                </legend>
                <button
                  className="btn btn-success"
                  disabled={!proofOfAddress}
                  onClick={() => {
                    handleDocumentUpload(
                      "proofOfAddress",
                      folderName,
                      `proofOfAddress-${affidavit.applicantId}`,
                      "proofOfAddress"
                    );
                  }}
                >
                  Upload
                </button>
              </fieldset>
            </div>
          </div>
          {/* Self Declaration */}
          <div className="mt-4">
            <h1 className="text-lg font-semibold">Self Declaration</h1>
            <hr className="my-1" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-base">Type</legend>
                <select
                  name="selfDeclarationType"
                  id="selfDeclarationType"
                  className="select select-primary"
                  value={affidavit.selfDeclaration.type}
                  onChange={(e) =>
                    setAffidavit({
                      ...affidavit,
                      selfDeclaration: {
                        ...affidavit.selfDeclaration,
                        type: e.target.value,
                      },
                    })
                  }
                >
                  <option value="" disabled>
                    Select Type
                  </option>
                  <option value="Notarized Affidavit">
                    Notarized Affidavit
                  </option>
                  <option value="Self-Attested Affidavit">
                    Self-Attested Affidavit
                  </option>
                </select>
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-base">File</legend>
                <input
                  type="file"
                  className="file-input file-input-primary"
                  onChange={(e) => setSelfDeclaration(e.target.files![0])}
                  disabled={!affidavit.selfDeclaration.type}
                />
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-base">Preview</legend>
                {selfDeclaration && (
                  <a
                    href={URL.createObjectURL(selfDeclaration)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    View Self Declaration
                  </a>
                )}
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-base">
                  Upload Document
                </legend>
                <button
                  className="btn btn-success"
                  disabled={!selfDeclaration}
                  onClick={() => {
                    handleDocumentUpload(
                      "selfDeclaration",
                      folderName,
                      `selfDeclaration-${affidavit.applicantId}`,
                      "selfDeclaration"
                    );
                  }}
                >
                  Upload
                </button>
              </fieldset>
            </div>
          </div>
        </div>
        <button
          className="btn btn-accent w-full mt-4"
          onClick={HandleApplyAffidavit}
        >
          Apply
        </button>
      </div>
    </>
  );
};

export default Affidavit;
