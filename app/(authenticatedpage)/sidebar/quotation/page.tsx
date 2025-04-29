/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import BulkTable from "@/components/tables/table1";
import BulkTable2 from "@/components/tables/table2";
import { useGetSingleSelfBookedEventsQuery } from "@/store/endpoints/apiSlice";
import moment from "moment";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import html2pdf from "html2pdf.js";
import { FaCheckCircle } from "react-icons/fa";
import { pdf, PDFViewer } from "@react-pdf/renderer";
import { renderToStream } from "@react-pdf/renderer";
// import { PDFDownloadLink } from "@react-pdf/renderer";
import dynamic from "next/dynamic";
import QuotationPDF from "@/components/PDF/QuotationPDF";
// const QuotationPDF = dynamic(
//   () => import("@/components/PDF/QuotationPDF").then((mod) => mod.default),
//   {
//     ssr: false,
//     loading: () => <p>Loading PDF content...</p>,
//   }
// );

// PDFDownloadLink wrapper
const PDFDownloader = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <div>Loading PDF generator...</div>;

  const PDFViewer = dynamic(
    () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
    { ssr: false }
  );
};
// 2. Then dynamically import PDFDownloadLink
// const PDFDownloadLink = dynamic(
//   () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
//   {
//     ssr: false,
//     loading: () => <p>Preparing download...</p>,
//   }
// );

// import QuotationPDF from "./QuotationPDF";

