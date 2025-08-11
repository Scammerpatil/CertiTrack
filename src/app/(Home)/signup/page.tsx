"use client";
import { MAHARASHTRA_DISTRICTS, MAHARASHTRA_TALUKAS } from "@/utils/constants";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const SignUp = () => {
  const [disabled, setDisabled] = useState(true);
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    district: "",
    taluka: "",
    password: "",
    role: "",
    profileImage: "",
  });
  const router = useRouter();
  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.role ||
      !formData.profileImage
    ) {
      toast.error("Please fill all the fields");
      return;
    }
    const response = axios.post(`/api/auth/signup/${formData.role}`, {
      formData,
    });
    toast.promise(response, {
      loading: "Creating Account",
      success: () => {
        router.push("/login");
        return "Account Created Successfully";
      },
      error: (err: any) => {
        console.log(err);
        return err.response.data.message;
      },
    });
  };
  const handleProfileImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    folderName: string,
    imageName: string,
    path: string
  ) => {
    if (!formData.name) {
      toast.error("Name is required for images");
      return;
    }
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB");
        return;
      }
      const imageResponse = axios.postForm("/api/helper/upload-img", {
        file,
        name: imageName,
        folderName: folderName,
      });
      console.log(imageResponse);
      toast.promise(imageResponse, {
        loading: "Uploading Image...",
        success: (data: AxiosResponse) => {
          setFormData({
            ...formData,
            [path]: data.data.path,
          });
          return "Image Uploaded Successfully";
        },
        error: (err: unknown) => `This just happened: ${err}`,
      });
    }
  };
  return (
    <div className="flex justify-center items-center w-full bg-base-200 px-5 py-5 min-h-[calc(100vh-5.7rem)]">
      <div className="xl:max-w-7xl bg-base-100 drop-shadow-xl border border-base-content/20 w-full rounded-md flex justify-between items-stretch px-5 xl:px-5 py-5">
        <div className="sm:w-[60%] lg:w-[50%] bg-cover bg-center items-center justify-center hidden md:flex ">
          <img src="login.png" alt="login" className="h-[500px]" />
        </div>
        <div className="h-full md:w-1/2 my-auto mx-auto">
          <h1 className="text-center text-2xl sm:text-3xl font-semibold text-primary">
            Create Account
          </h1>
          <div className="w-full mt-5 sm:mt-8">
            <div className="mx-auto w-full sm:max-w-md md:max-w-lg flex flex-col gap-5">
              <input
                type="text"
                placeholder="Enter Your Full Name"
                className="input input-primary w-full text-base-content placeholder:text-base-content/70"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                }}
              />

              <div className="flex flex-col sm:flex-row gap-3 text-base-content">
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  className="input input-primary w-full text-base-content placeholder:text-base-content/70"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                  }}
                />
                <input
                  type="tel"
                  placeholder="Enter Your Contact No"
                  className="input input-primary w-full text-base-content placeholder:text-base-content/70"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                  }}
                  minLength={10}
                  maxLength={10}
                />
              </div>
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-base">
                  Profile Image
                </legend>
                <input
                  type="file"
                  className="file-input file-input-bordered file-input-primary w-full text-base-content"
                  accept="image/* .jpg"
                  onChange={(e) => {
                    handleProfileImageChange(
                      e,
                      "profileImage",
                      formData.name,
                      "profileImage"
                    );
                  }}
                />
              </fieldset>
              <select
                className="select select-primary w-full text-base-content"
                value={formData.role}
                onChange={(e) => {
                  setFormData({ ...formData, role: e.target.value });
                }}
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="district-officer">District Officer (DO)</option>
                <option value="sub-division-officer">
                  Sub-Division Officer (SDO)
                </option>
                <option value="certificate-officer">Certificate Officer</option>
                <option value="user">User</option>
              </select>
              {formData.role !== "admin" && (
                <div className="flex flex-col sm:flex-row gap-3 text-base-content">
                  <select
                    className="select input-primary w-full text-base-content placeholder:text-base-content/70"
                    value={formData.district}
                    onChange={(e) => {
                      setFormData({ ...formData, district: e.target.value });
                    }}
                  >
                    <option value="" disabled defaultChecked>
                      Select District
                    </option>
                    {MAHARASHTRA_DISTRICTS.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                  {formData.role !== "district-officer" && (
                    <select
                      className="select input-primary w-full text-base-content placeholder:text-base-content/70"
                      value={formData.taluka}
                      onChange={(e) => {
                        setFormData({ ...formData, taluka: e.target.value });
                      }}
                    >
                      <option value="" disabled defaultChecked>
                        Select Taluka
                      </option>
                      {formData.district &&
                        MAHARASHTRA_TALUKAS[formData.district].map((taluka) => (
                          <option key={taluka} value={taluka}>
                            {taluka}
                          </option>
                        ))}
                    </select>
                  )}
                </div>
              )}
              <div className="relative">
                <input
                  type={visible ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      password: e.target.value,
                    })
                  }
                  className="input input-primary w-full text-base-content placeholder:text-base-content/70"
                  placeholder="Enter Password"
                  required
                />
                <span
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-base-content"
                  onClick={() => setVisible(!visible)}
                >
                  {visible ? <IconEyeOff size={20} /> : <IconEye size={20} />}
                </span>
              </div>
              <div className="flex items-center gap-1.5  justify-start pl-2">
                <div className="form-control flex items-center">
                  <label className="label cursor-pointer">
                    <input
                      type="checkbox"
                      className="checkbox"
                      onChange={() => {
                        setDisabled(!disabled);
                      }}
                    />
                  </label>
                </div>
                <h3 className="flex items-center whitespace-nowrap text-base text-base-content">
                  I agree to the
                  <span className="text-primary">&nbsp;Terms</span>
                  &nbsp;and
                  <span className="text-primary">&nbsp;Privacy Policy</span>.
                </h3>
              </div>
              <div className="flex flex-col md:flex-row gap-2 md:gap-4 justify-center items-center">
                <button
                  className="btn btn-outline btn-primary btn-block max-w-[200px]"
                  onClick={handleSubmit}
                  disabled={disabled}
                >
                  Sign Up
                </button>
              </div>
              <p className="text-center mt-3 text-base text-base-content">
                Already have an account?{" "}
                <span
                  className="text-primary cursor-pointer"
                  onClick={() => router.push("/login")}
                >
                  Login
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
