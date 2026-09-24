function Hero() {
  return (
    <section className="hero">

      {/* Decorative background shapes */}
      <div className="hero-glow hero-glow-one"></div>
      <div className="hero-glow hero-glow-two"></div>

      <div className="hero-content">

        <p className="hero-tagline">
          LEARN <span>•</span> GROW <span>•</span> SUCCEED
        </p>

        <h1>
          Build Your Skills.
          <br />
          <span>Shape Your Future.</span>
        </h1>

        <p className="hero-description">
          Explore high-quality courses, learn practical skills,
          and grow your career with CourseHub.
        </p>

        <div className="hero-buttons">

          <a href="#courses" className="explore-btn">
            Explore Courses
            <span>→</span>
          </a>

          <a href="#about" className="learn-more-btn">
            Learn More
          </a>

        </div>

        {/* Small trust section */}
        <div className="hero-trust">

          <div className="trust-avatars">
            <span>👩🏻</span>
            <span>👨🏻</span>
            <span>👩🏻‍💻</span>
            <span>👨🏻‍💻</span>
          </div>

          <div>
            <strong>Join 2,000+ learners</strong>
            <p>Start your learning journey today</p>
          </div>

        </div>

      </div>

      {/* Right-side learning visual */}
      <div className="hero-visual">

        <div className="floating-card card-one">
          <span>🎓</span>
          <div>
            <strong>Learn</strong>
            <small>Without Limits</small>
          </div>
        </div>

        <div className="hero-circle">

          <div className="laptop">
            <div className="laptop-screen">
              <div className="screen-top"></div>
              <div className="screen-line"></div>
              <div className="screen-line short"></div>
              <div className="screen-boxes">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>

            <div className="laptop-base"></div>
          </div>

        </div>

        <div className="floating-card card-two">
          <span>📈</span>
          <div>
            <strong>Grow</strong>
            <small>Your Career</small>
          </div>
        </div>

      </div>

    </section>
  );
}

export default Hero;