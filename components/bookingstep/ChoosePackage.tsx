"use client";

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, Pagination } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import { useGetPackageQuery } from "@/store/endpoints/apiSlice";
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";

function Choosepackage() {
  const { data, error, isLoading } = useGetPackageQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage("");
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex flex-col justify-center gap-4 items-center">
      <div className="text-primary font-bold text-2xl">Choose Package</div>

      <div className="w-full md:w-2/3 h-3/4">
        <Swiper
          slidesPerView={1}
          spaceBetween={10}
          pagination={{
            clickable: true,
          }}
          modules={[Grid, Pagination]}
          className="w-full h-full"
          breakpoints={{
            320: {
              slidesPerView: 1,
              grid: {
                rows: 1,
              },
              spaceBetween: 10,
            },
            640: {
              slidesPerView: 2,
              grid: {
                rows: 2,
              },
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              grid: {
                rows: 2,
              },
              spaceBetween: 30,
            },
            1280: {
              slidesPerView: 4,
              grid: {
                rows: 2,
              },
              spaceBetween: 30,
            },
          }}
        >
          {data?.packageAdditions?.map((packageAddition) =>
            packageAddition.typeDetail.map((type) => (
              <SwiperSlide
                key={type._id}
                className="flex flex-col justify-center items-center bg-gray-100 rounded-lg overflow-hidden cursor-pointer mx-auto"
                style={{ maxWidth: "300px" }}
                onClick={() => handleImageClick(type.typePicture)}
              >
                <div className="relative w-full h-48">
                  <Image
                    src={type.typePicture}
                    alt={type.typeName}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                  />
                </div>
                <p className="mt-2 text-sm text-tertiary font-medium text-center">
                  {type.typeName} - ${type.price}
                </p>
              </SwiperSlide>
            ))
          )}
        </Swiper>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50"
          onClick={closeModal}
        >
          <div className="relative w-11/12 md:w-3/4 lg:w-1/2 h-1/2 md:h-3/4 rounded-lg p-4">
            <div className="relative w-full h-full">
              <Image
                src={selectedImage}
                alt="Selected Image"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-row gap-5">
        <div className="p-2 rounded-lg border border-primary text-primary cursor-pointer">
          &lt; Back
        </div>
        <Link href={"/packageDetails"}>
          <div className="p-2 rounded-lg bg-primary text-gray-100 cursor-pointer">
            Next &gt;
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Choosepackage;
