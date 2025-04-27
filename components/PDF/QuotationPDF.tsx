
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  Document,
  Page,
  Text,
  Font,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import moment from "moment";

// Register fonts (optional)

Font.register({
  family: "Universal",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5Q.ttf",
      fontWeight: "normal",
    }, // Latin (Roboto)
    {
      src: "https://fonts.gstatic.com/s/notosansarabic/v18/nwpxtLGrOAZMl5nJ_wfgRg3DrWFZWsnVBJ_sS6tlqHHFlhQ5l3sQWIHPqzCfyGy3XBoA.ttf",
      fontWeight: "normal",
    }, // Arabic (Noto)
  ],
});

Font.register({
  family: "Inter",
  src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZg.ttf",
});

// Register Arabic font (Tajawal is a good choice)
// Font.register({
//   family: "Tajawal",
//   src: "https://fonts.gstatic.com/s/tajawal/v9/Iurf6YBj_oCad4k1l_6gLrZjiYJ_.ttf",
//   // For production, host the font file yourself
// });
// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Inter",
  },
  section: {
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginVertical: 15,
  },
  watermark: {
    position: "absolute",
    top: "40%",
    left: "20%",
    transform: "rotate(-45deg)",
    opacity: 0.1,
  },
  watermarkText: {
    fontSize: 50,
    color: "grey",
  },
  logo: {
    width: 80,
    height: 40,
  },
  gridContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  gridContainer2: {
    flexDirection: "column",
    marginBottom: 15,
  },
  tableContainer: {
    width: "50%",
    padding: 5,
  },
  tableContainer2: {
    width: "100%",
    padding: 5,
  },
  table: {
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#EFE7DF",
  },
  tableHeader: {
    backgroundColor: "#C3937A",
    color: "white",
    padding: 5,
    textAlign: "left",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#EFE7DF",
  },
  tableCell: {
    padding: 5,
    fontSize: 10,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    fontSize: 10,
    marginLeft: "auto",
  },
  priceTable: {
    width: "50%",
    alignSelf: "flex-end",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#EFE7DF",
  },
  termsTitle: {
    textAlign: "center",
    fontSize: 16,
    textDecoration: "underline",
    marginVertical: 10,
  },
  termsList: {
    paddingLeft: 20,
    fontSize: 10,
  },
  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "dashed",
    width: 100,
    marginTop: 5,
  },
  currencySymbol: {
    width: 10,
    height: 10,
    marginLeft: 3,
  },
});
const statusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "#10B981";
    case "rejected":
      return "#EF4444";
    case "underReview":
      return "#F59E0B";
    default:
      return "#6B7280";
  }
};

