import React from "react";

function PrivacyPolicy() {
  return (
    <div>
      <div className=" p-4 ">
        <h2 className="text-center text-primary text-xl font-bold underline">
          PRIVACY POLICY
        </h2>
        <ul className="list-disc text-primary pl-6 mt-4">
          <li>
            We collect personal information to provide better services and
            improve user experience.
          </li>
          <li>
            Your data is kept secure and is not shared with third parties
            without consent, except as required by law.
          </li>
          <li>
            We may use cookies to enhance website functionality and user
            interaction.
          </li>
          <li>
            Users have the right to access, modify, or request deletion of their
            personal data.
          </li>
          <li>
            Third-party services used by our platform may have their own privacy
            policies that we do not control.
          </li>
          <li>
            If you have any concerns about your data, you can contact us for
            more details.
          </li>
          <li>
            Continued use of our services indicates acceptance of this Privacy
            Policy.
          </li>
        </ul>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
