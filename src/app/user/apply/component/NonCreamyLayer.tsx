import { useUser } from "@/context/UserContext";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const NonCreamyLayerCertificate = () => {
  const { user } = useUser();
  if (!user) {
    return <p>Please log in to apply for a certificate.</p>;
  }
  const [proofOfIdentity, setProofOfIdentity] = useState<File | null>(null);
  const [proofOfAddress, setProofOfAddress] = useState<File | null>(null);
  const [incomeProof, setIncomeProof] = useState<File | null>(null);
  const [casteProof, setCasteProof] = useState<File | null>(null);
  const [selfDeclaration, setSelfDeclaration] = useState<File | null>(null);
  const [folderName, setFolderName] = useState<string>("");
  const [nonCreamyLayerCertificate, setNonCreamyLayerCertificate] = useState({
    applicantId: "",
    generalInfo: {
      fullName: "",
      address: "",
      district: "",
      taluka: "",
      dob: "",
    },
    proofOfIdentity: {
      type: "",
      fileUrl: "",
    },
    proofOfAddress: {
      type: "",
      fileUrl: "",
    },
    incomeProof: {
      type: "",
      fileUrl: "",
    },
    casteProof: {
      type: "",
      fileUrl: "",
    },
    selfDeclaration: {
      type: "",
      fileUrl: "",
    },
  });

  useEffect(() => {
    setNonCreamyLayerCertificate({
      ...nonCreamyLayerCertificate,
      applicantId: user._id!.toString(),
      generalInfo: {
        ...nonCreamyLayerCertificate.generalInfo,
        fullName: user.name,
        taluka: user.taluka || "",
        district: user.district || "",
      },
    });
    setFolderName(`nonCreamyLayerCertificate/${user._id}-${Date.now()}`);
  }, [user]);

  const handleDocumentUpload = (
    proofType:
      | "proofOfIdentity"
      | "proofOfAddress"
      | "incomeProof"
      | "casteProof"
      | "selfDeclaration",
    folderName: string,
    imageName: string,
    path: string
  ) => {
    if (!nonCreamyLayerCertificate.generalInfo.fullName) {
      toast.error("Name is required for images");
      return;
    }
    if (
      (proofType === "proofOfIdentity" && proofOfIdentity) ||
      (proofType === "proofOfAddress" && proofOfAddress) ||
      (proofType === "incomeProof" && incomeProof) ||
      (proofType === "selfDeclaration" && selfDeclaration) ||
      (proofType === "casteProof" && casteProof)
    ) {
      console.log("Uploading file:", proofType, folderName, imageName);
      const imageResponse = axios.postForm("/api/helper/upload-documents", {
        file:
          proofType === "proofOfIdentity"
            ? proofOfIdentity
            : proofType === "proofOfAddress"
            ? proofOfAddress
            : proofType === "incomeProof"
            ? incomeProof
            : proofType === "casteProof"
            ? casteProof
            : selfDeclaration,
        name: imageName,
        folderName: folderName,
      });
      toast.promise(imageResponse, {
        loading: "Uploading File...",
        success: (data: AxiosResponse) => {
          setNonCreamyLayerCertificate({
            ...nonCreamyLayerCertificate,
            [path]: {
              type: (nonCreamyLayerCertificate as any)[path].type,
              fileUrl: data.data.path,
            },
          });
          console.log(imageResponse);
          return "File Uploaded Successfully";
        },
        error: (err: unknown) => `This just happened: ${err}`,
      });
    } else {
      toast.error("Please select a file to upload.");
      return;
    }
  };

  const handlePayment = async () => {
    if (
      !proofOfIdentity ||
      !proofOfAddress ||
      !selfDeclaration ||
      !nonCreamyLayerCertificate.generalInfo.address ||
      !nonCreamyLayerCertificate.generalInfo.dob
    ) {
      toast.error("Please fill all required fields and upload documents.");
      return;
    }
    if (!confirm("Do you want to proceed with the payment?")) return;
    const amount = 60;
    toast.loading("Processing payment....");
    try {
      const paymentRes = await axios.post("/api/payment", {
        amount: amount,
      });
      toast.dismiss();
      const options = {
        key: "rzp_test_cXJvckaWoN0JQx",
        amount: paymentRes.data.amount || amount * 100,
        currency: "INR",
        name: "CertiTrack",
        description: "Certificate Payment",
        order_id: paymentRes.data.orderId,
        handler: () => {
          toast.success("Payment Successful!");
          handleApplyNonCreamyLayerCertificate();
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.phone,
        },
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        toast.error(response.error.description);
      });
      rzp.open();
    } catch (error: any) {
      console.log(error);
      toast.dismiss();
      toast.error(error?.response?.data.message || "Payment failed");
    }
  };

  const handleApplyNonCreamyLayerCertificate = () => {
    if (
      nonCreamyLayerCertificate.proofOfIdentity.fileUrl &&
      nonCreamyLayerCertificate.proofOfAddress.fileUrl &&
      nonCreamyLayerCertificate.incomeProof.fileUrl &&
      nonCreamyLayerCertificate.selfDeclaration.fileUrl &&
      nonCreamyLayerCertificate.casteProof.fileUrl
    ) {
      const response = axios.post(
        "/api/certificate/non-creamy-layer-certificate/apply",
        {
          nonCreamyLayerCertificate,
        }
      );
      toast.promise(response, {
        loading: "Applying for Non-Creamy Layer Certificate...",
        success: (data) => {
          setNonCreamyLayerCertificate({
            applicantId: "",
            generalInfo: {
              fullName: "",
              address: "",
              district: "",
              taluka: "",
              dob: "",
            },
            proofOfIdentity: {
              type: "",
              fileUrl: "",
            },
            proofOfAddress: {
              type: "",
              fileUrl: "",
            },
            casteProof: {
              type: "",
              fileUrl: "",
            },
            incomeProof: {
              type: "",
              fileUrl: "",
            },
            selfDeclaration: {
              type: "",
              fileUrl: "",
            },
          });
          setProofOfIdentity(null);
          setSelfDeclaration(null);
          setProofOfAddress(null);
          setIncomeProof(null);
          return "Non-Creamy Layer Certificate applied successfully!";
        },
        error: (err) => {
          return "Failed to apply for Non-Creamy Layer Certificate.";
        },
      });
    } else {
      toast.error("Please upload all required files.");
    }
  };
  return (
    <>
      <div className="bg-base-300/50 border-2 rounded-md p-10 mt-6">
        <div>
          <h1 className="text-lg font-semibold">Personal Details</h1>
          <hr className="my-1" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-base">
                Applicant ID
              </legend>
              <input
                type="text"
                className="input input-primary"
                value={nonCreamyLayerCertificate.applicantId}
                readOnly
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-base">Full Name</legend>
              <input
                type="text"
                className="input input-primary"
                value={nonCreamyLayerCertificate.generalInfo.fullName}
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
                value={nonCreamyLayerCertificate.generalInfo.dob}
                onChange={(e) =>
                  setNonCreamyLayerCertificate({
                    ...nonCreamyLayerCertificate,
                    generalInfo: {
                      ...nonCreamyLayerCertificate.generalInfo,
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
                value={nonCreamyLayerCertificate.generalInfo.district}
                readOnly
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-base">Taluka</legend>
              <input
                type="text"
                className="input input-primary"
                value={nonCreamyLayerCertificate.generalInfo.taluka}
                readOnly
              />
            </fieldset>
          </div>
          <fieldset className="fieldset">
            <legend className="fieldset-legend text-base">Address</legend>
            <textarea
              className="textarea textarea-primary w-full"
              rows={3}
              value={nonCreamyLayerCertificate.generalInfo.address}
              onChange={(e) =>
                setNonCreamyLayerCertificate({
                  ...nonCreamyLayerCertificate,
                  generalInfo: {
                    ...nonCreamyLayerCertificate.generalInfo,
                    address: e.target.value,
                  },
                })
              }
            ></textarea>
          </fieldset>
        </div>

        <div className="mt-4">
          <h1 className="text-lg font-semibold">Proof Of Identity</h1>
          <hr className="my-1" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-base">Type</legend>
              <select
                name="parentIdentityProofType"
                id="parentIdentityProofType"
                className="select select-primary"
                value={nonCreamyLayerCertificate.proofOfIdentity.type}
                onChange={(e) =>
                  setNonCreamyLayerCertificate({
                    ...nonCreamyLayerCertificate,
                    proofOfIdentity: {
                      ...nonCreamyLayerCertificate.proofOfIdentity,
                      type: e.target.value,
                    },
                  })
                }
              >
                <option value="" disabled>
                  Select Type
                </option>
                {[
                  "Passport",
                  "Aadhaar",
                  "Ration Card",
                  "Voter ID",
                  "Driving License",
                  "Electricity Bill",
                ].map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-base">File</legend>
              <input
                type="file"
                className="file-input file-input-primary"
                onChange={(e) => setProofOfIdentity(e.target.files![0])}
                disabled={!nonCreamyLayerCertificate.proofOfIdentity.type}
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
                    `proofOfIdentity-${nonCreamyLayerCertificate.applicantId}`,
                    "proofOfIdentity"
                  );
                }}
              >
                Upload
              </button>
            </fieldset>
          </div>
          {/* Address Proof */}
          <div className="mt-4">
            <h1 className="text-lg font-semibold">Proof of Address</h1>
            <hr className="my-1" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-base">Type</legend>
                <select
                  className="select select-primary"
                  value={nonCreamyLayerCertificate.proofOfAddress.type}
                  onChange={(e) =>
                    setNonCreamyLayerCertificate({
                      ...nonCreamyLayerCertificate,
                      proofOfAddress: {
                        ...nonCreamyLayerCertificate.proofOfAddress,
                        type: e.target.value,
                      },
                    })
                  }
                >
                  <option value="" disabled>
                    Select Type
                  </option>
                  {[
                    "Passport",
                    "Aadhaar",
                    "Ration Card",
                    "Voter ID",
                    "Driving License",
                    "Electricity Bill",
                  ].map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-base">File</legend>
                <input
                  type="file"
                  className="file-input file-input-primary"
                  onChange={(e) => setProofOfAddress(e.target.files![0])}
                  disabled={!nonCreamyLayerCertificate.proofOfAddress.type}
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
                      `proofOfAddress-${nonCreamyLayerCertificate.applicantId}`,
                      "proofOfAddress"
                    );
                  }}
                >
                  Upload
                </button>
              </fieldset>
            </div>
          </div>
          {/* Proof of Income */}
          <div className="mt-4">
            <h1 className="text-lg font-semibold">Proof of Income</h1>
            <hr className="my-1" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-base">Type</legend>
                <select
                  className="select select-primary"
                  value={nonCreamyLayerCertificate.incomeProof.type}
                  onChange={(e) =>
                    setNonCreamyLayerCertificate({
                      ...nonCreamyLayerCertificate,
                      incomeProof: {
                        ...nonCreamyLayerCertificate.incomeProof,
                        type: e.target.value,
                      },
                    })
                  }
                >
                  <option value="" disabled>
                    Select Type
                  </option>
                  {[
                    "Income tax statement letter",
                    "Circle Officer Verification report",
                    "If Recieved Salary Provide Form no16",
                    "Retirement/Salary holders Bank Certificate",
                    "If applicant is owner of the land then 7/12 to yield 8-A Talathi report",
                  ].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-base">File</legend>
                <input
                  type="file"
                  className="file-input file-input-primary"
                  onChange={(e) => setIncomeProof(e.target.files![0])}
                  disabled={!nonCreamyLayerCertificate.incomeProof.type}
                />
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-base">Preview</legend>
                {incomeProof && (
                  <a
                    href={URL.createObjectURL(incomeProof)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    View Proof of Income
                  </a>
                )}
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-base">
                  Upload Document
                </legend>
                <button
                  className="btn btn-success"
                  disabled={!incomeProof}
                  onClick={() => {
                    handleDocumentUpload(
                      "incomeProof",
                      folderName,
                      `incomeProof-${nonCreamyLayerCertificate.applicantId}`,
                      "incomeProof"
                    );
                  }}
                >
                  Upload
                </button>
              </fieldset>
            </div>
          </div>
          {/* Proof of Caste */}
          <div className="mt-4">
            <h1 className="text-lg font-semibold">Proof of Caste</h1>
            <hr className="my-1" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-base">
                  Caste Certificate Relation
                </legend>
                <select
                  className="select select-primary"
                  value={nonCreamyLayerCertificate.casteProof.type}
                  onChange={(e) =>
                    setNonCreamyLayerCertificate({
                      ...nonCreamyLayerCertificate,
                      casteProof: {
                        ...nonCreamyLayerCertificate.casteProof,
                        type: e.target.value,
                      },
                    })
                  }
                >
                  <option value="" disabled>
                    Select Type
                  </option>
                  {[
                    "Self",
                    "Father",
                    "Mother",
                    "Uncle",
                    "Grandfather",
                    "Aunt",
                    "Other",
                  ].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-base">File</legend>
                <input
                  type="file"
                  className="file-input file-input-primary"
                  onChange={(e) => setCasteProof(e.target.files![0])}
                  disabled={!nonCreamyLayerCertificate.casteProof.type}
                />
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-base">Preview</legend>
                {incomeProof && (
                  <a
                    href={URL.createObjectURL(incomeProof)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    View Proof of Income
                  </a>
                )}
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-base">
                  Upload Document
                </legend>
                <button
                  className="btn btn-success"
                  disabled={!casteProof}
                  onClick={() => {
                    handleDocumentUpload(
                      "casteProof",
                      folderName,
                      `casteProof-${nonCreamyLayerCertificate.applicantId}`,
                      "casteProof"
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
                  value={nonCreamyLayerCertificate.selfDeclaration.type}
                  onChange={(e) =>
                    setNonCreamyLayerCertificate({
                      ...nonCreamyLayerCertificate,
                      selfDeclaration: {
                        ...nonCreamyLayerCertificate.selfDeclaration,
                        type: e.target.value,
                      },
                    })
                  }
                >
                  <option value="" disabled>
                    Select Type
                  </option>
                  <option value="Notarized nonCreamyLayerCertificate">
                    Notarized nonCreamyLayerCertificate
                  </option>
                  <option value="Self-Attested nonCreamyLayerCertificate">
                    Self-Attested nonCreamyLayerCertificate
                  </option>
                </select>
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-base">File</legend>
                <input
                  type="file"
                  className="file-input file-input-primary"
                  onChange={(e) => setSelfDeclaration(e.target.files![0])}
                  disabled={!nonCreamyLayerCertificate.selfDeclaration.type}
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
                      `selfDeclaration-${nonCreamyLayerCertificate.applicantId}`,
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
        <button className="btn btn-accent w-full mt-4" onClick={handlePayment}>
          Apply
        </button>
      </div>
    </>
  );
};

export default NonCreamyLayerCertificate;
