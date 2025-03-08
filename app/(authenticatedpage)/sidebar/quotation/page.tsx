/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import BulkTable from "@/components/tables/table1";
import BulkTable2 from "@/components/tables/table2";
import { useGetSingleSelfBookedEventsQuery } from "@/store/endpoints/apiSlice";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import html2pdf from "html2pdf.js";

function Quotation() {
  const [logo, setLogo] = useState("/path/to/default/logo.png");
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { data } = useGetSingleSelfBookedEventsQuery<any>(id);
  const [showTerms, setShowTerms] = useState(false); // State to control visibility of terms
  const [errorMessage, setErrorMessage] = useState(""); // State to handle error message
  const currentLocale = useSelector(
    (state: any) => state.language.currentLocale
  );

  useEffect(() => {
    if (typeof window === "undefined") return; // Ensure we're on the client side
    const storedTheme = localStorage.getItem("fenzoAppTheme");
    if (storedTheme) {
      try {
        const { logo } = JSON.parse(storedTheme);
        setLogo(logo);
      } catch (error) {
        console.error("Failed to parse stored theme:", error);
      }
    }
  }, []);

  const handleDownload = () => {
    if (!showTerms) {
      setErrorMessage("Please check the Read checkbox to proceed.");
      return;
    }
    setErrorMessage("");

    const element = document.getElementById("quotation-page");
    if (element) {
      // Configure html2pdf.js options
      const options = {
        margin: 10, // Margin around the content
        filename: `quotation-packageId=${id}.pdf`, // Name of the PDF file
        image: { type: "jpeg", quality: 2 }, // Image quality
        html2canvas: { scale: 2, useCORS: true, allowTaint: true }, // html2canvas options
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }, // jsPDF options
      };

      // Generate the PDF
      html2pdf().from(element).set(options).save();
    }
  };

  return (
    <div>
      <div
        id="quotation-page"
        className="p-4 rounded-md bg-[#fffff4] w-full max-w-[800px] mx-auto"
      >
        <div className="flex justify-start">Date of creation: 20/02/2003</div>

        <div className="flex flex-col w-full gap-3">
          <div className="flex-grow flex justify-center">
            <Image src={logo} alt="Logo" width={80} height={40} />
          </div>
          {data && data.bookedEvents ? (
            <BulkTable
              personalData={data.bookedEvents.personalData}
              eventDetails={{
                packageName: data.bookedEvents.eventPackage.packageName,
                packagePrice: data.bookedEvents.eventPackage.packagePrice,
                status: data.bookedEvents.orderStatus,
                place: data.bookedEvents.place,
                city: data.bookedEvents.city,
                date: data.bookedEvents.date,
                eventType: data.bookedEvents.eventType,
                eventDesign: data.bookedEvents.eventDesign,
              }}
            />
          ) : (
            <div>No booked events data available.</div>
          )}
          <div className="text-lg text-primary">
            This offer is valid for one week from the date of creation
          </div>
          <BulkTable2
            eventPackageAdditions={data?.bookedEvents?.priceDetails?.additions}
            extraServices={data?.bookedEvents?.priceDetails?.extraServices}
          />

          <div className="flex flex-row justify-between">
            {/* First Column */}
            <div className="flex flex-col justify-between">
              {/* Top Div */}
              <div>
                <input
                  type="checkbox"
                  checked={showTerms}
                  onChange={(e) => {
                    setShowTerms(e.target.checked);
                  }}
                />{" "}
                <span>READ</span>
              </div>
              {errorMessage && !showTerms && (
                <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
              )}
              {/* Bottom Div */}
              <div className="flex justify-center">
                <div
                  className="rounded-xl bg-primary mt-2 text-white px-10 py-1 w-fit cursor-pointer"
                  onClick={handleDownload}
                >
                  Download
                </div>
              </div>
            </div>

            {/* Second Column - Table */}
            <div className="rounded-lg p-4">
              <table className="w-full border bg-secondary border-gray-100 rounded-sm">
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 px-3 border-r border-gray-100">
                      Total Price Before Vat
                    </td>
                    <td className="flex py-2 px-3 justify-center items-center border-r border-gray-100">
                      {data?.bookedEvents?.priceBeforeVat}{" "}
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

                  <tr className="border-b border-gray-100">
                    <td className="py-2 px-3 border-r border-gray-100">
                      VAT 15%
                    </td>
                    <td className="flex py-2 px-3 justify-center items-center border-r border-gray-100">
                      {data?.bookedEvents?.vatAmount}{" "}
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

                  <tr>
                    <td className="py-2 px-3 border-r border-gray-100">
                      Total Price After Vat
                    </td>
                    <td className="flex py-2 px-3 justify-center items-center border-r border-gray-200">
                      {data?.bookedEvents?.priceAfterVat}{" "}
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
            <div className="mt-6 p-4 border-t border-gray-100">
              <h2 className="text-center text-xl font-bold underline">
                TERMS AND CONDITIONS
              </h2>
              <ul className="list-disc text-primary pl-6 mt-4">
                <li>
                  The agreed deposit is paid by the first party (the customer)
                  to confirm the order. In the event of cancellation, even if it
                  is after two days, it is non-refundable and is the right of
                  the second party.
                </li>
                <li>
                  In cases of first-degree death or an accident to one of the
                  parties to the event, the amount is kept as a balance for the
                  customer that he can use during a period to be agreed upon.
                </li>
                <li>
                  If the type of party is changed or the party is changed after
                  the event is postponed, any purchases will be deducted from
                  the deposit and then the rest of the amount will be agreed
                  upon with a new invoice.
                </li>
                <li>
                  The order is detailed in the invoice. Any information provided
                  over the phone or WhatsApp is not recognized.
                </li>
                <li>
                  Any additions by the first party will increase the amount and
                  a new invoice will be created.
                </li>
                <li>
                  Venzo must be notified of any additions at least 3 days before
                  the event. Otherwise, Venzo has the right to refuse additional
                  work during this period due to time constraints.
                </li>
                <li>
                  Rented items must be returned in full and sold items are the
                  customer&apos;s responsibility.
                </li>
                <li>
                  Any damage to the items caused by the customer will be borne
                  by the customer.
                </li>
                <li>
                  Venzo must be informed of the presence of a second contractor
                  at the same event. If Venzo is not informed and there is a
                  conflict between Venzo and the other contractor, Venzo has the
                  right to leave.
                </li>
                <li>
                  In case of changing the place, Venzo must be informed, and if
                  it results in changing the amount, the first party must know
                  this and abide by it.
                </li>
                <li>
                  It is preferable for someone to contact Venzo from the first
                  party to maintain the organization of the work.
                </li>
                <li>
                  Venzo is not responsible for damages due to factors beyond its
                  control such as weather, natural disasters and global events
                  unless Saudi law provides for this, such as the Corona
                  incident.
                </li>
                <li>
                  The terms and conditions are read and agreed to either in
                  writing or by paying the deposit.
                </li>
              </ul>
              <div className="flex justify-between mt-6">
                <div>
                  <p className="font-semibold">Client Signature</p>
                  <div className="mt-2 border-b-2 border-dashed border-gray-500 w-20 md:w-48"></div>
                </div>
                <div>
                  <p className="font-semibold">Fenzo-Events</p>
                  <div className="mt-2 border-b-2 border-dashed border-gray-500 w-20 md:w-48"></div>
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
// "use client";
// import BulkTable from "@/components/tables/table1";
// import BulkTable2 from "@/components/tables/table2";
// // import { logoutUser } from "@/store/authReducer";
// import { useGetSingleSelfBookedEventsQuery } from "@/store/endpoints/apiSlice";
// import Image from "next/image";
// import { useSearchParams } from "next/navigation";
// import React, { useEffect, useState } from "react";
// // import { useDispatch } from "react-redux";
// import { useSelector } from "react-redux";
// // import Cookies from "js-cookie";
// function Quotation() {
//   const [logo, setLogo] = useState("/path/to/default/logo.png");
//   const searchParams = useSearchParams();
//   const id = searchParams.get("id");
//   const { data } = useGetSingleSelfBookedEventsQuery<any>(id);
//   const [showTerms, setShowTerms] = useState(false); // State to control visibility of terms
//   const currentLocale = useSelector(
//     (state: any) => state.language.currentLocale
//   );
//   // const dispatch = useDispatch();
//   // const router = useRouter();
//   // const { data: datas, error } = useGetUserInfoQuery<any>({});
//   // const [logoutUserMutation] = useLogoutUserMutation(); // Initialize the mutation
//   // const translations = useSelector(
//   //   (state: RootState) => state.language.translations
//   // );

//   // useEffect(() => {
//   //   // Define an async function to handle the logout logic
//   //   const handleLogout = async () => {
//   //     // Check if the response contains an error or specific messages
//   //     if (
//   //       datas?.message === "Session expired" ||
//   //       datas?.message === "User Unauthorized" ||
//   //       error?.data?.message === "Session expired" ||
//   //       error?.data?.message === "User Unauthorized"
//   //     ) {
//   //       try {
//   //         // Call the logout mutation
//   //         await logoutUserMutation({}).unwrap();

//   //         // Dispatch the logout action to update Redux state
//   //         dispatch(logoutUser());

//   //         // Clear cookies
//   //         Cookies.remove("token");
//   //         Cookies.remove("user-info");
//   //         Cookies.remove("token_creation_time");

//   //         // Redirect to login page with payload

//   //         router.push("/login");
//   //       } catch (error) {
//   //         console.error("Logout failed:", error);
//   //       }
//   //     }
//   //   };

//   //   // Call the async function
//   //   handleLogout();
//   // }, [datas?.message, error, logoutUserMutation, dispatch, router]); //   );

//   useEffect(() => {
//     if (typeof window === "undefined") return; // Ensure we're on the client side
//     const storedTheme = localStorage.getItem("fenzoAppTheme");
//     if (storedTheme) {
//       try {
//         const { logo } = JSON.parse(storedTheme);
//         setLogo(logo);
//       } catch (error) {
//         console.error("Failed to parse stored theme:", error);
//       }
//     }
//   }, []);

//   const handlePrint = () => {
//     if (showTerms) {
//       window.print(); // Trigger print functionality
//     }
//   };

//   return (
//     <div>
//       <div></div>
//       <div className="p-4 rounded-md bg-[#fffff4]">
//         <div className="flex justify-start">Date of creation: 20/02/2003</div>

//         <div className="flex flex-col w-full gap-3">
//           <div className="flex-grow flex justify-center">
//             <Image src={logo} alt="Logo" width={80} height={40} />
//           </div>
//           {data && data.bookedEvents ? (
//             <BulkTable
//               personalData={data.bookedEvents.personalData}
//               eventDetails={{
//                 packageName: data.bookedEvents.eventPackage.packageName,
//                 packagePrice: data.bookedEvents.eventPackage.packagePrice,
//                 status: data.bookedEvents.orderStatus,
//                 place: data.bookedEvents.place,
//                 city: data.bookedEvents.city,
//                 date: data.bookedEvents.date,
//                 eventType: data.bookedEvents.eventType,
//                 eventDesign: data.bookedEvents.eventDesign,
//               }}
//             />
//           ) : (
//             <div>No booked events data available.</div>
//           )}
//           <div className="text-lg text-primary">
//             This offer is valid for one week from the date of creation
//           </div>
//           <BulkTable2
//             eventPackageAdditions={data?.bookedEvents?.priceDetails?.additions}
//             extraServices={data?.bookedEvents?.priceDetails?.extraServices}
//           />

//           <div className="flex flex-row justify-between">
//             {/* First Column */}
//             <div className="flex flex-col justify-between">
//               {/* Top Div */}
//               <div>
//                 <input
//                   type="checkbox"
//                   checked={showTerms}
//                   onChange={(e) => setShowTerms(e.target.checked)}
//                 />{" "}
//                 <span>TERMS & CONDITIONS</span>
//               </div>
//               {/* Bottom Div */}
//               <div className="flex justify-center">
//                 {showTerms && (
//                   <div
//                     className="rounded-xl bg-primary mt-2 text-white px-10 py-1 w-fit cursor-pointer"
//                     onClick={handlePrint}
//                   >
//                     Print
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Second Column - Table */}
//             <div className="rounded-lg p-4">
//               <table className="w-full border bg-secondary border-gray-100 rounded-sm">
//                 <tbody>
//                   <tr className="border-b border-gray-100">
//                     <td className="py-2 px-3 border-r border-gray-100">
//                       Total Price Before Vat
//                     </td>
//                     <td className="flex py-2 px-3 justify-center items-center border-r border-gray-100">
//                       {data?.bookedEvents?.priceBeforeVat}{" "}
//                       <Image
//                         src="/images/SR.png"
//                         alt="SR"
//                         width={10}
//                         height={10}
//                         className={`ml-1 ${
//                           currentLocale === "ar" ? "scale-x-[-1]" : ""
//                         }`}
//                       />
//                     </td>
//                   </tr>

