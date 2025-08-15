import { useUser } from "@/context/UserContext";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const DomicileCertificate = () => {
  const { user } = useUser();
  if (!user) {
    return <p>Please log in to apply for a certificate.</p>;
  }
  const [proofOfIdentity, setProofOfIdentity] = useState<File | null>(null);
  const [ageProof, setAgeProof] = useState<File | null>(null);
  const [residencyProof, setResidencyProof] = useState<File | null>(null);
  const [selfDeclaration, setSelfDeclaration] = useState<File | null>(null);
  const [folderName, setFolderName] = useState<string>("");
  const [domicileCertificate, setDomicileCertificate] = useState({
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
    ageProof: {
      type: "",
      fileUrl: "",
    },
    residencyProof: {
      type: "",
      fileUrl: "",
    },
    selfDeclaration: {
      type: "",
      fileUrl: "",
    },
  });

  useEffect(() => {
    setDomicileCertificate({
      ...domicileCertificate,
      applicantId: user._id!.toString(),
      generalInfo: {
        ...domicileCertificate.generalInfo,
        fullName: user.name,
        taluka: user.taluka || "",
        district: user.district || "",
      },
    });
    setFolderName(`domicileCertificate/${user._id}-${Date.now()}`);
  }, [user]);

  const handleDocumentUpload = (
    proofType:
      | "proofOfIdentity"
      | "ageProof"
      | "residencyProof"
      | "selfDeclaration",
    folderName: string,
    imageName: string,
    path: string
  ) => {
    if (!domicileCertificate.generalInfo.fullName) {
      toast.error("Name is required for images");
      return;
    }
    if (
      (proofType === "proofOfIdentity" && proofOfIdentity) ||
      (proofType === "ageProof" && ageProof) ||
      (proofType === "residencyProof" && residencyProof) ||
      (proofType === "selfDeclaration" && selfDeclaration)
    ) {
      const imageResponse = axios.postForm("/api/helper/upload-documents", {
        file:
          proofType === "proofOfIdentity"
            ? proofOfIdentity
            : proofType === "ageProof"
            ? ageProof
            : proofType === "residencyProof"
            ? residencyProof
            : selfDeclaration,
        name: imageName,
        folderName: folderName,
      });
      toast.promise(imageResponse, {
        loading: "Uploading File...",
        success: (data: AxiosResponse) => {
          setDomicileCertificate({
            ...domicileCertificate,
            [path]: {
              type: (domicileCertificate as any)[path].type,
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

  const handlePayment = async () => {
    if (
      !proofOfIdentity ||
      !ageProof ||
      !residencyProof ||
      !selfDeclaration ||
      !domicileCertificate.generalInfo.address ||
      !domicileCertificate.generalInfo.dob
    ) {
      toast.error("Please fill all required fields and upload documents.");
      return;
    }
    if (!confirm("Do you want to proceed with the payment?")) return;
    const amount = 40;
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
          handleApplyDomicileCertificate();
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

  const handleApplyDomicileCertificate = () => {
    if (
      domicileCertificate.proofOfIdentity.fileUrl &&
      domicileCertificate.ageProof.fileUrl &&
      domicileCertificate.residencyProof.fileUrl &&
      domicileCertificate.selfDeclaration.fileUrl
    ) {
      const response = axios.post(
        "/api/certificate/domicile-certificate/apply",
        {
          domicileCertificate,
        }
      );
      toast.promise(response, {
        loading: "Applying for Domicile Certificate...",
        success: (data) => {
          setDomicileCertificate({
            applicantId: "",
            generalInfo: {
              fullName: "",
              address: "",
              district: "",
              taluka: "",
              dob: "",
            },
            ageProof: {
              type: "",
              fileUrl: "",
            },
            residencyProof: {
              type: "",
              fileUrl: "",
            },
            proofOfIdentity: {
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
          setResidencyProof(null);
          setAgeProof(null);
          return "Domicile Certificate applied successfully!";
        },
        error: (err) => {
          return "Failed to apply for Domicile Certificate.";
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
                value={domicileCertificate.applicantId}
                readOnly
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-base">Full Name</legend>
              <input
                type="text"
                className="input input-primary"
                value={domicileCertificate.generalInfo.fullName}
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
                value={domicileCertificate.generalInfo.dob}
                onChange={(e) =>
                  setDomicileCertificate({
                    ...domicileCertificate,
                    generalInfo: {
                      ...domicileCertificate.generalInfo,
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
                value={domicileCertificate.generalInfo.district}
                readOnly
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-base">Taluka</legend>
              <input
                type="text"
                className="input input-primary"
                value={domicileCertificate.generalInfo.taluka}
                readOnly
              />
            </fieldset>
          </div>
          <fieldset className="fieldset">
            <legend className="fieldset-legend text-base">Address</legend>
            <textarea
              className="textarea textarea-primary w-full"
              rows={3}
              value={domicileCertificate.generalInfo.address}
              onChange={(e) =>
                setDomicileCertificate({
                  ...domicileCertificate,
                  generalInfo: {
                    ...domicileCertificate.generalInfo,
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
                value={domicileCertificate.proofOfIdentity.type}
                onChange={(e) =>
                  setDomicileCertificate({
                    ...domicileCertificate,
                    proofOfIdentity: {
                      ...domicileCertificate.proofOfIdentity,
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
                disabled={!domicileCertificate.proofOfIdentity.type}
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
                    `proofOfIdentity-${domicileCertificate.applicantId}`,
                    "proofOfIdentity"
                  );
                }}
              >
                Upload
              </button>
            </fieldset>
          </div>
          {/* Age Certificate */}
          <div className="mt-4">
            <h1 className="text-lg font-semibold">Proof of Age</h1>
            <hr className="my-1" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-base">Type</legend>
                <select
                  name="proofOfMarriageType"
                  id="proofOfMarriageType"
                  className="select select-primary"
                  value={domicileCertificate.ageProof.type}
                  onChange={(e) =>
                    setDomicileCertificate({
                      ...domicileCertificate,
                      ageProof: {
                        ...domicileCertificate.ageProof,
                        type: e.target.value,
                      },
                    })
                  }
                >
                  <option value="" disabled>
                    Select Type
                  </option>
                  {[
                    "Birth Certificate",
                    "School Leaving Certificate",
                    "Aadhaar",
                    "Passport",
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
                  onChange={(e) => setAgeProof(e.target.files![0])}
                  disabled={!domicileCertificate.ageProof.type}
                />
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-base">Preview</legend>
                {ageProof && (
                  <a
                    href={URL.createObjectURL(ageProof)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    View Proof of Age
                  </a>
                )}
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-base">
                  Upload Document
                </legend>
                <button
                  className="btn btn-success"
                  disabled={!ageProof}
                  onClick={() => {
                    handleDocumentUpload(
                      "ageProof",
                      folderName,
                      `ageProof-${domicileCertificate.applicantId}`,
                      "ageProof"
                    );
                  }}
                >
                  Upload
                </button>
              </fieldset>
            </div>
          </div>
          {/* Proof of Residence */}
          <div className="mt-4">
            <h1 className="text-lg font-semibold">Proof of Residence</h1>
            <hr className="my-1" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-base">Type</legend>
                <select
                  name="proofOfResidenceType"
                  id="proofOfResidenceType"
                  className="select select-primary"
                  value={domicileCertificate.residencyProof.type}
                  onChange={(e) =>
                    setDomicileCertificate({
                      ...domicileCertificate,
                      residencyProof: {
                        ...domicileCertificate.residencyProof,
                        type: e.target.value,
                      },
                    })
                  }
                >
                  <option value="" disabled>
                    Select Type
                  </option>
                  {[
                    "Residence Proof by Talathi",
                    "Residence Proof by Gram Sevak",
                    "Residence Proof by Bill Collector",
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
                  onChange={(e) => setResidencyProof(e.target.files![0])}
                  disabled={!domicileCertificate.residencyProof.type}
                />
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-base">Preview</legend>
                {residencyProof && (
                  <a
                    href={URL.createObjectURL(residencyProof)}
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
                  disabled={!residencyProof}
                  onClick={() => {
                    handleDocumentUpload(
                      "residencyProof",
                      folderName,
                      `residencyProof-${domicileCertificate.applicantId}`,
                      "residencyProof"
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
                  value={domicileCertificate.selfDeclaration.type}
                  onChange={(e) =>
                    setDomicileCertificate({
                      ...domicileCertificate,
                      selfDeclaration: {
                        ...domicileCertificate.selfDeclaration,
                        type: e.target.value,
                      },
                    })
                  }
                >
                  <option value="" disabled>
                    Select Type
                  </option>
                  <option value="Notarized domicileCertificate">
                    Notarized domicileCertificate
                  </option>
                  <option value="Self-Attested domicileCertificate">
                    Self-Attested domicileCertificate
                  </option>
                </select>
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-base">File</legend>
                <input
                  type="file"
                  className="file-input file-input-primary"
                  onChange={(e) => setSelfDeclaration(e.target.files![0])}
                  disabled={!domicileCertificate.selfDeclaration.type}
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
                      `selfDeclaration-${domicileCertificate.applicantId}`,
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

export default DomicileCertificate;
