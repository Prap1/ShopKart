import { useState, useEffect } from "react";
import axios from "axios";

export default function useBrand() {
  const [brands, setBrands] = useState([]);

  //get cat
  const getBrands = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      setBrands(data?.category);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBrands();
  }, []);

  return brands;
}