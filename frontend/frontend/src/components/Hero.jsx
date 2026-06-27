import { useState, useEffect } from "react";

function Hero() {
  const images = ["/slide1.jpg", "/slide2.jpg", "/slide3.jpg"];
  const [current, setCurrent] = useState(0);

  // Auto slide every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 6000); // slower change
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="hero">
      {/* Background images stacked */}
      {images.map((img, index) => (
        <div
          key={index}
          className={`slide ${index === current ? "active" : ""}`}
          style={{ backgroundImage: `url(${img})` }}
        ></div>
      ))}

      <div className="hero-overlay">
        <h1>Welcome to Exam Application</h1>
        <p>Secure, Fast & Easy Online Exams</p>
      </div>

      {/* Dots */}
      <div className="dots">
        {images.map((_, index) => (
          <span
            key={index}
            className={`dot ${current === index ? "active" : ""}`}
            onClick={() => setCurrent(index)}
          ></span>
        ))}
      </div>
    </section>
  );
}

export default Hero;
