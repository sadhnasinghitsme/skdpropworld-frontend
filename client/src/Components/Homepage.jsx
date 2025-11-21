// Updated for deployment
import React, { useEffect, useRef, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  InputGroup,
  Nav,
} from "react-bootstrap";

import { Typewriter } from "react-simple-typewriter";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "./Navbar";
import SupportWidget from "./SupportWidget";
import AllProjects from "./AllProjects";
import ViewYouTubeSeries from "./ViewYouTubeSeries";
import OfficeBearers from "./OfficeBearers";


import PrimeWorkLocations from "../PrimeWorkLocations";
import Testimonials from "../Testimonials";
import LeadForm from "./LeadForm";
import Footer from "../Footer";
import axios from "axios";

import "./Homepage.css";
import Stats from "./Stats";
import NewsScroller from "./NewsScroller";
import YeidaNews from "./YeidaNews";

const Homepage = () => {
  const counterRef = useRef(null);
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("residential");
  const [loan, setLoan] = useState("");
  const [rate, setRate] = useState("");
  const [topPicks, setTopPicks] = useState([]);

  const [tenure, setTenure] = useState("");
  const [emi, setEmi] = useState(null);
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const [selectedType, setSelectedType] = useState("");

  const [propertyTypes, setPropertyTypes] = useState([]);
  const [seasonalHtml, setSeasonalHtml] = useState("");
  const searchAreaRef = useRef(null);

  const [length, setLength] = useState("");
  const [breadth, setBreadth] = useState("");
  const [unit, setUnit] = useState("feet");
  const [ratePerSqFt, setRatePerSqFt] = useState("");
  const [areaResult, setAreaResult] = useState(null);
  const [showNewYearPopup, setShowNewYearPopup] = useState(false);
  const [expandedSector, setExpandedSector] = useState(null);
  const [selectedCity, setSelectedCity] = useState("");



  // New Year Popup - Show once after 3 seconds
  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem('newYearPopupSeen');
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setShowNewYearPopup(true);
        sessionStorage.setItem('newYearPopupSeen', 'true');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchAreaRef.current &&
        !searchAreaRef.current.contains(event.target)
      ) {
        setActiveTab("residential");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const calculateEMI = () => {
    const P = parseFloat(loan);
    const R = parseFloat(rate) / 12 / 100;
    const N = parseFloat(tenure) * 12;

    if (P && R && N) {
      const emiVal = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
      setEmi(emiVal.toFixed(2));
    } else {
      setEmi(null);
    }
  };

  const convertToSqFt = (value, fromUnit) => {
    switch (fromUnit) {
      case "meters":
        return value * 10.7639;
      case "yards":
        return value * 9;
      case "feet":
      default:
        return value;
    }
  };

  const handleAreaCalculation = () => {
    const L = parseFloat(length);
    const B = parseFloat(breadth);
    const rate = parseFloat(ratePerSqFt);

    if (!isNaN(L) && !isNaN(B)) {
      const areaInOriginalUnit = L * B;

      let areaInSqFt;
      switch (unit) {
        case "meters":
          areaInSqFt = areaInOriginalUnit * 10.7639;
          break;
        case "yards":
          areaInSqFt = areaInOriginalUnit * 9;
          break;
        default:
          areaInSqFt = areaInOriginalUnit; // already in sq.ft
      }

      const totalCost = !isNaN(rate) ? areaInSqFt * rate : null;

      setAreaResult({
        sqFt: areaInSqFt.toFixed(2),
        sqM: (areaInSqFt * 0.092903).toFixed(2),
        sqYd: (areaInSqFt / 9).toFixed(2),
        totalCost: totalCost?.toFixed(0),
      });
    } else {
      setAreaResult(null);
    }
  };

  useEffect(() => {
    const fetchPropertyTypes = async () => {
      try {
        const tabToCategory = {
          residential: "Residential",
          commercial: "Commercial",
          industrial: "Industrial",
        };

        const category = tabToCategory[activeTab] || "Residential";

        const res = await fetch(
          `${API_BASE}/api/admin/projects/property-types?propertyNature=${encodeURIComponent(
            category
          )}`
        );

        if (!res.ok) {
          throw new Error(`HTTP ${res.status} - ${res.statusText}`);
        }

        const data = await res.json();
        setPropertyTypes(data);
      } catch (err) {
        console.error("❌ Failed to load property types:", err);
        setPropertyTypes([]); // Optional fallback
      }
    };

    if (["residential", "commercial", "industrial"].includes(activeTab)) {
      fetchPropertyTypes();
    }
  }, [activeTab]);

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/snippet/seasonal-html`)
      .then((res) => {
        setSeasonalHtml(res.data.seasonalHtml);
      })
      .catch((err) => console.error("Seasonal HTML fetch error", err));
  }, []);

  useEffect(() => {
    const fetchTopPicks = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/admin/projects/top-picks`);

        setTopPicks(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch top picks:", err);
      }
    };

    if (activeTab === "top-picks") {
      fetchTopPicks();
    }
  }, [activeTab]);

  useEffect(() => {
    if (counterRef.current) {
      const script = document.createElement("script");
      script.src =
        "https://counter1.optistats.ovh/private/counter.js?c=zr2u9fxr1583l6ms69zpskqsajgtp168&down=async";
      script.async = true;
      counterRef.current.appendChild(script);
    }
  }, []);

  // Scroll event listener to show enquiry form
  useEffect(() => {
    let hasShown = false;
    let scrollTimeout;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      const enquiryForm = document.getElementById("enquiryForm");
      
      if (enquiryForm && !hasShown) {
        // Show popup at 50% scroll with a 2-second delay
        if (scrollPercent > 50) {
          clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(() => {
            enquiryForm.style.display = "block";
            hasShown = true;
          }, 2000); // 2 second delay
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  const keywords = [
  "YEIDA Approved Residential Plots",
  "Residential Land near Jewar Airport",
  "Affordable Plots in YEIDA Region",
  "Invest Smartly with YEIDA Plots",
  "Premium Properties along Yamuna Expressway",
  "Future-Ready Plots in YEIDA Sectors 18 & 20",
  "Residential Properties in YEIDA",
  "Plots with Great Connectivity to Noida & Delhi",
  "Jewar Airport Investment Opportunities",
  "YEIDA Plots for Home & Business",
  "Modern Infrastructure with YEIDA Projects",
  "Secure Your Future with YEIDA Property",
  "Dream Homes near Jewar Airport",
  "Luxury Living in YEIDA Smart City",
  "Everything you need, right here with SKD PropWorld",
  ];

  const goToProjects = (term) => {
    const params = new URLSearchParams();

    const tabToNature = {
      residential: "Residential",
      commercial: "Commercial",
      industrial: "Industrial",
    };

    if (term) params.set("search", term);
    if (selectedType) params.set("type", selectedType);

    // 👇 Add property nature if applicable
    if (tabToNature[activeTab]) {
      params.set("nature", tabToNature[activeTab]);
    }

    navigate(`/projects?${params.toString()}`);
  };

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>
          Home | SKD PropWorld | Top Property Dealer in  Greater Noida, YEIDA (Yamuna
          Authority), Greater Noida, Delhi
        </title>
        <meta
          name="title"
          content="Top Property Dealer in YEIDA, GreaterNoida, Delhi, NCR | Buy, Sell, Rent Real Estate Plots, House, Villa, Flat, Commercial, Studio Apartments"
        />
        <meta
          name="description"
          content="Looking for trusted property dealers in YEIDA, Greater Noida, Ghaziabad, Delhi, or Greater Noida? We offer best deals in flats, plots, commercial & residential properties."
        />
        <meta
          name="keywords"
          content="property dealer in Noida, YEIDA, Yamuna Expressway Industrial Development Area, Real Estate Agents, Real Estate Consultant, Real Estate, RealEstateAgent, Real Estate Agent Near me, real estate agent in noida, YEIDA Authority, real estate Delhi NCR, flats for sale Noida, Ghaziabad plots, Greater Noida commercial space, property agent Delhi, real estate broker NCR, land for sale Noida Extension, apartment near metro, 2BHK flat Noida, 3BHK apartment Ghaziabad, investment property Noida, buy rent sell Noida, property consultant Delhi NCR"
        />
        <link
          rel="icon"
          type="image/x-icon"
          href="https://www.skdpropworld.com/favicon.ico"
        />
        <meta name="msapplication-TileImage" content="/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          href="/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <meta name="apple-mobile-web-app-title" content="SKDPropWorld" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="robots" content="index, follow" />
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="language" content="English" />
        <meta name="author" content="SKD PropWorld Private Limited" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        <meta name="coverage" content="Worldwide" />
        <meta name="expires" content="never" />
        <meta name="revisit-after" content="7 days" />
        <meta name="googlebot" content="index, follow" />
        <meta name="theme-color" content="#ffffff" />
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://skdpropworld.com/" />
        <meta
          property="og:title"
          content="Top Property Dealer in YEIDA, Greater Noida, Noida, Delhi, New Delhi, Delhi NCR"
        />
        <meta
          property="og:description"
          content="Search residential, commercial and rental properties in YEIDA, Yamuna Expressway, Noida, Delhi, Ghaziabad. Verified listings. Expert consultants."
        />
        <meta
          property="og:image"
          content="https://www.skdpropworld.com/og-image.png"
        />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://x.com/skd_propworld" />
        <meta
          property="twitter:title"
          content="Top Property Dealer in YEIDA, Greater Noida, Noida, Delhi, NCR"
        />
        <meta
          property="twitter:description"
          content="Buy, sell, or rent properties in YEIDA, Noida, Greater Noida, Delhi NCR with top real estate consultants. Affordable pricing, verified listings, easy process."
        />
        <meta name="geo.region" content="IN-UP" />
        <meta
          name="geo.placename"
          content="YEIDA, Yamuna Expressway, Noida, Delhi, Ghaziabad, Greater Noida"
        />
        <meta name="geo.position" content="28.5355;77.3910" />
        <meta name="ICBM" content="28.5355, 77.3910" />
        {/* Contact Info */}
        <meta
          name="contact"
          content="email:info@skdpropworld.com, phone:+91-9091010909"
        />
        <meta
          name="address"
          content="7th & 8th Floor,Kaisons, Alpha Square, Alpha 1 Commercial Belt, Greater Noida, Uttar Pradesh, 201308, India"
        />
        {/* Schema.org */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@id": "https://skdpropworld.com/#realestateagent",

            "@type": "RealEstateAgent",
            name: "SKD PropWorld Private Limited",
            url: "https://skdpropworld.com/",
            logo: "https://www.skdpropworld.com/favicon.ico",
            image: "https://www.skdpropworld.com/og-image.png",
            description:
              "We help you buy, sell, and rent property in YEIDA (Yamuna Expressway Industrial Development Area), Delhi NCR, Noida, Ghaziabad, and Greater Noida.",
            address: {
              "@type": "PostalAddress",
              streetAddress:
                "7th & 8th Floor,Kaisons, Alpha Square, Alpha 1 Commercial Belt, Greater Noida, Uttar Pradesh, 201308, India",
              addressLocality: "Greater Noida",
              addressRegion: "UP",
              postalCode: "201308",
              addressCountry: "INDIA",
            },
            sameAs: [
              "https://www.facebook.com/skdprp",
              "http://instagram.com/official.skdpropworld/",
              "https://www.linkedin.com/company/skd-propworld",
              "https://x.com/skd_propworld",
              "https://www.youtube.com/channel/UCBqqQkxHtycbgChxmW_JwAA",
            ],
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+91-9091010909",
              contactType: "Customer Service",
              areaServed: "IN",
              availableLanguage: "en",
            },
          })}
        </script>
      </Helmet>
      {/* **************************************** */}
      {/* the text above is for SEO */}

      <div className="homepage-hero">
        <Navbar />
        
        {/* YEIDA Hero Section with Video Background */}
        <section className="hero"> 
          {/* Background Video */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="hero-video-bg"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: -1
            }}
          >
        <source src="https://www.skdpropworld.com/videos/hero-video.mp4" type="video/mp4" />    
        Your browser does not support the video tag.
          </video>
          
          {/* Dark Overlay */}
          <div className="hero-video-overlay" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1
          }}></div>
          
          {/* Hero Content */}
          <div className="hero-content" style={{ position: 'relative', zIndex: 2 }}>
            <h1>Explore Government-Approved YEIDA Residential Plots</h1> 
            <p>Find Residential Plots and investments near Noida International Airport.</p> 
            <a href="/projects" className="btn">View Project</a>
          </div>
        </section>

        <section id="yeida-projects">
  <h2>YEIDA Project Highlights</h2>
  <div className="yeida-project-list">

    <div className="yeida-project">
      <div 
        className="project-header"
        onClick={() => setExpandedSector(expandedSector === 'sector18' ? null : 'sector18')}
        style={{ cursor: 'pointer' }}
      >
        <h3>Sector 18 Residential Plots {expandedSector === 'sector18' ? '▼' : '▶'}</h3>
        <p>Plots available near Jewar Airport with clear titles and modern infrastructure.</p>
        <span className="click-hint">Click to {expandedSector === 'sector18' ? 'hide' : 'view'} details</span>
      </div>
      
      {/* Detailed Sector 18 Information - Shows only when clicked */}
      {expandedSector === 'sector18' && (
        <div className="sector-details">
          <h4>📍 About YEIDA Sector 18</h4>
          <p className="sector-description">
            YEIDA Sector 18 is one of the most sought-after residential zones in the Yamuna Expressway region. 
            Located strategically near the upcoming Noida International Airport (Jewar Airport), this sector offers 
            excellent connectivity and modern infrastructure.
          </p>
          
          <div className="sector-features">
            <div className="feature-item">
              <span className="feature-icon">🏗️</span>
              <strong>Plot Sizes:</strong> 60 to 300 sq.m
            </div>
            <div className="feature-item">
              <span className="feature-icon">💰</span>
              <strong>Price Range:</strong> ₹75 Lakh to ₹2.50 Cr
            </div>
            <div className="feature-item">
              <span className="feature-icon">✈️</span>
              <strong>Distance from Airport:</strong> 15 to 18km
            </div>
            <div className="feature-item">
              <span className="feature-icon">🛣️</span>
              <strong>Connectivity:</strong> Direct access to Yamuna Expressway
            </div>
            <div className="feature-item">
              <span className="feature-icon">⚡</span>
              <strong>Infrastructure:</strong> Power, Water, Sewage System
            </div>
            <div className="feature-item">
              <span className="feature-icon">🏫</span>
              <strong>Nearby:</strong> Schools, Hospitals, Shopping Centers
            </div>
          </div>
          
          <div className="sector-highlights">
            <h5>✨ Key Highlights:</h5>
            <ul>
              <li>YEIDA Approved & Registered Plots</li>
              <li>Clear Land Titles with No Legal Issues</li>
              <li>Wide Roads (60-100 m)</li>
              <li>Green Belt & Parks</li>
              <li>High ROI Potential (15-20% annually)</li>
            </ul>
          </div>
        </div>
      )}
    </div>

    {/* Sector 20 */}
    <div className="yeida-project">
      <div 
        className="project-header"
        onClick={() => setExpandedSector(expandedSector === 'sector20' ? null : 'sector20')}
        style={{ cursor: 'pointer' }}
      >
        <h3>Sector 20 Residential Plots {expandedSector === 'sector20' ? '▼' : '▶'}</h3>
        <p>Affordable residential plots approved by YEIDA — perfect for long-term investment.</p>
        <span className="click-hint">Click to {expandedSector === 'sector20' ? 'hide' : 'view'} details</span>
      </div>
      
      {expandedSector === 'sector20' && (
        <div className="sector-details">
          <h4>📍 About YEIDA Sector 20</h4>
          <p className="sector-description">
            YEIDA Sector 20 offers affordable residential plots with excellent investment potential. 
            This sector is ideal for first-time buyers and long-term investors looking for steady appreciation.
          </p>
          
          <div className="sector-features">
            <div className="feature-item">
              <span className="feature-icon">🏗️</span>
              <strong>Plot Sizes:</strong> 300 sq.m to 4000 sq.m
            </div>
            <div className="feature-item">
              <span className="feature-icon">💰</span>
              <strong>Price Range:</strong> ₹60,000 per sq.m. to ₹80,000 per sq.m.
            </div>
            <div className="feature-item">
              <span className="feature-icon">✈️</span>
              <strong>Distance from Airport:</strong> 12 to 15 km
            </div>
            <div className="feature-item">
              <span className="feature-icon">🛣️</span>
              <strong>Connectivity:</strong> Well-connected to Yamuna Expressway
            </div>
            <div className="feature-item">
              <span className="feature-icon">⚡</span>
              <strong>Infrastructure:</strong> Developing Infrastructure
            </div>
            <div className="feature-item">
              <span className="feature-icon">🏫</span>
              <strong>Nearby:</strong> Upcoming Schools & Markets,Filmcity
            </div>
          </div>
          
          <div className="sector-highlights">
            <h5>✨ Key Highlights:</h5>
            <ul>
              <li>Most Affordable YEIDA Sector</li>
              <li>High Growth Potential</li>
              <li>Ideal for Long-term Investment</li>
              <li>Peaceful Residential Environment</li>
              <li>Easy Payment Plans Available</li>
              <li>Expected ROI: 18-25% annually</li>
            </ul>
          </div>
        </div>
      )}
    </div>

    {/* Sector 22D */}
    <div className="yeida-project">
      <div 
        className="project-header"
        onClick={() => setExpandedSector(expandedSector === 'sector22d' ? null : 'sector22d')}
        style={{ cursor: 'pointer' }}
      >
        <h3>Sector 22D Residential Plots {expandedSector === 'sector22d' ? '▼' : '▶'}</h3>
        <p>Upcoming mid-rise apartment blocks with great connectivity to Yamuna Expressway.</p>
        <span className="click-hint">Click to {expandedSector === 'sector22d' ? 'hide' : 'view'} details</span>
      </div>
      
      {expandedSector === 'sector22d' && (
        <div className="sector-details">
          <h4>📍 About YEIDA Sector 22D</h4>
          <p className="sector-description">
            YEIDA Sector 22D is planned for modern apartment living with mid-rise buildings. 
            Perfect for those looking for ready-to-move with modern amenities.
          </p>
          
          <div className="sector-features">
            <div className="feature-item">
              <span className="feature-icon">🏗️</span>
              <strong>Plot Sizes:</strong> 120 sq.m to 162 sq.m
            </div>
            <div className="feature-item">
              <span className="feature-icon">💰</span>
              <strong>Price Range:</strong> ₹1.10 Cr to ₹1.60 Cr
            </div>
            <div className="feature-item">
              <span className="feature-icon">✈️</span>
              <strong>Distance from Airport:</strong> 15km
            </div>
            <div className="feature-item">
              <span className="feature-icon">🛣️</span>
              <strong>Connectivity:</strong> Direct Yamuna Expressway Access
            </div>
            <div className="feature-item">
              <span className="feature-icon">⚡</span>
              <strong>Infrastructure:</strong> Modern Amenities
            </div>
            <div className="feature-item">
              <span className="feature-icon">🏫</span>
              <strong>Nearby:</strong> Schools, Malls, Hospitals,Formula Racing
            </div>
          </div>
          
          <div className="sector-highlights">
            <h5>✨ Key Highlights:</h5>
            <ul>
              <li>Modern Apartment Complex</li>
              <li>Clubhouse & Swimming Pool</li>
              <li>Kids Play Area & Parks</li>
              <li>Gym & Sports Facilities</li>
              <li>Ready-to-Move Options Available</li>
            </ul>
          </div>
        </div>
      )}
    </div>

    {/* Sector 16 */}
    <div className="yeida-project">
      <div 
        className="project-header"
        onClick={() => setExpandedSector(expandedSector === 'sector16' ? null : 'sector16')}
        style={{ cursor: 'pointer' }}
      >
        <h3>Sector 16 Residential Plots {expandedSector === 'sector16' ? '▼' : '▶'}</h3>
        <p>Modern residential plots planned for upcoming enterprises near Yamuna Expressway.</p>
        <span className="click-hint">Click to {expandedSector === 'sector16' ? 'hide' : 'view'} details</span>
      </div>
      
      {expandedSector === 'sector16' && (
        <div className="sector-details">
          <h4>📍 About YEIDA Sector 16</h4>
          <p className="sector-description">
            YEIDA Sector 16 is designated for residential purposes. 
            Good for investors who can wait long-term and are banking
             on big appreciation
          </p>
          
          <div className="sector-features">
            <div className="feature-item">
              <span className="feature-icon">🏗️</span>
              <strong>Plot Sizes:</strong> 120 sq.m to 300 sq.m
            </div>
            <div className="feature-item">
              <span className="feature-icon">💰</span>
              <strong>Price Range:</strong> ₹1.10 Cr to ₹1.60 Cr
            </div>
            <div className="feature-item">
              <span className="feature-icon">✈️</span>
              <strong>Distance from Airport:</strong> 18 km
            </div>
            <div className="feature-item">
              <span className="feature-icon">🛣️</span>
              <strong>Connectivity:</strong> Prime Location on Expressway
            </div>
            <div className="feature-item">
              <span className="feature-icon">⚡</span>
              <strong>Infrastructure:</strong> Commercial Grade Facilities
            </div>
            <div className="feature-item">
              <span className="feature-icon">🏫</span>
              <strong>Nearby:</strong> Business Hubs & Hotels
            </div>
          </div>
          
          <div className="sector-highlights">
            <h5>✨ Key Highlights:</h5>
            <ul>
              <li>Prime Residential Location</li>
              <li>High Footfall Area</li>
              <li>Near to Institutional sector</li>
              <li>Wide Road Frontage</li>
              <li>Excellent Visibility</li>
              <li>High Rental Yield Potential</li>
            </ul>
          </div>
        </div>
      )}
    </div>

    {/* Sector 17 */}
    <div className="yeida-project">
      <div 
        className="project-header"
        onClick={() => setExpandedSector(expandedSector === 'sector17' ? null : 'sector17')}
        style={{ cursor: 'pointer' }}
      >
        <h3>Sector 17 Residential Plots {expandedSector === 'sector17' ? '▼' : '▶'}</h3>
        <p>Dedicated residential area approved by YEIDA — ideal for manufacturing units, logistics, and startups.</p>
        <span className="click-hint">Click to {expandedSector === 'sector17' ? 'hide' : 'view'} details</span>
      </div>
      
      {expandedSector === 'sector17' && (
        <div className="sector-details">
          <h4>📍 About YEIDA Sector 17</h4>
          <p className="sector-description">
            Located along Yamuna Expressway, which is a major corridor. 
            The land is acquired by the authority for development. 
          </p>
          
          <div className="sector-features">
            <div className="feature-item">
              <span className="feature-icon">🏗️</span>
              <strong>Plot Sizes:</strong> 120 sq.m to 300 sq.m
            </div>
            <div className="feature-item">
              <span className="feature-icon">💰</span>
              <strong>Price Range:</strong> ₹1.10 Cr – ₹1.60 Cr
            </div>
            <div className="feature-item">
              <span className="feature-icon">✈️</span>
              <strong>Distance from Airport:</strong> 15-18 km
            </div>
            <div className="feature-item">
              <span className="feature-icon">🛣️</span>
              <strong>Connectivity:</strong> Good Road Network
            </div>
            <div className="feature-item">
              <span className="feature-icon">⚡</span>
              <strong>Infrastructure:</strong> Industrial Grade Power Supply
            </div>
            <div className="feature-item">
              <span className="feature-icon">🏫</span>
              <strong>Nearby:</strong> Logistics Parks & Warehouses
            </div>
          </div>
          
          <div className="sector-highlights">
            <h5>✨ Key Highlights:</h5>
            <ul>
             <li>Proximity to Jewar (Noida) International Airport could boost future value.</li>
              <li>Residential Plots Available</li>
              <li>Good for Warehouse & Logistics</li>
              <li>Growing Residential Hub</li>
              <li>Dual Investment Opportunity</li>
              <li>Long Term Investment</li>
            </ul>
          </div>
        </div>
      )}
    </div>

  </div>
