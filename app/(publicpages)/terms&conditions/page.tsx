/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { useSelector } from "react-redux";

function TermsConditions() {
  const translations = useSelector((state: any) => state.language.translations);

  return (
    <div>
      <div className="p-4">
        <h2 className="text-center text-primary text-xl font-bold underline">
          {translations.terms.title}
        </h2>
        <ul className="list-disc text-primary pl-6 mt-4">
          {Array.isArray(translations.terms.items) &&
            translations.terms.items.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
        </ul>
      </div>
    </div>
  );
}

export default TermsConditions;