// Create Document Component
const QuotationPDF = ({ data, translations, currentLocale, logo }: any) => {
  const renderValue = (
    defaultValue: string,
    translatedValue: string | undefined
  ) => {
    return currentLocale === "ar" && translatedValue
      ? translatedValue
      : defaultValue;
  };
  const getFontFamily = (locale: string) => {
    return locale === "ar" ? "Inter" : "Inter";
  };

  return (
    <Document>
      <Page
        size="A4"
        style={{
          fontFamily: getFontFamily(currentLocale),
          padding: 30,
          direction: "rtl",
        }}
      >
        {/* Header with date and status */}
        <View style={styles.header}>
          <View>
            <Text style={{ fontSize: 10 }}>
              {translations?.date_of_creation}:{" "}
              {moment(data?.bookedEvents?.createdAt).format("MMMM DD, YYYY")}
            </Text>
          </View>
          {data?.bookedEvents && (
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: statusColor(data.bookedEvents.orderStatus) },
              ]}
            >
              <Text
                style={{
                  color:
                    data.bookedEvents.orderStatus === "underReview"
                      ? "#000"
                      : "#fff",
                }}
              >
                {data.bookedEvents.orderStatus}
              </Text>
            </View>
          )}
        </View>
        {/* Watermark */}
        <View style={styles.watermark}>
          <Text style={styles.watermarkText}>QUOTATION</Text>
        </View>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image src={logo} style={styles.logo} />
        </View>

        {/* Main content - Two column tables */}
        <View style={styles.gridContainer}>
          {/* First table - Personal data */}
          <View style={styles.tableContainer}>
            <View style={styles.table}>
              {/* Table rows */}
              {[
                {
                  label: translations?.full_name,
                  value: data?.bookedEvents?.personalData?.fullName || "N/A",
                },
                {
                  label: translations?.mobile_number,
                  value:
                    data?.bookedEvents?.personalData?.mobileNumber || "N/A",
                },
                {
                  label: translations?.second_mobile_number,
                  value:
                    data?.bookedEvents?.personalData?.secondMobileNumber ||
                    "N/A",
                },
                {
                  label: translations?.event_type,
                  value:
                    renderValue(
                      data?.bookedEvents?.eventType?.nameOfEvent,
                      data?.bookedEvents?.eventType?.translatedNameOfEvent
                    ) || "N/A",
                },
                {
                  label: translations?.location,
                  value: data?.bookedEvents?.personalData?.place || "N/A",
                },
                {
                  label: translations?.date,
                  value: data?.bookedEvents?.date
                    ? moment(data.bookedEvents.date).format("DD-MM-YYYY")
                    : "N/A",
                },
                {
                  label: translations?.city,
                  value: data?.bookedEvents?.city || "N/A",
                },
                {
                  label: translations?.place,
                  value: data?.bookedEvents?.place || "N/A",
                },
                {
                  label: translations?.booking?.favoriteColor,
                  value: (
                    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                      {data?.bookedEvents?.personalData?.favoriteColors?.map(
                        (color: string, i: number) => (
                          <View key={i}>
                            <Text
                              style={{
                                width: 10,
                                height: 10,
                                backgroundColor: color,
                                marginRight: 3,
                                padding: 5,
                                color: "transparent",
                              }}
                            >
                              color
                            </Text>
                            <Text>,</Text>
                          </View>
                        )
                      )}
                    </View>
                  ),
                },
                {
                  label: translations?.booking?.dressColor,
                  value: (
                    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                      {data?.bookedEvents?.personalData?.dressColor?.map(
                        (color: string, i: number) => (
                          <View key={i}>
                            <Text
                              style={{
                                width: 10,
                                height: 10,
                                backgroundColor: color,
                                marginRight: 3,
                                padding: 5,
                                color: "transparent",
                              }}
                            >
                              color
                            </Text>
                            <Text>,</Text>
                          </View>
                        )
                      )}
                    </View>
                  ),
                },
              ].map((row, i) => (
                <View key={i} style={styles.tableRow}>
                  <Text
                    style={[
                      styles.tableCell,
                      { width: "40%", fontWeight: "bold" },
                    ]}
                  >
                    {row.label}
                  </Text>
                  <Text style={[styles.tableCell, { width: "60%" }]}>
                    {row.value}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Second table - Event details */}
          <View style={styles.tableContainer}>
            <View style={styles.table}>
              {[
                {
                  label: translations?.event_design,
                  value: (
                    <View>
                      <Text>
                        {renderValue(
                          data?.bookedEvents?.eventDesign?.eventDesign,
                          data?.bookedEvents?.eventDesign?.translatedEventDesign
                        ) || "N/A"}
                      </Text>
                    </View>
                  ),
                },
                {
                  label: translations?.package_price,
                  value: (
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text>
                        {data?.bookedEvents?.eventPackage?.packagePrice || "0"}
                      </Text>
                      <Image
                        src="/images/SR.png"
                        style={styles.currencySymbol}
                      />
                    </View>
                  ),
                },
                {
                  label: translations?.package_name,
                  value: (
                    <View>
                      <Text>
                        {renderValue(
                          data?.bookedEvents?.priceDetails?.eventPackage?.name,
                          data?.bookedEvents?.priceDetails?.eventPackage
                            ?.translatedPackageName
                        ) || "N/A"}
                      </Text>
                    </View>
                  ),
                },
                {
                  label: translations?.additions || "Additions",
                  value: (
                    <View>
                      {data?.bookedEvents?.eventPackage?.additions?.length >
                        0 &&
                        data.bookedEvents.eventPackage.additions.map(
                          (addition: any, idx: number) => (
                            <Text key={idx} style={{ fontSize: 8 }}>
                              •{" "}
                              {renderValue(
                                addition.typeOfAddition,
                                addition.translatedTypeOfAddition
                              )}{" "}
                              (Qty: {addition.quantity})
                            </Text>
                          )
                        )}
                    </View>
                  ),
                },
                {
                  label: translations?.notes || "Notes",
                  value: (
                    <View>
                      <Text>
                        {data?.bookedEvents?.personalData?.notes || "N/A"}
                      </Text>
                    </View>
                  ),
                },
              ].map((row, i) => (
                <View key={i} style={styles.tableRow}>
                  <Text
                    style={[
                      styles.tableCell,
                      { width: "40%", fontWeight: "bold" },
                    ]}
                  >
                    {row.label}
                  </Text>
                  <View style={[styles.tableCell, { width: "60%" }]}>
                    {row.value}
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Package additions and extra services */}
        <View style={styles.gridContainer2}>
          {/* Package additions */}
          <View style={styles.tableContainer2}>
            <Text style={{ fontSize: 12, fontWeight: "bold", marginBottom: 5 }}>
              {translations?.event_package_additions}
            </Text>
            <View style={styles.table}>
              <View style={[styles.tableRow, { backgroundColor: "#C3937A" }]}>
                <Text
                  style={[styles.tableCell, { color: "white", width: "30%" }]}
                >
                  {translations?.addition_name}
                </Text>
                <Text
                  style={[styles.tableCell, { color: "white", width: "20%" }]}
                >
                  {translations?.type}
                </Text>
                <Text
                  style={[styles.tableCell, { color: "white", width: "15%" }]}
                >
                  {translations?.unit_price}
                </Text>
                <Text
                  style={[styles.tableCell, { color: "white", width: "15%" }]}
                >
                  {translations?.quantity}
                </Text>
                <Text
                  style={[styles.tableCell, { color: "white", width: "20%" }]}
                >
                  {translations?.total_price}
                </Text>
              </View>
              {data?.bookedEvents?.priceDetails?.additions?.length > 0 &&
                data?.bookedEvents?.priceDetails?.additions?.map(
                  (item: any, index: number) => (
                    <View key={index} style={styles.tableRow}>
                      <Text style={[styles.tableCell, { width: "30%" }]}>
                        {renderValue(item.name, item.translatedAdditionName)}
                      </Text>
                      <Text style={[styles.tableCell, { width: "20%" }]}>
                        {renderValue(item.type, item.translatedTypeName)}
                      </Text>
                      <View
                        style={[
                          styles.tableCell,
                          {
                            width: "15%",
                            flexDirection: "row",
                            alignItems: "center",
                          },
                        ]}
                      >
                        <Text>{item.unitPrice}</Text>
                        <Image
                          src="/images/SR.png"
                          style={styles.currencySymbol}
                        />
                      </View>
                      <Text style={[styles.tableCell, { width: "15%" }]}>
                        {item.quantity}
                      </Text>
                      <View
                        style={[
                          styles.tableCell,
                          {
                            width: "20%",
                            flexDirection: "row",
                            alignItems: "center",
                          },
                        ]}
                      >
                        <Text>{item.totalPrice}</Text>
                        <Image
                          src="/images/SR.png"
                          style={styles.currencySymbol}
                        />
                      </View>
                    </View>
                  )
                )}
            </View>
          </View>

          {/* Extra services */}

          {data?.bookedEvents?.priceDetails?.extraServices?.length && (
            <View style={styles.tableContainer2}>
              <Text
                style={{ fontSize: 12, fontWeight: "bold", marginBottom: 5 }}
              >
                {translations.extra_services}
              </Text>
              <View style={styles.table}>
                <View style={[styles.tableRow, { backgroundColor: "#C3937A" }]}>
                  <Text
                    style={[styles.tableCell, { color: "white", width: "40%" }]}
                  >
                    {translations.package_name}
                  </Text>
                  <Text
                    style={[styles.tableCell, { color: "white", width: "20%" }]}
                  >
                    {translations.package_price}
                  </Text>
                  <Text
                    style={[styles.tableCell, { color: "white", width: "20%" }]}
                  >
                    {translations.provider_name}
                  </Text>
                  <Text
                    style={[styles.tableCell, { color: "white", width: "20%" }]}
                  >
                    {translations.serviceName}
                  </Text>
                </View>

                {data?.bookedEvents?.priceDetails?.extraServices?.map(
                  (service: any, index: number) => (
                    <View key={index} style={styles.tableRow}>
                      <Text style={[styles.tableCell, { width: "40%" }]}>
                        {renderValue(
                          service.package,
                          service.translatedPackage
                        )}
                      </Text>
                      <View
                        style={[
                          styles.tableCell,
                          {
                            width: "20%",
                            flexDirection: "row",
                            alignItems: "center",
                          },
                        ]}
                      >
                        <Text>{service.price}</Text>
                        <Image
                          src="/images/SR.png"
                          style={styles.currencySymbol}
                        />
                      </View>
                      <Text style={[styles.tableCell, { width: "20%" }]}>
                        {service.provider}
                      </Text>
                      <Text style={[styles.tableCell, { width: "20%" }]}>
                        {renderValue(
                          service?.serviceName,
                          service?.translatedServiceName
                        )}
                      </Text>
                    </View>
                  )
                )}
              </View>
            </View>
          )}
        </View>
        {/* Price summary */}
        <View style={[styles.priceTable, { marginTop: 12 }]}>
          <View style={styles.table}>
            <View style={styles.priceRow}>
              <Text style={{ fontSize: 12 }}>
                {translations?.total_price_before_vat}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ fontSize: 12 }}>
                  {data?.bookedEvents?.priceBeforeVat}
                </Text>
                <Image src="/images/SR.png" style={styles.currencySymbol} />
              </View>
            </View>
            <View style={styles.priceRow}>
              <Text style={{ fontSize: 12 }}>{translations?.vat_15}</Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ fontSize: 12 }}>
                  {data?.bookedEvents?.vatAmount}
                </Text>
                <Image src="/images/SR.png" style={styles.currencySymbol} />
              </View>
            </View>
            <View style={[styles.priceRow, { borderBottomWidth: 0 }]}>
              <Text style={{ fontSize: 12 }}>
                {translations?.total_price_after_vat}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ fontSize: 12 }}>
                  {data?.bookedEvents?.priceAfterVat}
                </Text>
                <Image src="/images/SR.png" style={styles.currencySymbol} />
              </View>
            </View>
          </View>
        </View>

        {/* Offer validity */}
        <Text style={{ fontSize: 12, marginBottom: 10, marginTop: 10 }}>
          {translations?.offer_validity}
        </Text>
        {/* Terms and conditions */}
        <Text style={styles.termsTitle}>{translations?.terms.title}</Text>
        <View style={styles.termsList}>
          {Array.isArray(translations?.terms?.items) &&
            translations?.terms?.items?.map((item: string, index: number) => (
              <Text key={index} style={{ marginBottom: 5 }}>
                • {item}
              </Text>
            ))}
        </View>

        {/* Signatures */}
        <View style={styles.signatureRow}>
          <View>
            <Text style={{ fontSize: 10 }}>
              {translations?.client_signature}
            </Text>
            <View style={styles.signatureLine} />
          </View>
          <View>
            <Text style={{ fontSize: 10 }}>{translations?.fenzo_events}</Text>
            <View style={styles.signatureLine} />
          </View>
        </View>
      </Page>
    </Document>
  );
};
export default QuotationPDF;

