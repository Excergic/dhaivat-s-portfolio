// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/dhaivat-s-portfolio/";
    },
  },{id: "nav-case-studies",
          title: "case studies",
          description: "Deep-dives into real-world AI/ML problems — from problem framing to production.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/dhaivat-s-portfolio/case-studies/";
          },
        },{id: "nav-projects",
          title: "projects",
          description: "A growing collection of your cool projects.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/dhaivat-s-portfolio/projects/";
          },
        },{id: "nav-cv",
          title: "CV",
          description: "This is a description of the page. You can modify it in &#39;_pages/cv.md&#39;. You can also change or remove the top pdf download button.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/dhaivat-s-portfolio/cv/";
          },
        },{id: "nav-blogs",
          title: "blogs",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/dhaivat-s-portfolio/blog/";
          },
        },{id: "post-forward-deployed-ai-what-changes-when-the-customer-is-in-the-room",
        
          title: "Forward-Deployed AI: What Changes When the Customer Is in the Room",
        
        description: "Lessons from deploying AI systems directly with enterprise customers — integration challenges, rapid iteration, and making models useful in practice.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/dhaivat-s-portfolio/blog/2025/forward-deployed-ai-playbook/";
          
        },
      },{id: "post-mlops-monitoring-system-design",
        
          title: "MLOps Monitoring System Design",
        
        description: "Design document for a production ML monitoring system — data drift, prediction drift, business KPIs, and alerting architecture.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/dhaivat-s-portfolio/blog/2025/mlops-monitoring-design/";
          
        },
      },{id: "post-production-mlops-for-tabular-data-end-to-end-pipeline",
        
          title: "Production MLOps for Tabular Data: End-to-End Pipeline",
        
        description: "A complete production ML pipeline for tabular data — data validation, feature engineering, training, evaluation, deployment, and monitoring.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/dhaivat-s-portfolio/blog/2025/mlops-tabular-pipeline/";
          
        },
      },{id: "post-a-post-with-plotly-js",
        
          title: "a post with plotly.js",
        
        description: "this is what included plotly.js code could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/dhaivat-s-portfolio/blog/2025/plotly/";
          
        },
      },{id: "post-feature-store-architecture-solving-training-serving-skew",
        
          title: "Feature Store Architecture: Solving Training-Serving Skew",
        
        description: "Why feature stores exist, how to design one that prevents training-serving skew, and the offline/online duality.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/dhaivat-s-portfolio/blog/2025/feature-store-architecture/";
          
        },
      },{id: "post-distributed-ml-inference-design-for-10k-rps",
        
          title: "Distributed ML Inference: Design for 10K RPS",
        
        description: "System design for a low-latency ML inference service — batching, model replicas, circuit breakers, and the P99 latency problem.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/dhaivat-s-portfolio/blog/2025/distributed-ml-inference/";
          
        },
      },{id: "post-tool-use-and-memory-patterns-for-production-agents",
        
          title: "Tool-Use and Memory Patterns for Production Agents",
        
        description: "Practical patterns for tool design, memory management, and state persistence in agents that run in production.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/dhaivat-s-portfolio/blog/2025/tool-use-memory-patterns/";
          
        },
      },{id: "post-autoencoders-compression-representations-and-variational-extensions",
        
          title: "Autoencoders: Compression, Representations, and Variational Extensions",
        
        description: "From vanilla autoencoders to VAEs — learning latent representations without labels, and the reparameterization trick.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/dhaivat-s-portfolio/blog/2025/autoencoders-deep-unsupervised/";
          
        },
      },{id: "post-the-react-pattern-reasoning-and-acting-in-interleaved-loops",
        
          title: "The ReAct Pattern: Reasoning and Acting in Interleaved Loops",
        
        description: "How ReAct works, why the think-act-observe loop is so powerful, and implementation details for robust agents.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/dhaivat-s-portfolio/blog/2025/react-agent-pattern/";
          
        },
      },{id: "post-pca-variance-eigenvectors-and-the-svd-connection",
        
          title: "PCA: Variance, Eigenvectors, and the SVD Connection",
        
        description: "Principal Component Analysis from the ground up — covariance matrix, eigendecomposition, SVD, and when to use it vs. alternatives.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/dhaivat-s-portfolio/blog/2025/pca-dimensionality-reduction/";
          
        },
      },{id: "post-multi-agent-coordination-patterns-that-actually-work",
        
          title: 'Multi-Agent Coordination: Patterns That Actually Work <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "Orchestrator-worker, peer-to-peer, and blackboard patterns for multi-agent systems — with trade-offs and when to use each.",
        section: "Posts",
        handler: () => {
          
            window.open("https://dev.to", "_blank");
          
        },
      },{id: "post-dbscan-density-noise-and-arbitrary-shapes",
        
          title: "DBSCAN: Density, Noise, and Arbitrary Shapes",
        
        description: "How DBSCAN defines clusters via density reachability, handles outliers natively, and the right way to set epsilon and min_samples.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/dhaivat-s-portfolio/blog/2025/dbscan-density-clustering/";
          
        },
      },{id: "post-building-ai-agents-from-scratch-what-the-tutorials-don-39-t-tell-you",
        
          title: 'Building AI Agents From Scratch: What the Tutorials Don&#39;t Tell You <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "The hard lessons from building production agentic systems — tool reliability, prompt engineering for agents, and when NOT to use agents.",
        section: "Posts",
        handler: () => {
          
            window.open("https://dev.to", "_blank");
          
        },
      },{id: "post-k-means-lloyd-39-s-algorithm-initialization-and-when-it-fails",
        
          title: "K-Means: Lloyd&#39;s Algorithm, Initialization, and When It Fails",
        
        description: "The EM view of K-Means, k-means++ initialization, and the cases where K-Means fundamentally breaks down.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/dhaivat-s-portfolio/blog/2025/k-means-clustering/";
          
        },
      },{id: "post-agentic-orchestration-system-design",
        
          title: "Agentic Orchestration System Design",
        
        description: "Architecture document for a production multi-agent orchestration layer — routing, memory, tool dispatch, and failure handling.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/dhaivat-s-portfolio/blog/2025/agentic-orchestration-system-design/";
          
        },
      },{id: "post-decision-trees-and-ensembles-from-cart-to-gradient-boosting",
        
          title: "Decision Trees and Ensembles: From CART to Gradient Boosting",
        
        description: "How trees split, why they overfit, and how bagging and boosting turn weak learners into strong ones.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/dhaivat-s-portfolio/blog/2025/decision-trees-and-ensembles/";
          
        },
      },{id: "post-svms-maximum-margin-kernels-and-the-dual-problem",
        
          title: "SVMs: Maximum Margin, Kernels, and the Dual Problem",
        
        description: "Hard-margin to soft-margin SVMs, the kernel trick, and why the dual formulation is the key to everything.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/dhaivat-s-portfolio/blog/2025/support-vector-machines/";
          
        },
      },{id: "post-logistic-regression-from-odds-to-decision-boundaries",
        
          title: "Logistic Regression: From Odds to Decision Boundaries",
        
        description: "Binary classification via maximum likelihood — deriving the gradient, understanding the sigmoid, and implementing with numpy.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/dhaivat-s-portfolio/blog/2025/logistic-regression-fundamentals/";
          
        },
      },{id: "post-linear-regression-geometry-gradients-and-guarantees",
        
          title: "Linear Regression: Geometry, Gradients, and Guarantees",
        
        description: "A from-scratch derivation of OLS, gradient descent, and the normal equation — with geometric intuition and numpy implementation.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/dhaivat-s-portfolio/blog/2025/linear-regression-deep-dive/";
          
        },
      },{id: "post-a-post-with-image-galleries",
        
          title: "a post with image galleries",
        
        description: "this is what included image galleries could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/dhaivat-s-portfolio/blog/2024/photo-gallery/";
          
        },
      },{id: "post-google-gemini-updates-flash-1-5-gemma-2-and-project-astra",
        
          title: 'Google Gemini updates: Flash 1.5, Gemma 2 and Project Astra <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "We’re sharing updates across our Gemini family of models and a glimpse of Project Astra, our vision for the future of AI assistants.",
        section: "Posts",
        handler: () => {
          
            window.open("https://blog.google/technology/ai/google-gemini-update-flash-ai-assistant-io-2024/", "_blank");
          
        },
      },{id: "post-a-post-with-tabs",
        
          title: "a post with tabs",
        
        description: "this is what included tabs in a post could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/dhaivat-s-portfolio/blog/2024/tabs/";
          
        },
      },{id: "post-a-post-with-typograms",
        
          title: "a post with typograms",
        
        description: "this is what included typograms code could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/dhaivat-s-portfolio/blog/2024/typograms/";
          
        },
      },{id: "post-a-post-that-can-be-cited",
        
          title: "a post that can be cited",
        
        description: "this is what a post that can be cited looks like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/dhaivat-s-portfolio/blog/2024/post-citation/";
          
        },
      },{id: "post-a-post-with-pseudo-code",
        
          title: "a post with pseudo code",
        
        description: "this is what included pseudo code could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/dhaivat-s-portfolio/blog/2024/pseudocode/";
          
        },
      },{id: "post-a-post-with-code-diff",
        
          title: "a post with code diff",
        
        description: "this is how you can display code diffs",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/dhaivat-s-portfolio/blog/2024/code-diff/";
          
        },
      },{id: "post-a-post-with-advanced-image-components",
        
          title: "a post with advanced image components",
        
        description: "this is what advanced image components could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/dhaivat-s-portfolio/blog/2024/advanced-images/";
          
        },
      },{id: "post-a-post-with-vega-lite",
        
          title: "a post with vega lite",
        
        description: "this is what included vega lite code could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/dhaivat-s-portfolio/blog/2024/vega-lite/";
          
        },
      },{id: "post-a-post-with-geojson",
        
          title: "a post with geojson",
        
        description: "this is what included geojson code could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/dhaivat-s-portfolio/blog/2024/geojson-map/";
          
        },
      },{id: "post-a-post-with-echarts",
        
          title: "a post with echarts",
        
        description: "this is what included echarts code could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/dhaivat-s-portfolio/blog/2024/echarts/";
          
        },
      },{id: "post-a-post-with-chart-js",
        
          title: "a post with chart.js",
        
        description: "this is what included chart.js code could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/dhaivat-s-portfolio/blog/2024/chartjs/";
          
        },
      },{id: "post-a-post-with-tikzjax",
        
          title: "a post with TikZJax",
        
        description: "this is what included TikZ code could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/dhaivat-s-portfolio/blog/2023/tikzjax/";
          
        },
      },{id: "post-a-post-with-bibliography",
        
          title: "a post with bibliography",
        
        description: "an example of a blog post with bibliography",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/dhaivat-s-portfolio/blog/2023/post-bibliography/";
          
        },
      },{id: "post-a-post-with-jupyter-notebook",
        
          title: "a post with jupyter notebook",
        
        description: "an example of a blog post with jupyter notebook",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/dhaivat-s-portfolio/blog/2023/jupyter-notebook/";
          
        },
      },{id: "post-a-post-with-custom-blockquotes",
        
          title: "a post with custom blockquotes",
        
        description: "an example of a blog post with custom blockquotes",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/dhaivat-s-portfolio/blog/2023/custom-blockquotes/";
          
        },
      },{id: "post-a-post-with-table-of-contents-on-a-sidebar",
        
          title: "a post with table of contents on a sidebar",
        
        description: "an example of a blog post with table of contents on a sidebar",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/dhaivat-s-portfolio/blog/2023/sidebar-table-of-contents/";
          
        },
      },{id: "post-a-post-with-audios",
        
          title: "a post with audios",
        
        description: "this is what included audios could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/dhaivat-s-portfolio/blog/2023/audios/";
          
        },
      },{id: "post-a-post-with-videos",
        
          title: "a post with videos",
        
        description: "this is what included videos could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/dhaivat-s-portfolio/blog/2023/videos/";
          
        },
      },{id: "post-displaying-beautiful-tables-with-bootstrap-tables",
        
          title: "displaying beautiful tables with Bootstrap Tables",
        
        description: "an example of how to use Bootstrap Tables",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/dhaivat-s-portfolio/blog/2023/tables/";
          
        },
      },{id: "post-a-post-with-table-of-contents",
        
          title: "a post with table of contents",
        
        description: "an example of a blog post with table of contents",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/dhaivat-s-portfolio/blog/2023/table-of-contents/";
          
        },
      },{id: "post-a-post-with-giscus-comments",
        
          title: "a post with giscus comments",
        
        description: "an example of a blog post with giscus comments",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/dhaivat-s-portfolio/blog/2022/giscus-comments/";
          
        },
      },{id: "post-displaying-external-posts-on-your-al-folio-blog",
        
          title: 'Displaying External Posts on Your al-folio Blog <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.open("https://medium.com/@al-folio/displaying-external-posts-on-your-al-folio-blog-b60a1d241a0a?source=rss-17feae71c3c4------2", "_blank");
          
        },
      },{id: "post-a-post-with-redirect",
        
          title: "a post with redirect",
        
        description: "you can also redirect to assets like pdf",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/dhaivat-s-portfolio/assets/pdf/example_pdf.pdf";
          
        },
      },{id: "post-a-post-with-diagrams",
        
          title: "a post with diagrams",
        
        description: "an example of a blog post with diagrams",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/dhaivat-s-portfolio/blog/2021/diagrams/";
          
        },
      },{id: "post-a-distill-style-blog-post",
        
          title: "a distill-style blog post",
        
        description: "an example of a distill-style blog post and main elements",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/dhaivat-s-portfolio/blog/2021/distill/";
          
        },
      },{id: "post-a-post-with-twitter",
        
          title: "a post with twitter",
        
        description: "an example of a blog post with twitter",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/dhaivat-s-portfolio/blog/2020/twitter/";
          
        },
      },{id: "post-a-post-with-disqus-comments",
        
          title: "a post with disqus comments",
        
        description: "an example of a blog post with disqus comments",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/dhaivat-s-portfolio/blog/2015/disqus-comments/";
          
        },
      },{id: "post-a-post-with-math",
        
          title: "a post with math",
        
        description: "an example of a blog post with some math",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/dhaivat-s-portfolio/blog/2015/math/";
          
        },
      },{id: "post-a-post-with-code",
        
          title: "a post with code",
        
        description: "an example of a blog post with some code",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/dhaivat-s-portfolio/blog/2015/code/";
          
        },
      },{id: "post-a-post-with-images",
        
          title: "a post with images",
        
        description: "this is what included images could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/dhaivat-s-portfolio/blog/2015/images/";
          
        },
      },{id: "post-a-post-with-formatting-and-links",
        
          title: "a post with formatting and links",
        
        description: "march &amp; april, looking forward to summer",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/dhaivat-s-portfolio/blog/2015/formatting-and-links/";
          
        },
      },{id: "books-the-godfather",
          title: 'The Godfather',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/dhaivat-s-portfolio/books/the_godfather/";
            },},{id: "news-a-simple-inline-announcement",
          title: 'A simple inline announcement.',
          description: "",
          section: "News",},{id: "news-a-long-announcement-with-details",
          title: 'A long announcement with details',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/dhaivat-s-portfolio/news/announcement_2/";
            },},{id: "news-a-simple-inline-announcement-with-markdown-emoji-sparkles-smile",
          title: 'A simple inline announcement with Markdown emoji! :sparkles: :smile:',
          description: "",
          section: "News",},{id: "projects-project-1",
          title: 'project 1',
          description: "with background image",
          section: "Projects",handler: () => {
              window.location.href = "/dhaivat-s-portfolio/projects/1_project/";
            },},{id: "projects-project-2",
          title: 'project 2',
          description: "a project with a background image and giscus comments",
          section: "Projects",handler: () => {
              window.location.href = "/dhaivat-s-portfolio/projects/2_project/";
            },},{id: "projects-project-3-with-very-long-name",
          title: 'project 3 with very long name',
          description: "a project that redirects to another website",
          section: "Projects",handler: () => {
              window.location.href = "/dhaivat-s-portfolio/projects/3_project/";
            },},{id: "projects-project-4",
          title: 'project 4',
          description: "another without an image",
          section: "Projects",handler: () => {
              window.location.href = "/dhaivat-s-portfolio/projects/4_project/";
            },},{id: "projects-project-5",
          title: 'project 5',
          description: "a project with a background image",
          section: "Projects",handler: () => {
              window.location.href = "/dhaivat-s-portfolio/projects/5_project/";
            },},{id: "projects-project-6",
          title: 'project 6',
          description: "a project with no image",
          section: "Projects",handler: () => {
              window.location.href = "/dhaivat-s-portfolio/projects/6_project/";
            },},{id: "projects-project-7",
          title: 'project 7',
          description: "with background image",
          section: "Projects",handler: () => {
              window.location.href = "/dhaivat-s-portfolio/projects/7_project/";
            },},{id: "projects-project-8",
          title: 'project 8',
          description: "an other project with a background image and giscus comments",
          section: "Projects",handler: () => {
              window.location.href = "/dhaivat-s-portfolio/projects/8_project/";
            },},{id: "projects-project-9",
          title: 'project 9',
          description: "another project with an image 🎉",
          section: "Projects",handler: () => {
              window.location.href = "/dhaivat-s-portfolio/projects/9_project/";
            },},{id: "projects-agentic-orchestration-framework",
          title: 'Agentic Orchestration Framework',
          description: "A production-ready multi-agent orchestration layer with routing, tool dispatch, memory management, and failure recovery.",
          section: "Projects",handler: () => {
              window.location.href = "/dhaivat-s-portfolio/projects/agentic-orchestration/";
            },},{id: "projects-mlops-tabular-pipeline",
          title: 'MLOps Tabular Pipeline',
          description: "End-to-end production ML system for tabular classification — data validation, feature store, model training, deployment, and drift monitoring.",
          section: "Projects",handler: () => {
              window.location.href = "/dhaivat-s-portfolio/projects/mlops-tabular/";
            },},{id: "teachings-data-science-fundamentals",
          title: 'Data Science Fundamentals',
          description: "This course covers the foundational aspects of data science, including data collection, cleaning, analysis, and visualization. Students will learn practical skills for working with real-world datasets.",
          section: "Teachings",handler: () => {
              window.location.href = "/dhaivat-s-portfolio/teachings/data-science-fundamentals/";
            },},{id: "teachings-introduction-to-machine-learning",
          title: 'Introduction to Machine Learning',
          description: "This course provides an introduction to machine learning concepts, algorithms, and applications. Students will learn about supervised and unsupervised learning, model evaluation, and practical implementations.",
          section: "Teachings",handler: () => {
              window.location.href = "/dhaivat-s-portfolio/teachings/introduction-to-machine-learning/";
            },},{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/dhaivat-jambudia", "_blank");
        },
      },{
        id: 'social-x',
        title: 'X',
        section: 'Socials',
        handler: () => {
          window.open("https://twitter.com/dhaivat00", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/Excergic", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
