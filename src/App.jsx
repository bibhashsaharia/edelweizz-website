import "./App.css";
import iconLogo from "./assets/icon-logo.png";

function App() {
  return (
    <main id="top" className="page">
      <header className="header">
      <a className="brand" href="#top">
      <img
  src={iconLogo}
  alt="Edelweizz Pediatric Therapy Center logo"
  className="siteLogo"
/>
  <div>
    <h1>Edelweizz</h1>
    <p>Pediatric Therapy Center</p>
  </div>
</a>

        <nav className="navMenu">
        <a href="#why-edelweizz">Why Edelweizz</a>
        <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#support">Who We Support</a>
          <a href="#approach">Approach</a>
          <a href="#contact">Contact</a>
        </nav>

        <a className="topButton" href="#contact">
          Book Assessment
        </a>
      </header>

      <section className="hero">
        <div className="heroText">
          <p className="tagline">Every Child Blooms Uniquely</p>

          <h2>
            A warm therapy space for every child’s unique developmental journey.
          </h2>

          <p className="heroPara">
            Edelweizz Pediatric Therapy Center supports children with speech
            delay, autism, sensory needs, behavioural challenges, developmental
            delays, and learning differences.
          </p>

          <div className="heroButtons">
            <a className="primaryButton" href="#contact">
              Book an Assessment
            </a>
            <a className="secondaryButton" href="#services">
              View Services
            </a>
          </div>
        </div>

        <div className="heroCard">
          <h3>Support that feels personal</h3>
          <p>
            We work with children, parents, and therapists to create practical,
            compassionate, and consistent therapy journeys.
          </p>

          <div className="miniGrid">
            <div>Speech Therapy</div>
            <div>Occupational Therapy</div>
            <div>Behaviour Therapy</div>
            <div>Special Education</div>
          </div>
        </div>
      </section>
      <section id="why-edelweizz" className="whySection">
  <div className="whyIntro">
    <p className="smallTitle">Why Parents Choose Edelweizz</p>
    <h2>Therapy support that understands both the child and the family.</h2>
    <p>
      At Edelweizz, we know that every child’s journey is different. Our goal
      is to create a warm, structured, and transparent therapy experience where
      parents feel informed, children feel safe, and progress is built step by
      step.
    </p>
  </div>

  <div className="whyGrid">
    <div className="whyCard">
      <h3>Parent-Led Understanding</h3>
      <p>
        We listen to parents carefully because they know their child’s daily
        world better than anyone else.
      </p>
    </div>

    <div className="whyCard">
      <h3>Evidence-Informed Therapy</h3>
      <p>
        Therapy plans are guided by professional assessment, developmental
        needs, and practical goals for the child.
      </p>
    </div>

    <div className="whyCard">
      <h3>Clear Progress Communication</h3>
      <p>
        Parents should not be left guessing. We believe in clear updates,
        transparent goals, and simple next steps.
      </p>
    </div>

    <div className="whyCard">
      <h3>Multidisciplinary Support</h3>
      <p>
        Speech therapy, occupational therapy, behaviour therapy, and special
        education support can work together when needed.
      </p>
    </div>

    <div className="whyCard">
      <h3>Child-Friendly Environment</h3>
      <p>
        We are building a warm, safe, and respectful space where children feel
        comfortable while they learn and grow.
      </p>
    </div>

    <div className="whyCard">
      <h3>Home Practice Guidance</h3>
      <p>
        Therapy works best when parents know what to continue at home in simple,
        practical ways.
      </p>
    </div>
  </div>
</section>
<section id="about" className="aboutSection">
  <div className="aboutContent">
    <div className="aboutText">
      <p className="smallTitle">About Edelweizz</p>

      <h2>Built with professional care and a parent’s understanding.</h2>

      <p>
        Edelweizz Pediatric Therapy Center was created with a simple belief:
        every child deserves to be understood before being guided. We support
        children with developmental, communication, behavioural, sensory, and
        learning needs through a warm and structured therapy experience.
      </p>

      <p>
        Our approach is child-first and family-aware. We know therapy is not
        just about what happens inside a session. It is also about helping
        parents understand progress, continue simple practices at home, and feel
        less alone in the journey.
      </p>

      <p>
        At Edelweizz, we aim to bring together therapy, parent communication,
        practical goals, and compassionate care so that each child can grow at
        their own pace.
      </p>
    </div>

    <div className="aboutPromise">
      <h3>Our promise to parents</h3>

      <div className="promiseList">
        <div>
          <span>01</span>
          <p>We will listen before we suggest.</p>
        </div>

        <div>
          <span>02</span>
          <p>We will keep therapy goals clear and practical.</p>
        </div>

        <div>
          <span>03</span>
          <p>We will communicate progress in simple language.</p>
        </div>

        <div>
          <span>04</span>
          <p>We will respect every child’s pace, personality, and needs.</p>
        </div>
      </div>
    </div>
  </div>
</section>
      <section id="services" className="section white">
        <p className="smallTitle">Our Services</p>
        <h2>Therapy and developmental support under one roof</h2>

        <div className="cards">
          {[
            "Speech Therapy",
            "Occupational Therapy",
            "Behaviour Therapy",
            "ABA Therapy",
            "Special Education",
            "Parent Counselling",
          ].map((service) => (
            <div className="card" key={service}>
              <h3>{service}</h3>
              <p>
                Individualized support designed around each child’s needs,
                strengths, family goals, and therapy plan.
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="support" className="section twoColumn">
        <div>
          <p className="smallTitle">Who We Support</p>
          <h2>
            For children who need more understanding, structure, and support.
          </h2>
        </div>

        <div className="supportList">
          <div>Autism spectrum support</div>
          <div>Speech and communication delays</div>
          <div>Sensory processing challenges</div>
          <div>Attention and behavioural concerns</div>
          <div>Learning and school-readiness challenges</div>
          <div>Developmental delays</div>
        </div>
      </section>

      <section id="approach" className="purpleSection">
        <p className="smallTitle light">Our Approach</p>
        <h2>We don’t believe in one-size-fits-all therapy.</h2>
        <p>
          Every child has a different pace, personality, sensory world, and
          communication style. Our goal is to help each child bloom in their own
          way, while keeping parents informed, involved, and supported.
        </p>
      </section>

      <section className="section white">
        <p className="smallTitle">How It Works</p>
        <h2>A simple path for parents</h2>

        <div className="steps">
          <div>
            <span>1</span>
            <h3>Book an assessment</h3>
          </div>
          <div>
            <span>2</span>
            <h3>Meet the therapist</h3>
          </div>
          <div>
            <span>3</span>
            <h3>Create a therapy plan</h3>
          </div>
          <div>
            <span>4</span>
            <h3>Track progress together</h3>
          </div>
        </div>
      </section>

      <section id="contact" className="contact">
  <div className="contactIntro">
    <p className="smallTitle">Contact Us</p>
    <h2>Looking for therapy support for your child?</h2>
    <p>
      Speak to us and book an initial assessment at Edelweizz Pediatric
      Therapy Center. We will guide you with warmth, clarity, and care.
    </p>

    <div className="contactButtons">
      <a className="whatsappButton" href="https://wa.me/919886261567">
        WhatsApp Us
      </a>

      <a className="callButton" href="tel:+919886261567">
        Call Now
      </a>
    </div>
  </div>

  <div className="contactGrid">
    <div className="contactBox">
      <h3>Phone</h3>
      <p>9886261567</p>
      <p>9886264796</p>
    </div>

    <div className="contactBox">
      <h3>Location</h3>
      <p>
        Opposite Muneshwara Temple, Volagere Kallahalli, Chembanahalli Road,
        Karnataka 562125
      </p>
    </div>

    <div className="contactBox">
      <h3>Website</h3>
      <p>edelweizzindia.com</p>
    </div>

    <div className="contactBox">
      <h3>Opening Soon</h3>
      <p>
        We are preparing a safe, warm, and child-friendly therapy space for
        families in and around Sarjapur.
      </p>
    </div>
  </div>

  <div className="mapCard">
    <h3>Find us near Sarjapur</h3>
    <p>
      Opposite Muneshwara Temple, Volagere Kallahalli, Chembanahalli Road,
      Karnataka 562125
    </p>

    <a
      className="mapButton"
      href="https://www.google.com/maps/search/?api=1&query=Opposite%20Muneshwara%20Temple%20Volagere%20Kallahalli%20Chembanahalli%20Road%20Karnataka%20562125"
      target="_blank"
      rel="noreferrer"
    >
      Open in Google Maps
    </a>
  </div>
</section>

      <footer>
        <h3>Edelweizz Pediatric Therapy Center</h3>
        <p>Every Child Blooms Uniquely</p>
      </footer>
    </main>
  );
}

export default App;