// import PDFDownloadButton from "@/components/PDF/PDFDownloadButton";
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
  const translations = useSelector((state: any) => state.language.translations);

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

  // const handleDownload = () => {
  //   if (!showTerms) {
  //     setErrorMessage("Please check the Read checkbox to proceed.");
  //     return;
  //   }
  //   setErrorMessage("");

  //   const element = document.getElementById("quotation-page");
  //   if (element) {
  //     // Configure html2pdf.js options
  //     const options = {
  //       margin: 10, // Margin around the content
  //       filename: `quotation-packageId=${id}.pdf`, // Name of the PDF file
  //       image: { type: "jpeg", quality: 2 }, // Image quality
  //       html2canvas: {
  //         scale: 2,
  //         useCORS: true,
  //         allowTaint: true,
  //         ignoreElements: (element: any) => {
  //           // Ignore elements with specific classes or IDs
  //           return (
  //             element.classList.contains("no-pdf") || // Add this class to elements to exclude
  //             element.id === "status-section" || // Exclude status section
  //             element.id === "download-section" // Exclude download section
  //           );
  //         },
  //       }, // html2canvas options
  //       jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }, // jsPDF options
  //     };

  //     // Generate the PDF
  //     html2pdf().from(element).set(options).save();
  //   }
  // };

  const handleDownload = async () => {
    try {
      // 1. Create the PDF blob
      const blob = await pdf(
        <QuotationPDF
          data={data}
          translations={translations}
          currentLocale={currentLocale}
          logo={logo}
        />
      ).toBlob();

      // 2. Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `quotation-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();

      // 3. Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 0);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  // const handlePrint = () => {
  //   if (!showTerms) {
  //     setErrorMessage("Please check the Read checkbox to proceed.");
  //     return;
  //   }
  //   setErrorMessage("");

  //   // Open the print dialog for the #quotation-page div
  //   const printContents = document.getElementById("quotation-page")?.innerHTML;
  //   const originalContents = document.body.innerHTML;

  //   // Replace the body content with the quotation page content
  //   if (printContents) {
  //     // Add print-specific styles to remove headers, footers, links, and the print button
  //     const printStyles = `
  //     <style>
  //       @media print {
  //         @page {
  //           margin: 0; /* Remove default margins */
  //         }
  //         body {
  //           margin: 0; /* Remove body margins */
  //         }
  //         /* Hide headers, footers, and the print button */
  //         .header, .footer, .no-print, .print-button {
  //           display: none !important;
  //         }
  //         /* Remove web links */
  //         a {
  //           text-decoration: none !important;
  //           color: inherit !important;
  //         }
  //         /* Hide elements for PDF */
  //         .no-pdf, #status-section, #download-section {
  //           display: none !important;
  //         }
  //       }
  //     </style>
  //   `;

  //     // Combine the print content with the print styles
  //     document.body.innerHTML = printStyles + printContents;

  //     // Trigger the print dialog
  //     window.print();

  //     // Restore the original content
  //     document.body.innerHTML = originalContents;

  //     // Reload the page to restore functionality
  //     window.location.reload();
  //   }
  // };

  const statusTranslations = {
    underReview: translations.booking.underReview,
    completed: translations.booking.completed,
    rejected: translations.booking.rejected,
    cancelled: translations.booking.cancelled,
  };
  const renderValue = (
    defaultValue: string,
    translatedValue: string | undefined
  ) => {
    return currentLocale === "ar" && translatedValue
      ? translatedValue
      : defaultValue;
  };
  return (
    <div>
      <div
        id="quotation-page"
        className="p-4 rounded-md bg-[#fffff4] w-full max-w-[800px] mx-auto relative" // Add `relative` for positioning
      >
        {/* Header Section */}
        <div className="relative mb-4">
          {/* Container for small devices (flex-col) */}
          <div className="flex flex-col sm:hidden">
            {/* Status at top-right for mobile */}
            {data?.bookedEvents && (
              <div
                className={`text-sm font-semibold px-3 py-1 rounded-full border self-end mb-2 ${
                  data.bookedEvents.orderStatus === "completed"
                    ? "bg-green-500 text-white"
                    : data.bookedEvents.orderStatus === "rejected"
                    ? "bg-red-500 text-white"
                    : data.bookedEvents.orderStatus === "underReview"
                    ? "bg-yellow-500 text-black animate-zoom"
                    : "bg-gray-500 text-white"
                }`}
              >
                {currentLocale === "ar"
                  ? statusTranslations[
                      data.bookedEvents
                        .orderStatus as keyof typeof statusTranslations
                    ] || data.bookedEvents.orderStatus
                  : data.bookedEvents.orderStatus}
              </div>
            )}

            {/* Date below for mobile */}
            <div className="text-sm sm:text-base">
              {translations.date_of_creation}:{" "}
              {moment(data?.bookedEvents?.createdAt).format("MMMM DD, YYYY")}
            </div>
          </div>

          {/* Container for larger devices (flex-row justify-between) */}
          <div className="hidden sm:flex justify-between items-center">
            {/* Date on left */}
            <div className="text-sm sm:text-base">
              {translations.date_of_creation}:{" "}
              {moment(data?.bookedEvents?.createdAt).format("MMMM DD, YYYY")}
            </div>

            {/* Status on right */}
            {data?.bookedEvents && (
              <div
                className={`text-sm font-semibold px-3 py-1 rounded-full border ${
                  data.bookedEvents.orderStatus === "completed"
                    ? "bg-green-500 text-white"
                    : data.bookedEvents.orderStatus === "rejected"
                    ? "bg-red-500 text-white"
                    : data.bookedEvents.orderStatus === "underReview"
                    ? "bg-yellow-500 text-black animate-zoom"
                    : "bg-gray-500 text-white"
                }`}
              >
                {currentLocale === "ar"
                  ? statusTranslations[
                      data.bookedEvents
                        .orderStatus as keyof typeof statusTranslations
                    ] || data.bookedEvents.orderStatus
                  : data.bookedEvents.orderStatus}
              </div>
            )}
          </div>
        </div>
        {data?.bookedEvents?.orderStatus === "paymentApproved" && (
          <div className="flex flex-row gap-2   justify-start text-green-500 text-start  w-full">
            <div className="text-green-500 text-lg ">
              <FaCheckCircle />
            </div>
            <div>{translations.booking.paymentApproved}</div>
          </div>
        )}
        {/* Logo (Centered) */}
        <div className="flex-grow flex justify-center py-2">
          <Image src={logo} alt="Logo" width={80} height={40} />
        </div>

        {/* Rest of the Quotation Content */}
        <div className="flex flex-col w-full gap-3">
          {data && data.bookedEvents ? (
            <BulkTable
              personalData={data.bookedEvents.personalData}
              eventDetails={{
                packageName: renderValue(
                  data.bookedEvents.priceDetails.eventPackage.name,
                  data.bookedEvents.priceDetails.eventPackage
                    .translatedPackageName
                ),
                packagePrice: data.bookedEvents.eventPackage.packagePrice,
                status: data.bookedEvents.orderStatus,
                place: data.bookedEvents.place,
                city: data.bookedEvents.city,
                date: data.bookedEvents.date,
                eventType: data.bookedEvents.eventType,
                eventDesign: data.bookedEvents.eventDesign,
                additions: data.bookedEvents.eventPackage.additions,
              }}
            />
          ) : (
            <div>{translations.no_booked_events}</div>
          )}

          {/* Other Sections */}
          <div className="text-lg text-primary">
            {translations.offer_validity}
          </div>
          <BulkTable2
            eventPackageAdditions={data?.bookedEvents?.priceDetails?.additions}
            extraServices={data?.bookedEvents?.priceDetails?.extraServices}
          />

          {/* Total Price Table */}
          <div className="flex flex-row justify-between">
            {/* First Column */}
            <div></div>
            {/* <div
              id="download-section"
              className="flex flex-col justify-between"
            >
              {" "}
            
              <div className="print-button no-pdf">
       
                <input
                  type="checkbox"
                  checked={showTerms}
                  onChange={(e) => {
                    setShowTerms(e.target.checked);
                  }}
                />{" "}
                <span>{translations.read}</span>
              </div>
              {errorMessage && !showTerms && (
                <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
              )}
               
              
            </div> */}

            {/* Second Column - Table */}
            <div className="rounded-lg p-4">
              <table className="w-full border bg-secondary border-gray-100 rounded-sm">
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 px-3 border-r border-gray-100">
                      {translations.total_price_before_vat}
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
                      {translations.vat_15}
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

                  {data?.bookedEvents?.discountAmount && (
                    <tr className="border-b border-gray-100">
                      <td className="py-2 px-3 border-r border-gray-100">
                        {translations.discount}
                      </td>
                      <td className="flex py-2 px-3 justify-center items-center border-r border-gray-100">
                        {data?.bookedEvents?.discountAmount}{" "}
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
                  )}

                  <tr>
                    <td className="py-2 px-3 border-r border-gray-100">
                      {translations.total_price_after_vat}
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

          <div className="mt-6 p-4 border-t border-gray-100">
            <h2 className="text-center text-xl font-bold underline">
              {translations.terms.title}
            </h2>
            <ul className="list-disc text-primary pl-6 mt-4">
              {Array.isArray(translations.terms.items) &&
                translations.terms.items.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
            </ul>
            <div className="flex justify-between mt-6">
              <div className="text-center felx flex-col gap-3">
                <div className="font-semibold mb-7">
                  {translations.client_signature}
                </div>
                <div className="mt-2 border-b-2 border-dashed border-gray-500 w-20 md:w-40"></div>
              </div>
              <div className="text-center felx flex-col gap-3">
                <div className="font-semibold mb-7">
                  {translations.fenzo_events}
                </div>
                <div className="mt-2 border-b-2 border-dashed border-gray-500 w-20 md:w-48"></div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            {/* <PDFDownloadLink
              document={
                <QuotationPDF data={data} translations={translations} />
              }
              fileName={`quotation-${id}.pdf`}
            >
              {({ loading }) => (
                <button className="rounded-xl bg-primary mt-2 text-white px-10 py-1 w-fit cursor-pointer">
                  {loading ? "Generating..." : "Download PDF"}
                </button>
              )}
            </PDFDownloadLink> */}

            {/* <PDFViewer
              document={
                <QuotationPDF data={data} translations={translations} />
              }
              fileName="quote.pdf"
            >
              {({ loading }) => (loading ? "Loading..." : "Download PDF")}
            </PDFViewer> */}

            {/* {data && translations ? (
              <PDFDownloadButton
                document={
                  <QuotationPDF
                    data={data}
                    translations={translations}
                    currentLocale={currentLocale}
                    logo={logo}
                  />
                }
                fileName={`quotation-${id}.pdf`}
              />
            ) : (
              <button disabled>Loading data...</button>
            )} */}

            {/* <PDFDownloadButton
              document={
                <QuotationPDF data={data} translations={translations} />
              }
              fileName={`quotation-${id}.pdf`}
            /> */}

            <button
              className="rounded-xl bg-primary mt-2 text-white px-10 py-1 w-fit cursor-pointer"
              onClick={handleDownload}
            >
              download
            </button>
          </div>

          {/* <PDFViewer>
            <QuotationPDF
              data={data}
              translations={translations}
              currentLocale={currentLocale}
              logo={logo}
            />
          </PDFViewer> */}
        </div>
      </div>
    </div>
  );
}

export default Quotation;