// import {
//   Document,
//   Page,
//   View,
//   Text,
//   StyleSheet,
//   Image as PDFImage,
//   Font,
// } from "@react-pdf/renderer";
// import moment from "moment";

// // Register fonts (optional)
// Font.register({
//   family: "Inter",
//   src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZg.ttf",
// });

// // Create styles
// const styles = StyleSheet.create({
//   page: {
//     padding: 30,
//     fontFamily: "Inter",
//   },
//   section: {
//     marginBottom: 10,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 20,
//   },
//   logoContainer: {
//     alignItems: "center",
//     marginVertical: 15,
//   },
//   logo: {
//     width: 80,
//     height: 40,
//   },
//   gridContainer: {
//     flexDirection: "row",
//     marginBottom: 15,
//   },
//   tableContainer: {
//     width: "50%",
//     padding: 5,
//   },
//   table: {
//     width: "100%",
//     borderStyle: "solid",
//     borderWidth: 1,
//     borderColor: "#EFE7DF",
//   },
//   tableHeader: {
//     backgroundColor: "#C3937A",
//     color: "white",
//     padding: 5,
//     textAlign: "left",
//   },
//   tableRow: {
//     flexDirection: "row",
//     borderBottomWidth: 1,
//     borderBottomColor: "#EFE7DF",
//   },
//   tableCell: {
//     padding: 5,
//     fontSize: 10,
//   },
//   statusBadge: {
//     paddingHorizontal: 10,
//     paddingVertical: 3,
//     borderRadius: 20,
//     fontSize: 10,
//     marginLeft: "auto",
//   },
//   priceTable: {
//     width: "50%",
//     alignSelf: "flex-end",
//   },
//   priceRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     padding: 5,
//     borderBottomWidth: 1,
//     borderBottomColor: "#EFE7DF",
//   },
//   termsTitle: {
//     textAlign: "center",
//     fontSize: 16,
//     textDecoration: "underline",
//     marginVertical: 10,
//   },
//   termsList: {
//     paddingLeft: 20,
//     fontSize: 10,
//   },
//   signatureRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 30,
//   },
//   signatureLine: {
//     borderBottomWidth: 1,
//     borderBottomColor: "#000",
//     borderBottomStyle: "dashed",
//     width: 100,
//     marginTop: 5,
//   },
//   currencySymbol: {
//     width: 10,
//     height: 10,
//     marginLeft: 3,
//   },
// });

