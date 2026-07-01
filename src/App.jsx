import { useState } from "react";
import "./App.css";
import iconLogo from "./assets/icon-logo.png";
const journeyStages = [
  {
    age: "0–3",
    title: "Early Signals & Parent Guidance",
    points: [
      "Developmental observation",
      "Parent guidance and early routines",
      "Communication and play foundations",
      "Sensory comfort and regulation support",
    ],
  },
  {
    age: "3–6",
    title: "Early Intervention",
    points: [
      "Speech and communication support",
      "Occupational therapy foundations",
      "Behaviour and emotional regulation",
      "Pre-school and social readiness",
    ],
  },
  {
    age: "6–9",
    title: "School Readiness",
    points: [
      "Classroom participation",
      "Learning and attention support",
      "Peer interaction and social confidence",
      "Daily independence and structured routines",
    ],
  },
  {
    age: "9–12",
    title: "Building the Foundation",
    points: [
      "Core therapy skills",
      "Social skills and friendships",
      "Self-regulation and emotional understanding",
      "Parent partnership and home programs",
    ],
  },
  {
    age: "13–15",
    title: "Discovering Strengths",
    points: [
      "Advanced communication",
      "Academic and learning support",
      "Independence in daily routines",
      "Hobbies, sports, and creative interests",
    ],
  },
  {
    age: "16–18",
    title: "Preparing for Life",
    points: [
      "Vocational guidance",
      "Life skills and decision-making",
      "Social independence",
      "Real-world exposure",
    ],
  },
  {
    age: "19–22",
    title: "Stepping Into the World",
    points: [
      "Higher education or skill training",
      "Workplace readiness",
      "Independent living skills",
      "Financial literacy",
    ],
  },
  {
    age: "23–30",
    title: "Building a Life",
    points: [
      "Meaningful employment",
      "Healthy relationships",
      "Managing responsibilities",
      "Community participation",
    ],
  },
  {
    age: "30+",
    title: "Living With Purpose",
    points: [
      "Financial independence",
      "Long-term wellness",
      "Giving back to others",
      "Living with dignity and joy",
    ],
  },
];

const visionPillars = [
  {
    icon: "🌱",
    title: "Child at the Centre",
    text: "Every decision starts with the child’s well-being, strengths, pace, and comfort.",
  },
  {
    icon: "🤝",
    title: "Family Empowerment",
    text: "We walk beside families as partners with clarity, support, and trust.",
  },
  {
    icon: "🧠",
    title: "Holistic & Inclusive",
    text: "We care for communication, behaviour, learning, emotions, and daily life.",
  },
  {
    icon: "📘",
    title: "Quality & Evidence",
    text: "Therapy is guided by professional assessment, evidence, and practical outcomes.",
  },
  {
    icon: "🛡️",
    title: "Integrity & Transparency",
    text: "Parents deserve honest communication and progress they can understand.",
  },
  {
    icon: "💡",
    title: "Innovation for Impact",
    text: "We will use systems, tools, and technology to improve care and accessibility.",
  },
];

