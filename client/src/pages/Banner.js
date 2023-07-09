import React, { useState, useEffect } from 'react';

const Banner = () => {
  const bannerImages = [
    '/images/banner1.png',
    '/images/banner2.png',
    
  ];

  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const nextIndex = (currentBannerIndex + 1) % bannerImages.length;
      setCurrentBannerIndex(nextIndex);
    }, 5000); // Change to the desired time in milliseconds

    return () => clearTimeout(timeout);
  }, [currentBannerIndex]);

  const currentBannerSrc = bannerImages[currentBannerIndex];

  return (
    <img
      src={currentBannerSrc}
      className="banner-img"
      alt="bannerimage"
      width="100%"
      height="400px"
    />
  );
};

export default Banner;