// const QuotationPDF = ({ data, translations, currentLocale, logo }: any) => {
// const renderValue = (
//   defaultValue: string,
//   translatedValue: string | undefined
// ) => {
//   return currentLocale === "ar" && translatedValue
//     ? translatedValue
//     : defaultValue;
// };

// const statusColor = (status: string) => {
//   switch (status) {
//     case "completed":
//       return "#10B981";
//     case "rejected":
//       return "#EF4444";
//     case "underReview":
//       return "#F59E0B";
//     default:
//       return "#6B7280";
//   }
// };

//   return (
//     <Document>
//       <Page size="A4" style={styles.page}>
//         {/* Header with date and status */}
// <View style={styles.header}>
//   <View>
//     <Text style={{ fontSize: 10 }}>
//       {translations.date_of_creation}:{" "}
//       {moment(data?.bookedEvents?.createdAt).format("MMMM DD, YYYY")}
//     </Text>
//   </View>
//   {data?.bookedEvents && (
//     <View
//       style={[
//         styles.statusBadge,
//         { backgroundColor: statusColor(data.bookedEvents.orderStatus) },
//       ]}
//     >
//       <Text
//         style={{
//           color:
//             data.bookedEvents.orderStatus === "underReview"
//               ? "#000"
//               : "#fff",
//         }}
//       >
//         {data.bookedEvents.orderStatus}
//       </Text>
//     </View>
//   )}
// </View>

