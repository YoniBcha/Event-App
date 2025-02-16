import React from "react";

interface TableRow {
  id: number;
  name: string;
  email: string;
  age: number;
  city: string;
  profession: string;
}

const BulkTable: React.FC = () => {
  // Declare bulk data directly inside the component
  const data: TableRow[] = Array.from({ length: 5 }, (_, index) => ({
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

  // Define headers as tuples for better type safety
  const headers: { key: keyof TableRow; label: string }[] = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "age", label: "Age" },
    { key: "city", label: "City" },
    { key: "profession", label: "Profession" },
  ];

  return (
    <div className="overflow-x-auto">
      {/* Table Container */}
      <table className="min-w-full border-collapse border-2 border-[#EFE7DF] text-primary bg-[#F3EFE7] text-left text-sm font-light">
        {/* Table Head */}
        <thead className="bg-[#F3EFE7]">
          <tr>
            {headers.map(({ label }, index) => (
              <th
                key={index}
                className="border-b-2 border-r border-[#EFE7DF] px-4 py-3 font-medium md:px-6 md:py-4"
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        {/* Table Body */}
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-[#EFE7DF]">
              {headers.map(({ key }, colIndex) => (
                <td
                  key={colIndex}
                  className={`border-r border-[#EFE7DF] whitespace-nowrap px-4 py-2 font-medium text-primary ${
                    key === "email" ? "break-all" : ""
                  } md:px-6 md:py-4`}
                >
                  {row[key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BulkTable;
