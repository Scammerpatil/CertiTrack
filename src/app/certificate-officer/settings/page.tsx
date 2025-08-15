"use client";

import { useState } from "react";
import axios, { AxiosResponse } from "axios";
import { User } from "@/types/user";
import toast from "react-hot-toast";
import { IconCloudUpload } from "@tabler/icons-react";
import { useUser } from "@/context/UserContext";
import { MAHARASHTRA_DISTRICTS, MAHARASHTRA_TALUKAS } from "@/utils/constants";

const MyAccount = () => {
  const { user } = useUser();

  if (!user) return <div>Loading...</div>;

  const [formData, setFormData] = useState<User>(user);
  const [editing, setEditing] = useState(false);
  const [updatePassword, setUpdatePassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSave = async () => {
    try {
      const res = axios.post(`/api/update`, { formData });
      toast.promise(res, {
        loading: "Updating your information...",
        success: "Information Updated Successfully",
        error: "Oops!! Something went wrong",
      });
      setEditing(false);
    } catch (err) {
      console.error("Failed to update user", err);
    }
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

  const handleUpdatePassword = async () => {
    if (
      !updatePassword.currentPassword ||
      !updatePassword.newPassword ||
      !updatePassword.confirmPassword
    ) {
      toast.error("All fields are required");
      return;
    }
    if (updatePassword.currentPassword === updatePassword.newPassword) {
      toast.error("New password cannot be the same as current password");
      return;
    }

    if (updatePassword.newPassword !== updatePassword.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    if (
      updatePassword.newPassword.length < 8 ||
      !/[A-Z]/.test(updatePassword.newPassword) ||
      !/[0-9]/.test(updatePassword.newPassword)
    ) {
      toast.error(
        "New password must be at least 8 characters long and contain at least one uppercase letter and one number"
      );
      return;
    }

    try {
      const res = axios.post("/api/update/update-password", {
        currentPassword: updatePassword.currentPassword,
        newPassword: updatePassword.newPassword,
      });
      toast.promise(res, {
        loading: "Updating your password...",
        success: "Password Updated Successfully",
        error: (e) => {
          return e.response?.data?.error || "Failed to update password";
        },
      });
      setUpdatePassword({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error("Failed to update password", err);
    }
  };

  return (
    <>
      <h1 className="text-4xl font-bold text-center uppercase mb-4">
        My Account
      </h1>

      <div className="flex flex-col lg:flex-row gap-2 mt-2 lg:h-44">
        <div className="p-4 mb-4 bg-base-200 border border-base-content rounded-lg shadow-sm w-full lg:w-1/3 h-full">
          <div className="items-center sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4">
            <img
              className="mb-4 rounded-lg w-28 h-28 sm:mb-0 xl:mb-4 2xl:mb-0"
              src={formData.profileImage}
              alt={formData.name}
            />
            <div>
              <h3 className="mb-1 text-xl font-bold">Profile picture</h3>
              <div className="mb-4 text-sm opacity-70">JPG Max size of 5MB</div>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  id="profileImageInput"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    handleProfileImageChange(
                      e,
                      "profileImage",
                      formData.name,
                      "profileImage"
                    );
                  }}
                />
                <button
                  type="button"
                  className="btn btn-primary flex items-center space-x-2"
                  disabled={!editing}
                  onClick={() =>
                    document.getElementById("profileImageInput")?.click()
                  }
                >
                  <IconCloudUpload size={20} />
                  <span>Upload Image</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* General Info */}
        <div className="w-full lg:w-2/3 p-4 bg-base-300 border border-base-content rounded-lg shadow-sm">
          <h3 className="mb-3 text-xl font-semibold">General information</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 w-full">
            <fieldset className="fieldset w-full">
              <legend className="fieldset-legend">Name</legend>
              <input
                type="text"
                className="input w-full"
                placeholder="Type here"
                value={formData.name || ""}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                }}
                disabled={!editing}
                required
              />
            </fieldset>

            <fieldset className="fieldset w-full">
              <legend className="fieldset-legend">Mobile Number</legend>
              <input
                type="tel"
                className="input w-full"
                placeholder="Type here"
                value={formData.phone || ""}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value });
                }}
                disabled={!editing}
                required
              />
            </fieldset>

            <fieldset className="fieldset w-full">
              <legend className="fieldset-legend">Email</legend>
              <input
                type="email"
                className="input w-full"
                value={formData.email || ""}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                }}
                disabled
                readOnly
              />
            </fieldset>
          </div>
        </div>
      </div>

      {/* Address Section */}
      <div className="col-span-12 p-8 bg-base-300 border border-base-content rounded-lg shadow-sm mt-3">
        <h3 className="mb-3 text-xl font-semibold">Address</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <fieldset className="fieldset w-full">
            <legend className="fieldset-legend">
              District <span className="text-error">*</span>
            </legend>
            <select
              value={formData.district || ""}
              onChange={(e) =>
                setFormData({ ...formData, district: e.target.value })
              }
              disabled={!editing}
              className="select select-primary w-full"
              required
            >
              {MAHARASHTRA_DISTRICTS.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </fieldset>
          <fieldset className="fieldset w-full">
            <legend className="fieldset-legend">
              Taluka <span className="text-error">*</span>
            </legend>
            <select
              value={formData.taluka || ""}
              onChange={(e) =>
                setFormData({ ...formData, taluka: e.target.value })
              }
              disabled={!editing}
              className="select select-primary w-full"
              required
            >
              {formData.district ? (
                MAHARASHTRA_TALUKAS[formData.district].map((taluka) => (
                  <option key={taluka} value={taluka}>
                    {taluka}
                  </option>
                ))
              ) : (
                <option value="">Select Taluka</option>
              )}
            </select>
          </fieldset>
        </div>
        <p className="badge badge-warning mt-4">
          Changing District or Taluka will lead to blocking of account and has
          to be approved by the admin.
        </p>
      </div>

      {/* Password Change */}
      <div className="col-span-12 p-8 bg-base-300 border border-base-content rounded-lg shadow-sm mt-4">
        <h3 className="mb-3 text-xl font-semibold">Change Password</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <fieldset className="fieldset w-full">
            <legend className="fieldset-legend">
              Current Password <span className="text-error">*</span>
            </legend>
            <input
              type="password"
              value={updatePassword.currentPassword || ""}
              onChange={(e) =>
                setUpdatePassword({
                  ...updatePassword,
                  currentPassword: e.target.value,
                })
              }
              disabled={!editing}
              className="input input-primary w-full"
              placeholder="Enter current password"
            />
          </fieldset>
          <fieldset className="fieldset w-full">
            <legend className="fieldset-legend">
              New Password <span className="text-error">*</span>
            </legend>
            <input
              type="password"
              value={updatePassword.newPassword || ""}
              onChange={(e) =>
                setUpdatePassword({
                  ...updatePassword,
                  newPassword: e.target.value,
                })
              }
              disabled={!editing}
              className="input input-primary w-full"
              placeholder="Enter new password"
            />
          </fieldset>

          <fieldset className="fieldset w-full">
            <legend className="fieldset-legend">
              Confirm New Password <span className="text-error">*</span>
            </legend>
            <input
              type="password"
              value={updatePassword.confirmPassword || ""}
              onChange={(e) =>
                setUpdatePassword({
                  ...updatePassword,
                  confirmPassword: e.target.value,
                })
              }
              disabled={!editing}
              className="input input-primary w-full"
              placeholder="Confirm new password"
            />
          </fieldset>
        </div>
        <p className="badge badge-info">
          Please ensure your password is at least 8 characters long and contains
          a mix of letters, numbers, and special characters.
        </p>
        <button
          className="btn btn-accent w-full mt-3"
          onClick={handleUpdatePassword}
          disabled={!editing}
        >
          Update Password
        </button>
      </div>

      {/* Action Buttons */}
      {editing ? (
        <button
          className="btn btn-outline btn-success mt-3 w-full"
          onClick={handleSave}
        >
          Save
        </button>
      ) : (
        <button
          className="btn btn-outline btn-accent mt-3 w-full"
          onClick={() => setEditing(true)}
        >
          Edit
        </button>
      )}
    </>
  );
};

export default MyAccount;