// {/* Logo */}
// <View style={styles.logoContainer}>
//   <PDFImage src={logo} style={styles.logo} />
// </View>

//         {/* Main content - Two column tables */}
// <View style={styles.gridContainer}>
//   {/* First table - Personal data */}
//   <View style={styles.tableContainer}>
//     <View style={styles.table}>
//       {/* Table rows */}
//       {[
//         {
//           label: translations.full_name,
//           value: data?.bookedEvents?.personalData?.fullName || "N/A",
//         },
//         {
//           label: translations.mobile_number,
//           value:
//             data?.bookedEvents?.personalData?.mobileNumber || "N/A",
//         },
//         {
//           label: translations.second_mobile_number,
//           value:
//             data?.bookedEvents?.personalData?.secondMobileNumber ||
//             "N/A",
//         },
//         {
//           label: translations.event_type,
//           value:
//             renderValue(
//               data?.bookedEvents?.eventType?.nameOfEvent,
//               data?.bookedEvents?.eventType?.translatedNameOfEvent
//             ) || "N/A",
//         },
//         {
//           label: translations.location,
//           value: data?.bookedEvents?.personalData?.place || "N/A",
//         },
//         {
//           label: translations.date,
//           value: data?.bookedEvents?.date
//             ? moment(data.bookedEvents.date).format("DD-MM-YYYY")
//             : "N/A",
//         },
//         {
//           label: translations.city,
//           value: data?.bookedEvents?.city || "N/A",
//         },
//         {
//           label: translations.place,
//           value: data?.bookedEvents?.place || "N/A",
//         },
//         {
//           label: translations.booking.favoriteColor,
//           value: (
//             <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
//               {data?.bookedEvents?.personalData?.favoriteColors?.map(
//                 (color: string, i: number) => (
//                   <View
//                     key={i}
//                     style={{
//                       width: 10,
//                       height: 10,
//                       backgroundColor: color,
//                       marginRight: 3,
//                     }}
//                   />
//                 )
//               )}
//             </View>
//           ),
//         },
//         {
//           label: translations.booking.dressColor,
//           value: (
//             <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
//               {data?.bookedEvents?.personalData?.dressColor?.map(
//                 (color: string, i: number) => (
//                   <View
//                     key={i}
//                     style={{
//                       width: 10,
//                       height: 10,
//                       backgroundColor: color,
//                       marginRight: 3,
//                     }}
//                   />
//                 )
//               )}
//             </View>
//           ),
//         },
//       ].map((row, i) => (
//         <View key={i} style={styles.tableRow}>
//           <Text
//             style={[
//               styles.tableCell,
//               { width: "40%", fontWeight: "bold" },
//             ]}
//           >
//             {row.label}
//           </Text>
//           <Text style={[styles.tableCell, { width: "60%" }]}>
//             {row.value}
//           </Text>
//         </View>
//       ))}
//     </View>
//   </View>

