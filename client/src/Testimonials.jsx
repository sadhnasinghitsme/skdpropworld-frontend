import React, { useEffect, useRef, useState } from "react";
import {
  FaStar,
  FaRegStar,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import "./Testimonials.css";
import { Helmet } from "react-helmet-async";

const reviews = [
  {
    name: "Harshit Singh",
    time: "15 days Ago",
    rating: 5,
    title: "Amazing experience.",
    content:
      "Amazing experience. They are both supportive and positive environment all around us for realstate in greater noida",
  },
  {
    name: "Shailendra Kumar",
    time: "About 1 day ago",
    rating: 5,
    title: "Excellent service and good quality",
    content:
      "I had an excellent experience with SKD Propworld pvt.ltd. The team is highly professional, knowledgeable and committed to delivering the best service.They helped me find the perfect property that met all my requirements.",
  },
  {
    name: "AMAN YADAV",
    time: "3 months ago",
    rating: 5,
    title: "Efficient support in every step",
    content:
      "Experts in yamuna expressway authority plots….Gives great deals 👍🏻👍🏻",
  },
  {
    name: "Anchal Rai",
    time: "a months ago",
    rating: 5,
    title: "Best in business",
    content: "YEIDA sector me ek residential plot ke liye consult kiya tha. Team ne har step clearly samjhaya. Good experience. Thanks to pawan sir",
  },
  {
    name: "Priya Gupta",
    time: "3 months ago",
    rating: 5,
    title: "Happy with the service",
    content: "Customer rated 5 star",
  },
  {
    name: "Akanksha",
    time: "15 days ago",
    rating: 5,
    title: "Supportive",
    content: "SKD Propworld ke saath experience bahut hi smooth aur genuine tha. Team helpful hai, guidance clear thi, aur sab kuch transparent tha. Property lene ke liye highly recommended!",
  },
   {
    name: "Adarsh Chouhan",
    time: "15 days ago",
    rating: 5,
    title: "Best",
    content: "Best real estate agents in greater noida",
  },
  {
    name: "Anju Pal",
    time: "27 days ago",
    rating: 5,
    title: "Very Professional",
    content: "Best real estate agent #skd",
  },
  {
    name: "Upendra Sharma",
    time: "2 months ago",
    rating: 5,
    title: "Gave me clarity",
    content: "Happy with the real estate services they provided.",
  },
  {
    name: "Piyush Gautam",
    time: "1 month ago",
    rating: 5,
    title: "The team is good",
    content: "Here we get the best deals and best investment opportunities",
  },
  {
    name: "Arunima Singh",
    time: "45 days ago",
    rating: 5,
    title: "recommended",
    content: "recommended this business",
  },
];

const Testimonials = () => {
  const scrollRef = useRef();
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  // Scroll-based animation trigger
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [inView, controls]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  const renderStars = (rating) => {
    return (
      <>
        {[...Array(5)].map((_, index) =>
          index < rating ? (
            <FaStar key={index} className="star filled" />
          ) : (
            <FaRegStar key={index} className="star" />
          )
        )}
      </>
    );
  };

  return (
    <>
      <Helmet>
        {/* <title>
          Client Testimonials | Verified Google Reviews | SKD Propworld
        </title> */}
        <meta
          name="description"
          content="Read verified Google reviews from satisfied customers of SKD Propworld. Discover why people trust us for their property investments across NCR."
        />
        <meta
          name="keywords"
          content="SKD Propworld reviews, client feedback, property testimonials, verified Google reviews, Noida real estate, customer satisfaction"
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="SKD Propworld" />
       
        {/* Open Graph Meta Tags */}
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://www.skdpropworld.com/testimonials"
        />
        <meta
          property="og:title"
          content="Client Testimonials | Verified Google Reviews | SKD Propworld"
        />
        <meta
          property="og:description"
          content="Explore what clients say about SKD Propworld. From buying YEIDA plots to getting expert advice, read authentic and verified Google feedback here."
        />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:url"
          content="https://www.skdpropworld.com/testimonials"
        />
        <meta
          name="twitter:title"
          content="Verified Testimonials | Real Estate Reviews – SKD Propworld"
        />
        <meta
          name="twitter:description"
          content="See how SKD Propworld has helped hundreds of property buyers through verified Google reviews and trusted client feedback."
        />
      </Helmet>
      <div className="testimonials-container">
        <h5 className=" text-center">Customer Testimonials</h5>
        <h2 className="text-center text-white fw-bold mb-4">
          Trusted by People Like You
        </h2>

        <div className="carousel-wrapper">
          <button className="scroll-btn" onClick={() => scroll("left")}>
            <FaChevronLeft />
          </button>

          {/* 👇 ref added here to track when visible */}
          <div className="reviews-scroll" ref={scrollRef}>
            <div ref={ref} className="d-flex" style={{ gap: "40px" }}>
              {reviews.map((review, idx) => (
                <motion.div
                  className="review-card"
                  key={idx}
                  /* ▼ Framer handles the viewport test per card */
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{
                    once: false,
                    amount: 0.25,
                  }} /* 25 % visible → fire, works on mobile too */
                  transition={{ delay: idx * 0.2, duration: 0.6 }}
                >
                  <div className="google-verified-badge">
                    <img
                      src="https://www.gstatic.com/images/branding/product/1x/googleg_32dp.png"
                      alt="Google Logo"
                      className="google-badge-logo"
                      loading="lazy"
                    />
                    <span className="google-badge-text">
                      Verified Google Review
                    </span>
                  </div>
                  <div className="stars">{renderStars(review.rating)}</div>
                  <h5 className="fw-bold mt-2">{review.title}</h5>
                  <p className="fst-italic">“{review.content}”</p>
                  <p className="text-success fw-semibold mt-3">{review.name}</p>
                  <p className="text-muted small">{review.time}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <button className="scroll-btn" onClick={() => scroll("right")}>
            <FaChevronRight />
          </button>
        </div>
      </div>
    </>
  );
};

export default Testimonials;
