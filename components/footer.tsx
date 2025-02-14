import React from "react";

function Footer() {
  return (
    <div className="w-full py-2 md:py-7 bg-transparent px-10 flex flex-row justify-between items-center text-sm text-primary mt-auto">
      <div className="flex flex-row gap-4 items-center">
        <div>&copy; 2025 FENZO</div>
      </div>

      <div className="flex flex-col md:flex-row gap-1 md:gap-4">
        <div>Terms & Conditions</div>
        <div>Privacy Policy</div>
      </div>
    </div>
  );
}

export default Footer;
