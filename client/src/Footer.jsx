import React from "react";
import Visitor_Count from "./Components/Visitor_Count";
import "./Footer.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

const Footer = () => {
  const ScrollToTopButton = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
      const toggleVisibility = () => {
        setVisible(window.scrollY > 300);
      };
      window.addEventListener("scroll", toggleVisibility);
      return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

    useEffect(() => {
      // Trustpilot script load karna zaruri hai
      const script = document.createElement("script");
      script.src =
        "https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js";
      script.async = true;
      document.body.appendChild(script);
    }, []);

    return visible ? (
      <button
        className="scroll-to-top"
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        ↑
      </button>
    ) : null;
  };
  const QUICK_LINKS = [
    ["Home", "/"],
    ["Projects", "/projects"],
    ["Blogs", "/all-blogs"],
    ["Project Maps", "/maps"],
    ["Career @ SKD", "/career@skd"],

    ["Services", "/services"],
  ];
  return (
    <>
      <Helmet>
        {/* <title>
          Contact Us | SKD Propworld – Real Estate Experts in India & Abroad
        </title> */}
        <meta
          name="description"
          content="Get in touch with SKD Propworld. Call us, email us, or visit us. Connect via Facebook, Instagram, LinkedIn, YouTube & X. Your global real estate partner."
        />

        {/* Open Graph (OG) Meta Tags */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          // content="Contact SKD Propworld | Connect on Social Media & Visit Us"
        />
        <meta
          property="og:description"
          content="Reach SKD Propworld at our Greater Noida HQ or connect via Facebook, LinkedIn, YouTube, Instagram & X. Let’s talk property!"
        />
        <meta property="og:url" content="https://skdpropworld.com/#footer" />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="SKD Propworld | Follow Us Online" />
        <meta
          name="twitter:description"
          content="Follow SKD Propworld on Instagram, Facebook, LinkedIn, X & YouTube for the latest in global real estate."
        />

        {/* SameAs for GMB and SEO → Google uses this to associate your brand with social profiles */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "SKD Propworld Private Limited",
            url: "https://skdpropworld.com",
            // logo: "https://skdpropworld/logo.png", // Optional
            sameAs: [
              "https://www.facebook.com/skdprp/",
              "https://www.instagram.com/official.skdpropworld/",
              "https://x.com/skd_propworld",
              "https://in.linkedin.com/company/skd-propworld",
              "https://www.youtube.com/@skdpropworld2011",
            ],
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+91-9091010909",
              contactType: "customer service",
              areaServed: "IN",
              availableLanguage: "English",
            },
          })}
        </script>
      </Helmet>

      <footer className="bg-dark text-light pt-5 pb-4">
        <div className="container">
          <div className="row text-md-start text-center">
            {/* Brand */}
            <div className="col-md-4 mb-4">
              <h4 className="text-warning fw-bold">
                SKD PROPWORLD PRIVATE LIMITED
              </h4>
              <p className="text-light">
               SKD PropWorld Pvt. Ltd. is a trusted real estate consultancy specializing 
               exclusively in residential plots under YEIDA (Yamuna Expressway Industrial 
               Development Authority).With over a decade of experience, we are committed to 
               helping clients make informed investment decisions in the most promising sectors 
               of YEIDA. Our team offers expert guidance, transparent dealings, and end-to-end
                support — ensuring a seamless property-buying experience.
                Since 2011, SKD PropWorld has built its reputation on trust, integrity, and customer 
                satisfaction, making us a reliable name for genuine residential plots along the 
                Yamuna Expressway
              </p>
              <p className="text-light">
                With over a decade of experience and a growing international
                presence, SKD PropWorld is your reliable property consultant for
                real estate solutions in key Indian cities and abroad. We are
                committed to delivering transparency, trust, and tailored real
                estate services to meet every client’s unique needs serving
                since 2011. <br /> <br />
                <div
                  className="trustpilot-widget ps-0"
                  data-locale="en-US"
                  data-template-id="56278e9abfbbba0bdcd568bc"
                  data-businessunit-id="68a9acb36ad677c356e7e972"
                  data-style-height="52px"
                  data-style-width="100%"
                  data-token="d6d286ba-6e93-4ebb-aa8d-d97b5f87f330"
                >
                  <a
                    href="https://www.trustpilot.com/review/skdpropworld.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Trustpilot
                  </a>
                </div>
              </p>
            </div>

            <div className="col-md-2 mb-4">
              <h5 className="text-uppercase">Quick Links</h5>
              <ul className="list-unstyled">
                {QUICK_LINKS.map(([label, path]) => (
                  <li key={path}>
                    <Link
                      to={path}
                      className="text-light text-decoration-none d-block py-1 footer-link"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-md-3 mb-4">
              <h5 className="text-uppercase">Contact</h5>
              <p className="mb-2">
                <i className="bi bi-envelope-fill text-warning me-2" />
                <a
                  href="mailto:info@skdpropworld.com"
                  className="text-light text-decoration-none footer-link"
                >
                  info@skdpropworld.com
                </a>
              </p>
              <p className="mb-2">
                <i className="bi bi-telephone-fill text-warning me-2" />
                <a
                  href="tel:+919876543210"
                  className="text-light text-decoration-none footer-link"
                >
                  +91 90910 10909
                </a>
              </p>
              <p>
                <i className="bi bi-geo-alt-fill text-warning me-2" />
                7th & 8th Floor,Kaisons, Alpha Square, Alpha 1 Commercial Belt,
                Greater Noida, Uttar Pradesh, 201308, India
              </p>
              <a
                href="https://g.co/kgs/3ErcQyb"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-warning btn-sm mt-2 fw-semibold"
              >
                <i className="bi bi-geo-alt me-1" />
                View On Google Map
              </a>
              <br />
            </div>

            <div className="col-md-3 mb-4">
              <h5 className="text-uppercase">Follow Us</h5>
              <div className="d-flex justify-content-center justify-content-md-start gap-3 fs-5 mb-3">
                <a
                  href="https://www.facebook.com/skdprp/"
                  className="footer-icon"
                  aria-label="Facebook"
                >
                  <i className="bi bi-facebook" />
                </a>
                <a
                  href="https://www.instagram.com/official.skdpropworld/"
                  className="footer-icon"
                  aria-label="Instagram"
                >
                  <i className="bi bi-instagram" />
                </a>
                <a
                  href="https://x.com/skd_propworld"
                  className="footer-icon"
                  aria-label="Twitter"
                >
                  <i className="bi bi-twitter" />
                </a>
                <a
                  href="https://in.linkedin.com/company/skd-propworld"
                  className="footer-icon"
                  aria-label="LinkedIn"
                >
                  <i className="bi bi-linkedin" />
                </a>
                <a
                  href="https://www.youtube.com/@skdpropworld2011"
                  className="footer-icon"
                  aria-label="YouTube"
                >
                  <i className="bi bi-youtube" />
                </a>
              </div>

              <div className="fs-4 fw-bold text-warning">
                <Visitor_Count />
              </div>
            </div>
          </div>

          <div className="text-center pt-3 mt-4 border-top border-secondary small footer-copy">
            <p title="Designed & Developed by Shriyam Parashar">
              &copy; {new Date().getFullYear()} SKD Propworld Private Limited.
              All rights reserved. <br />
              <span className="">| Powered by v.1.5 |</span>
            </p>
          </div>
        </div>
        <ScrollToTopButton />
      </footer>
    </>
  );
};

export default Footer;
