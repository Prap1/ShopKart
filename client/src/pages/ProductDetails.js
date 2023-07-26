import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ProductDetailsStyles.css";

const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewCount, setReviewCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (params?.slug) {
      getProduct();
      getProductRating();
      getComments();
    }
  }, [params?.slug]);

  const getProduct = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data } = await axios.get(`/api/v1/product/get-product/${params.slug}`);
      setProduct(data?.product);
      getSimilarProduct(data?.product._id, data?.product.category._id);
    } catch (error) {
      console.log(error);
      setError("Error fetching product");
    } finally {
      setIsLoading(false);
    }
  };

  const getSimilarProduct = async (pid, cid) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data } = await axios.get(
        `/api/v1/product/related-product/${pid}/${cid}`
      );
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
      setError("Error fetching related products");
    } finally {
      setIsLoading(false);
    }
  };

  const getProductRating = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data } = await axios.get(
        `/api/v1/product/product/${params.slug}/rating`
      );
      setRating(data?.rating || 0);
      setComment(data?.comment || "");
      setReviewCount(data?.numReviews || 0);
    } catch (error) {
      console.log(error);
      setError("Error fetching product rating");
    } finally {
      setIsLoading(false);
    }
  };

  const getComments = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data } = await axios.get(
        `/api/v1/product/product/${params.slug}/rating`
      );

      setComments(data?.success ? data.comments : []);
    } catch (error) {
      console.log(error);
      setError("Error fetching comments");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRatingChange = (event) => {
    setRating(event.target.value);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const submitRating = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.post(
        `/api/v1/product/product/${params.slug}/rating`,
        {
          rating,
          comment,
        }
      );

      if (response.data.success) {
        getProductRating(); // Update review count, rating, and comments after submitting rating
        console.log("Rating and comment submitted successfully");
      }
    } catch (error) {
      console.log("Error in submitting rating and comment:", error);
      setError("Error submitting rating and comment");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Layout>
      <div className="row container product-details">
        <div className="col-md-6">
          <img
            src={`/api/v1/product/product-photo/${product._id}`}
            className="card-img-top"
            alt={product.name}
            height="300"
            width={"350px"}
          />
        </div>
        <div className="col-md-6 product-details-info">
          <h1 className="text-center">Product Details</h1>
          <hr />
          <h6>Name: {product.name}</h6>
          <h6>Description: {product.description}</h6>
          <h6>
            Price:{" "}
            {product?.price?.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </h6>
          <h6>Category: {product?.category?.name}</h6>
          <div className="rating-section">
            <h6>Rating: {rating}</h6>
            <p>Number of Reviews: {reviewCount}</p>
            <input
              type="number"
              value={rating}
              onChange={handleRatingChange}
              placeholder="Rating"
              min={0}
              max={5}
            />
          </div>
          <div className="comment-section">
            <h6>Comment:</h6>
            <textarea
              value={comment}
              onChange={handleCommentChange}
              placeholder="Comment"
            />
          </div>
          <button onClick={submitRating}>Submit Rating and Comment</button>
          <button className="btn btn-secondary ms-1">ADD TO CART</button>
        </div>
      </div>
      <hr />
      <div className="row container product-comments">
        <h4>Comments</h4>
        {comments.length < 1 && <p>No comments available</p>}
        {comments.map((comment) => (
          <div key={comment._id} className="comment">
            <p>{comment}</p>
          </div>
        ))}
      </div>
      <div className="row container similar-products">
        <h4>Similar Products ➡️</h4>
        {relatedProducts.length < 1 && (
          <p className="text-center">No Similar Products found</p>
        )}
        <div className="d-flex flex-wrap">
          {relatedProducts?.map((p) => (
            <div className="card m-2" key={p._id}>
              <img
                src={`/api/v1/product/product-photo/${p._id}`}
                className="card-img-top"
                alt={p.name}
              />
              <div className="card-body">
                <div className="card-name-price">
                  <h5 className="card-title">{p.name}</h5>
                  <h5 className="card-title card-price">
                    {p.price.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </h5>
                </div>
                <p className="card-text ">
                  {p.description.substring(0, 60)}...
                </p>
                <div className="card-name-price">
                  <button
                    className="btn btn-info ms-1"
                    onClick={() => navigate(`/product/${p.slug}`)}
                  >
                    More Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <hr />
    </Layout>
  );
};

export default ProductDetails;
