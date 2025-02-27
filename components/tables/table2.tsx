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
      <div className="overflow-x-auto">
        <h2 className="text-lg font-semibold mb-2">Event Package Additions</h2>
        <table className="min-w-full border-collapse border-2 border-[#EFE7DF] text-primary bg-[#F3EFE7] text-left text-sm font-light">
          <thead className="bg-[#C3937A] text-white">
            <tr>
              <th className="border-b-2 border-r border-[#EFE7DF] px-4 py-5 font-medium">
                Addition Name
              </th>
              <th className="border-b-2 border-r border-[#EFE7DF] px-4 py-5 font-medium">
                Type
              </th>
              <th className="border-b-2 border-r border-[#EFE7DF] px-4 py-5 font-medium">
                Quantity
              </th>
            </tr>
          </thead>
          <tbody>
            {eventPackageAdditions?.length > 0 ? (
              eventPackageAdditions?.map((item, index) => (
                <tr key={index} className="border-b-2 border-[#EFE7DF]">
                  <td className="border-r px-4 py-2 font-medium">
                    {item.additionId.additionName}
                  </td>
                  <td className="border-r px-4 py-2 font-medium">
                    {item.additionTypeName}
                  </td>
                  <td className="border-r px-4 py-2 font-medium">
                    {item.quantity}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-4">
                  No event package additions available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Second Table: Extra Services */}
      <div className="overflow-x-auto">
        <h2 className="text-lg font-semibold mb-2">Extra Services</h2>
        <table className="min-w-full border-collapse border-2 border-[#EFE7DF] text-primary bg-[#F3EFE7] text-left text-sm font-light">
          <thead className="bg-[#C3937A] text-white">
            <tr>
              <th className="border-b-2 border-r border-[#EFE7DF] px-4 py-5 font-medium">
                Package Name
              </th>
            </tr>
          </thead>
          <tbody>
            {extraServices?.length > 0 ? (
              extraServices?.map((service, index) => (
                <tr key={index} className="border-b-2 border-[#EFE7DF]">
                  <td className="border-r px-4 py-2 font-medium">
                    {service.packageName}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="text-center py-4">
                  No extra services available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BulkTable2;
