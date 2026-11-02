import { Roadmap } from "@/types";

export const roadmapsData: Roadmap[] = [
  {
    id: "roadmap-web-dev",
    slug: "full-stack-web-dev",
    title: "Full-Stack Web Development Roadmap",
    tagline: "The pragmatic, zero-fluff journey from HTML to building scalable cloud applications.",
    description: "Designed specifically for beginners and engineering students. Master modern JavaScript, React 19, Next.js 16, Node.js/FastAPI, PostgreSQL, and cloud deployments.",
    badge: "Most Popular",
    duration: "6 Months (10-15 hrs/week)",
    prerequisites: ["A computer with an internet connection", "Basic curiosity to build things"],
    icon: "Globe",
    color: "from-cyan-500 to-blue-600",
    phases: [
      {
        id: "phase-1",
        phaseNumber: 1,
        title: "Frontend Foundations",
        description: "Understand how the browser displays content, stylizes layouts, and handles user interactions.",
        steps: [
          {
            id: "step-html5",
            title: "HTML5 Semantics & Accessibility",
            description: "Learn semantic tags (article, section, nav, header), forms, input validation, SEO basics, and web accessibility (ARIA roles).",
            topics: ["Semantic tags", "Form controls & validation", "Meta tags & Open Graph", "Web Accessibility (a11y)"],
            resources: [
              { title: "HTML5 Decoded Cheat Sheet", url: "/resources/full-stack-web-dev-notes-2026", type: "cheat-sheet" },
              { title: "MDN Web Docs: HTML Basics", url: "https://developer.mozilla.org", type: "doc" }
            ],
            estimatedTime: "1-2 Weeks"
          },
          {
            id: "step-css-tailwind",
            title: "CSS3, Flexbox, Grid & Modern Tailwind CSS",
            description: "Master modern layout engines: Flexbox for 1D alignments, CSS Grid for 2D layouts, responsive media queries, and utility-first Tailwind CSS.",
            topics: ["Box Model", "Flexbox & Grid", "CSS Variables", "Tailwind CSS v4", "Mobile-first Responsive Design"],
            resources: [
              { title: "Flexbox Froggy Game", url: "https://flexboxfroggy.com", type: "practice" },
              { title: "Tailwind CSS Official Docs", url: "https://tailwindcss.com", type: "doc" }
            ],
            estimatedTime: "2-3 Weeks"
          },
          {
            id: "step-javascript-es6",
            title: "Modern JavaScript (ES6+ Under the Hood)",
            description: "Deep dive into JS fundamentals: Execution Context, Call Stack, Scope Chains, Closures, Event Loop, Promises, and async/await.",
            topics: ["Data types & equality", "Array methods (map, filter, reduce)", "Closures & Prototypes", "Event Loop & Asynchronous JS", "DOM Manipulation"],
            resources: [
              { title: "JavaScript Polyfills & Interview Handbook", url: "/resources/frontend-interview-handbook", type: "cheat-sheet" },
              { title: "JavaScript.info Modern Tutorial", url: "https://javascript.info", type: "doc" }
            ],
            estimatedTime: "3-4 Weeks"
          }
        ]
      },
      {
        id: "phase-2",
        phaseNumber: 2,
        title: "React & Next.js Ecosystem",
        description: "Build reactive, blazing-fast single page and server-rendered web applications.",
        steps: [
          {
            id: "step-react-core",
            title: "React Core Concepts & Modern Hooks",
            description: "JSX, Component composition, Props, State with `useState`, Lifecycle effects with `useEffect`, and DOM refs with `useRef`.",
            topics: ["JSX & Virtual DOM", "Component Lifecycle", "useState & useEffect", "Custom Hooks", "State management (Zustand)"],
            resources: [
              { title: "Modern Web Dev Notes (React Section)", url: "/resources/full-stack-web-dev-notes-2026", type: "cheat-sheet" },
              { title: "Official React 19 Documentation", url: "https://react.dev", type: "doc" }
            ],
            estimatedTime: "3-4 Weeks"
          },
          {
            id: "step-nextjs-app-router",
            title: "Next.js App Router, SSR & Server Components",
            description: "The gold standard for modern full-stack React. Understand Server Components (RSC), Client Components, Server Actions, Dynamic routing, and caching.",
            topics: ["App Router architecture", "React Server Components", "Server Actions", "Streaming & Suspense", "API Route handlers"],
            resources: [
              { title: "Next.js & Tailwind Starter Templates", url: "/resources/react-and-tailwind-starter-templates", type: "video" },
              { title: "Next.js Official Documentation", url: "https://nextjs.org/docs", type: "doc" }
            ],
            estimatedTime: "2-3 Weeks"
          }
        ]
      },
      {
        id: "phase-3",
        phaseNumber: 3,
        title: "Backend, Databases & Auth",
        description: "Power your apps with scalable server logic, relational databases, and secure authentication.",
        steps: [
          {
            id: "step-backend-node-python",
            title: "Backend APIs (Node.js/Express or Python/FastAPI)",
            description: "Create RESTful APIs, handle HTTP request/response lifecycles, middlewares, file uploads, error handling, and rate limiting.",
            topics: ["HTTP status codes & headers", "REST API architecture", "Middleware chains", "FastAPI / Express framework", "Environment variables"],
            resources: [
              { title: "Production Backend with FastAPI & SQLAlchemy", url: "/resources/fastapi-and-rest-api-blueprint", type: "video" }
            ],
            estimatedTime: "3 Weeks"
          },
          {
            id: "step-sql-databases",
            title: "Databases: PostgreSQL, Prisma/SQLAlchemy & Supabase",
            description: "Design relational schemas, table joins, indexes, ACID transactions, and ORMs like Prisma or SQLAlchemy.",
            topics: ["Relational Schema Design", "Complex SQL Queries", "Indexes & Performance", "ORMs (Prisma / Drizzle)", "Supabase Postgres"],
            resources: [
              { title: "DBMS & SQL Interview Bible", url: "/resources/sql-dbms-interview-bible", type: "cheat-sheet" }
            ],
            estimatedTime: "3 Weeks"
          },
          {
            id: "step-auth-security",
            title: "Authentication & Web Security",
            description: "Secure user sessions with JWT, HttpOnly cookies, OAuth2 (Google/GitHub login), CORS, CSRF, and SQL injection prevention.",
            topics: ["JWT vs Session Tokens", "OAuth 2.0 flow", "Bcrypt password hashing", "OWASP Top 10 Security Basics"],
            resources: [
              { title: "Web Dev Security Checklist", url: "/resources/full-stack-web-dev-notes-2026", type: "doc" }
            ],
            estimatedTime: "1-2 Weeks"
          }
        ]
      },
      {
        id: "phase-4",
        phaseNumber: 4,
        title: "DevOps, Cloud & Production Deployment",
        description: "Containerize your app and deploy it on global edge infrastructure.",
        steps: [
          {
            id: "step-docker-git",
            title: "Git Workflows & Docker Containerization",
            description: "Collaborative Git branching, pull requests, writing production multi-stage Dockerfiles, and local orchestration with docker-compose.",
            topics: ["Git interactive rebase", "Dockerfile optimization", "Docker Compose", "Environment secrets management"],
            resources: [
              { title: "Git, GitHub & Docker Dev Starter Kit", url: "/resources/docker-and-git-starter-kit", type: "cheat-sheet" }
            ],
            estimatedTime: "2 Weeks"
          },
          {
            id: "step-cloud-deployment",
            title: "Vercel, AWS & CI/CD Pipelines",
            description: "Deploy frontend on Vercel/Cloudflare, backend on AWS EC2 or Railway, and automate testing and deployment with GitHub Actions.",
            topics: ["Vercel Edge deployment", "AWS EC2 / S3 setup", "GitHub Actions CI/CD", "Domain configuration & SSL"],
            resources: [
              { title: "DevOps & Cloud Starter Pack", url: "/resources/devops-roadmap-and-tools-bible", type: "cheat-sheet" }
            ],
            estimatedTime: "2 Weeks"
          }
        ]
      }
    ]
  },
  {
    id: "roadmap-dsa",
    slug: "dsa-interview-prep",
    title: "Data Structures & Algorithms (FAANG Ready)",
    tagline: "The step-by-step roadmap to crack tech interviews and college campus placements.",
    description: "Conquer DSA pattern-by-pattern without burning out. Focused on high-frequency questions asked in Google, Microsoft, Amazon, and top startups.",
    badge: "Placement Special",
    duration: "4-5 Months (12 hrs/week)",
    prerequisites: ["Basic knowledge of one language (C++, Java, or Python)"],
    icon: "Binary",
    color: "from-emerald-500 to-teal-600",
    phases: [
      {
        id: "phase-dsa-1",
        phaseNumber: 1,
        title: "Complexity Analysis & Core Data Structures",
        description: "Master Big-O analysis and the fundamental linear data structures.",
        steps: [
          {
            id: "step-complexity",
            title: "Time & Space Complexity (Big-O Decoded)",
            description: "Understand asymptotic notations: Big-O, Omega, and Theta. Master analyzing loops, recursive calls, and memory stack usage.",
            topics: ["Worst, Average, Best cases", "Recursion Tree Method", "Master Theorem", "Space complexity on Stack & Heap"],
            resources: [
              { title: "The Ultimate DSA Decoded Cheatsheet", url: "/resources/ultimate-dsa-cheatsheet-decoded", type: "cheat-sheet" }
            ],
            estimatedTime: "1 Week"
          },
          {
            id: "step-arrays-strings",
            title: "Arrays, Strings & 2-Pointer Technique",
            description: "High-frequency interview techniques: Two Pointers, Sliding Window, Prefix Sum, and Kadane's Algorithm for max subarray.",
            topics: ["Two Pointers (Opposite & Same direction)", "Sliding Window (Fixed & Dynamic)", "Prefix Sum array", "Kadane's Algorithm"],
            resources: [
              { title: "LeetCode 75 Curated Array Problems", url: "https://leetcode.com", type: "practice" }
            ],
            estimatedTime: "2-3 Weeks"
          },
          {
            id: "step-linked-lists",
            title: "Linked Lists & Fast/Slow Pointers",
            description: "Singly and Doubly linked lists, Floyd's Cycle Detection algorithm, reversing a linked list, and merging sorted lists.",
            topics: ["Node pointers manipulation", "Floyd's Tortoise and Hare algorithm", "Reverse linked list (Iterative & Recursive)", "LRU Cache design"],
            resources: [
              { title: "Linked List Interview Templates", url: "/resources/ultimate-dsa-cheatsheet-decoded", type: "doc" }
            ],
            estimatedTime: "2 Weeks"
          }
        ]
      },
      {
        id: "phase-dsa-2",
        phaseNumber: 2,
        title: "Non-Linear Structures: Trees & Graphs",
        description: "The core filter round for most technical campus placements and tier-1 companies.",
        steps: [
          {
            id: "step-binary-trees",
            title: "Binary Trees & Binary Search Trees (BST)",
            description: "Tree traversals (Inorder, Preorder, Postorder, Level Order), Lowest Common Ancestor (LCA), and BST search/insert operations.",
            topics: ["Tree Traversals (DFS vs BFS)", "Diameter & Height of Binary Tree", "BST validation and construction", "Trie (Prefix Tree)"],
            resources: [
              { title: "Binary Trees Visual Guide", url: "/resources/ultimate-dsa-cheatsheet-decoded", type: "cheat-sheet" }
            ],
            estimatedTime: "3 Weeks"
          },
          {
            id: "step-graphs",
            title: "Graph Traversal & Shortest Path Algorithms",
            description: "Adjacency matrix vs Adjacency list, BFS, DFS, Topological Sort (Kahn's Algorithm), and Dijkstra's Shortest Path.",
            topics: ["Graph representations", "Cycle detection in Directed/Undirected graphs", "Topological Sort", "Dijkstra's Algorithm", "Disjoint Set Union (DSU)"],
            resources: [
              { title: "Graph Visual Traversal Templates", url: "/resources/ultimate-dsa-cheatsheet-decoded", type: "doc" }
            ],
            estimatedTime: "3-4 Weeks"
          }
        ]
      },
      {
        id: "phase-dsa-3",
        phaseNumber: 3,
        title: "Advanced: Dynamic Programming & Greedy",
        description: "Turn fear of DP into your biggest interview superpower.",
        steps: [
          {
            id: "step-dp",
            title: "Dynamic Programming (Memoization & Tabulation)",
            description: "Learn to spot overlapping subproblems and optimal substructure. 1D DP, 2D Grid DP, 0/1 Knapsack, and Longest Common Subsequence (LCS).",
            topics: ["Top-down (Memoization) vs Bottom-up (Tabulation)", "1D Fibonacci & House Robber", "0/1 Knapsack variations", "Longest Increasing Subsequence (LIS)", "DP on Stocks"],
            resources: [
              { title: "Mastering Dynamic Programming: The 4-Step Framework", url: "/blog/mastering-dynamic-programming-framework", type: "doc" }
            ],
            estimatedTime: "4 Weeks"
          },
          {
            id: "step-system-design-basics",
            title: "System Design & Mock Coding Rounds",
            description: "Tie it all together with timed mock interviews, explaining code clearly, and answering high-level architecture basics.",
            topics: ["Mock interviews", "Explaining trade-offs out loud", "System Design for Freshers", "Clean code practices"],
            resources: [
              { title: "System Design for Freshers & Placements", url: "/resources/system-design-primer-for-freshers", type: "doc" }
            ],
            estimatedTime: "2 Weeks"
          }
        ]
      }
    ]
  },
  {
    id: "roadmap-data-science",
    slug: "data-science-machine-learning",
    title: "Data Science & Machine Learning Roadmap",
    tagline: "From clean Python scripts to training and deploying modern predictive models.",
    description: "The complete curriculum covering Python, statistical analysis, exploratory data analysis, Scikit-Learn machine learning models, and Generative AI fundamentals.",
    badge: "Future-Proof",
    duration: "6-8 Months (10-15 hrs/week)",
    prerequisites: ["High school mathematics", "Basic understanding of programming logic"],
    icon: "Database",
    color: "from-purple-500 to-indigo-600",
    phases: [
      {
        id: "phase-ds-1",
        phaseNumber: 1,
        title: "Python, Math & Data Wrangling",
        description: "Build an rock-solid foundation in Python libraries, statistics, and exploratory data analysis.",
        steps: [
          {
            id: "step-python-numpy",
            title: "Python, NumPy & Vectorized Computations",
            description: "Learn Python for data manipulation, NumPy arrays, broadcasting rules, matrix dot products, and random sampling.",
            topics: ["NumPy N-dimensional arrays", "Broadcasting", "Matrix operations", "Vectorization performance"],
            resources: [
              { title: "Python for Data Science Decoded Handbook", url: "/resources/python-for-data-science-handbook", type: "cheat-sheet" }
            ],
            estimatedTime: "2-3 Weeks"
          },
          {
            id: "step-pandas-eda",
            title: "Pandas & Exploratory Data Analysis (EDA)",
            description: "DataFrames, Series, filtering, missing value imputation, group-by aggregations, joining datasets, and Matplotlib/Seaborn visualization.",
            topics: ["DataFrame slicing & indexing", "Handling null values", "Pivot tables", "Data distribution plots (Histograms, Boxplots)"],
            resources: [
              { title: "Pandas & NumPy Quick Reference Sheet", url: "/resources/pandas-numpy-interactive-cheatsheet", type: "cheat-sheet" }
            ],
            estimatedTime: "3-4 Weeks"
          },
          {
            id: "step-math-stats",
            title: "Applied Probability & Descriptive Statistics",
            description: "Mean, median, variance, standard deviation, normal distributions, z-score outliers, correlation vs causation, and A/B hypothesis testing.",
            topics: ["Probability distributions", "Central Limit Theorem", "Hypothesis testing & p-values", "Linear Algebra essentials"],
            resources: [
              { title: "Math for Machine Learning Visual Guide", url: "/resources/machine-learning-math-fundamentals", type: "cheat-sheet" }
            ],
            estimatedTime: "3 Weeks"
          }
        ]
      },
      {
        id: "phase-ds-2",
        phaseNumber: 2,
        title: "Core Machine Learning Algorithms",
        description: "Implement supervised and unsupervised machine learning algorithms using Scikit-Learn.",
        steps: [
          {
            id: "step-supervised-learning",
            title: "Supervised Learning: Regression & Classification",
            description: "Linear Regression, Logistic Regression, Decision Trees, Random Forests, Support Vector Machines (SVM), and Gradient Boosting (XGBoost).",
            topics: ["Cost functions & Gradient Descent", "Overfitting vs Underfitting (Bias-Variance tradeoff)", "Ensemble methods (Random Forest, XGBoost)", "Evaluation metrics (Precision, Recall, F1, ROC-AUC)"],
            resources: [
              { title: "Scikit-Learn Official User Guide", url: "https://scikit-learn.org", type: "doc" }
            ],
            estimatedTime: "4-5 Weeks"
          },
          {
            id: "step-unsupervised-learning",
            title: "Unsupervised Learning: Clustering & PCA",
            description: "K-Means clustering, Hierarchical clustering, and Principal Component Analysis (PCA) for dimensionality reduction.",
            topics: ["K-Means Elbow method", "Silhouette score", "PCA mathematical intuition", "Anomaly detection"],
            resources: [
              { title: "ML Math & Intuition Handbook", url: "/resources/machine-learning-math-fundamentals", type: "cheat-sheet" }
            ],
            estimatedTime: "2-3 Weeks"
          }
        ]
      },
      {
        id: "phase-ds-3",
        phaseNumber: 3,
        title: "Deep Learning, LLMs & MLOps Deployment",
        description: "Step into modern AI: Neural Networks, PyTorch, Large Language Models, and deploying models with Streamlit or FastAPI.",
        steps: [
          {
            id: "step-deep-learning",
            title: "Neural Networks & PyTorch Fundamentals",
            description: "Perceptrons, Multi-Layer Perceptrons (MLP), Activation functions (ReLU, Sigmoid, Softmax), Backpropagation, and building neural nets in PyTorch.",
            topics: ["Tensors in PyTorch", "Backpropagation calculus", "Loss functions & Optimizers (Adam, SGD)", "Convolutional Neural Networks (CNN) intro"],
            resources: [
              { title: "PyTorch Deep Learning 60-Minute Blitz", url: "https://pytorch.org", type: "doc" }
            ],
            estimatedTime: "4 Weeks"
          },
          {
            id: "step-llm-genai",
            title: "Modern GenAI & RAG (Retrieval-Augmented Generation)",
            description: "Working with OpenAI/Gemini APIs, vector embeddings (ChromaDB / Pinecone), building practical RAG pipelines with LangChain/LlamaIndex.",
            topics: ["Embeddings & Vector Databases", "Prompt engineering best practices", "RAG architecture", "Fine-tuning vs In-Context Learning"],
            resources: [
              { title: "Production Backend with FastAPI & APIs", url: "/resources/fastapi-and-rest-api-blueprint", type: "video" }
            ],
            estimatedTime: "3 Weeks"
          }
        ]
      }
    ]
  }
];
