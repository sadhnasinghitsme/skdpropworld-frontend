import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import './FAQ.css';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqItems = [
    {
      question: 'Why choose SKD PropWorld as a real estate agent in Greater Noida?',
      answer: 'SKD PropWorld is a trusted real estate company in Greater Noida offering verified residential and commercial properties. We provide transparent deals, legal assistance, and end-to-end support to buyers and investors.'
    },
    {
      question: 'Do you deal in YEIDA residential and commercial plots?',
      answer: 'Yes, SKD PropWorld specializes in YEIDA residential and commercial plots. All properties are legally verified, and we guide clients through documentation, pricing, and possession processes.'
    },
    {
      question: 'What types of properties do you offer in Greater Noida?',
      answer: 'We offer residential plots,commercial plots and investment plots across Greater Noida, Greater Noida West, and YEIDA sectors.'
    },
    {
      question: 'Is SKD PropWorld suitable for property investment in Greater Noida?',
      answer: 'Yes, we help investors identify high-growth property options in Greater Noida and YEIDA with strong future appreciation potential and infrastructure development.'
    },
    {
      question: 'Do you provide assistance with property documentation and registration?',
      answer: 'Absolutely. SKD PropWorld assists with complete property documentation, agreement review, and registration support to ensure a smooth and secure transaction.'
    },
    {
      question: 'How can I contact SKD PropWorld for property consultation?',
      answer: 'You can contact SKD PropWorld through our website contact form or call us directly for expert real estate consultation in Greater Noida and YEIDA.'
    }
  ];

  return (
    <div className="faq-container">
      <Helmet>
        <title>Frequently Asked Questions | SKD Prop World</title>
        <meta name="description" content="Find answers to common questions about SKD Prop World properties, payment plans, booking process, and more." />
        <link rel="canonical" href="/faq" />
      </Helmet>
      
      <div className="faq-header">
        <h1>Frequently Asked Questions</h1>
        <p>Find answers to common questions about our properties and services</p>
      </div>
      
      <div className="faq-list">
        {faqItems.map((item, index) => (
          <div 
            key={index} 
            className={`faq-item ${activeIndex === index ? 'active' : ''}`}
          >
            <button 
              className="faq-question" 
              onClick={() => toggleFAQ(index)}
              aria-expanded={activeIndex === index}
              aria-controls={`faq-answer-${index}`}
              id={`faq-question-${index}`}
            >
              {item.question}
              <span className="faq-icon">+</span>
            </button>
            <div 
              className="faq-answer" 
              id={`faq-answer-${index}`}
              role="region"
              aria-labelledby={`faq-question-${index}`}
              style={{ display: activeIndex === index ? 'block' : 'none' }}
            >
              {item.answer}
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '3rem', textAlign: 'center' }}>
        <h3>Still have questions?</h3>
        <p>Contact our support team for more information</p>
        <a href="/contact" className="contact-button">Contact Us</a>
      </div>
    </div>
  );
};

export default FAQ;
