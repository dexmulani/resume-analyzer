// Reorganized Templates and Demo Data for the AI Resume Analyzer Frontend

export const jobTemplates = {
  frontend: {
    title: "Senior Frontend Engineer",
    company: "InnovateTech Solutions",
    description: `Position: Senior Frontend Engineer
Location: Remote (US/Canada)
Type: Full-Time

About the Role:
We are seeking a talented and passionate Senior Frontend Engineer to join our core product team. You will be responsible for building, optimizing, and maintaining highly interactive web applications that delight millions of users. You will collaborate closely with product managers, UI/UX designers, and backend engineers to translate complex ideas into clean, performant, and maintainable React applications.

Required Qualifications:
- 5+ years of professional software development experience, with a focus on modern frontend technologies.
- Expert-level proficiency in JavaScript (ES6+), TypeScript, and HTML5/CSS3.
- Extensive production experience with React (including hooks, state management like Redux/Zustand, and Next.js).
- Strong understanding of state-of-the-art styling frameworks (TailwindCSS, Styled Components, or CSS Modules).
- Experience with modern build tools, bundle optimization, and front-end tooling (Vite, Webpack, ESLint, Prettier).
- Solid experience writing unit and integration tests (Jest, React Testing Library, Cypress).
- Deep understanding of web performance optimization, rendering patterns (SSR, SSG, CSR), and SEO best practices.
- Excellent communication skills and experience mentoring junior developers.

Preferred Skills:
- Experience with GraphQL and RESTful APIs.
- Familiarity with cloud services (AWS, Vercel) and CI/CD pipelines (GitHub Actions).
- Experience with design systems and Tailwind UI.
- Strong UI/UX sensibilities and eye for detail.`
  },
  datascientist: {
    title: "Senior Data Scientist (AI/ML)",
    company: "NeuraAnalytics Corp",
    description: `Position: Senior Data Scientist (AI/ML)
Location: San Francisco, CA (Hybrid)
Type: Full-Time

About the Role:
NeuraAnalytics is looking for a Senior Data Scientist to lead our predictive modeling and AI intelligence initiatives. In this role, you will design, develop, and deploy advanced machine learning models that power our core analytics engine. You will work with massive, multi-modal datasets to extract actionable insights, build recommendation systems, and implement natural language processing models.

Key Responsibilities:
- Design, train, and deploy production-grade machine learning and deep learning models (Supervised/Unsupervised, NLP, Computer Vision).
- Build robust data pipelines for data extraction, cleaning, preprocessing, and feature engineering.
- Collaborate with engineering teams to integrate models into microservices and production APIs.
- Conduct statistical analysis, A/B testing, and exploratory data analysis (EDA) to drive product strategy.
- Keep abreast of the latest advancements in LLMs, generative AI, and deep learning architectures.
- Mentor junior data scientists and advocate for AI/ML best practices across the organization.

Required Qualifications:
- Master’s or Ph.D. in Computer Science, Statistics, Mathematics, Data Science, or a related quantitative field.
- 4+ years of professional experience as a Data Scientist or Machine Learning Engineer.
- Strong programming skills in Python and SQL.
- Deep expertise in PyTorch, TensorFlow, Scikit-Learn, Pandas, and NumPy.
- Experience with NLP frameworks (Hugging Face Transformers, spaCy) and vector databases (Pinecone, Chroma).
- Familiarity with cloud platforms (AWS, GCP) and containerization (Docker, Kubernetes).
- Strong communication skills to present complex technical topics to non-technical stakeholders.`
  },
  productmanager: {
    title: "Technical Product Manager (Cloud Platform)",
    company: "SaaSify Systems",
    description: `Position: Technical Product Manager (Cloud Infrastructure)
Location: Austin, TX (Hybrid) / Remote Friendly
Type: Full-Time

About the Role:
SaaSify is looking for a technical and strategic Product Manager to own our developer experience and core cloud platform infrastructure. You will work directly with our engineering teams, customer success, and enterprise customers to define the vision, roadmap, and execution strategy for our API ecosystem, container orchestrations, and integration tools.

Responsibilities:
- Define the product vision, strategy, and roadmap for SaaSify’s Core Platform team.
- Translate complex cloud infrastructure requirements into clear, actionable user stories, epics, and product specs.
- Collaborate closely with Cloud Platform Architects, Site Reliability Engineers (SRE), and Security teams to deliver secure, resilient, and highly scalable infrastructure features.
- Define and track core KPIs for system reliability, API latency, and developer onboarding velocity.
- Conduct competitor analysis, developer interviews, and industry research to drive innovation in our product suite.

Requirements:
- 3+ years of experience as a Technical Product Manager, Systems Architect, or Software Engineer in a cloud environment.
- Solid technical background: extensive knowledge of cloud services (AWS, Azure, GCP), Docker, Kubernetes, and microservice architectures.
- Experience managing APIs as a product (REST, gRPC, Developer Portals).
- Proven track record of shipping complex enterprise-grade software products from inception to launch.
- Exceptional analytical skills, data-driven mindset, and experience with SQL/analytics tools.
- Outstanding communication and collaboration skills to bridge business goals and engineering execution.`
  }
};

