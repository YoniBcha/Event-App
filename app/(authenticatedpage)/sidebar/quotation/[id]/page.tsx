/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import BulkTable from "@/components/tables/table1";
import BulkTable2 from "@/components/tables/table2";
// import { useGetSelfBookedEventsQuery } from "@/store/endpoints/apiSlice";
import Image from "next/image";
// import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function Quotation() {
  const [logo, setLogo] = useState("/path/to/default/logo.png");
  // const params = useParams();
  // const id = params.id;
  // const { data, error, isLoading } = useGetSelfBookedEventsQuery(id);
  const [showTerms, setShowTerms] = useState(false); // State to control visibility of terms
  const currentLocale = useSelector(
    (state: any) => state.language.currentLocale
  );

  useEffect(() => {
    if (typeof window === "undefined") return; // Ensure we're on the client side
    const storedTheme = localStorage.getItem("appTheme");
    if (storedTheme) {
      try {
        const { logo } = JSON.parse(storedTheme);
        setLogo(logo);
      } catch (error) {
        console.error("Failed to parse stored theme:", error);
      }
    }
  }, []);

  const handlePrint = () => {
    if (showTerms) {
      window.print(); // Trigger print functionality
    }
  };

  return (
    <div>
      <div></div>
      <div className="p-4 rounded-md bg-[#fffff4]">
        <div className="flex justify-start">Date of creation: 20/02/2003</div>

        <div className="flex flex-col w-full gap-3">
          <div className="flex-grow flex justify-center">
            <Image src={logo} alt="Logo" width={80} height={40} />
          </div>
          <BulkTable />
          <div className="text-lg text-primary">
            This offer is valid for one week from the date of creation
          </div>
          <BulkTable2 />

          <div className="flex flex-row justify-between">
            {/* First Column */}
            <div className="flex flex-col justify-between">
              {/* Top Div */}
              <div>
                <input
                  type="checkbox"
                  checked={showTerms}
                  onChange={(e) => setShowTerms(e.target.checked)}
                />{" "}
                <span>TERMS & CONDITIONS</span>
              </div>
              {/* Bottom Div */}
              <div className="flex justify-center">
                <div
                  className="rounded-xl bg-primary text-white px-10 py-1 w-fit cursor-pointer"
                  onClick={handlePrint}
                >
                  Print
                </div>
              </div>
            </div>

            {/* Second Column - Table */}
            <div className="rounded-lg p-4">
              <table className="w-full border bg-secondary border-gray-300 rounded-sm">
                <tbody>
                  {/* Row 1 */}
                  <tr className="border-b border-gray-300">
                    <td className="py-2 px-3 border-r border-gray-300">
                      Total
                    </td>
                    <td className="flex py-2 px-3 justify-center items-center border-r border-gray-300">
                      35,000{" "}
                      <Image
                        src="/images/SR.png"
                        alt="SR"
                        width={10}
                        height={10}
                        className={`ml-1 ${
                          currentLocale === "ar" ? "scale-x-[-1]" : ""
                        }`}
                      />
                    </td>
                  </tr>
                  {/* Row 2 */}
                  <tr className="border-b border-gray-300">
                    <td className="py-2 px-3 border-r border-gray-300">
                      VAT 15%
                    </td>
                    <td className="flex py-2 px-3 justify-center items-center border-r border-gray-300">
                      4,555{" "}
                      <Image
                        src="/images/SR.png"
                        alt="SR"
                        width={10}
                        height={10}
                        className={`ml-1 ${
                          currentLocale === "ar" ? "scale-x-[-1]" : ""
                        }`}
                      />
                    </td>
                  </tr>
                  {/* Row 3 */}
                  <tr>
                    <td className="py-2 px-3 border-r border-gray-300">
                      Amounts
                    </td>
                    <td className="flex py-2 px-3 justify-center items-center border-r border-gray-300">
                      45,888
                      <Image
                        src="/images/SR.png"
                        alt="SR"
                        width={10}
                        height={10}
                        className={`ml-1 ${
                          currentLocale === "ar" ? "scale-x-[-1]" : ""
                        }`}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Terms and Conditions Section */}
          {showTerms && (
            <div className="mt-6 p-4 border-t border-gray-300">
              <h2 className="text-center text-xl font-bold underline">
                TERMS AND CONDITIONS
              </h2>
              <ul className="list-disc pl-6 mt-4">
                <li>All payments are non-refundable.</li>
                <li>Delivery timelines are subject to change.</li>
                <li>Any additional costs will be communicated in advance.</li>
                <li>Client must notify us of any issues within 7 days.</li>
              </ul>
              <div className="flex justify-between mt-6">
                <div>
                  <p className="font-semibold">Client Signature</p>
                  <div className="mt-2 border-b-2 border-dashed border-gray-500 w-48"></div>
                </div>
                <div>
                  <p className="font-semibold">Fenzo-Events</p>
                  <div className="mt-2 border-b-2 border-dashed border-gray-500 w-48"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Quotation;
