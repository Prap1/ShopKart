import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const VerificationPage = () => {
  const { token } = useParams();
  const [verificationStatus, setVerificationStatus] = useState("Verifying...");

  useEffect(() => {
    // You can make an API call here to verify the token on the server-side
    // and update the verification status accordingly

    // Example API call using fetch
    fetch(`/api/v1/auth/verify/${token}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setVerificationStatus("Verification successful!");
        } else {
          setVerificationStatus("Verification failed.");
        }
      })
      .catch((error) => {
        console.log(error);
        setVerificationStatus("Error occurred during verification.");
      });
  }, [token]);

  return (
    <div>
      <h1>Email Verification</h1>
      <p>{verificationStatus}</p>
    </div>
  );
};

export default VerificationPage;
