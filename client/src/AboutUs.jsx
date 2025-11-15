import React from "react";
import "./AboutUs.css";
import Navbar from "./Components/Navbar";
import founderImg from "/md_sir.jpg";
import Footer from "./Footer";
import LeadForm from "./Components/LeadForm";
import Testimonials from "./Testimonials";
import SupportWidget from "./Components/SupportWidget";
import { Helmet } from "react-helmet-async";

const AboutUs = () => {
  return (
    <>
      <Helmet>
        <title>About Us | SKD Propworld - Global Real Estate Experts</title>
        <meta
          name="description"
          content="Learn about SKD Propworld — a trusted global real estate leader offering investment advisory, sales, and relocation services across India (Noida, Greater Noida, YEIDA, Delhi, Ghaziabad, New Delhi, Delhi NCR), USA, UK, UAE, Singapore, and Canada."
        />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="About SKD Propworld | Real Estate Advisors & Experts"
        />
        <meta
          property="og:description"
          content="Explore SKD Propworld's mission, vision, and leadership in global real estate markets. Building value, trust, and relationships worldwide."
        />
        <meta property="og:url" content="https://skdpropworld.com/about" />

        {/* Twitter Meta */}
        {/* <meta name="twitter:card" content="summary_large_image" /> */}
        <meta name="twitter:title" content="About Us | SKD Propworld" />
        <meta
          name="twitter:description"
          content="Discover how SKD Propworld is transforming real estate through innovation, trust, and global expertise."
        />
      </Helmet>

      <Navbar />

      <div className="aboutus-page">
        <section className="aboutus-hero-section text-center d-flex align-items-center justify-content-center">
          <div className="container">
            <h1 className="display-4 fw-bold">About Us</h1>
            <p className="lead">Your trusted partner in global real estate</p>
          </div>
        </section>

        {/* Who We Are */}
        <section className="py-5 who-we-are-section">
          <div className="who-we-are-slideshow">
            <div className="slide slide1"></div>
            <div className="slide slide2"></div>
            <div className="slide slide3"></div>
          </div>
          <div className="who-we-are-overlay"></div>
          <div className="container position-relative">
            <h2 className="mb-4 text-center fw-bold text-white">Who We Are</h2>
            <p className="lead text-justify text-white">
              At <strong>SKD Propworld</strong>, we specialize exclusively in <strong>YEIDA (Yamuna Expressway Industrial Development Authority)</strong> projects. Our goal is to provide clear, trustworthy, and professional real estate services for buyers and investors interested in YEIDA Residential Plots. We focus on delivering accurate information, smooth documentation support, and personalized guidance to help clients make confident decisions in the YEIDA region.
              <br />
              <br />
              Our goal is to provide clear, trustworthy, and professional real estate
               services for buyers and investors interested in YEIDA Residential Plots.
               We focus on delivering accurate information, smooth documentation support,
                and personalized guidance to help clients make confident decisions in the 
                YEIDA region.Our mission is to empower clients with transparent advice,
                 expert knowledge of YEIDA sectors, and hassle-free assistance—whether you’re
                  looking to buy a residential plot, secure an industrial space, or invest in 
                  high-growth YEIDA zones near the upcoming Noida International Airport.
                  SKD has been established since 2011, continues to deliver excellence.

              <br />
              <br />
              With years of experience dedicated to YEIDA projects, SKD Propworld takes pride
               in being a trusted name for anyone seeking reliability, clarity, and real value
                in the Yamuna Expressway real estate market.
            </p>
          </div>
        </section>

        {/* Founder Section */}
        <section
          className="aboutus-founder-section position-relative text-white"
          style={{ backgroundImage: `url(${founderImg})` }}
        >
          <div className="aboutus-overlay"></div>
          <div className="container py-5 position-relative z-2">
            <div className="row align-items-center">
              <div className="col-lg-3 text-start">
                <h3 className="fw-bold mb-3 mt-5">
                  From the Desk of Our Founder
                </h3>
                <p className="lead mb-3">
                  “Welcome to SKD Propworld, where your property aspirations
                  meet our passion for excellence. Real estate is not just about
                  transactions — it's about building long-term relationships and
                  adding real value to your investments.”
                </p>
                <p>
                  “We are committed to transparency, trust, and innovation. I
                  invite you to explore a new dimension of real estate with us —
                  one that focuses on personalized service, strategic advice,
                  and cutting-edge technology.”
                </p>
                <p className="fw-semibold mt-4">- Er. Pawan Mishra</p>
              </div>
              <div className="col-lg-6 d-none d-lg-block"></div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="aboutus-stats-section py-5">
          <div className="container">
            <div className="row g-4 text-center">
              <div className="col-md-3 col-6">
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-users"></i>
                  </div>
                  <h3 className="stat-number">500+</h3>
                  <p className="stat-label">Happy Clients</p>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-building"></i>
                  </div>
                  <h3 className="stat-number">100+</h3>
                  <p className="stat-label">YEIDA Projects</p>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-award"></i>
                  </div>
                  <h3 className="stat-number">15+</h3>
                  <p className="stat-label">Years Experience</p>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-handshake"></i>
                  </div>
                  <h3 className="stat-number">100%</h3>
                  <p className="stat-label">Client Satisfaction</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="pb-5 aboutus-mission-section">
          <div className="container">
            <h2 className="mb-5 text-center fw-bold">Mission & Vision</h2>
            <div className="row gx-4 gy-4">
              <div className="col-md-6">
                <div className="aboutus-mission-box h-100">
                  <div className="mission-icon">
                    <i className="fas fa-bullseye"></i>
                  </div>
                  <h4 className="fw-semibold mb-3">Our Mission</h4>
                  <p>
                    To empower clients with transparent advice, expert knowledge of YEIDA sectors, 
                    and hassle-free assistance in finding the perfect residential plot or investment 
                    opportunity in the Yamuna Expressway region.
                  </p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="aboutus-vision-box h-100">
                  <div className="vision-icon">
                    <i className="fas fa-eye"></i>
                  </div>
                  <h4 className="fw-semibold mb-3">Our Vision</h4>
                  <p>
                    To be the most trusted and reliable name in YEIDA real estate, known for 
                    integrity, professionalism, and delivering exceptional value to every client 
                    in the Yamuna Expressway market.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="aboutus-values-section py-5">
          <div className="container">
            <h2 className="mb-5 text-center fw-bold">Our Core Values</h2>
            <div className="row g-4">
              <div className="col-md-4">
                <div className="value-card">
                  <div className="value-icon">
                    <i className="fas fa-shield-alt"></i>
                  </div>
                  <h5 className="fw-bold mb-3">Transparency</h5>
                  <p>Clear, honest communication and complete disclosure in every transaction.</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="value-card">
                  <div className="value-icon">
                    <i className="fas fa-certificate"></i>
                  </div>
                  <h5 className="fw-bold mb-3">Trust</h5>
                  <p>Building long-term relationships based on reliability and integrity.</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="value-card">
                  <div className="value-icon">
                    <i className="fas fa-lightbulb"></i>
                  </div>
                  <h5 className="fw-bold mb-3">Expertise</h5>
                  <p>Deep knowledge of YEIDA sectors and market trends to guide your decisions.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        {/* <section className="py-5 bg-white">
          <div className="container">
            <h2 className="mb-5 text-center fw-bold">Client Testimonials</h2>
            <div className="row g-4">
              {[
                {
                  quote:
                    "SKD Propworld exceeded our expectations with their professionalism and attention to detail. Highly recommend!",
                  author: "Client A",
                },
                {
                  quote:
                    "Thanks to SKD Propworld, we found our dream property in record time!",
                  author: "Client B",
                },
                {
                  quote:
                    "Their advisory services were a game-changer for our real estate investments.",
                  author: "Client C",
                },
              ].map((testimonial, index) => (
                <div className="col-md-4" key={index}>
                  <div className="aboutus-testimonial animate-fade-in">
                    <p className="fst-italic">“{testimonial.quote}”</p>
                    <p className="fw-semibold text-end">
                      - {testimonial.author}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section> */}

        <Testimonials />
      </div>
      <LeadForm />
      <SupportWidget />
      <Footer />
    </>
  );
};

export default AboutUs;