// {/* Second table - Event details */}
// <View style={styles.tableContainer}>
//   <View style={styles.table}>
//     {[
//       {
//         label: translations.event_design,
//         value:
//           renderValue(
//             data?.bookedEvents?.eventDesign?.eventDesign,
//             data?.bookedEvents?.eventDesign?.translatedEventDesign
//           ) || "N/A",
//       },
//       {
//         label: translations.package_price,
//         value: (
//           <View
//             style={{ flexDirection: "row", alignItems: "center" }}
//           >
//             <Text>
//               {data?.bookedEvents?.eventPackage?.packagePrice || "0"}
//             </Text>
//             <PDFImage
//               src="/images/SR.png"
//               style={styles.currencySymbol}
//             />
//           </View>
//         ),
//       },
//       {
//         label: translations.package_name,
//         value:
//           renderValue(
//             data?.bookedEvents?.priceDetails?.eventPackage?.name,
//             data?.bookedEvents?.priceDetails?.eventPackage
//               ?.translatedPackageName
//           ) || "N/A",
//       },
//       {
//         label: translations.additions || "Additions",
//         value: (
//           <View>
//             {data?.bookedEvents?.eventPackage?.additions?.length >
//             0 ? (
//               data.bookedEvents.eventPackage.additions.map(
//                 (addition: any, idx: number) => (
//                   <Text key={idx} style={{ fontSize: 8 }}>
//                     •{" "}
//                     {renderValue(
//                       addition.typeOfAddition,
//                       addition.translatedTypeOfAddition
//                     )}{" "}
//                     (Qty: {addition.quantity})
//                   </Text>
//                 )
//               )
//             ) : (
//               <Text>N/A</Text>
//             )}
//           </View>
//         ),
//       },
//       {
//         label: translations.notes || "Notes",
//         value: data?.bookedEvents?.personalData?.notes || "N/A",
//       },
//     ].map((row, i) => (
//       <View key={i} style={styles.tableRow}>
//         <Text
//           style={[
//             styles.tableCell,
//             { width: "40%", fontWeight: "bold" },
//           ]}
//         >
//           {row.label}
//         </Text>
//         <View style={[styles.tableCell, { width: "60%" }]}>
//           {row.value}
//         </View>
//       </View>
//     ))}
//   </View>
// </View>
//         </View>

