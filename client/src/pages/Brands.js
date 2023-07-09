import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import useBrand from "../hooks/useBrand";
const Brands = () => {
  const brands = useBrand();
  return (
    <Layout title={"All Brands"}>
      <div className="container" style={{ marginTop: "100px" }}>
        <div className="row container">
          {brands.map((c) => (
            <div className="col-md-4 mt-5 mb-3 gx-3 gy-3" key={c._id}>
              <div className="card">
                <Link to={`/brand/${c.slug}`} className="btn cat-btn">
                  {c.name}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Brands;