function VisionSection() {
  const [activeView, setActiveView] = useState("journey");
  const [activeStage, setActiveStage] = useState(0);

  const stageIcons = ["👶", "🌱", "🎒", "🧩", "💡", "🧭", "🚀", "💼", "🌄"];

  const stageFocus = [
    "The earliest years are about noticing developmental signals early, guiding parents, and building comfort, communication, play, and regulation.",
    "Early intervention builds the child’s foundation through speech, occupational therapy, behaviour support, play skills, and family routines.",
    "School readiness focuses on communication, attention, peer interaction, learning confidence, and daily independence.",
    "Strong foundations continue with therapy, regulation, routines, social skills, and parent partnership.",
    "Confidence grows through communication, academics, hobbies, and independence.",
    "Teen years become a launchpad for life skills, choices, and real-world readiness.",
    "Young adults step outward into education, work skills, independent living, and community.",
    "Adulthood becomes about meaningful work, healthy living, responsibility, and belonging.",
    "A future of dignity, purpose, contribution, and joyful lifelong growth.",
  ];

  const lifeSkillTags = [
    "Communication",
    "Independence",
    "Money Management",
    "Time Management",
    "Problem Solving",
    "Self Care",
    "Digital Literacy",
    "Safety Awareness",
    "Decision Making",
  ];

  const ecosystemNodes = [
    {
      icon: "👨‍👩‍👦",
      title: "Families",
      text: "Empowered, informed, and supported every step of the journey.",
    },
    {
      icon: "🧑‍⚕️",
      title: "Therapists",
      text: "Expertise with empathy, clarity, and evidence-based practice.",
    },
    {
      icon: "🏫",
      title: "Schools",
      text: "Stronger bridges between therapy, classrooms, and inclusion.",
    },
    {
      icon: "🏥",
      title: "Healthcare",
      text: "Meaningful collaboration with doctors and care partners.",
    },
    {
      icon: "🏛️",
      title: "Community",
      text: "Policy, NGOs, and social systems that support belonging.",
    },
    {
      icon: "💻",
      title: "Technology",
      text: "Smarter systems that improve access, coordination, and outcomes.",
    },
  ];

  const impactPoints = [
    "Every child makes measurable progress",
    "Families feel supported and empowered",
    "Therapists thrive in a purpose-led environment",
    "Communities become more inclusive",
  ];

  return (
    <section id="vision" className="visionFuture">
      <div className="visionGridOverlay" />
      <div className="visionGlow glowOne" />
      <div className="visionGlow glowTwo" />

      <div className="visionShell">
        <div className="visionTop">
          <p className="smallTitle smallTitleLight">Our Vision</p>
          <h2>A future where every child blooms uniquely.</h2>
          <p>
            We are building more than a therapy center. We are building a future
            where each child grows with confidence, independence, inclusion, and
            purpose — supported by families, professionals, and a stronger care
            ecosystem.
          </p>
        </div>

        <div className="futureSwitch">
          <button
            className={activeView === "journey" ? "active" : ""}
            onClick={() => setActiveView("journey")}
          >
            Child Journey
          </button>

          <button
            className={activeView === "ecosystem" ? "active" : ""}
            onClick={() => setActiveView("ecosystem")}
          >
            Edelweizz Ecosystem
          </button>
        </div>

        {activeView === "journey" && (
          <div className="journeyUniverse">
            <div className="journeyRail">
              {journeyStages.map((stage, index) => (
                <button
                  key={stage.age}
                  className={activeStage === index ? "active" : ""}
                  onClick={() => setActiveStage(index)}
                >
                  <div className="railIcon">{stageIcons[index]}</div>
                  <span>{stage.age}</span>
                  <small>{stage.title}</small>
                </button>
              ))}
            </div>

            <div className="journeySpotlight">
              <div className="spotlightGraphic">
                <div className="graphicRing ringOuter" />
                <div className="graphicRing ringMiddle" />
                <div className="graphicCore">
                  <div className="coreIcon">{stageIcons[activeStage]}</div>
                  <div className="coreAge">{journeyStages[activeStage].age}</div>
                </div>
              </div>

              <div className="spotlightContent">
                <div className="spotlightBadge">Journey Spotlight</div>
                <h3>{journeyStages[activeStage].title}</h3>
                <p className="spotlightLead">{stageFocus[activeStage]}</p>

                <ul className="spotlightList">
                  {journeyStages[activeStage].points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lifeSkillsFuture">
              <div className="lifeSkillsHeader">
                <h3>Life skills we will nurture</h3>
                <p>
                  Practical skills that help children move toward confidence,
                  independence, and real-life readiness.
                </p>
              </div>

              <div className="futureSkillCloud">
                {lifeSkillTags.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeView === "ecosystem" && (
          <div className="ecosystemUniverse">
            <div className="ecosystemOrbit">
              <div className="visionCore">
                <div className="visionCoreInner">
                  <span className="coreMini">Vision Core</span>
                  <h3>Edelweizz</h3>
                  <p>
                    Child-first care, family empowerment, evidence, inclusion,
                    and meaningful long-term impact.
                  </p>
                </div>
              </div>

              {ecosystemNodes.map((node, index) => (
                <div
                  key={node.title}
                  className={`orbitNode orbitNode${index + 1}`}
                >
                  <div className="orbitNodeIcon">{node.icon}</div>
                  <h4>{node.title}</h4>
                  <p>{node.text}</p>
                </div>
              ))}
            </div>

            <div className="impactRibbon">
              <h3>What this creates</h3>
              <div className="impactGrid">
                {impactPoints.map((item) => (
                  <div className="impactCard" key={item}>
                    <span>✦</span>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState("home");

  const goToPage = (page) => {
    setActivePage(page);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <main id="top" className="page" data-active-page={activePage}>
      <header className="header">
        <button
          className="brand"
          type="button"
          onClick={() => goToPage("home")}
        >
          <img
            src={iconLogo}
            alt="Edelweizz Pediatric Therapy Center logo"
            className="siteLogo"
          />
          <div>
            <h1>Edelweizz</h1>
            <p>Pediatric Therapy Center</p>
          </div>
        </button>

        <nav className="navMenu" aria-label="Main navigation">
          <button
            type="button"
            className={activePage === "home" ? "active" : ""}
            onClick={() => goToPage("home")}
          >
            Home
          </button>
          <button
            type="button"
            className={activePage === "about" ? "active" : ""}
            onClick={() => goToPage("about")}
          >
            About
          </button>
          <button
            type="button"
            className={activePage === "vision" ? "active" : ""}
            onClick={() => goToPage("vision")}
          >
            Vision
          </button>
          <button
            type="button"
            className={activePage === "services" ? "active" : ""}
            onClick={() => goToPage("services")}
          >
            Services
          </button>
          <button
            type="button"
            className={activePage === "support" ? "active" : ""}
            onClick={() => goToPage("support")}
          >
            Who We Support
          </button>
          <button
            type="button"
            className={activePage === "space" ? "active" : ""}
            onClick={() => goToPage("space")}
          >
            Our Space
          </button>
          <button
            type="button"
            className={activePage === "careers" ? "active" : ""}
            onClick={() => goToPage("careers")}
          >
            Work With Us
          </button>
          <button
            type="button"
            className={activePage === "faq" ? "active" : ""}
            onClick={() => goToPage("faq")}
          >
            FAQ
          </button>
          <button
            type="button"
            className={activePage === "contact" ? "active" : ""}
            onClick={() => goToPage("contact")}
          >
            Contact
          </button>
        </nav>

        <div className="headerActions">
          <button
            className="topButton"
            type="button"
            onClick={() => goToPage("contact")}
          >
            Book Assessment
          </button>

          <button
            className="menuButton"
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open menu"
          >
            ☰
          </button>
        </div>

        {isMenuOpen && (
          <div className="mobileMenuBackdrop" onClick={closeMenu}>
            <aside
              className="mobileMenu"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mobileMenuTop">
                <div className="mobileBrand">
                  <img
                    src={iconLogo}
                    alt="Edelweizz Pediatric Therapy Center logo"
                    className="mobileMenuLogo"
                  />
                  <div>
                    <h3>Edelweizz</h3>
                    <p>Pediatric Therapy Center</p>
                  </div>
                </div>

                <button
                  className="closeMenuButton"
                  type="button"
                  onClick={closeMenu}
                  aria-label="Close menu"
                >
                  ×
                </button>
              </div>

              <nav className="mobileLinks" aria-label="Mobile navigation">
                <button type="button" onClick={() => goToPage("home")}>
                  Home
                </button>
                <button type="button" onClick={() => goToPage("about")}>
                  About
                </button>
                <button type="button" onClick={() => goToPage("vision")}>
                  Vision
                </button>
                <button type="button" onClick={() => goToPage("services")}>
                  Services
                </button>
                <button type="button" onClick={() => goToPage("support")}>
                  Who We Support
                </button>
                <button type="button" onClick={() => goToPage("space")}>
                  Our Space
                </button>
                <button type="button" onClick={() => goToPage("careers")}>
                  Work With Us
                </button>
                <button type="button" onClick={() => goToPage("faq")}>
                  FAQ
                </button>
                <button type="button" onClick={() => goToPage("contact")}>
                  Contact
                </button>
              </nav>

              <div className="mobileMenuContact">
                <a href="https://wa.me/919886261567" onClick={closeMenu}>
                  WhatsApp Us
                </a>
                <a href="tel:+919886261567" onClick={closeMenu}>
                  Call 9886261567
                </a>
              </div>
            </aside>
          </div>
        )}
      </header>

      <section className="hero">
        <div className="heroText">
          <p className="tagline">Every Child Blooms Uniquely</p>

          <h2>
            Pediatric therapy, early intervention, and child development support in Sarjapur.
          </h2>

          <p className="heroPara">
            Edelweizz Pediatric Therapy Center in Sarjapur, Bangalore supports
            children with speech delay, autism spectrum needs, sensory processing
            challenges, behavioural concerns, developmental delays, and learning
            differences through child-first therapy and parent partnership.
          </p>

          <div className="heroButtons">
            <button
              className="primaryButton"
              type="button"
              onClick={() => goToPage("contact")}
            >
              Book an Assessment
            </button>
            <button
              className="secondaryButton"
              type="button"
              onClick={() => goToPage("services")}
            >
              View Services
            </button>
          </div>

          <div className="localTrustStrip" aria-label="Edelweizz parent trust highlights">
            <div className="localTrustItem">
              <span>📍</span>
              <p>Sarjapur • Chembanahalli Road</p>
            </div>
            <div className="localTrustItem">
              <span>🌱</span>
              <p>Early intervention focus</p>
            </div>
            <div className="localTrustItem">
              <span>🤝</span>
              <p>Parent-friendly progress updates</p>
            </div>
          </div>
        </div>

        <div className="heroCard">
          <h3>Therapy support under one roof</h3>
          <p>
            A structured, warm, and multidisciplinary space where therapy goals,
            home practice, and parent communication stay connected.
          </p>

          <div className="miniGrid">
            <div>Speech Therapy</div>
            <div>Occupational Therapy</div>
            <div>Behaviour & ABA</div>
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
        Edelweizz Pediatric Therapy Center in Sarjapur was created with a simple
        belief: every child deserves to be understood before being guided. We
        support children with developmental, communication, behavioural, sensory,
        and learning needs through a warm and structured therapy experience.
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
<VisionSection />
      <section id="services" className="section white">
        <p className="smallTitle">Our Services</p>
        <h2>Therapy and developmental support under one roof</h2>

        <div className="cards serviceCards">
          {[
            {
              icon: "🗣️",
              title: "Speech Therapy",
              text: "Support for speech delay, language development, articulation, social communication, and everyday communication confidence.",
            },
            {
              icon: "✋",
              title: "Occupational Therapy",
              text: "Support for sensory processing, motor skills, coordination, handwriting readiness, self-care, and daily living independence.",
            },
            {
              icon: "🌈",
              title: "Behaviour Therapy",
              text: "Structured support for emotional regulation, behaviour concerns, attention, transitions, routines, and positive participation.",
            },
            {
              icon: "🧩",
              title: "ABA Therapy",
              text: "Goal-based support for communication, learning readiness, social skills, behaviour, and functional independence where appropriate.",
            },
            {
              icon: "📘",
              title: "Special Education",
              text: "Learning support for school readiness, attention, academic foundations, individualized learning goals, and classroom participation.",
            },
            {
              icon: "🤝",
              title: "Parent Counselling",
              text: "Guidance for parents to understand therapy goals, home practice, routines, progress updates, and next steps with clarity.",
            },
          ].map((service) => (
            <div className="card" key={service.title}>
              <div className="serviceIcon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
            </div>
          ))}
        </div>

        <div className="sectionCtaCard">
          <div>
            <h3>Not sure which therapy your child needs?</h3>
            <p>
              Start with an initial assessment. We will understand your child’s
              history, strengths, parent concerns, and developmental needs before
              suggesting the next step.
            </p>
          </div>
          <div className="sectionCtaActions">
            <button type="button" onClick={() => goToPage("contact")}>
              Book Assessment
            </button>
            <a href="https://wa.me/919886261567">WhatsApp Us</a>
          </div>
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
          <div>Early intervention and developmental delays</div>
          <div>Learning and school-readiness challenges</div>
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

      <section id="process" className="section white">
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


      <section id="space" className="spaceSection">
        <div className="spaceIntro">
          <p className="smallTitle">Our Space</p>
          <h2>A calm, child-friendly therapy environment in Sarjapur.</h2>
          <p>
            We are preparing Edelweizz as a warm and structured therapy space
            near Sarjapur and Chembanahalli Road where children feel safe,
            parents feel welcomed, and therapy can happen with clarity, dignity,
            and comfort.
          </p>
        </div>

        <div className="spaceGrid">
          {[
            {
              icon: "🗣️",
              title: "Speech & Communication Room",
              text: "A focused setting for language, communication, articulation, and social interaction support.",
            },
            {
              icon: "✋",
              title: "Occupational Therapy Zone",
              text: "A practical space for sensory regulation, motor skills, coordination, and daily living readiness.",
            },
            {
              icon: "📘",
              title: "Learning Support Corner",
              text: "A structured area for special education, school readiness, attention, and learning support.",
            },
            {
              icon: "🌿",
              title: "Sensory-Friendly Environment",
              text: "Soft, respectful, and child-aware surroundings designed to reduce overwhelm and build comfort.",
            },
            {
              icon: "👨‍👩‍👦",
              title: "Parent Waiting & Guidance Area",
              text: "A welcoming space where parents can speak to the team, understand goals, and receive home-practice guidance.",
            },
            {
              icon: "🧩",
              title: "Play-Based Therapy Setup",
              text: "Therapy materials and activity spaces that make learning engaging, meaningful, and child-led.",
            },
          ].map((item) => (
            <div className="spaceCard" key={item.title}>
              <div className="spaceIcon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <span>Opening Soon</span>
            </div>
          ))}
        </div>

        <div className="spaceNote">
          <h3>Real photos coming soon</h3>
          <p>
            Once the Sarjapur center setup is complete, this page will be
            updated with actual photos of the therapy rooms, learning spaces,
            parent area, and child-friendly activity zones.
          </p>
        </div>
      </section>

      <section id="careers" className="careersSection">
        <div className="careersHero">
          <div>
            <p className="smallTitle">Work With Us</p>
            <h2>Join a therapy center being built with purpose, empathy, and professional care.</h2>
            <p>
              Edelweizz is looking for therapists and educators who believe
              that every child deserves patient, respectful, evidence-informed,
              and family-aware support.
            </p>
          </div>

          <div className="careersPanel">
            <h3>We value</h3>
            <div>Clinical discipline</div>
            <div>Warm communication</div>
            <div>Parent partnership</div>
            <div>Child-first thinking</div>
          </div>
        </div>

        <div className="roleGrid">
          {[
            "Speech Therapist",
            "Occupational Therapist",
            "Behaviour Therapist",
            "Special Educator",
            "Early Intervention Professional",
            "Therapy Coordinator",
          ].map((role) => (
            <div className="roleCard" key={role}>
              <h3>{role}</h3>
              <p>
                We welcome professionals who can work with children
                thoughtfully, document progress clearly, and collaborate with
                families and the multidisciplinary team.
              </p>
            </div>
          ))}
        </div>

        <div className="applyBand">
          <div>
            <h3>Interested in working with Edelweizz?</h3>
            <p>
              Share your profile with us on WhatsApp. Relevant certification,
              practical pediatric therapy experience, documentation discipline,
              and child-centered communication will be important.
            </p>
          </div>

          <a href="https://wa.me/919886261567">Apply on WhatsApp</a>
        </div>
      </section>

      <section id="faq" className="faqSection">
        <div className="faqIntro">
          <p className="smallTitle">FAQ</p>
          <h2>Common questions parents ask before starting therapy.</h2>
          <p>
            These answers are meant to give parents clarity. A proper therapy
            plan is always created after understanding the child’s needs,
            strengths, history, and family goals.
          </p>
        </div>

        <div className="faqList">
          {[
            {
              question: "Do we need an assessment before therapy starts?",
              answer:
                "Yes. An initial assessment helps us understand the child’s strengths, communication style, sensory needs, behaviour patterns, learning needs, history, and parent concerns before therapy goals are planned.",
            },
            {
              question: "When should I consider early intervention for my child?",
              answer:
                "Parents should consider early intervention when they notice delays in speech, play, eye contact, response to name, social interaction, motor skills, attention, behaviour, or daily routines. Early support can help families act with clarity instead of waiting in confusion.",
            },
            {
              question: "Do you provide speech therapy in Sarjapur?",
              answer:
                "Yes. Edelweizz supports children with speech delay, language development needs, articulation concerns, communication difficulties, and social communication goals from our Sarjapur center.",
            },
            {
              question: "Do you provide occupational therapy for sensory and motor needs?",
              answer:
                "Yes. Occupational therapy can support children with sensory processing challenges, fine motor skills, gross motor coordination, handwriting readiness, self-care routines, and daily living independence.",
            },
            {
              question: "Do you support children with autism spectrum needs?",
              answer:
                "Yes. We support children with autism spectrum needs through respectful, structured, child-centered therapy plans focused on communication, regulation, learning readiness, independence, and family support.",
            },
            {
              question: "What is the difference between behaviour therapy and ABA therapy?",
              answer:
                "Behaviour therapy broadly supports emotional regulation, routines, transitions, attention, and positive participation. ABA therapy uses structured, goal-based methods where appropriate. The right approach depends on the child’s needs and assessment.",
            },
            {
              question: "Will parents receive progress updates and home practice guidance?",
              answer:
                "Yes. Parent communication is central to Edelweizz. Parents should understand therapy goals, progress, next steps, and simple home-practice activities that can continue during daily routines.",
            },
            {
              question: "What age group do you support?",
              answer:
                "We support young children, school-age children, and adolescents based on developmental needs. Early intervention, school readiness, communication, learning, behaviour, and independence goals can all be discussed during assessment.",
            },
            {
              question: "Where is Edelweizz Pediatric Therapy Center located?",
              answer:
                "Edelweizz Pediatric Therapy Center is located opposite Muneshwara Temple, Volagere Kallahalli, Chembanahalli Road, Karnataka 562125, near Sarjapur, Bangalore.",
            },
            {
              question: "How can I book an assessment?",
              answer:
                "You can contact us on WhatsApp or call 9886261567. We will guide you on assessment availability, useful documents to bring, and the next steps for your child.",
            },
          ].map((item) => (
            <details className="faqItem" key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>


      <section id="contact" className="contact">
  <div className="contactIntro">
    <p className="smallTitle">Contact Us</p>
    <h2>Looking for pediatric therapy support near Sarjapur?</h2>
    <p>
      Speak to us and book an initial assessment at Edelweizz Pediatric
      Therapy Center. We support families looking for speech therapy,
      occupational therapy, behaviour therapy, ABA therapy, special education,
      and early intervention support near Sarjapur and Chembanahalli Road.
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
        <p>Speech Therapy • Occupational Therapy • Behaviour Therapy • Special Education • Early Intervention</p>
      </footer>
    </main>
  );
}

export default App;