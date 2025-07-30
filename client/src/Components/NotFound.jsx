// src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";
import { Helmet } from "react-helmet-async";

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>404 Error | SKD PropWorld Private Limited</title>
        <meta
          name="description"
          content="The page you're looking for isn't available. SKD Propworld helps you explore top real estate projects in Noida, Greater Noida, YEIDA, and NCR."
        />
        <meta name="robots" content="noindex, follow" />
        {/* <link rel="canonical" href="https://skdpropworld.com/404" /> */}

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="404 Page Not Found | SKD Propworld"
        />
        <meta
          property="og:description"
          content="We couldn't find the page you're looking for. Head back home to explore verified properties in NCR with SKD Propworld."
        />
        <meta property="og:url" content="https://skdpropworld.com/404" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:title"
          content="404 | Page Not Found – SKD Propworld"
        />
        <meta
          name="twitter:description"
          content="Oops! Something went wrong. Return to SKD Propworld homepage to browse property listings."
        />
      </Helmet>

      <div className="text-center py-5 bg-light text-secondary notproj">
        <div className="spinner-container">
          <div className="custom-spinner"></div>
        </div>
        <div>
          <h1>
            <b>404</b>
          </h1>
          <h4>If it takes too long, kindly check the URL</h4> <br />
          <p>
            आप जिस पेज़ को देखना चाहते है वो उपलब्ध नहीं है, होम पेज पर वापस
            जाइए!
          </p>
          <p>
            Requested page is not available, go back to the SKD PropWorld's home
            page!
          </p>
          <br />
          <Link to="/">
            <button className="btn btn-info">Go Home </button>
          </Link>
        </div>
        {/* Oops! It seems like something went wrong — we're on it. <br /> */}
        <br /> <br />
        <div>
          <p className="small text-muted mb-0">
            &copy; SKD PropWorld Private Limited
          </p>
        </div>
      </div>
    </>
  );
};

export default NotFound;