</section>



        <section id="map">
    <h2>YEIDA Map Overview</h2>
    <iframe
      src="https://www.google.com/maps/embed?...YEIDA+Sectors+Noida..."
      width="100%"
      height="400"
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
    ></iframe>
  </section>

        {/* Inject dynamic seasonal background */}
        <div
          className="seasonal-background-wrapper"
          dangerouslySetInnerHTML={{ __html: seasonalHtml }}
        ></div>
        <Container className="homepage-container text-center text-light">
          <Container className="text-center mt-3 ">
            {/* Hidden static H1 for SEO */}
            <h1 style={{ display: "none" }}>
              Real Estate Experts in Noida, YEIDA, Greater Noida & Delhi NCR
            </h1>

            <h1 className="hero-heading pt-4">
              Find
              <span className="highlights">
                <Typewriter
                  words={keywords}
                  loop
                  cursor
                  cursorStyle="|"
                  typeSpeed={70}
                  deleteSpeed={50}
                  delaySpeed={1500}
                />
              </span>
            </h1>

            <div className="container-fluid">
              <div className="row">
                <div className="col-sm-5">
                  <section className="homepage-content container-fluid mb-2 pb-2 text-start">
                    <h2 className="mb-3 ">Why Invest in YEIDA</h2>
                    <p>
                      YEIDA (Yamuna Expressway Industrial Development Authority) is one of
                       the fastest-growing and most promising real estate regions in North India. 
                      Strategically located along the Yamuna Expressway, YEIDA offers
                       excellent connectivity to Noida, Greater Noida, Agra,
                        and the upcoming Noida International Airport (Jewar Airport).
                      With world-class infrastructure, planned townships,
                       and upcoming projects such as Film City and logistics parks,
                        YEIDA promises immense growth potential and high returns on investment.
                    </p>
                    <p>
                      With deep local expertise and honest advice, we help
                      clients make informed property decisions. Hundreds have
                      trusted us for our transparent process and market
                      knowledge.
                    </p>

                    <ul style={{ display: "none" }}>
                      <li>Buy & sell residential and commercial properties</li>
                      <li>YEIDA industrial plots and investment guidance</li>
                      <li>
                        Property consultation near Jewar Airport & Film City
                      </li>
                    </ul>
                  </section>
                </div>
                <div className="col-sm-7">
                  {/* Search Card */}
                  <div className="search-card mx-auto " ref={searchAreaRef}>
                    <Nav
                      variant="tabs"
                      activeKey={activeTab}
                      onSelect={(selectedKey) => setActiveTab(selectedKey)}
                      className="justify-content-center search-tabs"
                    >
                      <Nav.Item>
                        <Nav.Link
                          eventKey="residential"
                          className="post-property"
                        >
                          Residential{" "}
                          <span className="free-tag">
                            NEW <br />
                          </span>
                        </Nav.Link>
                      </Nav.Item>

                     

                      <Nav.Item>
                        <Nav.Link eventKey="top-picks">
                          <span className="top-tag">TOP</span> SKD Picks ✨
                        </Nav.Link>
                      </Nav.Item>

                      <Nav.Item>
                        <Nav.Link eventKey="emi">EMI Calculator</Nav.Link>
                      </Nav.Item>

                      <Nav.Item>
                        <Nav.Link eventKey="area-calculator">
                          📐 Area Calculator
                        </Nav.Link>
                      </Nav.Item>

                      <Nav.Item>
                        <Nav.Link eventKey="list-property">
                          📢 Need Help Selling?{" "}
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                    {["residential", "commercial", "industrial"].includes(
                      activeTab
                    ) && (
                      <InputGroup className="search-bar justify-content-center mt-3 ">
                        {activeTab === "residential" && (
                          <Form.Select
                            className="skd-category-select"
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                          >
                            <option value="">Property Types</option>
                            <option value="Registered">Registered</option>
                            <option value="Unregistered">Unregistered</option>
                          </Form.Select>
                        )}

                        <Form.Control
                          type="text"
                          className="form-control"
                          placeholder="Search by city or project name"
                          value={searchText}
                          onChange={(e) => setSearchText(e.target.value)}
                          onKeyDown={(e) =>
                            e.key === "Enter" && goToProjects(searchText)
                          }
                        />
                        <Button
                          className="skd-search-btn"
                          onClick={() => goToProjects(searchText)}
                        >
                          Search
                        </Button>
                      </InputGroup>
                    )}

                    

                    {activeTab === "emi" && (
                      <Form className="mt-3 text-center">
                        <Row className="justify-content-center g-2">
                          <Col md={3}>
                            <Form.Control
                              type="number"
                              placeholder="Loan Amount (₹)"
                              value={loan}
                              onChange={(e) => setLoan(e.target.value)}
                            />
                          </Col>
                          <Col md={3}>
                            <Form.Control
                              type="number"
                              placeholder="Interest Rate (%)"
                              value={rate}
                              onChange={(e) => setRate(e.target.value)}
                            />
                          </Col>
                          <Col md={3}>
                            <Form.Control
                              type="number"
                              placeholder="Tenure (Years)"
                              value={tenure}
                              onChange={(e) => setTenure(e.target.value)}
                            />
                          </Col>
                          <Col md="auto">
                            <Button variant="warning" onClick={calculateEMI}>
                              Calculate
                            </Button>
                          </Col>
                        </Row>
                        {emi && (
                          <div className="mt-3 fs-5 text-dark">
                            <strong>Monthly EMI:</strong> ₹{emi}
                          </div>
                        )}
                      </Form>
                    )}

                    {activeTab === "area-calculator" && (
                      <Form className="mt-3 text-center text-dark">
                        <Row className="justify-content-center g-2">
                          <Col md={2}>
                            <Form.Control
                              type="number"
                              placeholder="Length"
                              value={length}
                              onChange={(e) => setLength(e.target.value)}
                            />
                          </Col>
                          <Col md={2}>
                            <Form.Control
                              type="number"
                              placeholder="Breadth"
                              value={breadth}
                              onChange={(e) => setBreadth(e.target.value)}
                            />
                          </Col>
                          <Col md={2}>
                            <Form.Select
                              value={unit}
                              onChange={(e) => setUnit(e.target.value)}
                            >
                              <option value="feet">Feet</option>
                              <option value="meters">Meters</option>
                              <option value="yards">Yards</option>
                            </Form.Select>
                          </Col>
                          <Col md={2}>
                            <Form.Control
                              type="number"
                              placeholder="₹ / sq.ft (optional)"
                              value={ratePerSqFt}
                              onChange={(e) => setRatePerSqFt(e.target.value)}
                            />
                          </Col>
                          <Col md="auto">
                            <Button
                              variant="warning"
                              onClick={handleAreaCalculation}
                            >
                              Calculate
                            </Button>
                          </Col>
                        </Row>

                        {areaResult && (
                          <div className="mt-4 text-start bg-light p-3 border rounded w-75 mx-auto">
                            <p className="mb-1">
                              <strong>📏 Area in Sq. Ft:</strong>{" "}
                              {areaResult.sqFt} sq.ft
                            </p>
                            <p className="mb-1">
                              <strong>📐 Area in Sq. Meters:</strong>{" "}
                              {areaResult.sqM} m²
                            </p>
                            <p className="mb-1">
                              <strong>🏡 Area in Sq. Yards:</strong>{" "}
                              {areaResult.sqYd} yd²
                            </p>
                            {areaResult.totalCost && (
                              <p className="mb-0 text-success">
                                <strong>💰 Total Cost:</strong> ₹
                                {areaResult.totalCost}
                              </p>
                            )}
                          </div>
                        )}
                      </Form>
                    )}

                    {activeTab === "list-property" && (
                      <Form className="contact-selling-info mt-4 p-4 text-dark border rounded text-start bg-light">
                        <h4 className="mb-3">📢 List Your Property with Us</h4>
                        <div className="container">
                          <div className="row">
                            <div className="col-sm-6">
                              <p className="mb-2">
                                Want to sell your property{" "}
                                <strong>faster</strong> and at the{" "}
                                <strong>best price</strong>?
                              </p>

                              <ul className="list-unstyled ps-3 mb-4">
                                <li>🔎 Verified Buyers & Investor Network</li>
                                <li>📈 Strategic Marketing & Online Reach</li>
                                <li>📑 Legal & Documentation Support</li>
                                <li>🌐 Property Listing on Our Platform</li>
                                <li>
                                  👨‍💼 Personalized Sales Strategy by Experts
                                </li>
                              </ul>
                            </div>
                            <div className="col-sm-6">
                              <div className="contact-info">
                                <p className="mb-2">
                                  📞 <strong>Call:</strong>{" "}
                                  <a
                                    href="tel:+919091010909"
                                    className="text-decoration-none text-dark"
                                  >
                                    +91 9091010909
                                  </a>
                                </p>
                                <p className="mb-2">
                                  ✉️ <strong>Email:</strong>{" "}
                                  <a
                                    href="mailto:support@skdpropworld.com"
                                    className="text-decoration-none text-dark"
                                  >
                                    support@skdpropworld.com
                                  </a>
                                </p>
                                <p className="mb-0">
                                  💬 <strong>WhatsApp:</strong>{" "}
                                  <a
                                    href="https://wa.me/919091010909"
                                    className="text-decoration-none text-success"
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    Chat with us
                                  </a>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Form>
                    )}

                    {activeTab === "top-picks" && (
                      <>
                        <h3 className="mt-4 mb-3 text-dark">Top SKD Picks</h3>
                        <div className="top-picks-grid">
                          {topPicks.map((project) => (
                            <div
                              key={project.slug}
                              className="project-card border rounded shadow-sm"
                              onClick={() =>
                                navigate(`/projects/${project.slug}`)
                              }
                              style={{ cursor: "pointer" }}
                            >
                              <img
                                src={project?.bannerImage?.url}
                                alt={project.heading}
                                className="w-100"
                                loading="lazy"
                                style={{
                                  height: "200px",
                                  objectFit: "cover",
                                }}
                              />
                              <div className="p-3">
                                <h5 className="mb-1 text-dark">
                                  {project.heading}
                                </h5>
                                <p className="text-muted mb-0">
                                  {project.location}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </Container>
      </div>
      <ViewYouTubeSeries />
      <OfficeBearers />
      

      

      <PrimeWorkLocations />

      <Testimonials />

      <Stats />

      <YeidaNews />

      <LeadForm />

      <Footer />

      {/* Popup Enquiry Form */}
      <div id="enquiryForm" className="enquiry-popup-overlay" style={{ display: 'none' }}>
        <div className="enquiry-popup-content">
          <button 
            className="close-popup-btn"
            onClick={() => {
              document.getElementById('enquiryForm').style.display = 'none';
            }}
          >
            ✕
          </button>
          <h3 className="popup-title">Quick Enquiry</h3>
          <p className="popup-subtitle">Get in touch with us for the best deals!</p>
          <form className="popup-form">
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <input type="tel" placeholder="Phone Number" required />
            <select required>
              <option value="">Select Property Type</option>
              <option value="Registered">Registered</option>
              <option value="Unregistered">Unregistered</option>
            </select>
            <textarea placeholder="Your Message" rows="3"></textarea>
            <button type="submit" className="popup-submit-btn">Submit Enquiry</button>
          </form>
        </div>
      </div>

      {/* New Year 2025 Popup */}
      {showNewYearPopup && (
        <div className="newyear-popup-overlay">
          <div className="newyear-popup-content">
            <button 
              className="newyear-close-btn"
              onClick={() => setShowNewYearPopup(false)}
            >
              ✕
            </button>
            <div className="fireworks"></div>
            <div className="newyear-text">
              <h1 className="newyear-title">🎉 New Year 2026 Special Offer! 🎊</h1>
              <p className="newyear-subtitle">Get ready to start the year with your dream property!</p>
              <div className="newyear-offer">
                <h2>🎁 Special New Year Offer</h2>
                <p>Get <span className="highlight-text">Exclusive Deals</span> on YEIDA Properties</p>
                <p className="offer-details">✨ Zero Registration Fees on Select Plots</p>
                <p className="offer-details">✨ Special Discounts on Residential Properties</p>
                <p className="offer-details">✨ Limited Time Offer - Valid Till Jan 15, 2025</p>
              </div>
              <button 
                className="newyear-cta-btn"
                onClick={() => {
                  setShowNewYearPopup(false);
                  document.querySelector('.lead-form-section').scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Claim Your Offer Now! 🎯
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Homepage;
