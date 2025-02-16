import React from "react";

// Define a type for the data rows
interface RowData {
  id: number;
  name: string;
  email: string;
  age: number;
  city: string;
  profession: string;
}

const BulkTable2 = () => {
  // Declare bulk data directly inside the component
  const data: RowData[] = Array.from({ length: 5 }, (_, index) => ({
    id: index + 1,
    name: `User ${index + 1}`,
    email: `user${index + 1}@example.com`,
    age: Math.floor(Math.random() * 50) + 18, // Random age between 18 and 67
    city: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"][
      Math.floor(Math.random() * 5)
    ], // Random city
    profession: ["Engineer", "Doctor", "Teacher", "Artist", "Scientist"][
      Math.floor(Math.random() * 5)
    ], // Random profession
  }));

  // Define headers directly inside the component
  const headers = ["ID", "Name", "Email", "Age", "City", "Profession"];

  return (
    <div className="overflow-x-auto">
      {/* Table Container */}
      <table className="min-w-full border-collapse border-2 border-[#EFE7DF] text-primary bg-[#F3EFE7] text-left text-sm font-light">
        {/* Table Head */}
        <thead className="bg-[#C3937A]  ">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="border-b-2 border-r text-white border-[#EFE7DF] px-4 py-5 font-medium md:px-6 md:py-"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        {/* Table Body */}
        <tbody>
          {data.map((row: RowData, rowIndex: number) => (
            <tr key={rowIndex} className="border-b-2 border-[#EFE7DF]">
              {headers.map((header, colIndex: number) => (
                <td
                  key={colIndex}
                  className={`border-r whitespace-nowrap px-4 py-2 font-medium text-primary ${
                    header === "Email" ? "break-all" : ""
                  } md:px-6 md:py-4`}
                >
                  {row[header.toLowerCase() as keyof RowData]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BulkTable2;
