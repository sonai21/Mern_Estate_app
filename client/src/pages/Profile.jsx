import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFaliure,
  deleteUserFaliure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserSuccess,
  signOutUserStart,
} from "../redux/user/userSlice.js";

import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileError, setFileError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        setFilePerc(Math.round(progress));
      },

      (err) => {
        setFileError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFaliure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (err) {
      dispatch(updateUserFaliure(err.message));
    }
  };
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFaliure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (err) {
      dispatch(deleteUserFaliure(err.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFaliure(data.message));
        return;
      }
      dispatch(signOutUserSuccess());
    } catch (err) {
      dispatch(deleteUserFaliure(data.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listing/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setShow(true);
      console.log(data);
      setUserListings(data);
    } catch (err) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto flex flex-col sm:flex-row gap-2">
      <div className="p-3 flex flex-col flex-1">
        <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            onChange={(e) => setFile(e.target.files[0])}
            type="file"
            ref={fileRef}
            hidden
            accept="image/*"
          />
          <img
            onClick={() => fileRef.current.click()}
            src={formData.avatar || currentUser.avatar}
            alt="profile"
            className="rounded-full hover:shadow-lg
         h-32 w-32 object-cover cursor-pointer self-center
          mt-2"
          />
          <p className="text-sm self-center">
            {fileError ? (
              <span className="text-red-700">
                Error Image Upload (image must be lee than 2 mb)
              </span>
            ) : filePerc > 0 && filePerc < 100 ? (
              <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
            ) : filePerc === 100 ? (
              <span className="text-green-700">
                Image successfully uploaded!
              </span>
            ) : (
              ""
            )}
          </p>
          <input
            type="text"
            placeholder="username"
            defaultValue={currentUser.username}
            id="username"
            className=" border p-3 rounded-lg"
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder="email"
            defaultValue={currentUser.email}
            id="email"
            className=" border p-3 rounded-lg"
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="password"
            id="password"
            className=" border p-3 rounded-lg"
            onChange={handleChange}
          />
          <button
            disabled={loading}
            className=" bg-slate-900 text-white rounded-lg p-3 uppercase hover:opacity-95  disabled:opacity-80"
          >
            {loading ? "Loading..." : "Update"}
          </button>
        </form>
        <div className="flex justify-between mt-4">
          <span
            onClick={handleDeleteUser}
            className="text-red-700 cursor-pointer hover:underline"
          >
            Delete account
          </span>
          <span
            onClick={handleSignOut}
            className="text-red-700 cursor-pointer hover:underline"
          >
            Sign out
          </span>
        </div>
        <p className="text-red-700 mt-5">{error ? error : ""}</p>
        <p className="text-green-700 mt-5">
          {updateSuccess ? "Profile is updated successfully!" : ""}
        </p>
      </div>
      <div className="p-3 flex flex-col flex-1">
        <Link
          className="border border-[#379237] text-[#379237] hover:bg-[#379237] hover:text-white p-3 rounded-lg uppercase text-center my-4"
          to={"/create-listing"}
        >
          Create Listing
        </Link>
        <button
          onClick={handleShowListings}
          className="bg-green-700 w-full rounded-lg p-3 uppercase text-white hover:shadow-md hover:opacity-90 disabled:opacity-75 mb-3"
        >
          Show Listings
        </button>
        <p className="text-red-700 mt-5">
          {showListingsError ? "Error showing listings" : ""}
        </p>

        {show && userListings && userListings.length < 1 && (
          <p className="text-red-600 text-xs">*No listing to show</p>
        )}

        {userListings && userListings.length > 0 && (
          <div className="flex flex-col gap-4">
            <h1 className="text-xl font-semibold text-center my-4">
              Your Listings
            </h1>
            {userListings.map((listingItem) => (
              <div
                key={listingItem._id}
                className="border p-3 shadow-sm flex  items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <Link to={`/listing/${listingItem._id}`}>
                    <img
                      src={listingItem.imageUrls[0]}
                      alt="listing cover"
                      className="h-16 object-contain rounded-sm hover:shadow-md"
                    />
                  </Link>
                  <Link to={`/listing/${listingItem._id}`}>
                    <p className="text-slate-700 font-semibold hover:underline truncate">
                      {listingItem.name}
                    </p>
                  </Link>
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => handleListingDelete(listingItem._id)}
                    className="w-20 bg-red-600 text-white p-1 rounded-md hover:opacity-90"
                  >
                    Delete
                  </button>
                  <button className="w-20 border border-yellow-600 p-1 rounded-md text-yellow-600 hover:text-white hover:bg-yellow-600">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
