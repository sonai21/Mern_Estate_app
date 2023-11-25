import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";
import { GiBed } from "react-icons/gi";
import { GiSofa } from "react-icons/gi";
import { CiParking1 } from "react-icons/ci";
import { GiBathtub } from "react-icons/gi";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import Contact from "../components/Contact";

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        console.log(data);
        if (data.success === false) {
          setLoading(false);
          setErrors(true);
          return;
        }
        setListing(data);
        setErrors(false);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setErrors(true);
      }
    };
    fetchListing();
  }, [params.listingId]);
  return (
    <main>
      {loading && <p className="text-center my-20 text-2xl">Loading...</p>}
      {errors && (
        <p className="text-center my-20 text-2xl">Something went wrong!</p>
      )}
      {listing && !loading && !errors && (
        <>
          <Swiper navigation className="shadow-lg">
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[500px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="p-10 mx-auto md:mx-32">
            <div className="flex justify-between items-center">
              <h1 className="font-semibold text-2xl capitalize">
                {listing.name}
              </h1>
              <h1 className="font-semibold text-xl text-blue-950 shadow-sm mr-20">
                ${listing.regularPrice}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <FaLocationDot className="text-green-700" />
              <p className="capitalize my-5">{listing.address}</p>
            </div>
            <div className="flex gap-4">
              <p className="p-2 bg-yellow-500 w-36 text-center font-semibold rounded-sm shadow-sm">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              <p className="p-2 bg-green-600 w-36 text-center font-semibold rounded-sm shadow-sm">
                {listing.offer
                  ? `Discount : $ ${listing.discountPrice}`
                  : `Price : $ ${listing.regularPrice}`}
              </p>
            </div>
            <div className="my-5">
              <span className="font-semibold">Description : </span>
              <span>{listing.description}</span>
            </div>
            <div className="flex gap-6 font-semibold">
              <div className="flex text-green-700 items-center gap-1">
                <GiBed />
                <span>{listing.bedrooms}</span>
                <span>Bed</span>
              </div>
              <div className="flex text-green-700 items-center gap-1">
                <GiBathtub />
                <span>{listing.bathrooms}</span>
                <span>Baths</span>
              </div>

              <div className="flex text-green-700 items-center gap-1">
                {listing.furnished && (
                  <>
                    <GiSofa />
                    <span>Furnished</span>
                  </>
                )}
              </div>
              <div className="flex text-green-700 items-center gap-1">
                {listing.parking && (
                  <>
                    <CiParking1 />
                    <span>Parking</span>
                  </>
                )}
              </div>
            </div>
            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <div>
                <button
                  onClick={() => setContact(true)}
                  className="bg-slate-700 text-center text-white rounded-lg uppercase hover:opacity-90 p-3"
                >
                  Contact landlord
                </button>
              </div>
            )}
            {contact && <Contact listing={listing} />}
          </div>
        </>
      )}
    </main>
  );
}
