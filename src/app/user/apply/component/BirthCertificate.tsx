import { useUser } from "@/context/UserContext";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const BirthCertificate = () => {
  const { user } = useUser();
  if (!user) {
    return <p>Please log in to apply for a certificate.</p>;
  }
  const [parentIdentityProof, setParentIdentityProof] = useState<File | null>(
    null
  );
  const [marriageCertificate, setMarriageCertificate] = useState<File | null>(
    null
  );
  const [proofOfAddress, setProofOfAddress] = useState<File | null>(null);
  const [selfDeclaration, setSelfDeclaration] = useState<File | null>(null);
  const [folderName, setFolderName] = useState<string>("");
  const [birthCertificate, setBirthCertificate] = useState({
    applicantId: "",
    generalInfo: {
      fullName: "",
      address: "",
      district: "",
      taluka: "",
    },
    childName: "",
    dob: "",
    placeOfBirth: "",
    gender: "",
    address: "",
    permanentAddress: "",
    parents: {
      father: "",
      mother: "",
    },
    hospitalDetails: {
      name: "",
      address: "",
      contactNumber: "",
    },
    parentIdentityProof: {
      type: "",
      fileUrl: "",
    },
    marriageCertificate: {
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
    setBirthCertificate({
      ...birthCertificate,
      applicantId: user._id!.toString(),
      generalInfo: {
        ...birthCertificate.generalInfo,
        fullName: user.name,
        taluka: user.taluka || "",
        district: user.district || "",
      },
    });
    setFolderName(`birthCertificates/${user._id}-${Date.now()}`);
  }, [user]);

  const handleDocumentUpload = (
    proofType:
      | "parentIdentityProof"
      | "proofOfAddress"
      | "marriageCertificate"
      | "selfDeclaration",
    folderName: string,
    imageName: string,
    path: string
  ) => {
    if (!birthCertificate.generalInfo.fullName) {
      toast.error("Name is required for images");
      return;
    }
    if (
      (proofType === "parentIdentityProof" && parentIdentityProof) ||
      (proofType === "marriageCertificate" && marriageCertificate) ||
      (proofType === "proofOfAddress" && proofOfAddress) ||
      (proofType === "selfDeclaration" && selfDeclaration)
    ) {
      const imageResponse = axios.postForm("/api/helper/upload-documents", {
        file:
          proofType === "parentIdentityProof"
            ? parentIdentityProof
            : proofType === "proofOfAddress"
            ? proofOfAddress
            : proofType === "marriageCertificate"
            ? marriageCertificate
            : selfDeclaration,
        name: imageName,
        folderName: folderName,
      });
      toast.promise(imageResponse, {
        loading: "Uploading File...",
        success: (data: AxiosResponse) => {
          setBirthCertificate({
            ...birthCertificate,
            [path]: {
              type: (birthCertificate as any)[path].type,
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
      !parentIdentityProof ||
      !marriageCertificate ||
      !proofOfAddress ||
      !selfDeclaration ||
      !birthCertificate.generalInfo.address ||
      !birthCertificate.dob
    ) {
      toast.error("Please fill all required fields and upload documents.");
      return;
    }
    if (!confirm("Do you want to proceed with the payment?")) return;
    const amount = 30;
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
          handleApplybirthCertificate();
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

  const handleApplybirthCertificate = () => {
    if (
      birthCertificate.parentIdentityProof.fileUrl &&
      birthCertificate.proofOfAddress.fileUrl &&
      birthCertificate.marriageCertificate.fileUrl &&
      birthCertificate.selfDeclaration.fileUrl
    ) {
      const response = axios.post("/api/certificate/birth-certificate/apply", {
        birthCertificate,
      });
      toast.promise(response, {
        loading: "Applying for Birth Certificate...",
        success: (data) => {
          setBirthCertificate({
            applicantId: "",
            generalInfo: {
              fullName: "",
              address: "",
              district: "",
              taluka: "",
            },
            childName: "",
            dob: "",
            placeOfBirth: "",
            gender: "",
            address: "",
            permanentAddress: "",
            parents: {
              father: "",
              mother: "",
            },
            hospitalDetails: {
              name: "",
              address: "",
              contactNumber: "",
            },
            parentIdentityProof: {
              type: "",
              fileUrl: "",
            },
            marriageCertificate: {
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
          setProofOfAddress(null);
          setSelfDeclaration(null);
          setMarriageCertificate(null);
          setParentIdentityProof(null);
          return "Birth Certificate applied successfully!";
        },
        error: (err) => {
          return "Failed to apply for Birth Certificate.";
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
          <fieldset className="fieldset">
            <legend className="fieldset-legend text-base">Applicant ID</legend>
            <input
              type="text"
              className="input input-primary"
              value={birthCertificate.applicantId}
              readOnly
            />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend text-base">Full Name</legend>
            <input
              type="text"
              className="input input-primary"
              value={birthCertificate.generalInfo.fullName}
              readOnly
            />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend text-base">District</legend>
            <input
              type="text"
              className="input input-primary"
              value={birthCertificate.generalInfo.district}
              readOnly
            />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend text-base">Taluka</legend>
            <input
              type="text"
              className="input input-primary"
              value={birthCertificate.generalInfo.taluka}
              readOnly
            />
          </fieldset>
        </div>

        {/* Child Details */}
        <div className="mt-4">
          <h1 className="text-lg font-semibold">Child Details</h1>
          <hr className="my-1" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-base">Child Name</legend>
              <input
                type="text"
                className="input input-primary"
                value={birthCertificate.childName}
                onChange={(e) =>
                  setBirthCertificate({
                    ...birthCertificate,
                    childName: e.target.value,
                  })
                }
              />
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend text-base">
                Date of Birth
              </legend>
              <input
                type="date"
                className="input input-primary"
                value={birthCertificate.dob}
                onChange={(e) =>
                  setBirthCertificate({
                    ...birthCertificate,
                    dob: e.target.value,
                  })
                }
              />
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend text-base">
                Place of Birth
              </legend>
              <input
                type="text"
                className="input input-primary"
                value={birthCertificate.placeOfBirth}
                onChange={(e) =>
                  setBirthCertificate({
                    ...birthCertificate,
                    placeOfBirth: e.target.value,
                  })
                }
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-base">Gender</legend>
              <select
                className="select select-primary"
                value={birthCertificate.gender}
                onChange={(e) =>
                  setBirthCertificate({
                    ...birthCertificate,
                    gender: e.target.value,
                  })
                }
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend text-base">Address</legend>
              <input
                type="text"
                className="input input-primary"
                value={birthCertificate.address}
                onChange={(e) =>
                  setBirthCertificate({
                    ...birthCertificate,
                    address: e.target.value,
                  })
                }
              />
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend text-base">
                Permanent Address
              </legend>
              <input
                type="text"
                className="input input-primary"
                value={birthCertificate.permanentAddress}
                onChange={(e) =>
                  setBirthCertificate({
                    ...birthCertificate,
                    permanentAddress: e.target.value,
                  })
                }
              />
            </fieldset>
          </div>
        </div>

        {/* Parent Info */}
        <div className="mt-4">
          <h1 className="text-lg font-semibold">Parent Information</h1>
          <hr className="my-1" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-base">
                Father's Name
              </legend>
              <input
                type="text"
                className="input input-primary"
                value={birthCertificate.parents.father}
                onChange={(e) =>
                  setBirthCertificate({
                    ...birthCertificate,
                    parents: {
                      ...birthCertificate.parents,
                      father: e.target.value,
                    },
                  })
                }
              />
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend text-base">
                Mother's Name
              </legend>
              <input
                type="text"
                className="input input-primary"
                value={birthCertificate.parents.mother}
                onChange={(e) =>
                  setBirthCertificate({
                    ...birthCertificate,
                    parents: {
                      ...birthCertificate.parents,
                      mother: e.target.value,
                    },
                  })
                }
              />
            </fieldset>
          </div>
        </div>

        {/* Hospital Details */}
        <div className="mt-4">
          <h1 className="text-lg font-semibold">Hospital Details</h1>
          <hr className="my-1" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-base">
                Hospital Name
              </legend>
              <input
                type="text"
                className="input input-primary"
                value={birthCertificate.hospitalDetails.name}
                onChange={(e) =>
                  setBirthCertificate({
                    ...birthCertificate,
                    hospitalDetails: {
                      ...birthCertificate.hospitalDetails,
                      name: e.target.value,
                    },
                  })
                }
              />
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend text-base">
                Hospital Address
              </legend>
              <input
                type="text"
                className="input input-primary"
                value={birthCertificate.hospitalDetails.address}
                onChange={(e) =>
                  setBirthCertificate({
                    ...birthCertificate,
                    hospitalDetails: {
                      ...birthCertificate.hospitalDetails,
                      address: e.target.value,
                    },
                  })
                }
              />
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend text-base">
                Contact Number
              </legend>
              <input
                type="tel"
                className="input input-primary"
                value={birthCertificate.hospitalDetails.contactNumber}
                onChange={(e) =>
                  setBirthCertificate({
                    ...birthCertificate,
                    hospitalDetails: {
                      ...birthCertificate.hospitalDetails,
                      contactNumber: e.target.value,
                    },
                  })
                }
              />
            </fieldset>
          </div>
        </div>

        <div className="mt-4">
          <h1 className="text-lg font-semibold">Parents Identity Proof</h1>
          <hr className="my-1" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-base">Type</legend>
              <select
                name="parentIdentityProofType"
                id="parentIdentityProofType"
                className="select select-primary"
                value={birthCertificate.parentIdentityProof.type}
                onChange={(e) =>
                  setBirthCertificate({
                    ...birthCertificate,
                    parentIdentityProof: {
                      ...birthCertificate.parentIdentityProof,
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
                onChange={(e) => setParentIdentityProof(e.target.files![0])}
                disabled={!birthCertificate.parentIdentityProof.type}
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-base">Preview</legend>
              {parentIdentityProof && (
                <a
                  href={URL.createObjectURL(parentIdentityProof)}
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
                disabled={!parentIdentityProof}
                onClick={() => {
                  handleDocumentUpload(
                    "parentIdentityProof",
                    folderName,
                    `parentIdentityProof-${birthCertificate.applicantId}`,
                    "parentIdentityProof"
                  );
                }}
              >
                Upload
              </button>
            </fieldset>
          </div>
          {/* Marriage Certificate */}
          <div className="mt-4">
            <h1 className="text-lg font-semibold">Proof of Marriage</h1>
            <hr className="my-1" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-base">Type</legend>
                <select
                  name="proofOfMarriageType"
                  id="proofOfMarriageType"
                  className="select select-primary"
                  value={birthCertificate.marriageCertificate.type}
                  onChange={(e) =>
                    setBirthCertificate({
                      ...birthCertificate,
                      marriageCertificate: {
                        ...birthCertificate.marriageCertificate,
                        type: e.target.value,
                      },
                    })
                  }
                >
                  <option value="" disabled>
                    Select Type
                  </option>
                  {[
                    "Marriage Certificate",
                    "Court Marriage Certificate",
                    "Religious Marriage Certificate",
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
                  onChange={(e) => setMarriageCertificate(e.target.files![0])}
                  disabled={!birthCertificate.marriageCertificate.type}
                />
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-base">Preview</legend>
                {marriageCertificate && (
                  <a
                    href={URL.createObjectURL(marriageCertificate)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    View Proof of Marriage
                  </a>
                )}
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-base">
                  Upload Document
                </legend>
                <button
                  className="btn btn-success"
                  disabled={!marriageCertificate}
                  onClick={() => {
                    handleDocumentUpload(
                      "marriageCertificate",
                      folderName,
                      `marriageCertificate-${birthCertificate.applicantId}`,
                      "marriageCertificate"
                    );
                  }}
                >
                  Upload
                </button>
              </fieldset>
            </div>
          </div>
          {/* Proof of Address */}
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
                  value={birthCertificate.proofOfAddress.type}
                  onChange={(e) =>
                    setBirthCertificate({
                      ...birthCertificate,
                      proofOfAddress: {
                        ...birthCertificate.proofOfAddress,
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
                  disabled={!birthCertificate.proofOfAddress.type}
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
                      `proofOfAddress-${birthCertificate.applicantId}`,
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
                  value={birthCertificate.selfDeclaration.type}
                  onChange={(e) =>
                    setBirthCertificate({
                      ...birthCertificate,
                      selfDeclaration: {
                        ...birthCertificate.selfDeclaration,
                        type: e.target.value,
                      },
                    })
                  }
                >
                  <option value="" disabled>
                    Select Type
                  </option>
                  <option value="Notarized birthCertificate">
                    Notarized birthCertificate
                  </option>
                  <option value="Self-Attested birthCertificate">
                    Self-Attested birthCertificate
                  </option>
                </select>
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-base">File</legend>
                <input
                  type="file"
                  className="file-input file-input-primary"
                  onChange={(e) => setSelfDeclaration(e.target.files![0])}
                  disabled={!birthCertificate.selfDeclaration.type}
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
                      `selfDeclaration-${birthCertificate.applicantId}`,
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

export default BirthCertificate;