export const sampleResumes = {
  alex: {
    name: "Alex Rivera - Frontend Engineer",
    text: `ALEX RIVERA
San Francisco, CA | alex.rivera@email.dev | (555) 019-2834 | github.com/alexriveradev | linkedin.com/in/alexrivera

SUMMARY
Creative and detail-oriented Senior Frontend Engineer with over 6 years of experience building and optimizing high-performance, responsive web applications. Expert in React, JavaScript, and TypeScript, with a passion for crafting pixel-perfect interfaces and delivering outstanding user experiences. Proven track record of improving web performance by up to 40% and leading developer teams to ship features on time.

WORK EXPERIENCE

Senior Frontend Developer | TechVibe Web Systems | Jan 2023 - Present
- Architected and rebuilt the flagship SaaS analytics dashboard using React 18, TypeScript, and TailwindCSS, resulting in a 45% increase in page speed and a 15% boost in user retention.
- Led a team of 4 frontend engineers, conducting code reviews, implementing CI/CD with GitHub Actions, and establishing standard coding guidelines (ESLint/Prettier).
- Built a modular, reusable design system library from scratch, reducing frontend development time across 3 separate company products by 30%.
- Integrated complex REST and GraphQL APIs using React Query for seamless, offline-first data caching and synchronization.

Frontend Engineer | AlphaCore Technologies | Sep 2020 - Dec 2022
- Engineered responsive, interactive web interfaces using React, Redux Toolkit, and Sass, serving over 500,000 active monthly users.
- Collaborated closely with UI/UX designers to translate Figma design mockups into semantic, highly accessible HTML/CSS components (WCAG AA compliance).
- Optimized web bundles through code-splitting, lazy loading, and tree-shaking, shaving 1.8 seconds off initial page load times.
- Wrote over 150 unit and integration tests using Jest and React Testing Library, increasing test coverage from 40% to 85%.

Junior Web Developer | PixelCraft Studio | Jun 2018 - Aug 2020
- Built and maintained custom client websites using HTML5, CSS3, JavaScript (ES6), and Vue.js.
- Developed pixel-perfect responsive layouts that maintained compatibility across multiple browsers and mobile devices.
- Conducted regular SEO optimizations, structured schema markups, and improved website accessibility.

TECHNICAL SKILLS
- Languages: JavaScript (ES6+), TypeScript, HTML5, CSS3, SQL
- Frameworks & Libraries: React, Next.js, Redux Toolkit, React Query, Vue.js, Express.js
- Styling: TailwindCSS, Styled Components, Sass, CSS Modules
- Tools & DevOps: Git, Vite, Webpack, Jest, Cypress, Docker, Vercel, AWS (S3/CloudFront)
- Core Competencies: Responsive Web Design, Web Performance Optimization, Web Accessibility (a11y), UI/UX Design Sensibilities

EDUCATION
Bachelor of Science in Computer Science
University of California, Davis | Graduate: May 2018`
  }
};