//         {/* Offer validity */}
//         <Text style={{ fontSize: 12, marginBottom: 10 }}>
//           {translations.offer_validity}
//         </Text>

// {/* Package additions and extra services */}
// <View style={styles.gridContainer}>
//   {/* Package additions */}
//   <View style={styles.tableContainer}>
//     <Text style={{ fontSize: 12, fontWeight: "bold", marginBottom: 5 }}>
//       {translations.event_package_additions}
//     </Text>
//     <View style={styles.table}>
//       <View style={[styles.tableRow, { backgroundColor: "#C3937A" }]}>
//         <Text
//           style={[styles.tableCell, { color: "white", width: "30%" }]}
//         >
//           {translations.addition_name}
//         </Text>
//         <Text
//           style={[styles.tableCell, { color: "white", width: "20%" }]}
//         >
//           {translations.type}
//         </Text>
//         <Text
//           style={[styles.tableCell, { color: "white", width: "15%" }]}
//         >
//           {translations.unit_price}
//         </Text>
//         <Text
//           style={[styles.tableCell, { color: "white", width: "15%" }]}
//         >
//           {translations.quantity}
//         </Text>
//         <Text
//           style={[styles.tableCell, { color: "white", width: "20%" }]}
//         >
//           {translations.total_price}
//         </Text>
//       </View>
//       {data?.bookedEvents?.priceDetails?.additions?.length > 0 ? (
//         data.bookedEvents.priceDetails.additions.map(
//           (item: any, index: number) => (
//             <View key={index} style={styles.tableRow}>
//               <Text style={[styles.tableCell, { width: "30%" }]}>
//                 {renderValue(item.name, item.translatedAdditionName)}
//               </Text>
//               <Text style={[styles.tableCell, { width: "20%" }]}>
//                 {renderValue(item.type, item.translatedTypeName)}
//               </Text>
//               <View
//                 style={[
//                   styles.tableCell,
//                   {
//                     width: "15%",
//                     flexDirection: "row",
//                     alignItems: "center",
//                   },
//                 ]}
//               >
//                 <Text>{item.unitPrice}</Text>
//                 <PDFImage
//                   src="/images/SR.png"
//                   style={styles.currencySymbol}
//                 />
//               </View>
//               <Text style={[styles.tableCell, { width: "15%" }]}>
//                 {item.quantity}
//               </Text>
//               <View
//                 style={[
//                   styles.tableCell,
//                   {
//                     width: "20%",
//                     flexDirection: "row",
//                     alignItems: "center",
//                   },
//                 ]}
//               >
//                 <Text>{item.totalPrice}</Text>
//                 <PDFImage
//                   src="/images/SR.png"
//                   style={styles.currencySymbol}
//                 />
//               </View>
//             </View>
//           )
//         )
//       ) : (
//         <View style={styles.tableRow}>
//           <Text
//             style={[
//               styles.tableCell,
//               { width: "100%", textAlign: "center" },
//             ]}
//           >
//             {translations.no_event_package_additions}
//           </Text>
//         </View>
//       )}
//     </View>
//   </View>