//                   <tr className="border-b border-gray-100">
//                     <td className="py-2 px-3 border-r border-gray-100">
//                       VAT 15%
//                     </td>
//                     <td className="flex py-2 px-3 justify-center items-center border-r border-gray-100">
//                       {data?.bookedEvents?.vatAmount}{" "}
//                       <Image
//                         src="/images/SR.png"
//                         alt="SR"
//                         width={10}
//                         height={10}
//                         className={`ml-1 ${
//                           currentLocale === "ar" ? "scale-x-[-1]" : ""
//                         }`}
//                       />
//                     </td>
//                   </tr>

//                   <tr>
//                     <td className="py-2 px-3 border-r border-gray-100">
//                       Total Price After Vat
//                     </td>
//                     <td className="flex py-2 px-3 justify-center items-center border-r border-gray-200">
//                       {data?.bookedEvents?.priceAfterVat}{" "}
//                       <Image
//                         src="/images/SR.png"
//                         alt="SR"
//                         width={10}
//                         height={10}
//                         className={`ml-1 ${
//                           currentLocale === "ar" ? "scale-x-[-1]" : ""
//                         }`}
//                       />
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Terms and Conditions Section */}
//           {showTerms && (
//             <div className="mt-6 p-4 border-t border-gray-100">
//               <h2 className="text-center text-xl font-bold underline">
//                 TERMS AND CONDITIONS
//               </h2>
//               <ul className="list-disc text-primary pl-6 mt-4">
//                 <li>
//                   The agreed deposit is paid by the first party (the customer)
//                   to confirm the order. In the event of cancellation, even if it
//                   is after two days, it is non-refundable and is the right of
//                   the second party.
//                 </li>
//                 <li>
//                   In cases of first-degree death or an accident to one of the
//                   parties to the event, the amount is kept as a balance for the
//                   customer that he can use during a period to be agreed upon.
//                 </li>
//                 <li>
//                   If the type of party is changed or the party is changed after
//                   the event is postponed, any purchases will be deducted from
//                   the deposit and then the rest of the amount will be agreed
//                   upon with a new invoice.
//                 </li>
//                 <li>
//                   The order is detailed in the invoice. Any information provided
//                   over the phone or WhatsApp is not recognized.
//                 </li>
//                 <li>
//                   Any additions by the first party will increase the amount and
//                   a new invoice will be created.
//                 </li>
//                 <li>
//                   Venzo must be notified of any additions at least 3 days before
//                   the event. Otherwise, Venzo has the right to refuse additional
//                   work during this period due to time constraints.
//                 </li>
//                 <li>
//                   Rented items must be returned in full and sold items are the
//                   customer&apos;s responsibility.
//                 </li>
//                 <li>
//                   Any damage to the items caused by the customer will be borne
//                   by the customer.
//                 </li>
//                 <li>
//                   Venzo must be informed of the presence of a second contractor
//                   at the same event. If Venzo is not informed and there is a
//                   conflict between Venzo and the other contractor, Venzo has the
//                   right to leave.
//                 </li>
//                 <li>
//                   In case of changing the place, Venzo must be informed, and if
//                   it results in changing the amount, the first party must know
//                   this and abide by it.
//                 </li>
//                 <li>
//                   It is preferable for someone to contact Venzo from the first
//                   party to maintain the organization of the work.
//                 </li>
//                 <li>
//                   Venzo is not responsible for damages due to factors beyond its
//                   control such as weather, natural disasters and global events
//                   unless Saudi law provides for this, such as the Corona
//                   incident.
//                 </li>
//                 <li>
//                   The terms and conditions are read and agreed to either in
//                   writing or by paying the deposit.
//                 </li>
//               </ul>
//               <div className="flex justify-between mt-6">
//                 <div>
//                   <p className="font-semibold">Client Signature</p>
//                   <div className="mt-2 border-b-2 border-dashed border-gray-500 w-20 md:w-48"></div>
//                 </div>
//                 <div>
//                   <p className="font-semibold">Fenzo-Events</p>
//                   <div className="mt-2 border-b-2 border-dashed border-gray-500 w-20 md:w-48"></div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Quotation;
