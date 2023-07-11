import React from "react";
import Layout from "./../components/Layout/Layout";

const Policy = () => {
  return (
    <Layout title={"Privacy Policy"}>
      <div className="row contactus ">
        <div className="col-md-6 ">
          <img
            src="/images/privacy.jpg"
            alt="contactus"
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-md-4">
          <p className="policy">
          We value your privacy. We collect and use your personal information to process orders and provide a personalized experience. We may share information with trusted partners, protect rights, and comply with the law. We take reasonable measures to secure data. For more details, please review our Privacy Policy.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Policy;