//   {/* Extra services */}
//   <View style={styles.tableContainer}>
//     <Text style={{ fontSize: 12, fontWeight: "bold", marginBottom: 5 }}>
//       {translations.extra_services}
//     </Text>
//     <View style={styles.table}>
//       <View style={[styles.tableRow, { backgroundColor: "#C3937A" }]}>
//         <Text
//           style={[styles.tableCell, { color: "white", width: "40%" }]}
//         >
//           {translations.package_name}
//         </Text>
//         <Text
//           style={[styles.tableCell, { color: "white", width: "20%" }]}
//         >
//           {translations.package_price}
//         </Text>
//         <Text
//           style={[styles.tableCell, { color: "white", width: "20%" }]}
//         >
//           {translations.provider_name}
//         </Text>
//         <Text
//           style={[styles.tableCell, { color: "white", width: "20%" }]}
//         >
//           {translations.serviceName}
//         </Text>
//       </View>
//       {data?.bookedEvents?.priceDetails?.extraServices?.length > 0 ? (
//         data.bookedEvents.priceDetails.extraServices.map(
//           (service: any, index: number) => (
//             <View key={index} style={styles.tableRow}>
//               <Text style={[styles.tableCell, { width: "40%" }]}>
//                 {renderValue(
//                   service.package,
//                   service.translatedPackage
//                 )}
//               </Text>
//               <View
//                 style={[
//                   styles.tableCell,
//                   {
//                     width: "20%",
//                     flexDirection: "row",
//                     alignItems: "center",
//                   },
//                 ]}
//               >
//                 <Text>{service.price}</Text>
//                 <PDFImage
//                   src="/images/SR.png"
//                   style={styles.currencySymbol}
//                 />
//               </View>
//               <Text style={[styles.tableCell, { width: "20%" }]}>
//                 {service.provider}
//               </Text>
//               <Text style={[styles.tableCell, { width: "20%" }]}>
//                 {renderValue(
//                   service?.serviceName,
//                   service?.translatedServiceName
//                 )}
//               </Text>
//             </View>
//           )
//         )
//       ) : (
//         <View style={styles.tableRow}>
//           <Text
//             style={[
//               styles.tableCell,
//               { width: "100%", textAlign: "center" },
//             ]}
//           >
//             {translations.no_extra_services}
//           </Text>
//         </View>
//       )}
//     </View>
//   </View>
// </View>

// {/* Price summary */}
// <View style={[styles.priceTable, { marginTop: 15 }]}>
//   <View style={styles.table}>
//     <View style={styles.priceRow}>
//       <Text>{translations.total_price_before_vat}</Text>
//       <View style={{ flexDirection: "row", alignItems: "center" }}>
//         <Text>{data?.bookedEvents?.priceBeforeVat}</Text>
//         <PDFImage src="/images/SR.png" style={styles.currencySymbol} />
//       </View>
//     </View>
//     <View style={styles.priceRow}>
//       <Text>{translations.vat_15}</Text>
//       <View style={{ flexDirection: "row", alignItems: "center" }}>
//         <Text>{data?.bookedEvents?.vatAmount}</Text>
//         <PDFImage src="/images/SR.png" style={styles.currencySymbol} />
//       </View>
//     </View>
//     <View style={[styles.priceRow, { borderBottomWidth: 0 }]}>
//       <Text>{translations.total_price_after_vat}</Text>
//       <View style={{ flexDirection: "row", alignItems: "center" }}>
//         <Text>{data?.bookedEvents?.priceAfterVat}</Text>
//         <PDFImage src="/images/SR.png" style={styles.currencySymbol} />
//       </View>
//     </View>
//   </View>
// </View>

// {/* Terms and conditions */}
// <Text style={styles.termsTitle}>{translations.terms.title}</Text>
// <View style={styles.termsList}>
//   {Array.isArray(translations.terms.items) &&
//     translations.terms.items.map((item: string, index: number) => (
//       <Text key={index} style={{ marginBottom: 5 }}>
//         • {item}
//       </Text>
//     ))}
// </View>

// {/* Signatures */}
// <View style={styles.signatureRow}>
//   <View>
//     <Text style={{ fontSize: 10 }}>
//       {translations.client_signature}
//     </Text>
//     <View style={styles.signatureLine} />
//   </View>
//   <View>
//     <Text style={{ fontSize: 10 }}>{translations.fenzo_events}</Text>
//     <View style={styles.signatureLine} />
//   </View>
// </View>
//       </Page>
//     </Document>
//   );
// };

// export default QuotationPDF;