export const mockAnalysis = {
  atsScore: 78,
  breakdown: {
    keywords: 80,
    skills: 75,
    experience: 82,
    formatting: 90
  },
  summary: "Alex is a highly qualified Frontend Engineer with a very strong background in React, TypeScript, and web performance optimization. His resume matches the technical requirements of the Senior Frontend Engineer position beautifully, showing direct experience leading teams and building reusable design systems. There are a few minor gaps in testing tooling and SEO rendering patterns that could be further highlighted.",
  keywords: {
    found: ["React", "TypeScript", "JavaScript", "HTML5", "CSS3", "Vite", "TailwindCSS", "Next.js", "Git", "GitHub Actions", "Vercel", "Jest", "GraphQL", "REST", "CI/CD", "Design systems"],
    missing: ["Zustand", "Redux", "Webpack", "Cypress", "React Testing Library", "SSR", "SSG", "Performance optimization", "SEO best practices", "Mentoring"]
  },
  feedback: {
    strengths: [
      "Excellent demonstration of React 18, TypeScript, and TailwindCSS in production settings.",
      "Clear metrics showing impact, such as a 45% increase in page speed and a 30% reduction in development time.",
      "Solid experience creating modular design systems, which directly aligns with preferred qualifications.",
      "Demonstrated leadership capabilities, leading a team of 4 frontend engineers."
    ],
    weaknesses: [
      "Although unit tests are mentioned, there is limited focus on Cypress and integration testing in the experience bullet points.",
      "Rendering paradigms (SSR, SSG, CSR) aren't explicitly mentioned, which is listed as a required qualification.",
      "Specific mention of state management like Redux/Zustand is light; Redux Toolkit is listed under experience but not connected to large architectural challenges."
    ],
    recommendations: [
      "**Incorporate SSR/SSG Concepts**: Explicitly mention experience with Server-Side Rendering (SSR) and Static Site Generation (SSG) in the context of your Next.js work to fulfill the modern rendering patterns requirement.",
      "**Elevate Mentoring Accomplishments**: Under your Senior Frontend Developer role, expand on 'led a team of 4 frontend engineers' to include active mentoring of junior engineers, directly matching the JD bullet points.",
      "**Mention Cypress & RTL in Bullets**: Add a bullet point highlighting a specific testing success using Cypress for end-to-end testing or React Testing Library for component testing.",
      "**Highlight State Management Architecture**: Under skills or experience, explicitly mention designing state architectures with Redux Toolkit or Zustand to hit that specific keyword.",
      "**Highlight Web Performance SEO**: Connect your SEO optimization work with frontend performance improvements, demonstrating a complete understanding of how rendering and performance impact web rankings."
    ]
  },
  tailored: {
    summary: "Dynamic and results-driven Senior Frontend Engineer with 6+ years of professional experience specializing in modern React ecosystems, TypeScript, and high-performance web architecture. Expert in translating complex Figma specifications into semantic, accessible components, and designing modular design systems that reduce development cycles by 30%. Proven track record of driving a 45% increase in web performance and mentoring cross-functional engineering teams to ship scalable, pixel-perfect frontend products.",
    bullets: [
      {
        original: "Architected and rebuilt the flagship SaaS analytics dashboard using React 18, TypeScript, and TailwindCSS, resulting in a 45% increase in page speed and a 15% boost in user retention.",
        tailored: "Architected and rebuilt the flagship enterprise SaaS analytics dashboard using Next.js (SSR/SSG), TypeScript, and TailwindCSS; optimized state management with Redux/Zustand, resulting in a 45% improvement in core web vitals and 15% boost in user retention."
      },
      {
        original: "Led a team of 4 frontend engineers, conducting code reviews, implementing CI/CD with GitHub Actions, and establishing standard coding guidelines (ESLint/Prettier).",
        tailored: "Led and mentored a cross-functional team of 4 frontend engineers, driving agile sprints, conducting constructive code reviews, and establishing robust CI/CD pipelines via GitHub Actions that reduced production deployment times by 20%."
      },
      {
        original: "Wrote over 150 unit and integration tests using Jest and React Testing Library, increasing test coverage from 40% to 85%.",
        tailored: "Implemented a comprehensive testing suite comprising over 150 unit and integration tests utilizing Jest, React Testing Library, and Cypress, successfully elevating test coverage from 40% to 85% and cutting regression bugs by half."
      }
    ]
  },
  interview: [
    {
      type: "Technical",
      question: "You mentioned using React Query for offline-first caching and GraphQL. How did you design the cache synchronization strategy, and how would you compare it to global state managers like Redux or Zustand for data caching?",
      approach: "Focus on explaining the distinction between server state (handled by React Query) and client UI state (handled by Redux/Zustand). Talk about query keys, cache invalidation on mutations, stale times, and how offloading server data fetching to React Query simplified your global state store significantly."
    },
    {
      type: "Technical",
      question: "The job description requires experience with modern rendering patterns (SSR, SSG, CSR). In your Next.js project, how did you decide when to use Server-Side Rendering (SSR) versus Static Site Generation (SSG), and how did it impact SEO and performance?",
      approach: "Explain the technical trade-offs: use SSG for marketing or blog pages that change rarely (optimized load speed, great SEO, cached on CDN), and use SSR for highly dynamic, user-specific dashboard pages (up-to-date data, fast TTFB). Highlight how Next.js pre-rendering solves search engine crawlability."
    },
    {
      type: "Behavioral",
      question: "Can you describe a time when you had to mentor a junior developer who was struggling with a complex frontend architecture? What steps did you take and what was the outcome?",
      approach: "Use the STAR method. Situation: Junior dev struggling with a new modular state architecture or TypeScript types. Task: Get them comfortable while meeting the sprint deadline. Action: Set up paired programming sessions, created simple sandboxed coding exercises, broke down architecture diagram, and encouraged them to ask questions. Result: The developer successfully shipped their feature, increased their autonomy, and felt supported."
    },
    {
      type: "Technical",
      question: "You built a reusable design system from scratch. How did you handle tokenization (spacing, colors, typography), and how did you balance customization demands with structural consistency across products?",
      approach: "Explain creating design tokens in JSON or CSS custom properties. Detail using Tailwind configuration to extend standard systems. Discuss component API design—making them flexible via props (e.g., variant, size) but restricting custom ad-hoc styling to preserve brand identity across platforms."
    },
    {
      type: "Behavioral",
      question: "We noticed you improved performance by 45% on the TechVibe flagship product. Walk us through your optimization workflow. How did you identify the bottlenecks, and what engineering decisions did you make to resolve them?",
      approach: "Use STAR. S: The flagship SaaS dashboard was experiencing lag. T: Shave initial load time and optimize runtime renders. A: Used Lighthouse and Chrome DevTools Performance tab to spot bloated packages and render bottlenecks. Decisions: Implemented code-splitting via lazy/Suspense, compressed assets, refactored React Context to avoid wasteful re-renders, and integrated virtualized lists. R: Load time plummeted by 45%, and scroll fluidity reached 60fps."
    }
  ]
};
