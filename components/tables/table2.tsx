/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import React from "react";
import { useSelector } from "react-redux";

// Define types for event package additions
interface EventPackageAddition {
  additionId: {
    _id: string;
    additionName: string;
  };
  additionTypeName: string;
  quantity: number;
  _id: string;
}

// Define types for extra services
interface ExtraService {
  servicesProvider_id: {
    _id: string;
  };
  packageName: string;
  _id: string;
}

// Define props for BulkTable2
interface BulkTable2Props {
  eventPackageAdditions: EventPackageAddition[];
  extraServices: ExtraService[];
}

const BulkTable2: React.FC<BulkTable2Props> = ({
  eventPackageAdditions,
  extraServices,
}) => {
  const currentLocale = useSelector(
    (state: any) => state.language.currentLocale
  );
  const translations = useSelector((state: any) => state.language.translations);
  const renderValue = (
    defaultValue: string,
    translatedValue: string | undefined
  ) => {
    return currentLocale === "ar" && translatedValue
      ? translatedValue
      : defaultValue;
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* First Table: Event Package Additions */}
      <div>
        <h2 className="text-lg font-semibold mb-2">
          {translations.event_package_additions}
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border-2 border-[#EFE7DF] text-primary bg-[#F3EFE7] text-left text-sm font-light">
            <thead className="bg-[#C3937A] text-white">
              <tr>
                {/* <th className="border-b-2 border-r border-[#EFE7DF] px-4 py-5 font-medium">
                  Id
                </th> */}
                <th className="border-b-2 border-r border-[#EFE7DF] px-4 py-5 font-medium">
                  {translations.addition_name}
                </th>
                <th className="border-b-2 border-r border-[#EFE7DF] px-4 py-5 font-medium">
                  {translations.type}
                </th>
                <th className="border-b-2 border-r border-[#EFE7DF] px-4 py-5 font-medium">
                  {translations.unit_price}
                </th>
                <th className="border-b-2 border-r border-[#EFE7DF] px-4 py-5 font-medium">
                  {translations.quantity}
                </th>
                <th className="border-b-2 border-r border-[#EFE7DF] px-4 py-5 font-medium">
                  {translations.total_price}
                </th>
              </tr>
            </thead>
            <tbody>
              {eventPackageAdditions?.length > 0 ? (
                eventPackageAdditions?.map((item: any, index) => (
                  <tr key={index} className="border-b-2 border-[#EFE7DF]">
                    {/* <td className="border-r px-4 py-2 font-medium">
                      {item._id}
                    </td> */}
                    <td className="border-r px-4 py-2 font-medium">
                      {renderValue(item.name, item.translatedAdditionName)}
                    </td>
                    <td className="border-r px-4 py-2 font-medium">
                      {renderValue(item.type, item.translatedTypeName)}
                    </td>
                    <td className="border-r px-4 flex flex-row items-center justify-center py-2 font-medium">
                      {item.unitPrice}{" "}
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
                    <td className="border-r px-4 py-2 font-medium">
                      {item.quantity}
                    </td>
                    <td className="border-r px-4 flex flex-row items-center justify-center py-2 font-medium">
                      {item.totalPrice}{" "}
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
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    {translations.no_event_package_additions}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Second Table: Extra Services */}
      <div>
        <h2 className="text-lg font-semibold mb-2">
          {translations.extra_services}
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border-2 border-[#EFE7DF] text-primary bg-[#F3EFE7] text-left text-sm font-light">
            <thead className="bg-[#C3937A] text-white">
              <tr>
                {/* <th className="border-b-2 border-r border-[#EFE7DF] px-4 py-5 font-medium">
                  Package id
                </th> */}
                <th className="border-b-2 border-r border-[#EFE7DF] px-4 py-5 font-medium">
                  {translations.package_name}
                </th>
                <th className="border-b-2 border-r border-[#EFE7DF] px-4 py-5 font-medium">
                  {translations.package_price}
                </th>
                <th className="border-b-2 border-r border-[#EFE7DF] px-4 py-5 font-medium">
                  {translations.provider_name}
                </th>
                <th className="border-b-2 border-r border-[#EFE7DF] px-4 py-5 font-medium">
                  {translations.serviceName}
                </th>
              </tr>
            </thead>
            <tbody>
              {extraServices?.length > 0 ? (
                extraServices?.map((service: any, index) => (
                  <tr key={index} className="border-b-2 border-[#EFE7DF]">
                    {/* <td className="border-r px-4 py-2 font-medium">
                      {service._id}
                    </td> */}
                    <td className="border-r px-4 py-2 font-medium">
                      {renderValue(
                        service.packageName,
                        service.translatedPackageName
                      )}
                      {}
                    </td>
                    <td className="border-r px-4 py-2 flex flex-row items-center justify-center font-medium">
                      {service.price}{" "}
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
                    <td className="border-r px-4 py-2 font-medium">
                      {service.servicesProvider_id.providerName}
                    </td>
                    <td className="border-r px-4 py-2 font-medium">
                      {renderValue(
                        service?.servicesProvider_id?.serviceId?.serviceName,
                        service?.servicesProvider_id?.serviceId
                          ?.translatedServiceName
                      )}
                      {}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-4">
                    {translations.no_extra_services}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BulkTable2;
