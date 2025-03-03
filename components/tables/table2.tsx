/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* First Table: Event Package Additions */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Event Package Additions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border-2 border-[#EFE7DF] text-primary bg-[#F3EFE7] text-left text-sm font-light">
            <thead className="bg-[#C3937A] text-white">
              <tr>
                <th className="border-b-2 border-r border-[#EFE7DF] px-4 py-5 font-medium">
                  Id
                </th>
                <th className="border-b-2 border-r border-[#EFE7DF] px-4 py-5 font-medium">
                  Addition Name
                </th>
                <th className="border-b-2 border-r border-[#EFE7DF] px-4 py-5 font-medium">
                  Type
                </th>
                <th className="border-b-2 border-r border-[#EFE7DF] px-4 py-5 font-medium">
                  Unit Price
                </th>
                <th className="border-b-2 border-r border-[#EFE7DF] px-4 py-5 font-medium">
                  Quantity
                </th>
                <th className="border-b-2 border-r border-[#EFE7DF] px-4 py-5 font-medium">
                  Total Price
                </th>
              </tr>
            </thead>
            <tbody>
              {eventPackageAdditions?.length > 0 ? (
                eventPackageAdditions?.map((item: any, index) => (
                  <tr key={index} className="border-b-2 border-[#EFE7DF]">
                    <td className="border-r px-4 py-2 font-medium">
                      {item._id}
                    </td>
                    <td className="border-r px-4 py-2 font-medium">
                      {item.name}
                    </td>
                    <td className="border-r px-4 py-2 font-medium">
                      {item.type}
                    </td>
                    <td className="border-r px-4 py-2 font-medium">
                      {item.unitPrice}
                    </td>
                    <td className="border-r px-4 py-2 font-medium">
                      {item.quantity}
                    </td>
                    <td className="border-r px-4 py-2 font-medium">
                      {item.totalPrice}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    No event package additions available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Second Table: Extra Services */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Extra Services</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border-2 border-[#EFE7DF] text-primary bg-[#F3EFE7] text-left text-sm font-light">
            <thead className="bg-[#C3937A] text-white">
              <tr>
                <th className="border-b-2 border-r border-[#EFE7DF] px-4 py-5 font-medium">
                  Package id
                </th>
                <th className="border-b-2 border-r border-[#EFE7DF] px-4 py-5 font-medium">
                  Package Name
                </th>
                <th className="border-b-2 border-r border-[#EFE7DF] px-4 py-5 font-medium">
                  Package Price
                </th>
                <th className="border-b-2 border-r border-[#EFE7DF] px-4 py-5 font-medium">
                  Provider Name
                </th>
              </tr>
            </thead>
            <tbody>
              {extraServices?.length > 0 ? (
                extraServices?.map((service: any, index) => (
                  <tr key={index} className="border-b-2 border-[#EFE7DF]">
                    <td className="border-r px-4 py-2 font-medium">
                      {service._id}
                    </td>
                    <td className="border-r px-4 py-2 font-medium">
                      {service.package}
                    </td>
                    <td className="border-r px-4 py-2 font-medium">
                      {service.price}
                    </td>
                    <td className="border-r px-4 py-2 font-medium">
                      {service.provider}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-4">
                    No extra services available
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
