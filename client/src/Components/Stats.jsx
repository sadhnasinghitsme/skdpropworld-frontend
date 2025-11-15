// import React from "react";
// import {
//   FaBuilding,
//   FaSmile,
//   FaClock,
//   FaHeadset,
//   FaFacebookF,
//   FaInstagram,
//   FaTwitter,
//   FaYoutube,
//   FaLinkedinIn,
// } from "react-icons/fa";
// import { Container, Row, Col } from "react-bootstrap";
// import CountUp from "react-countup";
// import "./Stats.css";

// const Stats = () => {
//   return (
//     /* Stats */

//     <Container className="hero-stats-container mt-5">
//       <Row className="hero-stats justify-content-center">
//         <Col xs={6} md={3} className="text-center mb-4">
//           <FaBuilding size={32} color="#ffc107" className="mb-2" />
//           <h3>
//             <CountUp end={500} duration={2} />+
//           </h3>
//           <p className="text-white">Projects Listed</p>
//         </Col>
//         <Col xs={6} md={3} className="text-center mb-4">
//           <FaSmile size={32} color="#ffc107" className="mb-2" />
//           <h3>
//             <CountUp end={1000} duration={2} />+
//           </h3>
//           <p className="text-white">Happy Clients</p>
//         </Col>
//         <Col xs={6} md={3} className="text-center mb-4">
//           <FaClock size={32} color="#ffc107" className="mb-2" />
//           <h3>
//             <CountUp end={10} duration={2} />+
//           </h3>
//           <p className="text-white">Years Experience</p>
//         </Col>
//         <Col xs={6} md={3} className="text-center mb-4">
//           <FaHeadset size={32} color="#ffc107" className="mb-2" />
//           <h3>24x7</h3>
//           <p className="text-white">Support</p>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default Stats;
import React from "react";
import { FaCheckCircle, FaUsers, FaAward, FaHeadphones } from "react-icons/fa";
import { Container, Row, Col } from "react-bootstrap";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import "./Stats.css";

const Stats = () => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.5,
  });

  return (
    <Container className="hero-stats-container mt-5" ref={ref}>
      <Row className="hero-stats justify-content-center">
        <Col xs={6} md={3} className="text-center mb-4">
          <div className="stat-icon-wrapper">
            <FaCheckCircle size={48} className="stat-icon" />
          </div>
          <h3>{inView && <CountUp end={3000} duration={2} />}+</h3>
          <p className="text-white">Projects Completed</p>
        </Col>
        <Col xs={6} md={3} className="text-center mb-4">
          <div className="stat-icon-wrapper">
            <FaUsers size={48} className="stat-icon" />
          </div>
          <h3>{inView && <CountUp end={3500} duration={2} />}+</h3>
          <p className="text-white">Happy Clients</p>
        </Col>
        <Col xs={6} md={3} className="text-center mb-4">
          <div className="stat-icon-wrapper">
            <FaAward size={48} className="stat-icon" />
          </div>
          <h3>{inView && <CountUp end={15} duration={2} />}+</h3>
          <p className="text-white">Years Experience</p>
        </Col>
        <Col xs={6} md={3} className="text-center mb-4">
          <div className="stat-icon-wrapper">
            <FaHeadphones size={48} className="stat-icon" />
          </div>
          <h3>24x7</h3>
          <p className="text-white">Support</p>
        </Col>
      </Row>
    </Container>
  );
};

export default Stats;
