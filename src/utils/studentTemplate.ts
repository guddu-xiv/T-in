import { AppConfig } from "../types";

export function generateStudentHTML(config: AppConfig, base64Config: string, serverOrigin: string = ""): string {
  const isPrayas = config.themePreset === "prayas";
  const primaryColor = isPrayas ? "#FF5722" : "#009CFC";
  const primaryDark = isPrayas ? "#E05621" : "#0077C8";
  const primaryLight = isPrayas ? "#FFF2EC" : "#EAF7FF";
  const primarySubtle = isPrayas ? "#FFF8F5" : "#F5FBFF";
  const borderColor = isPrayas ? "#FED7C8" : "#D6ECFA";
  const tapActiveBg = isPrayas ? "rgba(255, 87, 34, 0.18)" : "rgba(0, 156, 252, 0.18)";
  const primaryDarkActive = isPrayas ? "#FF7A50" : "#38BDF8";
  const primaryLightActive = isPrayas ? "#2D160E" : "#162B42";
  const primarySubtleActive = isPrayas ? "#1E0F09" : "#122133";
  const tapActiveBgDark = isPrayas ? "rgba(255, 87, 34, 0.25)" : "rgba(0, 156, 252, 0.25)";

  const seo = config.seo || {};
  const social = (config && (config as any).social) || ({} as any);
  const metaTitle = seo.metaTitle || `${config.appName || "Taiyariya"} - Elite MCQ Practice & Mock Test Portal`;
  const metaDescription = seo.metaDescription || `Welcome to ${config.appName || "Taiyariya"}. India's leading digital education center for bilingual MCQ practice, simulated online CBT exam portals, offline Blackbooks, study material PDFs, and deep learning analytics.`;
  const metaKeywords = seo.metaKeywords || "Taiyariya, taiyariya, taiyariya.in, taiyariya.in student, Taiyariya App, Blackbook, ssc mock series, cgl cbt mockup, previous worksheets pdf, online exam testing, learn, test series";
  const canonicalUrl = seo.canonicalUrl || "https://taiyariya.in/";
  const ogImage = seo.ogImage || config.logoUrl || "https://i.ibb.co/GNHYwQv/file-00000000be548211a9ed25bf8420e390.png";
  const author = seo.author || config.appName || "Taiyariya";
  const googleSiteVerification = seo.googleSiteVerification || social.googleVerificationId || "k7WEweulUiwAmqV3D5oVNzLu528Ib-B5VT4s4F2f4";
  const bingSiteVerification = seo.bingSiteVerification || "";
  const schemaBusinessName = seo.schemaBusinessName || config.appName || "Taiyariya";
  const schemaRatingValue = seo.schemaRatingValue || "4.9";
  const schemaReviewCount = seo.schemaReviewCount || "1840";

  // Dynamically generate Course and Quiz schemas for added tests!
  let dynamicQuizSchemas = "";
  try {
    const list: any[] = [];
    if (config.testCategories && Array.isArray(config.testCategories)) {
      config.testCategories.forEach(cat => {
        if (cat.subCategories && Array.isArray(cat.subCategories)) {
          cat.subCategories.forEach(sub => {
            if (sub.topics && Array.isArray(sub.topics)) {
              sub.topics.forEach(topic => {
                if (topic.test) {
                  list.push({
                    "@context": "https://schema.org",
                    "@type": "Quiz",
                    "name": topic.test.title,
                    "description": topic.test.instructions || `Practice online CBT MCQ test on ${topic.name}. Download pdf or attempt interactive questions with feedback.`,
                    "educationalAlignment": {
                      "@type": "AlignmentObject",
                      "alignmentType": "educationalSubject",
                      "targetName": topic.name
                    },
                    "learningResourceType": "Exam",
                    "aggregateRating": {
                      "@type": "AggregateRating",
                      "ratingValue": schemaRatingValue,
                      "reviewCount": schemaReviewCount
                    },
                    "publisher": {
                      "@type": "Organization",
                      "name": schemaBusinessName,
                      "logo": config.logoUrl
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
    if (list.length > 0) {
      dynamicQuizSchemas = list.map(item => `    <script type="application/ld+json">${JSON.stringify(item)}</script>`).join("\n");
    }
  } catch(e){}

  // Dynamically generate Book schemas for PDFs!
  let dynamicBookSchemas = "";
  try {
    const list: any[] = [];
    if (config.pdfCategories && Array.isArray(config.pdfCategories)) {
      config.pdfCategories.forEach(cat => {
        if (cat.subCategories && Array.isArray(cat.subCategories)) {
          cat.subCategories.forEach(sub => {
            if (sub.topics && Array.isArray(sub.topics)) {
              sub.topics.forEach(topic => {
                if (topic.pdf) {
                  list.push({
                    "@context": "https://schema.org",
                    "@type": "CreativeWork",
                    "name": topic.pdf.title,
                    "description": `Download study guide and educational worksheet PDF for ${topic.name}. Prepare effectively.`,
                    "publisher": {
                      "@type": "Organization",
                      "name": schemaBusinessName
                    },
                    "educationalUse": "Study Guide",
                    "aggregateRating": {
                      "@type": "AggregateRating",
                      "ratingValue": schemaRatingValue,
                      "reviewCount": schemaReviewCount
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
    if (list.length > 0) {
      dynamicBookSchemas = list.map(item => `    <script type="application/ld+json">${JSON.stringify(item)}</script>`).join("\n");
    }
  } catch(e){}

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <!-- Zero-Cache Meta Tags: Prevents browser caching on Chrome & Mobile so updates show instantly -->
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Expires" content="0" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>${metaTitle}</title>
    
    ${config.adsense?.enabled && config.adsense?.publisherId ? `
    <!-- Google AdSense API Client Initialization -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${config.adsense.publisherId}" crossorigin="anonymous"></script>
    ` : ''}
    
    <meta name="description" content="${metaDescription}">
    <meta name="keywords" content="${metaKeywords}">
    <meta name="author" content="${author}">
    <meta name="robots" content="index, follow">
    <meta name="google-site-verification" content="${googleSiteVerification}">
    ${bingSiteVerification ? `<meta name="msvalidate.01" content="${bingSiteVerification}">` : ""}
    <link rel="canonical" href="${canonicalUrl}">

    <!-- Favicon and App Logo Metadata for Search Engines & Browsers -->
    <link rel="icon" type="image/svg+xml" href="${config.logoUrl || '/logo.svg'}" />
    <link rel="shortcut icon" href="${config.logoUrl || '/logo.svg'}" type="image/svg+xml" />
    <link rel="apple-touch-icon" href="${config.logoUrl || '/logo.svg'}" />

    <!-- Open Graph (Facebook / WhatsApp / Telegram) -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="${metaTitle}">
    <meta property="og:description" content="${metaDescription}">
    <meta property="og:image" content="${ogImage}">
    <meta property="og:site_name" content="${config.appName || 'Taiyariya'}">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:title" content="${metaTitle}">
    <meta property="twitter:description" content="${metaDescription}">
    <meta property="twitter:image" content="${ogImage}">

    <!-- Schema.org JSON-LD Structured Data for Rich Snippet & Google Sitelinks -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "${schemaBusinessName}",
      "alternateName": "Taiyariya",
      "url": "${canonicalUrl}",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "${canonicalUrl}?search={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
    </script>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Portal Navigation Channels",
      "itemListElement": [
        {
          "@type": "SiteNavigationElement",
          "position": 1,
          "name": "Home",
          "description": "Primary student dashboard highlighting notifications, saved exam prep booklets, and latest board notices.",
          "url": "${canonicalUrl}home"
        },
        {
          "@type": "SiteNavigationElement",
          "position": 2,
          "name": "Tests",
          "description": "Simulate real computer based mock examinations, previous year papers, and performance card analytics.",
          "url": "${canonicalUrl}tests"
        },
        {
          "@type": "SiteNavigationElement",
          "position": 3,
          "name": "PDFs",
          "description": "Read official lesson books, dynamic worksheets, solutions manuals, and complete reference PDF blackbooks offline.",
          "url": "${canonicalUrl}pdfs"
        },
        {
          "@type": "SiteNavigationElement",
          "position": 4,
          "name": "Account",
          "description": "View student profile subscription license, payment transaction receipts, and solved exams history.",
          "url": "${canonicalUrl}account"
        }
      ]
    }
    </script>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": "${schemaBusinessName}",
      "description": "${metaDescription}",
      "logo": "${config.logoUrl || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=300'}",
      "url": "${canonicalUrl}",
      "offers": {
        "@type": "AggregateOffer",
        "priceCurrency": "INR",
        "lowPrice": "0",
        "highPrice": "${social.paymentAmount ? social.paymentAmount.replace(/[^0-9]/g, '') : '499'}"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "${schemaRatingValue}",
        "bestRating": "5",
        "worstRating": "1",
        "ratingCount": "${schemaReviewCount}"
      }
    }
    </script>
    
${dynamicQuizSchemas}
${dynamicBookSchemas}
    
    <!-- Google Fonts Imports: Outfit (English) & Anek Devanagari (Hindi) -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Anek+Devanagari:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Phosphor Icons (Official v2.1.1 Web Fonts) -->
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css">
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/bold/style.css">
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/fill/style.css">
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/duotone/style.css">
    <script src="https://unpkg.com/@phosphor-icons/web@2.1.1"></script>

    <!-- MathJax Configuration & Script for beautiful math typesetting -->
    <script>
    window.MathJax = {
      tex: {
        inlineMath: [['\\\\(', '\\\\)'], ['$', '$']],
        displayMath: [['\\\\[', '\\\\]'], ['$$', '$$']],
        processEscapes: true,
        processEnvironments: true
      },
      options: {
        skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code']
      }
    };
    </script>
    <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>

    <style>
        :root {
            --primary: ${primaryColor};
            --primary-dark: ${primaryDark};
            --primary-light: ${primaryLight};
            --primary-subtle: ${primarySubtle};
            --dark: #172B3A;
            --dark-blue: ${primaryDark};
            --light-grey: #FFFFFF;
            --section-bg: ${primaryLight};
            --hover-bg: ${primarySubtle};
            --border-color: ${borderColor};
            --green: #2ecc71;
            --blue: ${primaryColor};
            --grey-text: #667788;
            --main-text: #172B3A;
            --tap-active-bg: ${tapActiveBg};
        }

        /* Fluid, Butter-Smooth Transitions for premium tap effects on all interactive elements */
        button,
        .outline-item-card,
        .option-button,
        .bottom-nav-item,
        .header-action-btn,
        .back-nav-btn,
        .category-card,
        .accordion-header,
        .opt-box,
        .notif-card,
        .notif-banner,
        .analysis-opt-box,
        .bottom-item,
        .social-link-btn,
        .library-card,
        .review-badge-btn,
        .btn-fill-prime,
        .drawer-sheet {
            transition: background-color 0.22s cubic-bezier(0.4, 0, 0.2, 1),
                        border-color 0.22s cubic-bezier(0.4, 0, 0.2, 1),
                        color 0.22s cubic-bezier(0.4, 0, 0.2, 1),
                        box-shadow 0.22s cubic-bezier(0.4, 0, 0.2, 1),
                        transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
        }

        /* Seamless Active Tap Color Effect - works beautifully in both Days and Night modes */
        button:active,
        .outline-item-card:active,
        .option-button:active,
        .bottom-nav-item:active,
        .header-action-btn:active,
        .back-nav-btn:active,
        .category-card:active,
        .accordion-header:active,
        .opt-box:active,
        .notif-card:active,
        .notif-banner:active,
        .analysis-opt-box:active,
        .bottom-item:active,
        .social-link-btn:active,
        .library-card:active,
        .review-badge-btn:active,
        .btn-fill-prime:active,
        #themeToggleBtn:active,
        #bellIconBtn:active {
            background-color: var(--tap-active-bg) !important;
            border-color: var(--primary) !important;
            box-shadow: 0 4px 14px rgba(0, 156, 252, 0.2) !important;
            transform: scale(0.96) !important;
            opacity: 0.95 !important;
        }

        /* High Contrast Guarantee: White text on primary blue buttons and cards */
        [style*="background: var(--primary)"],
        [style*="background:var(--primary)"],
        [style*="background: #009CFC"],
        [style*="background:#009CFC"],
        [style*="background: #009cfc"],
        [style*="background:#009cfc"],
        [style*="background: #0077C8"],
        [style*="background:#0077C8"] {
            color: #FFFFFF !important;
        }

        /* Dark Mode Theme Overrides */
        body.dark-mode {
            background-color: #0B131E !important;
            color: #F0F6FC !important;
        }
        
        .dark-mode {
            --dark: #F0F6FC;
            --primary: ${primaryColor};
            --primary-dark: ${primaryDarkActive};
            --primary-light: ${primaryLightActive};
            --primary-subtle: ${primarySubtleActive};
            --light-grey: #121F2F;
            --section-bg: #0F1B2B;
            --hover-bg: #182A3E;
            --border-color: rgba(255, 255, 255, 0.1);
            --grey-text: #94A9BE;
            --main-text: #F0F6FC;
            --tap-active-bg: ${tapActiveBgDark};
            background-color: #0B131E !important;
            color: #F0F6FC !important;
        }

        /* Target inline text colors and automatically brighten them in dark-mode */
        .dark-mode [style*="color: #1e293b"],
        .dark-mode [style*="color:#1e293b"],
        .dark-mode [style*="color: #475569"],
        .dark-mode [style*="color:#475569"],
        .dark-mode [style*="color: #334155"],
        .dark-mode [style*="color:#334155"],
        .dark-mode [style*="color: #0f172a"],
        .dark-mode [style*="color:#0f172a"],
        .dark-mode [style*="color: #64748b"],
        .dark-mode [style*="color:#64748b"],
        .dark-mode [style*="color: #57606f"],
        .dark-mode [style*="color:#57606f"] {
            color: #f1f5f9 !important;
        }

        .dark-mode [style*="color: #b45309"],
        .dark-mode [style*="color:#b45309"] {
            color: #fbbf24 !important;
        }

        /* Dynamic Theme and Visibility Guardians for specific inline styles in dark-mode */
        .dark-mode div[style*="background: #ffffff"]:not(.app-logo):not(#displayPayQrImage),
        .dark-mode div[style*="background:#ffffff"]:not(.app-logo):not(#displayPayQrImage),
        .dark-mode div[style*="background: #fff"]:not(.app-logo):not(#displayPayQrImage),
        .dark-mode div[style*="background:#fff"]:not(.app-logo):not(#displayPayQrImage),
        .dark-mode div[style*="background-color: #ffffff"]:not(.app-logo):not(#displayPayQrImage),
        .dark-mode div[style*="background-color:#ffffff"]:not(.app-logo):not(#displayPayQrImage),
        .dark-mode div[style*="background-color: #fff"]:not(.app-logo):not(#displayPayQrImage),
        .dark-mode div[style*="background-color:#fff"]:not(.app-logo):not(#displayPayQrImage) {
            background-color: #121F2F !important;
            background: #121F2F !important;
            color: #F0F6FC !important;
            border-color: rgba(255, 255, 255, 0.09) !important;
        }

        .dark-mode div[style*="background: #f8fafc"],
        .dark-mode div[style*="background:#f8fafc"],
        .dark-mode div[style*="background-color: #f8fafc"],
        .dark-mode div[style*="background-color:#f8fafc"],
        .dark-mode div[style*="background: #f1f5f9"],
        .dark-mode div[style*="background:#f1f5f9"],
        .dark-mode div[style*="background-color: #f1f5f9"],
        .dark-mode div[style*="background-color:#f1f5f9"],
        .dark-mode div[style*="background: #eef1f6"],
        .dark-mode div[style*="background:#eef1f6"],
        .dark-mode div[style*="background: #fafafa"],
        .dark-mode div[style*="background:#fafafa"],
        .dark-mode div[style*="background: #EAF7FF"],
        .dark-mode div[style*="background:#EAF7FF"],
        .dark-mode div[style*="background: #F5FBFF"],
        .dark-mode div[style*="background:#F5FBFF"] {
            background-color: #162638 !important;
            background: #162638 !important;
            color: #F0F6FC !important;
            border-color: rgba(255, 255, 255, 0.09) !important;
        }

        .dark-mode div[style*="background: #fffbeb"],
        .dark-mode div[style*="background:#fffbeb"],
        .dark-mode div[style*="background: #fffde7"],
        .dark-mode div[style*="background:#fffde7"],
        .dark-mode div[style*="background: #fef3c7"],
        .dark-mode div[style*="background:#fef3c7"] {
            background-color: #261f12 !important;
            background: #261f12 !important;
            color: #fbbf24 !important;
            border-color: #b45309 !important;
        }

        .dark-mode div[style*="background: #e1f5fe"],
        .dark-mode div[style*="background:#e1f5fe"],
        .dark-mode div[style*="background: #e0f2fe"],
        .dark-mode div[style*="background:#e0f2fe"] {
            background-color: #0d2744 !important;
            background: #0d2744 !important;
            color: #7dd3fc !important;
            border-color: #0284c7 !important;
        }

        .dark-mode div[style*="background: #f1f2f6"],
        .dark-mode div[style*="background:#f1f2f6"] {
            background-color: #162638 !important;
            background: #162638 !important;
            color: #F0F6FC !important;
            border-color: rgba(255, 255, 255, 0.09) !important;
        }

        .dark-mode div[style*="background: #fef2f2"],
        .dark-mode div[style*="background:#fef2f2"],
        .dark-mode div[style*="background: #fee2e2"],
        .dark-mode div[style*="background:#fee2e2"] {
            background-color: #441c1c !important;
            background: #441c1c !important;
            color: #fca5a5 !important;
            border-color: #ef4444 !important;
        }

        /* Button adaptive overrides in dark mode */
        .dark-mode button {
            background-color: #162638 !important;
            color: #ffffff !important;
            border-color: rgba(255, 255, 255, 0.12) !important;
        }
        
        .dark-mode button.btn-fill-prime,
        .dark-mode .btn-fill-prime,
        .dark-mode button[style*="background: var(--primary)"],
        .dark-mode button[style*="background:var(--primary)"],
        .dark-mode button[style*="background: #009CFC"],
        .dark-mode button[style*="background:#009CFC"],
        .dark-mode button[style*="background: #0077C8"],
        .dark-mode button[style*="background:#0077C8"] {
            background-color: #009CFC !important;
            background: #009CFC !important;
            color: #FFFFFF !important;
            border-color: #009CFC !important;
        }

        /* Comprehensive Day/Night Visibility Guardians */
        .dark-mode body,
        .dark-mode .screen,
        .dark-mode .drawer-sheet,
        .dark-mode .modal-box,
        .dark-mode .custom-dialog {
            background-color: #0B131E !important;
            color: #F0F6FC !important;
        }

        .dark-mode h1,
        .dark-mode h2,
        .dark-mode h3,
        .dark-mode h4,
        .dark-mode h5,
        .dark-mode h6,
        .dark-mode strong {
            color: #ffffff !important;
        }

        .dark-mode p,
        .dark-mode span,
        .dark-mode label,
        .dark-mode li {
            color: #F0F6FC !important;
        }

        /* Ensure modal boxes and overlay children are perfectly legible in dark mode */
        .dark-mode #websitePopupOverlayModal h1, .dark-mode #websitePopupOverlayModal h2, .dark-mode #websitePopupOverlayModal h3, .dark-mode #websitePopupOverlayModal h4, .dark-mode #websitePopupOverlayModal p, .dark-mode #websitePopupOverlayModal span,
        .dark-mode #paymentSuccessPopupModal h1, .dark-mode #paymentSuccessPopupModal h2, .dark-mode #paymentSuccessPopupModal h3, .dark-mode #paymentSuccessPopupModal h4, .dark-mode #paymentSuccessPopupModal p, .dark-mode #paymentSuccessPopupModal span,
        .dark-mode #premiumBlockerModal h1, .dark-mode #premiumBlockerModal h2, .dark-mode #premiumBlockerModal h3, .dark-mode #premiumBlockerModal h4, .dark-mode #premiumBlockerModal p, .dark-mode #premiumBlockerModal span,
        .dark-mode #testPauseResumeModal h1, .dark-mode #testPauseResumeModal h2, .dark-mode #testPauseResumeModal h3, .dark-mode #testPauseResumeModal h4, .dark-mode #testPauseResumeModal p, .dark-mode #testPauseResumeModal span,
        .dark-mode #submitConfirmModal h1, .dark-mode #submitConfirmModal h2, .dark-mode #submitConfirmModal h3, .dark-mode #submitConfirmModal h4, .dark-mode #submitConfirmModal p, .dark-mode #submitConfirmModal span,
        .dark-mode #reportQuestionModal h1, .dark-mode #reportQuestionModal h2, .dark-mode #reportQuestionModal h3, .dark-mode #reportQuestionModal h4, .dark-mode #reportQuestionModal p, .dark-mode #reportQuestionModal span,
        .dark-mode #paymentSuccessModal h1, .dark-mode #paymentSuccessModal h2, .dark-mode #paymentSuccessModal h3, .dark-mode #paymentSuccessModal h4, .dark-mode #paymentSuccessModal p, .dark-mode #paymentSuccessModal span,
        .dark-mode #scr-pay h1, .dark-mode #scr-pay h2, .dark-mode #scr-pay h3, .dark-mode #scr-pay h4, .dark-mode #scr-pay p, .dark-mode #scr-pay span, .dark-mode #scr-pay label {
            color: #ffffff !important;
        }

        /* Keep indicator colors clean and properly legible on dark mode backgrounds */
        .dark-mode .text-green,
        .dark-mode [style*="color: #22c55e"],
        .dark-mode [style*="color:#22c55e"],
        .dark-mode [style*="color: green"],
        .dark-mode [style*="color: rgb(34, 197, 94)"] {
            color: #2ecc71 !important;
        }
        .dark-mode .text-red,
        .dark-mode [style*="color: #ef4444"],
        .dark-mode [style*="color:#ef4444"],
        .dark-mode [style*="color: red"],
        .dark-mode [style*="color: rgb(239, 68, 68)"] {
            color: #f87171 !important;
        }
        .dark-mode .text-blue,
        .dark-mode [style*="color: #3b82f6"],
        .dark-mode [style*="color:#3b82f6"],
        .dark-mode [style*="color: blue"],
        .dark-mode [style*="color: rgb(59, 130, 246)"] {
            color: #009CFC !important;
        }
        .dark-mode .text-purple,
        .dark-mode [style*="color: #a855f7"],
        .dark-mode [style*="color:#a855f7"],
        .dark-mode [style*="color: rgb(168, 85, 247)"] {
            color: #c084fc !important;
        }
        .dark-mode .text-yellow,
        .dark-mode [style*="color: #eab308"],
        .dark-mode [style*="color:#eab308"],
        .dark-mode [style*="color: rgb(234, 179, 8)"] {
            color: #fde047 !important;
        }

        .dark-mode .grey-text,
        .dark-mode [style*="color: rgba(255,255,255,0.5)"],
        .dark-mode [style*="color:rgba(255,255,255,0.5)"],
        .dark-mode [style*="color: rgba(0,0,0,0.5)"],
        .dark-mode [style*="color:rgba(0,0,0,0.5)"] {
            color: #94A9BE !important;
        }

        /* Input and form controls proper visibility */
        .dark-mode .form-input,
        .dark-mode input,
        .dark-mode select,
        .dark-mode textarea {
            background-color: #121F2F !important;
            color: #ffffff !important;
            border: 1px solid #1E344B !important;
        }

        .dark-mode .form-input::placeholder,
        .dark-mode input::placeholder,
        .dark-mode textarea::placeholder {
            color: #667788 !important;
        }
        
        .dark-mode .header, .dark-mode .mainHeader {
            background: rgba(18, 31, 47, 0.95) !important;
            border: 1px solid #1E344B !important;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4) !important;
        }

        .dark-mode .greet-title, .dark-mode .greet-sub {
            color: #ffffff !important;
        }

        .dark-mode .back-nav-bar {
            background: rgba(18, 31, 47, 0.95) !important;
            border: 1px solid #1E344B !important;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4) !important;
        }

        .dark-mode .category-card, .dark-mode .accordion-item, .dark-mode .faq-item, .dark-mode .block-card, .dark-mode .notif-card {
            background-color: #121F2F !important;
            border: 1px solid #1E344B !important;
            color: #ffffff !important;
        }

        .dark-mode .section-header h3, .dark-mode .section-header p, .dark-mode .section-title, .dark-mode .category-title {
            color: #ffffff !important;
        }

        .dark-mode select, .dark-mode input, .dark-mode textarea {
            background-color: #121F2F !important;
            border: 1px solid #1E344B !important;
            color: #ffffff !important;
        }

        .dark-mode td, .dark-mode th {
            border-bottom: 1px solid #1E344B !important;
            color: #ffffff !important;
        }

        .dark-mode tr {
            background-color: transparent !important;
        }

        .dark-mode #mainFooter, .dark-mode .footer {
            background-color: #121F2F !important;
            border-top: 1px solid #1E344B !important;
        }

        .dark-mode .app-logo,
        body.dark-mode .app-logo,
        .dark-mode #testEngineLogo,
        body.dark-mode #testEngineLogo {
            background-color: transparent !important;
            background: transparent !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            filter: drop-shadow(0 0 1.5px rgba(255, 255, 255, 0.95)) drop-shadow(0 0 4px rgba(255, 255, 255, 0.7)) drop-shadow(0 0 10px rgba(0, 156, 252, 0.4)) !important;
            -webkit-filter: drop-shadow(0 0 1.5px rgba(255, 255, 255, 0.95)) drop-shadow(0 0 4px rgba(255, 255, 255, 0.7)) drop-shadow(0 0 10px rgba(0, 156, 252, 0.4)) !important;
        }

        .dark-mode .qr-image-frame,
        .dark-mode #displayPayQrImage {
            background-color: #ffffff !important;
            background: #ffffff !important;
            border-color: #ededed !important;
            padding: 5px !important;
        }

        .dark-mode .bottom-nav-bar {
            background: rgba(18, 31, 47, 0.95) !important;
            border: 1px solid #1E344B !important;
            box-shadow: 0 12px 35px rgba(0, 0, 0, 0.4), 0 4px 12px rgba(0, 0, 0, 0.2) !important;
        }

        .dark-mode .bottom-nav-item {
            color: #94A9BE;
        }

        .dark-mode .bottom-nav-item.active {
            background: rgba(0, 156, 252, 0.2) !important;
            color: #009CFC !important;
        }

        .dark-mode .info-bullets {
            background: #121F2F !important;
            border-color: #1E344B !important;
            color: #F0F6FC !important;
        }

        .dark-mode #couponEntrySection {
            background: #102338 !important;
            border-color: #0284c7 !important;
            color: #7dd3fc !important;
        }

        .dark-mode .btn-fill-prime,
        .dark-mode button[style*="background: var(--dark)"],
        .dark-mode button[style*="background:var(--dark)"] {
            background-color: #009CFC !important;
            background: #009CFC !important;
            color: #FFFFFF !important;
        }

        .dark-mode .scorecard-block {
            background: linear-gradient(135deg, #121F2F 0%, #0B131E 100%) !important;
            border: 1px solid #1E344B !important;
            color: #ffffff !important;
        }

        .dark-mode #scr-pay div[style*="linear-gradient"] {
            background: linear-gradient(135deg, #121F2F 0%, #0B131E 100%) !important;
        }

        .dark-mode div[style*="background: #fef2f2"] {
            background: #4c1d1d !important;
            border-color: #ef4444 !important;
            color: #fca5a5 !important;
        }
        .dark-mode div[style*="background: #fef2f2"] p {
            color: #fca5a5 !important;
        }

        .dark-mode .outline-item-card,
        .dark-mode .library-card,
        .dark-mode .social-link-btn,
        .dark-mode .review-badge-btn,
        .dark-mode .bookmark-group-card,
        .dark-mode .palette-cell,
        .dark-mode .drawer-sheet,
        .dark-mode #analysisDetailViewerCard,
        .dark-mode .analysis-detail-modal {
            background-color: #121F2F !important;
            background: #121F2F !important;
            color: #F0F6FC !important;
            border-color: #1E344B !important;
        }

        .dark-mode #test-engine-panel {
            background-color: #0B131E !important;
            color: #ffffff !important;
        }

        .dark-mode .engine-header, 
        .dark-mode .engine-footer {
            background: rgba(18, 31, 47, 0.95) !important;
            border: 1.5px solid rgba(255, 255, 255, 0.09) !important;
            box-shadow: 0 12px 35px rgba(0, 0, 0, 0.4), 0 4px 12px rgba(0, 0, 0, 0.2) !important;
            color: #ffffff !important;
        }

        .dark-mode #testEngineName,
        .dark-mode .engine-title-group,
        .dark-mode .engine-title-group h5,
        .dark-mode .engine-title-group div {
            color: #ffffff !important;
        }

        .dark-mode #test-engine-panel h1,
        .dark-mode #test-engine-panel h2,
        .dark-mode #test-engine-panel h3,
        .dark-mode #test-engine-panel h4,
        .dark-mode #test-engine-panel h5,
        .dark-mode #test-engine-panel h6,
        .dark-mode #test-engine-panel p,
        .dark-mode #test-engine-panel div,
        .dark-mode #test-engine-panel span,
        .dark-mode #test-engine-panel label {
            color: #ffffff !important;
        }

        /* Instructions Screen and Bullet items styling in dark mode */
        .dark-mode #scr-instructions,
        .dark-mode #scr-instructions h2,
        .dark-mode #scr-instructions .info-bullets,
        .dark-mode #scr-instructions .inst-item,
        .dark-mode #scr-instructions .inst-item div,
        .dark-mode #scr-instructions .inst-item strong,
        .dark-mode #scr-instructions .inst-item span {
            color: #ffffff !important;
        }

        .dark-mode #scr-instructions .inst-item p {
            color: #94A9BE !important;
        }

        .dark-mode #test-engine-panel #testTimerText {
            color: var(--primary) !important;
        }

        .dark-mode .engine-btn-nav {
            background-color: #162638 !important;
            background: #162638 !important;
            color: #ffffff !important;
            border-color: #1E344B !important;
        }

        .dark-mode .review-badge-btn {
            background-color: #162638 !important;
            background: #162638 !important;
            color: #ffffff !important;
            border-color: #1E344B !important;
        }

        .dark-mode .option-button {
            background: #121F2F !important;
            border-color: #1E344B !important;
            color: #F0F6FC !important;
        }

        .dark-mode .option-button:hover {
            background: #182A3E !important;
        }

        .dark-mode .option-button.selected {
            background: rgba(0, 156, 252, 0.2) !important;
            border-color: var(--primary) !important;
            color: #ffffff !important;
        }

        .dark-mode .analysis-explanation-box {
            background: #121F2F !important;
            border: 1.5px solid #1E344B !important;
            border-left: 4px solid var(--primary) !important;
            color: #F0F6FC !important;
            font-weight: 400 !important;
        }

        .dark-mode .analysis-explanation-content {
            color: #F0F6FC !important;
            font-weight: 400 !important;
        }

        .dark-mode .analysis-question-box {
            background: #121F2F !important;
            border: 1px solid #1E344B !important;
            color: #F0F6FC !important;
            font-weight: 400 !important;
        }

        .dark-mode .analysis-opt-box {
            background: #121F2F !important;
            border-color: #1E344B !important;
            color: #F0F6FC !important;
            font-weight: 400 !important;
        }

        .dark-mode .analysis-opt-a,
        .dark-mode .analysis-opt-b,
        .dark-mode .analysis-opt-c,
        .dark-mode .analysis-opt-d,
        .dark-mode .analysis-opt-e {
            background-color: #121F2F !important;
            border-color: #1E344B !important;
            color: #F0F6FC !important;
            font-weight: 400 !important;
        }

        .dark-mode .analysis-opt-box.correct {
            border-color: #22c55e !important;
            background-color: rgba(34, 197, 94, 0.15) !important;
            color: #4ade80 !important;
        }

        .dark-mode .analysis-opt-box.wrong {
            border-color: #ef4444 !important;
            background-color: rgba(239, 68, 68, 0.15) !important;
            color: #f87171 !important;
        }

        .dark-mode .option-analysis-expandable-box {
            background-color: #0F1A28 !important;
            border: 1.5px solid #1E344B !important;
            border-left: 3.5px solid #38bdf8 !important;
            color: #cbd5e1 !important;
            font-weight: 400 !important;
        }

        .dark-mode .oa-box-a,
        .dark-mode .oa-box-b,
        .dark-mode .oa-box-c,
        .dark-mode .oa-box-d,
        .dark-mode .oa-box-e {
            background-color: #0F1A28 !important;
            border: 1.5px solid #1E344B !important;
            border-left: 3.5px solid #38bdf8 !important;
            color: #cbd5e1 !important;
            font-weight: 400 !important;
        }

        .dark-mode .oa-box-correct {
            background-color: rgba(34, 197, 94, 0.12) !important;
            border: 1.5px solid rgba(34, 197, 94, 0.35) !important;
            border-left: 3.5px solid #22c55e !important;
            color: #4ade80 !important;
        }

        .dark-mode .oa-box-wrong {
            background-color: rgba(239, 68, 68, 0.12) !important;
            border: 1.5px solid rgba(239, 68, 68, 0.35) !important;
            border-left: 3.5px solid #ef4444 !important;
            color: #f87171 !important;
        }

        .dark-mode .analysis-source-box {
            background: rgba(245, 158, 11, 0.12) !important;
            border-left: 3.5px solid #f59e0b !important;
            color: #fbbf24 !important;
            font-weight: 400 !important;
        }

        .dark-mode .engine-question-source {
            background: #102338 !important;
            border-left: 4px solid #009CFC !important;
            color: #7dd3fc !important;
        }

        .dark-mode [style*="background: white"]:not(img),
        .dark-mode [style*="background:white"]:not(img),
        .dark-mode [style*="background: #ffffff"]:not(img),
        .dark-mode [style*="background:#ffffff"]:not(img),
        .dark-mode [style*="background: #fff"]:not(img),
        .dark-mode [style*="background:#fff"]:not(img),
        .dark-mode [style*="background-color: white"]:not(img),
        .dark-mode [style*="background-color:white"]:not(img),
        .dark-mode [style*="background-color: #ffffff"]:not(img),
        .dark-mode [style*="background-color:#ffffff"]:not(img),
        .dark-mode [style*="background-color: #fff"]:not(img),
        .dark-mode [style*="background-color:#fff"]:not(img),
        .dark-mode [style*="background: rgb(255, 255, 255)"]:not(img),
        .dark-mode [style*="background:rgb(255, 255, 255)"]:not(img),
        .dark-mode [style*="background-color: rgb(255, 255, 255)"]:not(img),
        .dark-mode [style*="background-color:rgb(255, 255, 255)"]:not(img) {
            background-color: #121F2F !important;
            background: #121F2F !important;
            color: #F0F6FC !important;
            border-color: #1E344B !important;
        }

        .dark-mode img#displayPayQrImage {
            background: #ffffff !important;
            border-color: #ffffff !important;
            padding: 5px !important;
        }

        .dark-mode div[style*="background: rgb(0, 0, 0)"],
        .dark-mode div[style*="background:rgb(0, 0, 0)"],
        .dark-mode div[style*="background: black"],
        .dark-mode div[style*="background:black"] {
            background-color: #000000 !important;
        }

        .dark-mode #websitePopupOverlayModal > div,
        .dark-mode #paymentSuccessPopupModal > div,
        .dark-mode #premiumBlockerModal > div,
        .dark-mode #testPauseResumeModal > div,
        .dark-mode #submitConfirmModal > div,
        .dark-mode #reportQuestionModal > div,
        .dark-mode #paymentSuccessModal > div,
        .dark-mode #scr-pay > div {
            background-color: #121F2F !important;
            background: #121F2F !important;
            color: #F0F6FC !important;
            border: 1px solid #1E344B !important;
        }

        .dark-mode #scr-pay h2,
        .dark-mode #scr-pay #pay-screen-title,
        .dark-mode #scr-pay #summaryStudentName,
        .dark-mode #scr-pay #summaryStudentPhone,
        .dark-mode #scr-pay #summaryUTR,
        .dark-mode #scr-pay #summaryPlanName {
            color: #f8fafc !important;
        }

        .dark-mode #scr-pay #payStepperProgressLine {
            background: #334155 !important;
        }

        .dark-mode #scr-pay #stepCircle2,
        .dark-mode #scr-pay #stepCircle3 {
            background: #1e293b !important;
            color: #94a3b8 !important;
            border-color: #334155 !important;
        }

        .dark-mode #scr-pay div[style*="background: #f8fafc"],
        .dark-mode #scr-pay div[style*="background:#f8fafc"] {
            background: #1e293b !important;
            border-color: #334155 !important;
        }

        .dark-mode #scr-pay div[style*="background: #eff6ff"],
        .dark-mode #scr-pay div[style*="background:#eff6ff"] {
            background: #172554 !important;
            border-color: #1e40af !important;
            color: #93c5fd !important;
        }

        .dark-mode #scr-pay div[style*="background: linear-gradient(135deg, #fffbeb"],
        .dark-mode #scr-pay div[style*="background:linear-gradient(135deg, #fffbeb"] {
            background: linear-gradient(135deg, #2d1c0c 0%, #201a12 100%) !important;
            border-color: #d97706 !important;
        }

        .dark-mode #scr-pay div[style*="background: linear-gradient(135deg, #fffbeb"] h3,
        .dark-mode #scr-pay div[style*="background:linear-gradient(135deg, #fffbeb"] h3 {
            color: #fef08a !important;
        }

        .dark-mode #scr-pay div[style*="background: linear-gradient(135deg, #fffbeb"] p,
        .dark-mode #scr-pay div[style*="background:linear-gradient(135deg, #fffbeb"] p {
            color: #fde047 !important;
        }

        .dark-mode #scr-pay div[style*="background: rgba(37, 211, 102, 0.08)"],
        .dark-mode #scr-pay div[style*="background:rgba(37, 211, 102, 0.08)"] {
            background: rgba(34, 197, 94, 0.12) !important;
            border-color: rgba(34, 197, 94, 0.3) !important;
        }

        .dark-mode #scr-pay div[style*="background: rgba(37, 211, 102, 0.08)"] p,
        .dark-mode #scr-pay div[style*="background:rgba(37, 211, 102, 0.08)"] p {
            color: #86efac !important;
        }

        @keyframes payFadeIn {
            from { opacity: 0; transform: translateY(6px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .dark-mode #unifiedPaidBtn.unticked {
            background: #1e293b !important;
            border-color: #334155 !important;
        }

        .dark-mode #unifiedPaidBtn.unticked #unifiedPaidText {
            color: #f8fafc !important;
        }

        .dark-mode #unifiedPaidBtn.unticked #unifiedPaidHintText {
            color: #94a3b8 !important;
        }

        .dark-mode div[style*="background: #fffbeb"],
        .dark-mode div[style*="background:#fffbeb"] {
            background: #201a12 !important;
            color: #fbbf24 !important;
            border-color: #b45309 !important;
        }

        .dark-mode #leaderboardRankAlertBar,
        .dark-mode div[style*="background: #fef3c7"],
        .dark-mode div[style*="background:#fef3c7"] {
            background: #2d1c0c !important;
            color: #fbbf24 !important;
            border-color: #d97706 !important;
        }

        /* Language font support - ensuring Hindi uses Anek Devanagari and English uses Outfit */
        .lang-hi:not(i):not([class*="ph-"]):not([class*="ph "]) {
            font-family: 'Anek Devanagari', 'Anek Devnagari', sans-serif !important;
        }

        .lang-en:not(i):not([class*="ph-"]):not([class*="ph "]) {
            font-family: 'Outfit', 'Anek Devanagari', 'Anek Devnagari', sans-serif !important;
        }

        .font-hindi, [data-font="hi"] {
            font-family: 'Anek Devanagari', 'Anek Devnagari', sans-serif !important;
        }
        .font-english, [data-font="en"] {
            font-family: 'Outfit', sans-serif !important;
        }

        /* Anti-Piracy styles */
        @media print {
            body { display: none !important; }
        }
        * {
            box-sizing: border-box;
            -webkit-tap-highlight-color: transparent;
            outline: none;
            user-select: none;
            -webkit-user-select: none;
        }

        button, input, textarea, select {
            font-family: inherit;
        }

        body {
            margin: 0;
            background-color: #ffffff;
            color: var(--dark);
            font-family: 'Outfit', 'Anek Devanagari', 'Anek Devnagari', sans-serif;
            font-weight: 400;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            overflow-x: hidden;
            position: relative;
        }

        h1, h2, h3, h4, h5, h6 {
            font-weight: 600;
        }

        /* Comprehensive Phosphor icons font-family protection */
        i.ph, i.ph-regular, [class^="ph "], [class*=" ph "] {
            font-family: "Phosphor", "Phosphor-Regular" !important;
        }
        i.ph-bold, [class^="ph-bold"], [class*=" ph-bold"] {
            font-family: "Phosphor-Bold", "Phosphor" !important;
        }
        i.ph-fill, [class^="ph-fill"], [class*=" ph-fill"] {
            font-family: "Phosphor-Fill", "Phosphor" !important;
        }
        i.ph-duotone, [class^="ph-duotone"], [class*=" ph-duotone"] {
            font-family: "Phosphor-Duotone", "Phosphor" !important;
        }
        i.ph-light, [class^="ph-light"], [class*=" ph-light"] {
            font-family: "Phosphor-Light", "Phosphor" !important;
        }
        i.ph-thin, [class^="ph-thin"], [class*=" ph-thin"] {
            font-family: "Phosphor-Thin", "Phosphor" !important;
        }
        i[class*="ph-"], i[class*="ph "], span[class*="ph-"], span[class*="ph "] {
            font-style: normal !important;
            font-variant: normal !important;
            text-transform: none !important;
            speak: none;
            line-height: 1 !important;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            vertical-align: middle !important;
        }

        /* Screen state controls */
        .screen {
            display: none;
            padding: 20px;
            padding-bottom: 100px;
            max-width: 768px;
            margin: 0 auto;
            animation: slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .screen.active {
            display: block;
        }

        @keyframes slideUp {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes db-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .dark-mode #test-loading-overlay {
            background: #0f172a !important;
        }
        .dark-mode #test-loading-overlay h3 {
            color: #f8fafc !important;
        }

        /* Fixed Navigation Stack Back Button Header */
        .back-nav-bar {
            position: sticky;
            top: 12px;
            background: rgba(255, 255, 255, 0.88);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            z-index: 999;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            gap: 12px;
            padding: 12px 18px !important;
            max-width: calc(100% - 24px);
            margin: 12px auto;
            border: 1.5px solid rgba(0, 0, 0, 0.05);
            border-radius: 20px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
            transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .back-nav-btn {
            background: none;
            border: none;
            cursor: pointer;
            font-size: 20px;
            display: flex;
            align-items: center;
            color: var(--primary);
            font-weight: bold;
        }

        /* Headers & Branding styling */
        .header {
            position: sticky;
            top: 12px;
            background: rgba(255, 255, 255, 0.88);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            z-index: 999;
            padding: 12px 18px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border: 1.5px solid rgba(0, 0, 0, 0.05);
            border-radius: 20px;
            max-width: calc(100% - 24px);
            margin: 12px auto;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
            transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .app-branding {
            display: flex;
            align-items: center;
            gap: 12px;
            min-width: 0;
            flex-grow: 1;
            overflow: hidden;
        }

        .app-logo {
            width: 42px;
            height: 42px;
            max-height: 42px;
            object-fit: contain;
            border: none !important;
            border-radius: 0 !important;
            background: transparent !important;
            background-color: transparent !important;
            padding: 0 !important;
            box-shadow: none !important;
            flex-shrink: 0;
            display: block;
        }

        .greetings-box {
            display: flex;
            flex-direction: column;
            min-width: 0;
            overflow: hidden;
            justify-content: center;
        }

        .greet-title {
            margin: 0;
            font-weight: 600;
            font-size: 16px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .greet-sub {
            margin: 0;
            font-size: 10px;
            color: var(--primary);
            font-weight: 600;
            letter-spacing: 0.5px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 1.2;
        }

        @media (max-width: 380px) {
            .greet-sub {
                font-size: 8.5px;
                letter-spacing: 0px;
            }
            .greet-title {
                font-size: 14px;
            }
            .app-logo {
                width: 36px !important;
                height: 36px !important;
                border-radius: 0 !important;
                border: none !important;
                padding: 0 !important;
                background: transparent !important;
            }
            .app-branding {
                gap: 8px;
            }
            .header {
                padding: 10px 12px;
            }
        }

        /* Notifications style (Zomato/Swiggy style cards) */
        .scrolling-notifications {
            display: flex;
            gap: 15px;
            overflow-x: auto;
            padding: 10px 5px 20px;
            scroll-snap-type: x mandatory;
            scrollbar-width: none;
        }
        .scrolling-notifications::-webkit-scrollbar {
            display: none;
        }

        .notif-card {
            min-width: 280px;
            max-width: 320px;
            background: #ffffff;
            border: 1px solid var(--border-color);
            border-radius: 16px;
            overflow: hidden;
            scroll-snap-align: start;
            box-shadow: 0 4px 12px rgba(0,0,0,0.03);
            display: flex;
            flex-direction: column;
        }

        .notif-banner {
            width: 100%;
            aspect-ratio: 21/9;
            height: auto;
            object-fit: contain;
            background: #ffffff;
        }

        .notif-content {
            padding: 15px;
            display: flex;
            flex-direction: column;
            gap: 6px;
            flex-grow: 1;
        }

        .notif-title {
            margin: 0;
            font-size: 15px;
            font-weight: bold;
        }

        .notif-desc {
            margin: 0;
            font-size: 12px;
            color: var(--grey-text);
            line-height: 1.4;
        }

        .notif-action-btn {
            align-self: flex-start;
            margin-top: 8px;
            padding: 6px 14px;
            background: var(--primary);
            color: white;
            border-radius: 8px;
            text-decoration: none;
            font-size: 11px;
            font-weight: bold;
            transition: opacity 0.2s;
        }

        /* 21:9 Dynamic Sliding Banners */
        .slider-container {
            width: 100%;
            aspect-ratio: 21/9;
            border-radius: 20px; /* Enhanced rounded corners */
            overflow: hidden;
            margin-bottom: 25px;
            position: relative;
            background: #0c0c0b;
            border: 1.5px solid var(--border-color);
            box-shadow: 0 16px 36px -8px rgba(255, 184, 0, 0.12), 0 8px 24px rgba(0, 0, 0, 0.04);
            /* Force GPU layer clipping for WebKit / Chrome desktop compatibility */
            transform: translateZ(0);
            -webkit-mask-image: -webkit-radial-gradient(white, black);
            isolation: isolate;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .slider-container::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.5) 100%);
            z-index: 9;
            pointer-events: none;
            transition: opacity 0.3s ease;
        }

        .slider-container:hover {
            border-color: rgba(255, 184, 0, 0.35);
            box-shadow: 0 20px 45px -8px rgba(255, 184, 0, 0.18), 0 10px 30px rgba(0, 0, 0, 0.06);
        }

        .slides-wrapper {
            display: flex;
            width: 100%;
            height: 100%;
            transition: transform 0.65s cubic-bezier(0.16, 1, 0.3, 1);
            border-radius: 20px;
        }

        .slide-item {
            width: 100%;
            min-width: 100%;
            flex-shrink: 0;
            height: 100%;
            position: relative;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            background: #000000;
            border-radius: 20px;
        }

        .slide-item-blur {
            background-size: cover;
            background-position: center;
            filter: blur(20px) brightness(0.4);
            position: absolute;
            top: -20px;
            left: -20px;
            right: -20px;
            bottom: -20px;
            z-index: 1;
            pointer-events: none;
            opacity: 0.8;
            transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .slide-item-img {
            width: 100%;
            height: 100%;
            object-fit: cover !important;
            z-index: 2;
            position: relative;
            pointer-events: none;
            border-radius: 20px;
            transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Premium cinematic zoom on slide hover */
        .slide-item:hover .slide-item-img {
            transform: scale(1.05);
        }
        .slide-item:hover .slide-item-blur {
            transform: scale(1.08);
        }

        .slider-dots {
            position: absolute;
            bottom: 12px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            max-width: 90%;
            gap: 6px;
            z-index: 12;
        }

        .dot {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.35);
            border: 0.5px solid rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(4px);
            -webkit-backdrop-filter: blur(4px);
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .dot.active {
            background: var(--primary) !important;
            width: 20px;
            border-radius: 4px;
            box-shadow: 0 0 10px rgba(255, 184, 0, 0.6);
        }

        /* Premium Glassmorphic Slider Navigation Arrows */
        .slider-arrow {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 40px;
            height: 40px;
            background: rgba(0, 0, 0, 0.35);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-size: 18px;
            cursor: pointer;
            z-index: 15;
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            pointer-events: auto;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
        }

        .slider-container:hover .slider-arrow {
            opacity: 1;
        }

        .slider-arrow:hover {
            background: var(--primary);
            color: #111111;
            transform: translateY(-50%) scale(1.08);
            border-color: var(--primary);
            box-shadow: 0 0 15px rgba(255, 184, 0, 0.4);
        }

        .slider-arrow-left {
            left: 12px;
        }

        .slider-arrow-right {
            right: 12px;
        }

        /* Layout Cards */
        .grid-blocks {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 25px;
        }

        .library-card {
            background: #ffffff;
            border-radius: 16px;
            border: 1px solid var(--border-color);
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 14px;
            cursor: pointer;
            box-shadow: 0 4px 10px rgba(0,0,0,0.02);
        }

        .library-icon {
            font-size: 32px;
            color: var(--primary);
        }

        .library-info {
            display: flex;
            flex-direction: column;
        }

        .library-info h3 {
            margin: 0;
            font-size: 16px;
            font-weight: bold;
        }

        .library-info p {
            margin: 2px 0 0;
            font-size: 11px;
            color: var(--grey-text);
        }

        /* Pure White design items list style */
        .outline-item-card {
            background: white;
            border-radius: 12px;
            border: 1px solid var(--border-color);
            margin-bottom: 12px;
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 15px;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.01);
            word-break: break-word;
            overflow-wrap: break-word;
        }

        .outline-item-img {
            width: 44px;
            height: 44px;
            border-radius: 10px;
            object-fit: contain;
            background: #ffffff;
            border: 1px solid var(--border-color);
            flex-shrink: 0;
            padding: 2px;
        }

        @keyframes prayasSpin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        @keyframes prayasLogoBlink {
            0% {
                opacity: 0.35;
                transform: scale(0.92);
                filter: drop-shadow(0 0 4px rgba(245, 158, 11, 0.2));
            }
            50% {
                opacity: 1;
                transform: scale(1.08);
                filter: drop-shadow(0 0 24px rgba(245, 158, 11, 0.9));
            }
            100% {
                opacity: 0.35;
                transform: scale(0.92);
                filter: drop-shadow(0 0 4px rgba(245, 158, 11, 0.2));
            }
        }

        @keyframes prayasAuraGlow {
            0% {
                opacity: 0.15;
                transform: scale(0.88);
            }
            50% {
                opacity: 0.85;
                transform: scale(1.18);
            }
            100% {
                opacity: 0.15;
                transform: scale(0.88);
            }
        }

        @keyframes prayasBarPulse {
            0% {
                left: -35%;
                width: 45%;
            }
            50% {
                left: 30%;
                width: 60%;
            }
            100% {
                left: 100%;
                width: 45%;
            }
        }

        @keyframes pulse {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 1; }
        }

        @keyframes premiumBlink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.25; }
        }

        @keyframes altTextFade1 {
            0%, 40% { opacity: 1; transform: translateY(0); }
            45%, 95% { opacity: 0; transform: translateY(-8px); }
            100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes altTextFade2 {
            0%, 40% { opacity: 0; transform: translateY(8px); }
            45%, 90% { opacity: 1; transform: translateY(0); }
            95%, 100% { opacity: 0; transform: translateY(-8px); }
        }

        @keyframes badgeAltTextFade1 {
            0%, 40% { opacity: 1; transform: translateY(0); }
            45%, 95% { opacity: 0; transform: translateY(-15px); }
            100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes badgeAltTextFade2 {
            0%, 40% { opacity: 0; transform: translateY(15px); }
            45%, 90% { opacity: 1; transform: translateY(0); }
            95%, 100% { opacity: 0; transform: translateY(-15px); }
        }

        .outline-item-details {
            flex-grow: 1;
            min-width: 0;
            word-break: break-word;
            overflow-wrap: break-word;
        }

        .outline-item-title {
            margin: 0;
            font-size: 15px;
            font-weight: bold;
            word-break: break-word;
            overflow-wrap: break-word;
        }

        .outline-item-subtitle {
            margin: 2px 0 0;
            font-size: 11px;
            color: var(--grey-text);
            word-break: break-word;
            overflow-wrap: break-word;
        }

        /* Screen Header block */
        .section-header-title {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 18px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        /* Coming soon visual block styling */
        .coming-soon-box {
            border: 2px dashed #dedede;
            border-radius: 16px;
            padding: 30px;
            text-align: center;
            color: #b2bec3;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 13px;
            letter-spacing: 0.5px;
            margin-top: 15px;
        }

        /* Social Media Connected block */
        .social-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
            gap: 12px;
            margin-top: 15px;
            margin-bottom: 25px;
            width: 100%;
        }

        .social-link-btn {
            background: white;
            border: 1.5px solid var(--border-color);
            border-radius: 14px;
            padding: 10px 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            cursor: pointer;
            text-decoration: none;
            color: var(--dark);
            font-size: 13px;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(0,0,0,0.02);
            transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
            min-height: 48px;
            flex-shrink: 0;
        }

        .social-link-btn span {
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 0.2px;
        }

        .social-link-btn i {
            font-size: 20px;
            flex-shrink: 0;
        }

        .social-link-btn:hover {
            transform: translateY(-2px) scale(1.03);
            border-color: var(--primary);
            box-shadow: 0 6px 16px rgba(255, 184, 0, 0.15);
            background: var(--light-grey);
        }

        .social-link-btn:active {
            transform: scale(0.96);
            border-color: var(--primary);
        }

        /* Buttons & Forms styling */
        .btn-fill-prime {
            width: 100%;
            background: var(--dark);
            color: white;
            border: none;
            padding: 16px;
            border-radius: 12px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            transition: opacity 0.2s;
        }

        .btn-fill-prime:active {
            opacity: 0.9;
        }

        .form-input {
            width: 100%;
            background: #ffffff;
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 14px 16px;
            font-size: 14px;
            color: var(--dark);
            margin-bottom: 12px;
            transition: border-color 0.2s;
        }

        .form-input:focus {
            border-color: var(--primary);
        }

        /* Instructions list formatting */
        .info-bullets {
            display: flex;
            flex-direction: column;
            gap: 10px;
            background: #ffffff;
            border: 1px solid var(--border-color);
            border-radius: 16px;
            padding: 20px;
            margin: 20px 0;
            font-size: 13px;
            line-height: 1.5;
        }

        .inst-item {
            display: flex;
            gap: 8px;
            align-items: flex-start;
        }

        .inst-item i {
            color: var(--primary);
            font-size: 16px;
            margin-top: 2px;
        }

        /* Locked Premium screen styles */
        .lock-container {
            text-align: center;
            padding: 40px 15px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 15px;
        }

        .qr-image-frame {
            width: 220px;
            height: 220px;
            border-radius: 16px;
            border: 4px solid var(--border-color);
            padding: 10px;
            background: white;
            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
            object-fit: contain;
            margin: 15px 0;
        }

        /* Test Engine Fullscreen Mode */
        #test-engine-panel {
            position: fixed;
            inset: 0;
            background-color: var(--light-grey);
            z-index: 9999;
            display: none;
            flex-direction: column;
            overflow: hidden;
        }

        #test-engine-panel *:not(i):not([class^="ph"]):not([class*=" ph"]) {
            font-family: inherit;
        }

        .engine-header {
            margin: 12px 12px 6px 12px;
            min-height: 65px;
            height: auto;
            border: 1.5px solid rgba(0, 0, 0, 0.05);
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 18px;
            background: rgba(255, 255, 255, 0.88);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.04);
            position: relative;
            z-index: 10;
            transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Standard CSS Classes for Modals Cancel/Close Elements - Perfect in both Day & Night modes */
        .modal-cancel-btn {
            background: #f1f2f6; 
            color: #2f3542; 
            border: 1px solid #dfe4ea; 
            border-radius: 12px; 
            padding: 12px 18px; 
            font-weight: bold; 
            font-size: 13px; 
            cursor: pointer; 
            font-family: inherit;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
        }
        .modal-cancel-btn:hover {
            background: #e4e7eb;
        }

        .dark-mode .modal-cancel-btn {
            background: rgba(255, 255, 255, 0.08) !important;
            color: #ffffff !important;
            border: 1.5px solid rgba(255, 255, 255, 0.15) !important;
        }
        .dark-mode .modal-cancel-btn:hover {
            background: rgba(255, 255, 255, 0.15) !important;
        }

        .drawer-close-btn {
            background: #f1f2f6;
            color: #1e272e;
            padding: 8px;
            border-radius: 10px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid #dfe4ea;
            transition: all 0.2s ease;
        }
        .drawer-close-btn:hover {
            background: #e4e7eb;
        }

        .dark-mode .drawer-close-btn {
            background: rgba(255, 255, 255, 0.08) !important;
            color: #ffffff !important;
            border: 1.5px solid rgba(255, 255, 255, 0.15) !important;
        }
        .dark-mode .drawer-close-btn:hover {
            background: rgba(255, 255, 255, 0.15) !important;
        }

        .circle-close-btn {
            cursor: pointer; 
            padding: 6px; 
            background: #f1f2f6; 
            border: 1px solid #dfe4ea;
            color: #1e272e;
            border-radius: 50%; 
            width: 28px; 
            height: 28px; 
            display: flex; 
            align-items: center; 
            justify-content: center;
            transition: all 0.2s ease;
        }
        .circle-close-btn:hover {
            background: #e4e7eb;
        }
        .dark-mode .circle-close-btn {
            background: rgba(255, 255, 255, 0.08) !important;
            color: #ffffff !important;
            border: 1.5px solid rgba(255, 255, 255, 0.15) !important;
        }
        .dark-mode .circle-close-btn:hover {
            background: rgba(255, 255, 255, 0.15) !important;
        }

        .close-floating-btn {
            position: absolute; 
            top: 15px; 
            right: 15px; 
            width: 32px; 
            height: 32px; 
            border-radius: 50%; 
            border: none; 
            background: #f1f2f6; 
            color: #1e272e; 
            font-size: 20px; 
            font-weight: bold; 
            cursor: pointer; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            transition: all 0.2s;
        }
        .close-floating-btn:hover {
            background: #e4e7eb;
        }
        .dark-mode .close-floating-btn {
            background: rgba(255, 255, 255, 0.08) !important;
            color: #ffffff !important;
        }
        .dark-mode .close-floating-btn:hover {
            background: rgba(255, 255, 255, 0.15) !important;
        }

        /* Elegant container shape for header action buttons (Theme and Profile) in both Light and Dark mode */
        .header-action-btn {
            background: var(--light-grey) !important;
            border: 1.5px solid var(--border-color) !important;
            width: 38px;
            height: 38px;
            padding: 0px;
            border-radius: 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--dark) !important;
            transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
        }
        
        .header-action-btn:hover {
            background: #eef1f6 !important;
            border-color: #cbd5e1 !important;
            transform: translateY(-1px);
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
        }

        .dark-mode .header-action-btn {
            background: rgba(255, 255, 255, 0.08) !important;
            border: 1.5px solid rgba(255, 255, 255, 0.14) !important;
            color: #ffffff !important;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
        }

        .dark-mode .header-action-btn:hover {
            background: rgba(255, 255, 255, 0.15) !important;
            border-color: rgba(255, 255, 255, 0.22) !important;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        /* Styling for the detailed analysis previous/next buttons */
        .analysis-nav-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            padding: 9px 15px;
            border-radius: 12px;
            font-size: 12.5px;
            font-weight: 700;
            background: var(--light-grey) !important;
            color: var(--dark) !important;
            border: 1.5px solid var(--border-color) !important;
            cursor: pointer;
            transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
            user-select: none;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
        }

        .analysis-nav-btn:hover:not(:disabled) {
            background: #eef1f6 !important;
            border-color: #cbd5e1 !important;
            transform: translateY(-1px);
            box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        }

        .analysis-nav-btn:disabled {
            opacity: 0.35 !important;
            cursor: not-allowed !important;
            background: var(--light-grey) !important;
            border-color: var(--border-color) !important;
            color: var(--grey-text) !important;
        }

        .dark-mode .analysis-nav-btn {
            background: rgba(255, 255, 255, 0.08) !important;
            border: 1.5px solid rgba(255, 255, 255, 0.14) !important;
            color: #ffffff !important;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
        }

        .dark-mode .analysis-nav-btn:hover:not(:disabled) {
            background: rgba(255, 255, 255, 0.15) !important;
            border-color: rgba(255, 255, 255, 0.22) !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }

        .engine-title-group {
            display: flex;
            align-items: center;
            gap: 10px;
            overflow: hidden;
            flex: 1;
            min-width: 0;
        }

        #testEngineName {
            margin: 0;
            font-size: 11.5px;
            font-weight: 850;
            letter-spacing: -0.2px;
            color: var(--dark);
            line-height: 1.35;
            word-break: break-word;
            overflow-wrap: anywhere;
        }
        @media (min-width: 480px) {
            #testEngineName {
                font-size: 12px;
            }
        }
        @media (min-width: 768px) {
            #testEngineName {
                font-size: 13.5px;
            }
        }

        #engineLangToggleBtn {
            display: none;
            align-items: center;
            gap: 3.5px;
            border: 1px solid var(--border-color);
            background: var(--light-grey);
            color: var(--primary);
            font-size: 8.5px;
            font-weight: 850;
            border-radius: 4px;
            padding: 1.5px 6px;
            margin-top: 2.5px;
            cursor: pointer;
            width: fit-content;
            font-family: Outfit, sans-serif;
            transition: all 0.15s ease;
            user-select: none;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        }

        #engineLangToggleBtn:hover {
            background: rgba(255, 107, 53, 0.1);
            border-color: var(--primary);
        }

        #engineLangToggleBtn:active {
            transform: scale(0.93);
        }

        .dark-mode #engineLangToggleBtn {
            background: #0B131E !important;
            border-color: #1E344B !important;
            color: var(--primary) !important;
            box-shadow: none !important;
        }

        .dark-mode #engineLangToggleBtn:hover {
            background: rgba(255, 107, 53, 0.15) !important;
            border-color: var(--primary) !important;
        }

        .guidelines-card {
            background: linear-gradient(to bottom, #fafafa, #ffffff);
            border: 1.5px solid var(--border-color);
            border-radius: 20px;
            padding: 20px;
            margin-bottom: 24px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.02);
            text-align: left;
        }

        .dark-mode .guidelines-card {
            background: linear-gradient(to bottom, #181818, #111111) !important;
            border-color: #2A2A28 !important;
        }

        .engine-submit-btn {
            background: var(--primary);
            color: white;
            font-weight: 900;
            border: none;
            border-radius: 8px;
            padding: 8px 16px;
            cursor: pointer;
            font-size: 12px;
        }

        .engine-tools-badge {
            background: var(--light-grey);
            border: 1px solid var(--border-color);
            color: var(--dark) !important;
            padding: 6px 12px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 6px;
            cursor: pointer;
            font-weight: 800;
            font-size: 12px;
        }

        /* Professional fixed background watermark */
        .watermark-container {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: flex !important;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            pointer-events: none;
            opacity: 0.07;
            z-index: 1;
            width: 100%;
            text-align: center;
        }

        .watermark-img {
            width: 180px;
            height: 180px;
            object-fit: contain;
            border-radius: 0;
            margin-bottom: 15px;
        }

        .watermark-text {
            font-size: 26px;
            font-weight: 900;
            letter-spacing: 3px;
            color: var(--dark);
            text-transform: uppercase;
        }

        body.dark-mode .watermark-text {
            color: #ffffff !important;
        }

        body.dark-mode .watermark-container {
            opacity: 0.05 !important;
        }

        /* Exam questions container */
        .engine-content {
            flex-grow: 1;
            padding: 24px;
            overflow-y: auto;
            position: relative;
            z-index: 5;
        }

        .engine-question-num {
            font-size: 11px;
            font-weight: 600;
            color: var(--primary);
            letter-spacing: 0.5px;
            margin-bottom: 8px;
        }

        .engine-question-text {
            font-size: 18px;
            font-weight: 500;
            line-height: 1.5;
            margin-bottom: 25px;
            word-break: break-word;
            overflow-wrap: break-word;
            white-space: pre-wrap !important;
        }

        .option-button {
            width: 100%;
            background: white;
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 16px;
            text-align: left;
            font-size: 14px;
            font-weight: 450;
            margin-bottom: 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 12px;
            transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
            word-break: break-word;
            overflow-wrap: break-word;
            white-space: pre-wrap !important;
        }

        .option-button span {
            flex: 1;
            min-width: 0;
            word-break: break-word;
            overflow-wrap: break-word;
            white-space: pre-wrap !important;
        }

        .option-button:active {
            transform: scale(0.99);
        }

        .option-button.selected {
            border-color: var(--primary);
            background: var(--primary-light);
            box-shadow: 0 4px 12px rgba(255, 184, 0, 0.05);
        }

        .option-badge {
            width: 24px;
            height: 24px;
            border-radius: 6px;
            border: 1.5px solid var(--border-color);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            font-weight: 600;
            color: var(--grey-text);
            background: transparent;
        }

        .option-button.selected .option-badge {
            background: var(--primary);
            border-color: var(--primary);
            color: white;
        }

        .engine-footer {
            margin: 6px 12px 16px 12px;
            height: 66px;
            border: 1.5px solid rgba(0, 0, 0, 0.05);
            border-radius: 40px; /* Highly curved capsule style requested by the user */
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 20px;
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            box-shadow: 0 12px 35px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.05);
            position: relative;
            z-index: 10;
            transition: all 0.3s;
        }

        @media (max-width: 480px) {
            .engine-footer {
                padding: 0 12px;
                height: 60px;
                margin: 6px 8px 12px 8px;
            }
            .engine-btn-nav {
                width: 40px;
                height: 40px;
                font-size: 16px;
            }
            .review-badge-btn {
                padding: 8px 12px;
                font-size: 10px;
                gap: 4px;
            }
        }

        .engine-btn-nav {
            background: var(--light-grey);
            border: 1px solid var(--border-color);
            border-radius: 10px;
            width: 44px;
            height: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 18px;
            color: var(--dark);
        }

        .engine-btn-nav:disabled {
            opacity: 0.4;
            cursor: not-allowed;
        }

        .review-badge-btn {
            background: #ffffff;
            border: 1px solid var(--border-color);
            padding: 10px 18px;
            font-size: 11px;
            color: var(--dark);
            border-radius: 20px;
            font-weight: 900;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .review-badge-btn.active {
            background: var(--blue);
            color: white;
            border-color: var(--blue);
        }

        /* Sliding Bottom Drawers / Modals */
        .drawer-sheet-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.4);
            z-index: 10000;
            display: none;
            backdrop-filter: blur(2px);
        }

        .drawer-sheet {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: white;
            border-radius: 24px 24px 0 0;
            z-index: 10001;
            padding: 25px;
            max-height: 75vh;
            display: none;
            flex-direction: column;
            box-shadow: 0 -10px 30px rgba(0,0,0,0.15);
            animation: drawUpDown 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes drawUpDown {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
        }

        .palette-grid {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 10px;
            overflow-y: auto;
            padding: 15px 0;
            max-height: 40vh;
        }

        .palette-cell {
            aspect-ratio: 1;
            border-radius: 12px;
            border: 2px solid var(--border-color);
            background: white;
            font-size: 14px;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s;
        }

        .palette-cell.answered {
            background: var(--green);
            color: white;
            border-color: var(--green);
        }

        .palette-cell.review-marked {
            background: var(--blue);
            color: white;
            border-color: var(--blue);
        }

        .palette-cell.not-visited {
            background: var(--light-grey);
            color: var(--grey-text);
            border-color: var(--border-color);
        }

        .palette-legend {
            display: flex;
            justify-content: space-around;
            padding: 10px 0;
            font-size: 10px;
            border-top: 1px solid var(--border-color);
            margin-top: 10px;
        }

        .legend-item {
            display: flex;
            align-items: center;
            gap: 4px;
            font-weight: bold;
        }

        /* Scorecard visual block styles (Responsive Redesign for Mobile, Tablet, Laptop, Desktop) */
        #scr-results {
            width: 100% !important;
            max-width: 1180px !important;
            margin: 0 auto !important;
            padding: 14px 14px 160px !important; /* Generous bottom clearance ensuring Back To Dashboard is never obscured by mobile bottom nav */
            box-sizing: border-box !important;
        }

        @media (min-width: 640px) {
            #scr-results {
                padding: 18px 22px 150px !important;
            }
        }

        @media (min-width: 1024px) {
            #scr-results {
                padding: 24px 28px 48px !important;
            }
        }

        /* Mock Score Card Container: Day Mode is Pure White, Night Mode matches Dark Theme */
        .scorecard-block {
            position: relative !important;
            background: #ffffff !important;
            color: var(--dark) !important;
            border: 1.5px solid #e2e8f0 !important;
            border-radius: 22px !important;
            padding: 20px 16px !important;
            box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02) !important;
            margin-bottom: 24px !important;
            overflow: hidden !important;
            box-sizing: border-box !important;
            text-align: left !important;
            transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease !important;
        }

        @media (min-width: 640px) {
            .scorecard-block {
                border-radius: 26px !important;
                padding: 26px 24px !important;
            }
        }

        @media (min-width: 1024px) {
            .scorecard-block {
                border-radius: 28px !important;
                padding: 32px 32px !important;
            }
        }

        /* Ambient subtle glow blobs */
        .sc-ambient-glow {
            position: absolute !important;
            pointer-events: none !important;
            border-radius: 50% !important;
            filter: blur(50px) !important;
            opacity: 0.04 !important;
        }
        .sc-glow-1 {
            top: -60px;
            right: -40px;
            width: 220px;
            height: 220px;
            background: #ff6b35;
        }
        .sc-glow-2 {
            bottom: -60px;
            left: -40px;
            width: 200px;
            height: 200px;
            background: #009cfc;
        }

        /* Header Bar */
        .sc-header-bar {
            display: flex !important;
            flex-direction: column !important;
            gap: 10px !important;
            margin-bottom: 20px !important;
            position: relative !important;
            z-index: 2 !important;
        }

        @media (min-width: 640px) {
            .sc-header-bar {
                flex-direction: row !important;
                align-items: center !important;
                justify-content: space-between !important;
                gap: 16px !important;
                margin-bottom: 24px !important;
            }
        }

        .sc-header-left {
            display: flex !important;
            flex-direction: column !important;
            gap: 6px !important;
        }

        .sc-badge-pill {
            display: inline-flex !important;
            align-items: center !important;
            gap: 6px !important;
            background: rgba(255, 107, 53, 0.09) !important;
            color: var(--primary) !important;
            border: 1px solid rgba(255, 107, 53, 0.22) !important;
            border-radius: 9999px !important;
            padding: 3px 10px !important;
            font-size: 10.5px !important;
            font-weight: 800 !important;
            letter-spacing: 0.8px !important;
            text-transform: uppercase !important;
            width: fit-content !important;
            font-family: 'Outfit', sans-serif !important;
        }

        .sc-main-title {
            margin: 0 !important;
            font-size: 19px !important;
            font-weight: 900 !important;
            letter-spacing: 0.3px !important;
            color: var(--dark) !important;
            font-family: 'Outfit', sans-serif !important;
            line-height: 1.2 !important;
        }

        @media (min-width: 640px) {
            .sc-main-title {
                font-size: 22px !important;
            }
        }

        .sc-header-right {
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
            flex-wrap: wrap !important;
        }

        @media (min-width: 640px) {
            .sc-header-right {
                flex-direction: column !important;
                align-items: flex-end !important;
                gap: 4px !important;
            }
        }

        .sc-topic-header {
            margin: 0 !important;
            font-size: 12px !important;
            font-weight: 700 !important;
            color: #64748b !important;
            text-transform: uppercase !important;
            letter-spacing: 0.5px !important;
            font-family: 'Outfit', sans-serif !important;
        }

        .sc-status-pill {
            display: inline-flex !important;
            align-items: center !important;
            gap: 4px !important;
            background: rgba(34, 197, 94, 0.1) !important;
            color: #15803d !important;
            border: 1px solid rgba(34, 197, 94, 0.25) !important;
            border-radius: 9999px !important;
            padding: 3px 8px !important;
            font-size: 10px !important;
            font-weight: 700 !important;
            font-family: 'Outfit', sans-serif !important;
        }

        /* Bento Grid Layout */
        .sc-bento-grid {
            display: grid !important;
            grid-template-columns: 1fr !important;
            gap: 14px !important;
            margin-bottom: 14px !important;
            position: relative !important;
            z-index: 2 !important;
        }

        @media (min-width: 640px) {
            .sc-bento-grid {
                grid-template-columns: repeat(2, 1fr) !important;
                gap: 16px !important;
            }
        }

        @media (min-width: 1024px) {
            .sc-bento-grid {
                grid-template-columns: 360px 1fr !important;
                gap: 20px !important;
            }
        }

        /* Showcase Score Card (Day Mode: Subtle warm-neutral off-white contrast) */
        .sc-score-showcase {
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%) !important;
            border: 1.5px solid #e2e8f0 !important;
            border-radius: 18px !important;
            padding: 18px !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            gap: 14px !important;
            box-sizing: border-box !important;
            box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.8), 0 2px 8px rgba(0, 0, 0, 0.02) !important;
        }

        @media (min-width: 640px) {
            .sc-score-showcase {
                border-radius: 20px !important;
                padding: 22px !important;
            }
        }

        .sc-score-header {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            gap: 8px !important;
        }

        .sc-score-label {
            font-size: 11px !important;
            color: #64748b !important;
            text-transform: uppercase !important;
            font-weight: 800 !important;
            letter-spacing: 1px !important;
            font-family: 'Outfit', sans-serif !important;
        }

        /* Dynamic Performance Badges with High Contrast in Both Modes */
        .sc-perf-badge {
            display: inline-block !important;
            padding: 3px 9px !important;
            font-size: 10.5px !important;
            font-weight: 800 !important;
            border-radius: 9999px !important;
            background: rgba(34, 197, 94, 0.12) !important;
            color: #15803d !important;
            border: 1px solid rgba(34, 197, 94, 0.28) !important;
            font-family: 'Outfit', sans-serif !important;
            transition: all 0.2s ease !important;
        }
        .sc-perf-badge.badge-outstanding {
            background: rgba(34, 197, 94, 0.12) !important;
            color: #15803d !important;
            border-color: rgba(34, 197, 94, 0.28) !important;
        }
        .sc-perf-badge.badge-good {
            background: rgba(59, 130, 246, 0.12) !important;
            color: #1d4ed8 !important;
            border-color: rgba(59, 130, 246, 0.28) !important;
        }
        .sc-perf-badge.badge-average {
            background: rgba(234, 179, 8, 0.14) !important;
            color: #a16207 !important;
            border-color: rgba(234, 179, 8, 0.3) !important;
        }
        .sc-perf-badge.badge-practice {
            background: rgba(239, 68, 68, 0.12) !important;
            color: #b91c1c !important;
            border-color: rgba(239, 68, 68, 0.28) !important;
        }

        .sc-score-display {
            display: flex !important;
            align-items: baseline !important;
            justify-content: flex-start !important;
            gap: 8px !important;
            margin: 4px 0 !important;
        }

        .sc-score-number {
            margin: 0 !important;
            font-size: 38px !important;
            font-weight: 950 !important;
            line-height: 1 !important;
            color: #16a34a !important;
            font-family: 'Outfit', sans-serif !important;
            letter-spacing: -0.5px !important;
        }

        @media (min-width: 640px) {
            .sc-score-number {
                font-size: 46px !important;
            }
        }

        .sc-score-max {
            font-size: 15px !important;
            color: #94a3b8 !important;
            font-weight: 700 !important;
            font-family: 'Outfit', sans-serif !important;
        }

        .sc-mini-metrics-row {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 10px !important;
            padding-top: 12px !important;
            border-top: 1px solid #e2e8f0 !important;
        }

        .sc-mini-metric {
            display: flex !important;
            align-items: center !important;
            gap: 10px !important;
        }

        .sc-mini-icon {
            width: 34px !important;
            height: 34px !important;
            border-radius: 10px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 16px !important;
            flex-shrink: 0 !important;
        }

        .sc-mini-label {
            display: block !important;
            font-size: 10px !important;
            color: #64748b !important;
            text-transform: uppercase !important;
            font-weight: 700 !important;
            letter-spacing: 0.5px !important;
            font-family: 'Outfit', sans-serif !important;
        }

        .sc-mini-val {
            margin: 1px 0 0 0 !important;
            font-size: 15px !important;
            font-weight: 800 !important;
            font-family: 'Outfit', sans-serif !important;
        }
        #statAccuracyPercent {
            color: #ca8a04 !important;
        }
        #statDurationSpent {
            color: #7c3aed !important;
        }

        /* 4 Filters Grid */
        .sc-filters-grid {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
        }

        @media (min-width: 640px) and (max-width: 1023px) {
            .sc-filters-grid {
                grid-column: span 2 !important;
                grid-template-columns: repeat(4, 1fr) !important;
                gap: 12px !important;
            }
        }

        @media (min-width: 1024px) {
            .sc-filters-grid {
                grid-template-columns: repeat(2, 1fr) !important;
                gap: 12px !important;
            }
        }

        /* Interactive Stat Card (Day Mode: Crisp White Card) */
        .sc-stat-card {
            background: #ffffff !important;
            border: 1.5px solid #e2e8f0 !important;
            border-radius: 18px !important;
            padding: 14px 14px !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            gap: 8px !important;
            cursor: pointer !important;
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
            user-select: none !important;
            box-sizing: border-box !important;
            position: relative !important;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03) !important;
        }

        .sc-stat-card:hover {
            background: #f8fafc !important;
            border-color: #cbd5e1 !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06) !important;
        }

        .sc-stat-card.active {
            border-color: var(--primary) !important;
            box-shadow: 0 0 0 2px rgba(255, 107, 53, 0.25), 0 4px 12px rgba(255, 107, 53, 0.12) !important;
        }

        .sc-stat-top {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
        }

        .sc-stat-icon-wrap {
            width: 32px !important;
            height: 32px !important;
            border-radius: 9px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 16px !important;
        }

        .sc-filter-action-tag {
            font-size: 9.5px !important;
            color: #94a3b8 !important;
            text-transform: uppercase !important;
            font-weight: 800 !important;
            letter-spacing: 0.5px !important;
            font-family: 'Outfit', sans-serif !important;
        }

        .sc-stat-content {
            margin-top: 2px !important;
        }

        .sc-stat-num {
            margin: 0 !important;
            font-size: 22px !important;
            font-weight: 900 !important;
            line-height: 1.1 !important;
            font-family: 'Outfit', sans-serif !important;
            color: var(--dark) !important;
        }

        @media (min-width: 640px) {
            .sc-stat-num {
                font-size: 24px !important;
            }
        }

        #statTotalItemsText {
            color: var(--dark) !important;
        }
        #statCorrectCountText {
            color: #16a34a !important;
        }
        #statIncorrectCountText {
            color: #dc2626 !important;
        }
        #statUnansweredCountText {
            color: #2563eb !important;
        }

        .sc-stat-name {
            margin: 3px 0 0 0 !important;
            font-size: 11px !important;
            color: #64748b !important;
            text-transform: uppercase !important;
            font-weight: 700 !important;
            letter-spacing: 0.4px !important;
            font-family: 'Outfit', sans-serif !important;
        }

        /* Revealed Banner (Eye Assist in Day Mode) */
        .sc-revealed-banner {
            position: relative !important;
            z-index: 2 !important;
            background: rgba(16, 185, 129, 0.07) !important;
            border: 1.5px solid rgba(16, 185, 129, 0.22) !important;
            border-radius: 16px !important;
            padding: 12px 14px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            gap: 12px !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
            box-sizing: border-box !important;
        }

        .sc-revealed-banner:hover {
            background: rgba(16, 185, 129, 0.12) !important;
            border-color: rgba(16, 185, 129, 0.32) !important;
            transform: translateY(-1px) !important;
        }

        .sc-revealed-left {
            display: flex !important;
            align-items: center !important;
            gap: 10px !important;
            min-width: 0 !important;
        }

        .sc-revealed-icon {
            width: 32px !important;
            height: 32px !important;
            border-radius: 8px !important;
            background: rgba(16, 185, 129, 0.14) !important;
            color: #059669 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 18px !important;
            flex-shrink: 0 !important;
        }

        .sc-revealed-title-row {
            display: flex !important;
            align-items: center !important;
            gap: 6px !important;
        }

        .sc-revealed-label {
            font-size: 11px !important;
            font-weight: 800 !important;
            color: #059669 !important;
            text-transform: uppercase !important;
            letter-spacing: 0.5px !important;
            font-family: 'Outfit', sans-serif !important;
        }

        .sc-revealed-count {
            font-size: 13px !important;
            font-weight: 900 !important;
            color: var(--dark) !important;
            font-family: 'Outfit', sans-serif !important;
        }

        .sc-revealed-sub {
            margin: 1px 0 0 0 !important;
            font-size: 11px !important;
            color: #047857 !important;
            opacity: 0.85 !important;
            font-family: 'Outfit', sans-serif !important;
            display: none !important;
        }

        @media (min-width: 640px) {
            .sc-revealed-sub {
                display: block !important;
            }
        }

        .sc-revealed-btn {
            background: rgba(16, 185, 129, 0.12) !important;
            color: #047857 !important;
            border: 1px solid rgba(16, 185, 129, 0.25) !important;
            padding: 6px 12px !important;
            border-radius: 8px !important;
            font-size: 11px !important;
            font-weight: 800 !important;
            display: inline-flex !important;
            align-items: center !important;
            gap: 4px !important;
            cursor: pointer !important;
            white-space: nowrap !important;
            font-family: 'Outfit', sans-serif !important;
        }

        /* Analysis Section */
        .sc-analysis-section {
            margin-top: 24px !important;
        }

        .sc-analysis-header {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            flex-wrap: wrap !important;
            gap: 8px !important;
            margin-bottom: 12px !important;
        }

        .sc-analysis-header-left {
            display: flex !important;
            align-items: center !important;
            gap: 10px !important;
        }

        .sc-analysis-title {
            margin: 0 !important;
            font-size: 18px !important;
            font-weight: 900 !important;
            color: var(--dark) !important;
            font-family: 'Outfit', sans-serif !important;
        }

        @media (min-width: 640px) {
            .sc-analysis-title {
                font-size: 20px !important;
            }
        }

        .sc-analysis-badge {
            display: inline-flex !important;
            align-items: center !important;
            font-size: 11px !important;
            font-weight: 800 !important;
            padding: 3px 10px !important;
            border-radius: 9999px !important;
            background: rgba(255, 107, 53, 0.1) !important;
            color: var(--primary) !important;
            border: 1px solid rgba(255, 107, 53, 0.25) !important;
            font-family: 'Outfit', sans-serif !important;
            transition: all 0.2s ease !important;
        }

        .sc-analysis-hint {
            font-size: 11.5px !important;
            color: var(--grey-text) !important;
            font-weight: 600 !important;
            font-family: 'Outfit', sans-serif !important;
            display: none !important;
        }

        @media (min-width: 640px) {
            .sc-analysis-hint {
                display: block !important;
            }
        }

        /* Palette horizontal scroll */
        .sc-palette-scroll {
            display: flex !important;
            gap: 8px !important;
            overflow-x: auto !important;
            padding: 10px 8px !important;
            margin-bottom: 16px !important;
            background: #f8fafc !important;
            border: 1px solid #e2e8f0 !important;
            border-radius: 14px !important;
            -webkit-overflow-scrolling: touch !important;
            scrollbar-width: thin !important;
        }

        /* Detail Viewer Card */
        .sc-detail-viewer-card {
            background: #ffffff !important;
            border: 1.5px solid #e2e8f0 !important;
            border-radius: 18px !important;
            padding: 16px !important;
            margin-bottom: 16px !important;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03) !important;
            box-sizing: border-box !important;
        }

        @media (min-width: 640px) {
            .sc-detail-viewer-card {
                border-radius: 22px !important;
                padding: 22px !important;
            }
        }

        @media (min-width: 1024px) {
            .sc-detail-viewer-card {
                border-radius: 24px !important;
                padding: 26px !important;
            }
        }

        /* Bottom Actions (Comfortable Clearance above bottom navigation) */
        .sc-bottom-actions {
            display: flex !important;
            justify-content: center !important;
            width: 100% !important;
            margin: 32px 0 24px 0 !important;
            position: relative !important;
            z-index: 50 !important;
        }

        .sc-btn-dashboard {
            background: var(--dark) !important;
            color: #ffffff !important;
            border: none !important;
            border-radius: 9999px !important;
            padding: 14px 32px !important;
            font-size: 14.5px !important;
            font-weight: 800 !important;
            width: 100% !important;
            max-width: 320px !important;
            min-height: 50px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 10px !important;
            cursor: pointer !important;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
            font-family: 'Outfit', sans-serif !important;
        }

        .sc-btn-dashboard:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 10px 28px rgba(0, 0, 0, 0.2) !important;
            background: #1e293b !important;
        }

        /* =========================================================================
           NIGHT MODE THEME ADAPTATION (Perfect match with dark slate / navy aesthetic)
           ========================================================================= */
        .dark-mode .scorecard-block {
            background: #121F2F !important;
            color: #f0f6fc !important;
            border: 1px solid #1E344B !important;
            box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05) !important;
        }

        .dark-mode .sc-ambient-glow {
            opacity: 0.12 !important;
        }

        .dark-mode .sc-badge-pill {
            background: rgba(255, 107, 53, 0.16) !important;
            border-color: rgba(255, 107, 53, 0.35) !important;
            color: var(--primary) !important;
        }

        .dark-mode .sc-main-title {
            color: #ffffff !important;
        }

        .dark-mode .sc-topic-header {
            color: #94A9BE !important;
        }

        .dark-mode .sc-status-pill {
            background: rgba(34, 197, 94, 0.15) !important;
            color: #4ade80 !important;
            border-color: rgba(34, 197, 94, 0.3) !important;
        }

        .dark-mode .sc-score-showcase {
            background: #0B131E !important;
            border: 1px solid #1E344B !important;
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04) !important;
        }

        .dark-mode .sc-score-label {
            color: #94A9BE !important;
        }

        .dark-mode .sc-perf-badge.badge-outstanding {
            background: rgba(34, 197, 94, 0.18) !important;
            color: #4ade80 !important;
            border-color: rgba(34, 197, 94, 0.35) !important;
        }
        .dark-mode .sc-perf-badge.badge-good {
            background: rgba(59, 130, 246, 0.18) !important;
            color: #60a5fa !important;
            border-color: rgba(59, 130, 246, 0.35) !important;
        }
        .dark-mode .sc-perf-badge.badge-average {
            background: rgba(234, 179, 8, 0.18) !important;
            color: #facc15 !important;
            border-color: rgba(234, 179, 8, 0.35) !important;
        }
        .dark-mode .sc-perf-badge.badge-practice {
            background: rgba(239, 68, 68, 0.18) !important;
            color: #f87171 !important;
            border-color: rgba(239, 68, 68, 0.35) !important;
        }

        .dark-mode .sc-score-number {
            color: #4ade80 !important;
        }

        .dark-mode .sc-score-max {
            color: #64748b !important;
        }

        .dark-mode .sc-mini-metrics-row {
            border-top-color: #1E344B !important;
        }

        .dark-mode .sc-mini-label {
            color: #94A9BE !important;
        }

        .dark-mode #statAccuracyPercent {
            color: #facc15 !important;
        }

        .dark-mode #statDurationSpent {
            color: #c084fc !important;
        }

        .dark-mode .sc-stat-card {
            background: #0B131E !important;
            border: 1.5px solid #1E344B !important;
            box-shadow: none !important;
        }

        .dark-mode .sc-stat-card:hover {
            background: #152233 !important;
            border-color: #274768 !important;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3) !important;
        }

        .dark-mode .sc-stat-card.active {
            border-color: var(--primary) !important;
            box-shadow: 0 0 0 2px rgba(255, 107, 53, 0.35) !important;
        }

        .dark-mode .sc-filter-action-tag {
            color: #64748b !important;
        }

        .dark-mode .sc-stat-num {
            color: #ffffff !important;
        }

        .dark-mode #statTotalItemsText {
            color: #ffffff !important;
        }

        .dark-mode #statCorrectCountText {
            color: #4ade80 !important;
        }

        .dark-mode #statIncorrectCountText {
            color: #f87171 !important;
        }

        .dark-mode #statUnansweredCountText {
            color: #60a5fa !important;
        }

        .dark-mode .sc-stat-name {
            color: #94A9BE !important;
        }

        .dark-mode .sc-revealed-banner {
            background: rgba(16, 185, 129, 0.1) !important;
            border: 1px solid rgba(16, 185, 129, 0.25) !important;
        }

        .dark-mode .sc-revealed-banner:hover {
            background: rgba(16, 185, 129, 0.16) !important;
            border-color: rgba(16, 185, 129, 0.38) !important;
        }

        .dark-mode .sc-revealed-icon {
            background: rgba(16, 185, 129, 0.18) !important;
            color: #10b981 !important;
        }

        .dark-mode .sc-revealed-label {
            color: #34d399 !important;
        }

        .dark-mode .sc-revealed-count {
            color: #ffffff !important;
        }

        .dark-mode .sc-revealed-sub {
            color: #6ee7b7 !important;
            opacity: 0.85 !important;
        }

        .dark-mode .sc-revealed-btn {
            background: rgba(16, 185, 129, 0.18) !important;
            color: #34d399 !important;
            border-color: rgba(16, 185, 129, 0.32) !important;
        }

        .dark-mode .sc-analysis-title {
            color: #f0f6fc !important;
        }

        .dark-mode .sc-analysis-hint {
            color: #94A9BE !important;
        }

        .dark-mode #scorecardGlobalLangBtn {
            background: #0B131E !important;
            border-color: #1E344B !important;
            color: var(--primary) !important;
            box-shadow: none !important;
        }

        .dark-mode .sc-detail-viewer-card {
            background: #121F2F !important;
            border-color: #1E344B !important;
            color: #f0f6fc !important;
        }

        .dark-mode .sc-palette-scroll {
            background: #0B131E !important;
            border-color: #1E344B !important;
        }

        .dark-mode .sc-btn-dashboard {
            background: var(--primary) !important;
            color: #ffffff !important;
            box-shadow: 0 8px 24px rgba(255, 107, 53, 0.25) !important;
        }
        .dark-mode .sc-btn-dashboard:hover {
            background: var(--primary) !important;
            filter: brightness(1.1) !important;
            box-shadow: 0 10px 28px rgba(255, 107, 53, 0.35) !important;
        }

        .stats-summary-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-top: 20px;
        }

        .stat-badge-cube {
            background: rgba(255, 255, 255, 0.08);
            border-radius: 12px;
            padding: 15px;
            text-align: center;
        }

        .stat-badge-cube p {
            margin: 0;
            font-size: 10px;
            text-transform: uppercase;
            opacity: 0.6;
            letter-spacing: 1px;
            font-weight: bold;
        }

        .stat-badge-cube h4 {
            margin: 5px 0 0;
            font-size: 18px;
            font-weight: bold;
        }

        /* Analysis Question Detail Modals */
        .analysis-detail-modal {
            position: fixed;
            inset: 0;
            background: white;
            z-index: 50000;
            display: none;
            flex-direction: column;
            padding: 24px;
        }

        .analysis-question-box {
            background: var(--light-grey);
            padding: 16px 18px;
            border-radius: 14px;
            border: 1px solid var(--border-color);
            margin-bottom: 16px;
            font-size: 15px;
            line-height: 1.65;
            font-weight: 400 !important;
            color: var(--dark);
        }

        .analysis-question-box strong,
        .analysis-question-box b {
            font-weight: 600 !important;
        }

        .analysis-question-text {
            font-size: 15px;
            line-height: 1.65;
            font-weight: 400 !important;
            color: inherit;
        }

        .analysis-opt-box {
            padding: 12px 14px;
            border-radius: 12px;
            border: 1.5px solid var(--border-color);
            margin-bottom: 8px;
            font-weight: 400 !important;
            background-color: #ffffff !important;
            color: var(--dark) !important;
            transition: all 0.18s ease;
        }

        .analysis-opt-box strong,
        .analysis-opt-box b {
            font-weight: 600 !important;
        }

        .analysis-opt-a,
        .analysis-opt-b,
        .analysis-opt-c,
        .analysis-opt-d,
        .analysis-opt-e {
            background-color: #ffffff !important;
            border-color: var(--border-color) !important;
            color: var(--dark) !important;
            font-weight: 400 !important;
        }

        .analysis-opt-box.correct {
            border-color: #22c55e !important;
            background-color: #f0fdf4 !important;
            color: #15803d !important;
        }

        .analysis-opt-box.wrong {
            border-color: #ef4444 !important;
            background-color: #fef2f2 !important;
            color: #b91c1c !important;
        }

        /* Option analysis expandable box default styles */
        .option-analysis-expandable-box {
            margin-top: 5px;
            margin-bottom: 10px;
            margin-left: 10px;
            padding: 12px 16px;
            border-radius: 10px;
            font-size: 13.5px;
            font-weight: 400 !important;
            line-height: 1.6;
            transition: all 0.2s ease;
            background-color: #f8fafc !important;
            border: 1.5px solid #e2e8f0 !important;
            border-left: 3.5px solid #94a3b8 !important;
            color: #334155 !important;
            font-family: 'Outfit', 'Anek Devanagari', 'Anek Devnagari', sans-serif;
        }

        .option-analysis-expandable-box strong,
        .option-analysis-expandable-box b {
            font-weight: 600 !important;
        }

        .oa-box-a,
        .oa-box-b,
        .oa-box-c,
        .oa-box-d,
        .oa-box-e {
            background-color: #f8fafc !important;
            border: 1.5px solid #e2e8f0 !important;
            border-left: 3.5px solid #94a3b8 !important;
            color: #334155 !important;
        }

        .oa-box-correct {
            background-color: #f0fdf4 !important;
            border: 1.5px solid rgba(34, 197, 94, 0.3) !important;
            border-left: 3.5px solid #22c55e !important;
            color: #15803d !important;
        }

        .oa-box-wrong {
            background-color: #fef2f2 !important;
            border: 1.5px solid rgba(239, 68, 68, 0.3) !important;
            border-left: 3.5px solid #ef4444 !important;
            color: #b91c1c !important;
        }

        .oa-box-label {
            font-size: 10.5px;
            font-weight: 700;
            text-transform: uppercase;
            margin-bottom: 6px;
            opacity: 0.9;
            letter-spacing: 0.5px;
            font-family: 'Outfit', sans-serif !important;
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .oa-box-content {
            font-size: 13.5px;
            font-weight: 400 !important;
            line-height: 1.6;
            font-family: 'Outfit', 'Anek Devanagari', 'Anek Devnagari', sans-serif;
        }

        .oa-box-content strong,
        .oa-box-content b {
            font-weight: 600 !important;
        }

        .analysis-explanation-box {
            background: #f8fafc;
            border: 1.5px solid #e2e8f0;
            border-left: 4px solid var(--primary);
            padding: 16px 18px;
            border-radius: 14px;
            font-size: 14px;
            line-height: 1.7;
            font-weight: 400 !important;
            color: #1e293b;
            margin-top: 18px;
            white-space: pre-wrap !important;
            word-break: break-word !important;
            overflow-wrap: break-word !important;
        }

        .analysis-explanation-box strong,
        .analysis-explanation-box b {
            font-weight: 600 !important;
        }

        .analysis-explanation-content {
            font-size: 14px;
            line-height: 1.7;
            font-weight: 400 !important;
            color: inherit;
        }

        .analysis-explanation-content strong,
        .analysis-explanation-content b {
            font-weight: 600 !important;
        }

        .analysis-source-box {
            margin-top: 14px;
            padding: 9px 12px;
            background: rgba(245, 158, 11, 0.08);
            border-left: 3.5px solid #f59e0b;
            border-radius: 8px;
            font-size: 11.5px;
            font-weight: 400;
            color: #b45309;
        }

        .analysis-question-box,
        .analysis-opt-box,
        .option-analysis-expandable-box,
        .revealed-slide-card,
        .q-text,
        .q-body,
        .q-exp,
        .q-title,
        .question-text,
        .explanation-text,
        .solution-box,
        .sol-box,
        #optionsRadioGroup,
        #revealedSlidesViewport,
        #analysisList,
        #itemAnalysisScrollViewArea {
            white-space: pre-wrap !important;
            word-break: break-word !important;
            overflow-wrap: break-word !important;
        }

        /* Phosphor icon rendering helpers (Desktop, Laptop & Mobile) */
        i.ph, i.ph-bold, i.ph-fill, i.ph-duotone, i.ph-light, i.ph-thin,
        [class^="ph-"], [class*=" ph-"], [class^="ph "], [class*=" ph "] {
            font-style: normal;
            font-variant: normal;
            text-transform: none;
            line-height: 1;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            vertical-align: middle;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        /* STRICT EXCLUSIVE DISPLAY FOR DAY/NIGHT THEME ICONS (Prevents both icons appearing together) */
        body:not(.dark-mode) #themeSunIcon,
        body:not(.dark-mode) #dthemeSunIcon,
        body:not(.dark-mode) .theme-sun-icon {
            display: none !important;
        }
        body:not(.dark-mode) #themeMoonIcon,
        body:not(.dark-mode) #dthemeMoonIcon,
        body:not(.dark-mode) .theme-moon-icon {
            display: inline-flex !important;
        }

        body.dark-mode #themeMoonIcon,
        body.dark-mode #dthemeMoonIcon,
        body.dark-mode .theme-moon-icon {
            display: none !important;
        }
        body.dark-mode #themeSunIcon,
        body.dark-mode #dthemeSunIcon,
        body.dark-mode .theme-sun-icon {
            display: inline-flex !important;
        }

        /* Mobile Header Actions and Day/Night Mode Button */
        .mobile-header-actions {
            display: flex;
            align-items: center;
            gap: 6px;
            flex-shrink: 0;
        }
        .header-action-btn {
            width: 38px;
            height: 38px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.04);
            border: 1.5px solid var(--border-color);
            color: var(--dark);
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            user-select: none;
            flex-shrink: 0;
        }
        .header-action-btn i {
            font-size: 20px;
            transition: transform 0.2s ease;
        }
        .header-action-btn:hover {
            background: rgba(255, 184, 0, 0.12);
            color: var(--primary);
            border-color: rgba(255, 184, 0, 0.35);
            transform: scale(1.05);
        }
        body.dark-mode .header-action-btn {
            background: rgba(255, 255, 255, 0.08);
            border-color: rgba(255, 255, 255, 0.12);
            color: #ffffff;
        }
        body.dark-mode .header-action-btn:hover {
            background: rgba(255, 184, 0, 0.2);
            color: var(--primary);
            border-color: rgba(255, 184, 0, 0.4);
        }

        /* Bottom Sticky tab bar navigation */
        .bottom-nav-bar {
            position: fixed;
            bottom: 16px;
            left: 50%;
            transform: translateX(-50%);
            width: calc(100% - 32px);
            max-width: 480px;
            height: 66px;
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1.5px solid rgba(0, 0, 0, 0.05);
            border-radius: 40px; /* Highly curved "curved mast sa lage" like the screenshot */
            display: flex;
            justify-content: space-around;
            align-items: center;
            z-index: 1000;
            box-shadow: 0 12px 35px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.05);
            padding: 0 8px;
            transition: all 0.3s;
        }

        .bottom-nav-item {
            text-decoration: none;
            color: #8f9ca2;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            font-weight: 800;
            gap: 2px;
            cursor: pointer;
            height: 52px;
            min-width: 72px;
            border-radius: 26px; /* Pill/capsule background shape */
            transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .bottom-nav-item.active {
            color: var(--primary) !important;
            background: rgba(255, 184, 0, 0.18) !important; /* Premium rich translucent golden glow */
            box-shadow: inset 0 1px 3px rgba(255, 184, 0, 0.12);
        }

        .bottom-nav-item i {
            font-size: 20px;
            transition: transform 0.2s ease;
        }

        .bottom-nav-item.active i {
            transform: translateY(-1px) scale(1.05);
        }

        @media (hover: hover) {
            .bottom-nav-item:hover:not(.active) {
                color: var(--primary);
                background: rgba(255, 184, 0, 0.04);
            }
        }

        /* Account profiles page visual elements */
        .profile-hero {
            background: var(--light-grey);
            border: 1px solid var(--border-color);
            border-radius: 20px;
            padding: 30px;
            text-align: center;
            margin-bottom: 20px;
        }

        .premium-unlocked-badge {
            background: var(--green);
            color: white;
            font-size: 11px;
            font-weight: 900;
            border-radius: 20px;
            padding: 5px 14px;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            margin-top: 10px;
        }

        /* Continuous Dynamic Screen watermark for anti-screenshot */
        .screen-anti-leak-layer {
            display: none !important;
            position: fixed;
            inset: 0;
            pointer-events: none;
            z-index: 999999;
            opacity: 0.025;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            grid-template-rows: repeat(4, 1fr);
            padding: 30px;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            color: var(--dark);
            font-weight: bold;
        }

        .leak-label {
            transform: rotate(-35deg);
            white-space: nowrap;
        }

        /* Prevent scrollbar lines or outlines during scroll */
        ::-webkit-scrollbar {
            width: 4px;
            height: 4px;
        }
        ::-webkit-scrollbar-track {
            background: transparent !important;
        }
        ::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, 0.1) !important;
            border-radius: 10px !important;
        }
        .dark-mode ::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.1) !important;
        }

        /* Premium/Promo Boxes Day & Night Mode Theme */
        .premium-promo-box {
            background: linear-gradient(135deg, #FFF9EB 0%, #FFECD1 100%) !important;
            border: 2px solid #FFD39B !important;
            color: #78350f !important;
            border-radius: 24px;
            padding: 22px;
            box-shadow: 0 10px 25px rgba(255,184,0,0.06);
            margin-bottom: 20px;
            position: relative;
            overflow: hidden;
            text-align: left;
        }
        .premium-promo-box h4 {
            color: #78350f !important;
        }
        .premium-promo-box p {
            color: #92400e !important;
        }
        .premium-promo-box span {
            color: #78350f !important;
        }
        .premium-promo-box .promo-inner {
            background: rgba(255,255,255,0.65) !important;
            border: 1px solid #FFE4C4 !important;
            color: #78350f !important;
        }
        .premium-promo-box .promo-inner div, .premium-promo-box .promo-inner span {
            color: #78350f !important;
        }

        /* Dark mode overrides for Premium Promo Box */
        .dark-mode .premium-promo-box {
            background: linear-gradient(135deg, #2A1F0D 0%, #1A1204 100%) !important;
            border: 2px solid #5C4314 !important;
            color: #FCD34D !important;
            box-shadow: 0 10px 25px rgba(0,0,0,0.3) !important;
        }
        .dark-mode .premium-promo-box h4 {
            color: #FCD34D !important;
        }
        .dark-mode .premium-promo-box p {
            color: #FBBF24 !important;
        }
        .dark-mode .premium-promo-box span {
            color: #FCD34D !important;
        }
        .dark-mode .premium-promo-box .promo-inner {
            background: rgba(42, 31, 13, 0.4) !important;
            border: 1px solid #5C4314 !important;
            color: #FBBF24 !important;
        }
        .dark-mode .premium-promo-box .promo-inner div, .dark-mode .premium-promo-box .promo-inner span {
            color: #FBBF24 !important;
        }

        /* ==========================================
           MASTER RESPONSIVE & ADAPTIVE STYLING SHIELD
           Guarantees stunning layout across all 
           Mobile, Tablet, Laptop, and Desktop Models
           ========================================== */

        /* 1. Global Container Limits & Fluid Transitions */
        @media (max-width: 480px) {
            .screen {
                padding: 12px 12px 90px 12px !important;
            }
            .header, .back-nav-bar {
                padding: 10px 12px !important;
                border-radius: 14px !important;
                margin: 8px auto !important;
                max-width: calc(100% - 16px) !important;
            }
            .app-logo {
                width: 34px !important;
                height: 34px !important;
                border-radius: 0 !important;
                border: none !important;
                padding: 0 !important;
                background: transparent !important;
            }
            .greet-title {
                font-size: 14.5px !important;
            }
            .greet-sub {
                font-size: 9px !important;
            }
            .back-nav-bar span {
                font-size: 13.5px !important;
            }
            
            /* Tighten outlines and cards list */
            .outline-item-card {
                padding: 12px !important;
                gap: 10px !important;
                border-radius: 10px !important;
                margin-bottom: 10px !important;
            }
            .outline-item-img {
                width: 38px !important;
                height: 38px !important;
                border-radius: 8px !important;
            }
            .outline-item-title {
                font-size: 13.5px !important;
            }
            .outline-item-subtitle {
                font-size: 10.5px !important;
            }
            
            /* Dynamic sliding banners on narrow screens */
            .slider-container {
                border-radius: 14px !important;
                margin-bottom: 16px !important;
            }
            .dot {
                width: 5px !important;
                height: 5px !important;
            }
            .dot.active {
                width: 14px !important;
            }
        }

        /* 2. Tablet Scaling Adjustments */
        @media (min-width: 481px) and (max-width: 1024px) {
            .screen {
                max-width: 90% !important;
                padding: 24px !important;
                padding-bottom: 110px !important;
            }
            .header, .back-nav-bar {
                max-width: 100% !important;
                border-radius: 20px !important;
            }
            .slider-container {
                border-radius: 24px !important;
            }
            .account-guest-grid, .account-auth-grid, .account-shared-grid {
                display: grid !important;
                grid-template-columns: 1fr 1fr !important;
                gap: 20px !important;
                align-items: stretch !important;
                margin-bottom: 20px !important;
            }
            .account-guest-features-card {
                display: flex !important;
                flex-direction: column !important;
                justify-content: space-between !important;
            }
            .account-card-box {
                margin-bottom: 0 !important;
                height: 100% !important;
                box-sizing: border-box !important;
            }
        }

        /* Instructions Screen Base Unified Layout */
        .instructions-layout-wrapper {
            display: flex;
            flex-direction: column;
            gap: 0;
            width: 100%;
        }
        .instructions-left-col,
        .instructions-right-col {
            width: 100%;
        }

        /* Account Screen Base Unified Structure */
        .account-guest-grid, .account-auth-grid, .account-shared-grid {
            display: flex;
            flex-direction: column;
            gap: 0;
            width: 100%;
        }
        .account-guest-features-card {
            display: none;
        }

        /* Default mobile/tablet state for desktop nav and desktop footer */
        .desktop-nav-links {
            display: none;
        }
        .desktop-main-footer {
            display: none !important;
        }
        .mobile-only-legal-box {
            display: block;
        }

        /* 3. Laptop & Desktop High-End Optimization */
        @media (min-width: 1025px) {
            body {
                min-height: 100vh !important;
                display: flex !important;
                flex-direction: column !important;
                background: #f8fafc;
            }
            body.dark-mode {
                background: #0b0f19;
            }

            /* Main Header Stretched for Computer & Laptop View */
            .header {
                width: 95% !important;
                max-width: 1400px !important;
                padding: 14px 36px !important;
                border-radius: 22px !important;
                margin: 16px auto 24px auto !important;
                background: rgba(255, 255, 255, 0.88) !important;
                backdrop-filter: blur(20px) !important;
                -webkit-backdrop-filter: blur(20px) !important;
                border: 1.5px solid var(--border-color) !important;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04) !important;
                position: sticky !important;
                top: 14px !important;
                z-index: 999 !important;
                display: flex !important;
                align-items: center !important;
                justify-content: space-between !important;
                box-sizing: border-box !important;
                transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
            }
            body.dark-mode .header {
                background: rgba(15, 23, 42, 0.9) !important;
                border-color: rgba(255, 255, 255, 0.08) !important;
                box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4) !important;
            }

            /* Remove back arrow navigation bar completely on computer view */
            .back-nav-bar {
                display: none !important;
            }

            .app-branding {
                gap: 14px !important;
                cursor: pointer;
            }
            .app-branding .app-logo {
                width: 44px !important;
                height: 44px !important;
                border-radius: 0 !important;
                border: none !important;
                padding: 0 !important;
                background: transparent !important;
                box-shadow: none !important;
                transition: transform 0.2s ease !important;
            }
            .app-branding:hover .app-logo {
                transform: scale(1.05);
            }
            .app-branding .greet-title {
                font-size: 16.5px !important;
                font-weight: 900 !important;
                letter-spacing: -0.2px !important;
                color: var(--dark) !important;
            }
            .app-branding .greet-sub {
                font-size: 10.5px !important;
                font-weight: 800 !important;
                letter-spacing: 0.6px !important;
                color: var(--primary) !important;
            }

            .desktop-nav-links {
                display: flex !important;
                align-items: center;
                gap: 4px;
                background: rgba(0, 0, 0, 0.035);
                border-radius: 99px;
                padding: 4px 6px;
                border: 1px solid var(--border-color);
                box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.02);
            }
            body.dark-mode .desktop-nav-links {
                background: rgba(255, 255, 255, 0.04);
                border-color: rgba(255, 255, 255, 0.08);
                box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.2);
            }
            .desktop-nav-link {
                display: inline-flex;
                align-items: center;
                gap: 7px;
                padding: 8px 18px;
                border-radius: 99px;
                font-size: 13.5px;
                font-weight: 800;
                color: var(--grey-text);
                cursor: pointer;
                transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
                user-select: none;
                white-space: nowrap;
            }
            .desktop-nav-link i {
                font-size: 17px !important;
                width: 18px !important;
                height: 18px !important;
                align-items: center !important;
                justify-content: center !important;
                flex-shrink: 0 !important;
                transition: transform 0.2s ease;
            }
            .desktop-nav-link:not(.desktop-theme-btn) i {
                display: inline-flex !important;
            }
            .desktop-nav-link:hover {
                color: var(--dark);
                background: rgba(0, 0, 0, 0.04);
            }
            .desktop-nav-link:hover i {
                transform: scale(1.1);
            }
            body.dark-mode .desktop-nav-link:hover {
                color: #ffffff;
                background: rgba(255, 255, 255, 0.08);
            }
            .desktop-nav-link.active {
                background: var(--primary) !important;
                color: #111111 !important;
                font-weight: 900 !important;
                box-shadow: 0 4px 14px rgba(255, 184, 0, 0.28);
            }
            .desktop-nav-link.active:hover {
                background: var(--primary) !important;
                color: #111111 !important;
            }
            .desktop-theme-btn {
                border-left: 1px solid var(--border-color);
                border-radius: 99px;
                margin-left: 4px;
                padding-left: 14px;
                padding-right: 14px;
            }
            body.dark-mode .desktop-theme-btn {
                border-left-color: rgba(255, 255, 255, 0.1);
            }
            .desktop-theme-btn:hover {
                background: rgba(255, 184, 0, 0.12) !important;
                color: var(--primary) !important;
            }

            .mobile-header-actions {
                display: none !important;
            }

            .bottom-nav-bar {
                display: none !important;
            }

            .screen {
                flex: 1 0 auto !important;
                width: 95% !important;
                max-width: 1400px !important;
                box-sizing: border-box !important;
                padding: 10px 24px 36px 24px !important;
                margin: 0 auto !important;
                box-shadow: none !important;
                background: transparent !important;
                border: none !important;
            }
            .screen:not(.active) {
                display: none !important;
                height: 0 !important;
                min-height: 0 !important;
                margin: 0 !important;
                padding: 0 !important;
                overflow: hidden !important;
            }
            .screen.active {
                display: block !important;
            }

            #ad-container-home-top,
            #ad-container-home-bottom,
            #ad-container-category-bottom,
            #ad-container-results-bottom {
                display: none;
                margin: 0 !important;
                padding: 0 !important;
                height: 0 !important;
                min-height: 0 !important;
                max-height: 0 !important;
                overflow: hidden !important;
            }

            #ad-container-home-top.ad-filled,
            #ad-container-home-bottom.ad-filled,
            #ad-container-category-bottom.ad-filled,
            #ad-container-results-bottom.ad-filled {
                display: block !important;
                height: auto !important;
                max-height: none !important;
                overflow: visible !important;
            }

            #ad-container-home-top.ad-filled {
                margin: 14px 0 6px !important;
            }

            #ad-container-home-bottom.ad-filled,
            #ad-container-category-bottom.ad-filled {
                margin: 20px 0 !important;
            }

            #ad-container-home-top:empty,
            #ad-container-home-bottom:empty,
            #ad-container-category-bottom:empty,
            #ad-container-results-bottom:empty,
            ins.adsbygoogle[data-ad-status="unfilled"],
            ins.adsbygoogle[data-ad-status="unfilled"] *,
            .ad-unfilled,
            ins.adsbygoogle:empty {
                display: none !important;
                height: 0 !important;
                min-height: 0 !important;
                max-height: 0 !important;
                margin: 0 !important;
                padding: 0 !important;
                border: none !important;
            }

            /* Home Screen Specific Enhancements on Laptop & PC - True 21:9 Aspect Ratio */
            #scr-home .slider-container {
                width: 100% !important;
                aspect-ratio: 21 / 9 !important;
                max-height: none !important;
                height: auto !important;
                border-radius: 24px !important;
                margin-bottom: 28px !important;
                box-shadow: 0 20px 45px -10px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.04) !important;
                border: 1.5px solid var(--border-color) !important;
                overflow: hidden !important;
                position: relative !important;
                background: #000000 !important;
            }
            #scr-home .slides-wrapper {
                aspect-ratio: 21 / 9 !important;
                width: 100% !important;
                height: 100% !important;
                border-radius: 24px !important;
            }
            #scr-home .slide-item {
                aspect-ratio: 21 / 9 !important;
                width: 100% !important;
                min-width: 100% !important;
                height: 100% !important;
                border-radius: 24px !important;
                position: relative !important;
                overflow: hidden !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                background: #000000 !important;
            }
            #scr-home .slide-item-img {
                width: 100% !important;
                height: 100% !important;
                object-fit: cover !important;
                object-position: center !important;
                border-radius: 24px !important;
            }
            #scr-home .slide-item-blur {
                border-radius: 24px !important;
            }

            /* Sleek Important Notices Bar */
            #scr-home .section-header-title {
                font-size: 17px !important;
                font-weight: 850 !important;
                letter-spacing: -0.3px !important;
                margin: 20px 0 12px 0 !important;
                display: flex !important;
                align-items: center !important;
                gap: 9px !important;
                color: var(--dark) !important;
            }
            #scr-home .scrolling-notifications {
                border-radius: 18px !important;
                padding: 14px 20px !important;
                background: rgba(255, 184, 0, 0.07) !important;
                border: 1.5px solid rgba(255, 184, 0, 0.28) !important;
                margin-bottom: 26px !important;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02) !important;
            }
            body.dark-mode #scr-home .scrolling-notifications {
                background: rgba(255, 184, 0, 0.09) !important;
                border-color: rgba(255, 184, 0, 0.22) !important;
            }

            /* Desktop Grid Layouts for Quick Access & Modules */
            .grid-blocks, #scr-home .grid-blocks {
                display: grid !important;
                grid-template-columns: repeat(2, 1fr) !important;
                gap: 22px !important;
                margin-bottom: 30px !important;
            }
            .library-card, #scr-home .library-card {
                padding: 24px 28px !important;
                border-radius: 22px !important;
                background: var(--bg-card) !important;
                border: 1.5px solid var(--border-color) !important;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.03) !important;
                display: flex !important;
                align-items: center !important;
                gap: 18px !important;
                cursor: pointer !important;
                position: relative !important;
                overflow: hidden !important;
                transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
            }
            body.dark-mode .library-card, body.dark-mode #scr-home .library-card {
                background: rgba(18, 24, 38, 0.85) !important;
                border-color: rgba(255, 255, 255, 0.08) !important;
            }
            .library-card:hover, #scr-home .library-card:hover {
                transform: translateY(-4px) !important;
                box-shadow: 0 18px 40px rgba(0, 0, 0, 0.08) !important;
                border-color: var(--primary) !important;
            }
            body.dark-mode .library-card:hover, body.dark-mode #scr-home .library-card:hover {
                box-shadow: 0 18px 40px rgba(0, 0, 0, 0.45) !important;
            }
            .library-card > div:first-child, #scr-home .library-card > div:first-child {
                width: 52px !important;
                height: 52px !important;
                border-radius: 14px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                flex-shrink: 0 !important;
            }
            .library-card > div:first-child i, #scr-home .library-card > div:first-child i {
                font-size: 26px !important;
            }
            .library-card .library-info h3, #scr-home .library-card .library-info h3 {
                font-size: 17px !important;
                font-weight: 850 !important;
                color: var(--dark) !important;
                letter-spacing: -0.3px !important;
            }
            .library-card .library-info p, #scr-home .library-card .library-info p {
                font-size: 13px !important;
                font-weight: 600 !important;
                color: var(--grey-text) !important;
                margin-top: 4px !important;
            }

            #categoryGridArea, #subcategoryGridArea, #topicsGridArea {
                display: grid !important;
                grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)) !important;
                gap: 18px !important;
            }

            .outline-item-card {
                margin-bottom: 0 !important;
                height: 100% !important;
                border-radius: 18px !important;
                padding: 18px 20px !important;
                box-sizing: border-box !important;
                transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
            }
            .outline-item-card:hover {
                transform: translateY(-3px) !important;
                box-shadow: 0 14px 30px rgba(0, 0, 0, 0.06) !important;
                border-color: var(--primary) !important;
            }

            /* Account Screen on Desktop & Laptop */
            #scr-acc {
                max-width: 1400px !important;
                width: 95% !important;
                margin: 0 auto !important;
            }

            #studentAuthFormPanel, #studentAuthenticatedProfileArea {
                width: 100% !important;
                max-width: 100% !important;
                margin: 0 0 24px 0 !important;
            }

            .account-guest-grid {
                display: grid !important;
                grid-template-columns: 1.05fr 0.95fr !important;
                gap: 24px !important;
                align-items: stretch !important;
                margin-bottom: 0 !important;
            }

            .account-guest-features-card {
                display: flex !important;
                flex-direction: column !important;
                justify-content: space-between !important;
                margin-bottom: 0 !important;
                height: 100% !important;
            }

            .account-auth-grid {
                display: grid !important;
                grid-template-columns: 1.05fr 0.95fr !important;
                gap: 24px !important;
                align-items: stretch !important;
                margin-bottom: 0 !important;
            }

            .account-shared-grid {
                display: grid !important;
                grid-template-columns: 1fr 1fr !important;
                gap: 24px !important;
                align-items: stretch !important;
                margin-bottom: 0 !important;
            }

            .account-card-box {
                margin-bottom: 0 !important;
                height: 100% !important;
                box-sizing: border-box !important;
                transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.22s ease !important;
            }
            .account-card-box:hover {
                transform: translateY(-2px) !important;
                box-shadow: 0 16px 36px rgba(0, 0, 0, 0.06) !important;
            }

            #scr-acc .social-grid {
                grid-template-columns: repeat(2, 1fr) !important;
                gap: 12px !important;
            }

            .social-link-btn {
                transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1) !important;
            }
            .social-link-btn:hover {
                transform: translateY(-2px) !important;
                box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06) !important;
            }

            /* Payment Screen on Desktop */
            #scr-pay > div {
                max-width: 840px !important;
                padding: 36px 40px !important;
                border-radius: 28px !important;
            }

            /* Instructions / Start Test & Guidelines Screen on Desktop */
            #scr-instructions {
                max-width: 1240px !important;
                width: 95% !important;
                margin: 0 auto 30px auto !important;
                padding: 10px 20px 30px 20px !important;
            }
            .instructions-layout-wrapper {
                display: grid !important;
                grid-template-columns: 1fr 1.08fr !important;
                gap: 24px !important;
                align-items: stretch !important;
            }
            .instructions-left-col {
                display: flex !important;
                flex-direction: column !important;
                justify-content: space-between !important;
                background: var(--light-grey) !important;
                border: 1.5px solid var(--border-color) !important;
                border-radius: 24px !important;
                padding: 24px 26px !important;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.02) !important;
            }
            .instructions-left-col .btn-fill-prime {
                margin-top: auto !important;
                margin-bottom: 0 !important;
                height: 48px !important;
                font-size: 14.5px !important;
                font-weight: 900 !important;
                border-radius: 16px !important;
                width: 100% !important;
            }
            .instructions-right-col {
                display: flex !important;
                flex-direction: column !important;
            }
            .instructions-right-col .guidelines-card {
                height: 100% !important;
                margin-bottom: 0 !important;
                box-sizing: border-box !important;
                background: var(--light-grey) !important;
                border: 1.5px solid var(--border-color) !important;
                border-radius: 24px !important;
                padding: 24px 26px !important;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.02) !important;
                display: flex !important;
                flex-direction: column !important;
                justify-content: flex-start !important;
            }

            /* Exam Engine CBT Full Page Experience for Laptop, PC & Tablets (Not a popup) */
            #test-engine-panel {
                position: fixed !important;
                inset: 0 !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                transform: none !important;
                width: 100vw !important;
                max-width: 100vw !important;
                height: 100vh !important;
                max-height: 100vh !important;
                background-color: var(--light-grey) !important;
                border-radius: 0 !important;
                border: none !important;
                box-shadow: none !important;
                z-index: 9999 !important;
                display: none;
                flex-direction: column !important;
                overflow: hidden !important;
            }
            body.dark-mode #test-engine-panel {
                background-color: #0b0f17 !important;
                border: none !important;
                box-shadow: none !important;
            }

            .engine-header {
                padding: 12px 28px !important;
                margin: 0 !important;
                border-radius: 0 !important;
                background: rgba(255, 255, 255, 0.96) !important;
                backdrop-filter: blur(20px) !important;
                border-top: none !important;
                border-left: none !important;
                border-right: none !important;
                border-bottom: 1.5px solid var(--border-color) !important;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03) !important;
            }
            body.dark-mode .engine-header {
                background: rgba(15, 23, 42, 0.96) !important;
                border-bottom-color: rgba(255, 255, 255, 0.08) !important;
            }

            #testEngineLogo {
                width: 38px !important;
                height: 38px !important;
                border-radius: 0 !important;
                border: none !important;
                padding: 0 !important;
                background: transparent !important;
            }
            #testEngineName {
                font-size: 15px !important;
                font-weight: 900 !important;
            }
            #testTimerTextContainer {
                padding: 6px 16px !important;
                font-size: 15px !important;
                border-radius: 12px !important;
                gap: 6px !important;
            }
            #testTimerText {
                font-size: 15px !important;
                font-weight: 950 !important;
            }

            .engine-content {
                flex: 1 1 auto !important;
                overflow-y: auto !important;
                padding: 24px 32px !important;
                box-sizing: border-box !important;
            }
            .engine-content > div {
                max-width: 1060px !important;
                margin: 0 auto !important;
                width: 100% !important;
            }
            .engine-question-num {
                font-size: 13px !important;
                font-weight: 600 !important;
                letter-spacing: 0.5px !important;
                margin-bottom: 16px !important;
                padding-bottom: 12px !important;
                border-bottom: 1px solid var(--border-color) !important;
            }
            .engine-question-text {
                font-size: 19px !important;
                line-height: 1.65 !important;
                font-weight: 500 !important;
                margin-bottom: 24px !important;
                color: var(--dark) !important;
            }
            .option-button {
                padding: 16px 22px !important;
                font-size: 15px !important;
                font-weight: 450 !important;
                border-radius: 14px !important;
                margin-bottom: 12px !important;
                gap: 14px !important;
                background: #ffffff !important;
                border: 1.5px solid var(--border-color) !important;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02) !important;
                transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
                cursor: pointer !important;
            }
            body.dark-mode .option-button {
                background: #1e293b !important;
                border-color: rgba(255, 255, 255, 0.08) !important;
            }
            .option-button:hover {
                border-color: var(--primary) !important;
                background: rgba(255, 184, 0, 0.05) !important;
                transform: translateX(6px) !important;
                box-shadow: 0 4px 14px rgba(255, 184, 0, 0.12) !important;
            }
            .option-button.selected {
                border-color: var(--primary) !important;
                background: rgba(255, 184, 0, 0.08) !important;
                box-shadow: 0 4px 16px rgba(255, 184, 0, 0.18) !important;
            }
            .option-badge {
                width: 28px !important;
                height: 28px !important;
                border-radius: 8px !important;
                font-size: 12.5px !important;
                font-weight: 600 !important;
                flex-shrink: 0 !important;
            }

            .engine-footer {
                height: 68px !important;
                max-width: 100% !important;
                margin: 0 !important;
                width: 100% !important;
                border-radius: 0 !important;
                padding: 0 32px !important;
                background: rgba(255, 255, 255, 0.96) !important;
                backdrop-filter: blur(20px) !important;
                border-top: 1.5px solid var(--border-color) !important;
                border-left: none !important;
                border-right: none !important;
                border-bottom: none !important;
                box-shadow: 0 -4px 18px rgba(0, 0, 0, 0.04) !important;
                display: flex !important;
                align-items: center !important;
                justify-content: space-between !important;
                box-sizing: border-box !important;
            }
            body.dark-mode .engine-footer {
                background: rgba(15, 23, 42, 0.96) !important;
                border-top-color: rgba(255, 255, 255, 0.08) !important;
            }
            .engine-btn-nav {
                width: 52px !important;
                height: 44px !important;
                border-radius: 22px !important;
                font-size: 20px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
            }
            .engine-btn-nav:hover:not(:disabled) {
                transform: scale(1.08) !important;
                background: var(--primary) !important;
                color: #111111 !important;
                border-color: var(--primary) !important;
            }
            .review-badge-btn {
                height: 44px !important;
                padding: 0 24px !important;
                font-size: 12.5px !important;
                font-weight: 850 !important;
                border-radius: 22px !important;
                transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
            }
            .review-badge-btn:hover {
                transform: translateY(-1px) !important;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
            }

            /* Drawers and Modals (Palette Drawer, Question Sheet) on Desktop */
            .drawer-sheet {
                position: fixed !important;
                top: 50% !important;
                left: 50% !important;
                bottom: auto !important;
                right: auto !important;
                transform: translate(-50%, -50%) !important;
                width: 92% !important;
                max-width: 560px !important;
                border-radius: 24px !important;
                padding: 28px !important;
                box-shadow: 0 25px 80px rgba(0, 0, 0, 0.35) !important;
                border: 1.5px solid var(--border-color) !important;
                max-height: 85vh !important;
                box-sizing: border-box !important;
            }
            body.dark-mode .drawer-sheet {
                background-color: #1e293b !important;
                border-color: rgba(255, 255, 255, 0.1) !important;
            }
            .palette-grid {
                grid-template-columns: repeat(6, 1fr) !important;
                gap: 10px !important;
                max-height: 45vh !important;
                overflow-y: auto !important;
                padding: 8px 4px !important;
            }
            .palette-cell {
                height: 42px !important;
                font-size: 13px !important;
                font-weight: 850 !important;
                border-radius: 12px !important;
                transition: transform 0.18s ease, box-shadow 0.18s ease !important;
            }
            .palette-cell:hover {
                transform: scale(1.08) !important;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12) !important;
            }

            /* Results Screen on Desktop / Computer View */
            #scr-results {
                width: 95% !important;
                max-width: 1240px !important;
                margin: 0 auto !important;
                padding-top: 10px !important;
                padding-bottom: 24px !important;
            }

            #scr-results .scorecard-block {
                padding: 28px 32px !important;
                border-radius: 26px !important;
                margin-bottom: 18px !important;
            }

            #scr-results #analysisDetailViewerCard {
                margin-bottom: 16px !important;
                min-height: auto !important;
                padding: 24px 28px !important;
                border-radius: 22px !important;
            }

            #scr-results #ad-container-results-bottom {
                display: none !important;
                margin: 0 !important;
                padding: 0 !important;
                height: 0 !important;
            }

            #scr-results button.btn-fill-prime {
                margin-top: 14px !important;
                margin-bottom: 0 !important;
                max-width: 300px !important;
                margin-left: auto !important;
                margin-right: auto !important;
                border-radius: 24px !important;
                padding: 12px 24px !important;
                font-size: 14px !important;
                height: 48px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
            }

            /* Payment Screen on Desktop / Laptop / PC */
            #scr-pay {
                width: 95% !important;
                max-width: 980px !important;
                margin: 0 auto !important;
                padding: 16px 24px 36px 24px !important;
            }

            #scr-pay .pay-step-block {
                width: 100% !important;
                max-width: 100% !important;
                margin: 0 auto !important;
            }

            #scr-pay .pay-step1-grid,
            #scr-pay .pay-step2-grid,
            #scr-pay .pay-step3-grid {
                display: grid !important;
                grid-template-columns: 1fr 1fr !important;
                gap: 24px !important;
                align-items: start !important;
            }

            #scr-pay .pay-step1-left,
            #scr-pay .pay-step1-right,
            #scr-pay .pay-step2-left,
            #scr-pay .pay-step2-right,
            #scr-pay .pay-step3-left,
            #scr-pay .pay-step3-right {
                width: 100% !important;
                display: flex !important;
                flex-direction: column !important;
            }

            #scr-pay #unifiedPaidBtn {
                max-width: 100% !important;
                width: 100% !important;
            }

            /* Hide mobile legal box in Account tab on Desktop */
            .mobile-only-legal-box {
                display: none !important;
            }

            /* High-End Polished Sticky Footer for Laptop & Desktop */
            .desktop-main-footer {
                display: block !important;
                margin-top: auto !important;
                width: 100% !important;
                background: rgba(255, 255, 255, 0.88) !important;
                backdrop-filter: blur(20px) !important;
                -webkit-backdrop-filter: blur(20px) !important;
                border-top: 1.5px solid var(--border-color) !important;
                padding: 16px 32px !important;
                color: var(--dark) !important;
                position: relative !important;
                z-index: 100 !important;
                box-sizing: border-box !important;
            }
            body.dark-mode .desktop-main-footer {
                background: rgba(15, 23, 42, 0.92) !important;
                border-top-color: rgba(255, 255, 255, 0.08) !important;
            }
            /* Hide desktop footer inside exam test screen */
            #scr-exam.active ~ .desktop-main-footer,
            #scr-test.active ~ .desktop-main-footer {
                display: none !important;
            }
            .desktop-footer-bottom {
                width: 100%;
                max-width: 1400px;
                margin: 0 auto;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 13.5px;
                color: var(--grey-text);
                font-weight: 600;
            }
            .desktop-footer-copyright {
                display: flex;
                align-items: center;
                gap: 9px;
                font-weight: 750;
                color: var(--dark);
                letter-spacing: -0.2px;
                font-size: 13px;
            }
            .desktop-footer-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #10b981;
                display: inline-block;
                box-shadow: 0 0 8px rgba(16, 185, 129, 0.6);
            }
            .desktop-footer-links-inline {
                display: flex;
                align-items: center;
                gap: 6px;
            }
            .desktop-footer-link {
                text-decoration: none;
                color: var(--grey-text);
                font-size: 13px;
                font-weight: 700;
                display: inline-flex;
                align-items: center;
                gap: 6px;
                cursor: pointer;
                transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                background: transparent;
                border: 1px solid transparent;
                padding: 6px 12px;
                border-radius: 10px;
            }
            .desktop-footer-link i {
                font-size: 15px;
                opacity: 0.8;
            }
            .desktop-footer-link:hover {
                color: var(--primary) !important;
                background: rgba(255, 184, 0, 0.08) !important;
                border-color: rgba(255, 184, 0, 0.2) !important;
                transform: translateY(-1px);
            }
            .desktop-footer-sep {
                opacity: 0.2;
                font-size: 10px;
                user-select: none;
            }
        }

        /* 4. Bottom Tab Bar Responsiveness */
        @media (max-width: 360px) {
            .bottom-nav-bar {
                height: 58px !important;
                bottom: 8px !important;
                width: calc(100% - 16px) !important;
                padding: 0 4px !important;
            }
            .bottom-nav-item {
                min-width: 56px !important;
                height: 44px !important;
                font-size: 9px !important;
                border-radius: 22px !important;
            }
            .bottom-nav-item i {
                font-size: 16px !important;
            }
        }
        @media (min-width: 1025px) {
            .bottom-nav-bar {
                display: none !important;
            }
        }

        /* 5. Exam Engine Adaptive Framework */
        @media (max-width: 480px) {
            .engine-header {
                margin: 8px 8px 4px 8px !important;
                border-radius: 14px !important;
                padding: 8px 10px !important;
            }
            .engine-content {
                padding: 14px !important;
            }
            .engine-question-text {
                font-size: 16px !important;
                line-height: 1.45 !important;
                margin-bottom: 18px !important;
            }
            .option-button {
                padding: 12px !important;
                font-size: 13px !important;
                gap: 8px !important;
                margin-bottom: 8px !important;
                border-radius: 10px !important;
            }
            .option-badge {
                width: 22px !important;
                height: 22px !important;
                border-radius: 5px !important;
                font-size: 10px !important;
            }
            .engine-footer {
                height: 56px !important;
                margin: 4px 8px 10px 8px !important;
                border-radius: 28px !important;
            }
        }

        /* 6. Universal Modal Overlay Adaptability & Anti-Clipping Logic */
        #websitePopupOverlayModal,
        #paymentSuccessPopupModal,
        #premiumBlockerModal,
        #testPauseResumeModal,
        #submitConfirmModal,
        #reportQuestionModal,
        #helpdeskModalOverlay,
        #customDialogOverlay,
        #customPromptOverlay,
        #copyrightPdfOverlay {
            overflow-y: auto !important;
            padding: 12px !important;
            box-sizing: border-box !important;
        }

        #websitePopupOverlayModal[style*="display: flex"],
        #paymentSuccessPopupModal[style*="display: flex"],
        #premiumBlockerModal[style*="display: flex"],
        #testPauseResumeModal[style*="display: flex"],
        #submitConfirmModal[style*="display: flex"],
        #reportQuestionModal[style*="display: flex"],
        #helpdeskModalOverlay[style*="display: flex"],
        #customDialogOverlay[style*="display: flex"],
        #customPromptOverlay[style*="display: flex"],
        #copyrightPdfOverlay[style*="display: flex"] {
            display: flex !important;
            align-items: flex-start !important;
            justify-content: center !important;
        }

        @media (min-height: 641px) {
            #websitePopupOverlayModal[style*="display: flex"],
            #paymentSuccessPopupModal[style*="display: flex"],
            #premiumBlockerModal[style*="display: flex"],
            #testPauseResumeModal[style*="display: flex"],
            #submitConfirmModal[style*="display: flex"],
            #reportQuestionModal[style*="display: flex"],
            #helpdeskModalOverlay[style*="display: flex"],
            #customDialogOverlay[style*="display: flex"],
            #customPromptOverlay[style*="display: flex"],
            #copyrightPdfOverlay[style*="display: flex"] {
                align-items: center !important;
            }
        }

        #websitePopupOverlayModal > div,
        #paymentSuccessPopupModal > div,
        #premiumBlockerModal > div,
        #testPauseResumeModal > div,
        #submitConfirmModal > div,
        #reportQuestionModal > div,
        #helpdeskModalOverlay > div,
        #customDialogOverlay > div,
        #customPromptOverlay > div,
        #copyrightPdfOverlay > div {
            margin: auto !important;
            max-height: calc(100vh - 40px) !important;
            overflow-y: auto !important;
            box-sizing: border-box !important;
            width: 100% !important;
            border-radius: 20px !important;
            box-shadow: 0 20px 50px rgba(0,0,0,0.25) !important;
            border: 1px solid rgba(0, 0, 0, 0.05) !important;
        }

        body.dark-mode #websitePopupOverlayModal > div,
        body.dark-mode #paymentSuccessPopupModal > div,
        body.dark-mode #premiumBlockerModal > div,
        body.dark-mode #testPauseResumeModal > div,
        body.dark-mode #submitConfirmModal > div,
        body.dark-mode #reportQuestionModal > div,
        body.dark-mode #helpdeskModalOverlay > div,
        body.dark-mode #customDialogOverlay > div,
        body.dark-mode #customPromptOverlay > div,
        body.dark-mode #copyrightPdfOverlay > div {
            border: 1px solid rgba(255, 255, 255, 0.08) !important;
        }

        @media (max-height: 640px) {
            #websitePopupOverlayModal i,
            #paymentSuccessPopupModal i,
            #premiumBlockerModal i,
            #testPauseResumeModal i,
            #submitConfirmModal i,
            #helpdeskModalOverlay i,
            #customDialogOverlay i,
            #customPromptOverlay i {
                display: none !important;
            }
            #websitePopupOverlayModal h2,
            #paymentSuccessPopupModal h2,
            #premiumBlockerModal h2,
            #testPauseResumeModal h2,
            #submitConfirmModal h2,
            #helpdeskModalOverlay h3,
            #customDialogOverlay h3,
            #customPromptOverlay h3 {
                font-size: 16px !important;
                margin-bottom: 8px !important;
            }
            #websitePopupOverlayModal p,
            #paymentSuccessPopupModal p,
            #premiumBlockerModal p,
            #testPauseResumeModal p,
            #submitConfirmModal p,
            #helpdeskModalOverlay p,
            #customDialogOverlay p,
            #customPromptOverlay p {
                font-size: 12px !important;
                margin-bottom: 12px !important;
                line-height: 1.4 !important;
            }
            #websitePopupOverlayModal > div,
            #paymentSuccessPopupModal > div,
            #premiumBlockerModal > div,
            #testPauseResumeModal > div,
            #submitConfirmModal > div,
            #reportQuestionModal > div,
            #helpdeskModalOverlay > div,
            #customDialogOverlay > div,
            #customPromptOverlay > div,
            #copyrightPdfOverlay > div {
                padding: 16px !important;
                max-height: calc(100vh - 20px) !important;
            }
        }
    </style>
    <!-- __CHUNK_SCRIPTS_PLACEHOLDER__ -->
</head>
<body>
    <script>
        try {
            const stored = localStorage.getItem("_preemptive_theme_mode");
            let isDark = false;
            if (stored === "dark") {
                isDark = true;
            } else if (stored === "light") {
                isDark = false;
            } else {
                isDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
            }
            if (isDark) {
                document.body.classList.add("dark-mode");
            } else {
                document.body.classList.remove("dark-mode");
            }
        } catch(e){}
    </script>

    <!-- Initial Portal Loading Splash Screen - Pure Rotating Spinner -->
    <div id="appInitSplash" style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 99999999;
        background: #0b0f19;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: opacity 0.45s cubic-bezier(0.4, 0, 0.2, 1);
        box-sizing: border-box;
        pointer-events: auto;
    ">
        <div style="
            width: 48px;
            height: 48px;
            border: 3.5px solid rgba(245, 158, 11, 0.18);
            border-top-color: #f59e0b;
            border-right-color: #fbbf24;
            border-radius: 50%;
            animation: prayasSpin 0.85s linear infinite;
            box-shadow: 0 0 20px rgba(245, 158, 11, 0.2);
        "></div>
    </div>

    <!-- Continuous Floating Security Watermark Grid -->
    <div class="screen-anti-leak-layer" id="securityOverlay"></div>

    <!-- Beautiful Fullscreen Loading Overlay for Exams -->
    <div id="test-loading-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255, 255, 255, 0.98); z-index: 10000; flex-direction: column; align-items: center; justify-content: center; transition: opacity 0.3s ease;">
        <div style="text-align: center; max-width: 320px;">
            <div style="position: relative; width: 90px; height: 90px; margin: 0 auto 24px;">
                <div style="position: absolute; inset: 0; border: 4px solid rgba(255,107,53,0.1); border-top-color: var(--primary); border-radius: 50%; animation: db-spin 1s cubic-bezier(0.5, 0, 0.5, 1) infinite;"></div>
                <div style="position: absolute; inset: 10px; border: 3px solid rgba(34,197,94,0.05); border-bottom-color: #22c55e; border-radius: 50%; animation: db-spin 1.5s linear infinite reverse;"></div>
                <div style="position: absolute; inset: 20px; background: rgba(255,107,53,0.06); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    <i class="ph-bold ph-exam" style="font-size: 26px; color: var(--primary);"></i>
                </div>
            </div>
            <h3 id="test-loading-title" style="margin: 0; font-weight: 900; font-size: 18px; color: var(--dark); letter-spacing: -0.3px;">Loading...</h3>
        </div>
    </div>

    <!-- MAIN EXAM ENGINE MODULE -->
    <div id="test-engine-panel">
        <div class="engine-header" style="justify-content: space-between; gap: 8px; padding: 8px 14px; min-height: 65px; height: auto;">
            <div style="display: flex; align-items: center; gap: 6px; min-width: 0; flex: 1; justify-content: flex-start;">
                <div class="engine-title-group" onclick="triggerTestInterruptionPause()" style="cursor: pointer; display: flex; align-items: center; gap: 8px; min-width: 0;" title="Pause / Exit Test">
                    <img id="testEngineLogo" class="app-logo" src="${config.logoUrl}" style="flex-shrink: 0; width: 34px; height: 34px; object-fit: contain;">
                    <div style="min-width: 0; display: flex; flex-direction: column; flex: 1;">
                        <span id="testEngineName" style="margin: 0; font-weight: 850; display: block; line-height: 1.35;">--</span>
                        <button class="engine-lang-badge" id="engineLangToggleBtn" onclick="event.stopPropagation(); handleToggleLanguage()" title="Change Language" style="display: none; align-items: center; gap: 3.5px; border: 1px solid var(--border-color); background: var(--light-grey); color: var(--primary); font-size: 8.5px; font-weight: 850; border-radius: 4px; padding: 1.5px 6px; margin-top: 2.5px; cursor: pointer; width: fit-content; font-family: Outfit, sans-serif; transition: all 0.15s ease; user-select: none;">
                            <i class="ph-bold ph-translate" style="font-size: 10px;"></i>
                            <span id="engineLangLabel">HINDI</span>
                        </button>
                    </div>
                </div>
            </div>
            
            <div style="font-weight: 900; color: var(--primary); font-size: 13.5px; font-family: monospace; background: rgba(255,107,53,0.08); padding: 5px 10px; border-radius: 8px; border: 1px solid rgba(255,107,53,0.15); display: flex; align-items: center; gap: 4px; white-space: nowrap; flex-shrink: 0;" id="testTimerTextContainer">
                <i class="ph ph-clock" style="font-size: 12px; font-weight: bold; color: var(--primary);"></i>
                <span id="testTimerText" style="font-family: monospace !important; font-weight: 950;">00:00</span>
            </div>

            <div style="display: flex; align-items: center; gap: 6px; flex-shrink: 0; justify-content: flex-end;">
                <button class="engine-tools-badge" id="btnToggleEngineAnswer" onclick="handleToggleEngineAnswer()" style="height: 34px; width: 34px; padding: 0; display: flex; align-items: center; justify-content: center; border-radius: 50%;" title="Show/Hide Answer & Explanation">
                    <i id="engineAnswerIcon" class="ph-bold ph-eye-slash" style="font-size: 14px;"></i>
                </button>
                <button class="engine-tools-badge" onclick="handleTogglePalette(true)" style="height: 34px; width: 34px; padding: 0; display: flex; align-items: center; justify-content: center; border-radius: 50%;" title="Questions Palette">
                    <i class="ph-bold ph-squares-four" style="font-size: 14px;"></i>
                </button>
                <button class="engine-submit-btn" onclick="handlePromptSubmitTest()" style="height: 34px; padding: 0 12px; font-size: 11px; border-radius: 8px; font-weight: bold; margin: 0; display: flex; align-items: center; justify-content: center;">SUBMIT</button>
            </div>
        </div>

        <div class="watermark-container">
            <img class="watermark-img" src="${config.logoUrl}">
            <div class="watermark-text" id="displayEngineWatermarkText">${(config.appName || "Taiyariya").toUpperCase()}</div>
        </div>

        <div class="engine-content" id="engineQsContent">
            <!-- Questions rendered here -->
        </div>

        <div class="engine-footer">
            <button class="engine-btn-nav" id="btnPrevQ" onclick="handlePrevQuestion()">
                <i class="ph-bold ph-caret-left"></i>
            </button>
            <button class="review-badge-btn" id="btnMarkReview" onclick="handleToggleMarkReview()">
                <i class="ph-bold ph-bookmark-simple"></i> MARK FOR REVIEW
            </button>
            <button class="engine-btn-nav" id="btnNextQ" onclick="handleNextQuestion()">
                <i class="ph-bold ph-caret-right"></i>
            </button>
        </div>
    </div>


    <!-- APP CORE NAVIGATION VISUAL HEADERS -->
    <div class="header" id="mainHeader">
        <div class="app-branding" onclick="handleTabNavigation('home')">
            <img class="app-logo" src="${config.logoUrl}">
            <div class="greetings-box">
                <h4 class="greet-title" id="displayGreetText">${config.studentGreeting}</h4>
                <p class="greet-sub" id="displayGreetSubtitle">${config.studentSubGreeting || 'TAIYARIYA PROFESSIONAL HUB'}</p>
            </div>
        </div>
        <div class="desktop-nav-links" id="desktopNavLinks">
            <div class="desktop-nav-link active" id="dtab-home" onclick="handleTabNavigation('home')">
                <i class="ph ph-house"></i> <span>Home</span>
            </div>
            <div class="desktop-nav-link" id="dtab-tests" onclick="handleTabNavigation('tests')">
                <i class="ph ph-exam"></i> <span>Tests</span>
            </div>
            <div class="desktop-nav-link" id="dtab-pdfs" onclick="handleTabNavigation('pdfs')">
                <i class="ph ph-file-pdf"></i> <span>PDFs</span>
            </div>
            <div class="desktop-nav-link" id="dtab-acc" onclick="handleTabNavigation('acc')">
                <i class="ph ph-user"></i> <span>Account</span>
            </div>
            <div class="desktop-nav-link desktop-theme-btn" id="desktopThemeToggleBtn" onclick="handleToggleThemeMode()" title="Toggle Dark/Light Mode">
                <i class="ph ph-sun theme-sun-icon" id="dthemeSunIcon" style="font-size: 16px;"></i>
                <i class="ph ph-moon theme-moon-icon" id="dthemeMoonIcon" style="font-size: 16px;"></i>
                <span id="dthemeText">Dark</span>
            </div>
        </div>
        <div class="mobile-header-actions" id="mobileHeaderActions" style="display: flex; gap: 6px; align-items: center;">
            <div class="header-action-btn" id="themeToggleBtn" onclick="handleToggleThemeMode()" title="Toggle Day/Night Mode">
                <i class="ph ph-sun theme-sun-icon" id="themeSunIcon" style="font-size: 20px;"></i>
                <i class="ph ph-moon theme-moon-icon" id="themeMoonIcon" style="font-size: 20px;"></i>
            </div>
            <div class="header-action-btn" id="mobileProfileHeaderBtn" onclick="handleTabNavigation('acc')">
                <i class="ph ph-user" id="headerAccountIcon" style="font-size: 20px;"></i>
            </div>
        </div>
    </div>

    <!-- BACK STACK PERSISTENT BAR FOR NESTED LIBS -->
    <div class="back-nav-bar" id="backNavigationHeader" style="display: none; padding: 12px 20px;">
        <button class="back-nav-btn" onclick="handleHistoryBack()">
            <i class="ph ph-arrow-left"></i>
            <span style="font-size: 13px; margin-left: 6px; font-weight: 800;">BACK</span>
        </button>
        <span style="font-size: 13px; font-weight: 900; color: var(--dark); margin-left: auto;" id="navHeaderBreadcrumb">--</span>
    </div>


    <!-- SCREENS CONTAINER -->

    <!-- Home screen -->
    <div id="scr-home" class="screen active">
        <!-- 21:9 Slider carousel -->
        <div class="slider-container" id="studentSliderBlock">
            <div class="slides-wrapper" id="studentSlidesWrapper">
                <!-- Javascript slides injected here -->
            </div>
            <div class="slider-dots" id="studentSliderDots"></div>
        </div>

        <!-- Google AdSense Home Top Ad Slot -->
        <div id="ad-container-home-top" style="display: none; margin: 0; padding: 0; height: 0;"></div>

        <!-- Zomato style Notification Carousel -->
        <div class="section-header-title" id="notifScrollAnchor" style="font-size: 16px; margin-bottom: 6px;">
            <i class="ph-fill ph-bell-ringing" style="color: var(--primary);"></i> Important Notices
        </div>
        <div class="scrolling-notifications" id="studentNoticeBoard">
            <!-- Notices injected -->
        </div>

        <div class="section-header-title">
            <i class="ph-fill ph-grid-four" style="color: var(--primary)"></i> Quick Access Library
        </div>

        <div class="grid-blocks" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;">
            <div class="library-card" onclick="handleOpenCategoryLibrary('test')" style="background: white; border: 1.5px solid var(--border-color); border-radius: 18px; padding: 12px 14px; display: flex; align-items: center; gap: 10px; cursor: pointer; transition: all 0.2s ease;">
                <div style="background: rgba(255, 107, 53, 0.1); width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; shrink-0;">
                    <i class="ph ph-exam" style="font-size: 22px; color: var(--primary);"></i>
                </div>
                <div class="library-info">
                    <h3 style="margin: 0; font-size: 13px; font-weight: 900; color: var(--dark);">Exam Centre</h3>
                    <p style="margin: 2px 0 0; font-size: 10px; color: var(--grey-text); font-weight: bold;">Practice Desk</p>
                </div>
            </div>
            
            <div class="library-card" onclick="handleOpenCategoryLibrary('pdf')" style="background: white; border: 1.5px solid var(--border-color); border-radius: 18px; padding: 12px 14px; display: flex; align-items: center; gap: 10px; cursor: pointer; transition: all 0.2s ease;">
                <div style="background: rgba(34, 197, 94, 0.1); width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; shrink-0;">
                    <i class="ph ph-file-pdf" style="font-size: 22px; color: #22c55e;"></i>
                </div>
                <div class="library-info">
                    <h3 style="margin: 0; font-size: 13px; font-weight: 900; color: var(--dark);">PDF Books</h3>
                    <p style="margin: 2px 0 0; font-size: 10px; color: var(--grey-text); font-weight: bold;">E-Resource Books</p>
                </div>
            </div>
        </div>

        <!-- Saved Questions Hub dashboard segment -->
        <div id="savedQuestionsSection"></div>

        <!-- Google AdSense Home Bottom Ad Slot -->
        <div id="ad-container-home-bottom" style="display: none; margin: 0; padding: 0; height: 0;"></div>
    </div>

    <!-- Category screen -->
    <div id="scr-category" class="screen">
        <h3 class="section-header-title" id="categorySelectionTitle">--</h3>
        <div id="categoryGridArea"></div>
        <!-- Google AdSense Category Bottom Ad Slot -->
        <div id="ad-container-category-bottom" style="display: none; margin: 0; padding: 0; height: 0;"></div>
    </div>

    <!-- Sub-category screen -->
    <div id="scr-subcat" class="screen">
        <h3 class="section-header-title" id="subcategorySelectionTitle">--</h3>
        <div id="subcategoryGridArea"></div>
    </div>

    <!-- Topics/Contents lists -->
    <div id="scr-topics" class="screen">
        <h3 class="section-header-title" id="topicSelectionTitle">--</h3>
        <div id="topicsGridArea"></div>
    </div>


    <!-- Instructions / Preparation Screen -->
    <div id="scr-instructions" class="screen">
        <div style="text-align: center; margin-bottom: 24px; position: relative;">
            <div style="width: 72px; height: 72px; background: rgba(255,107,53,0.07); border: 2px solid rgba(255,107,53,0.15); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 14px;">
                <i class="ph ph-exam" style="font-size: 38px; color: var(--primary);"></i>
            </div>
            <h2 id="instExTitle" style="font-weight: 900; margin: 0 0 6px; font-size: 21px; color: var(--dark); letter-spacing: -0.3px;">--</h2>
            <span style="font-size: 11px; text-transform: uppercase; color: var(--grey-text); font-weight: bold; letter-spacing: 1px; background: var(--light-grey); padding: 4px 10px; border-radius: 20px; border: 1px solid var(--border-color);">Online Test Portal</span>
        </div>

        <div class="instructions-layout-wrapper">
            <div class="instructions-left-col">
                <!-- Professional Styled Meta Information Grid -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
                    <div style="background: var(--light-grey); border: 1.5px solid var(--border-color); border-radius: 16px; padding: 14px; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;">
                        <i class="ph ph-clock" style="font-size: 20px; color: var(--primary);"></i>
                        <span style="font-size: 10px; text-transform: uppercase; font-weight: 800; color: var(--grey-text); letter-spacing: 0.5px;">Duration Limit</span>
                        <span id="instExDuration" style="font-size: 15px; font-weight: 900; color: var(--dark);">--</span>
                    </div>
                    <div style="background: var(--light-grey); border: 1.5px solid var(--border-color); border-radius: 16px; padding: 14px; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;">
                        <i class="ph ph-question" style="font-size: 20px; color: var(--primary);"></i>
                        <span style="font-size: 10px; text-transform: uppercase; font-weight: 800; color: var(--grey-text); letter-spacing: 0.5px;">Total Questions</span>
                        <span id="instExCount" style="font-size: 15px; font-weight: 900; color: var(--dark);">--</span>
                    </div>
                </div>

                <!-- Marking Scheme Panels -->
                <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px;">
                    <div style="background: white; border: 1.5px solid var(--border-color); border-radius: 16px; padding: 14px; display: flex; align-items: center; justify-content: space-between; gap: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.015);">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <i class="ph ph-checks" style="font-size: 22px; color: #22c55e;"></i>
                            <div style="text-align: left;">
                                <h4 style="margin: 0; font-size: 11px; font-weight: 800; text-transform: uppercase; color: var(--grey-text); letter-spacing: 0.3px;">Standard Marking Scheme</h4>
                                <span style="font-size: 12px; font-weight: 700; color: var(--dark);">Correct response gains positive weight.</span>
                            </div>
                        </div>
                        <div style="background: rgba(34,197,94,0.08); color: #22c55e; border: 1px solid rgba(34,197,94,0.15); font-size: 10.5px; font-weight: 900; padding: 4px 8px; border-radius: 8px; white-space: nowrap; text-transform: uppercase;" id="instExPositiveLabel">
                            Correct: +<span id="instExPositive">-</span>
                        </div>
                    </div>

                    <div style="background: white; border: 1.5px solid var(--border-color); border-radius: 16px; padding: 14px; display: flex; align-items: center; justify-content: space-between; gap: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.015);">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <i class="ph ph-x-circle" style="font-size: 22px; color: #ef4444;"></i>
                            <div style="text-align: left;">
                                <h4 style="margin: 0; font-size: 11px; font-weight: 800; text-transform: uppercase; color: var(--grey-text); letter-spacing: 0.3px;">Penalty (Negative Mark)</h4>
                                <span style="font-size: 12px; font-weight: 700; color: var(--dark);">Incorrect response results in reductions.</span>
                            </div>
                        </div>
                        <div style="background: rgba(239,68,68,0.08); color: #ef4444; border: 1px solid rgba(239,68,68,0.15); font-size: 10.5px; font-weight: 900; padding: 4px 8px; border-radius: 8px; white-space: nowrap; text-transform: uppercase;" id="instExNegativeLabel">
                            Wrong: -<span id="instExNegative">-</span>
                        </div>
                    </div>
                </div>

                <!-- Test Readiness & Key Features Highlight Card -->
                <div style="background: white; border: 1.5px solid var(--border-color); border-radius: 16px; padding: 14px; display: flex; flex-direction: column; gap: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.015); margin-bottom: 16px;">
                    <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px dashed var(--border-color); padding-bottom: 8px;">
                        <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: var(--grey-text); letter-spacing: 0.3px; display: flex; align-items: center; gap: 6px;">
                            <i class="ph-bold ph-lightning" style="color: #f59e0b; font-size: 14px;"></i> CBT Exam System Readiness
                        </span>
                        <span style="font-size: 10px; font-weight: 900; color: #1e293b; background: rgba(245,158,11,0.12); padding: 3px 8px; border-radius: 6px; text-transform: uppercase;">Portal Ready</span>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 11.5px; color: var(--dark); font-weight: 700;">
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <i class="ph-bold ph-cloud-check" style="color: #22c55e; font-size: 15px;"></i> Auto Cloud-Sync
                        </div>
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <i class="ph-bold ph-chart-donut" style="color: #3b82f6; font-size: 15px;"></i> Instant Analysis
                        </div>
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <i class="ph-bold ph-translate" style="color: #8b5cf6; font-size: 15px;"></i> Bilingual Test
                        </div>
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <i class="ph-bold ph-bookmark-simple" style="color: #ec4899; font-size: 15px;"></i> Bookmark Notes
                        </div>
                    </div>
                </div>

                <!-- Voucher Activation fields config -->
                <div id="couponEntrySection" style="display: none; background: #fffde7; border: 1px solid #fff59d; border-radius: 16px; padding: 20px; margin-bottom: 16px; text-align: left;">
                    <div style="font-weight: bold; font-size: 13px; color: #f57f17; margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
                        <i class="ph-fill ph-ticket"></i> DO YOU HAVE A COUPON CODE?
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <input type="text" id="couponCodeInput" class="form-input" style="margin-bottom:0;" placeholder="Enter promo code">
                        <button onclick="handleVerifyCouponSubmit()" style="background:var(--dark); color:white; border:none; border-radius:12px; padding: 12px 20px; font-weight:bold; font-size:12px; cursor:pointer;">APPLY</button>
                    </div>
                    <p id="couponFeedbackMsg" style="margin:6px 0 0; font-size:11px; font-weight:bold;"></p>
                </div>

                <button class="btn-fill-prime" onclick="handleBeginTestInitiation()" style="margin-bottom: 16px;">
                    <i class="ph ph-play-circle" style="font-size: 20px;"></i> START TEST
                </button>
            </div>

            <div class="instructions-right-col">
                <!-- Beautifully Formatted Guidelines Board -->
                <div class="guidelines-card">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px; border-bottom: 1.5px solid var(--border-color); padding-bottom: 12px;">
                        <i class="ph-bold ph-shield-check" style="color: var(--primary); font-size: 22px;"></i>
                        <h3 style="margin: 0; font-size: 13px; font-weight: 900; letter-spacing: -0.2px; text-transform: uppercase; color: var(--dark);">MOCK TEST GUIDELINES</h3>
                    </div>
                    
                    <div style="color: var(--dark); font-size: 12.5px; line-height: 1.6; display: flex; flex-direction: column; gap: 14px;">
                        <div style="display: flex; gap: 10px; align-items: flex-start;">
                            <span style="width: 20px; height: 20px; background: rgba(255,107,53,0.1); color: var(--primary); font-size: 11px; font-weight: 900; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px;">1</span>
                            <div>
                                <strong>Secure Lockdown Mode:</strong>
                                <p style="margin: 2px 0 0 0; font-size: 11.5px; color: var(--grey-text);">Do not minimize the screen or change tabs. Loss of focus will instantaneously trigger safety pause state.</p>
                            </div>
                        </div>

                        <div style="display: flex; gap: 10px; align-items: flex-start;">
                            <span style="width: 20px; height: 20px; background: rgba(255,107,53,0.1); color: var(--primary); font-size: 11px; font-weight: 900; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px;">2</span>
                            <div>
                                <strong>Detailed Solutions & Analysis:</strong>
                                <p style="margin: 2px 0 0 0; font-size: 11.5px; color: var(--grey-text);">Review full explanations, language options, and question analytics directly on your Mock Test Scorecard after submission.</p>
                            </div>
                        </div>

                        <div style="display: flex; gap: 10px; align-items: flex-start;">
                            <span style="width: 20px; height: 20px; background: rgba(255,107,53,0.1); color: var(--primary); font-size: 11px; font-weight: 900; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px;">3</span>
                            <div>
                                <strong>Self-Saving & Bookmarking:</strong>
                                <p style="margin: 2px 0 0 0; font-size: 11.5px; color: var(--grey-text);">Bookmark hard or important questions during practice. Access them conveniently anytime directly from home workspace.</p>
                            </div>
                        </div>

                        <div style="display: flex; gap: 10px; align-items: flex-start; border-top: 1px dashed var(--border-color); padding-top: 14px;">
                            <span style="width: 20px; height: 20px; background: rgba(255,107,53,0.08); color: var(--primary); font-size: 11px; font-weight: 900; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px; border: 1px solid rgba(255,107,53,0.18);"><i class="ph ph-article" style="font-size: 11px;"></i></span>
                            <div>
                                <strong>Guidelines:</strong>
                                <p id="instExDesc" style="margin: 4px 0 0; font-size: 11.5px; color: var(--grey-text); line-height: 1.5; font-weight: 600;">--</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>


    <!-- Locked Payment Premium Screen (3-Step Flow: Step 1 -> Step 2 -> Step 3) -->
    <div id="scr-pay" class="screen">
        <div style="background: white; border-radius: 24px; border: 1px solid var(--border-color); padding: 28px; box-shadow: 0 10px 30px rgba(0,0,0,0.04); max-width: 540px; margin: 0 auto; overflow: hidden; position: relative;">
            <!-- Premium Header Accent Bar -->
            <div style="position: absolute; top: 0; left: 0; right: 0; height: 6px; background: linear-gradient(90deg, #009CFC 0%, #0077C8 50%, #009CFC 100%);"></div>

            <!-- 3-STEP PROGRESS STEPPER HEADER -->
            <div style="margin-top: 6px; margin-bottom: 22px; position: relative;" id="payStepperMainHeader">
                <!-- Background Connecting Progress Line -->
                <div style="position: absolute; top: 18px; left: 45px; right: 45px; height: 3px; background: #e2e8f0; border-radius: 4px; z-index: 0;" id="payStepperProgressLine">
                    <div id="payStepperProgressActive" style="height: 100%; width: 0%; background: linear-gradient(90deg, #009CFC, #0077C8); border-radius: 4px; transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1);"></div>
                </div>

                <div style="display: flex; align-items: flex-start; justify-content: space-between; position: relative; z-index: 1;">
                    <!-- Step 1 Pill -->
                    <div id="payStepPill1" onclick="goToPayStep(1)" style="display: flex; flex-direction: column; align-items: center; gap: 5px; cursor: pointer; user-select: none; width: 85px; text-align: center;">
                        <div id="stepCircle1" style="width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #009CFC, #0077C8); color: white; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 14px; box-shadow: 0 4px 14px rgba(0, 156, 252, 0.4); border: 2.5px solid white; transition: all 0.25s;">
                            1
                        </div>
                        <span id="stepLabel1" style="font-size: 11px; font-weight: 900; color: #172B3A; letter-spacing: 0.2px; line-height: 1.2;">1. Payment</span>
                    </div>

                    <!-- Step 2 Pill -->
                    <div id="payStepPill2" onclick="goToPayStep(2)" style="display: flex; flex-direction: column; align-items: center; gap: 5px; cursor: pointer; user-select: none; width: 85px; text-align: center;">
                        <div id="stepCircle2" style="width: 36px; height: 36px; border-radius: 50%; background: #f1f5f9; color: #64748b; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 14px; border: 2.5px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.06); transition: all 0.25s;">
                            2
                        </div>
                        <span id="stepLabel2" style="font-size: 11px; font-weight: 700; color: #667788; letter-spacing: 0.2px; line-height: 1.2;">2. Details</span>
                    </div>

                    <!-- Step 3 Pill -->
                    <div id="payStepPill3" style="display: flex; flex-direction: column; align-items: center; gap: 5px; user-select: none; width: 85px; text-align: center;">
                        <div id="stepCircle3" style="width: 36px; height: 36px; border-radius: 50%; background: #f1f5f9; color: #64748b; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 14px; border: 2.5px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.06); transition: all 0.25s;">
                            3
                        </div>
                        <span id="stepLabel3" style="font-size: 11px; font-weight: 700; color: #667788; letter-spacing: 0.2px; line-height: 1.2;">3. Verify</span>
                    </div>
                </div>
            </div>

            <!-- ================= STEP 1: PAYMENT (QR & TAP TO PAY) ================= -->
            <div id="payStep1Container" class="pay-step-block">
                <div style="text-align: center; margin-bottom: 18px;">
                    <!-- Dynamic Category Plan Badge -->
                    <div style="margin-bottom: 10px;">
                        <div id="pay-plan-badge" style="display: inline-flex; align-items: center; gap: 6px; background: #EAF7FF; color: #0077C8; border: 1px solid rgba(0, 156, 252, 0.25); border-radius: 99px; padding: 6px 14px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 2px 8px rgba(0, 156, 252, 0.05);">
                            <i class="ph-fill ph-sparkles"></i> <span id="pay-plan-badge-text">Selected: General Premium Plan</span>
                        </div>
                    </div>

                    <h2 id="pay-screen-title" style="font-weight: 900; margin: 4px 0; font-size: 22px; letter-spacing: -0.5px; color: #0077C8;">Step 1: Complete Payment</h2>
                    <p id="pay-screen-desc" style="font-size: 13px; color: var(--grey-text); line-height: 1.45; margin: 0 auto; max-width: 380px;">
                        Scan the QR code or tap "Pay via UPI App". Once paid, proceed to Step 2 to submit your details.
                    </p>
                </div>

                <div class="pay-step1-grid">
                    <div class="pay-step1-left">
                        <!-- Pricing Box -->
                        <div style="background: linear-gradient(135deg, #121F2F 0%, #0B131E 100%); color: white; border-radius: 18px; padding: 20px; margin-bottom: 18px; position: relative; overflow: hidden; box-shadow: 0 8px 25px rgba(0, 156, 252, 0.12); border: 1px solid #1E344B;">
                            <div style="position: absolute; top: -20px; right: -20px; width: 80px; height: 80px; background: rgba(0, 156, 252, 0.12); border-radius: 50%; pointer-events: none;"></div>
                            
                            <div style="display: flex; align-items: center; justify-content: space-between; position: relative; z-index: 1;">
                                <div>
                                    <span style="font-size: 9.5px; text-transform: uppercase; letter-spacing: 1.5px; opacity: 0.85; font-weight: 800; color: #009CFC; display: block; margin-bottom: 4px;">ACTIVE LICENSE PLAN</span>
                                    <h3 style="margin: 0; font-size: 28px; font-weight: 950; display: flex; align-items: baseline; gap: 4px; line-height: 1;">
                                        <span id="pay-amount" style="color: #ffffff;">${social.premiumPrice || "₹45"}</span>
                                        <span id="pay-duration" style="display: none;">/ ${social.premiumDurationText || "3 Months"}</span>
                                    </h3>
                                </div>
                                <div style="text-align: right;">
                                    <span style="font-size: 9px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.7; font-weight: bold; display: block; margin-bottom: 4px;">LICENSE DURATION</span>
                                    <div id="pay-validity-text" style="background: rgba(0, 156, 252, 0.18); border: 1.5px solid rgba(0, 156, 252, 0.35); color: #009CFC; border-radius: 10px; padding: 5px 10px; font-size: 11px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; display: inline-block; line-height: 1.2;">
                                        ${social.premiumValidityText || "VALID FOR 90 DAYS"}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Benefits Checklist -->
                        <div style="background: var(--light-grey); border-radius: 16px; padding: 16px; margin-bottom: 18px; border: 1px solid var(--border-color);">
                            <h4 style="margin: 0 0 10px 0; font-size: 11.5px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.8px; color: #0077C8; display: flex; align-items: center; gap: 5px;">
                                <i class="ph-bold ph-shield-check" style="color: var(--primary); font-size: 15px;"></i> Membership Benefits Include:
                            </h4>
                            <ul id="pay-benefits-list" style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px;">
                                ${(social.premiumBenefitsText || "Access to Past Tests, Access to Present Tests, Access to Future Tests, Unlimited Test Attempts")
                                    .split(",")
                                    .map(b => b.trim())
                                    .filter(Boolean)
                                    .map(b => `
                                        <li style="display: flex; align-items: flex-start; gap: 8px; font-size: 12.5px; font-weight: 700; color: var(--main-text);">
                                            <i class="ph-bold ph-check-circle" style="color: #22c55e; font-size: 16px; margin-top: 1px;"></i> <span>${b}</span>
                                        </li>
                                    `).join("")}
                            </ul>
                        </div>
                    </div>

                    <div class="pay-step1-right">
                        <!-- QR Payment Section -->
                        <div style="text-align: center; border: 2px dashed #009CFC; background: #F5FBFF; border-radius: 20px; padding: 20px; margin-bottom: 18px; position: relative;">
                            <div style="position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: #0077C8; color: white; padding: 3px 12px; border-radius: 20px; font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 10px rgba(0, 119, 200, 0.25);">
                                SECURE INSTANT UPI
                            </div>
                            <div style="margin-top: 6px; margin-bottom: 4px;">
                                <span id="pay-scan-qr-header" style="font-size: 12px; font-weight: 800; color: #172B3A; text-transform: uppercase; letter-spacing: 0.5px;">Scan QR Code to Pay ${social.premiumPrice || "₹45"}</span>
                            </div>
                            
                            <div style="margin: 12px 0;">
                                <div style="display: inline-block; background: white; padding: 12px; border-radius: 16px; box-shadow: 0 8px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
                                    <img style="width: 160px; height: 160px; display: block; border-radius: 8px;" src="${social.paymentQr || 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=payee_prayas'}" id="displayPayQrImage">
                                </div>
                                <br/>
                                <a id="pay-qr-direct-link" href="#" target="_self" onclick="handleTapPayDirect()" style="display: inline-flex; align-items: center; justify-content: center; gap: 8px; margin-top: 12px; background: linear-gradient(135deg, #009CFC 0%, #0077C8 100%); color: white; padding: 12px 24px; border-radius: 14px; font-size: 13.5px; font-weight: 800; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 14px rgba(0, 156, 252, 0.35); border: none; text-decoration: none; width: 90%; max-width: 320px;">
                                    <i class="ph-bold ph-lightning" style="font-size: 16px; color: #FFFFFF;"></i> Pay via UPI App
                                </a>
                            </div>
                            
                            <div style="display: flex; flex-direction: row; flex-wrap: nowrap; align-items: center; justify-content: center; gap: 10px; margin-top: 14px; background: white; padding: 8px 12px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 2px 8px rgba(0,0,0,0.015); width: max-content; margin-left: auto; margin-right: auto;">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Google_Pay_Logo_%282020%29.svg" style="height: 12px; width: auto; object-fit: contain; flex-shrink: 0; display: block;" alt="Google Pay">
                                <div style="width: 1px; height: 10px; background: #e2e8f0; flex-shrink: 0;"></div>
                                <img src="https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg" style="height: 12px; width: auto; object-fit: contain; flex-shrink: 0; display: block;" alt="PhonePe">
                                <div style="width: 1px; height: 10px; background: #e2e8f0; flex-shrink: 0;"></div>
                                <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" style="height: 9px; width: auto; object-fit: contain; flex-shrink: 0; display: block;" alt="UPI">
                            </div>
                        </div>

                        <!-- Centered 'I Have Paid' Check Button -->
                        <div id="unifiedPaidBtn" class="unticked" onclick="handleUnifiedPaidAction()" style="background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 12px; height: 44px; padding: 0 18px; margin: 16px auto 12px auto; max-width: 320px; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; user-select: none; transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1); box-sizing: border-box;">
                            <div id="unifiedPaidCheckCircle" style="width: 22px; height: 22px; border-radius: 6px; border: 2px solid #94a3b8; display: flex; align-items: center; justify-content: center; background: #f8fafc; transition: all 0.2s ease; flex-shrink: 0;">
                                <i id="unifiedPaidCheckIcon" class="ph-bold ph-check" style="display: none; font-size: 14px; color: #ffffff;"></i>
                            </div>
                            <span id="unifiedPaidText" style="font-size: 14px; font-weight: 800; color: #334155; letter-spacing: 0.2px;">I Have Paid</span>
                        </div>

                        <div style="display: flex; gap: 10px;">
                            <button type="button" id="pay-contact-link-element" onclick="handleContactHelpdeskClick()" class="btn-fill-prime" style="background: #25d366; color: white; margin: 0; flex: 1; border-radius: 12px; font-size: 12px; font-weight: 800; height: 42px; display: inline-flex; align-items: center; justify-content: center; gap: 6px; border: none; cursor: pointer; box-shadow: 0 4px 12px rgba(37, 211, 102, 0.25);">
                                <i class="ph-bold ph-chats" style="font-size: 16px;"></i> Contact Helpdesk
                            </button>
                        </div>

                        <div style="display: flex; gap: 10px; margin-top: 10px;" id="pay-youtube-wrapper">
                            <a id="pay-youtube-link-element" href="#" target="_blank" class="btn-fill-prime" style="display: none; background: #FF0000; color: white; margin: 0; flex: 1; border-radius: 12px; font-size: 12.5px; font-weight: 800; height: 42px; align-items: center; justify-content: center; gap: 8px; border: none; cursor: pointer; text-decoration: none; box-shadow: 0 4px 12px rgba(255, 0, 0, 0.25);">
                                <i class="ph-fill ph-youtube-logo" style="font-size: 18px; color: #FFFFFF;"></i> <span id="pay-youtube-channel-text">Watch on YouTube</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ================= STEP 2: DETAILS SUBMISSION FORM ================= -->
            <div id="payStep2Container" class="pay-step-block" style="display: none;">
                <div style="text-align: center; margin-bottom: 18px;">
                    <div style="display: inline-flex; align-items: center; justify-content: center; width: 52px; height: 52px; background: rgba(0, 156, 252, 0.08); border-radius: 50%; margin-bottom: 8px; border: 1.5px solid rgba(0, 156, 252, 0.2);">
                        <i class="ph-fill ph-note-pencil" style="font-size: 26px; color: #009CFC;"></i>
                    </div>
                    <h2 style="font-weight: 900; margin: 0 0 4px 0; font-size: 22px; letter-spacing: -0.5px; color: #0077C8;">Step 2: Submit Payment Details</h2>
                    <p style="font-size: 12.5px; color: var(--grey-text); line-height: 1.45; margin: 0 auto; max-width: 380px;">
                        Enter your details to verify your payment. Once verified, your Login ID &amp; Password will be sent to your email address.
                    </p>
                </div>

                <form id="paymentWeb3Form" action="https://api.web3forms.com/submit" method="POST" onsubmit="handleSendPaymentDetailsEmail(event)">
                    <input type="hidden" name="access_key" value="5d794766-9266-49a2-b97b-cc7313dd14d6">
                    <input type="hidden" name="from_name" value="Taiyariya Student Portal">
                    <input type="hidden" name="subject" id="payWeb3Subject" value="Payment Verification Request">
                    <div class="pay-step2-grid">
                        <div class="pay-step2-left">
                            <!-- Form Inputs -->
                            <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 16px;">
                                <div>
                                    <label style="font-size: 11px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.4px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                                        <span>Aspirant Full Name *</span>
                                    </label>
                                    <div style="position: relative;">
                                        <i class="ph ph-user" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 16px;"></i>
                                        <input type="text" name="name" id="payFormName" class="form-input" style="margin-bottom:0; width: 100%; padding-left: 42px; border-radius: 12px; height: 46px; box-sizing: border-box;" placeholder="Enter your full name" required>
                                    </div>
                                </div>

                                <div>
                                    <label style="font-size: 11px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.4px; display: block; margin-bottom: 6px;">
                                        <span>Email ID (Credentials Recipient) *</span>
                                    </label>
                                    <div style="position: relative;">
                                        <i class="ph ph-envelope-simple" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 16px;"></i>
                                        <input type="email" name="email" id="payFormEmail" class="form-input" style="margin-bottom:0; width: 100%; padding-left: 42px; border-radius: 12px; height: 46px; box-sizing: border-box;" placeholder="student@example.com" required>
                                    </div>
                                </div>

                                <div>
                                    <label style="font-size: 11px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.4px; display: block; margin-bottom: 6px;">Phone / WhatsApp Number *</label>
                                    <div style="position: relative;">
                                        <i class="ph ph-phone" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 16px;"></i>
                                        <input type="tel" name="phone" id="payFormPhone" class="form-input" style="margin-bottom:0; width: 100%; padding-left: 42px; border-radius: 12px; height: 46px; box-sizing: border-box;" placeholder="Enter 10-digit mobile number" required>
                                    </div>
                                </div>

                                <div>
                                    <label style="font-size: 11px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.4px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                                        <span>UPI UTR / Transaction ID (Optional)</span>
                                        <span style="font-size: 9.5px; color: #64748b; background: #f1f5f9; padding: 1px 6px; border-radius: 6px; font-weight: 700; text-transform: none;">Optional</span>
                                    </label>
                                    <div style="position: relative;">
                                        <i class="ph ph-receipt" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 16px;"></i>
                                        <input type="text" name="utr" id="payFormUTR" class="form-input" style="margin-bottom:0; width: 100%; padding-left: 42px; border-radius: 12px; height: 46px; box-sizing: border-box;" placeholder="e.g. 423871902341 (Optional)">
                                    </div>
                                    <p style="margin: 4px 0 0 0; font-size: 11px; color: #64748b; font-weight: 600;">
                                        💡 Optional: Enter 12-digit UPI Ref / UTR from Google Pay, PhonePe, Paytm or Bank app.
                                    </p>
                                </div>

                                <div>
                                    <label style="font-size: 11px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.4px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                                        <span>Message / Payment Note</span>
                                        <span style="font-size: 9.5px; color: #64748b; background: #f1f5f9; padding: 1px 6px; border-radius: 6px; font-weight: 700; text-transform: none;">Optional</span>
                                    </label>
                                    <div style="position: relative;">
                                        <textarea name="message" id="payFormMessage" class="form-input" style="margin-bottom:0; width: 100%; padding: 10px 14px; border-radius: 12px; min-height: 64px; box-sizing: border-box; resize: vertical; font-family: inherit; font-size: 12.5px; line-height: 1.4;" placeholder="e.g. Paid via UPI, please verify and activate my access (Optional)"></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="pay-step2-right">
                            <!-- Crucial Email Note Banner -->
                            <div style="background: #eff6ff; border: 1.5px solid #bfdbfe; border-radius: 14px; padding: 14px 16px; margin-bottom: 16px; display: flex; align-items: flex-start; gap: 10px;">
                                <i class="ph-fill ph-envelope-open" style="color: #2563eb; font-size: 22px; flex-shrink: 0; margin-top: 1px;"></i>
                                <p style="margin: 0; font-size: 12px; color: #1e40af; font-weight: 700; line-height: 1.45;">
                                    <strong>Important Notice:</strong> Please double-check your Email ID. Your official <strong>Login ID &amp; Password</strong> will be dispatched to this email immediately upon verification.
                                </p>
                            </div>

                            <!-- Refund Policy -->
                            <div style="background: #fef2f2; border: 1px solid #fca5a5; border-radius: 14px; padding: 12px; margin-bottom: 18px;">
                                <p style="margin:0; font-size: 11px; color: #b91c1c; font-weight: 800; line-height: 1.45; display: flex; align-items: flex-start; gap: 6px;">
                                    <span>⚠️</span>
                                    <span>Refund Policy: Once payment is completed, no refund will be provided. Please try the free tests first and then purchase Premium Membership.</span>
                                </p>
                            </div>

                            <!-- Step 2 Submission Actions -->
                            <div style="display: flex; flex-direction: column; gap: 10px;">
                                <button id="btnSendPaymentEmail" type="submit" class="btn-fill-prime" style="background: linear-gradient(135deg, #FF9F1C 0%, #FF5A1F 100%); color: #ffffff; margin: 0; width: 100%; border-radius: 12px; font-size: 13px; font-weight: 800; height: 44px; display: flex; align-items: center; justify-content: center; gap: 8px; border: none; cursor: pointer; box-shadow: 0 4px 14px rgba(255, 90, 31, 0.3); white-space: nowrap;">
                                    <i class="ph-bold ph-paper-plane-tilt" style="font-size: 16px;"></i>
                                    <span>Submit</span>
                                </button>

                                <div style="display: flex; gap: 10px;">
                                    <button type="button" onclick="goToPayStep(1)" class="btn-fill-prime" style="background: #f1f5f9; color: #475569; margin: 0; flex: 1; border-radius: 12px; font-size: 13px; font-weight: 800; height: 40px; display: inline-flex; align-items: center; justify-content: center; border: 1px solid #e2e8f0; cursor: pointer;">
                                        <span>Back</span>
                                    </button>
                                    <button type="button" onclick="handleContactHelpdeskClick()" class="btn-fill-prime" style="background: #25d366; color: white; margin: 0; flex: 1; border-radius: 12px; font-size: 12px; font-weight: 800; height: 40px; display: inline-flex; align-items: center; justify-content: center; gap: 6px; border: none; cursor: pointer; box-shadow: 0 4px 10px rgba(37, 211, 102, 0.2);">
                                        <i class="ph-bold ph-chats" style="font-size: 15px;"></i> Helpdesk
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <!-- ================= STEP 3: VERIFICATION NOTICE & CREDENTIALS INFO ================= -->
            <div id="payStep3Container" class="pay-step-block" style="display: none;">
                <div style="text-align: center; margin-bottom: 18px;">
                    <!-- Verification Icon Badge -->
                    <div style="display: inline-flex; align-items: center; justify-content: center; width: 68px; height: 68px; background: rgba(34, 197, 94, 0.1); border-radius: 50%; margin-bottom: 10px; border: 2px solid #22c55e; box-shadow: 0 6px 20px rgba(34, 197, 94, 0.2);">
                        <i class="ph-fill ph-check-circle" style="font-size: 40px; color: #22c55e;"></i>
                    </div>
                    
                    <div style="margin-bottom: 8px;">
                        <span style="background: rgba(34, 197, 94, 0.15); color: #16a34a; border: 1px solid rgba(34, 197, 94, 0.3); padding: 4px 12px; border-radius: 99px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; display: inline-flex; align-items: center; gap: 5px;">
                            <i class="ph-fill ph-check-circle"></i> Verification In Progress
                        </span>
                    </div>

                    <h2 style="font-weight: 900; margin: 4px 0; font-size: 22px; letter-spacing: -0.5px; color: #1e293b;">Submit Successfully</h2>
                </div>

                <div class="pay-step3-grid">
                    <div class="pay-step3-left">
                        <!-- PROMINENT NOTIFICATION BOX IN ENGLISH -->
                        <div style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border: 1.5px solid #f59e0b; border-radius: 18px; padding: 20px; text-align: center; margin-bottom: 18px; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.12);">
                            <div style="display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 50%; background: #f59e0b; color: white; margin-bottom: 12px; box-shadow: 0 4px 10px rgba(245, 158, 11, 0.3);">
                                <i class="ph-fill ph-hourglass-medium" style="font-size: 24px;"></i>
                            </div>
                            <h3 style="font-size: 15.5px; font-weight: 900; color: #92400e; margin: 0 0 8px 0; line-height: 1.45;">
                                Please wait while our team verifies your payment details. Your login credentials will be shared with you via email shortly.
                            </h3>
                            <p style="font-size: 12px; color: #78350f; margin: 0; line-height: 1.5; font-weight: 700;">
                                Once the transaction is verified by our team, your official Login ID and Password will be sent directly to your registered email address.
                            </p>
                        </div>

                        <!-- Support & Fast Track Activation Card -->
                        <div style="background: rgba(37, 211, 102, 0.08); border: 1px solid rgba(37, 211, 102, 0.25); border-radius: 14px; padding: 14px; margin-bottom: 18px; text-align: center;">
                            <p style="margin: 0 0 10px 0; font-size: 12px; color: #166534; font-weight: 700; line-height: 1.4;">
                                💬 <strong>Need faster activation?</strong> Send your payment screenshot to our support team on Telegram or WhatsApp.
                            </p>
                            <button type="button" onclick="handleContactHelpdeskClick()" class="btn-fill-prime" style="background: #25d366; color: white; width: 100%; border-radius: 12px; font-size: 13px; font-weight: 800; height: 42px; display: inline-flex; align-items: center; justify-content: center; gap: 6px; border: none; cursor: pointer; box-shadow: 0 4px 12px rgba(37, 211, 102, 0.25); margin: 0;">
                                <i class="ph-bold ph-chats" style="font-size: 17px;"></i> Instant Support &amp; Verification Bot
                            </button>
                        </div>
                    </div>

                    <div class="pay-step3-right">
                        <!-- SUBMITTED DETAILS SUMMARY CARD -->
                        <div style="background: var(--light-grey); border-radius: 16px; padding: 16px; margin-bottom: 18px; border: 1px solid var(--border-color);">
                            <h4 style="margin: 0 0 12px 0; font-size: 11.5px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.8px; color: #475569; display: flex; align-items: center; gap: 6px;">
                                <i class="ph-bold ph-receipt" style="color: var(--primary); font-size: 15px;"></i> Submitted Details Summary:
                            </h4>
                            
                            <div style="display: flex; flex-direction: column; gap: 8px; font-size: 12.5px;">
                                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed var(--border-color); padding-bottom: 6px;">
                                    <span style="color: #64748b; font-weight: 600;">Plan Selected:</span>
                                    <span id="summaryPlanName" style="font-weight: 800; color: #1e293b; text-align: right;">General Premium Plan</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed var(--border-color); padding-bottom: 6px;">
                                    <span style="color: #64748b; font-weight: 600;">Aspirant Name:</span>
                                    <span id="summaryStudentName" style="font-weight: 800; color: #1e293b;">-</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed var(--border-color); padding-bottom: 6px; background: rgba(37, 99, 235, 0.05); padding: 6px 8px; border-radius: 8px;">
                                    <span style="color: #1e40af; font-weight: 700; display: flex; align-items: center; gap: 4px;">
                                        <i class="ph-fill ph-envelope"></i> Credentials Email:
                                    </span>
                                    <span id="summaryStudentEmail" style="font-weight: 900; color: #1e40af;">-</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed var(--border-color); padding-bottom: 6px;">
                                    <span style="color: #64748b; font-weight: 600;">Phone Number:</span>
                                    <span id="summaryStudentPhone" style="font-weight: 800; color: #1e293b;">-</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed var(--border-color); padding-bottom: 6px;">
                                    <span style="color: #64748b; font-weight: 600;">Transaction UTR:</span>
                                    <span id="summaryUTR" style="font-weight: 800; color: #1e293b; font-family: monospace;">-</span>
                                </div>
                                <div id="summaryMessageRow" style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px dashed var(--border-color); padding-bottom: 6px;">
                                    <span style="color: #64748b; font-weight: 600;">Message/Note:</span>
                                    <span id="summaryMessageText" style="font-weight: 700; color: #1e293b; max-width: 60%; word-break: break-word; text-align: right; font-size: 11.5px;">-</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <span style="color: #64748b; font-weight: 600;">Submission Time:</span>
                                    <span id="summarySubmittedTime" style="font-weight: 700; color: #64748b; font-size: 11.5px;">-</span>
                                </div>
                            </div>
                        </div>

                        <!-- Navigation Action Buttons -->
                        <div style="display: flex; flex-direction: column; gap: 10px;">
                            <button type="button" onclick="handleTabNavigation('home')" class="btn-fill-prime" style="background: var(--dark, #111827); color: white; width: 100%; border-radius: 14px; font-size: 13px; font-weight: 800; height: 46px; display: flex; align-items: center; justify-content: center; gap: 8px; border: none; cursor: pointer; margin: 0;">
                                <i class="ph-bold ph-house" style="font-size: 17px;"></i>
                                <span>Explore Free Tests / Back to Home</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>


    <!-- Account Portal screen (Redesigned with Short Texts and Day/Night Visibility) -->
    <div id="scr-acc" class="screen">
        <h3 class="section-header-title" style="margin-bottom: 20px;">Account</h3>

        <!-- GUEST / UNAUTHENTICATED STATE -->
        <div id="studentAuthFormPanel">
            <div class="account-guest-grid">
                <!-- Left: Login Portal Card -->
                <div class="account-card-box" style="background: var(--light-grey); border: 1px solid var(--border-color); border-radius: 24px; padding: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); margin-bottom: 20px; text-align: left;">
                    <div style="text-align: center; padding: 5px 0 18px 0;">
                        <div style="width: 54px; height: 54px; border-radius: 50%; background: var(--primary-light, rgba(255,184,0,0.08)); display: inline-flex; align-items: center; justify-content: center; margin-bottom: 12px; border: 1.5px solid var(--primary); box-shadow: 0 4px 12px rgba(255,184,0,0.1);">
                            <i class="ph-bold ph-user-focus" style="font-size: 26px; color: var(--primary);"></i>
                        </div>
                        <h3 style="margin: 0; font-weight: 900; font-size: 19px; letter-spacing: -0.4px; color: var(--dark);">Aspirant Portal</h3>
                        <p style="font-size: 12.5px; color: var(--grey-text); margin: 6px 0 0; line-height: 1.5; font-weight: 500;">
                            Sign in to access premium tests, answers & solutions.
                        </p>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 20px;">
                        <div>
                            <label style="font-weight: 800; font-size: 10px; color: var(--grey-text); letter-spacing: 0.8px; text-transform: uppercase; display: block; margin-bottom: 6px;">Email or Phone</label>
                            <div style="position: relative;">
                                <i class="ph ph-envelope-simple" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--grey-text); font-size: 16px;"></i>
                                <input type="text" id="inputStudentCredMail" class="form-input" placeholder="student@example.com" style="padding-left: 42px; margin: 0; border-radius: 12px; height: 46px; font-size: 13px; width: 100%; box-sizing: border-box; border: 1.5px solid var(--border-color); background: rgba(0,0,0,0.01);">
                            </div>
                        </div>

                        <div>
                            <label style="font-weight: 800; font-size: 10px; color: var(--grey-text); letter-spacing: 0.8px; text-transform: uppercase; display: block; margin-bottom: 6px;">Password</label>
                            <div style="position: relative;">
                                <i class="ph ph-lock" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--grey-text); font-size: 16px;"></i>
                                <input type="password" id="inputStudentCredPass" class="form-input" placeholder="••••••••" style="padding-left: 42px; margin: 0; border-radius: 12px; height: 46px; font-size: 13px; width: 100%; box-sizing: border-box; border: 1.5px solid var(--border-color); background: rgba(0,0,0,0.01);">
                            </div>
                        </div>
                    </div>

                    <button class="btn-fill-prime" onclick="handleStudentAuthenticationProcess()" style="height: 48px; font-weight: 800; font-size: 13.5px; border-radius: 24px; background: var(--dark); color: var(--light-grey); border: none; display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; margin: 0; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                        <i class="ph-bold ph-sign-in" style="font-size: 18px;"></i> Sign In
                    </button>
                </div>

                <!-- Right: Guest Info Card (Shown on Desktop & Tablet) -->
                <div class="account-card-box account-guest-features-card" style="background: var(--light-grey); border: 1px solid var(--border-color); border-radius: 24px; padding: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); margin-bottom: 20px; text-align: left;">
                    <div>
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
                            <div style="background: rgba(255, 184, 0, 0.12); border: 1.5px solid var(--primary); width: 36px; height: 36px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
                                <i class="ph-fill ph-sparkle" style="color: var(--primary); font-size: 18px;"></i>
                            </div>
                            <div>
                                <h4 style="margin: 0; font-size: 14.5px; font-weight: 900; color: var(--dark); letter-spacing: -0.3px;">Aspirant Benefits</h4>
                                <p style="margin: 2px 0 0; font-size: 10.5px; font-weight: 700; color: var(--grey-text);">Everything you need for exam success</p>
                            </div>
                        </div>

                        <div style="display: flex; flex-direction: column; gap: 10px;">
                            <div style="display: flex; align-items: flex-start; gap: 10px; padding: 10px 12px; background: rgba(0,0,0,0.01); border: 1.5px solid var(--border-color); border-radius: 14px;">
                                <i class="ph-bold ph-check-circle" style="color: #2ecc71; font-size: 18px; margin-top: 1px; flex-shrink: 0;"></i>
                                <div>
                                    <h5 style="margin: 0; font-size: 12.5px; font-weight: 800; color: var(--dark);">Real-time CBT Mock Tests</h5>
                                    <p style="margin: 2px 0 0; font-size: 11px; color: var(--grey-text); line-height: 1.4;">Live countdown timer, question palette and bilingual switch.</p>
                                </div>
                            </div>

                            <div style="display: flex; align-items: flex-start; gap: 10px; padding: 10px 12px; background: rgba(0,0,0,0.01); border: 1.5px solid var(--border-color); border-radius: 14px;">
                                <i class="ph-bold ph-check-circle" style="color: #2ecc71; font-size: 18px; margin-top: 1px; flex-shrink: 0;"></i>
                                <div>
                                    <h5 style="margin: 0; font-size: 12.5px; font-weight: 800; color: var(--dark);">Detailed Performance Analytics</h5>
                                    <p style="margin: 2px 0 0; font-size: 11px; color: var(--grey-text); line-height: 1.4;">Instant accuracy reports, AIR rankings and section-wise breakdown.</p>
                                </div>
                            </div>

                            <div style="display: flex; align-items: flex-start; gap: 10px; padding: 10px 12px; background: rgba(0,0,0,0.01); border: 1.5px solid var(--border-color); border-radius: 14px;">
                                <i class="ph-bold ph-check-circle" style="color: #2ecc71; font-size: 18px; margin-top: 1px; flex-shrink: 0;"></i>
                                <div>
                                    <h5 style="margin: 0; font-size: 12.5px; font-weight: 800; color: var(--dark);">Downloadable PDFs & Notes</h5>
                                    <p style="margin: 2px 0 0; font-size: 11px; color: var(--grey-text); line-height: 1.4;">Curated study material, previous year questions & reference guides.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style="padding: 10px 14px; background: rgba(46, 204, 113, 0.08); border-radius: 14px; border: 1px dashed rgba(46, 204, 113, 0.4); display: flex; align-items: center; gap: 8px; font-size: 11.5px; font-weight: 750; color: #2ecc71; margin-top: 12px;">
                        <i class="ph-bold ph-shield-check" style="font-size: 16px;"></i>
                        <span>Encrypted &amp; Secure Cloud Access</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- AUTHENTICATED / LOGGED IN STATE -->
        <div id="studentAuthenticatedProfileArea" style="display: none;">
            <div class="account-auth-grid">
                <!-- Box 1: Profile Info -->
                <div class="account-card-box" style="background: var(--light-grey); border: 1px solid var(--border-color); border-radius: 24px; padding: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); margin-bottom: 20px; text-align: left;">
                    <!-- Profile Hero Header -->
                    <div style="text-align: center; padding: 5px 0 18px 0; border-bottom: 1px dashed var(--border-color); margin-bottom: 18px;">
                        <div style="width: 66px; height: 66px; border-radius: 50%; background: var(--light-grey); display: inline-flex; align-items: center; justify-content: center; margin-bottom: 12px; border: 2.5px solid var(--primary); position: relative; box-shadow: 0 4px 14px rgba(255,184,0,0.2);">
                            <i class="ph-fill ph-user-circle" style="font-size: 42px; color: var(--dark);"></i>
                            <span style="position: absolute; bottom: 0; right: 0; background: #2ecc71; width: 14px; height: 14px; border-radius: 50%; border: 2.5px solid var(--light-grey); display: block;"></span>
                        </div>
                        <h2 id="studentUserHeaderName" style="margin: 0; font-weight: 900; font-size: 19px; color: var(--dark); letter-spacing: -0.4px;">Student Name</h2>
                        <span style="font-size: 11px; font-weight: 800; color: #2ecc71; background: rgba(46,204,113,0.1); padding: 3px 10px; border-radius: 12px; display: inline-flex; align-items: center; gap: 5px; margin-top: 6px;">
                            <span style="width: 6px; height: 6px; border-radius: 50%; background: #2ecc71;"></span> Online Account
                        </span>
                    </div>

                    <!-- Personal Information Grid -->
                    <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 18px;">
                        <div style="display: flex; align-items: center; justify-content: space-between; padding: 11px 14px; background: rgba(0,0,0,0.01); border-radius: 14px; border: 1.5px solid var(--border-color);">
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <i class="ph-bold ph-envelope-simple" style="font-size: 16px; color: var(--grey-text);"></i>
                                <span style="font-size: 12px; font-weight: 700; color: var(--grey-text);">Contact</span>
                            </div>
                            <span id="studentUserHeaderMail" style="font-size: 13px; font-weight: 800; color: var(--dark); text-align: right; max-width: 190px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">student@domain.com</span>
                        </div>

                        <div style="display: flex; align-items: center; justify-content: space-between; padding: 11px 14px; background: rgba(0,0,0,0.01); border-radius: 14px; border: 1.5px solid var(--border-color);">
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <i class="ph-bold ph-lock-key" style="font-size: 16px; color: var(--grey-text);"></i>
                                <span style="font-size: 12px; font-weight: 700; color: var(--grey-text);">Password</span>
                            </div>
                            <span style="font-size: 12px; font-weight: 800; color: var(--dark); letter-spacing: 2px;">••••••••</span>
                        </div>
                    </div>

                    <button class="btn-fill-prime" style="background: rgba(239, 68, 68, 0.08); color: #ef4444; border: 1.5px solid rgba(239, 68, 68, 0.18); border-radius: 20px; width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; height: 44px; font-size: 12.5px; font-weight: 800; margin: 0; cursor: pointer; transition: all 0.2s;" onclick="handleStudentSignOutProcess()">
                        <i class="ph-bold ph-sign-out" style="font-size: 16px;"></i> Sign Out
                    </button>
                </div>

                <!-- Box 2: Premium Style Box (Active status for logged in student) -->
                <div class="premium-promo-box account-card-box" style="display: flex; flex-direction: column; justify-content: space-between; margin-bottom: 20px;">
                    <div>
                        <div style="position: absolute; top: -15px; right: -15px; background: rgba(255,184,0,0.15); width: 80px; height: 80px; border-radius: 50%;"></div>
                        
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; position: relative; z-index: 2;">
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <div style="background: var(--primary); width: 36px; height: 36px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(255,184,0,0.3);">
                                    <i class="ph-fill ph-crown" style="color: #121212; font-size: 19px;"></i>
                                </div>
                                <h4 style="margin: 0; font-size: 15px; font-weight: 900; letter-spacing: -0.3px;">Premium Access</h4>
                            </div>
                            <!-- Subscription Badging -->
                            <div style="font-size: 11px; font-weight: 900; text-transform: uppercase; padding: 4px 12px; background: #fff; border: 1.5px solid #FFD39B; border-radius: 12px; color: #d97706; display: inline-flex; align-items: center; gap: 4px; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
                                <span id="profileRemainingDays">Active</span>
                            </div>
                        </div>

                        <div class="promo-inner" style="border-radius: 16px; padding: 16px; margin-bottom: 12px; position: relative; z-index: 2;">
                            <div style="font-size: 10px; font-weight: 850; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Unlocked Tracks</div>
                            <div id="profileExpiryDate" style="font-size: 13px; font-weight: 800; line-height: 1.5;">
                                No Unlocked Tracks
                            </div>
                        </div>
                    </div>

                    <div style="padding: 10px 14px; background: rgba(255, 184, 0, 0.08); border-radius: 14px; border: 1px dashed rgba(255, 184, 0, 0.4); display: flex; align-items: center; gap: 8px; font-size: 11.5px; font-weight: 750; color: #92400e; position: relative; z-index: 2;">
                        <i class="ph-bold ph-shield-check" style="font-size: 16px;"></i>
                        <span>24/7 Aspirant Access Enabled</span>
                    </div>
                </div>

                <!-- Keep background DOM structures hidden elements to satisfy dynamic script queries & prevent runtime crashes -->
                <div style="display: none;">
                    <h4 id="panelTotalAttempts">0 Tests</h4>
                    <h4 id="panelHighestScore">0.00</h4>
                    <h4 id="panelAverageScore">0%</h4>
                    <h4 id="panelTotalStudyTime">0h Spent</h4>
                    <div id="personalAttemptsTableArea">
                        <table>
                            <tbody id="personalAttemptsListBody"></tbody>
                        </table>
                    </div>
                    <div id="premiumBadgeEl"><span id="premiumStatusText"></span></div>
                    <span id="profileAcctType"></span>
                </div>
            </div>
        </div>

        <!-- SHARED SECONDARY GRID (Data Backup Sync + Connect Live - ALWAYS VISIBLE) -->
        <div class="account-shared-grid">
            <!-- Box: Live Server Updates Synchronization -->
            <div class="account-card-box" style="background: var(--light-grey); border: 1px solid var(--border-color); border-radius: 24px; padding: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); margin-bottom: 20px; text-align: left; position: relative;">
                <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 14px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="background: rgba(16, 185, 129, 0.1); border: 1.5px solid rgba(16, 185, 129, 0.2); width: 36px; height: 36px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
                            <i class="ph-bold ph-arrows-clockwise" style="color: #10b981; font-size: 18px;"></i>
                        </div>
                        <div>
                            <h4 style="margin: 0; font-size: 14.5px; font-weight: 900; color: var(--dark); letter-spacing: -0.3px;">Live Updates Sync</h4>
                            <p style="margin: 2px 0 0; font-size: 10.5px; font-weight: 700; color: var(--grey-text);">Clear cache & pull latest tests / answer keys</p>
                        </div>
                    </div>
                </div>
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <button id="btnForceRefreshUpdates" onclick="handleForceRefreshDatabase(true)" style="height: 42px; font-weight: 800; font-size: 12.5px; border-radius: 16px; background: #10b981; color: #fff; border: none; display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; margin: 0; cursor: pointer; box-shadow: 0 4px 12px rgba(16,185,129,0.25);">
                        <i class="ph-bold ph-arrows-clockwise" style="font-size: 16px;"></i>
                        <span>Sync Live Updates (अपडेट रिफ्रेश करें)</span>
                    </button>
                    <div id="updateSyncStatusMsg" style="display: none; font-size: 11.5px; font-weight: 750; color: #10b981; text-align: center; padding: 6px; background: rgba(16,185,129,0.08); border-radius: 10px;"></div>
                </div>
            </div>

            <!-- Box 3: JSON Data Engine Box (Backup & Restore - ALWAYS VISIBLE) -->
            <div class="account-card-box" style="background: var(--light-grey); border: 1px solid var(--border-color); border-radius: 24px; padding: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); margin-bottom: 20px; text-align: left; position: relative;">
                <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="background: rgba(52, 152, 219, 0.1); border: 1.5px solid rgba(52, 152, 219, 0.15); width: 36px; height: 36px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
                            <i class="ph-bold ph-file-code" style="color: #3498db; font-size: 18px;"></i>
                        </div>
                        <div>
                            <h4 style="margin: 0; font-size: 14.5px; font-weight: 900; color: var(--dark); letter-spacing: -0.3px;">Data Backup Sync</h4>
                            <p style="margin: 2px 0 0; font-size: 10.5px; font-weight: 700; color: var(--grey-text);">Export or import test attempts locally</p>
                        </div>
                    </div>
                    <span id="backupSyncBadge" style="font-size: 9.5px; color: #2ecc71; font-weight: 850; background: rgba(46,204,113,0.1); padding: 4px 10px; border-radius: 12px; display: inline-flex; align-items: center; gap: 5px; border: 1px solid rgba(46,204,113,0.12);">
                        <i id="backupSyncIcon" class="ph-bold ph-arrows-counter-clockwise" style="font-size: 11px;"></i> <span id="backupSyncText">Sync</span>
                    </span>
                </div>

                <div style="display: flex; gap: 12px; margin-top: 18px;">
                    <button onclick="handleExportAspirantBackup()" style="background: var(--primary); color: #121212; border: none; border-radius: 16px; font-size: 12px; font-weight: 900; height: 42px; display: inline-flex; align-items: center; justify-content: center; gap: 6px; flex: 1; margin: 0; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(255,184,0,0.18);">
                        <i class="ph-bold ph-download-simple" style="font-size: 14px; color: #121212;"></i>
                        <span>Export JSON</span>
                    </button>
                    <button onclick="document.getElementById('aspirantBackupFileInput').click()" style="background: rgba(120, 120, 120, 0.05); color: var(--dark); border: 1.5px solid var(--border-color); border-radius: 16px; font-size: 12px; font-weight: 900; height: 42px; display: inline-flex; align-items: center; justify-content: center; gap: 6px; flex: 1; margin: 0; cursor: pointer; transition: all 0.2s;">
                        <i class="ph-bold ph-upload-simple" style="font-size: 14px; color: #3498db;"></i>
                        <span>Import JSON</span>
                    </button>
                    <input type="file" id="aspirantBackupFileInput" accept=".json" style="display: none;" onchange="handleImportAspirantBackup(event)">
                </div>
                
                <!-- Short Status Message (शार्ट स्टेटस संदेश) -->
                <div id="backupStatusMessage" style="display: none; font-size: 11px; font-weight: 800; text-align: center; margin-top: 10px; color: #2ecc71; background: rgba(46,204,113,0.06); border: 1.5px solid rgba(46,204,113,0.15); border-radius: 12px; padding: 6px 10px;"></div>
            </div>

            <!-- Box 4: Connect Live Box (Social accounts box - ALWAYS VISIBLE) -->
            <div class="account-card-box" style="background: var(--light-grey); border: 1px solid var(--border-color); border-radius: 24px; padding: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); margin-bottom: 20px; text-align: left;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
                    <div style="background: rgba(0, 156, 252, 0.1); border: 1.5px solid rgba(0, 156, 252, 0.15); width: 36px; height: 36px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
                        <i class="ph-fill ph-chats" style="color: #009CFC; font-size: 18px;"></i>
                    </div>
                    <div>
                        <h4 style="margin: 0; font-size: 14.5px; font-weight: 900; color: var(--dark); letter-spacing: -0.3px;">Connect Live</h4>
                        <p style="margin: 2px 0 0; font-size: 10.5px; font-weight: 750; color: var(--grey-text);">Join our student support communities</p>
                    </div>
                </div>

                <div class="social-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                    ${social.whatsapp ? `
                    <a href="${social.whatsapp}" target="_blank" class="social-link-btn" style="color: #25d366; background: rgba(37, 211, 102, 0.05); border: 1.5px solid rgba(37, 211, 102, 0.15); border-radius: 16px; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 10px; text-decoration: none; font-size: 12px; font-weight: 850;">
                        <i class="ph-fill ph-whatsapp-logo" style="font-size: 18px;"></i>
                        <span>WhatsApp</span>
                    </a>` : ''}
                    ${social.telegram ? `
                    <a href="${social.telegram}" target="_blank" class="social-link-btn" style="color: #0088cc; background: rgba(0, 136, 204, 0.05); border: 1.5px solid rgba(0, 136, 204, 0.15); border-radius: 16px; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 10px; text-decoration: none; font-size: 12px; font-weight: 850;">
                        <i class="ph-fill ph-telegram-logo" style="font-size: 18px;"></i>
                        <span>Telegram</span>
                    </a>` : ''}
                    ${social.instagram ? `
                    <a href="${social.instagram}" target="_blank" class="social-link-btn" style="color: #c13584; background: rgba(193, 53, 132, 0.05); border: 1.5px solid rgba(193, 53, 132, 0.15); border-radius: 16px; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 10px; text-decoration: none; font-size: 12px; font-weight: 850;">
                        <i class="ph-fill ph-instagram-logo" style="font-size: 18px;"></i>
                        <span>Instagram</span>
                    </a>` : ''}
                    ${social.youtube ? `
                    <a href="${social.youtube}" target="_blank" class="social-link-btn" style="color: #ff0000; background: rgba(255, 0, 0, 0.05); border: 1.5px solid rgba(255, 0, 0, 0.15); border-radius: 16px; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 10px; text-decoration: none; font-size: 12px; font-weight: 850;">
                        <i class="ph-fill ph-youtube-logo" style="font-size: 18px;"></i>
                        <span>YouTube</span>
                    </a>` : ''}
                    ${(social.customLinks || []).map((link: any) => `
                    <a href="${link.url}" target="_blank" class="social-link-btn" style="color: ${link.color || 'var(--dark)'}; background: rgba(120, 120, 120, 0.03); border: 1.5px solid var(--border-color); border-radius: 16px; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 10px; text-decoration: none; font-size: 12px; font-weight: 850;">
                        <i class="${link.icon || 'ph-fill ph-link'}" style="font-size: 18px;"></i>
                        <span>${link.title || 'Link'}</span>
                    </a>`).join('')}
                </div>
            </div>
        </div>

        <!-- Box 5: Legal & Compliance Box (Mobile & Tablet View only, Desktop uses dedicated global footer) -->
        <div class="mobile-only-legal-box" style="background: var(--light-grey); border: 1px solid var(--border-color); border-radius: 24px; padding: 22px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); margin-bottom: 20px; text-align: left;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 14px;">
                <div style="background: rgba(120, 120, 120, 0.08); border: 1.5px solid var(--border-color); width: 34px; height: 34px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
                    <i class="ph-bold ph-shield-check" style="color: var(--dark); font-size: 16px;"></i>
                </div>
                <div>
                    <h4 style="margin: 0; font-size: 13.5px; font-weight: 900; color: var(--dark); letter-spacing: -0.3px;">Legal & Compliance</h4>
                    <p style="margin: 2px 0 0; font-size: 10px; font-weight: 750; color: var(--grey-text);">Policies and safety disclosures</p>
                </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 8px;">
                <a href="/privacy-policy" onclick="event.preventDefault(); handleTriggerShowLegalModal('privacy');" style="text-decoration: none; padding: 10px 14px; background: rgba(0,0,0,0.01); border: 1.5px solid var(--border-color); border-radius: 14px; color: var(--dark); text-align: left; font-size: 12px; font-weight: 800; display: flex; align-items: center; justify-content: space-between; width: 100%; cursor: pointer;">
                    <span>Privacy Policy</span>
                    <i class="ph ph-caret-right" style="font-size: 14px; color: var(--grey-text);"></i>
                </a>
                <a href="/terms-and-conditions" onclick="event.preventDefault(); handleTriggerShowLegalModal('terms');" style="text-decoration: none; padding: 10px 14px; background: rgba(0,0,0,0.01); border: 1.5px solid var(--border-color); border-radius: 14px; color: var(--dark); text-align: left; font-size: 12px; font-weight: 800; display: flex; align-items: center; justify-content: space-between; width: 100%; cursor: pointer;">
                    <span>Terms & Conditions</span>
                    <i class="ph ph-caret-right" style="font-size: 14px; color: var(--grey-text);"></i>
                </a>
                <a href="/legal-disclaimer" onclick="event.preventDefault(); handleTriggerShowLegalModal('disclaimer');" style="text-decoration: none; padding: 10px 14px; background: rgba(0,0,0,0.01); border: 1.5px solid var(--border-color); border-radius: 14px; color: var(--dark); text-align: left; font-size: 12px; font-weight: 800; display: flex; align-items: center; justify-content: space-between; width: 100%; cursor: pointer;">
                    <span>Legal Disclaimer</span>
                    <i class="ph ph-caret-right" style="font-size: 14px; color: var(--grey-text);"></i>
                </a>
                <a href="/copyright-policy" onclick="event.preventDefault(); handleTriggerShowLegalModal('copyright');" style="text-decoration: none; padding: 10px 14px; background: rgba(0,0,0,0.01); border: 1.5px solid var(--border-color); border-radius: 14px; color: var(--dark); text-align: left; font-size: 12px; font-weight: 800; display: flex; align-items: center; justify-content: space-between; width: 100%; cursor: pointer;">
                    <span>Copyright Policy</span>
                    <i class="ph ph-caret-right" style="font-size: 14px; color: var(--grey-text);"></i>
                </a>
            </div>
        </div>
    </div>


    <!-- Interactive Results and Analyses Dashboard (Redesigned Responsive Layout) -->
    <div id="scr-results" class="screen">
        <div class="scorecard-block">
            <!-- Decorative Subtle Ambient Glows -->
            <div class="sc-ambient-glow sc-glow-1"></div>
            <div class="sc-ambient-glow sc-glow-2"></div>

            <!-- Top Header Strip -->
            <div class="sc-header-bar">
                <div class="sc-header-left">
                    <span class="sc-badge-pill">
                        <i class="ph-bold ph-trophy"></i>
                        <span>TEST REPORT</span>
                    </span>
                    <h2 class="sc-main-title">MOCK TEST SCORECARD</h2>
                </div>
                <div class="sc-header-right">
                    <p id="resultsTopicHeader" class="sc-topic-header">GENERAL TEST</p>
                    <span class="sc-status-pill">
                        <i class="ph-bold ph-check"></i> Completed
                    </span>
                </div>
            </div>

            <!-- Main Score & Stats Bento Layout -->
            <div class="sc-bento-grid">
                <!-- Left: Big Score & Performance Showcase -->
                <div class="sc-score-showcase">
                    <div class="sc-score-header">
                        <span class="sc-score-label">Obtained Score</span>
                        <span id="statPerformanceBadge" class="sc-perf-badge">Score Summary</span>
                    </div>

                    <div class="sc-score-display">
                        <h1 id="statTotalScoreCalcText" class="sc-score-number">0.00</h1>
                        <span id="statTotalPossibleMarks" class="sc-score-max">/ 100.00</span>
                    </div>

                    <!-- Mini metrics row under score -->
                    <div class="sc-mini-metrics-row">
                        <div class="sc-mini-metric">
                            <div class="sc-mini-icon" style="color: #eab308; background: rgba(234, 179, 8, 0.12);">
                                <i class="ph-bold ph-percent"></i>
                            </div>
                            <div>
                                <span class="sc-mini-label">Accuracy</span>
                                <h4 id="statAccuracyPercent" class="sc-mini-val">0%</h4>
                            </div>
                        </div>

                        <div class="sc-mini-metric">
                            <div class="sc-mini-icon" style="color: #a855f7; background: rgba(168, 85, 247, 0.12);">
                                <i class="ph-bold ph-clock"></i>
                            </div>
                            <div>
                                <span class="sc-mini-label">Time Spent</span>
                                <h4 id="statDurationSpent" class="sc-mini-val">--</h4>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right: 4 Interactive Filter Cards Grid -->
                <div class="sc-filters-grid">
                    <!-- Total Items Card -->
                    <div id="statCardTotal" onclick="handleFilterAnalysisQuestions('all', false)" class="sc-stat-card sc-card-total" title="Tap to view all questions">
                        <div class="sc-stat-top">
                            <span class="sc-stat-icon-wrap" style="color: var(--primary); background: rgba(255, 107, 53, 0.12);">
                                <i class="ph-bold ph-list-numbers"></i>
                            </span>
                            <span class="sc-filter-action-tag">View All</span>
                        </div>
                        <div class="sc-stat-content">
                            <h4 id="statTotalItemsText" class="sc-stat-num">0</h4>
                            <p class="sc-stat-name">Total Items</p>
                        </div>
                    </div>

                    <!-- Correct Card -->
                    <div id="statCardCorrect" onclick="handleFilterAnalysisQuestions('correct', false)" class="sc-stat-card sc-card-correct" title="Tap to view correct questions">
                        <div class="sc-stat-top">
                            <span class="sc-stat-icon-wrap" style="color: #22c55e; background: rgba(34, 197, 94, 0.12);">
                                <i class="ph-bold ph-check-circle"></i>
                            </span>
                            <span class="sc-filter-action-tag">Correct</span>
                        </div>
                        <div class="sc-stat-content">
                            <h4 id="statCorrectCountText" class="sc-stat-num">0</h4>
                            <p class="sc-stat-name">Correct</p>
                        </div>
                    </div>

                    <!-- Incorrect Card -->
                    <div id="statCardIncorrect" onclick="handleFilterAnalysisQuestions('incorrect', false)" class="sc-stat-card sc-card-incorrect" title="Tap to view incorrect questions">
                        <div class="sc-stat-top">
                            <span class="sc-stat-icon-wrap" style="color: #ef4444; background: rgba(239, 68, 68, 0.12);">
                                <i class="ph-bold ph-x-circle"></i>
                            </span>
                            <span class="sc-filter-action-tag">Incorrect</span>
                        </div>
                        <div class="sc-stat-content">
                            <h4 id="statIncorrectCountText" class="sc-stat-num">0</h4>
                            <p class="sc-stat-name">Incorrect</p>
                        </div>
                    </div>

                    <!-- Unanswered Card -->
                    <div id="statCardUnanswered" onclick="handleFilterAnalysisQuestions('unanswered', false)" class="sc-stat-card sc-card-unanswered" title="Tap to view unanswered questions">
                        <div class="sc-stat-top">
                            <span class="sc-stat-icon-wrap" style="color: #3b82f6; background: rgba(59, 130, 246, 0.12);">
                                <i class="ph-bold ph-minus-circle"></i>
                            </span>
                            <span class="sc-filter-action-tag">Unanswered</span>
                        </div>
                        <div class="sc-stat-content">
                            <h4 id="statUnansweredCountText" class="sc-stat-num">0</h4>
                            <p class="sc-stat-name">Unanswered</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Eye Assist Banner (Revealed Answers) -->
            <div onclick="handleShowRevealedAnswersModal()" class="sc-revealed-banner" title="View questions revealed using eye assistant">
                <div class="sc-revealed-left">
                    <span class="sc-revealed-icon">
                        <i class="ph-fill ph-eye"></i>
                    </span>
                    <div>
                        <div class="sc-revealed-title-row">
                            <span class="sc-revealed-label">Revealed (Eye Assist)</span>
                            <span id="statRevealedAnswersCount" class="sc-revealed-count">0</span>
                        </div>
                        <p class="sc-revealed-sub">Answers viewed during test via instant eye helper</p>
                    </div>
                </div>
                <button class="sc-revealed-btn" type="button">
                    <span>View Slides</span>
                    <i class="ph-bold ph-caret-right"></i>
                </button>
            </div>
        </div>

        <!-- Hidden Leaderboard anchor -->
        <div id="resultsLeaderboardBlock" style="display: none !important;"></div>

        <!-- Analysis Section -->
        <div class="sc-analysis-section">
            <div class="sc-analysis-header">
                <div class="sc-analysis-header-left">
                    <h3 class="sc-analysis-title">Analysis</h3>
                    <span id="analysisActiveFilterBadge" class="sc-analysis-badge">All Questions</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <button id="scorecardGlobalLangBtn" onclick="handleToggleScorecardGlobalLanguage()" style="display: none; background: #ffffff; border: 1.5px solid #e2e8f0; color: var(--primary); font-size: 11px; font-weight: 800; border-radius: 9999px; padding: 4px 12px; cursor: pointer; align-items: center; gap: 5px; font-family: 'Outfit', sans-serif; box-shadow: 0 2px 6px rgba(0,0,0,0.04); transition: all 0.2s ease;">
                        <i class="ph-bold ph-translate" style="font-size: 13px;"></i> <span id="scorecardGlobalLangLabel">HINDI</span>
                    </button>
                    <div class="sc-analysis-hint">Tap any question number or use navigation buttons</div>
                </div>
            </div>

            <!-- Horizontal Scrollable Selector Row -->
            <div id="analysisQuestionSelectorRow" class="sc-palette-scroll">
                <!-- Rendered horizontally -->
            </div>

            <!-- Inline Detailed Analysis Card Container -->
            <div id="analysisDetailViewerCard" class="sc-detail-viewer-card">
                <!-- Active Selected Question render here -->
            </div>

            <div class="sc-bottom-actions">
                <button class="btn-fill-prime sc-btn-dashboard" onclick="handleTriggerRefreshReboot()">
                    <i class="ph ph-squares-four" style="font-size: 18px;"></i>
                    <span>Back To Dashboard</span>
                </button>
            </div>
        </div>
    </div>


    <!-- Website Popup General Purpose Custom Modal -->
    <div id="websitePopupOverlayModal" class="analysis-detail-modal" style="display: none; align-items: center; justify-content: center; background: rgba(0,0,0,0.7); z-index: 30000; position: fixed; top: 0; left: 0; right: 0; bottom: 0; padding: 20px; backdrop-filter: blur(3px);">
        <div style="background: white; border-radius: 24px; padding: 30px; width: 100%; max-width: 400px; text-align: center; box-shadow: 0 15px 40px rgba(0,0,0,0.3); animation: zoomIn 0.3s ease; position: relative;">
            
            <!-- Close CUT icon -->
            <button onclick="handleCloseWebsiteActivePopup()" class="close-floating-btn" title="Close">
                &times;
            </button>

            <h2 id="p_modal_title" style="font-weight: 900; font-size: 19px; margin: 5px 0 15px; color: var(--dark); font-family: 'Outfit', 'Anek Devanagari', sans-serif; padding-right: 25px; text-align: left;">
                Notice
            </h2>
            
            <!-- 1:1 image layout -->
            <div style="margin-bottom: 20px; overflow: hidden; border-radius: 16px; border: 1px solid var(--border-color); width: 100%; aspect-ratio: 1/1; background: #fafafa; display: flex; align-items: center; justify-content: center;">
                <img id="p_modal_image" src="" referrerPolicy="no-referrer" style="width: 100%; height: 100%; object-fit: cover; display: none;" alt="Popup Media" />
            </div>

            <p id="p_modal_text" style="font-size: 13.5px; line-height: 1.6; color: #57606f; margin: 0 0 24px; text-align: left; font-family: 'Outfit', 'Anek Devanagari', sans-serif; white-space: pre-wrap; word-break: break-word;">
            </p>
            
            <a id="p_modal_link" href="#" target="_blank" class="btn-fill-prime" style="display: none; background: var(--primary); text-align: center; padding: 14px; border-radius: 12px; font-weight: bold; text-decoration: none; color: white;">
                Explore Details &rarr;
            </a>
        </div>
    </div>


    <!-- Payment Success Custom Modal Popup -->
    <div id="paymentSuccessPopupModal" class="analysis-detail-modal" style="display: none; align-items: center; justify-content: center; background: rgba(0,0,0,0.6); z-index: 10000; position: fixed; top: 0; left: 0; right: 0; bottom: 0; padding: 20px;">
        <div style="background: white; border-radius: 24px; padding: 30px; width: 100%; max-width: 440px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.15); animation: zoomIn 0.3s ease;">
            <i class="ph-fill ph-check-circle" style="font-size: 64px; color: #22c55e; margin-bottom: 15px; display: inline-block;"></i>
            <h2 style="font-weight: 900; font-size: 20px; margin: 0 0 10px; color: var(--dark); font-family: 'Outfit', 'Anek Devanagari', sans-serif;">Submitted Successfully.</h2>
            <p style="font-size: 13.5px; line-height: 1.5; color: var(--grey-text); margin: 0 0 20px; font-family: 'Outfit', 'Anek Devanagari', sans-serif;">Access will be granted within 4–24 hours.</p>
            
            <div style="background: var(--light-grey); border-radius: 12px; padding: 15px; text-align: left; margin-bottom: 20px; font-size: 12px; line-height: 1.5; border: 1px solid var(--border-color); font-family: 'Outfit', 'Anek Devanagari', sans-serif;">
                <strong style="color: var(--dark); display: block; margin-bottom: 4px;">Support Desk:</strong>
                If you face any issue or do not receive access, please contact: <br>
                <a href="mailto:hi@taiyariya.in" target="_blank" style="color: var(--primary); font-weight: bold; text-decoration: underline;">hi@taiyariya.in</a>
                <p style="margin: 8px 0 0 0; font-size: 11px; color: var(--grey-text); font-style: italic;">
                    *Please provide your transaction details while contacting support.
                </p>
            </div>
            
            <button onclick="handleClosePaymentSuccessModal()" class="btn-fill-prime" style="margin: 0; width: 100%; background: var(--dark); padding: 12px; border-radius: 10px;">
                Done & Return Home
            </button>
        </div>
    </div>


    <!-- Gated Content Premium Blocker Custom Modal -->
    <div id="premiumBlockerModal" class="analysis-detail-modal" style="display: none; align-items: center; justify-content: center; background: rgba(0,0,0,0.6); z-index: 10000; position: fixed; top: 0; left: 0; right: 0; bottom: 0; padding: 20px;">
        <div style="background: white; border-radius: 24px; padding: 30px; width: 100%; max-width: 400px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.15); animation: zoomIn 0.3s ease;">
            <i class="ph-fill ph-lock-key" style="font-size: 64px; color: var(--primary); margin-bottom: 15px; display: inline-block;"></i>
            <h2 style="font-weight: 900; font-size: 20px; margin: 0 0 10px; color: var(--dark); font-family: 'Outfit', 'Anek Devanagari', sans-serif;">Premium Membership Required</h2>
            <p style="font-size: 13px; line-height: 1.5; color: var(--grey-text); margin: 0 0 24px; font-family: 'Outfit', 'Anek Devanagari', sans-serif;">This content is reserved for Premium Members. Gain access to all mock exams, manuals, and future worksheets instantly.</p>
            
            <div style="display: flex; flex-direction: column; gap: 10px;">
                <button onclick="handleClosePremiumBlocker(); handleTabNavigation('acc')" class="btn-fill-prime" style="background: var(--primary); margin: 0; font-size: 13px; border-radius: 10px;">
                    <i class="ph ph-user"></i> Login to Premium Account
                </button>
                <button onclick="handleClosePremiumBlocker(); showGeneralPremiumPaymentScreen()" class="btn-fill-prime" style="background: var(--dark); margin: 0; font-size: 13px; border-radius: 10px;">
                    <i class="ph ph-crown"></i> Unlock Premium (${social.premiumPrice || "₹45"})
                </button>
                <button onclick="handleClosePremiumBlocker()" class="modal-cancel-btn">
                    Cancel
                </button>
            </div>
        </div>
    </div>


    <!-- Test Protection & Pause Resume Modal -->
    <div id="testPauseResumeModal" class="analysis-detail-modal" style="display: none; align-items: center; justify-content: center; background: rgba(0,0,0,0.8); z-index: 20000; position: fixed; top: 0; left: 0; right: 0; bottom: 0; padding: 20px; backdrop-filter: blur(5px);">
        <div style="background: white; border-radius: 24px; padding: 30px; width: 100%; max-width: 400px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.2); animation: zoomIn 0.3s ease;">
            <i class="ph-bold ph-warning-octagon" style="font-size: 64px; color: var(--primary); margin-bottom: 15px; display: inline-block;"></i>
            <h2 style="font-weight: 950; font-size: 20px; margin: 0 0 10px; color: var(--dark);">Assessment Paused</h2>
            <p style="font-size: 13px; line-height: 1.5; color: var(--grey-text); margin: 0 0 24px;">The test was auto-paused due to window context switching, loss of focus, application lock, or clicking the Back button. Your progress is completely protected.</p>
            
            <div style="display: flex; flex-direction: column; gap: 10px;">
                <button onclick="handleResumeActiveTest()" class="btn-fill-prime" style="background: #22c55e; color: white; width: 100%; padding: 12px; border-radius: 12px; font-weight: bold; font-size: 13.5px; margin: 0; border: none; cursor: pointer;">
                    Resume Test
                </button>
                <button onclick="handleExitActiveTest()" class="modal-cancel-btn" style="width: 100%; border-radius: 12px; padding: 12px; font-size: 13.5px;">
                    Exit Test
                </button>
            </div>
        </div>
    </div>


    <!-- Submit Test Progress Stats Redesigned Custom Modal -->
    <div id="submitConfirmModal" class="analysis-detail-modal" style="display: none; align-items: center; justify-content: center; background: rgba(0,0,0,0.6); z-index: 10010; position: fixed; top: 0; left: 0; right: 0; bottom: 0; padding: 20px;">
        <div style="background: white; border-radius: 24px; padding: 30px; width: 100%; max-width: 420px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.15); animation: zoomIn 0.3s ease;">
            <i class="ph-bold ph-question" style="font-size: 54px; color: var(--primary); margin-bottom: 15px; display: inline-block;"></i>
            <h2 style="font-weight: 900; font-size: 20px; margin: 0 0 8px; color: var(--dark); font-family: 'Outfit', 'Anek Devanagari', sans-serif;">Submit Your Mock Test?</h2>
            <p style="font-size: 13px; color: var(--grey-text); margin-bottom: 24px; font-family: 'Outfit', 'Anek Devanagari', sans-serif;">Please review your progress before final evaluation. Once submitted, answers cannot be modified.</p>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 24px;">
                <div style="background: rgba(34, 197, 94, 0.08); border: 1.5px solid rgba(34, 197, 94, 0.2); border-radius: 16px; padding: 12px; text-align: center;">
                    <p style="margin: 0; font-size: 10px; font-weight: bold; color: rgb(21, 128, 61); text-transform: uppercase;">Attempted</p>
                    <h3 id="confirmAttemptedCount" style="margin: 4px 0 0; font-size: 24px; font-weight: 900; color: rgb(21, 128, 61);">0</h3>
                </div>
                <div style="background: rgba(239, 68, 68, 0.08); border: 1.5px solid rgba(239, 68, 68, 0.2); border-radius: 16px; padding: 12px; text-align: center;">
                    <p style="margin: 0; font-size: 10px; font-weight: bold; color: rgb(185, 28, 28); text-transform: uppercase;">Unattempted</p>
                    <h3 id="confirmUnattemptedCount" style="margin: 4px 0 0; font-size: 24px; font-weight: 900; color: rgb(185, 28, 28);">0</h3>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <button onclick="handleCloseSubmitConfirmModal()" class="modal-cancel-btn" style="padding: 14px; font-size: 13px;">
                    Cancel
                </button>
                <button onclick="handleConfirmSubmitTest()" class="btn-fill-prime" style="margin: 0; padding: 14px; font-size: 13px; background: var(--primary); border-radius: 12px;">
                    Submit Test
                </button>
            </div>
        </div>
    </div>


    <!-- Report Active Question Complaint Drawer-Modal Overlay -->
    <div id="reportQuestionModal" class="analysis-detail-modal" style="display: none; align-items: center; justify-content: center; background: rgba(0,0,0,0.6); z-index: 10020; position: fixed; top: 0; left: 0; right: 0; bottom: 0; padding: 20px;">
        <div style="background: white; border-radius: 24px; padding: 25px; width: 100%; max-width: 450px; text-align: left; box-shadow: 0 10px 25px rgba(0,0,0,0.15); animation: zoomIn 0.3s ease; display: flex; flex-direction: column; gap: 15px;">
            <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 10px;">
                <h3 style="margin: 0; font-weight: 950; font-size: 17px; color: var(--dark); font-family: 'Outfit', 'Anek Devanagari', sans-serif;">Report Question Discrepancy</h3>
                <div class="circle-close-btn" onclick="handleCloseReportModal()">
                    <i class="ph ph-x" style="font-size: 16px;"></i>
                </div>
            </div>
            
            <div>
                <label style="font-size: 11px; font-weight: bold; color: var(--grey-text); display: block; margin-bottom: 6px; text-transform: uppercase;">What is wrong with this question? (Optional)</label>
                <textarea id="reportComplaintTextArea" class="form-input" style="height: 110px; resize: none; margin-bottom: 0; font-family: inherit; font-size: 13px; border-radius: 12px; padding: 12px;" placeholder="Describe typo inaccuracies, incorrect correct options keys, solution explanations, or translation bugs..."></textarea>
            </div>
            
            <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 5px;">
                <button onclick="handleCloseReportModal()" class="modal-cancel-btn" style="padding: 12px 18px; font-size: 12px;">
                    Cancel
                </button>
                <button id="btnSendReportEmail" onclick="handleSendReportEmail()" class="btn-fill-prime" style="margin: 0; padding: 12px 20px; font-size: 12px; background: var(--primary); border-radius: 10px;">
                    <i class="ph ph-paper-plane"></i> Send Report Email
                </button>
            </div>
        </div>
    </div>


    <!-- Question Palette Drawer -->
    <div class="drawer-sheet-overlay" id="paletteDrawerOverlay" onclick="handleTogglePalette(false)"></div>
    <div class="drawer-sheet" id="paletteDrawerContainer">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 12px;">
            <h3 style="margin: 0; font-weight: 900;">Mock Exam Palette</h3>
            <div class="drawer-close-btn" onclick="handleTogglePalette(false)">
                <i class="ph ph-x" style="font-size: 18px;"></i>
            </div>
        </div>

        <div class="palette-grid" id="paletteGridContent"></div>

        <div class="palette-legend">
            <div class="legend-item"><div class="palette-cell answered" style="width:16px; height:16px; aspect-ratio:1;"></div> Answered</div>
            <div class="legend-item"><div class="palette-cell review-marked" style="width:16px; height:16px; aspect-ratio:1;"></div> Marked</div>
            <div class="legend-item"><div class="palette-cell not-visited" style="width:16px; height:16px; aspect-ratio:1;"></div> Not Visited</div>
        </div>

        <button class="btn-fill-prime" onclick="handleTogglePalette(false)" style="margin-top: 15px; padding: 12px;">
            CONTINUE TEST
        </button>
    </div>


    <!-- Revealed Answers Bottom Sheet Drawer -->
    <div class="drawer-sheet-overlay" id="revealedDrawerOverlay" onclick="handleToggleRevealedAnswers(false)"></div>
    <div class="drawer-sheet" id="revealedAnswersDrawer" style="display: none; padding: 20px; border-radius: 24px 24px 0 0; max-height: 85vh; overflow-y: hidden;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 12px; margin-bottom: 15px; flex-shrink: 0;">
            <div style="display: flex; align-items: center; gap: 8px;">
                <i class="ph-fill ph-eye" style="color: #10b981; font-size: 20px;"></i>
                <h3 style="margin: 0; font-weight: 900; font-size: 16px;">Revealed Practice Sheet</h3>
            </div>
            <div class="drawer-close-btn" onclick="handleToggleRevealedAnswers(false)" style="cursor: pointer; padding: 4px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: var(--light-grey); width: 28px; height: 28px; border: 1px solid var(--border-color);">
                <i class="ph ph-x" style="font-size: 16px; color: var(--dark);"></i>
            </div>
        </div>

        <!-- Horizontal Slide Container -->
        <div id="revealedCarouselContainer" style="display: flex; flex-direction: column; flex-grow: 1; overflow: hidden; height: 100%;">
            <!-- Navigation Indicator Row -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; background: var(--light-grey); padding: 8px 12px; border-radius: 12px; border: 1px solid var(--border-color); flex-shrink: 0;">
                <button onclick="handleSlideRevealedPrev()" id="btnSlideRevealedPrev" style="background: none; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 4px; color: var(--dark);" title="Previous Revealed Question">
                    <i class="ph-bold ph-caret-left" style="font-size: 18px;"></i>
                </button>
                <span id="revealedSlideIndicatorText" style="font-size: 12px; font-weight: 800; color: var(--dark);">Question 1 of 1</span>
                <button onclick="handleSlideRevealedNext()" id="btnSlideRevealedNext" style="background: none; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 4px; color: var(--dark);" title="Next Revealed Question">
                    <i class="ph-bold ph-caret-right" style="font-size: 18px;"></i>
                </button>
            </div>

            <!-- Scrollable Slides Viewport -->
            <div id="revealedSlidesViewport" style="display: flex; overflow-x: auto; scroll-snap-type: x mandatory; scroll-behavior: smooth; gap: 20px; width: 100%; flex-grow: 1; overflow-y: auto; padding-bottom: 15px; -webkit-overflow-scrolling: touch; scrollbar-width: none;">
                <!-- Dynamically filled with slides -->
            </div>
        </div>
    </div>


    <!-- GLOBAL DESKTOP FOOTER (Desktop & Laptop screens >= 1025px) -->
    <footer class="desktop-main-footer">
        <div class="desktop-footer-bottom">
            <div class="desktop-footer-copyright">
                <span class="desktop-footer-dot"></span>
                <span>&copy; ${new Date().getFullYear()} Taiyariya. All Rights Reserved.</span>
            </div>
            <div class="desktop-footer-links-inline">
                <a href="/privacy-policy" onclick="event.preventDefault(); handleTriggerShowLegalModal('privacy');" class="desktop-footer-link">
                    <i class="ph ph-shield"></i> Privacy
                </a>
                <span class="desktop-footer-sep">&bull;</span>
                <a href="/terms-and-conditions" onclick="event.preventDefault(); handleTriggerShowLegalModal('terms');" class="desktop-footer-link">
                    <i class="ph ph-scroll"></i> Terms
                </a>
                <span class="desktop-footer-sep">&bull;</span>
                <a href="/legal-disclaimer" onclick="event.preventDefault(); handleTriggerShowLegalModal('disclaimer');" class="desktop-footer-link">
                    <i class="ph ph-warning-circle"></i> Disclaimer
                </a>
                <span class="desktop-footer-sep">&bull;</span>
                <a href="/copyright-policy" onclick="event.preventDefault(); handleTriggerShowLegalModal('copyright');" class="desktop-footer-link">
                    <i class="ph ph-copyright"></i> Copyright
                </a>
            </div>
        </div>
    </footer>


    <!-- BOTTOM NAVIGATION TABS -->
    <div class="bottom-nav-bar" id="studentMainTabsPanel">
        <div class="bottom-nav-item active" id="tab-home" onclick="handleTabNavigation('home')">
            <i class="ph ph-house"></i>
            <span>Home</span>
        </div>
        <div class="bottom-nav-item" id="tab-tests" onclick="handleTabNavigation('tests')">
            <i class="ph ph-exam"></i>
            <span>Tests</span>
        </div>
        <div class="bottom-nav-item" id="tab-pdfs" onclick="handleTabNavigation('pdfs')">
            <i class="ph ph-file-pdf"></i>
            <span>PDFs</span>
        </div>
        <div class="bottom-nav-item" id="tab-acc" onclick="handleTabNavigation('acc')">
            <i class="ph ph-user"></i>
            <span>Account</span>
        </div>
    </div>


    <!-- Beautiful Custom Legal Policy Modal -->
    <div id="legalPolicyModalOverlay" style="display: none; align-items: center; justify-content: center; background: rgba(15, 23, 42, 0.45); z-index: 9999999; position: fixed; top: 0; left: 0; right: 0; bottom: 0; padding: 20px; backdrop-filter: blur(8px); transition: all 0.2s ease;">
        <div class="custom-dialog-card" style="border-radius: 24px; padding: 24px; width: 100%; max-width: 500px; max-height: 80vh; display: flex; flex-direction: column; text-align: left; animation: customZoomIn 0.25s cubic-bezier(0.16, 1, 0.3, 1); box-sizing: border-box; background: var(--bg-card); border: 1.5px solid var(--border-color);">
            <!-- Modal Header -->
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; border-bottom: 1.5px solid var(--border-color); padding-bottom: 14px; flex-shrink: 0;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="background: rgba(0, 156, 252, 0.1); width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 1.5px solid rgba(0, 156, 252, 0.2);">
                        <i class="ph-bold ph-shield-check" style="font-size: 18px; color: #009CFC;"></i>
                    </div>
                    <div>
                        <h3 id="legalPolicyModalTitle" style="margin: 0; font-size: 16px; font-weight: 850; color: var(--dark);">Legal Policy</h3>
                    </div>
                </div>
                <button onclick="closeLegalPolicyModal()" style="background: none; border: none; color: var(--grey-text); cursor: pointer; padding: 4px; display: inline-flex; align-items: center; justify-content: center;">
                    <i class="ph-bold ph-x" style="font-size: 20px;"></i>
                </button>
            </div>
            <!-- Modal Content (Scrollable) -->
            <div id="legalPolicyModalContent" style="overflow-y: auto; flex-grow: 1; padding-right: 4px; font-size: 12.5px; color: var(--grey-text); line-height: 1.6;">
                <!-- Content injected dynamically -->
            </div>
            <!-- Modal Footer -->
            <div style="margin-top: 16px; border-top: 1.5px solid var(--border-color); padding-top: 14px; display: flex; justify-content: flex-end; flex-shrink: 0;">
                <button onclick="closeLegalPolicyModal()" class="btn-fill-prime" style="margin: 0; padding: 10px 24px; border-radius: 12px; font-weight: 800; font-size: 12px; cursor: pointer; height: auto;">
                    Understood & Close
                </button>
            </div>
        </div>
    </div>


    <!-- Beautiful Custom Helpdesk Contact Form Modal -->
    <div id="helpdeskModalOverlay" style="display: none; align-items: center; justify-content: center; background: rgba(15, 23, 42, 0.45); z-index: 999999; position: fixed; top: 0; left: 0; right: 0; bottom: 0; padding: 20px; backdrop-filter: blur(8px); transition: all 0.2s ease;">
        <div class="custom-dialog-card" style="border-radius: 24px; padding: 28px 24px; width: 100%; max-width: 400px; text-align: left; animation: customZoomIn 0.25s cubic-bezier(0.16, 1, 0.3, 1); box-sizing: border-box;">
            <!-- Modal Header -->
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px; border-bottom: 1.5px solid rgba(0,0,0,0.05); padding-bottom: 16px;">
                <div style="background: rgba(37, 211, 102, 0.1); width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 1.5px solid rgba(37, 211, 102, 0.2); flex-shrink: 0;">
                    <i class="ph-fill ph-headset" style="font-size: 24px; color: #25d366;"></i>
                </div>
                <div>
                    <h3 style="margin: 0; font-size: 18px; font-weight: 850; color: #0f172a; font-family: 'Outfit', 'Anek Devanagari', sans-serif; letter-spacing: -0.02em;">Contact Help Desk</h3>
                    <p style="margin: 2px 0 0 0; font-size: 11.5px; color: #64748b; font-weight: 600;">Fill details to pre-fill your support chat</p>
                </div>
            </div>

            <!-- Auto-detected details badge -->
            <div style="background: rgba(255, 107, 53, 0.05); border: 1px solid rgba(255, 107, 53, 0.15); border-radius: 12px; padding: 12px; margin-bottom: 18px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                    <span style="font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase;">Selected Plan:</span>
                    <span id="helpdeskDetectedCategory" style="font-size: 11.5px; font-weight: 800; color: var(--primary);">Loading...</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase;">Price:</span>
                    <span id="helpdeskDetectedAmount" style="font-size: 13px; font-weight: 900; color: #2ecc71;">₹00</span>
                </div>
            </div>

            <!-- Inputs -->
            <div style="display: flex; flex-direction: column; gap: 12px;">
                <div>
                    <label style="display: block; font-size: 11.5px; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 6px; letter-spacing: 0.5px;">Full Name *</label>
                    <input id="helpdeskInputName" type="text" placeholder="Enter your full name" style="padding: 12px 14px; border-radius: 12px; border: 1.5px solid #cbd5e1; font-size: 13.5px; width: 100%; box-sizing: border-box; font-weight: 600; outline: none; background: #fff; color: #0f172a; transition: all 0.2s;" />
                </div>

                <div>
                    <label style="display: block; font-size: 11.5px; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 6px; letter-spacing: 0.5px;">Email ID *</label>
                    <input id="helpdeskInputEmail" type="email" placeholder="Enter your registered email" style="padding: 12px 14px; border-radius: 12px; border: 1.5px solid #cbd5e1; font-size: 13.5px; width: 100%; box-sizing: border-box; font-weight: 600; outline: none; background: #fff; color: #0f172a; transition: all 0.2s;" />
                </div>

                <div>
                    <label style="display: block; font-size: 11.5px; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 6px; letter-spacing: 0.5px;">Phone Number *</label>
                    <input id="helpdeskInputPhone" type="tel" placeholder="Enter your mobile number" style="padding: 12px 14px; border-radius: 12px; border: 1.5px solid #cbd5e1; font-size: 13.5px; width: 100%; box-sizing: border-box; font-weight: 600; outline: none; background: #fff; color: #0f172a; transition: all 0.2s;" />
                </div>
            </div>

            <!-- Error container -->
            <div id="helpdeskModalError" style="display: none; color: #ef4444; font-size: 12px; font-weight: 700; margin-top: 12px; text-align: center;"></div>

            <!-- Actions -->
            <div style="display: flex; gap: 12px; margin-top: 22px;">
                <button onclick="closeHelpdeskModal()" style="flex: 1; padding: 13px; border-radius: 12px; font-weight: 800; cursor: pointer; font-size: 12.5px; justify-content: center; margin: 0; height: auto; border: 1.5px solid #e2e8f0; background: #f8fafc; color: #475569; transition: all 0.2s; text-transform: uppercase; letter-spacing: 0.5px;">Close</button>
                <button onclick="submitHelpdeskModal()" class="btn-fill-prime" style="flex: 1.4; margin: 0; padding: 13px; border-radius: 12px; font-weight: 800; font-size: 12.5px; cursor: pointer; height: auto; background: #25d366; color: #ffffff; border: none; transition: all 0.2s; text-transform: uppercase; letter-spacing: 0.5px; display: inline-flex; align-items: center; justify-content: center; gap: 6px; box-shadow: 0 4px 12px rgba(37, 211, 102, 0.2);"><i class="ph-bold ph-paper-plane-tilt" style="font-size: 14px;"></i> Open Chat</button>
            </div>
        </div>
    </div>


    <!-- Beautiful Custom Dialog Modal (Alert/Confirm) -->
    <div id="customDialogOverlay" style="display: none; align-items: center; justify-content: center; background: rgba(15, 23, 42, 0.45); z-index: 999999; position: fixed; top: 0; left: 0; right: 0; bottom: 0; padding: 20px; backdrop-filter: blur(8px); transition: all 0.2s ease;">
        <div id="customDialogBox" class="custom-dialog-card" style="border-radius: 24px; padding: 32px 24px; width: 100%; max-width: 380px; text-align: center; animation: customZoomIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);">
            <div id="customDialogIconContainer" style="margin-bottom: 18px; display: flex; align-items: center; justify-content: center;">
                <div style="background: rgba(249,115,22,0.1); width: 68px; height: 68px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid rgba(249,115,22,0.2); margin-bottom: 8px;">
                    <i class="ph-fill ph-warning" style="font-size: 34px; color: #f97316;"></i>
                </div>
            </div>
            <h3 id="customDialogTitle" style="margin: 0 0 10px 0; font-size: 20px; font-weight: 850; color: #0f172a; font-family: 'Outfit', 'Anek Devanagari', sans-serif; letter-spacing: -0.02em;">System Alert</h3>
            <p id="customDialogMessage" style="margin: 0 0 24px 0; font-size: 14px; color: #475569; line-height: 1.6; font-weight: 600; font-family: 'Outfit', 'Anek Devanagari', sans-serif; white-space: pre-line; padding: 0 4px;">Something happened.</p>
            <div style="display: flex; gap: 12px; justify-content: center;">
                <button id="customDialogCancelBtn" class="modal-cancel-btn" style="flex: 1; padding: 14px; border-radius: 14px; font-weight: 800; cursor: pointer; display: none; font-size: 13px; justify-content: center; margin: 0; height: auto; border: 1.5px solid #e2e8f0; background: #f8fafc; color: #475569; transition: all 0.2s;">CANCEL</button>
                <button id="customDialogOkBtn" class="btn-fill-prime" style="flex: 1; margin: 0; padding: 14px; border-radius: 14px; font-weight: 800; font-size: 13px; cursor: pointer; height: auto; background: #0f172a; color: #ffffff; border: none; transition: all 0.2s; text-transform: uppercase;">OK</button>
            </div>
        </div>
    </div>


    <!-- Beautiful Custom Prompt Modal for Password Authorization -->
    <div id="customPromptOverlay" style="display: none; align-items: center; justify-content: center; background: rgba(15, 23, 42, 0.45); z-index: 999999; position: fixed; top: 0; left: 0; right: 0; bottom: 0; padding: 20px; backdrop-filter: blur(8px); transition: all 0.2s ease;">
        <div class="custom-dialog-card" style="border-radius: 24px; padding: 32px 24px; width: 100%; max-width: 380px; text-align: center; animation: customZoomIn 0.25s cubic-bezier(0.16, 1, 0.3, 1); box-sizing: border-box;">
            <!-- Modal Icon -->
            <div style="margin-bottom: 18px; display: flex; align-items: center; justify-content: center;">
                <div style="background: rgba(255, 184, 0, 0.1); width: 68px; height: 68px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2.5px solid rgba(255, 184, 0, 0.2); box-shadow: 0 4px 10px rgba(255,184,0,0.08); margin-bottom: 8px;">
                    <i class="ph-fill ph-lock" style="font-size: 34px; color: var(--primary);"></i>
                </div>
            </div>
            
            <h3 id="customPromptTitle" style="margin: 0 0 10px 0; font-size: 20px; font-weight: 850; color: #0f172a; font-family: 'Outfit', 'Anek Devanagari', sans-serif; letter-spacing: -0.02em;">Authorization</h3>
            <p id="customPromptMessage" style="margin: 0 0 18px 0; font-size: 13.5px; color: #475569; line-height: 1.5; font-weight: 600; padding: 0 4px;">Enter your password to proceed.</p>
            
            <!-- Input container -->
            <div style="position: relative; margin-bottom: 22px; width: 100%; text-align: left;">
                <i class="ph ph-lock" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--grey-text); font-size: 16px;"></i>
                <input type="password" id="customPromptInput" class="form-input" placeholder="••••••••" style="padding-left: 42px; padding-right: 42px; margin: 0; border-radius: 12px; height: 46px; font-size: 13px; width: 100%; box-sizing: border-box; border: 1.5px solid var(--border-color); background: rgba(0,0,0,0.01);">
                <button type="button" onclick="toggleCustomPromptPasswordVisibility()" style="position: absolute; right: 14px; top: 50%; transform: translateY(-50%); border: none; background: transparent; padding: 0; cursor: pointer; color: var(--grey-text); display: flex; align-items: center; justify-content: center;">
                    <i id="customPromptEyeIcon" class="ph ph-eye-slash" style="font-size: 18px;"></i>
                </button>
            </div>

            <!-- Buttons -->
            <div style="display: flex; gap: 12px; justify-content: center; width: 100%;">
                <button id="customPromptCancelBtn" class="modal-cancel-btn" style="flex: 1; padding: 14px; border-radius: 14px; font-weight: 800; cursor: pointer; font-size: 13px; justify-content: center; margin: 0; height: auto;">CANCEL</button>
                <button id="customPromptConfirmBtn" class="btn-fill-prime" style="flex: 1; margin: 0; padding: 14px; border-radius: 14px; font-weight: 800; font-size: 13px; cursor: pointer; height: auto; text-transform: uppercase;">CONFIRM</button>
            </div>
        </div>
    </div>

    <!-- Copyright DISCLAIMER PDF Safe Gate Modal (Popup) -->
    <div id="copyrightPdfOverlay" style="display: none; align-items: flex-start; justify-content: center; background: rgba(15,23,42,0.85); z-index: 1000000; position: fixed; top: 0; left: 0; right: 0; bottom: 0; padding: 20px; overflow-y: auto; backdrop-filter: blur(8px); transition: all 0.25s ease;">
        <div class="custom-dialog-card copyright-pdf-card" style="border-radius: 24px; padding: 32px 24px; width: 100%; max-width: 420px; text-align: center; margin: auto; position: relative; max-height: calc(100vh - 40px); overflow-y: auto; animation: customZoomIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);">
            <div style="margin-bottom: 18px; display: flex; align-items: center; justify-content: center;">
                <div class="copyright-warning-container" style="width: 68px; height: 68px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    <i class="ph-fill ph-warning" style="font-size: 34px; color: #d97706;"></i>
                </div>
            </div>
            
            <h3 class="copyright-pdf-title" style="margin: 0 0 10px 0; font-size: 22px; font-weight: 850; font-family: 'Outfit', 'Anek Devanagari', sans-serif; letter-spacing: -0.02em;">Notice</h3>
            <p id="copyrightPdfBookTitle" style="margin: 0 0 20px 0; font-size: 13.5px; color: var(--primary); font-family: 'Outfit', 'Anek Devanagari', sans-serif; font-weight: 750; word-break: break-all; opacity: 0.95; line-height: 1.4;"></p>
            
            <div style="text-align: left; font-family: 'Outfit', 'Anek Devanagari', sans-serif; font-size: 13.5px; line-height: 1.6;">
                
                <!-- For Educational Purpose Only (Badged layout) -->
                <div class="copyright-edu-box" style="border-radius: 12px; padding: 12px 16px; margin-bottom: 14px; display: flex; gap: 10px; align-items: flex-start;">
                    <i class="ph-fill ph-graduation-cap" style="color: var(--primary); font-size: 18px; margin-top: 2px; flex-shrink: 0;"></i>
                    <div>
                        <strong class="copyright-edu-title" style="font-weight: 800; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 2px;">For Educational Purpose Only</strong>
                        <span class="copyright-edu-text" style="font-size: 12.5px; font-weight: 500;">This material is distributed strictly for guidance, study aids, and educational purposes.</span>
                    </div>
                </div>

                <!-- All Rights Block -->
                <div class="dialog-sub-box" style="margin-bottom: 20px; display: flex; gap: 10px; align-items: flex-start;">
                    <i class="ph-fill ph-info" style="color: #64748b; font-size: 18px; margin-top: 2px; flex-shrink: 0;"></i>
                    <div>
                        <strong class="sub-box-text" style="font-weight: 800; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 2px;">All Rights Reserved</strong>
                        <span class="sub-box-text" style="font-size: 12.5px; font-weight: 500;">All copyrights, trademarks, and intellectual merits belong to their respective publishers & creators. We do not claim ownership of this content.</span>
                    </div>
                </div>

                <!-- Contact section -->
                <div class="copyright-contact-section" style="padding-top: 16px; margin-bottom: 24px;">
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <span class="copyright-contact-label" style="font-weight: 700; font-size: 13px;">Concerned or want it removed? Email us:</span>
                        <a id="copyrightEmailBtn" class="copyright-email-btn" href="#" style="display: inline-flex; align-items: center; justify-content: center; gap: 8px; font-weight: 800; text-decoration: none; padding: 12px 16px; border-radius: 14px; transition: all 0.2s; font-size: 13px; font-mono; letter-spacing: -0.01em;">
                            <i class="ph-fill ph-envelope-simple" style="font-size: 18px;"></i> hi@taiyariya.in
                        </a>
                    </div>
                </div>
            </div>

            <div style="display: flex; gap: 12px; justify-content: center;">
                <button id="copyrightPdfCancelBtn" class="modal-cancel-btn" style="flex: 1; padding: 14px; border-radius: 14px; font-weight: 800; cursor: pointer; font-size: 13px; margin: 0; height: auto;">CLOSE</button>
                <button id="copyrightPdfDownloadBtn" class="btn-fill-prime" style="flex: 1; margin: 0; padding: 14px; border-radius: 14px; font-weight: 800; font-size: 13px; cursor: pointer; height: auto; text-transform: uppercase; white-space: nowrap;">PROCEED DOWNLOAD</button>
            </div>
        </div>
    </div>
    <style>
        @keyframes customZoomIn {
            from { opacity: 0; transform: scale(0.92); }
            to { opacity: 1; transform: scale(1); }
        }
        
        /* High-End Premium Custom Dialog Box Styling */
        .custom-dialog-card {
            background: #ffffff !important;
            color: #0f172a !important;
            border: 1px solid rgba(15, 23, 42, 0.08) !important;
            box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.05), 0 10px 10px -5px rgba(15, 23, 42, 0.03) !important;
            transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }

        /* Copyright PDF safe gate modal day/night modes compatibility styling */
        .copyright-pdf-card::-webkit-scrollbar {
            width: 4px;
        }
        .copyright-pdf-card::-webkit-scrollbar-track {
            background: transparent;
        }
        .copyright-pdf-card::-webkit-scrollbar-thumb {
            background: rgba(155, 89, 182, 0.25);
            border-radius: 10px;
        }
        body.dark-mode .copyright-pdf-card::-webkit-scrollbar-thumb {
            background: rgba(155, 89, 182, 0.4);
        }

        @media (max-width: 480px) {
            .copyright-pdf-card {
                padding: 22px 18px !important;
                border-radius: 18px !important;
                max-height: calc(100vh - 30px) !important;
            }
            .copyright-pdf-card h3 {
                font-size: 18px !important;
            }
            .copyright-warning-container {
                width: 52px !important;
                height: 52px !important;
                margin-bottom: 12px !important;
            }
            .copyright-warning-container i {
                font-size: 26px !important;
            }
            .copyright-edu-box, .dialog-sub-box {
                padding: 10px 12px !important;
                margin-bottom: 10px !important;
                gap: 8px !important;
            }
            .copyright-edu-title, .sub-box-text {
                font-size: 11px !important;
            }
            .copyright-edu-text, .sub-box-text {
                font-size: 11.5px !important;
            }
            .copyright-contact-section {
                padding-top: 12px !important;
                margin-bottom: 16px !important;
            }
            .copyright-email-btn {
                padding: 10px 12px !important;
                font-size: 11.5px !important;
            }
            .copyright-pdf-card button {
                padding: 11px !important;
                font-size: 12px !important;
                border-radius: 10px !important;
            }
        }

        @media (max-height: 640px) {
            .copyright-pdf-card {
                padding: 16px 16px !important;
                border-radius: 16px !important;
                max-height: calc(100vh - 20px) !important;
            }
            .copyright-warning-container {
                display: none !important;
            }
            .copyright-pdf-card h3 {
                margin-bottom: 4px !important;
                font-size: 17px !important;
            }
            #copyrightPdfBookTitle {
                margin-bottom: 10px !important;
                font-size: 12px !important;
            }
            .copyright-edu-box, .dialog-sub-box {
                padding: 8px 10px !important;
                margin-bottom: 8px !important;
                gap: 6px !important;
            }
            .copyright-contact-section {
                padding-top: 8px !important;
                margin-bottom: 12px !important;
            }
            .copyright-email-btn {
                padding: 8px 12px !important;
                font-size: 11px !important;
            }
            .copyright-pdf-card button {
                padding: 10px !important;
                font-size: 11px !important;
                border-radius: 8px !important;
            }
        }

        .copyright-pdf-title {
            color: #0f172a !important;
        }
        body.dark-mode .copyright-pdf-title {
            color: #efece6 !important;
        }
        
        .copyright-warning-container {
            background: #fffbeb !important;
            border: 2px solid #fef3c7 !important;
        }
        body.dark-mode .copyright-warning-container {
            background: rgba(217, 119, 6, 0.15) !important;
            border-color: rgba(217, 119, 6, 0.3) !important;
        }

        .copyright-edu-box {
            background: rgba(255, 107, 53, 0.08) !important;
            border-left: 4px solid var(--primary) !important;
        }
        body.dark-mode .copyright-edu-box {
            background: rgba(255, 107, 53, 0.15) !important;
        }

        .copyright-edu-title {
            color: #c2410c !important;
        }
        body.dark-mode .copyright-edu-title {
            color: #ff8a58 !important;
        }

        .copyright-edu-text {
            color: #7c2d12 !important;
        }
        body.dark-mode .copyright-edu-text {
            color: #ffd8c6 !important;
        }

        .copyright-contact-section {
            border-top: 1.5px dashed #e2e8f0 !important;
        }
        body.dark-mode .copyright-contact-section {
            border-top: 1.5px dashed #3e3d39 !important;
        }

        .copyright-contact-label {
            color: #1e293b !important;
        }
        body.dark-mode .copyright-contact-label {
            color: #efece6 !important;
        }

        .copyright-email-btn {
            background: #fee2e2 !important;
            color: #991b1b !important;
            border: 1.5px solid #fecaca !important;
        }
        body.dark-mode .copyright-email-btn {
            background: rgba(239, 68, 68, 0.15) !important;
            color: #fca5a5 !important;
            border: 1.5px solid rgba(239, 68, 68, 0.3) !important;
        }
        
        /* Dark Mode Theme Overrides for Dialog Box */
        body.dark-mode .custom-dialog-card {
            background-color: #1a1a18 !important;
            border: 2px solid #3e3d39 !important;
            color: #efece6 !important;
            box-shadow: 0 25px 50px -12px rgba(0,0,0,0.65), 0 0 1px rgba(255,255,255,0.1) !important;
        }
        
        body.dark-mode #customDialogTitle {
            color: #ffffff !important;
        }
        
        body.dark-mode #customDialogMessage {
            color: #cbd5e1 !important;
        }

        /* Specific Dialogue Subcomponents styling for Day/Night Modes compatibility */
        .dialog-intro-text {
            color: #475569;
        }
        body.dark-mode .dialog-intro-text {
            color: #cbd5e1 !important;
        }

        .dialog-highlight-box {
            background: rgba(255, 184, 0, 0.07);
            border-left: 4px solid var(--primary);
            border-radius: 12px;
            padding: 12px 14px;
            margin-bottom: 12px;
            display: flex;
            gap: 10px;
            align-items: flex-start;
        }
        body.dark-mode .dialog-highlight-box {
            background: rgba(255, 184, 0, 0.12) !important;
        }

        .highlight-title {
            color: #b45309;
        }
        body.dark-mode .highlight-title {
            color: #f59e0b !important;
        }

        .highlight-desc {
            color: #78350f;
        }
        body.dark-mode .highlight-desc {
            color: #fef3c7 !important;
        }

        .dialog-sub-box {
            background: #f8fafc;
            border: 1.5px solid #f1f5f9;
            border-radius: 12px;
            padding: 12px 14px;
            display: flex;
            gap: 10px;
            align-items: flex-start;
        }
        body.dark-mode .dialog-sub-box {
            background: #232320 !important;
            border-color: #2e2e2a !important;
        }

        .sub-box-text {
            color: #475569;
        }
        body.dark-mode .sub-box-text {
            color: #d1d5db !important;
        }

        #customDialogOkBtn {
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        #customDialogOkBtn:hover {
            opacity: 0.92 !important;
            transform: translateY(-1px) scale(1.01) !important;
            background: #1e293b !important;
            box-shadow: 0 4px 12px rgba(15,23,42,0.15) !important;
        }
        #customDialogOkBtn:active {
            transform: translateY(1px) scale(0.98) !important;
        }
        body.dark-mode #customDialogOkBtn {
            background: var(--primary) !important;
            color: #0f172a !important;
        }
        body.dark-mode #customDialogOkBtn:hover {
            opacity: 0.9 !important;
            background: var(--primary) !important;
            box-shadow: 0 4px 12px rgba(255, 184, 0, 0.35) !important;
        }

        #customDialogCancelBtn {
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        #customDialogCancelBtn:hover {
            background: #f1f5f9 !important;
            color: #0f172a !important;
            border-color: #cbd5e1 !important;
        }
        #customDialogCancelBtn:active {
            transform: translateY(1px) !important;
        }
        body.dark-mode #customDialogCancelBtn {
            background: #232320 !important;
            color: #efece6 !important;
            border-color: #3e3d39 !important;
        }
        body.dark-mode #customDialogCancelBtn:hover {
            background: #2e2e2a !important;
            color: #ffffff !important;
        }
    </style>

    <!-- APP LOGICAL INTEGRATION SCRIPTS -->
    <script>
        // Determine the base path directory for the application dynamically at startup
        // This is crucial for local modes (Hostinger public_html) to support path resolution after routing history.pushState changes the URL path in the address bar.
        (function() {
            if (!window.__studentAppBaseDir) {
                var pathname = window.location.pathname || "/";
                var baseDir = "/";
                
                // If 404.html redirect search param is present (?/...), pathname is the exact base directory
                if (window.location.search && window.location.search.indexOf('?/') === 0) {
                    baseDir = pathname;
                    if (baseDir.endsWith("/index.html")) baseDir = baseDir.slice(0, -10);
                    if (baseDir.endsWith("/student.html")) baseDir = baseDir.slice(0, -12);
                    if (!baseDir.endsWith("/")) baseDir += "/";
                } else if (pathname.endsWith("/index.html")) {
                    baseDir = pathname.substring(0, pathname.length - 10);
                    if (!baseDir.endsWith("/")) baseDir += "/";
                } else if (pathname.endsWith("/student.html")) {
                    baseDir = pathname.substring(0, pathname.length - 12);
                    if (!baseDir.endsWith("/")) baseDir += "/";
                } else {
                    // Standard SPA on root domain - all virtual routes rewrite to root baseDir "/"
                    baseDir = "/";
                }

                window.__studentAppBaseDir = baseDir;
            }

            try {
                var l = window.location;
                var reqPath = null;

                if (l.search && l.search.indexOf('?/') === 0) {
                    reqPath = l.search.slice(1).split('&').map(function(s) { 
                        return s.replace(/~and~/g, '&'); 
                    }).join('?');
                } else if (l.pathname) {
                    var bDir = window.__studentAppBaseDir || '/';
                    if (l.pathname !== bDir && l.pathname !== bDir + 'index.html' && l.pathname !== bDir + 'student.html') {
                        reqPath = l.pathname;
                    }
                }
                if (!reqPath && l.hash && (l.hash.indexOf('#/') === 0 || l.hash.indexOf('#') === 0)) {
                    reqPath = l.hash.slice(1);
                }

                if (reqPath && reqPath !== '/' && reqPath !== '/home') {
                    window.__initialRequestedDeepLinkPath = reqPath;
                }

                // Synchronously set address bar to root base URL (e.g. https://taiyariya.in/) while portal splash loads
                var rootBaseDir = window.__studentAppBaseDir || '/';
                window.history.replaceState(null, null, rootBaseDir + (l.hash || ''));
            } catch(e) {
                console.error("Error normalizing initial startup URL:", e);
            }
        })();

        // --- ASPIRANT STABLE STATE SYNCHRONIZER (LocalStorage + Cookies Mirroring & Backup) ---
        function setAspirantCookie(name, value, days) {
            var expires = "";
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toUTCString();
            }
            document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/; SameSite=Lax";
        }

        function getAspirantCookie(name) {
            var nameEQ = encodeURIComponent(name) + "=";
            var ca = document.cookie.split(';');
            for(var i=0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1,c.length);
                if (c.indexOf(nameEQ) == 0) return decodeURIComponent(c.substring(nameEQ.length,c.length));
            }
            return null;
        }

        function eraseAspirantCookie(name) {
            document.cookie = encodeURIComponent(name) + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax';
        }

        function backupLocalToCookie(key, value) {
            try {
                if (!key) return;
                var cookieName = "_pr_" + key;
                setAspirantCookie(cookieName, value, 1800); // ~5 years
            } catch(e) {
                console.warn("Failed to backup key to cookie", e);
            }
        }

        function restoreAllCookiesToLocalStorage() {
            try {
                var ca = document.cookie.split(';');
                var restoredAny = false;
                for(var i = 0; i < ca.length; i++) {
                    var c = ca[i].trim();
                    if (c.indexOf("_pr_") === 0 || c.indexOf("%5Fpr%5F") === 0) {
                        var eqIdx = c.indexOf('=');
                        if (eqIdx > 0) {
                            var encodedKey = c.substring(0, eqIdx);
                            var encodedVal = c.substring(eqIdx + 1);
                            var key = decodeURIComponent(encodedKey).substring(4); // remove "_pr_"
                            var val = decodeURIComponent(encodedVal);
                            if (key && val) {
                                var existingLocal = localStorage.getItem(key);
                                if (!existingLocal) {
                                    localStorage.setItem(key, val);
                                    restoredAny = true;
                                }
                            }
                        }
                    }
                }
                if (restoredAny) {
                    console.log("Successfully restored missing student data from Cookies to LocalStorage.");
                }
            } catch(e) {
                console.warn("Error restoring cookies to localStorage:", e);
            }
        }

        function backupAllLocalStorageToCookies() {
            try {
                for (var i = 0; i < localStorage.length; i++) {
                    var key = localStorage.key(i);
                    if (key && (
                        key.indexOf("attempts_test_") === 0 ||
                        key.indexOf("pdf_read_") === 0 ||
                        key.indexOf("_cat_attempts_") === 0 ||
                        key === "_secured_active_aspirant" ||
                        key === "_last_aspirant_name" ||
                        key === "prayas_applied_coupons" ||
                        key === "prayas_one_saved_questions_universal_v3" ||
                        key === "_preemptive_theme_mode" ||
                        key === "_student_active_tab_id"
                    )) {
                        var val = localStorage.getItem(key);
                        if (val !== null) {
                            backupLocalToCookie(key, val);
                        }
                    }
                }
            } catch(e) {
                console.warn("Error backing up all localStorage to cookies:", e);
            }
        }

        // Intercept setItem and removeItem to automatically sync changes
        try {
            var originalSetItem = localStorage.setItem;
            localStorage.setItem = function(key, value) {
                try {
                    originalSetItem.apply(this, arguments);
                } catch(e) {
                    console.warn("localStorage setItem failed:", e);
                }
                if (key && (
                    key.indexOf("attempts_test_") === 0 ||
                    key.indexOf("pdf_read_") === 0 ||
                    key.indexOf("_cat_attempts_") === 0 ||
                    key === "_secured_active_aspirant" ||
                    key === "_last_aspirant_name" ||
                    key === "prayas_applied_coupons" ||
                    key === "prayas_one_saved_questions_universal_v3" ||
                    key === "_preemptive_theme_mode" ||
                    key === "_student_active_tab_id"
                )) {
                    backupLocalToCookie(key, value);
                }
            };

            var originalRemoveItem = localStorage.removeItem;
            localStorage.removeItem = function(key) {
                try {
                    originalRemoveItem.apply(this, arguments);
                } catch(e) {
                    console.warn("localStorage removeItem failed:", e);
                }
                if (key) {
                    eraseAspirantCookie("_pr_" + key);
                }
            };
        } catch(err) {
            console.warn("Could not wrap localStorage:", err);
        }

        // Restore cookies first, then synchronize all to ensure both storages are fully populated
        try {
            restoreAllCookiesToLocalStorage();
            backupAllLocalStorageToCookies();
        } catch(e) {
            console.warn("Initial sync error:", e);
        }

        // JSON Backup Export/Import Handlers
        function substituteChars(str, fromAlphabet, toAlphabet) {
            var result = [];
            for (var i = 0; i < str.length; i++) {
                var char = str.charAt(i);
                var index = fromAlphabet.indexOf(char);
                if (index !== -1) {
                    result.push(toAlphabet.charAt(index));
                } else {
                    result.push(char);
                }
            }
            return result.join("");
        }

        function aspirantEncrypt(text) {
            var key = "prayas_secret_key_99";
            var utf8Text = unescape(encodeURIComponent(text));
            var obfuscatedBytes = [];
            for (var i = 0; i < utf8Text.length; i++) {
                var b = utf8Text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
                obfuscatedBytes.push(String.fromCharCode(b));
            }
            var latin1Str = obfuscatedBytes.join("");
            var standardB64 = btoa(latin1Str);
            
            var stdChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            var cstChars = "9876543210zyxwvutsrqponmlkjihgfedcbaZYXWVUTSRQPONMLKJIHGFEDCBA_+-";
            return substituteChars(standardB64, stdChars, cstChars);
        }

        function aspirantDecrypt(obfuscatedStr) {
            var stdChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            var cstChars = "9876543210zyxwvutsrqponmlkjihgfedcbaZYXWVUTSRQPONMLKJIHGFEDCBA_+-";
            var standardB64 = substituteChars(obfuscatedStr, cstChars, stdChars);
            
            var key = "prayas_secret_key_99";
            var latin1Str = atob(standardB64);
            var decryptedBytes = [];
            for (var i = 0; i < latin1Str.length; i++) {
                var b = latin1Str.charCodeAt(i) ^ key.charCodeAt(i % key.length);
                decryptedBytes.push(String.fromCharCode(b));
            }
            var utf8Text = decryptedBytes.join("");
            return decodeURIComponent(escape(utf8Text));
        }

        function handleExportAspirantBackup() {
            try {
                if (!_studentLoggedInUser) {
                    showCustomAlert("Sign In Required", "Please sign in to your Aspirant account first to export your data.");
                    return;
                }
                var expectedPass = (_studentLoggedInUser.password || "").toString().trim();
                
                showCustomPrompt(
                    "Authorization Required", 
                    "Enter your Aspirant account password to authorize Backup Export:", 
                    "Password", 
                    function(enteredPass) {
                        if (enteredPass.trim() !== expectedPass) {
                            showCustomAlert("Authorization Failed", "Incorrect password! Backup export denied.");
                            return;
                        }

                        // Spin Sync badge side indicator
                        var syncIcon = document.getElementById("backupSyncIcon");
                        var syncText = document.getElementById("backupSyncText");
                        if (syncIcon) syncIcon.className = "ph-bold ph-arrows-counter-clockwise ph-spin";
                        if (syncText) syncText.innerText = "Exporting...";

                        var backupData = {};
                        for (var i = 0; i < localStorage.length; i++) {
                            var key = localStorage.key(i);
                            if (key && (
                                key.indexOf("attempts_test_") === 0 ||
                                key.indexOf("pdf_read_") === 0 ||
                                key.indexOf("_cat_attempts_") === 0 ||
                                key === "_secured_active_aspirant" ||
                                key === "_last_aspirant_name" ||
                                key === "prayas_applied_coupons" ||
                                key === "prayas_one_saved_questions_universal_v3" ||
                                key === "_preemptive_theme_mode" ||
                                key === "_student_active_tab_id"
                            )) {
                                backupData[key] = localStorage.getItem(key);
                            }
                        }

                        var rawJsonString = JSON.stringify(backupData);
                        var encryptedPayload = aspirantEncrypt(rawJsonString);
                        var secureWrapper = {
                            p_data: encryptedPayload
                        };

                        var blob = new Blob([JSON.stringify(secureWrapper, null, 2)], { type: "application/json" });
                        var url = URL.createObjectURL(blob);
                        var a = document.createElement("a");
                        var dateStr = new Date().toISOString().split('T')[0];
                        a.href = url;
                        a.download = "prayas_one_student_backup_" + dateStr + ".json";
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                        
                        var statusEl = document.getElementById("backupStatusMessage");
                        if (statusEl) {
                            statusEl.style.display = "block";
                            statusEl.style.color = "#2ecc71";
                            statusEl.style.borderColor = "rgba(46,204,113,0.15)";
                            statusEl.style.background = "rgba(46,204,113,0.06)";
                            statusEl.innerHTML = "<i class='ph-bold ph-check'></i> Backup successful! File saved.";
                            setTimeout(function() {
                                statusEl.style.display = "none";
                            }, 4000);
                        }

                        // Reset Sync badge side indicator
                        setTimeout(function() {
                            if (syncIcon) syncIcon.className = "ph-bold ph-arrows-counter-clockwise";
                            if (syncText) syncText.innerText = "Sync";
                        }, 2000);
                    },
                    function() {
                        // Cancelled
                    }
                );
            } catch(e) {
                var statusEl = document.getElementById("backupStatusMessage");
                if (statusEl) {
                    statusEl.style.display = "block";
                    statusEl.style.color = "#ef4444";
                    statusEl.style.borderColor = "rgba(239,68,68,0.15)";
                    statusEl.style.background = "rgba(239,68,68,0.06)";
                    statusEl.innerHTML = "<i class='ph-bold ph-x'></i> Export failed: " + e.message;
                }
            }
        }

        function handleImportAspirantBackup(event) {
            try {
                if (!_studentLoggedInUser) {
                    showCustomAlert("Sign In Required", "Please sign in to your Aspirant account first to import your data.");
                    event.target.value = "";
                    return;
                }
                var expectedPass = (_studentLoggedInUser.password || "").toString().trim();
                
                showCustomPrompt(
                    "Authorization Required", 
                    "Enter your Aspirant account password to authorize Backup Import:", 
                    "Password", 
                    function(enteredPass) {
                        if (enteredPass.trim() !== expectedPass) {
                            showCustomAlert("Authorization Failed", "Incorrect password! Backup import denied.");
                            event.target.value = "";
                            return;
                        }

                        // Spin Sync badge side indicator
                        var syncIcon = document.getElementById("backupSyncIcon");
                        var syncText = document.getElementById("backupSyncText");
                        if (syncIcon) syncIcon.className = "ph-bold ph-arrows-counter-clockwise ph-spin";
                        if (syncText) syncText.innerText = "Importing...";

                        var file = event.target.files[0];
                        if (!file) {
                            if (syncIcon) syncIcon.className = "ph-bold ph-arrows-counter-clockwise";
                            if (syncText) syncText.innerText = "Sync";
                            event.target.value = "";
                            return;
                        }
                        var reader = new FileReader();
                        reader.onload = function(e) {
                            try {
                                var parsedWrapper = JSON.parse(e.target.result);
                                if (!parsedWrapper || typeof parsedWrapper !== "object" || !parsedWrapper.p_data) {
                                    throw new Error("Invalid or tempered backup file.");
                                }

                                var decryptedJsonStr = aspirantDecrypt(parsedWrapper.p_data);
                                var parsed = JSON.parse(decryptedJsonStr);
                                if (!parsed || typeof parsed !== "object") {
                                    throw new Error("Invalid payload format");
                                }

                                var count = 0;
                                for (var key in parsed) {
                                    if (parsed.hasOwnProperty(key)) {
                                        localStorage.setItem(key, parsed[key]);
                                        backupLocalToCookie(key, parsed[key]);
                                        count++;
                                    }
                                }

                                var statusEl = document.getElementById("backupStatusMessage");
                                if (statusEl) {
                                    statusEl.style.display = "block";
                                    statusEl.style.color = "#2ecc71";
                                    statusEl.style.borderColor = "rgba(46,204,113,0.15)";
                                    statusEl.style.background = "rgba(46,204,113,0.06)";
                                    statusEl.innerHTML = "<i class='ph-bold ph-arrows-counter-clockwise ph-spin'></i> Success! Progress restored. Reloading...";
                                }
                                
                                setTimeout(function() {
                                    window.location.reload();
                                }, 1200);
                            } catch(err) {
                                var statusEl = document.getElementById("backupStatusMessage");
                                if (statusEl) {
                                    statusEl.style.display = "block";
                                    statusEl.style.color = "#ef4444";
                                    statusEl.style.borderColor = "rgba(239,68,68,0.15)";
                                    statusEl.style.background = "rgba(239,68,68,0.06)";
                                    statusEl.innerHTML = "<i class='ph-bold ph-x'></i> Import failed: " + err.message;
                                }
                                if (syncIcon) syncIcon.className = "ph-bold ph-arrows-counter-clockwise";
                                if (syncText) syncText.innerText = "Sync";
                            }
                        };
                        reader.readAsText(file);
                    },
                    function() {
                        event.target.value = "";
                    }
                );
            } catch(e) {
                var statusEl = document.getElementById("backupStatusMessage");
                if (statusEl) {
                    statusEl.style.display = "block";
                    statusEl.style.color = "#ef4444";
                    statusEl.style.borderColor = "rgba(239,68,68,0.15)";
                    statusEl.style.background = "rgba(239,68,68,0.06)";
                    statusEl.innerHTML = "<i class='ph-bold ph-x'></i> Error reading file: " + e.message;
                }
                event.target.value = "";
            }
        }

        // Global error logging for debugging
        window.onerror = function(msg, url, line, col, error) {
            console.error(msg, url, line, col, error);
            alert("Student App Error: " + msg + "\\nLine: " + line + ", Column: " + col);
            return false;
        };

        function showCustomAlert(title, message, onOk) {
            document.getElementById("customDialogTitle").innerText = title;
            document.getElementById("customDialogMessage").innerHTML = message;
            
            var iconContainer = document.getElementById("customDialogIconContainer");
            var cleanTitle = (title || "").toLowerCase();
            if (cleanTitle.includes("coming soon") || cleanTitle.includes("soon")) {
                iconContainer.innerHTML = '<div style="background: rgba(245,158,11,0.1); width: 68px; height: 68px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2.5px solid rgba(245,158,11,0.2); box-shadow: 0 4px 10px rgba(245,158,11,0.08); margin-bottom: 8px;"><i class="ph-fill ph-clock-countdown" style="font-size: 34px; color: #f59e0b;"></i></div>';
            } else if (cleanTitle.includes("success") || cleanTitle.includes("done") || cleanTitle.includes("complete") || cleanTitle.includes("saved")) {
                iconContainer.innerHTML = '<div style="background: rgba(34,197,94,0.1); width: 68px; height: 68px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2.5px solid rgba(34,197,94,0.15); box-shadow: 0 4px 10px rgba(34,197,94,0.08); margin-bottom: 8px;"><i class="ph-fill ph-check-circle" style="font-size: 34px; color: #22c55e;"></i></div>';
            } else if (cleanTitle.includes("error") || cleanTitle.includes("fail") || cleanTitle.includes("wrong")) {
                iconContainer.innerHTML = '<div style="background: rgba(239,68,68,0.1); width: 68px; height: 68px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2.5px solid rgba(239,68,68,0.15); box-shadow: 0 4px 10px rgba(239,68,68,0.08); margin-bottom: 8px;"><i class="ph-fill ph-x-circle" style="font-size: 34px; color: #ef4444;"></i></div>';
            } else if (cleanTitle.includes("pending") || cleanTitle.includes("verification") || cleanTitle.includes("wait")) {
                iconContainer.innerHTML = '<div style="background: rgba(255,184,0,0.1); width: 68px; height: 68px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2.5px solid rgba(255,184,0,0.18); box-shadow: 0 4px 10px rgba(255,184,0,0.08); margin-bottom: 8px;"><i class="ph-fill ph-clock" style="font-size: 34px; color: var(--primary);"></i></div>';
            } else {
                // Warning, Alert, Expired
                iconContainer.innerHTML = '<div style="background: rgba(249,115,22,0.1); width: 68px; height: 68px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2.5px solid rgba(249,115,22,0.15); box-shadow: 0 4px 10px rgba(249,115,22,0.08); margin-bottom: 8px;"><i class="ph-fill ph-warning" style="font-size: 34px; color: #f97316;"></i></div>';
            }

            var cancelBtn = document.getElementById("customDialogCancelBtn");
            cancelBtn.style.display = "none";
            
            var okBtn = document.getElementById("customDialogOkBtn");
            okBtn.style.display = "inline-flex";
            okBtn.innerText = "OK";
            okBtn.onclick = function() {
                document.getElementById("customDialogOverlay").style.display = "none";
                if (typeof onOk === "function") {
                    onOk();
                }
            };
            
            document.getElementById("customDialogOverlay").style.display = "flex";
        }

        function showCustomConfirm(title, message, onConfirm, onCancel) {
            document.getElementById("customDialogTitle").innerText = title;
            document.getElementById("customDialogMessage").innerHTML = message;
            
            document.getElementById("customDialogIconContainer").innerHTML = '<div style="background: rgba(59,130,246,0.1); width: 68px; height: 68px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2.5px solid rgba(59,130,246,0.15); box-shadow: 0 4px 10px rgba(59,130,246,0.08); margin-bottom: 8px;"><i class="ph-fill ph-question" style="font-size: 34px; color: #3b82f6;"></i></div>';
            
            var cancelBtn = document.getElementById("customDialogCancelBtn");
            cancelBtn.style.display = "inline-flex";
            cancelBtn.onclick = function() {
                document.getElementById("customDialogOverlay").style.display = "none";
                if (typeof onCancel === "function") {
                    onCancel();
                }
            };
            
            var okBtn = document.getElementById("customDialogOkBtn");
            okBtn.style.display = "inline-flex";
            okBtn.innerText = "YES, CONFIRM";
            okBtn.onclick = function() {
                document.getElementById("customDialogOverlay").style.display = "none";
                if (typeof onConfirm === "function") {
                    onConfirm();
                }
            };
            
            document.getElementById("customDialogOverlay").style.display = "flex";
        }

        window.showCustomAlert = showCustomAlert;
        window.showCustomConfirm = showCustomConfirm;

        function showCustomPrompt(title, message, placeholder, onConfirm, onCancel) {
            document.getElementById("customPromptTitle").innerText = title;
            document.getElementById("customPromptMessage").innerText = message;
            
            var inputEl = document.getElementById("customPromptInput");
            inputEl.value = "";
            inputEl.placeholder = placeholder || "••••••••";
            inputEl.type = "password";
            
            var eyeIcon = document.getElementById("customPromptEyeIcon");
            if (eyeIcon) {
                eyeIcon.className = "ph ph-eye-slash";
            }
            
            var cancelBtn = document.getElementById("customPromptCancelBtn");
            cancelBtn.onclick = function() {
                document.getElementById("customPromptOverlay").style.display = "none";
                if (typeof onCancel === "function") {
                    onCancel();
                }
            };
            
            var confirmBtn = document.getElementById("customPromptConfirmBtn");
            confirmBtn.onclick = function() {
                var val = inputEl.value;
                document.getElementById("customPromptOverlay").style.display = "none";
                if (typeof onConfirm === "function") {
                    onConfirm(val);
                }
            };

            inputEl.onkeydown = function(e) {
                if (e.key === "Enter") {
                    confirmBtn.click();
                }
            };
            
            document.getElementById("customPromptOverlay").style.display = "flex";
            setTimeout(function() {
                inputEl.focus();
            }, 100);
        }
        
        function toggleCustomPromptPasswordVisibility() {
            var inputEl = document.getElementById("customPromptInput");
            var eyeIcon = document.getElementById("customPromptEyeIcon");
            if (inputEl.type === "password") {
                inputEl.type = "text";
                eyeIcon.className = "ph ph-eye";
            } else {
                inputEl.type = "password";
                eyeIcon.className = "ph ph-eye-slash";
            }
        }
        
        window.showCustomPrompt = showCustomPrompt;
        window.toggleCustomPromptPasswordVisibility = toggleCustomPromptPasswordVisibility;

        function handleBuyNowClick(cat) {
            var catObj = cat;
            if (typeof cat === 'string') {
                var allCats = (DB.testCategories || []).concat(DB.pdfCategories || []);
                catObj = allCats.find(function(c) { return c.id === cat; });
                if (!catObj) {
                    try {
                        catObj = JSON.parse(cat);
                    } catch(e) {
                        console.error("Error parsing category object in Buy Now", e);
                    }
                }
            }
            if (!catObj) return;
            showCategoryPaymentScreen(catObj);
        }
        window.handleBuyNowClick = handleBuyNowClick;

        function showCopyrightPdfModal(bookTitle, pdfUrl, onConfirm) {
            document.getElementById("copyrightPdfBookTitle").innerText = "Book/PDFs: " + bookTitle;
            
            // Format nice dynamic report subject and body for email
            var emailSubject = encodeURIComponent("[Copyright Takedown] Taiyariya Hub - PDF Resource Request");
            var emailBody = encodeURIComponent(
                "Hello Taiyariya Administration,\\n\\n" +
                "I am writing regarding the following PDF study resource listed on the Portal:\\n\\n" +
                "📘 Title: " + bookTitle + "\\n" +
                "🔗 Link: " + pdfUrl + "\\n\\n" +
                "Message: \\n" +
                "⚠️ For educational purposes only.\\n\\n" +
                "All rights belong to the respective owners.\\n\\n" +
                "I kindly request the removal of this link because: "
            );
            
            var emailBtn = document.getElementById("copyrightEmailBtn");
            if (emailBtn) {
                emailBtn.href = "mailto:hi@taiyariya.in?subject=" + emailSubject + "&body=" + emailBody;
            }
            
            var cancelBtn = document.getElementById("copyrightPdfCancelBtn");
            if (cancelBtn) {
                cancelBtn.onclick = function() {
                    document.getElementById("copyrightPdfOverlay").style.display = "none";
                };
            }
            
            var downloadBtn = document.getElementById("copyrightPdfDownloadBtn");
            if (downloadBtn) {
                downloadBtn.onclick = function() {
                    document.getElementById("copyrightPdfOverlay").style.display = "none";
                    if (typeof onConfirm === "function") {
                        onConfirm();
                    }
                };
            }
            
            document.getElementById("copyrightPdfOverlay").style.display = "flex";
        }
        window.showCopyrightPdfModal = showCopyrightPdfModal;
        
        // Override standard window.alert
        window.alert = function(msg) {
            showCustomAlert("System Alert", msg);
        };

        // Decoded Embedded Coach Data
        var DB = {};
        
        // Quality enhancers for fetched URLs in student app
        function enhanceImageUrlQuality(url) {
            if (!url) return url;
            if (url.indexOf("data:") === 0 || url.indexOf("blob:") === 0) {
                return url;
            }
            if (url.indexOf("images.unsplash.com") !== -1) {
                try {
                    // Upgrade Unsplash quality parameters
                    var parts = url.split("?");
                    var baseUrl = parts[0];
                    var params = {};
                    if (parts.length > 1) {
                        var kvs = parts[1].split("&");
                        for (var i = 0; i < kvs.length; i++) {
                            var kv = kvs[i].split("=");
                            if (kv.length === 2) {
                                params[kv[0]] = kv[1];
                            }
                        }
                    }
                    if (params["w"]) {
                        var wVal = parseInt(params["w"], 10);
                        if (wVal < 1200) {
                            params["w"] = wVal <= 200 ? "800" : "1200";
                        }
                    } else {
                        params["w"] = "1200";
                    }
                    params["q"] = "85";
                    params["auto"] = "format";
                    params["fit"] = "crop";
                    
                    var newQueryParams = [];
                    for (var key in params) {
                        newQueryParams.push(key + "=" + params[key]);
                    }
                    return baseUrl + "?" + newQueryParams.join("&");
                } catch(e) {}
            } else if (url.indexOf("iili.io") !== -1) {
                url = url.replace(/\.md\.(png|jpg|jpeg)$/i, ".$1");
            }
            return url;
        }

        function enhanceAllDbImages(obj) {
            if (!obj || typeof obj !== "object") return;
            if (Array.isArray(obj)) {
                for (var i = 0; i < obj.length; i++) {
                    if (obj[i] && typeof obj[i] === "object") {
                        enhanceAllDbImages(obj[i]);
                    }
                }
                return;
            }
            for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    var val = obj[key];
                    if (typeof val === "string") {
                        if (key === "image" || key === "imageUrl" || key === "logoUrl" || key === "ogImage") {
                            obj[key] = enhanceImageUrlQuality(val);
                        }
                    } else if (val && typeof val === "object") {
                        enhanceAllDbImages(val);
                    }
                }
            }
        }

        var _sliderIntervalId = null;
        var _noticeIntervalId = null;

        function decodeObfuscatedPayload(scrambledStr) {
            if (!scrambledStr) return "";
            try {
                var isScrambled = false;
                var len = scrambledStr.length;
                for (var i = 0; i < Math.min(len, 100); i++) {
                    if (scrambledStr.charCodeAt(i) >= 0x0900) {
                        isScrambled = true;
                        break;
                    }
                }
                if (isScrambled) {
                    var out = new Array(len);
                    for (var r = 0; r < len; r++) {
                        var code = scrambledStr.charCodeAt(len - 1 - r);
                        out[r] = String.fromCharCode(code >= 0x0900 ? code - 0x0900 : code);
                    }
                    var b64 = out.join("");
                    return decodeURIComponent(escape(atob(b64)));
                } else {
                    return decodeURIComponent(escape(atob(scrambledStr)));
                }
            } catch (err) {
                try {
                    return decodeURIComponent(escape(atob(scrambledStr)));
                } catch (e2) {
                    return scrambledStr;
                }
            }
        }

        function _getRegistryPath(key) {
            var host = (window.location && window.location.hostname) ? window.location.hostname.toLowerCase() : "";
            var isCloudRun = host.indexOf("run.app") !== -1 || host.indexOf("localhost") !== -1 || host.indexOf("127.0.0.1") !== -1;
            if (window.__studentAppLocalMode || !isCloudRun) {
                var baseDir = window.__studentAppBaseDir || "./";
                return baseDir + (key || '');
            }
            var _map = [107, 119, 119, 115, 118, 61, 50, 50, 115, 120, 101, 48, 103, 102, 54, 57, 51, 56, 54, 57, 104, 55, 105, 101, 55, 57, 101, 100, 100, 54, 104, 54, 104, 59, 58, 52, 60, 103, 51, 52, 58, 60, 54, 104, 49, 117, 53, 49, 103, 104, 121, 50];
            var base = "";
            for (var i = 0; i < _map.length; i++) {
                base += String.fromCharCode(_map[i] - 3);
            }
            return base + (key || '');
        }

        function showToast(message) {
            var existing = document.getElementById("studentActionToastBox");
            if (existing) {
                existing.parentNode.removeChild(existing);
            }
            var toast = document.createElement("div");
            toast.id = "studentActionToastBox";
            toast.style = "position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%); background: #111827; color: white; padding: 10px 20px; border-radius: 12px; font-size: 12px; font-weight: bold; font-family: 'Outfit', 'Anek Devanagari', sans-serif; z-index: 999999; box-shadow: 0 10px 25px rgba(0,0,0,0.2); pointer-events: none; opacity: 1; transition: opacity 0.3s ease;";
            toast.innerText = message;
            document.body.appendChild(toast);
            setTimeout(function() {
                toast.style.opacity = "0";
                setTimeout(function() {
                    if (toast.parentNode) toast.parentNode.removeChild(toast);
                }, 300);
            }, 1800);
        }

        function triggerMathJax() {
            if (window.MathJax && window.MathJax.typesetPromise) {
                setTimeout(function() {
                    window.MathJax.typesetPromise().catch(function(err) {
                        console.warn("MathJax formatting error:", err);
                    });
                }, 50);
            }
        }

        function getSavedQuestionsKey() {
            return "prayas_one_saved_questions_universal_v3";
        }

        function syncSavedQuestionsWithCloud(action, itemsToUpload) {
            if (!_studentLoggedInUser || !_studentLoggedInUser.emailOrMobile) return;
            var email = _studentLoggedInUser.emailOrMobile;

            if (action === "push") {
                fetch(getApiUrl("/api/student/saved-questions"), {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ emailOrMobile: email, savedQuestions: itemsToUpload || [] })
                })
                .then(function(r) { return r.json(); })
                .then(function(data) {
                    if (data.success) {
                        console.log("Saved questions synced to cloud.");
                    }
                })
                .catch(function(e) {
                    console.warn("Offline, couldn't push saved questions:", e);
                });
            } else if (action === "pull") {
                fetch(getApiUrl("/api/student/saved-questions?emailOrMobile=" + encodeURIComponent(email)))
                .then(function(r) { return r.json(); })
                .then(function(data) {
                    if (data.success && Array.isArray(data.savedQuestions)) {
                        var cloudItems = data.savedQuestions;
                        var localItems = [];
                        try {
                            var key = getSavedQuestionsKey();
                            var localSaved = localStorage.getItem(key);
                            localItems = localSaved ? JSON.parse(localSaved) : [];
                        } catch(e) {}

                        // Merge cloud and local items to prevent any data loss
                        var merged = [].concat(cloudItems);
                        localItems.forEach(function(lItem) {
                            var textEn = (lItem.textEn || (lItem.questionBlock && lItem.questionBlock.en && lItem.questionBlock.en.q) || "").trim().toLowerCase();
                            var textHi = (lItem.textHi || (lItem.questionBlock && lItem.questionBlock.hi && lItem.questionBlock.hi.q) || "").trim().toLowerCase();
                            
                            var exists = merged.some(function(cItem) {
                                var existingEn = (cItem.textEn || (cItem.questionBlock && cItem.questionBlock.en && cItem.questionBlock.en.q) || "").trim().toLowerCase();
                                var existingHi = (cItem.textHi || (cItem.questionBlock && cItem.questionBlock.hi && cItem.questionBlock.hi.q) || "").trim().toLowerCase();
                                if (textEn && textEn === existingEn) return true;
                                if (textHi && textHi === existingHi) return true;
                                return false;
                            });
                            if (!exists) {
                                merged.push(lItem);
                            }
                        });

                        // Save merged list locally
                        var key = getSavedQuestionsKey();
                        localStorage.setItem(key, JSON.stringify(merged));
                        
                        // If merged has more items than cloud, push it back
                        if (merged.length > cloudItems.length) {
                            syncSavedQuestionsWithCloud("push", merged);
                        }

                        renderSavedQuestionsBox();
                    }
                })
                .catch(function(e) {
                    console.warn("Offline, couldn't pull saved questions:", e);
                });
            }
        }

        function saveSavedQuestions(items) {
            try {
                var key = getSavedQuestionsKey();
                localStorage.setItem(key, JSON.stringify(items));
                if (_studentLoggedInUser && _studentLoggedInUser.emailOrMobile) {
                    syncSavedQuestionsWithCloud("push", items);
                }
            } catch(e) {
                console.error("Failed saving saved questions", e);
            }
        }

        function getSavedQuestions() {
            try {
                var universalKey = "prayas_one_saved_questions_universal_v3";
                var saved = localStorage.getItem(universalKey);
                var items = saved ? JSON.parse(saved) : [];
                
                // One-time self-healing merge/migration of older legacy keys if they exist
                var legacyKeys = ["prayas_one_saved_questions"];
                if (_studentLoggedInUser && _studentLoggedInUser.emailOrMobile) {
                    var userSuffix = "_" + encodeURIComponent(_studentLoggedInUser.emailOrMobile).replace(/[^a-zA-Z0-9]/g, "");
                    legacyKeys.push("prayas_one_saved_questions" + userSuffix);
                }
                
                var merged = false;
                legacyKeys.forEach(function(lKey) {
                    var r = localStorage.getItem(lKey);
                    if (r) {
                        try {
                            var parsed = JSON.parse(r);
                            if (Array.isArray(parsed) && parsed.length > 0) {
                                parsed.forEach(function(oldItem) {
                                    // Make sure text comparison is robust and case/whitespace-insensitive
                                    var textEn = (oldItem.textEn || (oldItem.questionBlock && oldItem.questionBlock.en && oldItem.questionBlock.en.q) || "").trim().toLowerCase();
                                    var textHi = (oldItem.textHi || (oldItem.questionBlock && oldItem.questionBlock.hi && oldItem.questionBlock.hi.q) || "").trim().toLowerCase();
                                    
                                    var exists = items.some(function(item) {
                                        var existingEn = (item.textEn || (item.questionBlock && item.questionBlock.en && item.questionBlock.en.q) || "").trim().toLowerCase();
                                        var existingHi = (item.textHi || (item.questionBlock && item.questionBlock.hi && item.questionBlock.hi.q) || "").trim().toLowerCase();
                                        if (textEn && textEn === existingEn) return true;
                                        if (textHi && textHi === existingHi) return true;
                                        return false;
                                    });
                                    if (!exists) {
                                        items.push(oldItem);
                                        merged = true;
                                    }
                                });
                            }
                        } catch(err){}
                    }
                });
                
                if (merged || !saved) {
                    localStorage.setItem(universalKey, JSON.stringify(items));
                }
                return items;
            } catch(e) {
                return [];
            }
        }

        
        
        function formatMarkdownBold(text) {
            if (!text) return "";
            try {
                return String(text).replace(/\\*\\*(.*?)\\*\\*/g, "<strong>$1</strong>");
            } catch(e) {
                return String(text);
            }
        }

        function sanitizeQuestionText(qStr) {
            if (!qStr) return "";
            var s = String(qStr);
            try {
                var nl = String.fromCharCode(10);
                var examRegex = new RegExp("\\[[\\s\\S]*?(?:CHSL|CGL|SSC|MTS|GD|CPO|RRB|NTPC|CDS|NDA|IBPS|SBI|UPSC|Tier|Shift|Nov|Dec|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|\\b20\\d\\d\\b|Paper|Exam|Set|Shift|Tier|स्रोत|परीक्षा|वर्ष|Constable|Police|Steno|Phase|DP\\s*HCM|Ref|Held\\s*on)[\\s\\S]*?\\]", "gi");
                s = s.replace(examRegex, "");
                var trailRegex = new RegExp("\\s*\\[[\\s\\S]*?\\]\\s*$", "g");
                s = s.replace(trailRegex, "");
                var leadRegex = new RegExp("^\\s*\\[[\\s\\S]*?\\]\\s*", "g");
                s = s.replace(leadRegex, "");
                var lineRegex = new RegExp("(?:^|\\r?\\n)\\s*\\[[\\s\\S]*?\\]\\s*(?:\\r?\\n|$)", "g");
                s = s.replace(lineRegex, nl);
                var spaceLineRegex = new RegExp("[ \\t]+\\r?\\n", "g");
                s = s.replace(spaceLineRegex, nl);
                var multiLineRegex = new RegExp("(?:\\r?\\n){3,}", "g");
                s = s.replace(multiLineRegex, nl + nl);
                return s.trim();
            } catch(e) {
                return String(qStr).trim();
            }
        }

        function extractBracketSource(qStr) {
            if (!qStr) return "";
            var s = String(qStr);
            try {
                var examRegex = new RegExp("\\[([\\s\\S]*?(?:CHSL|CGL|SSC|MTS|GD|CPO|RRB|NTPC|CDS|NDA|IBPS|SBI|UPSC|Tier|Shift|Nov|Dec|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|\\b20\\d\\d\\b|Paper|Exam|Set|Shift|Tier|स्रोत|परीक्षा|वर्ष|Constable|Police|Steno|Phase|DP\\s*HCM|Ref|Held\\s*on)[\\s\\S]*?)\\]", "i");
                var m = s.match(examRegex);
                if (m && m[1]) {
                    return m[1].replace(/\s+/g, " ").trim();
                }
                var trailRegex = new RegExp("\\s*\\[([\\s\\S]*?)\\]\\s*$");
                var mTrailing = s.match(trailRegex);
                if (mTrailing && mTrailing[1] && mTrailing[1].trim().length > 2) {
                    return mTrailing[1].replace(/\s+/g, " ").trim();
                }
            } catch(e) {}
            return "";
        }

        function getQuestionText(qBlock) {
            if (!qBlock) return { textHi: "", textEn: "" };
            var textHi = "";
            var textEn = "";
            if (qBlock.hi && qBlock.hi.q) {
                textHi = qBlock.hi.q;
            }
            if (qBlock.en && qBlock.en.q) {
                textEn = qBlock.en.q;
            }
            if (!textHi && !textEn && qBlock.q) {
                textEn = qBlock.q;
            }
            return { textHi: textHi, textEn: textEn };
        }

        function isQuestionSaved(index) {
            var qBlock = _activeQuestions[index];
            if (!qBlock) return false;
            var saved = getSavedQuestions();
            var texts = getQuestionText(qBlock);
            return saved.some(function(item) {
                if (texts.textHi && item.textHi === texts.textHi) return true;
                if (texts.textEn && item.textEn === texts.textEn) return true;
                return false;
            });
        }

        function handleToggleSaveActiveQuestion(index) {
            var qBlock = _activeQuestions[index];
            if (!qBlock) return;
            var texts = getQuestionText(qBlock);
            var textHi = texts.textHi;
            var textEn = texts.textEn;
            var saved = getSavedQuestions();
            var isAlreadySaved = isQuestionSaved(index);
            var updated = [];
            if (isAlreadySaved) {
                updated = saved.filter(function(item) {
                    if (textHi && item.textHi === textHi) return false;
                    if (textEn && item.textEn === textEn) return false;
                    return true;
                });
                showToast("Question removed from saved bookmarks.");
            } else {
                var newItem = {
                    categoryName: _activeCategoryName || "General Exam Centre",
                    subCategoryName: _activeSubCategoryName || "General Practice Desk",
                    topicName: _activeTopicName || "General Practice",
                    textHi: textHi,
                    textEn: textEn,
                    questionBlock: qBlock
                };
                updated = saved.concat(newItem);
                showToast("Question saved to bookmarks!");
            }
            try {
                saveSavedQuestions(updated);
                renderSavedQuestionsBox();
            } catch(e) {
                console.error("Failed saving", e);
            }
        }

        function handleToggleSaveFromEngine(index) {
            handleToggleSaveActiveQuestion(index);
            renderEngineQuestionItem();
        }

        function handleToggleSaveFromAnalysis(index) {
            handleToggleSaveActiveQuestion(index);
            handleOpenDetailedAnalysisItem(index);
        }

        function handleRemoveSavedGroup(catEncoded, subEncoded, topEncoded) {
            var cat = decodeURIComponent(catEncoded);
            var sub = decodeURIComponent(subEncoded);
            var top = decodeURIComponent(topEncoded);
            
            showCustomConfirm('Delete Bookmarks', 'Are you sure you want to remove all bookmarked questions from "' + top + '" under "' + sub + '"?', function() {
                var saved = getSavedQuestions();
                var updated = saved.filter(function(item) {
                    var matchCat = (item.categoryName || "General Category") === cat;
                    var matchSub = (item.subCategoryName || "General Subcategory") === sub;
                    var matchTop = (item.topicName || "General Topic") === top;
                    return !(matchCat && matchSub && matchTop);
                });
                saveSavedQuestions(updated);
                renderSavedQuestionsBox();
                showToast("Bookmarks deleted successfully.");
            });
        }
        window.handleRemoveSavedGroup = handleRemoveSavedGroup;

        window.handleRemoveSavedTopicGroup = function(topicKeyEncoded) {
            var topicKey = decodeURIComponent(topicKeyEncoded);
            showCustomConfirm('Delete Bookmarks', 'Are you sure you want to remove all bookmarked questions from "' + topicKey + '"?', function() {
                var saved = getSavedQuestions();
                var updated = saved.filter(function(item) {
                    return item.topicName !== topicKey;
                });
                saveSavedQuestions(updated);
                renderSavedQuestionsBox();
                showToast("Topic bookmarks deleted.");
            });
        };

        window.handleRemoveSavedSubcategoryGroup = function(subKeyEncoded) {
            var subKey = decodeURIComponent(subKeyEncoded);
            showCustomConfirm('Delete Bookmarks', 'Are you sure you want to remove all bookmarked questions from "' + subKey + '"?', function() {
                var saved = getSavedQuestions();
                var updated = saved.filter(function(item) {
                    return item.subCategoryName !== subKey;
                });
                saveSavedQuestions(updated);
                renderSavedQuestionsBox();
                showToast("Subcategory bookmarks deleted.");
            });
        };

        function renderSavedQuestionsBox() {
            var container = document.getElementById("savedQuestionsSection");
            if (!container) return;
            var savedQs = getSavedQuestions();
            if (savedQs.length === 0) {
                container.innerHTML = 
                    '<div style="margin-top: 30px; margin-bottom: 25px;">' +
                    '    <div class="section-header-title">' +
                    '        <i class="ph-fill ph-bookmark-simple" style="color: var(--primary);"></i> Saved Questions' +
                    '    </div>' +
                    '    <div style="background: var(--light-grey); border: 1.5px dashed var(--border-color); border-radius: 16px; padding: 24px; text-align: center; color: var(--grey-text); font-size: 13px; font-weight: 600;">' +
                    '        No saved questions yet. Tap the bookmark icon on any question to save here!' +
                    '    </div>' +
                    '</div>';
                return;
            }

            var groups = {};
            savedQs.forEach(function(item) {
                var cat = item.categoryName || "General Category";
                var sub = item.subCategoryName || "General Subcategory";
                var top = item.topicName || "General Topic";
                var key = cat + "|||" + sub + "|||" + top;
                if (!groups[key]) {
                    groups[key] = [];
                }
                groups[key].push(item);
            });

            var html = 
                '<div style="margin-top: 30px; margin-bottom: 25px;">' +
                '    <div class="section-header-title" style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">' +
                '        <div style="display: flex; align-items: center; gap: 8px;">' +
                '            <i class="ph-fill ph-bookmark-simple" style="color: var(--primary);"></i> Saved Questions' +
                '        </div>' +
                '        <span style="font-size: 11px; font-weight: 850; color: var(--primary); background: rgba(255,107,53,0.1); padding: 4px 8px; border-radius: 8px; font-family: inherit;">TOTAL: ' + savedQs.length + '</span>' +
                '    </div>' +
                '    ' +
                '    <!-- Scrollable container for curved cards -->' +
                '    <div style="display: flex; gap: 16px; overflow-x: auto; padding: 4px 4px 16px 4px; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; scrollbar-width: thin; scrollbar-color: var(--primary) transparent;">';

            Object.keys(groups).forEach(function(key) {
                var list = groups[key];
                var parts = key.split("|||");
                var cat = parts[0];
                var sub = parts[1];
                var top = parts[2];

                var catClean = cat.replace("Direct Category Level", "Category Level");
                var subClean = sub.replace("Direct Subcategory Level", "Subcategory Level");
                var topClean = top.replace("Direct Subcategory Level", "General Topic");

                html += 
                    '        <div class="bookmark-group-card" style="background: white; border: 1.5px solid var(--border-color); border-radius: 18px; padding: 18px; width: 290px; min-width: 290px; display: flex; flex-direction: column; justify-content: space-between; gap: 14px; scroll-snap-align: start; box-shadow: 0 4px 12px rgba(0,0,0,0.02); transition: all 0.2s ease;">' +
                    '            <div>' +
                    '                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; gap: 8px;">' +
                    '                    <span style="background: rgba(255, 107, 53, 0.08); color: var(--primary); font-size: 9.5px; font-weight: 800; padding: 3px 6px; border-radius: 6px; text-transform: uppercase; letter-spacing: 0.5px; border: 1px solid rgba(255,107,53,0.12); white-space: nowrap;">' +
                    '                        ' + catClean + '' +
                    '                    </span>' +
                    '                    <span style="font-size: 11px; font-weight: 800; color: var(--grey-text); display: flex; align-items: center; gap: 4px; background: var(--light-grey); padding: 3.5px 7px; border-radius: 6px; border: 1px solid var(--border-color); white-space: nowrap; flex-shrink: 0;">' +
                    '                        <i class="ph ph-file-text" style="color: var(--primary);"></i> ' + list.length + ' Qs' +
                    '                    </span>' +
                    '                </div>' +
                    '                ' +
                    '                <div style="font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.3px; color: var(--grey-text); font-weight: 700; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%;">' +
                    '                    <i class="ph ph-folder-open"></i> ' + subClean + '' +
                    '                </div>' +
                    '                ' +
                    '                <h4 style="margin: 6px 0 0; font-size: 14.5px; font-weight: 800; color: var(--dark); line-height: 1.35; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; min-height: 38px;">' +
                    '                    ' + topClean + '' +
                    '                </h4>' +
                    '            </div>' +
                    '            ' +
                    '            <div style="display: flex; align-items: center; gap: 8px; width: 100%; margin-top: 4px;">' +
                    '                <button onclick="handleRemoveSavedGroup(\\\'' + encodeURIComponent(cat) + '\\\', \\\'' + encodeURIComponent(sub) + '\\\', \\\'' + encodeURIComponent(top) + '\\\')" ' +
                    '                        style="background: transparent; border: 1.5px solid #fee2e2; color: #ef4444; width: 40px; height: 40px; border-radius: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; flex-shrink: 0;"' +
                    '                        title="Remove All Bookmarks"' +
                    '                        onmouseover="this.style.background=\\\'#fef2f2\\\'; this.style.borderColor=\\\'#fca5a5\\\'"' +
                    '                        onmouseout="this.style.background=\\\'transparent\\\'; this.style.borderColor=\\\'#fee2e2\\\'">' +
                    '                    <i class="ph-bold ph-trash" style="font-size: 16px;"></i>' +
                    '                </button>' +
                    '                ' +
                    '                <button onclick="handleLaunchGroupSavedTest(\\\'' + encodeURIComponent(cat) + '\\\', \\\'' + encodeURIComponent(sub) + '\\\', \\\'' + encodeURIComponent(top) + '\\\')" ' +
                    '                        class="btn-fill-prime" ' +
                    '                        style="margin: 0; flex-grow: 1; height: 40px; border-radius: 10px; font-weight: 800; font-size: 12px; letter-spacing: 0.3px; text-transform: uppercase; display: flex; align-items: center; justify-content: center; gap: 6px; background: var(--primary); border: none; color: white; cursor: pointer; transition: opacity 0.2s;"' +
                    '                        onmouseover="this.style.opacity=\\\'0.9\\\'"' +
                    '                        onmouseout="this.style.opacity=\\\'1\\\'">' +
                    '                    <i class="ph-bold ph-play" style="font-size: 12px;"></i> START TEST' +
                    '                </button>' +
                    '            </div>' +
                    '        </div>';
            });

            html += 
                '    </div>' +
                '</div>';
            container.innerHTML = html;
        }

        window.handleRemoveSavedGroup = handleRemoveSavedGroup;
        window.handleLaunchGroupSavedTest = handleLaunchGroupSavedTest;

        function handleLaunchGroupSavedTest(catEncoded, subEncoded, topEncoded) {
            if (!isCurrentStudentPaid()) {
                showCustomAlert("Premium Benefit", "This Bookmarks practice feature is exclusive to Premium membership holders. Unlock and get total benefits today!", function() {
                    showGeneralPremiumPaymentScreen();
                });
                return;
            }

            var cat = decodeURIComponent(catEncoded);
            var sub = decodeURIComponent(subEncoded);
            var top = decodeURIComponent(topEncoded);

            var savedQs = getSavedQuestions();
            var filtered = savedQs.filter(function(item) {
                var matchCat = (item.categoryName || "General Category") === cat;
                var matchSub = (item.subCategoryName || "General Subcategory") === sub;
                var matchTop = (item.topicName || "General Topic") === top;
                return matchCat && matchSub && matchTop;
            });

            if (filtered.length === 0) {
                alert("No saved questions found in this folder.");
                return;
            }

            var nameLabel = top.replace("Direct Subcategory Level", "General").replace("Direct Category Level", "Category Level");
            _activeTest = {
                id: "custom_saved_group_" + Math.random().toString(36).substr(2, 9),
                title: "Bookmarks Test: " + nameLabel,
                duration: (filtered.length * 18) / 60,
                posMarks: 2,
                negMarks: 0.5,
                instructions: "Review practice assessment centering only your bookmarked items from: " + nameLabel + ".",
                unlimitedAttempts: true,
                isPaid: false
            };
            _activeQuestions = filtered.map(function(item) {
                var block = item.questionBlock ? JSON.parse(JSON.stringify(item.questionBlock)) : null;
                if (!block) {
                    block = {
                        en: { q: item.textEn || "Practice item text", o: ["Option A", "Option B", "Option C", "Option D"], c: 1, s: "Answer details" },
                        hi: { q: item.textHi || "अभ्यास प्रश्न पाठ", o: ["विकल्प ए", "विकल्प बी", "विकल्प सी", "विकल्प डी"], c: 1, s: "उत्तर विवरण" }
                    };
                }
                if (!block.originalCorrect) {
                    block.originalCorrect = block.en ? block.en.c : (block.hi ? block.hi.c : 1);
                }
                return block;
            });
            _availableLanguages = [];
            if (_activeQuestions.some(function(q) { return q.en; })) _availableLanguages.push('en');
            if (_activeQuestions.some(function(q) { return q.hi; })) _availableLanguages.push('hi');
            if (_availableLanguages.length === 0) _availableLanguages.push('en');
            _currentLanguage = _availableLanguages[0];
            updateEngineLanguageUI();
            _activeQIndex = 0;
            _answersMap = {};
            _markedReviewMap = {};
            _revealedAnswersMap = {};
            document.getElementById("testEngineName").innerText = _activeTest.title;
            _timeRemainingSecs = _activeQuestions.length * 18;
            updateTestEngineTimerClockDisplay();
            if (_timeIntervalId) clearInterval(_timeIntervalId);
            _timeIntervalId = setInterval(function() {
                _timeRemainingSecs--;
                if (_timeRemainingSecs <= 0) {
                    clearInterval(_timeIntervalId);
                    handleForceAutoSubmitTest();
                } else {
                    updateTestEngineTimerClockDisplay();
                }
            }, 1000);
            document.getElementById("test-engine-panel").style.display = "flex";
            try { clearAllGoogleAds(); } catch(e) {}
            document.getElementById("mainHeader").style.display = "none";
            renderEngineQuestionItem();
        }
        window.handleLaunchGroupSavedTest = handleLaunchGroupSavedTest;

        window.handleLaunchCustomSavedQuestionsTest = function(groupType, groupKeyEncoded) {
            var groupKey = decodeURIComponent(groupKeyEncoded);
            if (groupType === 'topic') {
                handleLaunchGroupSavedTest(encodeURIComponent(""), encodeURIComponent(""), encodeURIComponent(groupKey));
            } else if (groupType === 'subcategory') {
                handleLaunchGroupSavedTest(encodeURIComponent(""), encodeURIComponent(groupKey), encodeURIComponent(""));
            }
        };

        function isCurrentStudentPaid() {
            if (!_studentLoggedInUser) return false;
            var unlocked = _studentLoggedInUser.unlockedCategoryIds || [];
            if (unlocked.length === 0) return false;
            
            var allCats = (DB.testCategories || []).concat(DB.pdfCategories || []);
            var hasActive = false;
            for (var i = 0; i < unlocked.length; i++) {
                var catId = unlocked[i];
                var cat = allCats.find(function(c) { return c.id === catId; });
                if (cat && isCategoryUnlocked(cat)) {
                    hasActive = true;
                    break;
                }
            }
            return hasActive;
        }

        function handleDownloadMerchantPaymentQRCode() {
            var customLink = "${social.qrDownloadLink || ''}";
            if (customLink && customLink.trim() !== "") {
                var dl = document.createElement("a");
                dl.href = customLink;
                dl.target = "_blank";
                document.body.appendChild(dl);
                dl.click();
                document.body.removeChild(dl);
                showToast("Redirecting...");
                return;
            }
            var qrImg = document.getElementById("displayPayQrImage");
            if (!qrImg || !qrImg.src) {
                alert("QR Image not loaded.");
                return;
            }
            var dl = document.createElement("a");
            dl.href = qrImg.src;
            dl.download = "Taiyariya_Payment_Merchant_QR.png";
            dl.target = "_blank";
            document.body.appendChild(dl);
            dl.click();
            document.body.removeChild(dl);
            showToast("QR layout downloaded!");
        }

        function getFontForText(textContent, defaultFontName) {
            const textStr = (textContent || '').toString();
            if (/[\u0900-\u097F]/.test(textStr)) {
                return "'Anek Devanagari', 'Anek Devnagari', sans-serif";
            }
            if (/[a-zA-Z]/.test(textStr)) {
                return "Outfit, sans-serif";
            }
            if (defaultFontName && (defaultFontName.indexOf('Anek') !== -1 || defaultFontName.indexOf('Devanagari') !== -1)) {
                return "'Anek Devanagari', 'Anek Devnagari', sans-serif";
            }
            return "Outfit, sans-serif";
        }
        
        // Define builder API server origin fallback for cross-origin local files
        const _serverOrigin = "${serverOrigin}";
        function getApiUrl(route) {
            if (!_serverOrigin) return route;
            if (window.location.protocol === 'file:' || !window.location.host) {
                return _serverOrigin + route;
            }
            if (window.location.origin !== _serverOrigin) {
                return _serverOrigin + route;
            }
            return route;
        }

        function checkActiveWebsitePopups() {
             try {
                 const popups = DB.popups || [];
                 if (popups.length === 0) return;
                 
                 const now = Date.now();
                 const studentIsPaid = isCurrentStudentPaid();
                 const activePopups = popups.filter(p => {
                     if (!p.isActive) return false;
                     
                     // Filter based on student audience targeting
                     const targeting = p.showTo || "all";
                     if (targeting === "paid" && !studentIsPaid) return false;
                     if (targeting === "free" && studentIsPaid) return false;
                     
                     const parseLocalTimeStr = (tStr) => {
                         if (!tStr) return 0;
                         if (tStr.includes('Z') || tStr.includes('+') || (tStr.lastIndexOf('-') > 10)) {
                             return Date.parse(tStr);
                         }
                         const pts = tStr.split(/[\sT:-]/);
                         if (pts.length >= 5) {
                             const yr = parseInt(pts[0], 10);
                             const mo = parseInt(pts[1], 10) - 1;
                             const dy = parseInt(pts[2], 10);
                             const hr = parseInt(pts[3], 10);
                             const mn = parseInt(pts[4], 10);
                             return new Date(yr, mo, dy, hr, mn, 0).getTime();
                         }
                         return Date.parse(tStr);
                     };

                     if (p.startTime) {
                         try {
                             let startEpoch = parseLocalTimeStr(p.startTime);
                             if (!isNaN(startEpoch) && now < startEpoch) return false;
                         } catch(e) {}
                     }
                     if (p.endTime) {
                         try {
                             let endEpoch = parseLocalTimeStr(p.endTime);
                             if (!isNaN(endEpoch) && now > endEpoch) return false;
                         } catch(e) {}
                     }
                     return true;
                 });
                 
                 if (activePopups.length === 0) return;
                 
                 // Sort by sequence (order) ascending
                 activePopups.sort((a, b) => {
                     const orderA = parseInt(a.order) || 0;
                     const orderB = parseInt(b.order) || 0;
                     return orderA - orderB;
                 });
                 
                 // Find first non-dismissed popup
                 const target = activePopups.find(p => {
                     const dismissKey = "_dismissed_popup_" + p.id + "_" + (p.title || "").replace(/\s/g, "") + "_" + (p.text || "").replace(/\s/g, "");
                     return localStorage.getItem(dismissKey) !== "true";
                 });
                 
                 if (target) {
                     const titleEl = document.getElementById("p_modal_title");
                     const textEl = document.getElementById("p_modal_text");
                     const imgEl = document.getElementById("p_modal_image");
                     const linkEl = document.getElementById("p_modal_link");
                     const outerModal = document.getElementById("websitePopupOverlayModal");
                     
                     if (outerModal) {
                         if (titleEl) titleEl.innerText = target.title || "Announcement";
                         if (textEl) textEl.innerText = target.text || "";
                         if (imgEl) {
                             if (target.imageUrl) {
                                 var cleanPopUrl = enhanceImageUrlQuality(target.imageUrl);
                                 imgEl.loading = "eager";
                                 imgEl.decoding = "async";
                                 imgEl.src = cleanPopUrl;
                                 imgEl.style.display = "block";
                                 if (imgEl.parentNode) imgEl.parentNode.style.display = "flex";
                             } else {
                                 imgEl.style.display = "none";
                                 if (imgEl.parentNode) imgEl.parentNode.style.display = "none";
                             }
                         }
                         if (linkEl) {
                             if (target.redirectUrl) {
                                 linkEl.href = target.redirectUrl;
                                 linkEl.innerHTML = (target.buttonName || "Explore Details") + ' <i class="ph ph-arrow-right"></i>';
                                 linkEl.style.display = "block";
                             } else {
                                 linkEl.style.display = "none";
                             }
                         }
                         outerModal.setAttribute("data-active-popup-id", target.id);
                         outerModal.style.display = "flex";
                     }
                 }
             } catch(err) {
                 console.error("Popup check error:", err);
             }
         }
 
        function handleCloseWebsiteActivePopup() {
            try {
                const outerModal = document.getElementById("websitePopupOverlayModal");
                if (outerModal) {
                    const popupId = outerModal.getAttribute("data-active-popup-id");
                    if (popupId) {
                        const popups = DB.popups || [];
                        const target = popups.find(p => p.id === popupId);
                        if (target) {
                            const dismissKey = "_dismissed_popup_" + target.id + "_" + (target.title || "").replace(/\s/g, "") + "_" + (target.text || "").replace(/\s/g, "");
                            localStorage.setItem(dismissKey, "true");
                        }
                        localStorage.setItem("_dismissed_popup_" + popupId, "true");
                    }
                    outerModal.style.display = "none";
                }
            } catch(e) {
                console.error(e);
            }
        }
        
        // Navigation Stack Architecture
        let _navHistory = ['home'];
        
        // Active test parameters
        let _activeTest = null;
        let _activeQuestions = [];
        let _currentLanguage = 'en'; // 'en' or 'hi'
        let _availableLanguages = ['en'];
        let _activeQIndex = 0;
        let _answersMap = {}; // index: option_1_indexed
        let _markedReviewMap = {}; // index: boolean
        let _showEngineAnswer = false;
        let _revealedAnswersMap = {};
        let _revealedSlideIndicesList = [];
        let _currentRevealedSlideIdx = 0;
        let _timeIntervalId = null;
        let _timeRemainingSecs = 0;

        // Test protection & pause states
        let _testStateActiveNow = false;
        let _testIsPaused = false;
        let _serverTimeOffset = 0;
        let _studentLoggedInUser = null;
        let _demoCategories = {};

        function isDemoFreeTest(testId, rootCat) {
            if (!rootCat || !testId) return false;
            var firstTestId = null;
            function findFirst(n) {
                if (!n || firstTestId) return;
                if (n.test && n.test.id) {
                    firstTestId = n.test.id;
                    return;
                }
                if (n.subCategories && Array.isArray(n.subCategories)) {
                    for (var i = 0; i < n.subCategories.length; i++) {
                        findFirst(n.subCategories[i]);
                        if (firstTestId) return;
                    }
                }
                if (n.topics && Array.isArray(n.topics)) {
                    for (var j = 0; j < n.topics.length; j++) {
                        findFirst(n.topics[j]);
                        if (firstTestId) return;
                    }
                }
            }
            findFirst(rootCat);
            return firstTestId === testId;
        }

        function subHasDemoFreeTest(sub, rootCat) {
            if (!rootCat || !sub) return false;
            var hasFree = false;
            function checkNode(n) {
                if (!n || hasFree) return;
                if (n.test && isDemoFreeTest(n.test.id, rootCat)) {
                    hasFree = true;
                    return;
                }
                if (n.subCategories && Array.isArray(n.subCategories)) {
                    for (var i = 0; i < n.subCategories.length; i++) {
                        checkNode(n.subCategories[i]);
                        if (hasFree) return;
                    }
                }
                if (n.topics && Array.isArray(n.topics)) {
                    for (var j = 0; j < n.topics.length; j++) {
                        checkNode(n.topics[j]);
                        if (hasFree) return;
                    }
                }
            }
            checkNode(sub);
            return hasFree;
        }

        function isDemoFreePdf(pdfId, rootCat) {
            if (!rootCat || !pdfId) return false;
            var firstPdfId = null;
            function findFirst(n) {
                if (!n || firstPdfId) return;
                if (n.pdf && n.pdf.id) {
                    firstPdfId = n.pdf.id;
                    return;
                }
                if (n.subCategories && Array.isArray(n.subCategories)) {
                    for (var i = 0; i < n.subCategories.length; i++) {
                        findFirst(n.subCategories[i]);
                        if (firstPdfId) return;
                    }
                }
                if (n.topics && Array.isArray(n.topics)) {
                    for (var j = 0; j < n.topics.length; j++) {
                        findFirst(n.topics[j]);
                        if (firstPdfId) return;
                    }
                }
            }
            findFirst(rootCat);
            return firstPdfId === pdfId;
        }

        function subHasDemoFreePdf(sub, rootCat) {
            if (!rootCat || !sub) return false;
            var hasFree = false;
            function checkNode(n) {
                if (!n || hasFree) return;
                if (n.pdf && isDemoFreePdf(n.pdf.id, rootCat)) {
                    hasFree = true;
                    return;
                }
                if (n.subCategories && Array.isArray(n.subCategories)) {
                    for (var i = 0; i < n.subCategories.length; i++) {
                        checkNode(n.subCategories[i]);
                        if (hasFree) return;
                    }
                }
                if (n.topics && Array.isArray(n.topics)) {
                    for (var j = 0; j < n.topics.length; j++) {
                        checkNode(n.topics[j]);
                        if (hasFree) return;
                    }
                }
            }
            checkNode(sub);
            return hasFree;
        }

        function handleViewDemoClick(cat, type) {
            var catObj = cat;
            if (typeof cat === 'string') {
                var allCats = (DB.testCategories || []).concat(DB.pdfCategories || []);
                catObj = allCats.find(function(c) { return c.id === cat; });
                if (!catObj) {
                    try {
                        catObj = JSON.parse(cat);
                    } catch(e) {
                        console.error("Error parsing category object in View Demo", e);
                    }
                }
            }
            if (!catObj) return;
            _demoCategories[catObj.id] = true;
            handleSelectCategoryNode(catObj, type);
        }
        window.handleViewDemoClick = handleViewDemoClick;
        let _isAutoSubmitting = false;
        let _hasActiveCouponGrant = null; // Stored voucher config
        let _activeCategoryName = "N/A";
        let _activeSubCategoryName = "N/A";
        let _activeTopicName = "N/A";
        const _hideSourceOnStudent = ${!!social.hideSourceOnStudent};

        // Custom URL Path Routing & Deep Linking Subsystem
        let _activeCategoryNodeForUrl = null;
        let _activeSubcategoryNodeForUrl = null;
        let _activeTopicNodeForUrl = null;
        let _activeTopicStack = [];
        let _activeTopicType = 'test';
        let _isHandlingPopState = false;
        let _initialRequestedDeepLinkPath = window.__initialRequestedDeepLinkPath || null;

        function toSlug(str) {
            if (!str) return "";
            return str.toString().toLowerCase().trim()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');
        }

        function toUrlPathSegment(str) {
            if (!str) return "";
            // Maintain uppercase characters, lowercase characters, and convert spaces to hyphens. Strip other URL unsafe structures.
            return str.toString().trim()
                .replace(/[^a-zA-Z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');
        }

        function updateHistoryAndUrl(categoryNode, subcategoryNode, topicNode, tabIdOrType) {
            if (_isHandlingPopState) return;
            try {
                if (window.location.protocol === 'file:') return;
                var base = window.__studentAppBaseDir || '/';
                var path = base;
                var prefix = base.endsWith('/') ? base.slice(0, -1) : base;

                if (categoryNode) {
                    path = prefix + '/' + toUrlPathSegment(categoryNode.name);
                    if (subcategoryNode) {
                        path += '/' + toUrlPathSegment(subcategoryNode.name);
                        if (topicNode) {
                            path += '/' + toUrlPathSegment(topicNode.name);
                        }
                    }
                } else if (tabIdOrType) {
                    var t = tabIdOrType.toLowerCase();
                    if (t === 'home') {
                        path = base;
                    } else if (t === 'tests' || t === 'test') {
                        path = prefix + '/test';
                    } else if (t === 'pdfs' || t === 'pdf') {
                        path = prefix + '/pdf';
                    } else if (t === 'acc' || t === 'account' || t === 'my-account') {
                        path = prefix + '/account';
                    } else if (t === 'privacy' || t === 'privacy-policy') {
                        path = prefix + '/privacy-policy';
                    } else if (t === 'terms' || t === 'terms-and-conditions' || t === 'terms-conditions') {
                        path = prefix + '/terms-and-conditions';
                    } else if (t === 'disclaimer' || t === 'legal-disclaimer') {
                        path = prefix + '/legal-disclaimer';
                    } else if (t === 'copyright' || t === 'copyright-policy') {
                        path = prefix + '/copyright-policy';
                    } else {
                        path = prefix + '/' + t;
                    }
                } else {
                    path = base;
                }
                history.pushState({ page: 'internal' }, null, path);
            } catch (e) {
                console.error("Failed to update URL history:", e);
            }
        }
        
        // Dynamic watermarks
        function buildSecurityAntiLeakOverlay(userEmail = "aspirant_guest") {
            const overlay = document.getElementById("securityOverlay");
            overlay.innerHTML = "";
            for (let i = 0; i < 12; i++) {
                const span = document.createElement("div");
                span.className = "leak-label";
                span.innerText = "TAIYARIYA - " + userEmail;
                overlay.appendChild(span);
            }
        }

        // Setup Right Click and Keyboard security locks
        function setupAntiPiracyBlockers() {
            // Disable context menu
            document.addEventListener('contextmenu', e => e.preventDefault());
            
            // Disable selection, copy, paste, cut, dragging
            document.addEventListener('copy', e => e.preventDefault());
            document.addEventListener('paste', e => e.preventDefault());
            document.addEventListener('cut', e => e.preventDefault());
            document.addEventListener('selectstart', e => e.preventDefault());
            document.addEventListener('dragstart', e => e.preventDefault());

            // Keyboard blockers for Inspect / Save / Print / Copy / Selection
            document.addEventListener('keydown', e => {
                // Prevent Ctrl+C / Cmd+C
                if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C')) {
                    e.preventDefault();
                    return false;
                }
                // Prevent Ctrl+A / Cmd+A
                if ((e.ctrlKey || e.metaKey) && (e.key === 'a' || e.key === 'A')) {
                    e.preventDefault();
                    return false;
                }
                // Prevent Ctrl+S / Cmd+S (Save)
                if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
                    e.preventDefault();
                    return false;
                }
                // Prevent Ctrl+U / Cmd+U (View Source)
                if ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U')) {
                    e.preventDefault();
                    return false;
                }
                // Prevent Ctrl+P / Cmd+P (Print)
                if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
                    e.preventDefault();
                    return false;
                }
                // Prevent F12
                if (e.keyCode === 123 || e.key === 'F12') {
                    e.preventDefault();
                    return false;
                }
                // Prevent Shift+F10 (Context Menu)
                if (e.shiftKey && e.keyCode === 121) {
                    e.preventDefault();
                    return false;
                }
                // Prevent Ctrl+Shift+I / Cmd+Alt+I (Inspect)
                if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'i' || e.key === 'I')) {
                    e.preventDefault();
                    return false;
                }
                // Prevent Ctrl+Shift+J / Cmd+Alt+J (Console)
                if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'j' || e.key === 'J')) {
                    e.preventDefault();
                    return false;
                }
                // Prevent Ctrl+Shift+C / Cmd+Alt+C (Inspect Element)
                if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'c' || e.key === 'C')) {
                    e.preventDefault();
                    return false;
                }

                // Keyboard Navigation for Active Test (Laptops/Desktops)
                if (typeof _testStateActiveNow !== 'undefined' && _testStateActiveNow) {
                    var isPaused = typeof _testIsPaused !== 'undefined' && _testIsPaused;
                    if (!isPaused) {
                        if (e.key === "ArrowLeft") {
                            if (typeof handlePrevQuestion === "function") handlePrevQuestion();
                        } else if (e.key === "ArrowRight") {
                            if (typeof handleNextQuestion === "function") handleNextQuestion();
                        } else if (e.key === "Escape") {
                            if (typeof triggerTestInterruptionPause === "function") triggerTestInterruptionPause();
                        }
                    }
                }
            });

            // Prevent Print Screen key (clears clipboard)
            document.addEventListener('keyup', e => {
                if (e.key === 'PrintScreen' || e.keyCode === 44) {
                    try {
                        navigator.clipboard.writeText("");
                    } catch(err) {}
                    alert("Screenshots are strictly prohibited!");
                }
            });

            // Infinite debugger loop to render inspector tools completely unusable
            setInterval(function() {
                try {
                    (function() {
                        const check = function() {
                            if (function() {}.constructor("debugger") !== undefined) {
                                (function() {}).constructor("debugger")();
                            }
                        };
                        check();
                    })();
                } catch (e) {}
            }, 500);
        }

        // Utility to check if a scheduled content is visible
        function isItemScheduledVisible(item) {
            if (!item) return false;
            if (!item.scheduledAt) return true;
            try {
                const schedTime = new Date(item.scheduledAt).getTime();
                if (isNaN(schedTime)) return true;
                const secureCurrentTime = Date.now() + _serverTimeOffset;
                return schedTime <= secureCurrentTime;
            } catch (e) {
                return true;
            }
        }

        // Custom visibility filter checking both schedule AND student email-restrict permissions
        function isItemVisibleToStudent(item, parentChain) {
            if (!item) return false;
            
            // 1. Time / Scheduling check
            if (!isItemScheduledVisible(item)) {
                return false;
            }
            
            // 2. Email restriction check (Node itself, or nested test, or nested pdf, or ancestors)
            var nodeOnlyUsers = (item.onlyUsers || "");
            var testOnlyUsers = (item.test && item.test.onlyUsers) || "";
            var pdfOnlyUsers = (item.pdf && item.pdf.onlyUsers) || "";
            var ancestorOnlyUsers = "";
            
            // Check ancestors if provided as an Array
            var chain = (parentChain && Array.isArray(parentChain)) ? parentChain : null;
            if (chain && chain.length > 0) {
                chain.forEach(function(p) {
                    if (p) {
                        if (p.onlyUsers) ancestorOnlyUsers += "," + p.onlyUsers;
                        if (p.test && p.test.onlyUsers) ancestorOnlyUsers += "," + p.test.onlyUsers;
                        if (p.pdf && p.pdf.onlyUsers) ancestorOnlyUsers += "," + p.pdf.onlyUsers;
                    }
                });
            }
            
            var combinedStr = nodeOnlyUsers + "," + testOnlyUsers + "," + pdfOnlyUsers + "," + ancestorOnlyUsers;
            var combinedOnlyUsers = combinedStr
                .split(/[\\r\\n,;]+/)
                .map(function(s) { return s.trim().toLowerCase(); })
                .filter(function(s) { return s.length > 0; });
            
            if (combinedOnlyUsers.length > 0) {
                if (!_studentLoggedInUser) {
                    try {
                        var cachedUser = localStorage.getItem("_secured_active_aspirant");
                        if (cachedUser) {
                            _studentLoggedInUser = JSON.parse(cachedUser);
                        }
                    } catch(e) {}
                }
                if (!_studentLoggedInUser) {
                    return false;
                }
                var userIdentifiers = [];
                if (_studentLoggedInUser.emailOrMobile) userIdentifiers.push((_studentLoggedInUser.emailOrMobile + "").trim().toLowerCase());
                if (_studentLoggedInUser.email) userIdentifiers.push((_studentLoggedInUser.email + "").trim().toLowerCase());
                if (_studentLoggedInUser.phoneNo) userIdentifiers.push((_studentLoggedInUser.phoneNo + "").trim().toLowerCase());
                if (_studentLoggedInUser.username) userIdentifiers.push((_studentLoggedInUser.username + "").trim().toLowerCase());
                if (_studentLoggedInUser.id) userIdentifiers.push((_studentLoggedInUser.id + "").trim().toLowerCase());
                
                var hasAccess = userIdentifiers.some(function(idVal) {
                    return idVal && combinedOnlyUsers.includes(idVal);
                });
                
                if (!hasAccess) {
                    return false;
                }
            }
            
            return true;
        }

        // Initialize Carousel
        function launchSlidersCarousel() {
            const container = document.getElementById("studentSliderBlock");
            const wrapper = document.getElementById("studentSlidesWrapper");
            const dots = document.getElementById("studentSliderDots");
            if (!container || !wrapper || !dots) return;

            wrapper.innerHTML = "";
            dots.innerHTML = "";

            const activeSliders = (DB.sliders || []).filter(isItemVisibleToStudent);

            if (activeSliders.length === 0) {
                // Show default placeholders if blank
                wrapper.innerHTML = '<div class="slide-item"><img class="slide-item-img" src="https://iili.io/CKMOrGI.md.png" onclick="location.reload()"></div>';
                return;
            }

            activeSliders.forEach((slide, idx) => {
                const slideItem = document.createElement("div");
                slideItem.className = "slide-item";

                var initSrc = enhanceImageUrlQuality((window.__imgCache && window.__imgCache[slide.image]) || slide.image);

                // Create ambient blurred background
                const blurBg = document.createElement("div");
                blurBg.className = "slide-item-blur";
                blurBg.style.backgroundImage = "url('" + initSrc + "')";
                slideItem.appendChild(blurBg);

                // Create main non-stretched, non-cropped image
                const img = document.createElement("img");
                img.className = "slide-item-img";
                img.loading = idx === 0 ? "eager" : "lazy";
                img.decoding = "async";
                img.src = initSrc;
                img.setAttribute("data-original-src", slide.image);
                
                slideItem.appendChild(img);

                slideItem.onclick = () => {
                    if (slide.link && slide.link !== "#") window.open(slide.link, '_blank');
                };
                
                wrapper.appendChild(slideItem);

                const dot = document.createElement("div");
                dot.className = "dot" + (idx === 0 ? " active" : "");
                dot.style.cursor = "pointer";
                dot.onclick = () => {
                    goToSlide(idx);
                    resetTimer();
                };
                dots.appendChild(dot);
            });

            // Create or hook premium navigation arrows
            let prevBtn = container.querySelector(".slider-arrow-left");
            let nextBtn = container.querySelector(".slider-arrow-right");
            if (!prevBtn) {
                prevBtn = document.createElement("div");
                prevBtn.className = "slider-arrow slider-arrow-left";
                prevBtn.innerHTML = '<i class="ph-bold ph-caret-left"></i>';
                container.appendChild(prevBtn);
            }
            if (!nextBtn) {
                nextBtn = document.createElement("div");
                nextBtn.className = "slider-arrow slider-arrow-right";
                nextBtn.innerHTML = '<i class="ph-bold ph-caret-right"></i>';
                container.appendChild(nextBtn);
            }

            if (activeSliders.length <= 1) {
                prevBtn.style.display = "none";
                nextBtn.style.display = "none";
                dots.style.display = "none";
            } else {
                prevBtn.style.display = "flex";
                nextBtn.style.display = "flex";
                dots.style.display = "flex";
            }

            let currentSlideIdx = 0;

            function goToSlide(idx) {
                if (activeSliders.length === 0) return;
                if (idx < 0) idx = activeSliders.length - 1;
                if (idx >= activeSliders.length) idx = 0;
                currentSlideIdx = idx;

                // Corrected translation on container block dimensions for exact slide centering
                const translatePercent = -(currentSlideIdx * 100);
                wrapper.style.transform = "translateX(" + translatePercent + "%)";

                const dotElements = dots.querySelectorAll(".dot");
                dotElements.forEach((d, id) => {
                    if (id === currentSlideIdx) d.classList.add("active");
                    else d.classList.remove("active");
                });
            }

            prevBtn.onclick = (e) => {
                e.stopPropagation();
                goToSlide(currentSlideIdx - 1);
                resetTimer();
            };

            nextBtn.onclick = (e) => {
                e.stopPropagation();
                goToSlide(currentSlideIdx + 1);
                resetTimer();
            };

            // Auto transition slideshow timer
            function startTimer() {
                if (activeSliders.length > 1) {
                    _sliderIntervalId = setInterval(() => {
                        const nextIdx = (currentSlideIdx + 1) % activeSliders.length;
                        goToSlide(nextIdx);
                    }, 2000);
                }
            }

            function resetTimer() {
                if (_sliderIntervalId) clearInterval(_sliderIntervalId);
                startTimer();
            }

            if (_sliderIntervalId) clearInterval(_sliderIntervalId);
            startTimer();

            // Mobile Swiping and Desktop Mouse Drag Gesture Controls
            let startX = 0;
            let currentX = 0;
            let isDragging = false;
            let containerWidth = container.clientWidth || 300;

            window.addEventListener("resize", () => {
                containerWidth = container.clientWidth || 300;
            });

            wrapper.querySelectorAll("img").forEach(img => {
                img.addEventListener("dragstart", (e) => e.preventDefault());
            });

            function handleStart(clientX) {
                if (activeSliders.length <= 1) return;
                startX = clientX;
                currentX = clientX;
                isDragging = true;
                if (_sliderIntervalId) clearInterval(_sliderIntervalId);
                wrapper.style.transition = "none";
                containerWidth = container.clientWidth || 300;
            }

            function handleMove(clientX) {
                if (!isDragging) return;
                currentX = clientX;
                const diffX = currentX - startX;

                // Calculate the pixel offset relative to the current live slide index
                const currentSlideOffsetPercent = -(currentSlideIdx * 100);
                const currentOffsetPx = (currentSlideOffsetPercent / 100) * containerWidth;
                const newOffsetPx = currentOffsetPx + diffX;

                // Translate pixels back to percentage constraints
                const newOffsetPercent = (newOffsetPx / containerWidth) * 100;

                wrapper.style.transform = "translateX(" + newOffsetPercent + "%)";
            }

            function handleEnd() {
                if (!isDragging) return;
                isDragging = false;
                wrapper.style.transition = ""; // Restore premium CSS ease-in-out properties

                const diffX = currentX - startX;
                const threshold = containerWidth * 0.18; // 18% min translation swipe trigger bounds

                if (Math.abs(diffX) > threshold) {
                    if (diffX > 0) {
                        goToSlide(currentSlideIdx - 1);
                    } else {
                        goToSlide(currentSlideIdx + 1);
                    }
                } else {
                    goToSlide(currentSlideIdx);
                }
                startTimer();
            }

            // Register event listeners
            container.addEventListener("touchstart", (e) => {
                handleStart(e.touches[0].clientX);
            }, { passive: true });

            container.addEventListener("touchmove", (e) => {
                handleMove(e.touches[0].clientX);
            }, { passive: true });

            container.addEventListener("touchend", handleEnd, { passive: true });

            container.addEventListener("mousedown", (e) => {
                handleStart(e.clientX);
            });

            window.addEventListener("mousemove", (e) => {
                if (isDragging) {
                    handleMove(e.clientX);
                }
            });

            window.addEventListener("mouseup", () => {
                if (isDragging) handleEnd();
            });

            container.addEventListener("mouseleave", () => {
                if (isDragging) handleEnd();
            });
        }

        // Setup Notices scrolling board
        function renderNoticesScrollingBoard() {
            const noticesArea = document.getElementById("studentNoticeBoard");
            noticesArea.innerHTML = "";

            const activeNotifs = (DB.notifications || []).filter(isItemVisibleToStudent);

            if (activeNotifs.length === 0) {
                noticesArea.innerHTML = '<p style="font-size:12px; color:var(--grey-text); font-weight:800; padding:10px;">No new alerts today.</p>';
                return;
            }

            activeNotifs.forEach(notif => {
                const card = document.createElement("div");
                card.className = "notif-card";
                var initSrc = (window.__imgCache && window.__imgCache[notif.image]) || notif.image || "";
                
                var htmlStr = "";
                if (notif.image) {
                    htmlStr += '<img class="notif-banner" src="' + initSrc + '" data-original-src="' + notif.image + '">';
                }
                htmlStr += '<div class="notif-content">';
                htmlStr += '    <h4 class="notif-title">' + notif.title + '</h4>';
                htmlStr += '    <p class="notif-desc">' + notif.message + '</p>';
                if (notif.link) {
                    htmlStr += '<a class="notif-action-btn" target="_blank" href="' + notif.link + '">' + (notif.buttonName || "CHECK") + '</a>';
                }
                htmlStr += '</div>';
                
                card.innerHTML = htmlStr;
                noticesArea.appendChild(card);
                if (notif.image && !(window.__imgCache && window.__imgCache[notif.image]) && typeof getCachedImageUrl === "function") {
                    const imgEl = card.querySelector(".notif-banner");
                    if (imgEl) {
                        getCachedImageUrl(notif.image).then(function(src) {
                            if (src && src !== notif.image) {
                                imgEl.src = src;
                            }
                        });
                    }
                }
            });

            // Notice auto slider every 5 seconds
            let noticeScrollIdx = 0;
            if (_noticeIntervalId) clearInterval(_noticeIntervalId);
            _noticeIntervalId = setInterval(() => {
                const cards = noticesArea.querySelectorAll(".notif-card");
                if (cards.length > 1) {
                    noticeScrollIdx = (noticeScrollIdx + 1) % cards.length;
                    const targetCard = cards[noticeScrollIdx];
                    if (targetCard) {
                        noticesArea.scrollTo({
                            left: targetCard.offsetLeft - 15,
                            behavior: 'smooth'
                        });
                    }
                }
            }, 5000);
        }

        function handleScrollToNotifications() {
            handleTabNavigation('home');
            setTimeout(() => {
                const target = document.getElementById("notifScrollAnchor");
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }

        // Google AdSense Dynamic Controller
        function refreshGoogleAds() {
            var adsEnabled = ${config.adsense?.enabled ? 'true' : 'false'};
            var pubId = "${config.adsense?.publisherId || ''}";
            
            if (!adsEnabled || !pubId || pubId.trim() === "") {
                clearAllGoogleAds();
                return;
            }

            // ONLY show ads when user is logged out!
            if (_studentLoggedInUser !== null) {
                clearAllGoogleAds();
                return;
            }

            // DO NOT show ads while inside the exam/test engine panel!
            var testPanel = document.getElementById("test-engine-panel");
            if (testPanel && testPanel.style.display !== "none") {
                clearAllGoogleAds();
                return;
            }

            if (window._testStateActiveNow) {
                clearAllGoogleAds();
                return;
            }

            // Render visible containers!
            renderGoogleAdUnit("ad-container-home-top", "${config.adsense?.homeTopSlotId || ''}");
            renderGoogleAdUnit("ad-container-home-bottom", "${config.adsense?.homeBottomSlotId || ''}");
            renderGoogleAdUnit("ad-container-category-bottom", "${config.adsense?.sidebarSlotId || ''}");
        }

        function clearAllGoogleAds() {
            var containers = [
                "ad-container-home-top", 
                "ad-container-home-bottom", 
                "ad-container-category-bottom"
            ];
            containers.forEach(function(id) {
                var el = document.getElementById(id);
                if (el) {
                    el.classList.remove("ad-filled");
                    el.innerHTML = "";
                    el.style.display = "none";
                    el.style.height = "0";
                    el.style.margin = "0";
                    el.style.padding = "0";
                }
            });
        }

        function renderGoogleAdUnit(containerId, slotId) {
            var el = document.getElementById(containerId);
            if (!el) return;

            // Check screen active state depending on containerId
            var isScreenActive = false;
            if (containerId === "ad-container-home-top" || containerId === "ad-container-home-bottom") {
                var scr = document.getElementById("scr-home");
                if (scr && scr.classList.contains("active")) {
                    isScreenActive = true;
                }
            } else if (containerId === "ad-container-category-bottom") {
                var scr = document.getElementById("scr-category");
                if (scr && scr.classList.contains("active")) {
                    isScreenActive = true;
                }
            }

            if (!isScreenActive) {
                el.classList.remove("ad-filled");
                el.style.display = "none";
                el.style.height = "0";
                el.style.margin = "0";
                return;
            }

            // Check if already injected
            var existingIns = el.querySelector("ins.adsbygoogle");
            if (existingIns) {
                var status = existingIns.getAttribute("data-ad-status");
                if (status === "unfilled") {
                    el.classList.remove("ad-filled");
                    el.style.display = "none";
                    el.style.height = "0";
                    el.style.margin = "0";
                } else if (status === "filled" || existingIns.clientHeight > 20) {
                    el.classList.add("ad-filled");
                    el.style.display = "block";
                    el.style.height = "auto";
                }
                return; 
            }

            var pubId = "${config.adsense?.publisherId || ''}";
            if (!pubId || pubId.trim() === "") return;

            var slotHtml = "";
            if (slotId && slotId.trim() !== "") {
                slotHtml = 'data-ad-slot="' + slotId + '"';
            }

            el.innerHTML = 
                '<div style="text-align: center; margin: 0 auto; max-width: 100%; overflow: hidden;">' +
                '  <ins class="adsbygoogle" ' +
                '       style="display:block; min-height: 0; height: auto;" ' +
                '       data-ad-client="' + pubId + '" ' +
                '       ' + slotHtml + ' ' +
                '       data-ad-format="auto" ' +
                '       data-full-width-responsive="true"></ins>' +
                '</div>';

            var ins = el.querySelector("ins.adsbygoogle");
            if (ins) {
                var checkStatus = function() {
                    if (!el || !ins) return;
                    var st = ins.getAttribute("data-ad-status");
                    var hasIframe = ins.querySelector("iframe");
                    var iframeH = hasIframe ? (hasIframe.offsetHeight || hasIframe.clientHeight || 0) : 0;
                    if (st === "filled" || iframeH > 20 || ins.clientHeight > 20) {
                        el.classList.add("ad-filled");
                        el.style.display = "block";
                        el.style.height = "auto";
                    } else if (st === "unfilled") {
                        el.classList.remove("ad-filled");
                        el.style.display = "none";
                        el.style.height = "0";
                        el.style.margin = "0";
                    }
                };

                try {
                    var obs = new MutationObserver(function() {
                        checkStatus();
                    });
                    obs.observe(ins, { attributes: true, attributeFilter: ["data-ad-status", "style", "class"], childList: true, subtree: true });
                } catch(e) {}

                setTimeout(checkStatus, 600);
                setTimeout(checkStatus, 1500);
                setTimeout(checkStatus, 3000);
            }

            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (e) {
                console.warn("Google AdSense push error:", e);
            }
        }

        // Tab Navigation Central Routing
        function handleTabNavigation(tabId) {
            try {
                if (typeof checkConcurrentUserSession === "function") {
                    checkConcurrentUserSession();
                }
            } catch(e) {}

            try {
                localStorage.setItem("_student_active_tab_id", tabId);
            } catch(e) {}

            // Cancel navigation stack history because tab click resets to root views
            _navHistory = [tabId === 'home' ? 'home' : 'tab-' + tabId];
            
            // Toggle highlight tabs
            document.querySelectorAll(".bottom-nav-item").forEach(el => el.classList.remove("active"));
            const currentTabBtn = document.getElementById("tab-" + tabId);
            if (currentTabBtn) currentTabBtn.classList.add("active");

            // Also toggle desktop navigation bar active tabs
            document.querySelectorAll(".desktop-nav-link").forEach(el => el.classList.remove("active"));
            const currentDTabBtn = document.getElementById("dtab-" + tabId);
            if (currentDTabBtn) currentDTabBtn.classList.add("active");

            // Display Screens
            document.querySelectorAll(".screen").forEach(sc => sc.classList.remove("active"));
            
            // Reset navigations bar
            const header = document.getElementById("mainHeader");
            const backHeader = document.getElementById("backNavigationHeader");

            header.style.display = 'flex';
            backHeader.style.display = 'none';

            // Reset category nodes state on top tab switch
            _activeCategoryNodeForUrl = null;
            _activeSubcategoryNodeForUrl = null;
            _activeTopicNodeForUrl = null;

            // Instant scroll to top on tab switch to avoid scroll offset whitespace
            try {
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                if (document.documentElement) document.documentElement.scrollTop = 0;
                if (document.body) document.body.scrollTop = 0;
            } catch(e) {}

            if (tabId === 'home') {
                document.getElementById("scr-home").classList.add("active");
                renderSavedQuestionsBox();
                updateHistoryAndUrl(null, null, null, 'home');
                try {
                    // Re-sync slider if initialized
                    var sWrapper = document.getElementById("studentSlidesWrapper");
                    if (sWrapper) {
                        sWrapper.style.transform = "translateX(0%)";
                    }
                    var firstDot = document.querySelector("#studentSliderDots .dot");
                    if (firstDot) {
                        document.querySelectorAll("#studentSliderDots .dot").forEach((d, i) => {
                            if (i === 0) d.classList.add("active");
                            else d.classList.remove("active");
                        });
                    }
                } catch(e) {}
            } else if (tabId === 'tests') {
                document.getElementById("scr-category").classList.add("active");
                renderCategorySelectionScreen('test');
                updateHistoryAndUrl(null, null, null, 'tests');
            } else if (tabId === 'pdfs') {
                document.getElementById("scr-category").classList.add("active");
                renderCategorySelectionScreen('pdf');
                updateHistoryAndUrl(null, null, null, 'pdfs');
            } else if (tabId === 'acc') {
                document.getElementById("scr-acc").classList.add("active");
                refreshStudentAccountProfileGate();
                updateHistoryAndUrl(null, null, null, 'acc');
            }

            // Trigger AdSense refresh on tab navigation
            try {
                refreshGoogleAds();
            } catch(e) {}
        }

        // Navigation Stack pushes
        function navigateToScreen(screenElementId, screenTitle) {
            document.querySelectorAll(".screen").forEach(sc => sc.classList.remove("active"));
            document.getElementById(screenElementId).classList.add("active");

            // Instant scroll to top on screen transition
            try {
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                if (document.documentElement) document.documentElement.scrollTop = 0;
                if (document.body) document.body.scrollTop = 0;
            } catch(e) {}

            // Stack tracking
            _navHistory.push(screenElementId);

            // Display navigation back row
            document.getElementById("mainHeader").style.display = 'none';
            const backHeader = document.getElementById("backNavigationHeader");
            backHeader.style.display = 'flex';
            document.getElementById("navHeaderBreadcrumb").innerText = screenTitle.toUpperCase();

            if (screenElementId === 'scr-pay') {
                try { ensurePaymentQrCached(); } catch(e){}
            }

            // Trigger AdSense refresh on screen navigation
            try {
                refreshGoogleAds();
            } catch(e) {}
        }

        // Nav stack back trace
        function handleHistoryBack() {
            if (_testStateActiveNow) {
                triggerTestInterruptionPause();
                return;
            }

            const currentActiveScreen = document.querySelector(".screen.active");
            const currentScreenId = currentActiveScreen ? currentActiveScreen.id : "scr-home";

            if (currentScreenId === 'scr-home') {
                showCustomConfirm("Exit Application", "Do you want to exit Taiyariya Study Desk?", function() {
                    history.back();
                });
                return;
            }

            if (currentScreenId === 'scr-topics' && _activeTopicStack && _activeTopicStack.length > 0) {
                _activeTopicStack.pop();
                if (_activeTopicStack.length > 0) {
                    const parentTopicNode = _activeTopicStack[_activeTopicStack.length - 1];
                    renderTopicList(parentTopicNode.topics || [], parentTopicNode.name, _activeTopicType);
                } else {
                    renderTopicList(_activeSubcategoryNodeForUrl.topics || [], _activeSubcategoryNodeForUrl.name, _activeTopicType);
                }
                return;
            }

            if (_navHistory.length <= 1) {
                handleTabNavigation('home');
                return;
            }

            // Pop active
            _navHistory.pop();
            const prevScreenId = _navHistory[_navHistory.length - 1];

            document.querySelectorAll(".screen").forEach(sc => sc.classList.remove("active"));
            
            if (prevScreenId === 'home') {
                document.getElementById("mainHeader").style.display = 'flex';
                document.getElementById("backNavigationHeader").style.display = 'none';
                document.getElementById("scr-home").classList.add("active");
                _navHistory = ['home'];

                document.querySelectorAll(".bottom-nav-item").forEach(el => el.classList.remove("active"));
                const homeTab = document.getElementById("tab-home");
                if (homeTab) homeTab.classList.add("active");
                document.querySelectorAll(".desktop-nav-link").forEach(el => el.classList.remove("active"));
                const homeDTab = document.getElementById("dtab-home");
                if (homeDTab) homeDTab.classList.add("active");

                _activeCategoryNodeForUrl = null;
                _activeSubcategoryNodeForUrl = null;
                _activeTopicNodeForUrl = null;
                updateHistoryAndUrl(null, null, null);
            } else if (prevScreenId.startsWith('tab-')) {
                const tabId = prevScreenId.replace('tab-', '');
                handleTabNavigation(tabId);
            } else {
                document.getElementById(prevScreenId).classList.add("active");
                document.getElementById("mainHeader").style.display = 'none';
                document.getElementById("backNavigationHeader").style.display = 'flex';

                if (prevScreenId === 'scr-category') {
                    _activeCategoryNodeForUrl = null;
                    _activeSubcategoryNodeForUrl = null;
                    _activeTopicNodeForUrl = null;
                    updateHistoryAndUrl(null, null, null);
                } else if (prevScreenId === 'scr-subcat') {
                    _activeSubcategoryNodeForUrl = null;
                    _activeTopicNodeForUrl = null;
                    updateHistoryAndUrl(_activeCategoryNodeForUrl, null, null);
                } else if (prevScreenId === 'scr-topics') {
                    _activeTopicNodeForUrl = null;
                    updateHistoryAndUrl(_activeCategoryNodeForUrl, _activeSubcategoryNodeForUrl, null);
                }
            }

            // Trigger AdSense refresh on history back popping
            try {
                refreshGoogleAds();
            } catch(e) {}
        }

        // Quick Access Navigation System
        function handleOpenCategoryLibrary(type) {
            handleTabNavigation(type === 'test' ? 'tests' : 'pdfs');
        }

        // Test Interruption, Blur, and Resume System mechanics
        function triggerTestInterruptionPause() {
            if (!_testStateActiveNow || _testIsPaused) return;

            _testIsPaused = true;
            
            // 1. Pause active timer loop
            if (_timeIntervalId) {
                clearInterval(_timeIntervalId);
                _timeIntervalId = null;
            }

            // 2. Blur Exam Paper content area
            const qsContent = document.getElementById("engineQsContent");
            if (qsContent) {
                qsContent.style.filter = "blur(8px)";
                qsContent.style.pointerEvents = "none";
            }

            // 3. Mount resume prompt modal over screen
            document.getElementById("testPauseResumeModal").style.display = "flex";
        }

        function handleResumeActiveTest() {
            _testIsPaused = false;

            // 1. Unblur exam papers
            const qsContent = document.getElementById("engineQsContent");
            if (qsContent) {
                qsContent.style.filter = "none";
                qsContent.style.pointerEvents = "auto";
            }

            // 2. Hide modal overlay
            document.getElementById("testPauseResumeModal").style.display = "none";

            // 3. Restart ticking loop
            if (_timeIntervalId) clearInterval(_timeIntervalId);
            _timeIntervalId = setInterval(() => {
                _timeRemainingSecs--;
                updateTestEngineTimerClockDisplay();

                if (_timeRemainingSecs <= 0) {
                    clearInterval(_timeIntervalId);
                    handleForceAutoSubmitTest();
                }
            }, 1000);
        }

        function handleExitActiveTest() {
            _testIsPaused = false;
            _testStateActiveNow = false;

            // Unblur and clean
            const qsContent = document.getElementById("engineQsContent");
            if (qsContent) {
                qsContent.style.filter = "none";
                qsContent.style.pointerEvents = "auto";
            }

            document.getElementById("testPauseResumeModal").style.display = "none";
            document.getElementById("test-engine-panel").style.display = "none";

            // Reset answers (User must start test again)
            _answersMap = {};
            _markedReviewMap = {};
            _revealedAnswersMap = {};

            // Roll back view to selection
            handleHistoryBack();
        }

        // Browser level state listeners (loss of focus, locks, minimized states)
        document.addEventListener("visibilitychange", () => {
            if (document.hidden && _testStateActiveNow) {
                triggerTestInterruptionPause();
            }
        });

        window.addEventListener("blur", () => {
            if (_testStateActiveNow) {
                triggerTestInterruptionPause();
            }
        });

        // Sync date offsets with backend
        function syncServerTimeOffset() {
            fetch(getApiUrl('/api/time'))
                .then(r => r.json())
                .then(data => {
                    if (data && data.timestamp) {
                        _serverTimeOffset = data.timestamp - Date.now();
                        console.log("[CLOCK] Sync complete. Server offset: " + _serverTimeOffset + "ms");
                    }
                })
                .catch(() => {
                    fetch('https://worldtimeapi.org/api/timezone/Etc/UTC')
                        .then(r => r.json())
                        .then(data => {
                            if (data && data.unixtime) {
                                _serverTimeOffset = (data.unixtime * 1000) - Date.now();
                            }
                        })
                        .catch(() => {});
                });
        }
        syncServerTimeOffset();

        // Capture physical keyboard, context popping and browser-back button behaviors
        function initHistoryStatePush() {
            window.addEventListener('popstate', (e) => {
                if (_testStateActiveNow) {
                    history.pushState({ page: 'test' }, null, window.location.href);
                    triggerTestInterruptionPause();
                    return;
                }

                _isHandlingPopState = true;
                try {
                    const parsed = handleDeepLinking();
                    if (!parsed) {
                        handleTabNavigation('home');
                    }
                } catch (err) {
                    console.error("Deep link parse error on popstate:", err);
                } finally {
                    _isHandlingPopState = false;
                }
            });
        }
        // Delayed initialization to clear startup stacks
        setTimeout(initHistoryStatePush, 1000);

        // Catalog Selection Display Helpers
        function getQuestionsCountFromTest(testMeta) {
            if (!testMeta) return 0;
            if (typeof testMeta.questionsCount === 'number') return testMeta.questionsCount;
            if (testMeta.questionsCount) {
                var c = parseInt(testMeta.questionsCount, 10);
                if (!isNaN(c)) return c;
            }
            if (testMeta.questionsEn && testMeta.questionsEn.length > 0) return testMeta.questionsEn.length;
            if (testMeta.questionsHi && testMeta.questionsHi.length > 0) return testMeta.questionsHi.length;
            if (testMeta.questionsOther) {
                for (var k in testMeta.questionsOther) {
                    if (testMeta.questionsOther[k] && testMeta.questionsOther[k].length > 0) {
                        return testMeta.questionsOther[k].length;
                    }
                }
            }
            return 0;
        }

        function isTestUploaded(testMeta) {
            if (!testMeta) return false;
            if (testMeta.hasSplitQuestions) return true;
            var qCount = getQuestionsCountFromTest(testMeta);
            if (qCount > 0) return true;
            if (testMeta.questions && testMeta.questions.length > 0) return true;
            return false;
        }

        function isPdfUploaded(pdfMeta) {
            if (!pdfMeta) return false;
            if (pdfMeta.url && typeof pdfMeta.url === 'string' && pdfMeta.url.trim().length > 0) return true;
            if (pdfMeta.file && typeof pdfMeta.file === 'string' && pdfMeta.file.trim().length > 0) return true;
            return false;
        }

        function calculateNodeStats(node, type) {
            var totalTests = 0;
            var totalQuestions = 0;
            var totalDurationMins = 0;
            var attemptedTests = 0;
            var totalFiles = 0;
            var readFiles = 0;

            function traverse(n) {
                if (!n) return;
                if (type === "test") {
                    if (n.test && isItemVisibleToStudent(n.test)) {
                        var qCount = getQuestionsCountFromTest(n.test);
                        if (isTestUploaded(n.test)) {
                            totalTests++;
                            totalQuestions += qCount;
                            var dur = n.test.duration || 0;
                            totalDurationMins += dur;
                            var attempts = parseInt(localStorage.getItem("attempts_test_" + n.test.id) || "0", 10);
                            if (attempts > 0) {
                                attemptedTests++;
                            }
                        }
                    }
                } else {
                    if (n.pdf && isItemVisibleToStudent(n.pdf)) {
                        if (isPdfUploaded(n.pdf)) {
                            totalFiles++;
                            var pdfKey = (n.pdf && n.pdf.id) ? n.pdf.id : n.id;
                            if (localStorage.getItem("pdf_read_" + pdfKey) === "true" || localStorage.getItem("pdf_read_" + n.id) === "true") {
                                readFiles++;
                            }
                        }
                    }
                }

                if (n.subCategories && Array.isArray(n.subCategories)) {
                    for (var i = 0; i < n.subCategories.length; i++) {
                        var sub = n.subCategories[i];
                        if (isItemVisibleToStudent(sub)) {
                            traverse(sub);
                        }
                    }
                }
                if (n.topics && Array.isArray(n.topics)) {
                    for (var j = 0; j < n.topics.length; j++) {
                        var top = n.topics[j];
                        if (isItemVisibleToStudent(top)) {
                            traverse(top);
                        }
                    }
                }
            }

            traverse(node);

            var totalHrsFormatted = (function() {
                if (totalDurationMins >= 60) {
                    var rawHours = totalDurationMins / 60;
                    var totalHrsStr = rawHours.toFixed(1);
                    return (totalHrsStr.endsWith(".0") ? rawHours.toFixed(0) : totalHrsStr) + " Hrs";
                } else if (totalDurationMins > 0) {
                    return totalDurationMins + " Mins";
                } else {
                    return "0 Hrs";
                }
            })();

            var totalQFormatted = (function() {
                if (totalQuestions >= 1000) {
                    var k = totalQuestions / 1000;
                    return (k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)) + "K";
                }
                return totalQuestions.toString();
            })();

            return {
                totalTests: totalTests,
                totalQuestions: totalQuestions,
                totalQFormatted: totalQFormatted,
                totalDurationMins: totalDurationMins,
                totalHrsFormatted: totalHrsFormatted,
                attemptedTests: attemptedTests,
                totalFiles: totalFiles,
                readFiles: readFiles
            };
        }

        function calculateCategoryStats(cat) {
            return calculateNodeStats(cat, "test");
        }

        // Catalog Selection Display
        function renderCategorySelectionScreen(type) {
            _activeCategoryName = "N/A";
            _activeSubCategoryName = "N/A";
            _activeTopicName = "N/A";

            const container = document.getElementById("categoryGridArea");
            container.innerHTML = "";
            
            var titleIcon = (type === 'test' ? 'exam' : 'file-pdf');
            document.getElementById("categorySelectionTitle").innerHTML = '<i class="ph ph-' + titleIcon + '"></i> Select Category';

            // List elements from configuration and filter by scheduling and email permissions
            const targetCategories = (type === 'test' ? DB.testCategories : DB.pdfCategories) || [];
            const visibleCategories = targetCategories.filter(isItemVisibleToStudent);

            // Sort visibleCategories: Unlocked paid categories at the top, then locked paid, and free at the bottom
            visibleCategories.sort(function(a, b) {
                var getRank = function(cat) {
                    if (cat.isPaid) {
                        return isCategoryUnlocked(cat) ? 1 : 2;
                    }
                    return 3; // Free
                };
                return getRank(a) - getRank(b);
            });

            if (visibleCategories.length === 0) {
                container.innerHTML = '<div class="coming-soon-box"><i class="ph-fill ph-clock-countdown" style="font-size: 26px; color: #ef4444; margin-bottom: 6px; display: block;"></i>Coming Soon</div>';
                return;
            }

            visibleCategories.forEach((cat) => {
                const card = document.createElement("div");
                card.className = "outline-item-card";
                card.onclick = () => handleSelectCategoryNode(cat, type);
                var initSrc = (window.__imgCache && window.__imgCache[cat.image]) || cat.image || "";
                
                var catHtml = "";
                if (cat.image && cat.image.trim() !== "") {
                    catHtml += '<img class="outline-item-img" src="' + initSrc + '" data-original-src="' + cat.image + '">';
                } else {
                    var defaultIcon = type === 'test' ? 'ph ph-clipboard-text' : 'ph ph-file-pdf';
                    catHtml += '<div class="outline-item-img" style="display:flex;align-items:center;justify-content:center;color: var(--primary);"><i class="' + defaultIcon + '" style="font-size:24px;"></i></div>';
                }

                var detailsHtml = '<p class="outline-item-subtitle" style="margin-bottom:4px;">Explore resources & materials</p>';
                if (type === 'test') {
                    var stats = calculateCategoryStats(cat);
                    var currentClicks = parseInt(localStorage.getItem("_cat_attempts_" + cat.id) || "0", 10);
                    if (!currentClicks) {
                        var defaultBase = 1100 + ((cat.name && cat.name.charCodeAt(0)) || 0) * 13 + ((cat.id && cat.id.charCodeAt(0)) || 0) * 7;
                        currentClicks = defaultBase;
                        localStorage.setItem("_cat_attempts_" + cat.id, currentClicks.toString());
                    }
                    
                    // Daily bonus: Add 500 attempts per day desde 2026-06-20
                    var startDate = new Date("2026-06-20").getTime();
                    var daysPassed = Math.max(0, Math.floor((Date.now() - startDate) / (1000 * 3600 * 24)));
                    var dailyBonus = daysPassed * 500;
                    
                    var totalAttempts = currentClicks + dailyBonus;
                    if (totalAttempts >= 10000000) {
                        totalAttempts = 10000000;
                    }

                    var attemptsString;
                    if (totalAttempts >= 10000000) {
                        attemptsString = "10.0M";
                    } else if (totalAttempts >= 1000000) {
                        attemptsString = (totalAttempts / 1000000).toFixed(2) + "M";
                    } else if (totalAttempts >= 1000) {
                        attemptsString = (totalAttempts / 1000).toFixed(1) + "k";
                    } else {
                        attemptsString = totalAttempts.toString();
                    }

                    var totalQFormatted = (function() {
                        var qNum = stats.totalQuestions;
                        if (qNum >= 1000) {
                            var k = qNum / 1000;
                            return (k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)) + "K";
                        }
                        return qNum.toString();
                    })();

                    var totalHrsFormatted = (function() {
                        var rawHours = stats.totalDurationMins / 60;
                        var totalHrsStr = rawHours.toFixed(1);
                        return (totalHrsStr.endsWith(".0") ? rawHours.toFixed(0) : totalHrsStr) + ' Hrs';
                    })();

                    var statusBadgeHtml = '';
                    if (cat.isPaid) {
                        if (isCategoryUnlocked(cat)) {
                            var catExpiry = null;
                            var isCatLifetime = false;
                            if (_studentLoggedInUser) {
                                var hasSpecific = false;
                                if (_studentLoggedInUser.categoryDates && _studentLoggedInUser.categoryDates[cat.id]) {
                                    var catData = _studentLoggedInUser.categoryDates[cat.id];
                                    if (catData.isLifetime) {
                                        isCatLifetime = true;
                                        hasSpecific = true;
                                    } else if (catData.expiryDate && catData.expiryDate.trim() !== "") {
                                        catExpiry = catData.expiryDate;
                                        hasSpecific = true;
                                    }
                                }
                                if (!hasSpecific) {
                                    if (_studentLoggedInUser.expiryDate && _studentLoggedInUser.expiryDate.trim() !== "") {
                                        catExpiry = _studentLoggedInUser.expiryDate;
                                    } else {
                                        isCatLifetime = true;
                                    }
                                }
                            }
                            if (isCatLifetime) {
                                statusBadgeHtml = '        <span style="display: inline-flex; align-items: center; gap: 4px; color: #9b59b6; font-size: 9.5px; font-weight: 850; background: rgba(155, 89, 182, 0.08); padding: 1.5px 6px; border-radius: 6px; border: 1px solid rgba(155, 89, 182, 0.15); animation: premiumBlink 1.5s infinite ease-in-out; white-space: nowrap;">' +
                                                  '            <i class="ph-fill ph-sparkle" style="font-size: 10.5px; color: #9b59b6;"></i> ' +
                                                  '            <span>Lifetime Active</span>' +
                                                  '        </span>';
                            } else if (catExpiry) {
                                var exp = new Date(catExpiry);
                                var diffMs = exp.getTime() - Date.now();
                                var diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
                                if (diffDays > 0) {
                                    statusBadgeHtml = '        <span style="display: inline-flex; align-items: center; gap: 4px; color: #2ecc71; font-size: 9.5px; font-weight: 850; background: rgba(46, 204, 113, 0.08); padding: 2px 6.5px; border-radius: 6px; border: 1px solid rgba(46, 204, 113, 0.15); white-space: nowrap;">' +
                                                      '            <i class="ph-fill ph-check-circle" style="font-size: 11px; color: #2ecc71;"></i> ' +
                                                      '            <span style="display: inline-block; position: relative; height: 13px; width: 70px; overflow: hidden; vertical-align: middle; line-height: 13px;">' +
                                                      '                <span style="position: absolute; left: 0; top: 0; font-weight: 850; animation: badgeAltTextFade1 3s infinite; white-space: nowrap;">Active</span>' +
                                                      '                <span style="position: absolute; left: 0; top: 0; font-weight: 850; animation: badgeAltTextFade2 3s infinite; white-space: nowrap;">' + diffDays + ' Days</span>' +
                                                      '            </span>' +
                                                      '        </span>';
                                } else {
                                    statusBadgeHtml = '        <span style="display: inline-flex; align-items: center; gap: 4px; color: #ef4444; font-size: 9.5px; font-weight: 850; background: rgba(239, 68, 68, 0.08); padding: 1.5px 6px; border-radius: 6px; border: 1px solid rgba(239, 68, 68, 0.15); white-space: nowrap;">' +
                                                      '            <i class="ph-fill ph-x-circle" style="font-size: 10.5px; color: #ef4444;"></i> ' +
                                                      '            <span>Expired</span>' +
                                                      '        </span>';
                                }
                            } else {
                                statusBadgeHtml = '        <span style="display: inline-flex; align-items: center; gap: 4px; color: #9b59b6; font-size: 9.5px; font-weight: 850; background: rgba(155, 89, 182, 0.08); padding: 1.5px 6px; border-radius: 6px; border: 1px solid rgba(155, 89, 182, 0.15); animation: premiumBlink 1.5s infinite ease-in-out; white-space: nowrap;">' +
                                                  '            <i class="ph-fill ph-sparkle" style="font-size: 10.5px; color: #9b59b6;"></i> ' +
                                                  '            <span>Lifetime Active</span>' +
                                                  '        </span>';
                            }
                        } else {
                            var price = cat.paymentAmount || (DB && DB.social && DB.social.premiumPrice) || "₹49";
                            statusBadgeHtml = '        <span style="display: inline-flex; align-items: center; gap: 3px; background: #009CFC; color: #ffffff; padding: 1.5px 6.5px; border-radius: 4px; font-weight: 900; cursor: pointer; font-size: 9px; box-shadow: 0 1.5px 4px rgba(0,156,252,0.25); white-space: nowrap; font-family: Outfit, sans-serif;" onclick="event.stopPropagation(); handleBuyNowClick(\\\'' + cat.id + '\\\')">' +
                                              '            <i class="ph-bold ph-shopping-cart-simple" style="font-size: 9.5px;"></i> ' + price + ' / Buy Now' +
                                              '        </span>' +
                                              '        <span style="display: inline-flex; align-items: center; gap: 3px; background: #0077C8; color: #ffffff; padding: 1.5px 5.5px; border-radius: 4px; font-weight: 900; cursor: pointer; font-size: 9px; box-shadow: 0 1.5px 4px rgba(0,119,200,0.2); white-space: nowrap; margin-left: 4px; font-family: Outfit, sans-serif;" onclick="event.stopPropagation(); handleViewDemoClick(\\\'' + cat.id + '\\\', \\\'test\\\')">' +
                                              '            <i class="ph-bold ph-eye" style="font-size: 9.5px;"></i> View Demo' +
                                              '        </span>';
                        }
                    } else {
                        statusBadgeHtml = '        <span style="display: inline-flex; align-items: center; gap: 4px; color: #0077C8; font-size: 9px; font-weight: 900; background: rgba(0, 156, 252, 0.08); padding: 1.5px 6.5px; border-radius: 6px; border: 1px solid rgba(0, 156, 252, 0.18); white-space: nowrap; text-transform: uppercase; letter-spacing: 0.3px;">' +
                                          '            <i class="ph-bold ph-gift" style="font-size: 10px; color: #009CFC;"></i> ' +
                                          '            <span>Free</span>' +
                                          '        </span>';
                    }

                    if (stats.totalTests === 0 && stats.totalQuestions === 0) {
                        detailsHtml = '    <div style="display: inline-flex; align-items: center; gap: 4px; margin-top: 5px; background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.18); padding: 2px 7px; border-radius: 6px; box-sizing: border-box; flex-wrap: wrap; max-width: 100%;">' +
                                      '        <span style="display: inline-flex; align-items: center; gap: 3px; font-size: 9px; font-weight: 850; color: #ef4444; white-space: nowrap;">' +
                                      '            <i class="ph-bold ph-hourglass-simple" style="color: #ef4444; font-size: 11px;"></i> Coming Soon' +
                                      '        </span>' +
                                      '        <span style="width: 1px; height: 9px; background: rgba(120, 120, 120, 0.15); flex-shrink: 0;"></span>' +
                                      statusBadgeHtml +
                                      '    </div>';
                    } else {
                        var testBadgeLabel = stats.totalQuestions > 0 ? (totalQFormatted + ' MCQ') : (stats.totalTests + ' ' + (stats.totalTests === 1 ? 'Test' : 'Tests'));
                        var testBadgeIcon = stats.totalQuestions > 0 ? 'ph-question' : 'ph-clipboard-text';
                        detailsHtml = '    <div style="display: inline-flex; align-items: center; gap: 5px; margin-top: 5px; background: rgba(120, 120, 120, 0.05); border: 1px solid rgba(120, 120, 120, 0.08); padding: 2px 6px; border-radius: 6px; box-sizing: border-box; flex-wrap: wrap; max-width: 100%;">' +
                                      '        <span style="display: inline-flex; align-items: center; gap: 2px; font-size: 9px; font-weight: 850; color: var(--dark); white-space: nowrap;">' +
                                      '            <i class="ph-bold ' + testBadgeIcon + '" style="color: #009CFC; font-size: 11px;"></i> ' + testBadgeLabel +
                                      '        </span>' +
                                      '        <span style="width: 1px; height: 9px; background: rgba(120, 120, 120, 0.15); flex-shrink: 0;"></span>' +
                                      '        <span style="display: inline-flex; align-items: center; gap: 2px; font-size: 9px; font-weight: 850; color: var(--dark); white-space: nowrap;">' +
                                      '            <i class="ph-bold ph-clock" style="color: #0077C8; font-size: 11px;"></i> ' + totalHrsFormatted +
                                      '        </span>' +
                                      '        <span style="width: 1px; height: 9px; background: rgba(120, 120, 120, 0.15); flex-shrink: 0;"></span>' +
                                      statusBadgeHtml +
                                      '    </div>';
                    }
                } else {
                    var pdfStats = calculateNodeStats(cat, 'pdf');
                    var totalFiles = pdfStats.totalFiles;

                    var pdfStatusBadgeHtml = '';
                    if (cat.isPaid) {
                        if (isCategoryUnlocked(cat)) {
                            var catExpiry = null;
                            var isCatLifetime = false;
                            if (_studentLoggedInUser) {
                                var hasSpecific = false;
                                if (_studentLoggedInUser.categoryDates && _studentLoggedInUser.categoryDates[cat.id]) {
                                    var catData = _studentLoggedInUser.categoryDates[cat.id];
                                    if (catData.isLifetime) {
                                        isCatLifetime = true;
                                        hasSpecific = true;
                                    } else if (catData.expiryDate && catData.expiryDate.trim() !== "") {
                                        catExpiry = catData.expiryDate;
                                        hasSpecific = true;
                                    }
                                }
                                if (!hasSpecific) {
                                    if (_studentLoggedInUser.expiryDate && _studentLoggedInUser.expiryDate.trim() !== "") {
                                        catExpiry = _studentLoggedInUser.expiryDate;
                                    } else {
                                        isCatLifetime = true;
                                    }
                                }
                            }
                            if (isCatLifetime) {
                                pdfStatusBadgeHtml = '        <span style="display: inline-flex; align-items: center; gap: 4px; color: #9b59b6; font-size: 9.5px; font-weight: 850; background: rgba(155, 89, 182, 0.08); padding: 1.5px 6px; border-radius: 6px; border: 1px solid rgba(155, 89, 182, 0.15); animation: premiumBlink 1.5s infinite ease-in-out; white-space: nowrap;">' +
                                                     '            <i class="ph-fill ph-sparkle" style="font-size: 10.5px; color: #9b59b6;"></i> ' +
                                                     '            <span>Lifetime Active</span>' +
                                                     '        </span>';
                            } else if (catExpiry) {
                                var exp = new Date(catExpiry);
                                var diffMs = exp.getTime() - Date.now();
                                var diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
                                if (diffDays > 0) {
                                    pdfStatusBadgeHtml = '        <span style="display: inline-flex; align-items: center; gap: 4px; color: #2ecc71; font-size: 9.5px; font-weight: 850; background: rgba(46, 204, 113, 0.08); padding: 1.5px 6px; border-radius: 6px; border: 1px solid rgba(46, 204, 113, 0.15); white-space: nowrap;">' +
                                                         '            <i class="ph-fill ph-check-circle" style="font-size: 10.5px; color: #2ecc71;"></i> ' +
                                                         '            <span style="display: inline-block; position: relative; height: 13px; width: 70px; overflow: hidden; vertical-align: middle; line-height: 13px;">' +
                                                         '                <span style="position: absolute; left: 0; top: 0; font-weight: 850; animation: badgeAltTextFade1 3s infinite; white-space: nowrap;">Active</span>' +
                                                         '                <span style="position: absolute; left: 0; top: 0; font-weight: 850; animation: badgeAltTextFade2 3s infinite; white-space: nowrap;">' + diffDays + ' Days</span>' +
                                                         '            </span>' +
                                                         '        </span>';
                                } else {
                                    pdfStatusBadgeHtml = '        <span style="display: inline-flex; align-items: center; gap: 4px; color: #ef4444; font-size: 9.5px; font-weight: 850; background: rgba(239, 68, 68, 0.08); padding: 1.5px 6px; border-radius: 6px; border: 1px solid rgba(239, 68, 68, 0.15); white-space: nowrap;">' +
                                                         '            <i class="ph-fill ph-x-circle" style="font-size: 10.5px; color: #ef4444;"></i> ' +
                                                         '            <span>Expired</span>' +
                                                         '        </span>';
                                }
                            } else {
                                pdfStatusBadgeHtml = '        <span style="display: inline-flex; align-items: center; gap: 4px; color: #9b59b6; font-size: 9.5px; font-weight: 850; background: rgba(155, 89, 182, 0.08); padding: 1.5px 6px; border-radius: 6px; border: 1px solid rgba(155, 89, 182, 0.15); animation: premiumBlink 1.5s infinite ease-in-out; white-space: nowrap;">' +
                                                     '            <i class="ph-fill ph-sparkle" style="font-size: 10.5px; color: #9b59b6;"></i> ' +
                                                     '            <span>Lifetime Active</span>' +
                                                     '        </span>';
                            }
                        } else {
                            var price = cat.paymentAmount || (DB && DB.social && DB.social.premiumPrice) || "₹49";
                            var ytUrl = cat.youtubeUrl || (DB && DB.social && DB.social.youtube) || "";
                            var ytName = cat.youtubeName || (DB && DB.social && (DB.social.youtubeName || DB.social.youtubeChannelName)) || "YouTube";
                            var ytLogo = cat.youtubeLogo || (DB && DB.social && DB.social.youtubeChannelLogo) || "";
                            var ytBadgeHtml = "";
                            if (ytUrl && ytUrl.trim() !== "") {
                                var logoHtml = ytLogo ? '<img src="' + ytLogo + '" style="width: 10px; height: 10px; border-radius: 2px; object-fit: cover; vertical-align: middle;" onerror="this.style.display=\\\'none\\\'">' : '<i class="ph-fill ph-youtube-logo" style="font-size: 11px; color: #ffffff;"></i>';
                                ytBadgeHtml = '        <span style="display: inline-flex; align-items: center; gap: 3.5px; background: #FF0000; color: #ffffff; padding: 1.5px 6.5px; border-radius: 4px; font-weight: 900; cursor: pointer; font-size: 9px; box-shadow: 0 1.5px 4px rgba(255,0,0,0.25); white-space: nowrap; margin-left: 4px; font-family: Outfit, sans-serif;" onclick="event.stopPropagation(); window.open(\\\'' + ytUrl.replace(/'/g, "\\'") + '\\\', \\\'_blank\\\')">' +
                                              '            ' + logoHtml + ' ' + ytName +
                                              '        </span>';
                            }
                            pdfStatusBadgeHtml = '        <span style="display: inline-flex; align-items: center; gap: 3px; background: #009CFC; color: #ffffff; padding: 1.5px 6.5px; border-radius: 4px; font-weight: 900; cursor: pointer; font-size: 9px; box-shadow: 0 1.5px 4px rgba(0,156,252,0.25); white-space: nowrap; font-family: Outfit, sans-serif;" onclick="event.stopPropagation(); handleBuyNowClick(\\\'' + cat.id + '\\\')">' +
                                                 '            <i class="ph-bold ph-shopping-cart-simple" style="font-size: 9.5px;"></i> ' + price + ' / Buy Now' +
                                                 '        </span>' +
                                                 '        <span style="display: inline-flex; align-items: center; gap: 3px; background: #0077C8; color: #ffffff; padding: 1.5px 5.5px; border-radius: 4px; font-weight: 900; cursor: pointer; font-size: 9px; box-shadow: 0 1.5px 4px rgba(0,119,200,0.2); white-space: nowrap; margin-left: 4px; font-family: Outfit, sans-serif;" onclick="event.stopPropagation(); handleViewDemoClick(\\\'' + cat.id + '\\\', \\\'pdf\\\')">' +
                                                 '            <i class="ph-bold ph-eye" style="font-size: 9.5px;"></i> View Demo' +
                                                 '        </span>' +
                                                 ytBadgeHtml;
                        }
                    } else {
                        var ytUrl = cat.youtubeUrl || (DB && DB.social && DB.social.youtube) || "";
                        var ytName = cat.youtubeName || (DB && DB.social && (DB.social.youtubeName || DB.social.youtubeChannelName)) || "YouTube";
                        var ytLogo = cat.youtubeLogo || (DB && DB.social && DB.social.youtubeChannelLogo) || "";
                        var ytBadgeHtml = "";
                        if (ytUrl && ytUrl.trim() !== "") {
                            var logoHtml = ytLogo ? '<img src="' + ytLogo + '" style="width: 10px; height: 10px; border-radius: 2px; object-fit: cover; vertical-align: middle;" onerror="this.style.display=\\\'none\\\'">' : '<i class="ph-fill ph-youtube-logo" style="font-size: 11px; color: #ffffff;"></i>';
                            ytBadgeHtml = '        <span style="display: inline-flex; align-items: center; gap: 3.5px; background: #FF0000; color: #ffffff; padding: 1.5px 6.5px; border-radius: 4px; font-weight: 900; cursor: pointer; font-size: 9px; box-shadow: 0 1.5px 4px rgba(255,0,0,0.25); white-space: nowrap; margin-left: 4px; font-family: Outfit, sans-serif;" onclick="event.stopPropagation(); window.open(\\\'' + ytUrl.replace(/'/g, "\\'") + '\\\', \\\'_blank\\\')">' +
                                          '            ' + logoHtml + ' ' + ytName +
                                          '        </span>';
                        }
                        pdfStatusBadgeHtml = '        <span style="display: inline-flex; align-items: center; gap: 2.5px; color: var(--grey-text); font-size: 9.5px; font-weight: 850; white-space: nowrap;">' +
                                             '            <i class="ph-bold ph-book-open" style="color: #9b59b6; font-size: 11px;"></i> Free Practice' +
                                             '        </span>' +
                                             ytBadgeHtml;
                    }

                    if (totalFiles === 0) {
                        detailsHtml = '    <div style="display: inline-flex; align-items: center; gap: 4px; margin-top: 5px; background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.18); padding: 2px 7px; border-radius: 6px; box-sizing: border-box; flex-wrap: wrap; max-width: 100%;">' +
                                      '        <span style="display: inline-flex; align-items: center; gap: 3px; font-size: 9px; font-weight: 850; color: #ef4444; white-space: nowrap;">' +
                                      '            <i class="ph-bold ph-hourglass-simple" style="color: #ef4444; font-size: 11px;"></i> Coming Soon' +
                                      '        </span>' +
                                      '        <span style="width: 1px; height: 9px; background: rgba(120, 120, 120, 0.2); flex-shrink: 0;"></span>' +
                                      pdfStatusBadgeHtml +
                                      '    </div>';
                    } else {
                        detailsHtml = '    <div style="display: inline-flex; align-items: center; gap: 5px; margin-top: 5px; background: rgba(120, 120, 120, 0.05); border: 1px solid rgba(120, 120, 120, 0.08); padding: 2px 6px; border-radius: 6px; box-sizing: border-box; flex-wrap: wrap; max-width: 100%;">' +
                                      '        <span style="display: inline-flex; align-items: center; gap: 2.5px; font-size: 9.5px; font-weight: 850; color: var(--dark); white-space: nowrap;">' +
                                      '            <i class="ph-bold ph-file-pdf" style="color: #e74c3c; font-size: 11px;"></i> ' + totalFiles + ' PDFs' +
                                      '        </span>' +
                                      '        <span style="width: 1px; height: 9px; background: rgba(120, 120, 120, 0.2); flex-shrink: 0;"></span>' +
                                      pdfStatusBadgeHtml +
                                      '    </div>';
                    }
                }

                catHtml += '<div class="outline-item-details">';
                catHtml += '    <h4 class="outline-item-title">' + cat.name + '</h4>';
                catHtml += detailsHtml;
                catHtml += '</div>';
                catHtml += '<i class="ph ph-caret-right" style="color: var(--primary);"></i>';
                
                card.innerHTML = catHtml;
                container.appendChild(card);
                if (cat.image && cat.image.trim() !== "" && !(window.__imgCache && window.__imgCache[cat.image]) && typeof getCachedImageUrl === "function") {
                    const imgEl = card.querySelector(".outline-item-img");
                    if (imgEl) {
                        getCachedImageUrl(cat.image).then(function(src) {
                            if (src && src !== cat.image) {
                                imgEl.src = src;
                            }
                        });
                    }
                }
            });
        }

        var _activeCategoryForPayment = null;

        function isCategoryUnlocked(cat) {
            if (!cat) return true;
            if (!cat.isPaid) return true; // Free category
            if (!_studentLoggedInUser) return false; // Not logged in means locked
            
            var isLifetime = false;
            var catExpiry = null;
            var hasSpecific = false;
            if (_studentLoggedInUser.categoryDates && _studentLoggedInUser.categoryDates[cat.id]) {
                var catData = _studentLoggedInUser.categoryDates[cat.id];
                if (catData.isLifetime) {
                    isLifetime = true;
                    hasSpecific = true;
                } else if (catData.expiryDate && catData.expiryDate.trim() !== "") {
                    catExpiry = catData.expiryDate;
                    hasSpecific = true;
                }
            }
            if (!hasSpecific) {
                if (_studentLoggedInUser.expiryDate && _studentLoggedInUser.expiryDate.trim() !== "") {
                    catExpiry = _studentLoggedInUser.expiryDate;
                } else {
                    isLifetime = true;
                }
            }

            if (!isLifetime && catExpiry) {
                var exp = new Date(catExpiry);
                var diffMs = exp.getTime() - Date.now();
                var diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
                if (diffDays <= 0) {
                    return false; // Category-specific expired! Show BUY NOW.
                }
            }
            var unlocked = _studentLoggedInUser.unlockedCategoryIds || [];
            return unlocked.includes(cat.id);
        }

        function findRootCategoryForNode(nodeId, type) {
            var targetCats = (type === 'pdf' ? DB.pdfCategories : DB.testCategories) || [];
            for (var i = 0; i < targetCats.length; i++) {
                var cat = targetCats[i];
                if (cat.id === nodeId) return cat;
                if (cat.test && cat.test.id === nodeId) return cat;
                if (cat.pdf && cat.pdf.id === nodeId) return cat;
                
                if (cat.subCategories) {
                    for (var j = 0; j < cat.subCategories.length; j++) {
                        var sub = cat.subCategories[j];
                        if (sub.id === nodeId) return cat;
                        if (sub.test && sub.test.id === nodeId) return cat;
                        if (sub.pdf && sub.pdf.id === nodeId) return cat;
                        
                        if (sub.topics) {
                            for (var k = 0; k < sub.topics.length; k++) {
                                var top = sub.topics[k];
                                if (top.id === nodeId) return cat;
                                if (top.test && top.test.id === nodeId) return cat;
                                if (top.pdf && top.pdf.id === nodeId) return cat;
                            }
                        }
                    }
                }
            }
            return null;
        }

        function resetPaymentScreenshotState() {
            _uploadedScreenshotBase64 = "";
            var fileInput = document.getElementById("payFormScreenshot");
            if (fileInput) fileInput.value = "";
            
            var label = document.getElementById("paySSLabel");
            if (label) label.innerText = "Choose or Drag Screenshot Image";
            
            var previewImg = document.getElementById("paySSPreview");
            var previewContainer = document.getElementById("paySSPreviewContainer");
            var defaultContainer = document.getElementById("paySSDefaultContainer");
            if (previewImg && previewContainer && defaultContainer) {
                previewImg.src = "";
                defaultContainer.style.display = "block";
                previewContainer.style.display = "none";
            }
        }

        function showCategoryPaymentScreen(cat) {
            _activeCategoryForPayment = cat;
            resetPaymentScreenshotState();
            
            // Set dynamic Selected Plan Badge
            var badgeTextEl = document.getElementById("pay-plan-badge-text");
            if (badgeTextEl) {
                badgeTextEl.innerText = "Selected: Unlock " + cat.name;
            }
            
            // Set screen title and description
            document.getElementById("pay-screen-title").innerText = "Unlock " + cat.name;
            document.getElementById("pay-screen-desc").innerText = "Gain full access to " + cat.name + " and all its tests, PDFs, and learning materials today!";
            
            // Pricing elements
            var price = cat.paymentAmount || "₹99";
            var validity = cat.paymentValidityDays || "3 Months";
            document.getElementById("pay-amount").innerText = price;
            document.getElementById("pay-duration").innerText = " / " + validity;
            document.getElementById("pay-validity-text").innerText = "VALID FOR " + validity.toUpperCase();
            
            // Scan header text
            document.getElementById("pay-scan-qr-header").innerText = "Scan QR Code to Pay " + price;
            
            // QR Image
            var qrUrl = cat.paymentQr || (DB && DB.social && DB.social.paymentQr) || 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=payee_taiyariya';
            document.getElementById("displayPayQrImage").src = qrUrl;
            
            // Contact links
            var contactUrl = cat.paymentUrl || (DB && DB.social && DB.social.paymentContactLink) || 'mailto:hi@taiyariya.in';
            var qrDirectLinkEl = document.getElementById("pay-qr-direct-link");
            if (qrDirectLinkEl) {
                qrDirectLinkEl.href = contactUrl;
                if (contactUrl.indexOf("upi://") === 0) {
                    qrDirectLinkEl.target = "_self";
                    qrDirectLinkEl.innerHTML = '<i class="ph-bold ph-lightning" style="font-size: 15px; color: #FFFFFF;"></i> Pay via UPI App';
                } else {
                    qrDirectLinkEl.target = "_blank";
                    qrDirectLinkEl.innerHTML = '<i class="ph-bold ph-lightning" style="font-size: 15px;"></i> Tap to Pay / Support Bot';
                }
            }

            var contactLinkEl = document.getElementById("pay-contact-link-element");
            if (contactLinkEl) {
                contactLinkEl.innerHTML = '<i class="ph-bold ph-chats" style="font-size: 17px;"></i> Contact Helpdesk';
            }

            // YouTube channel button on category payment screen
            var catYtUrl = cat.youtubeUrl || (DB && DB.social && DB.social.youtube) || "";
            var catYtName = cat.youtubeName || (DB && DB.social && (DB.social.youtubeName || DB.social.youtubeChannelName)) || "Watch on YouTube";
            var catYtLogo = cat.youtubeLogo || (DB && DB.social && DB.social.youtubeChannelLogo) || "";
            var catYtLinkEl = document.getElementById("pay-youtube-link-element");
            if (catYtLinkEl) {
                if (catYtUrl && catYtUrl.trim() !== "") {
                    catYtLinkEl.href = catYtUrl;
                    catYtLinkEl.style.display = "inline-flex";
                    var ytIconHtml = catYtLogo ? '<img src="' + catYtLogo + '" style="width: 18px; height: 18px; border-radius: 4px; object-fit: cover; vertical-align: middle;" onerror="this.style.display=\\\'none\\\'">' : '<i class="ph-fill ph-youtube-logo" style="font-size: 18px; color: #FFFFFF;"></i>';
                    catYtLinkEl.innerHTML = ytIconHtml + ' <span>' + catYtName + '</span>';
                } else {
                    catYtLinkEl.style.display = "none";
                }
            }
            
            // Benefits list
            var benefitsText = cat.paymentBenefits || "Access to all Mock Tests under this category, Access to Premium PDFs, Detailed Option Analyses, Unlimited Attempts";
            var benefitsListEl = document.getElementById("pay-benefits-list");
            if (benefitsListEl) {
                benefitsListEl.innerHTML = benefitsText.split(",")
                    .map(function(b) { return b.trim(); })
                    .filter(Boolean)
                    .map(function(b) {
                        return '<li style="display: flex; align-items: flex-start; gap: 10px; font-size: 13px; font-weight: 700; color: #334155;">' +
                               '<i class="ph-bold ph-check-circle" style="color: #22c55e; font-size: 17px; margin-top: 1px;"></i> <span>' + b + '</span>' +
                               '</li>';
                    }).join("");
            }
            
            // Prefill info
            if (_studentLoggedInUser) {
                document.getElementById("payFormName").value = _studentLoggedInUser.name || "";
                document.getElementById("payFormEmail").value = _studentLoggedInUser.emailOrMobile || "";
                document.getElementById("payFormPhone").value = _studentLoggedInUser.phoneNo || _studentLoggedInUser.emailOrMobile || "";
            } else {
                document.getElementById("payFormName").value = "";
                document.getElementById("payFormEmail").value = "";
                document.getElementById("payFormPhone").value = "";
            }
            document.getElementById("payFormUTR").value = "";
            var msgElCategory = document.getElementById("payFormMessage");
            if (msgElCategory) msgElCategory.value = "";
            
            try { ensurePaymentQrCached(); } catch(e){}
            if (typeof goToPayStep === "function") {
                goToPayStep(1);
            }
            navigateToScreen("scr-pay", "Unlock Category");
            if (typeof updateCooldownUI === "function" && typeof getPaymentCooldownStorageKey === "function") {
                updateCooldownUI("btnSendPaymentEmail", getPaymentCooldownStorageKey());
            }
        }

        function showGeneralPremiumPaymentScreen() {
            _activeCategoryForPayment = null;
            resetPaymentScreenshotState();
            
            // Set dynamic Selected Plan Badge
            var badgeTextEl = document.getElementById("pay-plan-badge-text");
            if (badgeTextEl) {
                badgeTextEl.innerText = "Selected: General Premium Membership";
            }
            
            // Set screen title and description
            document.getElementById("pay-screen-title").innerText = "Upgrade to Premium";
            document.getElementById("pay-screen-desc").innerText = "Gain full access to all Mock Exams, past papers, future series and worksheets today!";
            
            // Pricing elements
            var price = (DB && DB.social && DB.social.premiumPrice) || "₹45";
            var validity = (DB && DB.social && DB.social.premiumDurationText) || "3 Months";
            var validityText = (DB && DB.social && DB.social.premiumValidityText) || "VALID FOR 90 DAYS";
            document.getElementById("pay-amount").innerText = price;
            document.getElementById("pay-duration").innerText = " / " + validity;
            document.getElementById("pay-validity-text").innerText = validityText;
            
            // Scan header text
            document.getElementById("pay-scan-qr-header").innerText = "Scan QR Code to Pay " + price;
            
            // QR Image
            var qrUrl = (DB && DB.social && DB.social.paymentQr) || 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=payee_taiyariya';
            document.getElementById("displayPayQrImage").src = qrUrl;
            
            // Contact links
            var contactUrl = (DB && DB.social && DB.social.paymentContactLink) || 'mailto:hi@taiyariya.in';
            var qrDirectLinkEl = document.getElementById("pay-qr-direct-link");
            if (qrDirectLinkEl) {
                qrDirectLinkEl.href = contactUrl;
                if (contactUrl.indexOf("upi://") === 0) {
                    qrDirectLinkEl.target = "_self";
                    qrDirectLinkEl.innerHTML = '<i class="ph-bold ph-lightning" style="font-size: 15px; color: #FFFFFF;"></i> Pay via UPI App';
                } else {
                    qrDirectLinkEl.target = "_blank";
                    qrDirectLinkEl.innerHTML = '<i class="ph-bold ph-lightning" style="font-size: 15px;"></i> Tap to Pay / Support Bot';
                }
            }

            var contactLinkEl = document.getElementById("pay-contact-link-element");
            if (contactLinkEl) {
                contactLinkEl.innerHTML = '<i class="ph-bold ph-chats" style="font-size: 17px;"></i> Contact Helpdesk';
            }

            // YouTube channel button on global payment screen
            var globalYtUrl = (DB && DB.social && DB.social.youtube) || "";
            var globalYtName = (DB && DB.social && (DB.social.youtubeName || DB.social.youtubeChannelName)) || "Watch on YouTube";
            var globalYtLogo = (DB && DB.social && DB.social.youtubeChannelLogo) || "";
            var globalYtLinkEl = document.getElementById("pay-youtube-link-element");
            if (globalYtLinkEl) {
                if (globalYtUrl && globalYtUrl.trim() !== "") {
                    globalYtLinkEl.href = globalYtUrl;
                    globalYtLinkEl.style.display = "inline-flex";
                    var ytIconHtml = globalYtLogo ? '<img src="' + globalYtLogo + '" style="width: 18px; height: 18px; border-radius: 4px; object-fit: cover; vertical-align: middle;" onerror="this.style.display=\\\'none\\\'">' : '<i class="ph-fill ph-youtube-logo" style="font-size: 18px; color: #FFFFFF;"></i>';
                    globalYtLinkEl.innerHTML = ytIconHtml + ' <span>' + globalYtName + '</span>';
                } else {
                    globalYtLinkEl.style.display = "none";
                }
            }
            
            // Benefits list
            var benefitsText = (DB && DB.social && DB.social.premiumBenefitsText) || "Access to Past Tests, Access to Present Tests, Access to Future Tests, Unlimited Test Attempts";
            var benefitsListEl = document.getElementById("pay-benefits-list");
            if (benefitsListEl) {
                benefitsListEl.innerHTML = benefitsText.split(",")
                    .map(function(b) { return b.trim(); })
                    .filter(Boolean)
                    .map(function(b) {
                        return '<li style="display: flex; align-items: flex-start; gap: 10px; font-size: 13px; font-weight: 700; color: #334155;">' +
                               '<i class="ph-bold ph-check-circle" style="color: #22c55e; font-size: 17px; margin-top: 1px;"></i> <span>' + b + '</span>' +
                               '</li>';
                    }).join("");
            }
            
            // Prefill info
            if (_studentLoggedInUser) {
                document.getElementById("payFormName").value = _studentLoggedInUser.name || "";
                document.getElementById("payFormEmail").value = _studentLoggedInUser.emailOrMobile || "";
                document.getElementById("payFormPhone").value = _studentLoggedInUser.phoneNo || _studentLoggedInUser.emailOrMobile || "";
            } else {
                document.getElementById("payFormName").value = "";
                document.getElementById("payFormEmail").value = "";
                document.getElementById("payFormPhone").value = "";
            }
            document.getElementById("payFormUTR").value = "";
            var msgElGen = document.getElementById("payFormMessage");
            if (msgElGen) msgElGen.value = "";

            try { ensurePaymentQrCached(); } catch(e){}
            if (typeof goToPayStep === "function") {
                goToPayStep(1);
            }
            navigateToScreen("scr-pay", "Unlock Premium Plan");
            if (typeof updateCooldownUI === "function" && typeof getPaymentCooldownStorageKey === "function") {
                updateCooldownUI("btnSendPaymentEmail", getPaymentCooldownStorageKey());
            }
        }
        window.showGeneralPremiumPaymentScreen = showGeneralPremiumPaymentScreen;

        window.handleContactHelpdeskClick = function() {
            var cat = _activeCategoryForPayment;
            var isGeneral = !cat;
            var catName = isGeneral ? "General Premium Membership" : cat.name;
            
            var amountEl = document.getElementById("pay-amount");
            var amountVal = amountEl ? amountEl.innerText.trim() : "";
            if (!amountVal) {
                amountVal = cat ? (cat.paymentAmount || "₹99") : ((DB && DB.social && DB.social.premiumPrice) || "₹45");
            }

            // Set detected category and price
            var detCat = document.getElementById("helpdeskDetectedCategory");
            var detAmt = document.getElementById("helpdeskDetectedAmount");
            if (detCat) detCat.innerText = catName;
            if (detAmt) detAmt.innerText = amountVal;

            // Pre-fill input values if already saved or logged in
            var nameInput = document.getElementById("payFormName");
            var emailInput = document.getElementById("payFormEmail");
            var phoneInput = document.getElementById("payFormPhone");

            var currentName = (nameInput ? nameInput.value.trim() : "") || (_studentLoggedInUser ? (_studentLoggedInUser.name || "") : "");
            var currentEmail = (emailInput ? emailInput.value.trim() : "") || (_studentLoggedInUser ? (_studentLoggedInUser.emailOrMobile || "") : "");
            var currentPhone = (phoneInput ? phoneInput.value.trim() : "") || (_studentLoggedInUser ? (_studentLoggedInUser.phoneNo || "") : "");

            var modalName = document.getElementById("helpdeskInputName");
            var modalEmail = document.getElementById("helpdeskInputEmail");
            var modalPhone = document.getElementById("helpdeskInputPhone");
            var modalError = document.getElementById("helpdeskModalError");

            if (modalName) modalName.value = currentName;
            if (modalEmail) modalEmail.value = currentEmail;
            if (modalPhone) modalPhone.value = currentPhone;
            if (modalError) {
                modalError.innerText = "";
                modalError.style.display = "none";
            }

            var overlay = document.getElementById("helpdeskModalOverlay");
            if (overlay) {
                overlay.style.display = "flex";
            }
        };

        window.closeHelpdeskModal = function() {
            var overlay = document.getElementById("helpdeskModalOverlay");
            if (overlay) {
                overlay.style.display = "none";
            }
        };

        window.handleTriggerShowLegalModal = function(type, pushToHistory) {
            var titleEl = document.getElementById("legalPolicyModalTitle");
            var contentEl = document.getElementById("legalPolicyModalContent");
            var overlay = document.getElementById("legalPolicyModalOverlay");

            if (!overlay || !titleEl || !contentEl) return;

            var title = "Legal Policy";
            var content = "";

            if (type === "privacy") {
                title = "Privacy Policy";
                content = \`
                    <div style="font-family: sans-serif; line-height: 1.6;">
                        <p style="margin-top: 0;">Welcome to <strong>Taiyariya</strong>. We prioritize user trust and are committed to protecting the privacy of our students and portal visitors.</p>
                        <h4 style="margin: 14px 0 4px 0; color: var(--dark); font-weight: 800; font-size: 13px;">1. Information We Collect</h4>
                        <p>We collect student emails and mobile numbers supplied during registration to facilitate secure access to premium mock examination papers and practice test modules.</p>
                        
                        <h4 style="margin: 14px 0 4px 0; color: var(--dark); font-weight: 800; font-size: 13px;">2. Google AdSense & Cookies</h4>
                        <p>We display advertising units provided by <strong>Google AdSense</strong>:</p>
                        <ul>
                            <li style="margin-bottom: 4px;">Google uses cookies to serve ads on <strong>https://taiyariya.in</strong> based on user visits.</li>
                            <li style="margin-bottom: 4px;">Users can opt out of personalized ads by visiting Google's Ads Settings.</li>
                        </ul>

                        <h4 style="margin: 14px 0 4px 0; color: var(--dark); font-weight: 800; font-size: 13px;">3. Scorecard & Performance Analytics</h4>
                        <p>Your practice scores, correct/incorrect responses, and obtained marks are stored securely to generate performance scorecards and leaderboard ranking lists.</p>
                    </div>
                \`;
            } else if (type === "terms") {
                title = "Terms & Conditions";
                content = \`
                    <div style="font-family: sans-serif; line-height: 1.6;">
                        <p style="margin-top: 0;">These terms and conditions outline the usage rules for the <strong>Taiyariya</strong> platform at <a href="https://taiyariya.in" target="_blank" style="color: #009CFC; text-decoration: none; font-weight: 700;">https://taiyariya.in</a>.</p>
                        
                        <h4 style="margin: 14px 0 4px 0; color: var(--dark); font-weight: 800; font-size: 13px;">1. Account Security & Concurrent Limits</h4>
                        <p>Premium MCQ test tracks are restricted to registered aspirants. Sharing or transferring credentials is prohibited. The system tracks active concurrent sessions and automatically signs out previous sessions upon fresh login detections.</p>

                        <h4 style="margin: 14px 0 4px 0; color: var(--dark); font-weight: 800; font-size: 13px;">2. Intellectual Property Notice</h4>
                        <p>All online mock tests, question databases, and bilingual explanations compiled on Taiyariya are proprietary assets. You are strictly prohibited from reselling, scraping, distributing, or republishing our materials on external platforms.</p>
                    </div>
                \`;
            } else if (type === "disclaimer") {
                title = "Legal Disclaimer";
                content = \`
                    <div style="font-family: sans-serif; line-height: 1.6;">
                        <p style="margin-top: 0; background: rgba(239, 68, 68, 0.05); padding: 12px; border: 1.5px solid rgba(239, 68, 68, 0.15); border-radius: 12px; font-weight: 700; color: #ef4444;">
                            <strong>STRICT NO-GOVERNMENT AFFILIATION DECLARATION:</strong> Taiyariya is an <strong>independent, privately operated educational study platform</strong>. We are <strong>NOT affiliated, associated, or officially connected</strong> with any central or state government body, public service commission, recruitment board, or official exam department (such as SSC, UPSC, RRB, Banking boards, etc.).
                        </p>
                        
                        <h4 style="margin: 14px 0 4px 0; color: var(--dark); font-weight: 800; font-size: 13px;">1. Practice Material & Evaluation</h4>
                        <p>All test series, worksheets, and scorecards are prepared for self-study practice and educational evaluations. While we maintain high standards, we offer no warranties regarding absolute correctness or exam alignment.</p>
                    </div>
                \`;
            } else if (type === "copyright") {
                title = "Copyright & Original Content Policy";
                content = \`
                    <div style="font-family: sans-serif; line-height: 1.6;">
                        <p style="margin-top: 0; background: rgba(37, 211, 102, 0.05); padding: 12px; border: 1.5px solid rgba(37, 211, 102, 0.15); border-radius: 12px; font-weight: 700; color: #15803d;">
                            <strong>100% ORIGINAL CONTENT PLEDGE:</strong> All mock test series, practice questions, bilingual step-by-step solutions, and reference materials on Taiyariya are originally created and independently compiled by our dedicated in-house author team.
                        </p>
                        
                        <h4 style="margin: 14px 0 4px 0; color: var(--dark); font-weight: 800; font-size: 13px;">1. Original Authorship & Curation</h4>
                        <p>Every single MCQ and bilingual explanation on our portal is carefully designed from scratch to aid student mock practice. We do not copy, scrape, or duplicate content from other online platforms or books, ensuring supreme educational standards.</p>
                        
                        <h4 style="margin: 14px 0 4px 0; color: var(--dark); font-weight: 800; font-size: 13px;">2. Protection of Original Materials</h4>
                        <p>Unauthorized reproduction, distribution, reselling, or commercial use of our originally curated tests is strictly prohibited and subject to intellectual property protection laws.</p>
                    </div>
                \`;
            }

            titleEl.innerText = title;
            contentEl.innerHTML = content;
            overlay.style.display = "flex";

            if (pushToHistory !== false) {
                var legalSlug = "privacy-policy";
                if (type === "terms") legalSlug = "terms-and-conditions";
                else if (type === "disclaimer") legalSlug = "legal-disclaimer";
                else if (type === "copyright") legalSlug = "copyright-policy";
                updateHistoryAndUrl(null, null, null, legalSlug);
            }
        };

        window.closeLegalPolicyModal = function() {
            var overlay = document.getElementById("legalPolicyModalOverlay");
            if (overlay) {
                overlay.style.display = "none";
            }
            if (!_isHandlingPopState) {
                var currentPath = (window.location.pathname || '').toLowerCase();
                if (currentPath.indexOf('privacy-policy') !== -1 || currentPath.indexOf('terms-and-conditions') !== -1 || currentPath.indexOf('legal-disclaimer') !== -1 || currentPath.indexOf('copyright-policy') !== -1) {
                    updateHistoryAndUrl(null, null, null, 'account');
                }
            }
        };

        window.submitHelpdeskModal = function() {
            var modalName = document.getElementById("helpdeskInputName");
            var modalEmail = document.getElementById("helpdeskInputEmail");
            var modalPhone = document.getElementById("helpdeskInputPhone");
            var modalError = document.getElementById("helpdeskModalError");

            var name = modalName ? modalName.value.trim() : "";
            var email = modalEmail ? modalEmail.value.trim() : "";
            var phone = modalPhone ? modalPhone.value.trim() : "";

            if (!name || !email || !phone) {
                if (modalError) {
                    modalError.innerText = "All fields marked with * are required!";
                    modalError.style.display = "block";
                }
                return;
            }

            // Sync back to payment form inputs so they are preserved
            var nameInput = document.getElementById("payFormName");
            var emailInput = document.getElementById("payFormEmail");
            var phoneInput = document.getElementById("payFormPhone");

            if (nameInput) nameInput.value = name;
            if (emailInput) emailInput.value = email;
            if (phoneInput) phoneInput.value = phone;

            var cat = _activeCategoryForPayment;
            var isGeneral = !cat;
            var catName = isGeneral ? "General Premium Membership" : cat.name;
            var amountEl = document.getElementById("pay-amount");
            var amountVal = amountEl ? amountEl.innerText.trim() : "";
            if (!amountVal) {
                amountVal = cat ? (cat.paymentAmount || "₹99") : ((DB && DB.social && DB.social.premiumPrice) || "₹45");
            }

            var categoryPageLink = isGeneral ? (window.location.origin + "/account") : (window.location.origin + "/test/" + toSlug(cat.name));
            var helpdeskBaseUrl = (cat && cat.paymentHelpdeskUrl) || (DB && DB.social && DB.social.paymentContactLink) || 'mailto:hi@taiyariya.in';
            
            var messageText = "I need help with payment for Category: " + catName + " (" + categoryPageLink + ")\\n\\n" +
                              "My Details:\\n" +
                              "• Name: " + name + "\\n" +
                              "• Email: " + email + "\\n" +
                              "• Phone: " + phone + "\\n" +
                              "• Amount Paid: " + amountVal + "\\n\\n" +
                              "premium activate kar dijiye.";
            
            var finalHelpdeskUrl = helpdeskBaseUrl;
            if (helpdeskBaseUrl.indexOf("wa.me") !== -1 || helpdeskBaseUrl.indexOf("whatsapp.com") !== -1) {
                var separator = helpdeskBaseUrl.indexOf("?") !== -1 ? "&" : "?";
                finalHelpdeskUrl = helpdeskBaseUrl + separator + "text=" + encodeURIComponent(messageText);
            } else if (helpdeskBaseUrl.indexOf("t.me") !== -1 || helpdeskBaseUrl.indexOf("telegram.me") !== -1) {
                if (helpdeskBaseUrl.indexOf("?") !== -1) {
                    finalHelpdeskUrl = helpdeskBaseUrl + "&text=" + encodeURIComponent(messageText);
                } else {
                    finalHelpdeskUrl = helpdeskBaseUrl + "?text=" + encodeURIComponent(messageText);
                }
            } else {
                var separator = helpdeskBaseUrl.indexOf("?") !== -1 ? "&" : "?";
                finalHelpdeskUrl = helpdeskBaseUrl + separator + "text=" + encodeURIComponent(messageText);
            }

            window.closeHelpdeskModal();

            showCustomAlert(
                "Open Support Chat", 
                "We have created your payment activation request message.<br/><br/>Click <b>OK</b> to open support chat. The message will be pre-filled in your chatbox - just hit send to activate your premium!", 
                function() {
                    window.open(finalHelpdeskUrl, "_blank");
                }
            );
        };

        function handleSelectCategoryNode(cat, type) {
            // Check category lock first
            if (cat.isPaid && !isCategoryUnlocked(cat)) {
                if (_demoCategories[cat.id]) {
                    // Bypass category block for entering!
                } else {
                    showCategoryPaymentScreen(cat);
                    return;
                }
            }

            _activeCategoryName = cat.name;
            _activeSubCategoryName = cat.name;
            _activeTopicName = (cat.test && cat.test.title) || (cat.pdf && cat.pdf.title) || cat.name;

            _activeCategoryNodeForUrl = cat;
            _activeSubcategoryNodeForUrl = null;
            _activeTopicNodeForUrl = null;
            updateHistoryAndUrl(cat, null, null);

            // Increment attempt count for this category when clicked by 1 (so it moves from 1.101k to 1.102k immediately)
            if (type === 'test') {
                var currentCount = parseInt(localStorage.getItem("_cat_attempts_" + cat.id) || "0", 10);
                if (!currentCount) {
                    var defaultBase = 1100 + ((cat.name && cat.name.charCodeAt(0)) || 0) * 13 + ((cat.id && cat.id.charCodeAt(0)) || 0) * 7;
                    currentCount = defaultBase;
                }
                localStorage.setItem("_cat_attempts_" + cat.id, (currentCount + 1).toString());
                renderCategorySelectionScreen(type); // Re-render to show updated count immediately!
            }

            const hasSubcategories = cat.subCategories && cat.subCategories.length > 0;
            const hasResource = (type === 'test' && cat.test) || (type === 'pdf' && cat.pdf);

            if (hasResource && !hasSubcategories) {
                // If it is scheduled in the future, don't let it open
                if (cat.test && !isItemScheduledVisible(cat.test)) {
                    alert("This test is scheduled to start at: " + new Date(cat.test.scheduledAt).toLocaleString());
                    return;
                }
                if (cat.pdf && !isItemScheduledVisible(cat.pdf)) {
                    alert("This PDF is scheduled to release at: " + new Date(cat.pdf.scheduledAt).toLocaleString());
                    return;
                }
                handleVerifyDirectMeta(cat, type);
                return;
            }

            // Else open nested subcategories screen
            const container = document.getElementById("subcategoryGridArea");
            container.innerHTML = "";
            document.getElementById("subcategorySelectionTitle").innerText = cat.name;

            navigateToScreen("scr-subcat", cat.name);

            // Prepend a special direct launch card if direct content is attached
            if (hasResource) {
                const directCard = document.createElement("div");
                directCard.className = "outline-item-card";
                directCard.style.border = "2px dashed var(--primary)";
                directCard.style.background = "rgba(255, 107, 53, 0.05)";
                
                const label = type === 'test' ? "\ud83c\udfc6 Launch Category Exam" : "\ud83d\udcc1 View Category PDF Document";
                const desc = type === 'test' ? "Primary category-level test assessment" : "Primary category-level study manual";
                const icon = type === 'test' ? "ph ph-sparkle" : "ph ph-file-pdf";
                
                var isDemoMode = _demoCategories[cat.id];
                var isFreeTest = false;
                if (isDemoMode) {
                    if (type === 'test' && cat.test && isDemoFreeTest(cat.test.id, cat)) {
                        isFreeTest = true;
                    } else if (type === 'pdf' && cat.pdf && isDemoFreePdf(cat.pdf.id, cat)) {
                        isFreeTest = true;
                    }
                }

                var isUploaded = (type === 'test') ? isTestUploaded(cat.test) : isPdfUploaded(cat.pdf);

                directCard.onclick = () => {
                    if (!isUploaded) {
                        showCustomAlert("Coming Soon", "Yeh content abhi upload nahi hai. Coming Soon!");
                        return;
                    }
                    if (isDemoMode && !isFreeTest) {
                        showCategoryPaymentScreen(cat);
                        return;
                    }
                    if (cat.test && !isItemScheduledVisible(cat.test)) {
                        alert("This test is scheduled to start at: " + new Date(cat.test.scheduledAt).toLocaleString());
                        return;
                    }
                    if (cat.pdf && !isItemScheduledVisible(cat.pdf)) {
                        alert("This PDF is scheduled to release at: " + new Date(cat.pdf.scheduledAt).toLocaleString());
                        return;
                    }
                    handleVerifyDirectMeta(cat, type);
                };
                
                var rightIconHtml = '<i class="ph ph-play" style="color: var(--primary);"></i>';
                var badgeLabelHtml = '<h4 class="outline-item-title" style="color: var(--primary); font-weight:800;">' + label + '</h4>';
                if (!isUploaded) {
                    badgeLabelHtml = '<h4 class="outline-item-title" style="color: var(--primary); font-weight:800; display: flex; align-items: center; gap: 6px;">' +
                                     '    <span style="display: inline-flex; align-items: center; gap: 4px; color: #ef4444; font-size: 9.5px; font-weight: 850; background: rgba(239, 68, 68, 0.08); padding: 1.5px 6px; border-radius: 6px; border: 1px solid rgba(239, 68, 68, 0.2); font-family: Outfit, sans-serif;"><i class="ph-bold ph-hourglass-simple" style="font-size: 10px;"></i> Coming Soon</span>' +
                                     '    ' + label +
                                     '</h4>';
                } else if (isDemoMode) {
                    if (isFreeTest) {
                        badgeLabelHtml = '<h4 class="outline-item-title" style="color: var(--primary); font-weight:800; display: flex; align-items: center; gap: 6px;">' +
                                         '    <span style="display: inline-flex; align-items: center; gap: 4px; color: #2ecc71; font-size: 9.5px; font-weight: 850; background: rgba(46, 204, 113, 0.08); padding: 1.5px 6px; border-radius: 6px; border: 1px solid rgba(46, 204, 113, 0.15); font-family: Outfit, sans-serif;"><i class="ph-bold ph-gift" style="font-size: 10px;"></i> Free Demo</span>' +
                                         '    ' + label +
                                         '</h4>';
                    } else {
                        rightIconHtml = '<i class="ph-fill ph-lock" style="color: #ef4444; font-size: 18px;"></i>';
                    }
                }

                directCard.innerHTML = 
                    '<div class="outline-item-img" style="display:flex;align-items:center;justify-content:center; background: var(--primary); color: white;">' +
                    '    <i class="' + icon + '" style="font-size:24px;"></i>' +
                    '</div>' +
                    '<div class="outline-item-details">' +
                    '    ' + badgeLabelHtml +
                    '    <p class="outline-item-subtitle">' + desc + '</p>' +
                    '</div>' +
                    rightIconHtml;
                container.appendChild(directCard);
            }

            if (!cat.subCategories || cat.subCategories.length === 0) {
                if (!hasResource) {
                    container.innerHTML = '<div class="coming-soon-box"><i class="ph-fill ph-clock-countdown" style="font-size: 26px; color: #ef4444; margin-bottom: 6px; display: block;"></i>Coming Soon</div>';
                }
                return;
            }

            const visibleSubs = cat.subCategories.filter(isItemVisibleToStudent);
            if (visibleSubs.length === 0) {
                if (!hasResource) {
                    container.innerHTML = '<div class="coming-soon-box"><i class="ph-fill ph-clock-countdown" style="font-size: 26px; color: #ef4444; margin-bottom: 6px; display: block;"></i>Coming Soon</div>';
                }
                return;
            }

            visibleSubs.forEach((sub) => {
                var isDemoMode = _demoCategories[cat.id];
                var isFreeTestSub = false;
                if (isDemoMode) {
                    if (type === 'test' && subHasDemoFreeTest(sub, cat)) {
                        isFreeTestSub = true;
                    } else if (type === 'pdf' && subHasDemoFreePdf(sub, cat)) {
                        isFreeTestSub = true;
                    }
                }

                const card = document.createElement("div");
                card.className = "outline-item-card";
                card.onclick = () => handleSelectSubcategoryNode(sub, type);
                var initSrc = (window.__imgCache && window.__imgCache[sub.image]) || sub.image || "";
                
                var subHtml = "";
                if (sub.image && sub.image.trim() !== "") {
                    subHtml += '<img class="outline-item-img" src="' + initSrc + '" data-original-src="' + sub.image + '">';
                } else {
                    var defaultIcon = type === 'test' ? 'ph ph-folder-simple' : 'ph ph-file-pdf';
                    subHtml += '<div class="outline-item-img" style="display:flex;align-items:center;justify-content:center;color: var(--primary);"><i class="' + defaultIcon + '" style="font-size:24px;"></i></div>';
                }

                // Compute stats for subcategory
                var detailsHtml = "";
                var stats = calculateNodeStats(sub, type);
                if (type === 'test') {
                    var totalTests = stats.totalTests;
                    var totalHrsFormatted = stats.totalHrsFormatted;
                    var progressText = stats.attemptedTests + "/" + totalTests + " Done";
                    var progressColor = (stats.attemptedTests === totalTests && totalTests > 0) ? "#2ecc71" : (stats.attemptedTests > 0 ? "#3498db" : "var(--grey-text)");
                    var progressIcon = (stats.attemptedTests === totalTests && totalTests > 0) ? "ph-fill ph-check-circle" : "ph-bold ph-circle-dashed";

                    if (totalTests === 0) {
                        detailsHtml = '    <div style="display: inline-flex; align-items: center; gap: 4px; margin-top: 5px; background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.18); padding: 2px 7px; border-radius: 6px; box-sizing: border-box;">' +
                                      '        <span style="display: inline-flex; align-items: center; gap: 3px; font-size: 9px; font-weight: 850; color: #ef4444; white-space: nowrap;">' +
                                      '            <i class="ph-bold ph-hourglass-simple" style="color: #ef4444; font-size: 11px;"></i> Coming Soon' +
                                      '        </span>' +
                                      '    </div>';
                    } else {
                        detailsHtml = '    <div style="display: inline-flex; align-items: center; gap: 5px; margin-top: 5px; background: rgba(120, 120, 120, 0.05); border: 1px solid rgba(120, 120, 120, 0.08); padding: 2px 6px; border-radius: 6px; box-sizing: border-box; flex-wrap: nowrap; max-width: 100%;">' +
                                      '        <span style="display: inline-flex; align-items: center; gap: 2px; font-size: 9px; font-weight: 850; color: var(--dark); white-space: nowrap;">' +
                                      '            <i class="ph-bold ph-clipboard-text" style="color: #009CFC; font-size: 11px;"></i> ' + totalTests + ' ' + (totalTests === 1 ? 'Test' : 'Tests') +
                                      '        </span>' +
                                      '        <span style="width: 1px; height: 9px; background: rgba(120, 120, 120, 0.15); flex-shrink: 0;"></span>' +
                                      '        <span style="display: inline-flex; align-items: center; gap: 2px; font-size: 9px; font-weight: 850; color: var(--dark); white-space: nowrap;">' +
                                      '            <i class="ph-bold ph-clock" style="color: #0077C8; font-size: 11px;"></i> ' + totalHrsFormatted +
                                      '        </span>' +
                                      '        <span style="width: 1px; height: 9px; background: rgba(120, 120, 120, 0.15); flex-shrink: 0;"></span>' +
                                      '        <span style="display: inline-flex; align-items: center; gap: 2.5px; font-size: 9px; font-weight: 850; color: ' + progressColor + '; white-space: nowrap;">' +
                                      '            <i class="' + progressIcon + '" style="font-size: 11px;"></i> ' + progressText +
                                      '        </span>' +
                                      '    </div>';
                    }
                } else {
                    var totalFiles = stats.totalFiles;
                    var progressText = stats.readFiles + "/" + totalFiles + " Read";
                    var progressColor = (stats.readFiles === totalFiles && totalFiles > 0) ? "#2ecc71" : (stats.readFiles > 0 ? "#3498db" : "var(--grey-text)");
                    var progressIcon = (stats.readFiles === totalFiles && totalFiles > 0) ? "ph-fill ph-check-circle" : "ph-bold ph-circle-dashed";

                    if (totalFiles === 0) {
                        detailsHtml = '    <div style="display: inline-flex; align-items: center; gap: 4px; margin-top: 5px; background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.18); padding: 2px 7px; border-radius: 6px; box-sizing: border-box;">' +
                                      '        <span style="display: inline-flex; align-items: center; gap: 3px; font-size: 9px; font-weight: 850; color: #ef4444; white-space: nowrap;">' +
                                      '            <i class="ph-bold ph-hourglass-simple" style="color: #ef4444; font-size: 11px;"></i> Coming Soon' +
                                      '        </span>' +
                                      '    </div>';
                    } else {
                        detailsHtml = '    <div style="display: inline-flex; align-items: center; gap: 5px; margin-top: 5px; background: rgba(120, 120, 120, 0.05); border: 1px solid rgba(120, 120, 120, 0.08); padding: 2px 6px; border-radius: 6px; box-sizing: border-box; flex-wrap: nowrap; max-width: 100%;">' +
                                      '        <span style="display: inline-flex; align-items: center; gap: 2px; font-size: 9px; font-weight: 850; color: var(--dark); white-space: nowrap;">' +
                                      '            <i class="ph-bold ph-file-pdf" style="color: #e74c3c; font-size: 11px;"></i> ' + totalFiles + ' ' + (totalFiles === 1 ? 'PDF' : 'PDFs') +
                                      '        </span>' +
                                      '        <span style="width: 1px; height: 9px; background: rgba(120, 120, 120, 0.15); flex-shrink: 0;"></span>' +
                                      '        <span style="display: inline-flex; align-items: center; gap: 2.5px; font-size: 9px; font-weight: 850; color: ' + progressColor + '; white-space: nowrap;">' +
                                      '            <i class="' + progressIcon + '" style="font-size: 11px;"></i> ' + progressText +
                                      '        </span>' +
                                      '    </div>';
                    }
                }

                var labelHtml = '<h4 class="outline-item-title">' + sub.name + '</h4>';
                var rightIconHtml = '<i class="ph ph-caret-right" style="color: var(--primary);"></i>';
                if (isDemoMode) {
                    if (isFreeTestSub) {
                        labelHtml = '<h4 class="outline-item-title" style="display: flex; align-items: center; gap: 6px;">' +
                                    '    <span style="display: inline-flex; align-items: center; gap: 4px; color: #2ecc71; font-size: 9px; font-weight: 850; background: rgba(46, 204, 113, 0.08); padding: 1.5px 6px; border-radius: 6px; border: 1px solid rgba(46, 204, 113, 0.15); font-family: Outfit, sans-serif;"><i class="ph-bold ph-gift" style="font-size: 10px;"></i> Free Demo</span>' +
                                    '    ' + sub.name +
                                    '</h4>';
                    } else {
                        rightIconHtml = '<i class="ph-fill ph-lock" style="color: #ef4444; font-size: 18px; margin-right: 4px;"></i>';
                    }
                }

                subHtml += '<div class="outline-item-details">';
                subHtml += '    ' + labelHtml;
                subHtml += detailsHtml;
                subHtml += '</div>';
                subHtml += rightIconHtml;
                
                card.innerHTML = subHtml;
                container.appendChild(card);
                if (sub.image && sub.image.trim() !== "" && !(window.__imgCache && window.__imgCache[sub.image]) && typeof getCachedImageUrl === "function") {
                    const imgEl = card.querySelector(".outline-item-img");
                    if (imgEl) {
                        getCachedImageUrl(sub.image).then(function(src) {
                            if (src && src !== sub.image) {
                                imgEl.src = src;
                            }
                        });
                    }
                }
            });
        }

        function handleSelectSubcategoryNode(sub, type) {
            if (_activeCategoryNodeForUrl) {
                _activeCategoryName = _activeCategoryNodeForUrl.name;
            }
            _activeSubCategoryName = sub.name;
            _activeTopicName = (sub.test && sub.test.title) || (sub.pdf && sub.pdf.title) || sub.name;

            _activeSubcategoryNodeForUrl = sub;
            _activeTopicNodeForUrl = null;
            _activeTopicStack = [];
            _activeTopicType = type;
            updateHistoryAndUrl(_activeCategoryNodeForUrl, sub, null);

            const hasTopics = sub.topics && sub.topics.length > 0;
            const hasResource = (type === 'test' && sub.test) || (type === 'pdf' && sub.pdf);

            if (hasResource && !hasTopics) {
                if (sub.test && !isItemScheduledVisible(sub.test)) {
                    alert("This test is scheduled to start at: " + new Date(sub.test.scheduledAt).toLocaleString());
                    return;
                }
                if (sub.pdf && !isItemScheduledVisible(sub.pdf)) {
                    alert("This PDF is scheduled to release at: " + new Date(sub.pdf.scheduledAt).toLocaleString());
                    return;
                }
                handleVerifyDirectMeta(sub, type);
                return;
            }

            // Open Topics screen
            navigateToScreen("scr-topics", sub.name);
            renderTopicList(sub.topics || [], sub.name, type);
        }

        function renderTopicList(topics, title, type) {
            const container = document.getElementById("topicsGridArea");
            container.innerHTML = "";
            document.getElementById("topicSelectionTitle").innerText = title;

            const hasResource = (_activeSubcategoryNodeForUrl && ((type === 'test' && _activeSubcategoryNodeForUrl.test) || (type === 'pdf' && _activeSubcategoryNodeForUrl.pdf)));

            // Prepend a standard direct card if direct content is attached at subcategory level and we are at the root level of topics stack
            if (hasResource && _activeTopicStack.length === 0) {
                const directCard = document.createElement("div");
                directCard.className = "outline-item-card";

                var detailsHtml = "";
                if (type === 'test') {
                    var totalQ = _activeSubcategoryNodeForUrl.test ? getQuestionsCountFromTest(_activeSubcategoryNodeForUrl.test) : 0;
                    var durationMins = _activeSubcategoryNodeForUrl.test ? (_activeSubcategoryNodeForUrl.test.duration || 0) : 0;
                    var attempts = _activeSubcategoryNodeForUrl.test ? parseInt(localStorage.getItem("attempts_test_" + _activeSubcategoryNodeForUrl.test.id) || "0", 10) : 0;

                    var durationText = (function() {
                        if (durationMins >= 60) {
                            var rawHours = durationMins / 60;
                            var totalHrsStr = rawHours.toFixed(1);
                            return (totalHrsStr.endsWith(".0") ? rawHours.toFixed(0) : totalHrsStr) + ' Hrs';
                        } else if (durationMins > 0) {
                            return durationMins + ' Mins';
                        }
                        return '0 Mins';
                    })();

                    var attemptsText = attempts + (attempts === 1 ? " Attempt" : " Attempts");
                    var attemptsColor = (attempts > 0) ? "#2ecc71" : "var(--grey-text)";
                    var attemptsIcon = (attempts > 0) ? "ph-fill ph-check-circle" : "ph-bold ph-circle-dashed";

                    detailsHtml = '    <div style="display: inline-flex; align-items: center; gap: 5px; margin-top: 5px; background: rgba(120, 120, 120, 0.05); border: 1px solid rgba(120, 120, 120, 0.08); padding: 2px 6px; border-radius: 6px; box-sizing: border-box; flex-wrap: nowrap; max-width: 100%;">' +
                                  '        <span style="display: inline-flex; align-items: center; gap: 2px; font-size: 9px; font-weight: 850; color: var(--dark); white-space: nowrap;">' +
                                  '            <i class="ph-bold ph-question" style="color: #009CFC; font-size: 11px;"></i> ' + totalQ + ' MCQ' +
                                  '        </span>' +
                                  '        <span style="width: 1px; height: 9px; background: rgba(120, 120, 120, 0.15); flex-shrink: 0;"></span>' +
                                  '        <span style="display: inline-flex; align-items: center; gap: 2px; font-size: 9px; font-weight: 850; color: var(--dark); white-space: nowrap;">' +
                                  '            <i class="ph-bold ph-clock" style="color: #0077C8; font-size: 11px;"></i> ' + durationText +
                                  '        </span>' +
                                  '        <span style="width: 1px; height: 9px; background: rgba(120, 120, 120, 0.15); flex-shrink: 0;"></span>' +
                                  '        <span style="display: inline-flex; align-items: center; gap: 2.5px; font-size: 9px; font-weight: 850; color: ' + attemptsColor + '; white-space: nowrap;">' +
                                  '            <i class="' + attemptsIcon + '" style="font-size: 11px;"></i> ' + attemptsText +
                                  '        </span>' +
                                  '    </div>';
                } else {
                    var hasRead = _activeSubcategoryNodeForUrl.id && localStorage.getItem("pdf_read_" + _activeSubcategoryNodeForUrl.id) === "true";
                    var readText = hasRead ? "Read" : "Unread";
                    var readColor = hasRead ? "#2ecc71" : "var(--grey-text)";
                    var readIcon = hasRead ? "ph-fill ph-check-circle" : "ph-bold ph-circle-dashed";

                    detailsHtml = '    <div style="display: inline-flex; align-items: center; gap: 5px; margin-top: 5px; background: rgba(120, 120, 120, 0.05); border: 1px solid rgba(120, 120, 120, 0.08); padding: 2px 6px; border-radius: 6px; box-sizing: border-box; flex-wrap: nowrap; max-width: 100%;">' +
                                  '        <span style="display: inline-flex; align-items: center; gap: 2px; font-size: 9px; font-weight: 850; color: var(--dark); white-space: nowrap;">' +
                                  '            <i class="ph-bold ph-file-pdf" style="color: #e74c3c; font-size: 11px;"></i> PDF Document' +
                                  '        </span>' +
                                  '        <span style="width: 1px; height: 9px; background: rgba(120, 120, 120, 0.15); flex-shrink: 0;"></span>' +
                                  '        <span style="display: inline-flex; align-items: center; gap: 2.5px; font-size: 9px; font-weight: 850; color: ' + readColor + '; white-space: nowrap;">' +
                                  '            <i class="' + readIcon + '" style="font-size: 11px;"></i> ' + readText +
                                  '        </span>' +
                                  '    </div>';
                }

                var initSrc = (_activeSubcategoryNodeForUrl.image && window.__imgCache && window.__imgCache[_activeSubcategoryNodeForUrl.image]) || _activeSubcategoryNodeForUrl.image || "";
                var hasImg = _activeSubcategoryNodeForUrl.image && _activeSubcategoryNodeForUrl.image.trim() !== "";
                var iconClass = type === 'test' ? "ph ph-exam" : "ph ph-file-pdf";

                var cardHtml = "";
                if (hasImg) {
                    cardHtml += '<img class="outline-item-img" src="' + initSrc + '" data-original-src="' + _activeSubcategoryNodeForUrl.image + '">';
                } else {
                    cardHtml += '<div class="outline-item-img" style="display:flex;align-items:center;justify-content:center;color: var(--primary);"><i class="' + iconClass + '" style="font-size:24px;"></i></div>';
                }

                var rootCat = _activeCategoryNodeForUrl;
                var isDemoMode = rootCat && _demoCategories[rootCat.id];
                var isFreeTest = false;
                if (isDemoMode) {
                    if (type === 'test' && _activeSubcategoryNodeForUrl.test && isDemoFreeTest(_activeSubcategoryNodeForUrl.test.id, rootCat)) {
                        isFreeTest = true;
                    } else if (type === 'pdf' && _activeSubcategoryNodeForUrl.pdf && isDemoFreePdf(_activeSubcategoryNodeForUrl.pdf.id, rootCat)) {
                        isFreeTest = true;
                    }
                }

                var isUploaded = (type === 'test') ? isTestUploaded(_activeSubcategoryNodeForUrl.test) : isPdfUploaded(_activeSubcategoryNodeForUrl.pdf);

                directCard.onclick = () => {
                    if (!isUploaded) {
                        showCustomAlert("Coming Soon", "Yeh content abhi upload nahi hai. Coming Soon!");
                        return;
                    }
                    if (isDemoMode && !isFreeTest) {
                        showCategoryPaymentScreen(rootCat);
                        return;
                    }
                    if (_activeSubcategoryNodeForUrl.test && !isItemScheduledVisible(_activeSubcategoryNodeForUrl.test)) {
                        alert("This test is scheduled to start at: " + new Date(_activeSubcategoryNodeForUrl.test.scheduledAt).toLocaleString());
                        return;
                    }
                    if (_activeSubcategoryNodeForUrl.pdf && !isItemScheduledVisible(_activeSubcategoryNodeForUrl.pdf)) {
                        alert("This PDF is scheduled to release at: " + new Date(_activeSubcategoryNodeForUrl.pdf.scheduledAt).toLocaleString());
                        return;
                    }
                    handleVerifyDirectMeta(_activeSubcategoryNodeForUrl, type);
                };

                var badgeLabelHtml = '<h4 class="outline-item-title">' + _activeSubcategoryNodeForUrl.name + '</h4>';
                if (!isUploaded) {
                    badgeLabelHtml = '<h4 class="outline-item-title" style="display: flex; align-items: center; gap: 6px;">' +
                                     '    <span style="display: inline-flex; align-items: center; gap: 4px; color: #ef4444; font-size: 9.5px; font-weight: 850; background: rgba(239, 68, 68, 0.08); padding: 1.5px 6px; border-radius: 6px; border: 1px solid rgba(239, 68, 68, 0.2); font-family: Outfit, sans-serif;"><i class="ph-bold ph-hourglass-simple" style="font-size: 10px;"></i> Coming Soon</span>' +
                                     '    ' + _activeSubcategoryNodeForUrl.name +
                                     '</h4>';
                } else if (isDemoMode && isFreeTest) {
                    badgeLabelHtml = '<h4 class="outline-item-title" style="display: flex; align-items: center; gap: 6px;">' +
                                     '    <span style="display: inline-flex; align-items: center; gap: 4px; color: #2ecc71; font-size: 9.5px; font-weight: 850; background: rgba(46, 204, 113, 0.08); padding: 1.5px 6px; border-radius: 6px; border: 1px solid rgba(46, 204, 113, 0.15); font-family: Outfit, sans-serif;"><i class="ph-bold ph-gift" style="font-size: 10px;"></i> Free Demo</span>' +
                                     '    ' + _activeSubcategoryNodeForUrl.name +
                                     '</h4>';
                }

                cardHtml += '<div class="outline-item-details">';
                cardHtml += badgeLabelHtml;
                cardHtml += detailsHtml;
                cardHtml += '</div>';

                if (isDemoMode && !isFreeTest) {
                    cardHtml += '<i class="ph-fill ph-lock" style="color: #ef4444; font-size: 18px; margin-right: 4px;"></i>';
                } else {
                    cardHtml += '<i class="ph ph-caret-right" style="color: var(--primary);"></i>';
                }

                directCard.innerHTML = cardHtml;
                container.appendChild(directCard);
            }

            // Render navigation breadcrumbs if looking at subtopics
            if (_activeTopicStack && _activeTopicStack.length > 0) {
                const breadcrumbDiv = document.createElement("div");
                breadcrumbDiv.style.cssText = "display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; color: var(--grey-text); margin-bottom: 12px; flex-wrap: wrap; background: rgba(120, 120, 120, 0.04); padding: 6px 12px; border-radius: 8px; border: 1px solid rgba(120, 120, 120, 0.08);";
                
                // Root subcategory link
                const rootSpan = document.createElement("span");
                rootSpan.innerText = _activeSubcategoryNodeForUrl.name;
                rootSpan.style.cursor = "pointer";
                rootSpan.style.color = "var(--primary)";
                rootSpan.onclick = () => {
                    _activeTopicStack = [];
                    renderTopicList(_activeSubcategoryNodeForUrl.topics || [], _activeSubcategoryNodeForUrl.name, type);
                };
                breadcrumbDiv.appendChild(rootSpan);

                _activeTopicStack.forEach((node, idx) => {
                    const arrow = document.createElement("span");
                    arrow.innerText = "›";
                    breadcrumbDiv.appendChild(arrow);

                    const nodeSpan = document.createElement("span");
                    nodeSpan.innerText = node.name;
                    if (idx < _activeTopicStack.length - 1) {
                        nodeSpan.style.cursor = "pointer";
                        nodeSpan.style.color = "var(--primary)";
                        nodeSpan.onclick = () => {
                            _activeTopicStack = _activeTopicStack.slice(0, idx + 1);
                            renderTopicList(node.topics || [], node.name, type);
                        };
                    } else {
                        nodeSpan.style.color = "var(--dark)";
                    }
                    breadcrumbDiv.appendChild(nodeSpan);
                });

                container.appendChild(breadcrumbDiv);
            }

            const visibleTopics = (topics || []).filter(isItemVisibleToStudent);
            if (visibleTopics.length === 0) {
                if (!hasResource || _activeTopicStack.length > 0) {
                    const emptyBox = document.createElement("div");
                    emptyBox.className = "coming-soon-box";
                    emptyBox.innerHTML = '<i class="ph-fill ph-clock-countdown" style="font-size: 26px; color: #ef4444; margin-bottom: 6px; display: block;"></i>Coming Soon';
                    container.appendChild(emptyBox);
                }
                return;
            }

            visibleTopics.forEach((topic) => {
                var isDemoMode = _activeCategoryNodeForUrl && _demoCategories[_activeCategoryNodeForUrl.id];
                var isFreeTest = false;
                if (isDemoMode) {
                    if (type === 'test' && topic.test && isDemoFreeTest(topic.test.id, _activeCategoryNodeForUrl)) {
                        isFreeTest = true;
                    } else if (type === 'pdf' && topic.pdf && isDemoFreePdf(topic.pdf.id, _activeCategoryNodeForUrl)) {
                        isFreeTest = true;
                    }
                }

                const card = document.createElement("div");
                card.className = "outline-item-card";
                card.onclick = () => handleSelectTopicNode(topic, type);

                let iconClass = "ph ph-exam";
                if (topic.topics && topic.topics.length > 0) {
                    iconClass = "ph ph-folder-open";
                } else if (type === 'pdf') {
                    iconClass = "ph ph-file-pdf";
                }

                var initSrc = (topic.image && window.__imgCache && window.__imgCache[topic.image]) || topic.image || "";
                var hasImg = topic.image && topic.image.trim() !== "";
                
                var topicHtml = "";
                if (hasImg) {
                    topicHtml += '<img class="outline-item-img" src="' + initSrc + '" data-original-src="' + topic.image + '">';
                } else {
                    topicHtml += '<div class="outline-item-img" style="display:flex;align-items:center;justify-content:center;color: var(--primary);"><i class="' + iconClass + '" style="font-size:24px;"></i></div>';
                }

                // Compute stats for topic level
                var detailsHtml = "";
                if (topic.topics && topic.topics.length > 0) {
                    var stats = calculateNodeStats(topic, type);
                    if (type === 'test') {
                        var totalTests = stats.totalTests;
                        var totalHrsFormatted = stats.totalHrsFormatted;
                        var progressText = stats.attemptedTests + "/" + totalTests + " Done";
                        var progressColor = (stats.attemptedTests === totalTests && totalTests > 0) ? "#2ecc71" : (stats.attemptedTests > 0 ? "#3498db" : "var(--grey-text)");
                        var progressIcon = (stats.attemptedTests === totalTests && totalTests > 0) ? "ph-fill ph-check-circle" : "ph-bold ph-circle-dashed";

                        if (totalTests === 0) {
                            detailsHtml = '    <div style="display: inline-flex; align-items: center; gap: 4px; margin-top: 5px; background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.18); padding: 2px 7px; border-radius: 6px; box-sizing: border-box;">' +
                                          '        <span style="display: inline-flex; align-items: center; gap: 3px; font-size: 9px; font-weight: 850; color: #ef4444; white-space: nowrap;">' +
                                          '            <i class="ph-bold ph-hourglass-simple" style="color: #ef4444; font-size: 11px;"></i> Coming Soon' +
                                          '        </span>' +
                                          '    </div>';
                        } else {
                            detailsHtml = '    <div style="display: inline-flex; align-items: center; gap: 5px; margin-top: 5px; background: rgba(120, 120, 120, 0.05); border: 1px solid rgba(120, 120, 120, 0.08); padding: 2px 6px; border-radius: 6px; box-sizing: border-box; flex-wrap: nowrap; max-width: 100%;">' +
                                          '        <span style="display: inline-flex; align-items: center; gap: 2px; font-size: 9px; font-weight: 850; color: var(--dark); white-space: nowrap;">' +
                                          '            <i class="ph-bold ph-clipboard-text" style="color: #009CFC; font-size: 11px;"></i> ' + totalTests + ' ' + (totalTests === 1 ? 'Test' : 'Tests') +
                                          '        </span>' +
                                          '        <span style="width: 1px; height: 9px; background: rgba(120, 120, 120, 0.15); flex-shrink: 0;"></span>' +
                                          '        <span style="display: inline-flex; align-items: center; gap: 2px; font-size: 9px; font-weight: 850; color: var(--dark); white-space: nowrap;">' +
                                          '            <i class="ph-bold ph-clock" style="color: #0077C8; font-size: 11px;"></i> ' + totalHrsFormatted +
                                          '        </span>' +
                                          '        <span style="width: 1px; height: 9px; background: rgba(120, 120, 120, 0.15); flex-shrink: 0;"></span>' +
                                          '        <span style="display: inline-flex; align-items: center; gap: 2.5px; font-size: 9px; font-weight: 850; color: ' + progressColor + '; white-space: nowrap;">' +
                                          '            <i class="' + progressIcon + '" style="font-size: 11px;"></i> ' + progressText +
                                          '        </span>' +
                                          '    </div>';
                        }
                    } else {
                        var totalFiles = stats.totalFiles;
                        var progressText = stats.readFiles + "/" + totalFiles + " Read";
                        var progressColor = (stats.readFiles === totalFiles && totalFiles > 0) ? "#2ecc71" : (stats.readFiles > 0 ? "#3498db" : "var(--grey-text)");
                        var progressIcon = (stats.readFiles === totalFiles && totalFiles > 0) ? "ph-fill ph-check-circle" : "ph-bold ph-circle-dashed";

                        if (totalFiles === 0) {
                            detailsHtml = '    <div style="display: inline-flex; align-items: center; gap: 4px; margin-top: 5px; background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.18); padding: 2px 7px; border-radius: 6px; box-sizing: border-box;">' +
                                          '        <span style="display: inline-flex; align-items: center; gap: 3px; font-size: 9px; font-weight: 850; color: #ef4444; white-space: nowrap;">' +
                                          '            <i class="ph-bold ph-hourglass-simple" style="color: #ef4444; font-size: 11px;"></i> Coming Soon' +
                                          '        </span>' +
                                          '    </div>';
                        } else {
                            detailsHtml = '    <div style="display: inline-flex; align-items: center; gap: 5px; margin-top: 5px; background: rgba(120, 120, 120, 0.05); border: 1px solid rgba(120, 120, 120, 0.08); padding: 2px 6px; border-radius: 6px; box-sizing: border-box; flex-wrap: nowrap; max-width: 100%;">' +
                                          '        <span style="display: inline-flex; align-items: center; gap: 2px; font-size: 9px; font-weight: 850; color: var(--dark); white-space: nowrap;">' +
                                          '            <i class="ph-bold ph-file-pdf" style="color: #e74c3c; font-size: 11px;"></i> ' + totalFiles + ' ' + (totalFiles === 1 ? 'PDF' : 'PDFs') +
                                          '        </span>' +
                                          '        <span style="width: 1px; height: 9px; background: rgba(120, 120, 120, 0.15); flex-shrink: 0;"></span>' +
                                          '        <span style="display: inline-flex; align-items: center; gap: 2.5px; font-size: 9px; font-weight: 850; color: ' + progressColor + '; white-space: nowrap;">' +
                                          '            <i class="' + progressIcon + '" style="font-size: 11px;"></i> ' + progressText +
                                          '        </span>' +
                                          '    </div>';
                        }
                    }
                } else if (type === 'test') {
                    var isUploaded = isTestUploaded(topic.test);
                    if (!isUploaded) {
                        detailsHtml = '    <div style="display: inline-flex; align-items: center; gap: 4px; margin-top: 5px; background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.18); padding: 2px 7px; border-radius: 6px; box-sizing: border-box;">' +
                                      '        <span style="display: inline-flex; align-items: center; gap: 3px; font-size: 9px; font-weight: 850; color: #ef4444; white-space: nowrap;">' +
                                      '            <i class="ph-bold ph-hourglass-simple" style="color: #ef4444; font-size: 11px;"></i> Coming Soon' +
                                      '        </span>' +
                                      '    </div>';
                    } else {
                        var totalQ = topic.test ? getQuestionsCountFromTest(topic.test) : 0;
                        var durationMins = topic.test ? (topic.test.duration || 0) : 0;
                        var attempts = topic.test ? parseInt(localStorage.getItem("attempts_test_" + topic.test.id) || "0", 10) : 0;

                        var durationText = (function() {
                            if (durationMins >= 60) {
                                var rawHours = durationMins / 60;
                                var totalHrsStr = rawHours.toFixed(1);
                                return (totalHrsStr.endsWith(".0") ? rawHours.toFixed(0) : totalHrsStr) + ' Hrs';
                            } else if (durationMins > 0) {
                                return durationMins + ' Mins';
                            }
                            return '0 Mins';
                        })();

                        var attemptsText = attempts + (attempts === 1 ? " Attempt" : " Attempts");
                        var attemptsColor = (attempts > 0) ? "#2ecc71" : "var(--grey-text)";
                        var attemptsIcon = (attempts > 0) ? "ph-fill ph-check-circle" : "ph-bold ph-circle-dashed";

                        detailsHtml = '    <div style="display: inline-flex; align-items: center; gap: 5px; margin-top: 5px; background: rgba(120, 120, 120, 0.05); border: 1px solid rgba(120, 120, 120, 0.08); padding: 2px 6px; border-radius: 6px; box-sizing: border-box; flex-wrap: nowrap; max-width: 100%;">' +
                                      '        <span style="display: inline-flex; align-items: center; gap: 2px; font-size: 9px; font-weight: 850; color: var(--dark); white-space: nowrap;">' +
                                      '            <i class="ph-bold ph-question" style="color: #009CFC; font-size: 11px;"></i> ' + totalQ + ' MCQ' +
                                      '        </span>' +
                                      '        <span style="width: 1px; height: 9px; background: rgba(120, 120, 120, 0.15); flex-shrink: 0;"></span>' +
                                      '        <span style="display: inline-flex; align-items: center; gap: 2px; font-size: 9px; font-weight: 850; color: var(--dark); white-space: nowrap;">' +
                                      '            <i class="ph-bold ph-clock" style="color: #0077C8; font-size: 11px;"></i> ' + durationText +
                                      '        </span>' +
                                      '        <span style="width: 1px; height: 9px; background: rgba(120, 120, 120, 0.15); flex-shrink: 0;"></span>' +
                                      '        <span style="display: inline-flex; align-items: center; gap: 2.5px; font-size: 9px; font-weight: 850; color: ' + attemptsColor + '; white-space: nowrap;">' +
                                      '            <i class="' + attemptsIcon + '" style="font-size: 11px;"></i> ' + attemptsText +
                                      '        </span>' +
                                      '    </div>';
                    }
                } else {
                    var isUploaded = isPdfUploaded(topic.pdf);
                    if (!isUploaded) {
                        detailsHtml = '    <div style="display: inline-flex; align-items: center; gap: 4px; margin-top: 5px; background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.18); padding: 2px 7px; border-radius: 6px; box-sizing: border-box;">' +
                                      '        <span style="display: inline-flex; align-items: center; gap: 3px; font-size: 9px; font-weight: 850; color: #ef4444; white-space: nowrap;">' +
                                      '            <i class="ph-bold ph-hourglass-simple" style="color: #ef4444; font-size: 11px;"></i> Coming Soon' +
                                      '        </span>' +
                                      '    </div>';
                    } else {
                        var pdfIdKey = (topic.pdf && topic.pdf.id) ? topic.pdf.id : topic.id;
                        var hasRead = pdfIdKey && (localStorage.getItem("pdf_read_" + pdfIdKey) === "true" || localStorage.getItem("pdf_read_" + topic.id) === "true");
                        var readText = hasRead ? "Read" : "Unread";
                        var readColor = hasRead ? "#2ecc71" : "var(--grey-text)";
                        var readIcon = hasRead ? "ph-fill ph-check-circle" : "ph-bold ph-circle-dashed";

                        detailsHtml = '    <div style="display: inline-flex; align-items: center; gap: 5px; margin-top: 5px; background: rgba(120, 120, 120, 0.05); border: 1px solid rgba(120, 120, 120, 0.08); padding: 2px 6px; border-radius: 6px; box-sizing: border-box; flex-wrap: nowrap; max-width: 100%;">' +
                                      '        <span style="display: inline-flex; align-items: center; gap: 2px; font-size: 9px; font-weight: 850; color: var(--dark); white-space: nowrap;">' +
                                      '            <i class="ph-bold ph-file-pdf" style="color: #e74c3c; font-size: 11px;"></i> PDF Document' +
                                      '        </span>' +
                                      '        <span style="width: 1px; height: 9px; background: rgba(120, 120, 120, 0.15); flex-shrink: 0;"></span>' +
                                      '        <span style="display: inline-flex; align-items: center; gap: 2.5px; font-size: 9px; font-weight: 850; color: ' + readColor + '; white-space: nowrap;">' +
                                      '            <i class="' + readIcon + '" style="font-size: 11px;"></i> ' + readText +
                                      '        </span>' +
                                      '    </div>';
                    }
                }

                var isUploaded = true;
                if (!topic.topics || topic.topics.length === 0) {
                    isUploaded = (type === 'test') ? isTestUploaded(topic.test) : isPdfUploaded(topic.pdf);
                }

                topicHtml += '<div class="outline-item-details">';
                if (!isUploaded) {
                    topicHtml += '    <h4 class="outline-item-title" style="display: flex; align-items: center; gap: 6px;">' +
                                 '        <span style="display: inline-flex; align-items: center; gap: 4px; color: #ef4444; font-size: 9.5px; font-weight: 850; background: rgba(239, 68, 68, 0.08); padding: 1.5px 6px; border-radius: 6px; border: 1px solid rgba(239, 68, 68, 0.2); font-family: Outfit, sans-serif;"><i class="ph-bold ph-hourglass-simple" style="font-size: 10px;"></i> Coming Soon</span>' +
                                 '        ' + topic.name +
                                 '    </h4>';
                } else if (isDemoMode && isFreeTest) {
                    topicHtml += '    <h4 class="outline-item-title" style="display: flex; align-items: center; gap: 6px;">' +
                                 '        <span style="display: inline-flex; align-items: center; gap: 4px; color: #2ecc71; font-size: 9.5px; font-weight: 850; background: rgba(46, 204, 113, 0.08); padding: 1.5px 6px; border-radius: 6px; border: 1px solid rgba(46, 204, 113, 0.15); font-family: Outfit, sans-serif;"><i class="ph-bold ph-gift" style="font-size: 10px;"></i> Free Demo</span>' +
                                 '        ' + topic.name +
                                 '    </h4>';
                } else {
                    topicHtml += '    <h4 class="outline-item-title">' + topic.name + '</h4>';
                }
                topicHtml += detailsHtml;
                topicHtml += '</div>';

                if (topic.topics && topic.topics.length > 0) {
                    topicHtml += '<i class="ph ph-folder" style="color: #f1c40f; font-size: 18px;"></i>';
                } else if (isDemoMode && !isFreeTest) {
                    topicHtml += '<i class="ph-fill ph-lock" style="color: #ef4444; font-size: 18px; margin-right: 4px;"></i>';
                } else {
                    topicHtml += '<i class="ph ph-caret-right" style="color: var(--primary);"></i>';
                }

                card.innerHTML = topicHtml;
                container.appendChild(card);

                if (hasImg && !(window.__imgCache && window.__imgCache[topic.image]) && typeof getCachedImageUrl === "function") {
                    const imgEl = card.querySelector(".outline-item-img");
                    if (imgEl) {
                        getCachedImageUrl(topic.image).then(function(src) {
                            if (src && src !== topic.image) {
                                imgEl.src = src;
                            }
                        });
                    }
                }
            });
        }

        function handleSelectTopicNode(topic, type) {
            if (_activeCategoryNodeForUrl) {
                _activeCategoryName = _activeCategoryNodeForUrl.name;
            }
            if (_activeSubcategoryNodeForUrl) {
                _activeSubCategoryName = _activeSubcategoryNodeForUrl.name;
            }
            _activeTopicName = topic.name;

            if (topic.topics && topic.topics.length > 0) {
                _activeTopicStack.push(topic);
                renderTopicList(topic.topics, topic.name, type);
                return;
            }

            _activeTopicNodeForUrl = topic;
            updateHistoryAndUrl(_activeCategoryNodeForUrl, _activeSubcategoryNodeForUrl, topic);

            if (topic.test && !isItemScheduledVisible(topic.test)) {
                alert("This test is scheduled to start at: " + new Date(topic.test.scheduledAt).toLocaleString());
                return;
            }
            if (topic.pdf && !isItemScheduledVisible(topic.pdf)) {
                alert("This PDF is scheduled to release at: " + new Date(topic.pdf.scheduledAt).toLocaleString());
                return;
            }

            handleVerifyDirectMeta(topic, type);
        }

        // Checking tests or PDFs direct launch
        function handleVerifyDirectMeta(node, type) {
            var rootCat = findRootCategoryForNode(node.id, type);
            if (rootCat && rootCat.isPaid && !isCategoryUnlocked(rootCat)) {
                if (_demoCategories[rootCat.id] && type === 'test' && node.test && isDemoFreeTest(node.test.id, rootCat)) {
                    // Bypass for the free demo test!
                } else if (_demoCategories[rootCat.id] && type === 'pdf' && node.pdf && isDemoFreePdf(node.pdf.id, rootCat)) {
                    // Bypass for the free demo pdf!
                } else {
                    showCategoryPaymentScreen(rootCat);
                    return;
                }
            }
            if (!isItemVisibleToStudent(node)) {
                showCustomAlert("Resource Restricted", "This resource is restricted or not currently available for your account.");
                return;
            }
            if (type === 'pdf') {
                const pdfData = node.pdf;
                if (!pdfData || !isPdfUploaded(pdfData)) {
                    showCustomAlert("Coming Soon", "Yeh PDF abhi upload nahi hai. Coming Soon!");
                    return;
                }
                
                // If it is a Paid PDF, check category gating
                if (pdfData.isPaid && rootCat && !isCategoryUnlocked(rootCat)) {
                    showCategoryPaymentScreen(rootCat);
                    return;
                }

                // Let them access URL after showing the copyright gate modal
                showCopyrightPdfModal(node.name || "Study Material PDF", pdfData.url, function() {
                    if (node && node.id) {
                        localStorage.setItem("pdf_read_" + node.id, "true");
                    }
                    window.open(pdfData.url, '_blank');
                });
            } else {
                const testData = node.test;
                if (!testData || !isTestUploaded(testData)) {
                    showCustomAlert("Coming Soon", "Yeh Test abhi upload nahi hai. Coming Soon!");
                    return;
                }

                _activeTest = testData;
                
                // Setup pre-instructions screen
                navigateToScreen("scr-instructions", testData.title || node.name);
                document.getElementById("instExTitle").innerText = testData.title || node.name;
                document.getElementById("instExDuration").innerText = testData.duration;
                
                let qCount = testData.questionsCount || Math.max(testData.questionsEn.length, testData.questionsHi.length);
                Object.values(testData.questionsOther || {}).forEach(arr => {
                    if (arr && arr.length > qCount) {
                        qCount = arr.length;
                    }
                });
                document.getElementById("instExCount").innerText = qCount;
                document.getElementById("instExPositive").innerText = testData.posMarks;
                document.getElementById("instExNegative").innerText = testData.negMarks;
                document.getElementById("instExDesc").innerText = testData.instructions || "Conduct assessment systematically. Refrain from screenshot actions.";

                // Coupon panel display
                const couponPanel = document.getElementById("couponEntrySection");
                const couponInput = document.getElementById("couponCodeInput");
                const couponFeedback = document.getElementById("couponFeedbackMsg");
                
                if (couponInput) couponInput.value = "";
                if (couponFeedback) couponFeedback.innerHTML = "";
                _hasActiveCouponGrant = null;

                const availableCoupons = collectAllAvailableCouponsForActiveTest();

                if (couponPanel) {
                    if (availableCoupons.length > 0) {
                        couponPanel.style.display = "block";
                        checkAndRestoreAppliedCoupon();
                    } else {
                        couponPanel.style.display = "none";
                        couponPanel.style.setProperty("display", "none", "important");
                    }
                }
            }
        }

        // Collect all coupons across the test and its category hierarchy (only returns genuinely active and non-dummy coupons)
        function collectAllAvailableCouponsForActiveTest() {
            const list = [];
            const dummyCodes = ["PASS88", "SERIES88", "MYCOUPON", "SCIENCE100", "MATHS99", "VIPCOUPON", "OFFER50", "DIWALI20"];
            
            // Helper to validate coupon
            function isValidCouponObj(c) {
                if (!c || typeof c !== "object") return false;
                if (typeof c.code !== "string" || !c.code.trim()) return false;
                const clean = c.code.trim().toUpperCase();
                if (dummyCodes.indexOf(clean) !== -1) return false;

                // Check active start & end date bounds
                const now = Date.now();
                if (c.startDate) {
                    const start = parseCouponDate(c.startDate, "00:00:00");
                    if (start && now < start) return false;
                }
                if (c.endDate) {
                    const end = parseCouponDate(c.endDate, "23:59:59");
                    if (end && now > end) return false;
                }
                return true;
            }

            // 1. From active test itself
            if (_activeTest && isValidCouponObj(_activeTest.coupon)) {
                list.push({ source: 'test', coupon: _activeTest.coupon });
            }
            
            // 2. From active topic
            if (_activeTopicNodeForUrl) {
                if (isValidCouponObj(_activeTopicNodeForUrl.coupon)) {
                    list.push({ source: 'topic', coupon: _activeTopicNodeForUrl.coupon });
                } else if (typeof _activeTopicNodeForUrl.couponCode === "string" && _activeTopicNodeForUrl.couponCode.trim().length > 0) {
                    const code = _activeTopicNodeForUrl.couponCode.trim();
                    if (dummyCodes.indexOf(code.toUpperCase()) === -1) {
                        list.push({ source: 'topic', coupon: { code: code, maxAttempts: "unlimited" } });
                    }
                }
            }
            
            // 3. From active subcategory
            if (_activeSubcategoryNodeForUrl) {
                if (isValidCouponObj(_activeSubcategoryNodeForUrl.coupon)) {
                    list.push({ source: 'subcategory', coupon: _activeSubcategoryNodeForUrl.coupon });
                } else if (typeof _activeSubcategoryNodeForUrl.couponCode === "string" && _activeSubcategoryNodeForUrl.couponCode.trim().length > 0) {
                    const code = _activeSubcategoryNodeForUrl.couponCode.trim();
                    if (dummyCodes.indexOf(code.toUpperCase()) === -1) {
                        list.push({ source: 'subcategory', coupon: { code: code, maxAttempts: "unlimited" } });
                    }
                }
            }
            
            // 4. From active category
            if (_activeCategoryNodeForUrl) {
                if (isValidCouponObj(_activeCategoryNodeForUrl.coupon)) {
                    list.push({ source: 'category', coupon: _activeCategoryNodeForUrl.coupon });
                } else if (typeof _activeCategoryNodeForUrl.couponCode === "string" && _activeCategoryNodeForUrl.couponCode.trim().length > 0) {
                    const code = _activeCategoryNodeForUrl.couponCode.trim();
                    if (dummyCodes.indexOf(code.toUpperCase()) === -1) {
                        list.push({ source: 'category', coupon: { code: code, maxAttempts: "unlimited" } });
                    }
                }
            }
            
            // Deduplicate lists by code
            const seen = new Set();
            return list.filter(item => {
                if (!item || !item.coupon || !item.coupon.code || !item.coupon.code.trim()) return false;
                const code = item.coupon.code.trim().toUpperCase();
                if (dummyCodes.indexOf(code) !== -1) return false;
                if (seen.has(code)) return false;
                seen.add(code);
                return true;
            });
        }

        // Safe helper to parse date strings to timestamp in local time
        function parseCouponDate(dateStr, defaultTime) {
            if (!dateStr) return null;
            try {
                if (dateStr.indexOf('T') !== -1) {
                    return new Date(dateStr).getTime();
                }
                const cleanDate = dateStr.trim();
                if (/^\d{4}-\d{2}-\d{2}$/.test(cleanDate)) {
                    return new Date(cleanDate + "T" + defaultTime).getTime();
                }
                return new Date(cleanDate).getTime();
            } catch (e) {
                return null;
            }
        }

        // Check if there is an applied coupon for this test in localStorage and restore it
        function checkAndRestoreAppliedCoupon() {
            if (!_activeTest) return;
            const savedCoupons = JSON.parse(localStorage.getItem("prayas_applied_coupons") || "{}");
            const saved = savedCoupons[_activeTest.id];
            
            const feedback = document.getElementById("couponFeedbackMsg");
            const couponInput = document.getElementById("couponCodeInput");
            
            if (saved) {
                const available = collectAllAvailableCouponsForActiveTest();
                const matchedObj = available.find(item => item.coupon.code.trim().toUpperCase() === saved.code.trim().toUpperCase());
                
                if (!matchedObj) {
                    // Coupon is no longer configured or available for this test node
                    delete savedCoupons[_activeTest.id];
                    localStorage.setItem("prayas_applied_coupons", JSON.stringify(savedCoupons));
                    _hasActiveCouponGrant = null;
                    return;
                }
                
                const coupon = matchedObj.coupon;
                const currentDateVal = Date.now();
                
                // Expiry Date check: automatic lock/removal if expired
                if (coupon.endDate) {
                    const endDate = parseCouponDate(coupon.endDate, "23:59:59");
                    if (endDate && currentDateVal > endDate) {
                        delete savedCoupons[_activeTest.id];
                        localStorage.setItem("prayas_applied_coupons", JSON.stringify(savedCoupons));
                        _hasActiveCouponGrant = null;
                        
                        feedback.style.color = "red";
                        feedback.innerText = "The applied coupon has expired and has been deactivated automatically.";
                        return;
                    }
                }
                
                // Start Date check
                if (coupon.startDate) {
                    const startDate = parseCouponDate(coupon.startDate, "00:00:00");
                    if (startDate && currentDateVal < startDate) {
                        delete savedCoupons[_activeTest.id];
                        localStorage.setItem("prayas_applied_coupons", JSON.stringify(savedCoupons));
                        _hasActiveCouponGrant = null;
                        
                        feedback.style.color = "orange";
                        feedback.innerText = "The applied coupon is not active anymore.";
                        return;
                    }
                }
                
                // Active valid coupon restored!
                _hasActiveCouponGrant = coupon;
                couponInput.value = coupon.code;
                
                const extraAttemptsText = (coupon.maxAttempts === "unlimited" || !coupon.maxAttempts) ? "Unlimited" : coupon.maxAttempts;
                feedback.style.color = "green";
                feedback.innerHTML = 'Coupon "' + coupon.code + '" successfully applied! ' + extraAttemptsText + ' attempts unlocked. <button onclick="handleRemoveCoupon()" style="background: #ef4444; color: white; border: none; padding: 4px 8px; border-radius: 6px; font-size: 10px; cursor: pointer; margin-left: 8px; font-weight: bold;">REMOVE</button>';
            }
        }

        // Handle user clicks to remove coupon code manually
        function handleRemoveCoupon() {
            if (!_activeTest) return;
            const savedCoupons = JSON.parse(localStorage.getItem("prayas_applied_coupons") || "{}");
            if (savedCoupons[_activeTest.id]) {
                delete savedCoupons[_activeTest.id];
                localStorage.setItem("prayas_applied_coupons", JSON.stringify(savedCoupons));
            }
            _hasActiveCouponGrant = null;
            
            const feedback = document.getElementById("couponFeedbackMsg");
            const couponInput = document.getElementById("couponCodeInput");
            if (couponInput) couponInput.value = "";
            if (feedback) {
                feedback.style.color = "gray";
                feedback.innerText = "Coupon removed.";
            }
        }
        window.handleRemoveCoupon = handleRemoveCoupon;

        // Voucher/Coupon submission validation
        function handleVerifyCouponSubmit() {
            const inputVal = document.getElementById("couponCodeInput").value.trim().toUpperCase();
            const feedback = document.getElementById("couponFeedbackMsg");

            if (!inputVal) {
                feedback.style.color = "red";
                feedback.innerText = "Please enter coupon code.";
                return;
            }

            const available = collectAllAvailableCouponsForActiveTest();
            const matchedObj = available.find(item => item.coupon.code.trim().toUpperCase() === inputVal);

            if (!matchedObj) {
                feedback.style.color = "red";
                feedback.innerText = "Invalid verification code.";
                return;
            }

            const coupon = matchedObj.coupon;
            const currentDateVal = Date.now();

            // Validate Start Date
            if (coupon.startDate) {
                const startDate = parseCouponDate(coupon.startDate, "00:00:00");
                if (startDate && currentDateVal < startDate) {
                    feedback.style.color = "orange";
                    feedback.innerText = "Voucher/Coupon code is not active yet.";
                    return;
                }
            }

            // Validate Expiry Date
            if (coupon.endDate) {
                const endDate = parseCouponDate(coupon.endDate, "23:59:59");
                if (endDate && currentDateVal > endDate) {
                    feedback.style.color = "red";
                    feedback.innerText = "Coupon code has expired.";
                    return;
                }
            }

            // Approve and persist coupon in localStorage
            const savedCoupons = JSON.parse(localStorage.getItem("prayas_applied_coupons") || "{}");
            savedCoupons[_activeTest.id] = {
                code: coupon.code,
                maxAttempts: coupon.maxAttempts || "unlimited",
                startDate: coupon.startDate || "",
                endDate: coupon.endDate || ""
            };
            localStorage.setItem("prayas_applied_coupons", JSON.stringify(savedCoupons));

            _hasActiveCouponGrant = coupon;
            
            const extraText = (coupon.maxAttempts === "unlimited" || !coupon.maxAttempts) ? "Unlimited" : coupon.maxAttempts;
            feedback.style.color = "green";
            feedback.innerHTML = 'Coupon "' + coupon.code + '" successfully applied! ' + extraText + ' attempts unlocked. <button onclick="handleRemoveCoupon()" style="background: #ef4444; color: white; border: none; padding: 4px 8px; border-radius: 6px; font-size: 10px; cursor: pointer; margin-left: 8px; font-weight: bold;">REMOVE</button>';
        }
        window.handleVerifyCouponSubmit = handleVerifyCouponSubmit;

        // Test Ignition & Locking checks
        async function handleBeginTestInitiation() {
            var overlay = document.getElementById("test-loading-overlay");
            if (overlay) {
                overlay.style.display = "flex";
                overlay.style.opacity = "1";
            }
            
            var hideOverlay = function() {
                if (overlay) {
                    overlay.style.opacity = "0";
                    setTimeout(function() {
                        overlay.style.display = "none";
                    }, 300);
                }
            };

            // Start a satisfying delay timer of 1000ms for a super high-quality spinner transition
            var delayPromise = new Promise(function(resolve) {
                setTimeout(resolve, 1000);
            });

            var testRootCat = _activeTest ? findRootCategoryForNode(_activeTest.id, 'test') : null;
            if (testRootCat && testRootCat.isPaid && !isCategoryUnlocked(testRootCat)) {
                if (_demoCategories[testRootCat.id] && _activeTest && isDemoFreeTest(_activeTest.id, testRootCat)) {
                    // Bypass for the free demo test!
                } else {
                    hideOverlay();
                    showCategoryPaymentScreen(testRootCat);
                    return;
                }
            }
            // If the test has no questions loaded in memory, fetch on demand when starting test!
            var qEnCount = (_activeTest && _activeTest.questionsEn) ? _activeTest.questionsEn.length : 0;
            var qHiCount = (_activeTest && _activeTest.questionsHi) ? _activeTest.questionsHi.length : 0;
            var qOtherCount = Object.values((_activeTest && _activeTest.questionsOther) || {}).reduce(function(sum, arr) { return sum + (arr ? arr.length : 0); }, 0);

            if (_activeTest && qEnCount === 0 && qHiCount === 0 && qOtherCount === 0) {
                
                // Show clean loading spinner / disable button of the instruction page
                var startButton = document.querySelector("#scr-instructions button.btn-fill-prime");
                var originalText = startButton ? startButton.innerHTML : "Start Exam";
                if (startButton) {
                    startButton.disabled = true;
                    startButton.innerHTML = '<i class="ph ph-spinner-gap" style="animation: db-spin 1s linear infinite; display: inline-block; margin-right: 8px;"></i> Loading Exam Questions...';
                }
                
                var examId = _activeTest.id;
                var fetchedQuestions = null;
                
                // 1. Try to load from IndexedDB questions cache with version check
                try {
                    fetchedQuestions = await getCachedExamQuestions(examId, _activeTest.qVersion, _activeTest.updatedAt);
                } catch(e) {
                    console.warn("Error reading exam questions cache", e);
                }
                
                if (fetchedQuestions) {
                    console.log("Exam questions loaded instantly from local cache!");
                    _activeTest.questionsEn = fetchedQuestions.questionsEn || [];
                    _activeTest.questionsHi = fetchedQuestions.questionsHi || [];
                    _activeTest.questionsOther = fetchedQuestions.questionsOther || {};
                } else {
                    var cacheBusterQuery = "?_t=" + Date.now() + (_activeTest.qVersion ? "&_qv=" + encodeURIComponent(_activeTest.qVersion) : "");
                    var r2Url = _getRegistryPath("test_questions_" + examId + ".txt") + cacheBusterQuery;
                    try {
                        console.log("Loading fresh exam questions package:", examId);
                        const res = await fetch(r2Url, { cache: "no-store", headers: { "Cache-Control": "no-cache, no-store, must-revalidate" } });
                        if (!res.ok) {
                            throw new Error("HTTP Status " + res.status);
                        }
                        const text = await res.text();
                        const decodedPayload = JSON.parse(decodeObfuscatedPayload(text.trim()));
                        
                        _activeTest.questionsEn = decodedPayload.questionsEn || [];
                        _activeTest.questionsHi = decodedPayload.questionsHi || [];
                        _activeTest.questionsOther = decodedPayload.questionsOther || {};
                        
                        saveExamQuestionsToCache(examId, {
                            questionsEn: _activeTest.questionsEn,
                            questionsHi: _activeTest.questionsHi,
                            questionsOther: _activeTest.questionsOther,
                            qVersion: decodedPayload.qVersion || _activeTest.qVersion || "",
                            updatedAt: decodedPayload.updatedAt || _activeTest.updatedAt || Date.now(),
                            buildId: window.__studentAppBuildId || ""
                        });
                        
                        console.log("Exam questions loaded and cached successfully!");
                    } catch(err) {
                        console.error("Failed loading exam questions", err);
                        hideOverlay();
                        alert("⚠️ Connection Failed: Host/Network error downloading questions. Please check internet connection.");
                        if (startButton) {
                            startButton.disabled = false;
                            startButton.innerHTML = originalText;
                        }
                        return;
                    }
                }
                
                if (startButton) {
                    startButton.disabled = false;
                    startButton.innerHTML = originalText;
                }
            }
            
            // Verify access rules
            // 0. Premium Gated rules if the test or its category is marked Paid/Premium
            var isGatedByCat = false;
            var testRootCat = _activeTest ? findRootCategoryForNode(_activeTest.id, 'test') : null;
            if (testRootCat && testRootCat.isPaid && !isCategoryUnlocked(testRootCat)) {
                if (_demoCategories[testRootCat.id] && _activeTest && isDemoFreeTest(_activeTest.id, testRootCat)) {
                    isGatedByCat = false; // Bypass for free demo test!
                } else {
                    isGatedByCat = true;
                }
            }
            if ((_activeTest.isPaid || isGatedByCat) && !_hasActiveCouponGrant) {
                if (isGatedByCat) {
                    hideOverlay();
                    showCategoryPaymentScreen(testRootCat);
                    return;
                }
                if (!_studentLoggedInUser) {
                    hideOverlay();
                    showCustomAlert("Authentication Required", "This is a Paid / Premium Mock Test. Student authorization is required. Redirecting to portal.", function() {
                        handleTabNavigation('acc');
                    });
                    return;
                }
            }

            // 1. Specific User Emails restriction check
            if (_activeTest.onlyUsers && _activeTest.onlyUsers.trim() && !_hasActiveCouponGrant) {
                const allowedUsers = _activeTest.onlyUsers.split(/[\\n,]+/).map(s => s.trim().toLowerCase()).filter(s => s);
                if (allowedUsers.length > 0) {
                    if (!_studentLoggedInUser) {
                        hideOverlay();
                        alert("Secure examination. You must log-in to continue.");
                        handleTabNavigation('acc');
                        return;
                    }
                    const isAllowed = allowedUsers.includes(_studentLoggedInUser.emailOrMobile.toLowerCase());
                    if (!isAllowed) {
                        hideOverlay();
                        alert("Access Denied! Your student credentials are not approved for this premium exam. Contact Taiyariya.");
                        return;
                    }
                }
            }

            // 2. Premium Locking Check via Attempt depletion
            // Coupon grants bypass
            const attemptCountKey = "attempts_test_" + _activeTest.id;
            let currentAttempts = parseInt(localStorage.getItem(attemptCountKey) || "0");

            // Check if test has unlimited attempts or is free with unlimited access
            const isUnlimitedAttemptsTest = Boolean(
                _activeTest.unlimitedAttempts === true ||
                _activeTest.freeAttempts === 0 ||
                _activeTest.freeAttempts === -1 ||
                _activeTest.freeAttempts === 'unlimited' ||
                (!_activeTest.isPaid && (_activeTest.unlimitedAttempts !== false || _activeTest.freeAttempts === 0 || _activeTest.freeAttempts === undefined || _activeTest.freeAttempts === null))
            );

            if (!isUnlimitedAttemptsTest && !_studentLoggedInUser) { // If student is NOT fully logged-in and test is NOT unlimited, enforce standard strict limit gating
                let maximumFreeAttempts = typeof _activeTest.freeAttempts === 'number' ? _activeTest.freeAttempts : 1;
                if (maximumFreeAttempts <= 0) {
                    maximumFreeAttempts = Infinity;
                }
                
                // Check if active voucher is registered
                let activeAttemptsAllowed = maximumFreeAttempts;
                if (_hasActiveCouponGrant) {
                    if (_hasActiveCouponGrant.maxAttempts === 'unlimited') {
                        activeAttemptsAllowed = Infinity;
                    } else {
                        const count = parseInt(_hasActiveCouponGrant.maxAttempts);
                        if (!isNaN(count)) activeAttemptsAllowed += count;
                    }
                }

                if (currentAttempts >= activeAttemptsAllowed) {
                    // Block and push payment
                    hideOverlay();
                    showGeneralPremiumPaymentScreen();
                    return;
                }
            }

            // Setup questions pool based on translations
            _activeQuestions = [];
            
            const langMapping = {
                en: _activeTest.questionsEn || [],
                hi: _activeTest.questionsHi || [],
                ...(_activeTest.questionsOther || {})
            };

            // Get list of all languages that actually have questions!
            _availableLanguages = Object.keys(langMapping).filter(l => langMapping[l] && langMapping[l].length > 0);
            if (_availableLanguages.length === 0) {
                _availableLanguages = ['en'];
            }
            
            _currentLanguage = _availableLanguages[0] || 'en';

            let maxLen = 0;
            _availableLanguages.forEach(l => {
                if (langMapping[l].length > maxLen) {
                    maxLen = langMapping[l].length;
                }
            });

            for (let idx = 0; idx < maxLen; idx++) {
                const questionBag = {};
                _availableLanguages.forEach(l => {
                    questionBag[l] = langMapping[l][idx] || null;
                });
                
                let fallbackCorrect = 1;
                for (let l of _availableLanguages) {
                    if (questionBag[l] && questionBag[l].c) {
                        fallbackCorrect = questionBag[l].c;
                        break;
                    }
                }
                
                questionBag.originalCorrect = fallbackCorrect;
                _activeQuestions.push(questionBag);
            }

            // Update Test Engine Language Toggle Button
            updateEngineLanguageUI();

            // Increment local registered attempts counter
            localStorage.setItem(attemptCountKey, (currentAttempts + 1).toString());

            // Increment public category attempts counter dynamically on test start
            if (_activeCategoryNodeForUrl) {
                var catId = _activeCategoryNodeForUrl.id;
                var catAttemptsKey = "_cat_attempts_" + catId;
                var currentCatAttempts = parseInt(localStorage.getItem(catAttemptsKey) || "0", 10);
                if (!currentCatAttempts) {
                    var defaultBase = 1100 + ((_activeCategoryNodeForUrl.name && _activeCategoryNodeForUrl.name.charCodeAt(0)) || 0) * 13 + ((catId && catId.charCodeAt(0)) || 0) * 7;
                    currentCatAttempts = defaultBase;
                }
                localStorage.setItem(catAttemptsKey, (currentCatAttempts + 1).toString());
            }

            // Bootstrap exam environment
            _testStateActiveNow = true;
            _testIsPaused = false;
            document.getElementById("testEngineName").innerText = _activeTest.title || "Examination Desk";
            _answersMap = {};
            _markedReviewMap = {};
            _revealedAnswersMap = {};
            _activeQIndex = 0;
            resetEngineAnswerToggle();

            // Wait for satisfying loader time so spinner spins beautifully
            await delayPromise;
            hideOverlay();

            // Launch timers
            document.getElementById("test-engine-panel").style.display = "flex";
            try { clearAllGoogleAds(); } catch(e) {}
            renderEngineQuestionItem();
            
            _timeRemainingSecs = (_activeTest.duration || 60) * 60;
            updateTestEngineTimerClockDisplay();

            if (_timeIntervalId) clearInterval(_timeIntervalId);
            _timeIntervalId = setInterval(() => {
                _timeRemainingSecs--;
                updateTestEngineTimerClockDisplay();

                if (_timeRemainingSecs <= 0) {
                    clearInterval(_timeIntervalId);
                    handleForceAutoSubmitTest();
                }
            }, 1000);
        }

        // Update Test Engine Language Toggle Button below topic name
        function updateEngineLanguageUI() {
            var btn = document.getElementById("engineLangToggleBtn");
            var label = document.getElementById("engineLangLabel");
            if (!btn) return;

            var hasMultipleLangs = false;
            if (Array.isArray(_availableLanguages) && _availableLanguages.length > 1) {
                hasMultipleLangs = true;
            } else if (Array.isArray(_activeQuestions)) {
                for (var i = 0; i < _activeQuestions.length; i++) {
                    if (getQuestionAvailableLanguages(_activeQuestions[i]).length > 1) {
                        hasMultipleLangs = true;
                        break;
                    }
                }
            }

            if (hasMultipleLangs) {
                btn.style.display = "inline-flex";
                var nextLangName = _currentLanguage === 'hi' ? 'ENGLISH' : 'HINDI';
                if (label) {
                    label.innerText = nextLangName;
                }
                btn.title = "Switch Language to " + nextLangName;
            } else {
                // If test has only 1 language, do not show switch button at all
                btn.style.display = "none";
            }
        }

        // Test Language Translation Toggle - instant change on tap
        function handleToggleLanguage() {
            var available = [];
            if (Array.isArray(_availableLanguages) && _availableLanguages.length > 1) {
                available = _availableLanguages;
            } else if (Array.isArray(_activeQuestions)) {
                var langSet = {};
                _activeQuestions.forEach(function(q) {
                    getQuestionAvailableLanguages(q).forEach(function(l) { langSet[l] = true; });
                });
                available = Object.keys(langSet);
            }

            if (available.length <= 1) {
                // Dusra language nahi hai toh switch na ho
                return;
            }

            var curIdx = available.indexOf(_currentLanguage);
            var nextIdx = curIdx === -1 ? 0 : (curIdx + 1) % available.length;
            _currentLanguage = available[nextIdx];
            
            updateEngineLanguageUI();
            renderEngineQuestionItem();
        }

        // Timer Clock Displays
        function updateTestEngineTimerClockDisplay() {
            const minutes = Math.floor(_timeRemainingSecs / 60);
            const seconds = _timeRemainingSecs % 60;
            const formatMin = minutes < 10 ? "0" + minutes : minutes;
            const formatSec = seconds < 10 ? "0" + seconds : seconds;
            document.getElementById("testTimerText").innerText = formatMin + ":" + formatSec;
        }

        // Rendering exam sheet items
        function renderEngineQuestionItem() {
            const container = document.getElementById("engineQsContent");
            container.innerHTML = "";

            const questionBlock = _activeQuestions[_activeQIndex];
            if (!questionBlock) return;

            // Pick standard translation node
            let qNode = questionBlock[_currentLanguage];
            if (!qNode) {
                for (let l of _availableLanguages) {
                    if (questionBlock[l]) {
                        qNode = questionBlock[l];
                        break;
                    }
                }
            }
            const isHi = _currentLanguage === 'hi' || /[\u0900-\u097F]/.test(qNode.q || '') || /[\u0900-\u097F]/.test((qNode.o || []).join(' '));
            const fontName = isHi ? "'Anek Devanagari', 'Anek Devnagari', sans-serif" : "'Outfit', sans-serif";
            const fontClass = isHi ? 'lang-hi' : 'lang-en';
            const qFontName = getFontForText(sanitizeQuestionText(qNode.q), fontName);
            const qFontStyle = "font-family: " + qFontName + " !important;";

            if (!qNode) {
                container.innerHTML = "<p>Error rendering item structure.</p>";
                return;
            }

            const isMarkedReview = _markedReviewMap[_activeQIndex] === true;
            const reviewBtn = document.getElementById("btnMarkReview");
            if (isMarkedReview) {
                reviewBtn.classList.add("active");
                reviewBtn.innerHTML = '<i class="ph-fill ph-bookmark-simple"></i> BOOKMARKED';
            } else {
                reviewBtn.classList.remove("active");
                reviewBtn.innerHTML = '<i class="ph-bold ph-bookmark-simple"></i> MARK FOR REVIEW';
            }

            // Create Visual Q block
            let sourceText = questionBlock.source || qNode.source || "";
            if (!sourceText) {
                for (let l of _availableLanguages) {
                    if (questionBlock[l] && questionBlock[l].source) {
                        sourceText = questionBlock[l].source;
                        break;
                    }
                }
            }
            if (!sourceText) {
                sourceText = extractBracketSource(qNode.q);
            }
            let sourceHtml = "";
            if (sourceText && !_hideSourceOnStudent) {
                const srcFontName = getFontForText(sourceText, fontName);
                sourceHtml = '<div style="margin: 8px 0 15px; padding: 8px 12px; background: #fffbeb; border-left: 4px solid #d97706; border-radius: 6px; font-size: 11px; font-weight: bold; color: #b45309; font-family: ' + srcFontName + ' !important;" class="engine-question-source">&#128214; <strong>:</strong> ' + sourceText.replace(/^:\s*/, '') + '</div>';
            }

            var isSaved = isQuestionSaved(_activeQIndex);
            var saveBtnHtml = '<button onclick="handleToggleSaveFromEngine(' + _activeQIndex + ')" style="background: none; border: none; color: ' + (isSaved ? '#22c55e' : '#009CFC') + '; font-size: 11px; font-weight: bold; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; margin-right: 12px;">' +
                '<i class="' + (isSaved ? 'ph-fill ph-bookmark-simple' : 'ph-bold ph-bookmark-simple') + '" style="font-size: 14px;"></i> ' + (isSaved ? 'Saved' : 'Save') +
                '</button>';

            const card = document.createElement("div");
            card.className = fontClass;
            card.innerHTML = 
                '<div class="engine-question-num" style="display: flex; justify-content: space-between; align-items: center; width: 100%;">' +
                '  <span style="font-family: Outfit, sans-serif !important;">QUESTION ' + (_activeQIndex + 1) + ' OF ' + _activeQuestions.length + '</span>' +
                '  <div style="display: flex; align-items: center;">' +
                '    ' + saveBtnHtml +
                '    <button class="report-q-btn" onclick="handleReportActiveQuestionIssue()" style="background: none; border: none; color: #ef4444; font-size: 11px; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 4px; font-family: Outfit, sans-serif !important;">' +
                '      <i class="ph-bold ph-warning-circle" style="font-size: 14px;"></i> Report' +
                '    </button>' +
                '  </div>' +
                '</div>' +
                '<div class="engine-question-text" style="' + qFontStyle + '">' + sanitizeQuestionText(qNode.q) + '</div>' +
                (qNode.image ? '<div class="engine-question-image-box" style="margin: 12px 0; text-align: center;"><img src="' + qNode.image + '" style="max-width: 100%; max-height: 280px; border-radius: 12px; border: 1.5px solid var(--border-color); box-shadow: 0 4px 15px rgba(0,0,0,0.05); object-fit: contain; background: white;" referrerPolicy="no-referrer"></div>' : '') +
                sourceHtml +
                '<div style="margin-top: 15px;" id="optionsRadioGroup"></div>';

            container.appendChild(card);

            // Populate options block with selection tracking
            const radioGroup = document.getElementById("optionsRadioGroup");
            const activeSel = _answersMap[_activeQIndex];

            qNode.o.forEach((optContent, idx) => {
                const optIdxVal = idx + 1;
                const isSelected = activeSel === optIdxVal;
                const oFontName = getFontForText(optContent, fontName);
                const oFontStyle = "font-family: " + oFontName + " !important;";
                
                const btn = document.createElement("button");
                btn.className = "option-button" + (isSelected ? " selected" : "");
                btn.setAttribute("style", oFontStyle);
                
                if (_showEngineAnswer) {
                    const isCorrectOption = optIdxVal === questionBlock.originalCorrect;
                    btn.style.cursor = "default";
                    if (isCorrectOption) {
                        btn.style.borderColor = "#2ecc71";
                        btn.style.background = "rgba(46, 204, 113, 0.08)";
                        btn.innerHTML = 
                            '<div class="option-badge" style="background:#2ecc71; border-color:#2ecc71; color:white; font-family: Outfit, sans-serif !important;">' + String.fromCharCode(65 + idx) + '</div>' +
                            '<span style="color:#27ae60; font-weight:bold; ' + oFontStyle + '">' + optContent + '</span>' +
                            '<i class="ph-fill ph-check-circle" style="color:#2ecc71; font-size:16px; margin-left:auto;"></i>';
                    } else if (isSelected) {
                        btn.style.borderColor = "#ef4444";
                        btn.style.background = "rgba(239, 68, 68, 0.08)";
                        btn.innerHTML = 
                            '<div class="option-badge" style="background:#ef4444; border-color:#ef4444; color:white; font-family: Outfit, sans-serif !important;">' + String.fromCharCode(65 + idx) + '</div>' +
                            '<span style="color:#c0392b; font-weight:bold; ' + oFontStyle + '">' + optContent + '</span>' +
                            '<i class="ph-fill ph-x-circle" style="color:#ef4444; font-size:16px; margin-left:auto;"></i>';
                    } else {
                        btn.style.opacity = "0.55";
                        btn.innerHTML = 
                            '<div class="option-badge" style="font-family: Outfit, sans-serif !important;">' + String.fromCharCode(65 + idx) + '</div>' +
                            '<span style="' + oFontStyle + '">' + optContent + '</span>';
                    }
                } else {
                    btn.onclick = () => handleSelectOptionChoice(optIdxVal);
                    btn.innerHTML = 
                        '<div class="option-badge" style="font-family: Outfit, sans-serif !important;">' + String.fromCharCode(65 + idx) + '</div>' +
                        '<span style="' + oFontStyle + '">' + optContent + '</span>';
                }
                
                radioGroup.appendChild(btn);
            });

            // Append explanation if answer mode is toggled on
            if (_showEngineAnswer) {
                const explDiv = document.createElement("div");
                explDiv.className = "analysis-explanation-box";
                explDiv.style.marginTop = "15px";
                explDiv.style.padding = "16px";
                explDiv.style.borderRadius = "12px";
                explDiv.style.fontSize = "13.5px";
                explDiv.style.lineHeight = "1.5";
                
                const expFontName = getFontForText(qNode.s, fontName);
                const expFontStyle = "font-family: " + expFontName + " !important;";
                explDiv.setAttribute("style", explDiv.getAttribute("style") + " " + expFontStyle);

                const correctLetter = String.fromCharCode(65 + questionBlock.originalCorrect - 1);
                explDiv.innerHTML = 
                    '<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px; font-weight: 900; color: #2ecc71; font-family: Outfit, sans-serif !important;">' +
                    '  <i class="ph-fill ph-check-circle" style="font-size: 18px; color: #2ecc71;"></i>' +
                    '  <span>CORRECT OPTION: ' + correctLetter + '</span>' +
                    '</div>' +
                    '<div>' +
                    '  <strong style="font-family: Outfit, sans-serif !important;">Explanation / Solution:</strong>' +
                    '  <div style="margin-top: 6px; font-weight: 500; ' + expFontStyle + '">' + formatMarkdownBold(qNode.s || "No explanation provided for this question.") + '</div>' +
                    '</div>';
                
                card.appendChild(explDiv);
            }

            // Disabled states control
            document.getElementById("btnPrevQ").disabled = _activeQIndex === 0;
            document.getElementById("btnNextQ").disabled = _activeQIndex === _activeQuestions.length - 1;

            triggerMathJax();
        }

        // Generate pre-filled defect email with structured metadata
        function handleReportActiveQuestionIssue(index) {
            const targetIdx = (typeof index === 'number') ? index : _activeQIndex;
            window._activeQIndexReported = targetIdx;
            document.getElementById("reportComplaintTextArea").value = "";
            document.getElementById("reportQuestionModal").style.display = "flex";
        }

        function handleCloseReportModal() {
            document.getElementById("reportQuestionModal").style.display = "none";
        }

        function resetEngineAnswerToggle() {
            _showEngineAnswer = false;
            const btn = document.getElementById("btnToggleEngineAnswer");
            const icon = document.getElementById("engineAnswerIcon");
            if (btn) {
                btn.style.background = "";
                btn.style.borderColor = "";
                btn.style.color = "";
            }
            if (icon) {
                icon.className = "ph-bold ph-eye-slash";
            }
        }

        window.handleToggleEngineAnswer = function() {
            _showEngineAnswer = !_showEngineAnswer;
            const btn = document.getElementById("btnToggleEngineAnswer");
            const icon = document.getElementById("engineAnswerIcon");
            if (_showEngineAnswer) {
                _revealedAnswersMap[_activeQIndex] = true;
                if (btn) {
                    btn.style.background = "rgba(46, 204, 113, 0.15)";
                    btn.style.borderColor = "#2ecc71";
                    btn.style.color = "#2ecc71";
                }
                if (icon) {
                    icon.className = "ph-fill ph-eye";
                }
            } else {
                if (btn) {
                    btn.style.background = "";
                    btn.style.borderColor = "";
                    btn.style.color = "";
                }
                if (icon) {
                    icon.className = "ph-bold ph-eye-slash";
                }
            }
            renderEngineQuestionItem();
        };

        window.handleReportActiveQuestionIssue = handleReportActiveQuestionIssue;
        window.handleCloseReportModal = handleCloseReportModal;

        window.handleToggleRevealedAnswers = function(isOpen) {
            const overlay = document.getElementById("revealedDrawerOverlay");
            const drawer = document.getElementById("revealedAnswersDrawer");
            if (overlay && drawer) {
                if (isOpen) {
                    overlay.style.display = "block";
                    drawer.style.display = "flex";
                } else {
                    overlay.style.display = "none";
                    drawer.style.display = "none";
                }
            }
        };

        window.handleShowRevealedAnswersModal = function() {
            // Rebuild indices list
            _revealedSlideIndicesList = [];
            _activeQuestions.forEach((qBlock, idx) => {
                if (_revealedAnswersMap[idx]) {
                    _revealedSlideIndicesList.push(idx);
                }
            });

            _currentRevealedSlideIdx = 0;

            const viewport = document.getElementById("revealedSlidesViewport");
            if (viewport) {
                viewport.innerHTML = "";

                if (_revealedSlideIndicesList.length === 0) {
                    // Render Empty State Slide
                    const emptyCard = document.createElement("div");
                    emptyCard.className = "revealed-slide-card";
                    emptyCard.id = "revealedSlideCard_0";
                    emptyCard.style.flex = "0 0 100%";
                    emptyCard.style.boxSizing = "border-box";
                    emptyCard.style.scrollSnapAlign = "start";
                    emptyCard.style.padding = "40px 20px";
                    emptyCard.style.textAlign = "center";
                    emptyCard.style.display = "flex";
                    emptyCard.style.flexDirection = "column";
                    emptyCard.style.alignItems = "center";
                    emptyCard.style.justifyContent = "center";
                    emptyCard.style.gap = "15px";
                    emptyCard.style.color = "var(--grey-text)";
                    
                    emptyCard.innerHTML = 
                        '<i class="ph-bold ph-eye" style="font-size: 48px; color: var(--grey-text); opacity: 0.5;"></i>' +
                        '<h4 style="margin: 0; font-weight: 800; color: var(--dark);">No Answers Revealed Yet</h4>' +
                        '<p style="margin: 0; font-size: 12px; line-height: 1.5; max-width: 250px; opacity: 0.8; font-family: inherit;">' +
                        '    During the practice test, you can tap the <strong>Eye Icon</strong> near the top to reveal answers and explanations instantly.' +
                        '</p>';
                    viewport.appendChild(emptyCard);
                    
                    // Hide indicator/nav if 0 items
                    document.getElementById("btnSlideRevealedPrev").style.display = "none";
                    document.getElementById("btnSlideRevealedNext").style.display = "none";
                    document.getElementById("revealedSlideIndicatorText").innerText = "Practice Assist";
                } else {
                    // Show indicator/nav
                    document.getElementById("btnSlideRevealedPrev").style.display = "flex";
                    document.getElementById("btnSlideRevealedNext").style.display = "flex";
                    
                    // Build slide card for each revealed question
                    _revealedSlideIndicesList.forEach((qIdx, slideIdx) => {
                        const questionBlock = _activeQuestions[qIdx];
                        const qNode = _currentLanguage === "hi" ? (questionBlock.hi || questionBlock.en) : (questionBlock.en || questionBlock.hi);
                        
                        const slideCard = document.createElement("div");
                        slideCard.className = "revealed-slide-card";
                        slideCard.id = "revealedSlideCard_" + slideIdx;
                        slideCard.style.flex = "0 0 100%";
                        slideCard.style.boxSizing = "border-box";
                        slideCard.style.scrollSnapAlign = "start";
                        slideCard.style.overflowY = "auto";
                        slideCard.style.padding = "4px";
                        slideCard.style.height = "100%";
                        
                        const isHi = _currentLanguage === 'hi' || /[\u0900-\u097F]/.test(qNode.q || '') || /[\u0900-\u097F]/.test((qNode.o || []).join(' '));
                        const fontName = isHi ? "'Anek Devanagari', 'Anek Devnagari', sans-serif" : "'Outfit', sans-serif";
                        const fontStyle = "font-family: " + fontName + " !important;";

                        const qFontName = getFontForText(sanitizeQuestionText(qNode.q), fontName);
                        const qFontStyle = "font-family: " + qFontName + " !important;";

                        // Options html
                        let optionsHtml = "";
                        const optionsList = qNode.o || [];
                        optionsList.forEach((optContent, optIdx) => {
                            const optIdxVal = optIdx + 1;
                            const isSelected = _answersMap[qIdx] === optIdxVal;
                            const isCorrect = optIdxVal === qNode.c;
                            
                            const oFontName = getFontForText(optContent, fontName);
                            const oFontStyle = "font-family: " + oFontName + " !important;";

                            let optClasses = "analysis-opt-box";
                            if (isCorrect) {
                                optClasses += " correct";
                            } else if (isSelected) {
                                optClasses += " wrong";
                            }
                            
                            const hasOptionAnalysis = qNode.oa && qNode.oa[optIdx] && qNode.oa[optIdx].trim().length > 0;
                            let oaHtml = "";
                            if (hasOptionAnalysis) {
                                const optAnalysisText = qNode.oa[optIdx].trim();
                                const oaFontName = getFontForText(optAnalysisText, fontName);
                                const oaFontStyle = "font-family: " + oaFontName + " !important;";
                                
                                let boxClasses = "option-analysis-expandable-box";
                                if (isCorrect) boxClasses += " oa-box-correct";
                                else if (isSelected) boxClasses += " oa-box-wrong";
                                else boxClasses += " oa-box-" + String.fromCharCode(97 + optIdx);

                                const boxLabel = "Option " + String.fromCharCode(65 + optIdx) + " Analysis";

                                oaHtml = '<div class="' + boxClasses + '" style="margin-top:4px; margin-bottom:8px; ' + oaFontStyle + '">' +
                                    '<div class="oa-box-label" style="font-family: Outfit, sans-serif !important;"><i class="ph-bold ph-info" style="font-size: 12px;"></i> ' + boxLabel + '</div>' +
                                    '<div class="oa-box-content" style="font-weight: 400 !important; ' + oaFontStyle + '">' + formatMarkdownBold(optAnalysisText) + '</div>' +
                                    '</div>';
                            }

                            const optionLetter = String.fromCharCode(65 + optIdx);
                            let optBadgeBg = "rgba(0,0,0,0.05)";
                            let optBadgeColor = "var(--dark)";
                            let optBadgeBorder = "1px solid var(--border-color)";
                            if (isCorrect) {
                                optBadgeBg = "#22c55e";
                                optBadgeColor = "#ffffff";
                                optBadgeBorder = "1px solid #22c55e";
                            } else if (isSelected) {
                                optBadgeBg = "#ef4444";
                                optBadgeColor = "#ffffff";
                                optBadgeBorder = "1px solid #ef4444";
                            }

                            optionsHtml += 
                                '<div style="margin-bottom: 8px;">' +
                                '  <div class="' + optClasses + '" style="font-weight: 400 !important; display: flex; align-items: center; gap: 8px; padding: 12px 14px; border-radius: 10px; ' + oFontStyle + '">' +
                                '      <div style="flex-grow: 1; display: flex; align-items: center; gap: 8px; ' + oFontStyle + '">' +
                                '          <span style="font-family: Outfit, sans-serif !important; font-weight: 700; width: 24px; height: 24px; border-radius: 6px; background: ' + optBadgeBg + '; color: ' + optBadgeColor + '; border: ' + optBadgeBorder + '; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;">' + optionLetter + '</span> <span style="font-weight: 400 !important; ' + oFontStyle + '">' + optContent + '</span>' +
                                '      </div>' +
                                '  </div>' +
                                oaHtml +
                                '</div>';
                        });

                        const correctLetter = String.fromCharCode(65 + qNode.c - 1);
                        const expFontName = getFontForText(qNode.s, fontName);
                        const expFontStyle = "font-family: " + expFontName + " !important;";

                        slideCard.innerHTML = 
                            '<div class="lang-' + (isHi ? 'hi' : 'en') + '" style="' + fontStyle + '">' +
                            '    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">' +
                            '        <span style="font-weight: 800; font-size: 11px; color: var(--primary); text-transform: uppercase; font-family: Outfit, sans-serif !important; letter-spacing: 0.5px;">Question ' + (qIdx + 1) + '</span>' +
                            '        <span style="background: rgba(16, 185, 129, 0.12); color: #10b981; font-weight: 700; font-size: 11px; padding: 2px 8px; border-radius: 6px; font-family: Outfit, sans-serif !important;">Correct: Option ' + correctLetter + '</span>' +
                            '    </div>' +
                            '    ' +
                            '    <div class="analysis-question-box" style="margin-bottom: 15px; margin-top: 5px; ' + qFontStyle + '">' +
                            '        <div class="analysis-question-text" style="' + qFontStyle + '">' + sanitizeQuestionText(qNode.q) + '</div>' +
                            '    </div>' +
                            '    ' +
                            (qNode.image ? '<div style="text-align: center; margin-bottom: 15px;"><img src="' + qNode.image + '" style="max-width: 100%; max-height: 180px; border-radius: 10px; border: 1px solid var(--border-color); object-fit: contain; background: white;" referrerPolicy="no-referrer"></div>' : '') +
                            '    ' +
                            '    <div style="margin-bottom: 15px;">' + optionsHtml + '</div>' +
                            '    ' +
                            '    <div class="analysis-explanation-box" style="padding: 14px; border-radius: 12px; font-size: 13.5px; line-height: 1.6; margin-top: 15px; ' + expFontStyle + '">' +
                            '        <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; font-weight: 800; color: var(--primary); font-size: 11.5px; text-transform: uppercase; font-family: Outfit, sans-serif !important;">' +
                            '            <i class="ph-bold ph-lightbulb" style="font-size: 15px; color: inherit;"></i>' +
                            '            <span>EXPLANATION / SOLUTION</span>' +
                            '        </div>' +
                            '        <div class="analysis-explanation-content" style="' + expFontStyle + '">' + formatMarkdownBold(qNode.s || 'No explanation provided for this question.') + '</div>' +
                            '    </div>' +
                            '</div>';
                        viewport.appendChild(slideCard);
                    });

                    // Setup swipe scroll listener to sync indicator dynamically
                    viewport.onscroll = () => {
                        const width = viewport.clientWidth;
                        if (width > 0) {
                            const scrollLeft = viewport.scrollLeft;
                            const index = Math.round(scrollLeft / width);
                            if (index >= 0 && index < _revealedSlideIndicesList.length && index !== _currentRevealedSlideIdx) {
                                _currentRevealedSlideIdx = index;
                                
                                const btnPrev = document.getElementById("btnSlideRevealedPrev");
                                const btnNext = document.getElementById("btnSlideRevealedNext");
                                if (btnPrev) btnPrev.disabled = _currentRevealedSlideIdx === 0;
                                if (btnNext) btnNext.disabled = _currentRevealedSlideIdx === _revealedSlideIndicesList.length - 1;
                                
                                const indicator = document.getElementById("revealedSlideIndicatorText");
                                if (indicator) {
                                    indicator.innerText = 'Question ' + (_currentRevealedSlideIdx + 1) + ' of ' + _revealedSlideIndicesList.length;
                                }
                            }
                        }
                    };
                }
            }

            // Open the sheet
            window.handleToggleRevealedAnswers(true);
            updateRevealedSlidesPositionAndUI();
        };

        window.handleSlideRevealedPrev = function() {
            if (_currentRevealedSlideIdx > 0 && _revealedSlideIndicesList.length > 0) {
                _currentRevealedSlideIdx--;
                updateRevealedSlidesPositionAndUI();
            }
        };

        window.handleSlideRevealedNext = function() {
            if (_currentRevealedSlideIdx < _revealedSlideIndicesList.length - 1 && _revealedSlideIndicesList.length > 0) {
                _currentRevealedSlideIdx++;
                updateRevealedSlidesPositionAndUI();
            }
        };

        function updateRevealedSlidesPositionAndUI() {
            const viewport = document.getElementById("revealedSlidesViewport");
            if (!viewport || _revealedSlideIndicesList.length === 0) return;
            
            const btnPrev = document.getElementById("btnSlideRevealedPrev");
            const btnNext = document.getElementById("btnSlideRevealedNext");
            if (btnPrev) btnPrev.disabled = _currentRevealedSlideIdx === 0;
            if (btnNext) btnNext.disabled = _currentRevealedSlideIdx === _revealedSlideIndicesList.length - 1;
            
            const indicator = document.getElementById("revealedSlideIndicatorText");
            if (indicator) {
                indicator.innerText = 'Question ' + (_currentRevealedSlideIdx + 1) + ' of ' + _revealedSlideIndicesList.length;
            }
            
            const card = document.getElementById("revealedSlideCard_" + _currentRevealedSlideIdx);
            if (card) {
                viewport.scrollTo({
                    left: card.offsetLeft,
                    behavior: 'smooth'
                });
            }
        }

        window.toggleOptionAnalysis = function(qIndex, optIndex) {
            const elId = 'oa-box-' + qIndex + '-' + optIndex;
            const arrowId = 'oa-arrow-' + qIndex + '-' + optIndex;
            const box = document.getElementById(elId);
            const arrow = document.getElementById(arrowId);
            if (box) {
                if (box.style.display === 'none' || !box.style.display) {
                    box.style.display = 'block';
                    if (arrow) arrow.style.transform = 'rotate(180deg)';
                } else {
                    box.style.display = 'none';
                    if (arrow) arrow.style.transform = 'rotate(0deg)';
                }
            }
        };

        // Handle direct MCQ selections
        function handleSelectOptionChoice(optIndexVal) {
            const currentSelVal = _answersMap[_activeQIndex];
            
            // Toggle selection logic: if selected again, deselect option
            if (currentSelVal === optIndexVal) {
                _answersMap[_activeQIndex] = null;
            } else {
                _answersMap[_activeQIndex] = optIndexVal;
            }
            renderEngineQuestionItem();
        }

        // Palette Toggle Drawer Controllers
        function handleTogglePalette(isOpened) {
            const sheet = document.getElementById("paletteDrawerContainer");
            const overlay = document.getElementById("paletteDrawerOverlay");

            if (isOpened) {
                renderPaletteGridCells();
                sheet.style.display = "flex";
                overlay.style.display = "block";
            } else {
                sheet.style.display = "none";
                overlay.style.display = "none";
            }
        }

        function renderPaletteGridCells() {
            const target = document.getElementById("paletteGridContent");
            target.innerHTML = "";

            _activeQuestions.forEach((_, idx) => {
                const isSaved = _answersMap[idx] !== undefined && _answersMap[idx] !== null;
                const isMarked = _markedReviewMap[idx] === true;

                let cellClass = "not-visited";
                if (isSaved) cellClass = "answered";
                else if (isMarked) cellClass = "review-marked";

                const btn = document.createElement("button");
                btn.className = "palette-cell " + cellClass;
                btn.innerText = (idx + 1).toString();
                btn.onclick = () => {
                    _activeQIndex = idx;
                    resetEngineAnswerToggle();
                    handleTogglePalette(false);
                    renderEngineQuestionItem();
                };

                target.appendChild(btn);
            });
        }

        // Review markers and index shifting
        function handleToggleMarkReview() {
            _markedReviewMap[_activeQIndex] = !_markedReviewMap[_activeQIndex];
            renderEngineQuestionItem();
        }

        function handleNextQuestion() {
            if (_activeQIndex < _activeQuestions.length - 1) {
                _activeQIndex++;
                resetEngineAnswerToggle();
                renderEngineQuestionItem();
            }
        }

        function handlePrevQuestion() {
            if (_activeQIndex > 0) {
                _activeQIndex--;
                resetEngineAnswerToggle();
                renderEngineQuestionItem();
            }
        }

        // Submission score computations
        function handleForceAutoSubmitTest() {
            _isAutoSubmitting = true;
            finalizeSubmissionAndShowAnalysis();
            showCustomAlert("Time Expired", "Times Up! Your mock examination paper has been automatically submitted.", function() {
                _isAutoSubmitting = false;
            });
        }

        function handlePromptSubmitTest() {
            const answeredCount = Object.values(_answersMap).filter(val => val !== null && val !== undefined).length;
            const totalQCount = _activeQuestions ? _activeQuestions.length : 0;
            const unattemptedCount = Math.max(0, totalQCount - answeredCount);

            const modal = document.getElementById("submitConfirmModal");
            const attEl = document.getElementById("confirmAttemptedCount");
            const unattEl = document.getElementById("confirmUnattemptedCount");
            if (modal && attEl && unattEl) {
                attEl.innerText = answeredCount;
                unattEl.innerText = unattemptedCount;
                modal.style.display = "flex";
                return;
            }

            const confirmMsg = "Are you absolutely confident about submitting your assessment? \\u2714\\n\\nAnswered: " + answeredCount + " of " + totalQCount + " questions.";
            showCustomConfirm("Submit Assessment", confirmMsg, function() {
                finalizeSubmissionAndShowAnalysis();
            });
        }

        function handleConfirmSubmitTest() {
            var modal = document.getElementById("submitConfirmModal");
            if (modal) modal.style.display = "none";
            finalizeSubmissionAndShowAnalysis();
        }

        function handleCloseSubmitConfirmModal() {
            var modal = document.getElementById("submitConfirmModal");
            if (modal) modal.style.display = "none";
        }

        function finalizeSubmissionAndShowAnalysis() {
            _testStateActiveNow = false;
            _testIsPaused = false;
            if (_timeIntervalId) clearInterval(_timeIntervalId);
            document.getElementById("test-engine-panel").style.display = "none";

            // Score evaluation
            let correctCount = 0;
            let incorrectCount = 0;
            let unansweredCount = 0;
            let revealedCount = 0;

            _activeQuestions.forEach((qBlock, idx) => {
                if (_revealedAnswersMap[idx]) {
                    revealedCount++;
                }
                const selectAns = _answersMap[idx];
                if (selectAns === undefined || selectAns === null) {
                    unansweredCount++;
                } else if (selectAns === qBlock.originalCorrect) {
                    correctCount++;
                } else {
                    incorrectCount++;
                }
            });

            const positiveMarks = _activeTest.posMarks || 1;
            const negativeMarks = _activeTest.negMarks || 0;
            const calculatedTotalScoreValue = (correctCount * positiveMarks) - (incorrectCount * negativeMarks);

            // Display scorecard stats values
            document.getElementById("statCorrectCountText").innerText = correctCount;
            document.getElementById("statIncorrectCountText").innerText = incorrectCount;
            document.getElementById("statUnansweredCountText").innerText = unansweredCount;
            document.getElementById("statTotalItemsText").innerText = _activeQuestions.length;
            document.getElementById("statTotalScoreCalcText").innerText = calculatedTotalScoreValue.toFixed(2);

            const revealedEl = document.getElementById("statRevealedAnswersCount");
            if (revealedEl) {
                revealedEl.innerText = revealedCount;
            }

            const totalScorePossibleValue = _activeQuestions.length * positiveMarks;
            document.getElementById("statTotalPossibleMarks").innerText = "/ " + totalScorePossibleValue.toFixed(2);

            const accuracyVal = _activeQuestions.length > 0 ? Math.round((correctCount / _activeQuestions.length) * 100) : 0;
            document.getElementById("statAccuracyPercent").innerText = accuracyVal + "%";

            const perfBadgeEl = document.getElementById("statPerformanceBadge");
            if (perfBadgeEl) {
                perfBadgeEl.removeAttribute("style");
                if (accuracyVal >= 80) {
                    perfBadgeEl.innerText = "Outstanding";
                    perfBadgeEl.className = "sc-perf-badge badge-outstanding";
                } else if (accuracyVal >= 60) {
                    perfBadgeEl.innerText = "Good Score";
                    perfBadgeEl.className = "sc-perf-badge badge-good";
                } else if (accuracyVal >= 40) {
                    perfBadgeEl.innerText = "Average";
                    perfBadgeEl.className = "sc-perf-badge badge-average";
                } else {
                    perfBadgeEl.innerText = "Needs Practice";
                    perfBadgeEl.className = "sc-perf-badge badge-practice";
                }
            }

            const totalSecsTaken = (_activeTest.duration * 60) - _timeRemainingSecs;
            const durationMinutesText = Math.floor(totalSecsTaken / 60) + "m " + (totalSecsTaken % 60) + "s";
            document.getElementById("statDurationSpent").innerText = durationMinutesText;

            const resultsTopicHeaderEl = document.getElementById("resultsTopicHeader");
            if (resultsTopicHeaderEl) {
                resultsTopicHeaderEl.innerText = _activeTest.title || "MOCK ASSESSMENT";
            }

            // Populate Results Question inline horizontal scrollable palette with interactive filtering
            handleFilterAnalysisQuestions('all', false);

            // Live Leaderboards & Analytics submissions (Features 21 & 26)
            let candidateName = "";
            if (_studentLoggedInUser) {
                candidateName = _studentLoggedInUser.name || _studentLoggedInUser.emailOrMobile || "Logged-in Aspirant";
            } else {
                const storedName = localStorage.getItem("_last_aspirant_name");
                if (storedName && storedName.trim()) {
                    candidateName = storedName.trim();
                } else {
                    if (typeof _isAutoSubmitting !== 'undefined' && _isAutoSubmitting) {
                        candidateName = "Aspirant " + Math.floor(100 + Math.random() * 900);
                        localStorage.setItem("_last_aspirant_name", candidateName);
                    } else {
                        try {
                            const promptVal = prompt("Enter your Name to show on the Leaderboard (Optional):", "Aspirant " + Math.floor(100 + Math.random() * 900));
                            candidateName = (promptVal && promptVal.trim()) ? promptVal.trim() : ("Aspirant " + Math.floor(100 + Math.random() * 900));
                            localStorage.setItem("_last_aspirant_name", candidateName);
                        } catch(e) {
                            candidateName = "Guest Aspirant";
                        }
                    }
                }
            }

            const attemptCountKey = "attempts_test_" + _activeTest.id;
            const currentAttempts = parseInt(localStorage.getItem(attemptCountKey) || "1");

            const activeRecord = {
                studentName: candidateName,
                score: calculatedTotalScoreValue,
                obtainedMarks: calculatedTotalScoreValue,
                totalMarksPossible: totalScorePossibleValue,
                attemptNum: currentAttempts,
                correct: correctCount,
                incorrect: incorrectCount,
                duration: durationMinutesText,
                date: new Date().toISOString().split("T")[0],
                timeTaken: totalSecsTaken
            };

            // 1. Submit attempt to current test leaderboard
            fetch(getApiUrl("/api/leaderboard"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    testId: _activeTest.id,
                    activeRecord: activeRecord
                })
            })
            .then(r => r.json())
            .then(ldata => {
                if (ldata.success) {
                    renderTestLeaderboardTable(ldata.leaderboard);
                } else {
                    // Fallback to fetch existing leaderboard
                    fetch(getApiUrl("/api/leaderboard/" + _activeTest.id))
                    .then(res => res.json())
                    .then(ld => renderTestLeaderboardTable(ld))
                    .catch(e => console.error(e));
                }
            })
            .catch(err => {
                console.error("Leaderboard submission error", err);
                fetch(getApiUrl("/api/leaderboard/" + _activeTest.id))
                .then(r => r.json())
                .then(ldata => {
                    renderTestLeaderboardTable(ldata);
                })
                .catch(err2 => console.error("Leaderboard fallback query error", err2));
            });

            // 2. Register attempt specs in global student analytics profile
            if (_studentLoggedInUser) {
                fetch(getApiUrl("/api/analytics/submit"), {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: _studentLoggedInUser.emailOrMobile,
                        obtainedScore: calculatedTotalScoreValue,
                        totalScore: totalScorePossibleValue,
                        timeTakenSecs: totalSecsTaken
                    })
                })
                .catch(err => console.error("Student analytics logging error", err));
            }

            const leadBlock = document.getElementById("resultsLeaderboardBlock");
            if (leadBlock) {
                leadBlock.style.display = "block";
            }
            navigateToScreen("scr-results", "Analyses Hub");
        }

        function renderTestLeaderboardTable(rows) {
            const tbody = document.getElementById("leaderboardTBodyContent");
            if (!tbody) return;
            tbody.innerHTML = "";

            let rowList = [];
            if (Array.isArray(rows)) {
                rowList = rows;
            } else if (rows && Array.isArray(rows.leaderboard)) {
                rowList = rows.leaderboard;
            } else if (rows && Array.isArray(rows.rows)) {
                rowList = rows.rows;
            }

            if (!rowList || rowList.length === 0) {
                tbody.innerHTML = "<tr><td colspan='5' style='padding: 18px; text-align: center; color: var(--grey-text);'>Be the first to submit a mock test attempt!</td></tr>";
                return;
            }

            const loggedInName = _studentLoggedInUser ? (_studentLoggedInUser.name || _studentLoggedInUser.emailOrMobile || "") : "";
            const lastSubmittedName = localStorage.getItem("_last_aspirant_name") || "";

            // Find best attempt index
            let myRowIndex = -1;
            rowList.forEach((row, idx) => {
                const name = (row.studentName || "").toLowerCase();
                const matchesLoggedIn = loggedInName && name === loggedInName.toLowerCase();
                const matchesLastSub = lastSubmittedName && name === lastSubmittedName.toLowerCase();
                if ((matchesLoggedIn || matchesLastSub) && myRowIndex === -1) {
                    myRowIndex = idx;
                }
            });

            // Create or update a celebration Standing Alert Badge at the top of results
            let alertBar = document.getElementById("leaderboardRankAlertBar");
            if (!alertBar) {
                alertBar = document.createElement("div");
                alertBar.id = "leaderboardRankAlertBar";
                // Insert it right above the first panel in results screen
                const leaderboardBlock = document.getElementById("resultsLeaderboardBlock");
                if (leaderboardBlock) {
                    leaderboardBlock.insertBefore(alertBar, leaderboardBlock.firstChild);
                }
            }

            if (myRowIndex !== -1) {
                const rank = myRowIndex + 1;
                let prize = "&#127942;";
                if (rank === 1) prize = "&#129351;";
                else if (rank === 2) prize = "&#129352;";
                else if (rank === 3) prize = "&#129353;";

                alertBar.className = "you-rank-alert";
                alertBar.style.cssText = "background: #fef3c7; border: 1.5px solid #f59e0b; padding: 14px; border-radius: 12px; margin-bottom: 16px; font-weight: 800; color: #b45309; text-align: center; font-size: 14px; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 12px rgba(245,158,11,0.15); display: flex !important;";
                alertBar.innerHTML = "<span>" + prize + "</span> Your Standing: <strong>Rank #" + rank + "</strong> out of " + rowList.length + " Candidates!";
            } else {
                alertBar.style.display = "none";
            }

            rowList.forEach((row, idx) => {
                const rank = idx + 1;
                let rankLabel = rank.toString();
                if (rank === 1) rankLabel = "&#129351; 1";
                else if (rank === 2) rankLabel = "&#129352; 2";
                else if (rank === 3) rankLabel = "&#129353; 3";

                const obMarks = parseFloat(row.obtainedMarks !== undefined ? row.obtainedMarks : row.score || 0).toFixed(2);
                const totPossible = parseFloat(row.totalMarksPossible || row.totalScore || 0).toFixed(2);
                const attemptLabel = "Attempt " + (row.attemptNum || 1);

                const name = (row.studentName || "").toLowerCase();
                const isYou = (loggedInName && name === loggedInName.toLowerCase()) || 
                              (lastSubmittedName && name === lastSubmittedName.toLowerCase());

                const tr = document.createElement("tr");
                tr.style.borderBottom = "1px solid var(--border-color)";
                
                if (isYou) {
                    tr.style.backgroundColor = "rgba(245, 158, 11, 0.12)";
                    tr.style.fontWeight = "bold";
                    tr.style.borderLeft = "4px solid #f59e0b";
                }

                const youBadge = isYou ? " <span style='background:#f59e0b; color:#ffffff; font-size:9.5px; padding:2px 6px; border-radius:8px; margin-left:6px; font-weight:bold;'>YOU</span>" : "";

                tr.innerHTML = "<td style='padding: 12px 14px; font-weight: bold; color: var(--dark);'>" + rankLabel + "</td>" +
                    "<td style='padding: 12px 14px; font-weight: 600;'>" + row.studentName + youBadge + "</td>" +
                    "<td style='padding: 12px 14px; text-align: center; font-weight: bold; color: #22c55e;'>" + obMarks + " <span style='font-size:10px; color:var(--grey-text); font-weight:normal;'>/ " + totPossible + "</span></td>" +
                    "<td style='padding: 12px 14px; text-align: center; font-weight: bold; color: var(--grey-text); font-size: 11.5px;'>" + attemptLabel + "</td>" +
                    "<td style='padding: 12px 14px; text-align: right; font-family: monospace; color: var(--grey-text); font-size: 11.5px;'>" + (row.duration || "N/A") + "</td>";
                tbody.appendChild(tr);
            });
        }

        // Open detailed explanation analysis popups
        function handleOpenDetailedAnalysisItem_old(index) {
            const modal = document.getElementById("itemDetailedAnalysisModal");
            const scrollArea = document.getElementById("itemAnalysisScrollViewArea");
            document.getElementById("analysisItemIndexHeader").innerText = "Question " + (index + 1);

            scrollArea.innerHTML = "";
            const qBlock = _activeQuestions[index];
            if (!qBlock) return;

            // Match translations if available
            const excludeKeys = ['originalCorrect', 'source', 'id'];
            const blockEl = document.createElement("div");
            blockEl.innerHTML = "";

            Object.keys(qBlock).forEach(langKey => {
                const excludeKeys = ['originalCorrect', 'source', 'id'];
                if (excludeKeys.indexOf(langKey) !== -1 || !qBlock[langKey]) return;
                
                const qNode = qBlock[langKey];
                if (typeof qNode !== 'object' || !qNode || !Array.isArray(qNode.o)) return;

                const isHi = langKey === 'hi' || /[\u0900-\u097F]/.test(qNode.q || '') || /[\u0900-\u097F]/.test((qNode.o || []).join(' '));
                const fontName = isHi ? "'Anek Devanagari', 'Anek Devnagari', sans-serif" : "'Outfit', sans-serif";
                const qFontName = getFontForText(qNode.q, fontName);
                const qFontStyle = "font-family: " + qFontName + " !important;";

                const optSelectionsHtml = qNode.o.map((oVal, idx) => {
                    const optIdx = idx + 1;
                    const isCorrect = optIdx === qNode.c;
                    const isSelected = _answersMap[index] === optIdx;

                    const oFontName = getFontForText(oVal, fontName);
                    const oFontStyle = "font-family: " + oFontName + " !important;";

                    let classes = "analysis-opt-box";
                    if (isCorrect) {
                        classes += " correct";
                    } else if (isSelected) {
                        classes += " wrong";
                    }

                    let style = "font-weight: 400 !important; " + oFontStyle;

                    const hasOptionAnalysis = qNode.oa && qNode.oa[idx] && qNode.oa[idx].trim().length > 0;
                    let arrowHtml = "";
                    let analysisBoxHtml = "";
                    let extraProps = 'style="' + style + ' display:flex; align-items:center; justify-content:space-between; width:100%;"';

                    if (hasOptionAnalysis) {
                        const optAnalysisText = qNode.oa[idx].trim();
                        const oaFontName = getFontForText(optAnalysisText, fontName);
                        const oaFontStyle = "font-family: " + oaFontName + " !important;";

                        arrowHtml = '<div style="color:inherit; padding:4px 8px; display:inline-flex; align-items:center; justify-content:center; margin-left:auto;">' +
                            '<i id="oa-arrow-' + index + '-' + idx + '" class="ph-bold ph-caret-down" style="transition: transform 0.25s ease; font-size:16px;"></i>' +
                            '</div>';

                        let boxClasses = "option-analysis-expandable-box";
                        if (isCorrect) {
                            boxClasses += " oa-box-correct";
                        } else if (isSelected) {
                            boxClasses += " oa-box-wrong";
                        } else {
                            if (idx === 0) boxClasses += " oa-box-a";
                            else if (idx === 1) boxClasses += " oa-box-b";
                            else if (idx === 2) boxClasses += " oa-box-c";
                            else if (idx === 3) boxClasses += " oa-box-d";
                            else boxClasses += " oa-box-e";
                        }

                        const boxLabel = "Option " + String.fromCharCode(65 + idx) + " Analysis";

                        analysisBoxHtml = '<div id="oa-box-' + index + '-' + idx + '" class="' + boxClasses + '" style="display:none; ' + oaFontStyle + '">' +
                            '<div class="oa-box-label">' + boxLabel + '</div>' +
                            '<div class="oa-box-content" style="font-weight: 400 !important; ' + oaFontStyle + '">' + formatMarkdownBold(optAnalysisText) + '</div>' +
                            '</div>';

                        extraProps = 'onclick="toggleOptionAnalysis(' + index + ', ' + idx + ')" style="' + style + ' display:flex; align-items:center; justify-content:space-between; width:100%; cursor:pointer;"';
                    }

                    return '<div style="margin-bottom:8px;">' +
                        '<div class="' + classes + '" ' + extraProps + '>' + 
                        '<div style="flex-grow:1; display:flex; align-items:center; gap:6px; ' + oFontStyle + '"><span style="font-family: Outfit, sans-serif !important; font-weight:700;">' + String.fromCharCode(65 + idx) + ')</span> <span style="font-weight: 400 !important; ' + oFontStyle + '">' + oVal + '</span></div>' +
                        arrowHtml +
                        '</div>' +
                        analysisBoxHtml +
                        '</div>';
                }).join('');

                const isStandardEn = langKey === 'en';
                const isStandardHi = langKey === 'hi';
                const langTitle = isStandardEn ? 'ENGLISH VERSION' : (isStandardHi ? 'HINDI VERSION (हिंदी)' : \`\${langKey.toUpperCase()} VERSION\`);

                const finalExpFont = getFontForText(qNode.s, fontName);
                blockEl.innerHTML += \`
                    <div class="lang-\${langKey}" style="border-bottom:1px dashed var(--border-color); padding-bottom:15px; margin-bottom:15px; font-family: \${fontName} !important;">
                        <span style="font-size:10px; font-weight:bold; color:var(--primary); font-family: Outfit, sans-serif !important;">\${langTitle}</span>
                        <div class="analysis-question-box" style="\${qFontStyle}"><div class="analysis-question-text" style="\${qFontStyle}">\${qNode.q}</div></div>
                        \${qNode.image ? '<div style="text-align:center; padding:10px 0;"><img src="' + qNode.image + '" style="max-width:100%; max-height:240px; border-radius:10px; border:1px solid var(--border-color); background:white;" referrerPolicy="no-referrer"></div>' : ''}
                        \${optSelectionsHtml}
                        \${qNode.s ? '<div class="analysis-explanation-box" style="font-family: ' + finalExpFont + ' !important;"><strong style="font-family: Outfit, sans-serif !important;">Explanation / Solution:</strong> <div class="analysis-explanation-content" style="margin-top:6px; font-family: ' + finalExpFont + ' !important;">' + formatMarkdownBold(qNode.s) + '</div></div>' : ''}
                    </div>
                \`;
            });

            // Extract source reference attributes
            let sourceText = qBlock.source || "";
            if (!sourceText) {
                // look in any of the language nodes
                for (let l of Object.keys(qBlock)) {
                    if (excludeKeys.indexOf(l) === -1 && qBlock[l] && qBlock[l].source) {
                        sourceText = qBlock[l].source;
                        break;
                    }
                }
            }
            if (!sourceText) {
                for (let l of Object.keys(qBlock)) {
                    if (excludeKeys.indexOf(l) === -1 && qBlock[l] && qBlock[l].q) {
                        sourceText = extractBracketSource(qBlock[l].q);
                        if (sourceText) break;
                    }
                }
            }
            const _hideSourceOnStudent = ${!!social.hideSourceOnStudent};
            if (sourceText && !_hideSourceOnStudent) {
                const srcEl = document.createElement("div");
                srcEl.style.marginTop = "15px";
                srcEl.style.padding = "8px 12px";
                srcEl.style.background = "#fffbeb";
                srcEl.style.borderLeft = "4px solid #d97706";
                srcEl.style.borderRadius = "4px";
                srcEl.style.fontSize = "11px";
                srcEl.style.fontWeight = "bold";
                srcEl.style.color = "#b45309";
                srcEl.innerHTML = "<strong>&#128214; :</strong> " + sourceText.replace(/^:\s*/, '');
                blockEl.appendChild(srcEl);
            }

            scrollArea.appendChild(blockEl);
            modal.style.display = "flex";
            triggerMathJax();
        }

        function handleCloseAnalysisModal_old() {
            document.getElementById("itemDetailedAnalysisModal").style.display = "none";
        }

        function updateDynamicDashboardGreeting() {
            const greetTitleEl = document.getElementById("displayGreetText");
            const greetSubEl = document.getElementById("displayGreetSubtitle");
            if (!greetTitleEl || !greetSubEl) return;

            const headerAccountIconEl = document.getElementById("headerAccountIcon");

            if (_studentLoggedInUser) {
                // Dynamic premium greet details
                greetTitleEl.innerText = "Hi " + _studentLoggedInUser.name + "!";
                
                // Calculate active unlocks
                var unlockedCount = (_studentLoggedInUser.unlockedCategoryIds || []).length;
                if (unlockedCount > 0) {
                    greetSubEl.innerText = "Premium Active | " + unlockedCount + " Category Unlock" + (unlockedCount > 1 ? "s" : "");
                } else {
                    greetSubEl.innerText = "Free Account | Explore Mock Tests";
                }

                // Dynamic icon and visual style update when logged in
                if (headerAccountIconEl) {
                    headerAccountIconEl.className = "ph ph-user-check";
                    headerAccountIconEl.style.color = "var(--primary)";
                }
            } else {
                // Fallback to defaults
                greetTitleEl.innerText = DB.studentGreeting || "Hi, Aspirant!";
                greetSubEl.innerText = DB.studentSubGreeting || "TAIYARIYA PROFESSIONAL HUB";

                // Restore default user icon when logged out
                if (headerAccountIconEl) {
                    headerAccountIconEl.className = "ph ph-user";
                    headerAccountIconEl.style.color = "";
                }
            }
        }

        // Student Account Gateway Authorization
        function loadStudentAnalyticsDashboard() {
            if (!_studentLoggedInUser) return;
            const email = _studentLoggedInUser.emailOrMobile;
            const name = _studentLoggedInUser.name;

            // Fetch overall analytics summary
            fetch(getApiUrl("/api/admin/analytics"))
                .then(r => r.json())
                .then(analytics => {
                    const studentProfile = analytics[email] || {
                        totalTestsAttempted: 0,
                        bestScore: 0,
                        averageScore: 0,
                        totalTimeSpent: 0
                    };

                    document.getElementById("panelTotalAttempts").innerText = studentProfile.totalTestsAttempted + " Tests";
                    document.getElementById("panelHighestScore").innerText = parseFloat(studentProfile.bestScore || 0).toFixed(2);
                    document.getElementById("panelAverageScore").innerText = parseFloat(studentProfile.averageScore || 0).toFixed(2) + "%";
                    
                    const rawHours = (studentProfile.totalTimeSpent || 0) / 3600;
                    const totalHrsSpent = rawHours.toFixed(1);
                    const totalHrsSpentStr = totalHrsSpent.endsWith(".0") ? rawHours.toFixed(0) : totalHrsSpent;
                    document.getElementById("panelTotalStudyTime").innerText = totalHrsSpentStr + "h Spent";
                })
                .catch(err => console.error("Error loading user profile analytics", err));

            // Fetch previous completed examination attempts (Feature 26 Integration)
            fetch(getApiUrl("/api/student/attempts/" + encodeURIComponent(name)))
                .then(r => r.json())
                .then(ldata => {
                    const tbody = document.getElementById("personalAttemptsListBody");
                    if (!tbody) return;
                    tbody.innerHTML = "";

                    if (!ldata.attempts || ldata.attempts.length === 0) {
                        tbody.innerHTML = "<tr><td colspan='3' style='padding: 20px; text-align: center; color: var(--grey-text);'>No assessments recorded yet. Start practicing!</td></tr>";
                        return;
                    }

                    // Sort attempts newest-first
                    const sorted = ldata.attempts.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                    sorted.forEach(attempt => {
                        const tr = document.createElement("tr");
                        tr.style.borderBottom = "1px solid var(--border-color)";
                        tr.innerHTML = "<td style='padding: 10px 12px; font-weight: 600;'>" +
                            "<div style='color: var(--dark);'>" + (attempt.quizTitle || "Mock Test") + "</div>" +
                            "<div style='font-size: 9.5px; color: var(--grey-text); margin-top: 2px;'>" + (attempt.date || "") + "</div>" +
                            "</td>" +
                            "<td style='padding: 10px 12px; text-align: center; font-weight: bold; color: #22c55e;'>" + parseFloat(attempt.score).toFixed(2) + "</td>" +
                            "<td style='padding: 10px 12px; text-align: right; color: var(--grey-text); font-size: 11px;'>" + (attempt.duration || "N/A") + "</td>";
                        tbody.appendChild(tr);
                    });
                })
                .catch(err => console.error("Error loading historical attempts", err));
        }

        function refreshStudentAccountProfileGate() {
            const studentAuthFormPanel = document.getElementById("studentAuthFormPanel");
            const studentAuthenticatedProfileArea = document.getElementById("studentAuthenticatedProfileArea");

            if (_studentLoggedInUser) {
                studentAuthFormPanel.style.display = "none";
                studentAuthenticatedProfileArea.style.display = "block";
                document.getElementById("studentUserHeaderName").innerText = _studentLoggedInUser.name;
                document.getElementById("studentUserHeaderMail").innerText = _studentLoggedInUser.emailOrMobile;
                buildSecurityAntiLeakOverlay(_studentLoggedInUser.emailOrMobile);
                
                // List unlocked categories dynamically (Feature 25)
                var unlockedIds = _studentLoggedInUser.unlockedCategoryIds || [];
                var categoryNames = [];
                var allExpired = true;
                var hasAnyExpiry = false;
                
                var allCats = (DB.testCategories || []).concat(DB.pdfCategories || []);
                unlockedIds.forEach(function(id) {
                    var found = allCats.find(function(c) { return c.id === id; });
                    if (found) {
                        var expLabel = "Lifetime";
                        var isCurrentExpired = false;
                        var catExpiry = null;
                        var isCatLifetime = false;
                        var hasSpecific = false;
                        if (_studentLoggedInUser.categoryDates && _studentLoggedInUser.categoryDates[id]) {
                            var catData = _studentLoggedInUser.categoryDates[id];
                            if (catData.isLifetime) {
                                isCatLifetime = true;
                                hasSpecific = true;
                            } else if (catData.expiryDate && catData.expiryDate.trim() !== "") {
                                catExpiry = catData.expiryDate;
                                hasSpecific = true;
                            }
                        }
                        if (!hasSpecific) {
                            if (_studentLoggedInUser.expiryDate && _studentLoggedInUser.expiryDate.trim() !== "") {
                                catExpiry = _studentLoggedInUser.expiryDate;
                            } else {
                                isCatLifetime = true;
                            }
                        }
                        
                        if (isCatLifetime) {
                            expLabel = "Lifetime";
                            allExpired = false;
                        } else if (catExpiry) {
                            hasAnyExpiry = true;
                            var exp = new Date(catExpiry);
                            var diffMs = exp.getTime() - Date.now();
                            var diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
                            if (diffDays > 0) {
                                expLabel = diffDays + " Days";
                                allExpired = false;
                            } else {
                                expLabel = "Expired";
                                isCurrentExpired = true;
                            }
                        } else {
                            expLabel = "Lifetime";
                            allExpired = false;
                        }
                        
                        var exists = categoryNames.some(function(item) { return item.id === found.id; });
                        if (!exists) {
                            categoryNames.push({
                                id: found.id,
                                name: found.name,
                                expiry: expLabel,
                                expired: isCurrentExpired
                            });
                        }
                    }
                });

                if (categoryNames.length > 0) {
                    var remainingHtml = '<span style="color: #2ecc71; font-weight: 800;">Activated</span>';
                    if (hasAnyExpiry && allExpired) {
                        remainingHtml = '<span style="color: #ef4444; font-weight: 800;">Expired</span>';
                    }
                    document.getElementById("profileRemainingDays").innerHTML = remainingHtml;
                    
                    var listHtml = '<div style="display: flex; flex-direction: column; gap: 8px; margin-top: 10px; width: 100%; box-sizing: border-box;">';
                    categoryNames.forEach(function(item) {
                        var isExpired = item.expired;
                        var isLifetime = item.expiry === "Lifetime";
                        var iconColor = isExpired ? '#ef4444' : (isLifetime ? '#9b59b6' : '#2ecc71');
                        var badgeBg = isExpired ? 'rgba(239, 68, 68, 0.05)' : (isLifetime ? 'rgba(155, 89, 182, 0.06)' : 'rgba(46, 204, 113, 0.06)');
                        var badgeBorder = isExpired ? '1px solid rgba(239, 68, 68, 0.15)' : (isLifetime ? '1px solid rgba(155, 89, 182, 0.15)' : '1px solid rgba(46, 204, 113, 0.15)');
                        var iconClass = isExpired ? 'ph-bold ph-x-circle' : (isLifetime ? 'ph-fill ph-sparkle' : 'ph-fill ph-check-circle');
                        
                        var badgeHtml = '';
                        var cardBlink = '';
                        
                        if (isExpired) {
                            badgeHtml = '<span style="font-size: 9px; font-weight: 900; text-transform: uppercase; padding: 2.5px 6.5px; background: rgba(255, 255, 255, 0.25); border-radius: 6px; flex-shrink: 0; border: 1px solid rgba(0,0,0,0.03); color: ' + iconColor + ';">Expired</span>';
                        } else if (isLifetime) {
                            cardBlink = 'animation: premiumBlink 1.5s infinite ease-in-out;';
                            badgeHtml = '<span style="font-size: 9px; font-weight: 900; text-transform: uppercase; padding: 2.5px 6.5px; background: rgba(255, 255, 255, 0.25); border-radius: 6px; flex-shrink: 0; border: 1px solid rgba(0,0,0,0.03); color: ' + iconColor + ';">Lifetime</span>';
                        } else {
                            // Rotating alternating text badge in a beautiful stable pill container
                            badgeHtml = '<span style="display: inline-block; position: relative; height: 18px; width: 75px; overflow: hidden; vertical-align: middle; flex-shrink: 0; background: rgba(255, 255, 255, 0.25); border-radius: 6px; border: 1px solid rgba(0,0,0,0.03); box-sizing: border-box;">' +
                                        '  <span style="position: absolute; left: 0; right: 0; top: 0; height: 16px; line-height: 16px; font-size: 9px; font-weight: 900; text-transform: uppercase; text-align: center; color: ' + iconColor + '; animation: badgeAltTextFade1 3s infinite; white-space: nowrap;">Active</span>' +
                                        '  <span style="position: absolute; left: 0; right: 0; top: 0; height: 16px; line-height: 16px; font-size: 9px; font-weight: 900; text-transform: uppercase; text-align: center; color: ' + iconColor + '; animation: badgeAltTextFade2 3s infinite; white-space: nowrap;">' + item.expiry + '</span>' +
                                        '</span>';
                        }
                        
                        listHtml += '  <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; background: ' + badgeBg + '; padding: 8.5px 12px; border-radius: 12px; border: ' + badgeBorder + '; width: 100%; box-sizing: border-box; ' + cardBlink + '">' +
                                    '    <div style="display: flex; align-items: center; gap: 8px; min-width: 0; flex: 1;">' +
                                    '      <i class="' + iconClass + '" style="color: ' + iconColor + '; font-size: 14px; flex-shrink: 0;"></i>' +
                                    '      <span style="font-size: 12px; font-weight: 850; letter-spacing: -0.1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0;">' + item.name + '</span>' +
                                    '    </div>' +
                                    badgeHtml +
                                    '  </div>';
                    });
                    listHtml += '</div>';
                    
                    document.getElementById("profileExpiryDate").innerHTML = listHtml;
                } else {
                    document.getElementById("profileRemainingDays").innerText = "No Category Unlocks";
                    document.getElementById("profileExpiryDate").innerHTML = 
                        '<div style="display: flex; align-items: center; gap: 8px; background: rgba(0,0,0,0.02); padding: 10px 12px; border-radius: 12px; border: 1.5px dashed var(--border-color); margin-top: 10px; width: 100%; box-sizing: border-box;">' +
                        '  <i class="ph-bold ph-lock-key" style="color: var(--grey-text); font-size: 14px; flex-shrink: 0;"></i>' +
                        '  <span style="font-size: 12px; font-weight: 800; color: var(--grey-text);">Explore Free Mock Tests</span>' +
                        '</div>';
                }

                loadStudentAnalyticsDashboard();
            } else {
                studentAuthFormPanel.style.display = "block";
                studentAuthenticatedProfileArea.style.display = "none";
                buildSecurityAntiLeakOverlay("aspirant_guest");
            }
            updateDynamicDashboardGreeting();
        }

        function checkConcurrentUserSession() {
            if (!_studentLoggedInUser || !_studentLoggedInUser.id) return;
            var userIdVal = _studentLoggedInUser.id;
            var tokenVal = _studentLoggedInUser.sessionToken || "";

            fetch(getApiUrl("/api/premium/verify"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: userIdVal, sessionToken: tokenVal })
            })
            .then(function(r) { return r.json(); })
            .then(function(resData) {
                if (resData.success) {
                    if (resData.status === "logged_out" || !resData.active) {
                        localStorage.removeItem("_secured_active_aspirant");
                        _studentLoggedInUser = null;
                        refreshStudentAccountProfileGate();
                        showCustomAlert(
                            "Session Terminated", 
                            "This account has been logged in from another device or window. Only one concurrent session is permitted per aspirant.", 
                            function() {
                                handleTabNavigation('home');
                            }
                        );
                    }
                }
            })
            .catch(function(err) {
                console.warn("Session check offline fallback:", err);
            });
        }
        window.checkConcurrentUserSession = checkConcurrentUserSession;

        function showStudentLoginDetailsPopup(user, onOk) {
            if (!user) {
                if (typeof onOk === "function") onOk();
                return;
            }
            
            var categoryNames = [];
            var allCats = (DB.testCategories || []).concat(DB.pdfCategories || []);
            var unlockedIds = user.unlockedCategoryIds || [];
            
            unlockedIds.forEach(function(id) {
                var found = allCats.find(function(c) { return c.id === id; });
                if (found) {
                    var expLabel = "Lifetime";
                    var isCurrentExpired = false;
                    var catExpiry = null;
                    var isCatLifetime = false;
                    var hasSpecific = false;
                    if (user.categoryDates && user.categoryDates[id]) {
                        var catData = user.categoryDates[id];
                        if (catData.isLifetime) {
                            isCatLifetime = true;
                            hasSpecific = true;
                        } else if (catData.expiryDate && catData.expiryDate.trim() !== "") {
                            catExpiry = catData.expiryDate;
                            hasSpecific = true;
                        }
                    }
                    if (!hasSpecific) {
                        if (user.expiryDate && user.expiryDate.trim() !== "") {
                            catExpiry = user.expiryDate;
                        } else {
                            isCatLifetime = true;
                        }
                    }
                    
                    if (isCatLifetime) {
                        expLabel = "Lifetime Access";
                    } else if (catExpiry) {
                        var exp = new Date(catExpiry);
                        var diffMs = exp.getTime() - Date.now();
                        var diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
                        if (diffDays > 0) {
                            expLabel = diffDays + " Days Left";
                        } else {
                            expLabel = "Expired";
                            isCurrentExpired = true;
                        }
                    } else {
                        expLabel = "Lifetime Access";
                    }
                    
                    var exists = categoryNames.some(function(item) { return item.id === found.id; });
                    if (!exists) {
                        categoryNames.push({
                            id: found.id,
                            name: found.name,
                            expiry: expLabel,
                            expired: isCurrentExpired
                        });
                    }
                }
            });
            
            var html = '';
            if (categoryNames.length === 0) {
                html += '<div style="padding: 15px 10px; text-align: center; font-family: Outfit, sans-serif;">' +
                        '  <i class="ph-bold ph-lock-keyhole" style="font-size: 32px; color: #94a3b8; margin-bottom: 8px; display: block;"></i>' +
                        '  <div style="font-size: 13.5px; color: #64748b; font-weight: 700;">No premium packages unlocked yet.</div>' +
                        '</div>';
            } else {
                html += '<div style="text-align: left; font-family: Outfit, sans-serif;">' +
                        '  <div style="font-size: 12.5px; color: #64748b; margin-bottom: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.3px;">Activated Packages:</div>' +
                        '  <div style="display: flex; flex-direction: column; gap: 10px; max-height: 220px; overflow-y: auto; padding-right: 2px;">';
                
                categoryNames.forEach(function(item) {
                    var isExp = item.expired;
                    var bg = isExp ? 'rgba(239,68,68,0.03)' : 'rgba(34,197,94,0.03)';
                    var border = isExp ? 'rgba(239,68,68,0.12)' : 'rgba(34,197,94,0.12)';
                    var pillBg = isExp ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)';
                    var pillColor = isExp ? '#ef4444' : '#22c55e';
                    var icon = isExp ? 'ph-x-circle' : 'ph-check-circle';
                    
                    html += '    <div style="background: ' + bg + '; border: 1.5px solid ' + border + '; border-radius: 14px; padding: 12px; display: flex; align-items: center; justify-content: space-between; gap: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.01);">' +
                            '      <div style="display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0;">' +
                            '        <i class="ph-fill ' + icon + '" style="font-size: 18px; color: ' + pillColor + '; flex-shrink: 0;"></i>' +
                            '        <span style="font-weight: 750; font-size: 13.5px; color: var(--dark); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block;">' + item.name + '</span>' +
                            '      </div>' +
                            '      <span style="background: ' + pillBg + '; color: ' + pillColor + '; font-size: 10px; font-weight: 850; padding: 3.5px 8px; border-radius: 8px; white-space: nowrap; text-transform: uppercase; letter-spacing: 0.2px;">' + item.expiry + '</span>' +
                            '    </div>';
                });
                
                html += '  </div>' +
                        '</div>';
            }
            
            showCustomAlert("Activated Packages", html, onOk);
        }

        async function handleStudentAuthenticationProcess() {
            const credMailInput = document.getElementById("inputStudentCredMail");
            const credPassInput = document.getElementById("inputStudentCredPass");

            const credMail = credMailInput ? credMailInput.value.trim().toLowerCase() : "";
            const credPass = credPassInput ? credPassInput.value.trim() : "";

            if (!credMail || !credPass) {
                showCustomAlert("Authentication Warning", "Provide valid account login keys.");
                return;
            }

            // Always sync/fetch latest students database first
            try {
                await _fetchStudentsDatabase();
            } catch (e) {}

            var studentsList = DB.students || [];
            if (studentsList.length === 0) {
                var cachedDbStr = localStorage.getItem("_cached_students_db");
                if (cachedDbStr) {
                    try {
                        studentsList = JSON.parse(cachedDbStr);
                        DB.students = studentsList;
                    } catch (e) {}
                }
            }

            // Check student credentials against loaded student database
            var matchedStudent = studentsList.find(function(s) {
                if (!s) return false;

                // Password check
                var sPass = (s.password || s.pass || s.pwd || "").toString().trim();
                if (sPass !== credPass) return false;

                // Identifier check (Email, Phone, Mobile, Roll No, Student ID, Name)
                var inputUser = credMail.toLowerCase();
                var emailOrMobile = (s.emailOrMobile || "").toString().trim().toLowerCase();
                var email = (s.email || "").toString().trim().toLowerCase();
                var phone = (s.phoneNo || s.phone || s.mobile || "").toString().trim().toLowerCase();
                var roll = (s.rollNumber || s.rollNo || s.roll || "").toString().trim().toLowerCase();
                var id = (s.id || s.studentId || "").toString().trim().toLowerCase();
                var name = (s.name || "").toString().trim().toLowerCase();

                return (
                    emailOrMobile === inputUser ||
                    email === inputUser ||
                    phone === inputUser ||
                    roll === inputUser ||
                    id === inputUser ||
                    name === inputUser
                );
            });

            if (matchedStudent) {
                _studentLoggedInUser = matchedStudent;
                localStorage.setItem("_secured_active_aspirant", JSON.stringify(matchedStudent));
                refreshStudentAccountProfileGate();
                try { syncSavedQuestionsWithCloud("pull"); } catch (e) {}
                showCustomAlert("Login Success", "Welcome back! " + (_studentLoggedInUser.name || "Aspirant") + " logged in successfully.", function() {
                    showStudentLoginDetailsPopup(_studentLoggedInUser, function() {
                        handleTabNavigation('home');
                    });
                });
                return;
            }

            // Fallback: Attempt online server API verification if local database didn't match
            try {
                const res = await fetch(getApiUrl("/api/auth/login"), {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ emailOrMobile: credMail, password: credPass })
                });

                if (res.ok) {
                    const contentType = res.headers.get("content-type") || "";
                    if (contentType.includes("application/json")) {
                        const resData = await res.json();
                        if (resData.success && resData.user) {
                            _studentLoggedInUser = resData.user;
                            localStorage.setItem("_secured_active_aspirant", JSON.stringify(resData.user));
                            refreshStudentAccountProfileGate();
                            try { syncSavedQuestionsWithCloud("pull"); } catch (e) {}
                            showCustomAlert("Login Success", "Welcome back! " + (_studentLoggedInUser.name || "Aspirant") + " logged in successfully.", function() {
                                showStudentLoginDetailsPopup(_studentLoggedInUser, function() {
                                    handleTabNavigation('home');
                                });
                            });
                            return;
                        }
                    }
                }
            } catch (err) {
                console.warn("Online auth API check skipped:", err);
            }

            showCustomAlert("Access Denied", "Invalid student credentials key pair. Try again or notify Taiyariya operator.");
        }

        function handleStudentSignOutProcess() {
            localStorage.removeItem("_secured_active_aspirant");
            _studentLoggedInUser = null;
            refreshStudentAccountProfileGate();
            showCustomAlert("Logout Successful", "You have signed out successfully.", function() {
                handleTabNavigation('home');
            });
        }

        // Shared Telegram screenshot link
        function handleTelegramPaymentScreenshotSubmit() {
            const utrInput = document.getElementById("txnUtrRefNumberInput").value.trim() || "N/A";

            const telegramUrlBase = "${social.telegram}";
            const formattedMessage = encodeURIComponent(
                "TAIYARIYA REGISTRATION LICENSE PAYMENT CHECKED\\n" +
                "UTR TRANSACTION REF: " + utrInput + "\\n" +
                "Email or Mobile user: " + (_studentLoggedInUser ? _studentLoggedInUser.emailOrMobile : "Anonymous Aspirant")
            );

            // Direct forward screenshot on telegram link
            const urlToOpen = telegramUrlBase + "?text=" + formattedMessage;
            window.open(urlToOpen, '_blank');
        }

        let _uploadedScreenshotBase64 = "";

        function handlePayScreenshotChange(inputEl) {
            if (inputEl.files && inputEl.files[0]) {
                const file = inputEl.files[0];
                const reader = new FileReader();
                reader.onload = function(e) {
                    const resultStr = e?.target?.result ? String(e.target.result) : "";
                    _uploadedScreenshotBase64 = resultStr;
                    
                    // Show preview thumbnail beautifully
                    var previewImg = document.getElementById("paySSPreview");
                    var previewContainer = document.getElementById("paySSPreviewContainer");
                    var defaultContainer = document.getElementById("paySSDefaultContainer");
                    if (previewImg && previewContainer && defaultContainer) {
                        previewImg.src = resultStr;
                        defaultContainer.style.display = "none";
                        previewContainer.style.display = "flex";
                    }
                    
                    var labelEl = document.getElementById("paySSLabel");
                    if (labelEl) {
                        labelEl.innerText = file.name + " (" + Math.round(file.size / 1024) + " KB)";
                    }
                };
                reader.readAsDataURL(file);
            }
        }

        function startCooldown(buttonId, storageKey, cooldownDurationMs) {
            localStorage.setItem(storageKey, Date.now() + cooldownDurationMs);
            updateCooldownUI(buttonId, storageKey);
        }

        function updateCooldownUI(buttonId, storageKey) {
            const btn = document.getElementById(buttonId);
            if (!btn) return;

            const expiry = parseInt(localStorage.getItem(storageKey) || "0", 10);
            const now = Date.now();

            if (expiry && expiry > now) {
                const diff = expiry - now;
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                const pad = function(num) { return String(num).padStart(2, '0'); };
                const timeStr = pad(hours) + ":" + pad(minutes) + ":" + pad(seconds);

                btn.disabled = true;
                btn.style.cursor = "not-allowed";
                btn.style.opacity = "0.85";
                btn.style.background = "#1e293b"; // Dark elegant slate background
                btn.style.color = "#f8fafc";
                btn.style.boxShadow = "none";
                btn.style.whiteSpace = "nowrap";
                btn.style.fontSize = "11.5px";
                btn.style.padding = "0 8px";
                btn.style.fontFamily = "'Outfit', sans-serif";
                btn.style.fontWeight = "700";
                btn.style.letterSpacing = "0.5px";
                
                if (buttonId === "btnSendPaymentEmail") {
                    btn.innerHTML = '<i class="ph-bold ph-timer" style="font-size: 15px;"></i> Wait: ' + timeStr;
                } else if (buttonId === "btnSendReportEmail") {
                    btn.innerHTML = '<i class="ph ph-clock" style="font-size: 14px;"></i> Wait: ' + timeStr;
                }
            } else {
                btn.disabled = false;
                btn.style.cursor = "pointer";
                btn.style.opacity = "1";
                btn.style.background = buttonId === "btnSendPaymentEmail" ? "linear-gradient(135deg, #FF9F1C 0%, #FF5A1F 100%)" : "var(--primary)";
                btn.style.color = "#ffffff";
                btn.style.boxShadow = buttonId === "btnSendPaymentEmail" ? "0 4px 15px rgba(255, 107, 53, 0.2)" : "none";
                btn.style.whiteSpace = "";
                btn.style.fontSize = buttonId === "btnSendPaymentEmail" ? "13px" : "12px";
                btn.style.padding = buttonId === "btnSendPaymentEmail" ? "" : "12px 20px";
                btn.style.fontFamily = "inherit";
                btn.style.fontWeight = buttonId === "btnSendPaymentEmail" ? "800" : "inherit";
                btn.style.letterSpacing = "";

                if (buttonId === "btnSendPaymentEmail") {
                    btn.innerHTML = '<i class="ph-bold ph-paper-plane-tilt" style="font-size: 16px;"></i> Submit';
                } else if (buttonId === "btnSendReportEmail") {
                    btn.innerHTML = '<i class="ph ph-paper-plane"></i> Send Report Email';
                }
            }
        }

        function getPaymentCooldownStorageKey() {
            if (_activeCategoryForPayment && _activeCategoryForPayment.id) {
                return "payment_email_cooldown_expiry_cat_" + _activeCategoryForPayment.id;
            }
            return "payment_email_cooldown_expiry_general";
        }

        function initEmailCooldowns() {
            setInterval(function() {
                updateCooldownUI("btnSendPaymentEmail", getPaymentCooldownStorageKey());
                updateCooldownUI("btnSendReportEmail", "report_email_cooldown_expiry");
            }, 1000);

            updateCooldownUI("btnSendPaymentEmail", getPaymentCooldownStorageKey());
            updateCooldownUI("btnSendReportEmail", "report_email_cooldown_expiry");
        }

        function setPaidButtonState(ticked) {
            var btn = document.getElementById("unifiedPaidBtn");
            var circle = document.getElementById("unifiedPaidCheckCircle");
            var icon = document.getElementById("unifiedPaidCheckIcon");
            var text = document.getElementById("unifiedPaidText");
            var isDark = document.body.classList.contains("dark-mode");

            if (!btn) return;

            if (ticked) {
                btn.className = "ticked";
                btn.style.background = "linear-gradient(135deg, #FF9F1C 0%, #FF5A1F 100%)";
                btn.style.borderColor = "transparent";
                btn.style.boxShadow = "0 4px 16px rgba(255, 90, 31, 0.4)";
                btn.style.transform = "scale(0.97)";

                if (circle) {
                    circle.style.background = "#ffffff";
                    circle.style.borderColor = "#ffffff";
                    circle.style.transform = "scale(1.1)";
                }
                if (icon) {
                    icon.style.display = "block";
                    icon.style.color = "#FF5A1F";
                }
                if (text) {
                    text.innerText = "I Have Paid";
                    text.style.color = "#ffffff";
                }
            } else {
                btn.className = "unticked";
                btn.style.background = isDark ? "#1e293b" : "#ffffff";
                btn.style.borderColor = isDark ? "#334155" : "#cbd5e1";
                btn.style.boxShadow = "none";
                btn.style.transform = "scale(1)";

                if (circle) {
                    circle.style.background = isDark ? "#1e293b" : "#f8fafc";
                    circle.style.borderColor = isDark ? "#475569" : "#94a3b8";
                    circle.style.transform = "scale(1)";
                }
                if (icon) {
                    icon.style.display = "none";
                }
                if (text) {
                    text.innerText = "I Have Paid";
                    text.style.color = isDark ? "#f8fafc" : "#334155";
                }
            }
        }
        window.setPaidButtonState = setPaidButtonState;

        function handleUnifiedPaidAction() {
            setPaidButtonState(true);
            setTimeout(function() {
                goToPayStep(2);
            }, 200);
        }
        window.handleUnifiedPaidAction = handleUnifiedPaidAction;

        function goToPayStep(step) {
            var s1 = document.getElementById("payStep1Container");
            var s2 = document.getElementById("payStep2Container");
            var s3 = document.getElementById("payStep3Container");

            var c1 = document.getElementById("stepCircle1");
            var c2 = document.getElementById("stepCircle2");
            var c3 = document.getElementById("stepCircle3");

            var l1 = document.getElementById("stepLabel1");
            var l2 = document.getElementById("stepLabel2");
            var l3 = document.getElementById("stepLabel3");

            var progLine = document.getElementById("payStepperProgressActive");

            if (!s1 || !s2 || !s3) return;

            s1.style.display = "none";
            s2.style.display = "none";
            s3.style.display = "none";

            function setStepState(circle, label, state, originalNum) {
                if (!circle || !label) return;
                var isDark = document.body.classList.contains("dark-mode");
                if (state === "active") {
                    circle.style.background = "linear-gradient(135deg, #009CFC, #0077C8)";
                    circle.style.color = "#ffffff";
                    circle.style.boxShadow = "0 4px 14px rgba(0, 156, 252, 0.4)";
                    circle.style.borderColor = isDark ? "#181818" : "#ffffff";
                    circle.innerHTML = originalNum;
                    label.style.color = isDark ? "#f8fafc" : "#1e293b";
                    label.style.fontWeight = "900";
                } else if (state === "completed") {
                    circle.style.background = "#22c55e";
                    circle.style.color = "#ffffff";
                    circle.style.boxShadow = "0 2px 8px rgba(34, 197, 94, 0.35)";
                    circle.style.borderColor = isDark ? "#181818" : "#ffffff";
                    circle.innerHTML = '<i class="ph-bold ph-check" style="font-size: 14px;"></i>';
                    label.style.color = "#22c55e";
                    label.style.fontWeight = "800";
                } else {
                    circle.style.background = isDark ? "#1e293b" : "#f1f5f9";
                    circle.style.color = "#64748b";
                    circle.style.boxShadow = "0 2px 6px rgba(0,0,0,0.06)";
                    circle.style.borderColor = isDark ? "#334155" : "#ffffff";
                    circle.innerHTML = originalNum;
                    label.style.color = "#64748b";
                    label.style.fontWeight = "700";
                }
            }

            if (step === 1) {
                s1.style.display = "block";
                setPaidButtonState(false);
                setStepState(c1, l1, "active", "1");
                setStepState(c2, l2, "inactive", "2");
                setStepState(c3, l3, "inactive", "3");
                if (progLine) progLine.style.width = "0%";
            } else if (step === 2) {
                s2.style.display = "block";
                setStepState(c1, l1, "completed", "1");
                setStepState(c2, l2, "active", "2");
                setStepState(c3, l3, "inactive", "3");
                if (progLine) progLine.style.width = "50%";
            } else if (step === 3) {
                s3.style.display = "block";
                setStepState(c1, l1, "completed", "1");
                setStepState(c2, l2, "completed", "2");
                setStepState(c3, l3, "active", "3");
                if (progLine) progLine.style.width = "100%";
            }

            var scrPay = document.getElementById("scr-pay");
            if (scrPay) {
                scrPay.scrollTop = 0;
            }
        }
        window.goToPayStep = goToPayStep;

        function handleTapPayDirect() {
            setPaidButtonState(true);
            setTimeout(function() {
                goToPayStep(2);
            }, 1200);
        }
        window.handleTapPayDirect = handleTapPayDirect;

        async function handleSendPaymentDetailsEmail(e) {
            if (e && e.preventDefault) e.preventDefault();

            const currentKey = getPaymentCooldownStorageKey();
            const expiry = parseInt(localStorage.getItem(currentKey) || "0", 10);
            if (expiry && expiry > Date.now()) {
                showCustomAlert("Cooldown Active", "Please wait for the 24-hour verification period to complete before submitting another request.");
                return;
            }

            const name = (document.getElementById("payFormName").value || "").trim();
            const email = (document.getElementById("payFormEmail").value || "").trim();
            const phone = (document.getElementById("payFormPhone").value || "").trim();
            const utr = (document.getElementById("payFormUTR").value || "").trim();
            const messageEl = document.getElementById("payFormMessage");
            let message = (messageEl ? messageEl.value : "").trim();
            const displayUTR = utr || "Not Provided";

            if (!name) {
                showCustomAlert("Name Required", "Please enter your full name.");
                return;
            }
            if (!email || !email.includes("@")) {
                showCustomAlert("Valid Email Required", "Please enter a valid Email ID because your login credentials will be sent to this email.");
                return;
            }
            if (!phone || phone.length < 8) {
                showCustomAlert("Phone Number Required", "Please enter a valid 10-digit mobile or WhatsApp number.");
                return;
            }

            var categoryDetails = "Full Access / General Premium Membership";
            if (_activeCategoryForPayment) {
                categoryDetails = _activeCategoryForPayment.name + " (" + (_activeCategoryForPayment.paymentAmount || "₹99") + ")";
            } else {
                var amt = (DB && DB.social && DB.social.premiumPrice) || "₹45";
                categoryDetails = "General Premium Plan (" + amt + ")";
            }

            const rawUserMessage = (messageEl ? messageEl.value : "").trim();
            if (!message) {
                message = "Payment verification for: " + categoryDetails + "\\nName: " + name + "\\nEmail: " + email + "\\nPhone: " + phone + "\\nUPI UTR: " + displayUTR;
            }

            // Populate Step 3 Summary Elements
            var sumPlan = document.getElementById("summaryPlanName");
            var sumName = document.getElementById("summaryStudentName");
            var sumEmail = document.getElementById("summaryStudentEmail");
            var sumPhone = document.getElementById("summaryStudentPhone");
            var sumUTR = document.getElementById("summaryUTR");
            var sumTime = document.getElementById("summarySubmittedTime");
            var sumMsg = document.getElementById("summaryMessageText");

            if (sumPlan) sumPlan.innerText = categoryDetails;
            if (sumName) sumName.innerText = name;
            if (sumEmail) sumEmail.innerText = email;
            if (sumPhone) sumPhone.innerText = phone;
            if (sumUTR) sumUTR.innerText = displayUTR;
            if (sumTime) sumTime.innerText = new Date().toLocaleString();
            if (sumMsg) sumMsg.innerText = rawUserMessage || "Not Provided";

            const submitBtn = document.getElementById("btnSendPaymentEmail");
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="ph-bold ph-spinner ph-spin" style="font-size: 16px;"></i> Submitting...';
            }

            // Web3Forms API submission
            const payload = {
                access_key: "5d794766-9266-49a2-b97b-cc7313dd14d6",
                subject: "Premium Payment Verification - " + name + " (" + categoryDetails + ")",
                from_name: name,
                name: name,
                email: email,
                phone: phone,
                utr: displayUTR,
                plan: categoryDetails,
                message: message
            };

            try {
                const response = await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(payload)
                });
                const resData = await response.json();
                console.log("Web3Forms submission status:", resData);
            } catch (err) {
                console.warn("Web3Forms submission error (proceeding to verification screen):", err);
            }

            // Transition to Step 3 verification notice
            goToPayStep(3);

            // Start 24 hours (86,400,000 ms) cooldown
            startCooldown("btnSendPaymentEmail", currentKey, 86400000);
        }
        window.handleSendPaymentDetailsEmail = handleSendPaymentDetailsEmail;

        function handleSendReportEmail() {
            const expiry = parseInt(localStorage.getItem("report_email_cooldown_expiry") || "0", 10);
            if (expiry && expiry > Date.now()) {
                alert("Please wait for the cooling period to end before sending another report.");
                return;
            }

            const complaint = document.getElementById("reportComplaintTextArea").value.trim();
            if (!complaint) {
                alert("Please describe the issue or discrepancy before sending.");
                return;
            }

            const targetIdx = (typeof window._activeQIndexReported === 'number') ? window._activeQIndexReported : _activeQIndex;
            const questionBlock = _activeQuestions[targetIdx];
            if (!questionBlock) return;
            let qNode = questionBlock[_currentLanguage];
            if (!qNode) {
                for (let l of _availableLanguages) {
                    if (questionBlock[l]) {
                        qNode = questionBlock[l];
                        break;
                    }
                }
            }
            if (!qNode) return;

            const categoryName = _activeCategoryName || "N/A";
            const subCategoryName = _activeSubCategoryName || "N/A";
            const topicName = _activeTopicName || "N/A";
            const qNum = targetIdx + 1;
            const qText = sanitizeQuestionText(qNode.q || "");
            const qOpts = (qNode.o || []).map((o, idx) => String.fromCharCode(65 + idx) + ") " + o).join("\\n");
            
            const subject = "TAIYARIYA QUESTION DISCREPANCY REPORT: " + (_activeTest ? _activeTest.title : "Mock Test");
            const body = 
                "--- ASPECT DISCREPANCY COMPLAINT ---\\n\\n" +
                "Operator/Aspirant Report:\\n" + complaint + "\\n\\n" +
                "--- QUESTION REFERENCE ---\\n" +
                "Category: " + categoryName + "\\n" +
                "Sub-Category: " + subCategoryName + "\\n" +
                "Topic: " + topicName + "\\n" +
                "Question Index: " + qNum + "\\n\\n" +
                "Text:\\n" + qText + "\\n\\n" +
                "Options:\\n" + qOpts + "\\n";

            window.location.href = "mailto:hi@taiyariya.in?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
            startCooldown("btnSendReportEmail", "report_email_cooldown_expiry", 7200000);
            handleCloseReportModal();
        }

        function handleTriggerRefreshReboot() {
            handleTabNavigation('home');
        }

        // Interactive Mock Score Card Question Filtering & Navigation
        var _activeResultFilter = 'all'; // 'all' | 'incorrect' | 'unanswered' | 'correct'
        var _filteredQuestionIndices = [];
        var _currentFilteredPos = 0;

        function handleFilterAnalysisQuestions(filterType, shouldScroll) {
            _activeResultFilter = filterType || 'all';
            _filteredQuestionIndices = [];

            if (!_activeQuestions || _activeQuestions.length === 0) {
                renderEmptyFilteredAnalysisState();
                return;
            }

            _activeQuestions.forEach((qBlock, idx) => {
                const selectAns = _answersMap[idx];
                const isCorrect = (selectAns !== undefined && selectAns !== null && selectAns === qBlock.originalCorrect);
                const isUnanswered = (selectAns === undefined || selectAns === null);
                const isIncorrect = (!isUnanswered && !isCorrect);

                if (_activeResultFilter === 'all') {
                    _filteredQuestionIndices.push(idx);
                } else if (_activeResultFilter === 'incorrect') {
                    if (isIncorrect) _filteredQuestionIndices.push(idx);
                } else if (_activeResultFilter === 'unanswered') {
                    if (isUnanswered) _filteredQuestionIndices.push(idx);
                } else if (_activeResultFilter === 'correct') {
                    if (isCorrect) _filteredQuestionIndices.push(idx);
                }
            });

            _currentFilteredPos = 0;
            updateAnalysisFilterUI();
            renderAnalysisQuestionPalette();

            if (_filteredQuestionIndices.length > 0) {
                handleOpenDetailedAnalysisItemByFilteredPos(0);
            } else {
                renderEmptyFilteredAnalysisState();
            }
        }

        function updateAnalysisFilterUI() {
            // Keep stat cards styling clean and responsive in both Day Mode and Night Mode
            const isDark = document.body.classList.contains("dark-mode");
            const inactiveBg = isDark ? "#0B131E" : "#ffffff";
            const inactiveBorder = isDark ? "#1E344B" : "#e2e8f0";

            const statCardTotal = document.getElementById("statCardTotal");
            const statCardCorrect = document.getElementById("statCardCorrect");
            const statCardIncorrect = document.getElementById("statCardIncorrect");
            const statCardUnanswered = document.getElementById("statCardUnanswered");

            if (statCardTotal) {
                statCardTotal.style.background = _activeResultFilter === 'all' ? (isDark ? "rgba(255, 107, 53, 0.18)" : "rgba(255, 107, 53, 0.08)") : inactiveBg;
                statCardTotal.style.borderColor = _activeResultFilter === 'all' ? "var(--primary)" : inactiveBorder;
                statCardTotal.style.boxShadow = _activeResultFilter === 'all' ? "0 0 0 2px rgba(255, 107, 53, 0.25)" : (isDark ? "none" : "0 2px 8px rgba(0, 0, 0, 0.02)");
                statCardTotal.style.transform = "none";
            }

            if (statCardCorrect) {
                statCardCorrect.style.background = _activeResultFilter === 'correct' ? (isDark ? "rgba(34, 197, 94, 0.18)" : "rgba(34, 197, 94, 0.08)") : inactiveBg;
                statCardCorrect.style.borderColor = _activeResultFilter === 'correct' ? "#22c55e" : inactiveBorder;
                statCardCorrect.style.boxShadow = _activeResultFilter === 'correct' ? "0 0 0 2px rgba(34, 197, 94, 0.25)" : (isDark ? "none" : "0 2px 8px rgba(0, 0, 0, 0.02)");
                statCardCorrect.style.transform = "none";
            }

            if (statCardIncorrect) {
                statCardIncorrect.style.background = _activeResultFilter === 'incorrect' ? (isDark ? "rgba(239, 68, 68, 0.18)" : "rgba(239, 68, 68, 0.08)") : inactiveBg;
                statCardIncorrect.style.borderColor = _activeResultFilter === 'incorrect' ? "#ef4444" : inactiveBorder;
                statCardIncorrect.style.boxShadow = _activeResultFilter === 'incorrect' ? "0 0 0 2px rgba(239, 68, 68, 0.25)" : (isDark ? "none" : "0 2px 8px rgba(0, 0, 0, 0.02)");
                statCardIncorrect.style.transform = "none";
            }

            if (statCardUnanswered) {
                statCardUnanswered.style.background = _activeResultFilter === 'unanswered' ? (isDark ? "rgba(59, 130, 246, 0.18)" : "rgba(59, 130, 246, 0.08)") : inactiveBg;
                statCardUnanswered.style.borderColor = _activeResultFilter === 'unanswered' ? "#3b82f6" : inactiveBorder;
                statCardUnanswered.style.boxShadow = _activeResultFilter === 'unanswered' ? "0 0 0 2px rgba(59, 130, 246, 0.25)" : (isDark ? "none" : "0 2px 8px rgba(0, 0, 0, 0.02)");
                statCardUnanswered.style.transform = "none";
            }

            const activeFilterBadge = document.getElementById("analysisActiveFilterBadge");
            if (activeFilterBadge) {
                const count = (_filteredQuestionIndices && _filteredQuestionIndices.length) || 0;
                if (_activeResultFilter === 'correct') {
                    activeFilterBadge.innerText = "Correct (" + count + ")";
                    activeFilterBadge.style.color = "#22c55e";
                    activeFilterBadge.style.background = "rgba(34, 197, 94, 0.12)";
                    activeFilterBadge.style.borderColor = "rgba(34, 197, 94, 0.25)";
                } else if (_activeResultFilter === 'incorrect') {
                    activeFilterBadge.innerText = "Incorrect (" + count + ")";
                    activeFilterBadge.style.color = "#ef4444";
                    activeFilterBadge.style.background = "rgba(239, 68, 68, 0.12)";
                    activeFilterBadge.style.borderColor = "rgba(239, 68, 68, 0.25)";
                } else if (_activeResultFilter === 'unanswered') {
                    activeFilterBadge.innerText = "Unanswered (" + count + ")";
                    activeFilterBadge.style.color = "#3b82f6";
                    activeFilterBadge.style.background = "rgba(59, 130, 246, 0.12)";
                    activeFilterBadge.style.borderColor = "rgba(59, 130, 246, 0.25)";
                } else {
                    activeFilterBadge.innerText = "All Questions (" + (_activeQuestions ? _activeQuestions.length : 0) + ")";
                    activeFilterBadge.style.color = "var(--primary)";
                    activeFilterBadge.style.background = "rgba(255, 107, 53, 0.12)";
                    activeFilterBadge.style.borderColor = "rgba(255, 107, 53, 0.25)";
                }
            }

            updateScorecardGlobalLanguageBtn();
        }

        function renderAnalysisQuestionPalette() {
            const resGrid = document.getElementById("analysisQuestionSelectorRow");
            if (!resGrid) return;
            resGrid.innerHTML = "";

            if (!_filteredQuestionIndices || _filteredQuestionIndices.length === 0) {
                resGrid.innerHTML = '<div style="padding: 12px 18px; font-size: 12.5px; color: var(--grey-text); font-family: Outfit, sans-serif; font-weight: 700;">No questions match this filter criteria.</div>';
                return;
            }

            _filteredQuestionIndices.forEach((origIdx, pos) => {
                const btn = document.createElement("button");

                btn.className = "palette-cell analysis-filter-cell";
                btn.setAttribute("data-filtered-pos", pos.toString());
                btn.setAttribute("data-orig-idx", origIdx.toString());
                btn.style.backgroundColor = "#ffffff";
                btn.style.color = "var(--dark)";
                btn.style.border = "1.5px solid var(--border-color)";
                btn.style.width = "40px";
                btn.style.height = "40px";
                btn.style.borderRadius = "10px";
                btn.style.flexShrink = "0";
                btn.style.fontFamily = "'Outfit', sans-serif";
                btn.style.fontWeight = "800";
                btn.style.fontSize = "13px";
                btn.style.cursor = "pointer";
                btn.style.transition = "all 0.18s ease";
                btn.innerText = (origIdx + 1).toString();
                btn.title = "Question " + (origIdx + 1);

                btn.onclick = () => {
                    handleOpenDetailedAnalysisItemByFilteredPos(pos);
                };

                resGrid.appendChild(btn);
            });
        }

        function renderEmptyFilteredAnalysisState() {
            const detailCard = document.getElementById("analysisDetailViewerCard");
            if (!detailCard) return;

            let iconHtml = '<i class="ph-fill ph-check-circle" style="font-size: 32px; color: #22c55e;"></i>';
            let titleText = "No Questions Found";
            let descText = "No questions match this filter criteria.";

            if (_activeResultFilter === 'incorrect') {
                iconHtml = '<i class="ph-fill ph-confetti" style="font-size: 32px; color: #22c55e;"></i>';
                titleText = "No Incorrect Questions!";
                descText = "Shaandar! Aapka koi bhi attempted question galat nahi hua.";
            } else if (_activeResultFilter === 'unanswered') {
                iconHtml = '<i class="ph-fill ph-sparkle" style="font-size: 32px; color: #3b82f6;"></i>';
                titleText = "No Unanswered Questions!";
                descText = "Aapne sabhi questions attempt kiye hain, koi question chhoota nahi.";
            } else if (_activeResultFilter === 'correct') {
                iconHtml = '<i class="ph-fill ph-info" style="font-size: 32px; color: #ef4444;"></i>';
                titleText = "No Correct Questions";
                descText = "Aapne is test mein koi sahi answer record nahi kiya.";
            }

            detailCard.innerHTML = 
                '<div style="text-align: center; padding: 40px 20px; font-family: Outfit, sans-serif;">' +
                '  <div style="width: 60px; height: 60px; border-radius: 50%; background: rgba(120, 120, 120, 0.08); display: inline-flex; align-items: center; justify-content: center; margin-bottom: 14px;">' +
                '    ' + iconHtml +
                '  </div>' +
                '  <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 900; color: var(--dark);">' + titleText + '</h3>' +
                '  <p style="margin: 0 0 20px 0; font-size: 13.5px; color: var(--grey-text); max-width: 360px; margin-left: auto; margin-right: auto; line-height: 1.5;">' + descText + '</p>' +
                '  <button id="btnViewAllFromAnalysisEmpty" style="background: var(--dark); color: white; border: none; padding: 10px 22px; border-radius: 12px; font-size: 13px; font-weight: 850; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.12);">' +
                '    <i class="ph-bold ph-squares-four"></i> View All Questions' +
                '  </button>' +
                '</div>';

            var viewAllBtn = document.getElementById("btnViewAllFromAnalysisEmpty");
            if (viewAllBtn) {
                viewAllBtn.onclick = function() {
                    handleFilterAnalysisQuestions('all', false);
                };
            }
        }

        function handleOpenDetailedAnalysisItemByFilteredPos(pos) {
            if (!_filteredQuestionIndices || _filteredQuestionIndices.length === 0) return;
            if (pos < 0 || pos >= _filteredQuestionIndices.length) return;
            _currentFilteredPos = pos;
            const origIdx = _filteredQuestionIndices[pos];
            handleOpenDetailedAnalysisItem(origIdx, pos);
        }

        function handleNavigateFilteredAnalysis(delta) {
            if (!_filteredQuestionIndices || _filteredQuestionIndices.length === 0) return;
            const newPos = _currentFilteredPos + delta;
            if (newPos >= 0 && newPos < _filteredQuestionIndices.length) {
                _currentFilteredPos = newPos;
                handleOpenDetailedAnalysisItemByFilteredPos(newPos);
            }
        }

        function getQuestionAvailableLanguages(qBlock) {
            if (!qBlock) return [];
            var langs = [];
            if (qBlock.en && (qBlock.en.q || (qBlock.en.o && qBlock.en.o.length > 0))) {
                langs.push('en');
            }
            if (qBlock.hi && (qBlock.hi.q || (qBlock.hi.o && qBlock.hi.o.length > 0))) {
                langs.push('hi');
            }
            if (Array.isArray(_availableLanguages)) {
                _availableLanguages.forEach(function(l) {
                    if (langs.indexOf(l) === -1 && qBlock[l] && (qBlock[l].q || (qBlock[l].o && qBlock[l].o.length > 0))) {
                        langs.push(l);
                    }
                });
            }
            return langs;
        }

        // Toggle language in Analysis view (Only switches if question has multiple languages)
        function handleToggleAnalysisLanguage(index) {
            var qBlock = _activeQuestions && _activeQuestions[index];
            if (!qBlock) return;

            var langs = getQuestionAvailableLanguages(qBlock);
            if (langs.length <= 1) {
                // If there is no second language available, do not switch
                return;
            }

            var curIdx = langs.indexOf(_currentLanguage);
            var nextIdx = curIdx === -1 ? 0 : (curIdx + 1) % langs.length;
            _currentLanguage = langs[nextIdx];

            updateScorecardGlobalLanguageBtn();
            handleOpenDetailedAnalysisItem(index, _currentFilteredPos);
        }

        // Update Scorecard Global Language button visibility and label (only shown if multi-language questions exist)
        function updateScorecardGlobalLanguageBtn() {
            var btn = document.getElementById("scorecardGlobalLangBtn");
            var label = document.getElementById("scorecardGlobalLangLabel");
            if (!btn || !label) return;

            var hasMultipleLangs = false;
            if (Array.isArray(_availableLanguages) && _availableLanguages.length > 1) {
                hasMultipleLangs = true;
            } else if (Array.isArray(_activeQuestions)) {
                for (var i = 0; i < _activeQuestions.length; i++) {
                    if (getQuestionAvailableLanguages(_activeQuestions[i]).length > 1) {
                        hasMultipleLangs = true;
                        break;
                    }
                }
            }

            if (hasMultipleLangs) {
                btn.style.display = "inline-flex";
                var nextLangName = _currentLanguage === 'hi' ? 'ENGLISH' : 'HINDI';
                label.innerText = nextLangName;
            } else {
                // If test has only 1 language, do not show switch button at all
                btn.style.display = "none";
            }
        }

        // Global language switcher on Mock Scorecard
        function handleToggleScorecardGlobalLanguage() {
            var available = [];
            if (Array.isArray(_availableLanguages) && _availableLanguages.length > 1) {
                available = _availableLanguages;
            } else if (Array.isArray(_activeQuestions)) {
                var langSet = {};
                _activeQuestions.forEach(function(q) {
                    getQuestionAvailableLanguages(q).forEach(function(l) { langSet[l] = true; });
                });
                available = Object.keys(langSet);
            }

            if (available.length <= 1) {
                // If no other language, do not switch
                return;
            }

            var curIdx = available.indexOf(_currentLanguage);
            var nextIdx = curIdx === -1 ? 0 : (curIdx + 1) % available.length;
            _currentLanguage = available[nextIdx];

            updateScorecardGlobalLanguageBtn();
            if (typeof _currentFilteredPos === 'number' && _filteredQuestionIndices && _filteredQuestionIndices.length > 0) {
                handleOpenDetailedAnalysisItemByFilteredPos(_currentFilteredPos);
            }
        }

        // Open detailed inline explanation analysis
        function handleOpenDetailedAnalysisItem(index, filteredPos) {
            const detailCard = document.getElementById("analysisDetailViewerCard");
            if (!detailCard) return;

            // Ensure filtered index alignment
            if (typeof filteredPos !== 'number' || filteredPos < 0) {
                filteredPos = _filteredQuestionIndices.indexOf(index);
                if (filteredPos === -1) {
                    _activeResultFilter = 'all';
                    _filteredQuestionIndices = _activeQuestions.map((_, i) => i);
                    filteredPos = index;
                    updateAnalysisFilterUI();
                    renderAnalysisQuestionPalette();
                }
            }
            _currentFilteredPos = filteredPos;

            // Do not highlight active button or auto-scroll
            const rowSelector = document.getElementById("analysisQuestionSelectorRow");
            if (rowSelector) {
                const buttons = rowSelector.querySelectorAll("button.palette-cell");
                buttons.forEach((btn) => {
                    btn.style.outline = "none";
                    btn.style.transform = "none";
                    btn.style.boxShadow = "none";
                });
            }

            const qBlock = _activeQuestions[index];
            if (!qBlock) return;

            // Pick standard translation node matching currently active language
            let qNode = qBlock[_currentLanguage];
            if (!qNode) {
                for (let l of _availableLanguages) {
                    if (qBlock[l]) {
                        qNode = qBlock[l];
                        break;
                    }
                }
            }

            if (!qNode) {
                detailCard.innerHTML = "<p>Error loading item structure.</p>";
                return;
            }

            const isHi = _currentLanguage === 'hi' || /[\u0900-\u097F]/.test(qNode.q || '') || /[\u0900-\u097F]/.test((qNode.o || []).join(' '));
            const fontName = isHi ? "'Anek Devanagari', 'Anek Devnagari', sans-serif" : "Outfit, sans-serif";
            const fontStyle = "font-family: " + fontName + " !important;";

            const qFontName = getFontForText(sanitizeQuestionText(qNode.q), fontName);
            const qFontStyle = "font-family: " + qFontName + " !important;";

            const optSelectionsHtml = qNode.o.map((oVal, idx) => {
                const optIdx = idx + 1;
                const isCorrect = optIdx === qNode.c;
                const isSelected = _answersMap[index] === optIdx;

                const oFontName = getFontForText(oVal, fontName);
                const oFontStyle = "font-family: " + oFontName + " !important;";

                let classes = "analysis-opt-box";
                if (isCorrect) {
                     classes += " correct";
                } else if (isSelected) {
                     classes += " wrong";
                }

                let style = "font-weight: 400 !important; " + oFontStyle;

                const hasOptionAnalysis = qNode.oa && qNode.oa[idx] && qNode.oa[idx].trim().length > 0;
                let arrowHtml = "";
                let analysisBoxHtml = "";

                // Option letter badge style
                const optLetter = String.fromCharCode(65 + idx);
                let badgeBg = "rgba(0,0,0,0.05)";
                let badgeColor = "var(--dark)";
                let badgeBorder = "1px solid var(--border-color)";
                if (isCorrect) {
                    badgeBg = "#22c55e";
                    badgeColor = "#ffffff";
                    badgeBorder = "1px solid #22c55e";
                } else if (isSelected) {
                    badgeBg = "#ef4444";
                    badgeColor = "#ffffff";
                    badgeBorder = "1px solid #ef4444";
                }

                const badgeHtml = '<div style="width: 26px; height: 26px; min-width: 26px; border-radius: 8px; background: ' + badgeBg + '; color: ' + badgeColor + '; border: ' + badgeBorder + '; font-size: 12px; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; font-family: Outfit, sans-serif !important; flex-shrink: 0;">' + optLetter + '</div>';

                if (hasOptionAnalysis) {
                    const optAnalysisText = qNode.oa[idx].trim();
                    const oaFontName = getFontForText(optAnalysisText, fontName);
                    const oaFontStyle = "font-family: " + oaFontName + " !important;";
                    arrowHtml = '<div style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 6px; background: rgba(0,0,0,0.04); border: 1px solid var(--border-color); font-size: 10.5px; font-weight: 700; color: inherit; margin-left: 6px; flex-shrink: 0; font-family: Outfit, sans-serif;">' +
                        '<span>Analysis</span>' +
                        '<i id="oa-arrow-' + index + '-' + idx + '" class="ph-bold ph-caret-down" style="transition: transform 0.25s ease; font-size: 12px;"></i>' +
                        '</div>';

                    let boxClasses = "option-analysis-expandable-box";
                    if (isCorrect) {
                        boxClasses += " oa-box-correct";
                    } else if (isSelected) {
                        boxClasses += " oa-box-wrong";
                    } else {
                        if (idx === 0) boxClasses += " oa-box-a";
                        else if (idx === 1) boxClasses += " oa-box-b";
                        else if (idx === 2) boxClasses += " oa-box-c";
                        else if (idx === 3) boxClasses += " oa-box-d";
                        else boxClasses += " oa-box-e";
                    }

                    const boxLabel = "Option " + optLetter + " Analysis";

                    analysisBoxHtml = '<div id="oa-box-' + index + '-' + idx + '" class="' + boxClasses + '" style="display:none; ' + oaFontStyle + '">' +
                        '<div class="oa-box-label" style="font-family: Outfit, sans-serif !important;"><i class="ph-bold ph-info" style="font-size: 12px;"></i> ' + boxLabel + '</div>' +
                        '<div class="oa-box-content" style="font-weight: 400 !important; font-size: 13.5px; line-height: 1.6; color: inherit; ' + oaFontStyle + '">' + formatMarkdownBold(optAnalysisText) + '</div>' +
                        '</div>';
                }

                let extraProps = 'onclick="' + (hasOptionAnalysis ? 'toggleOptionAnalysis(' + index + ', ' + idx + ')' : '') + '" style="' + style + ' display:flex; align-items:center; justify-content:space-between; width:100%; ' + (hasOptionAnalysis ? 'cursor:pointer;' : '') + '"';

                return '<div style="margin-bottom:8px;">' +
                    '<div class="' + classes + '" ' + extraProps + '>' + 
                    '  <div style="flex-grow:1; display:flex; align-items:center; gap:10px; min-width:0; ' + oFontStyle + '">' +
                    '    ' + badgeHtml +
                    '    <div style="font-weight: 400 !important; font-size: 14.5px; line-height: 1.5; color: inherit; flex-grow: 1; min-width: 0; word-break: break-word; ' + oFontStyle + '">' + oVal + '</div>' +
                    '  </div>' +
                    '  <div style="display: flex; align-items: center; gap: 6px; flex-shrink: 0; margin-left: 8px;">' +
                    '    ' + arrowHtml +
                    '  </div>' +
                    '</div>' +
                    analysisBoxHtml +
                    '</div>';
            }).join('');

            const _hideSourceOnStudent = ${!!social.hideSourceOnStudent};
            let sourceText = qBlock.source || qNode.source || "";
            if (!sourceText) {
                sourceText = extractBracketSource(qNode.q);
            }
            let sourceHtml = "";
            
            const srcFontName = getFontForText(sourceText, fontName);
            const srcFontStyle = "font-family: " + srcFontName + " !important;";
            
            if (sourceText && !_hideSourceOnStudent) {
                sourceHtml = '<div class="analysis-source-box" style="' + srcFontStyle + '">' +
                    '<span style="font-weight: 700; font-family: Outfit, sans-serif !important; margin-right: 4px;">Source:</span> ' + sourceText.replace(/^:\s*/, '') +
                    '</div>';
            }

            const expFontName = getFontForText(qNode.s, fontName);
            const expFontStyle = "font-family: " + expFontName + " !important;";

            var analysisIsSaved = isQuestionSaved(index);
            var analysisSaveBtnHtml = '<button onclick="handleToggleSaveFromAnalysis(' + index + ')" style="background: none; border: none; color: ' + (analysisIsSaved ? '#22c55e' : '#009CFC') + '; font-size: 11px; font-weight: bold; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;">' +
                '<i class="' + (analysisIsSaved ? 'ph-fill ph-bookmark-simple' : 'ph-bold ph-bookmark-simple') + '" style="font-size: 14px;"></i> ' + (analysisIsSaved ? 'Saved' : 'Save') +
                '</button>';

            var analysisReportBtnHtml = '<button onclick="handleReportActiveQuestionIssue(' + index + ')" style="background: none; border: none; color: #ef4444; font-size: 11px; font-weight: bold; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;">' +
                '<i class="ph-bold ph-warning-circle" style="font-size: 14px;"></i> Report' +
                '</button>';

            var qLangs = getQuestionAvailableLanguages(qBlock);
            var canSwitchLanguage = qLangs.length > 1;

            var currentLangName = _currentLanguage === 'hi' ? 'Hindi' : 'English';
            var nextLangName = _currentLanguage === 'hi' ? 'English' : 'Hindi';
            var analysisLangBtnHtml = '';
            if (canSwitchLanguage) {
                analysisLangBtnHtml = '<button onclick="handleToggleAnalysisLanguage(' + index + ')" id="analysisLangToggleBtn" style="background: rgba(255, 107, 53, 0.08); border: 1.5px solid rgba(255, 107, 53, 0.22); border-radius: 9999px; padding: 3px 10px; color: var(--primary); font-size: 11px; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; font-family: Outfit, sans-serif;" title="Change Language">' +
                    '<i class="ph-bold ph-translate" style="font-size: 13px;"></i> ' + nextLangName +
                    '</button>';
            }

            // Strict bounds-checked Previous / Next navigation across filtered items
            const prevDisabled = _currentFilteredPos <= 0;
            const nextDisabled = _currentFilteredPos >= _filteredQuestionIndices.length - 1;

            let navCenterText = '<span style="font-weight: 800; color: var(--dark);">Q. ' + (index + 1) + ' (' + (_currentFilteredPos + 1) + ' of ' + _filteredQuestionIndices.length + ')</span>';
            if (_filteredQuestionIndices.length === _activeQuestions.length) {
                navCenterText = '<span style="font-weight: 800; color: var(--dark);">Q. ' + (index + 1) + ' / ' + _activeQuestions.length + '</span>';
            }

            const navigationHtml = 
                '<div style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px; padding-top: 14px; border-top: 1.5px solid var(--border-color); gap: 12px;">' +
                '  <button class="analysis-nav-btn" ' + (prevDisabled ? 'disabled' : 'onclick="handleNavigateFilteredAnalysis(-1)"') + ' style="flex: 1; max-width: 150px;">' +
                '    <i class="ph-bold ph-caret-left" style="font-size: 14px;"></i> Back' +
                '  </button>' +
                '  <div style="font-size: 12.5px; font-family: Outfit, sans-serif; letter-spacing: 0.3px; text-align: center;">' +
                '    ' + navCenterText +
                '  </div>' +
                '  <button class="analysis-nav-btn" ' + (nextDisabled ? 'disabled' : 'onclick="handleNavigateFilteredAnalysis(1)"') + ' style="flex: 1; max-width: 150px;">' +
                '    Next <i class="ph-bold ph-caret-right" style="font-size: 14px;"></i>' +
                '  </button>' +
                '</div>';

            const wasRevealed = _revealedAnswersMap[index] === true;
            const revealedBannerHtml = wasRevealed ? 
                '<div style="background: rgba(245, 158, 11, 0.08); border: 1.5px dashed #f59e0b; border-radius: 12px; padding: 10px 14px; display: flex; align-items: center; gap: 8px; margin-bottom: 15px; color: #b45309; font-size: 12px; font-weight: bold;">' +
                '  <i class="ph-fill ph-eye" style="font-size: 16px; color: #f59e0b;"></i>' +
                '  <span>Answer Revealed during test (Eye icon clicked)</span>' +
                '</div>' : '';

            let questionStatusBadge = "";
            const userSelectedOpt = _answersMap[index];
            if (userSelectedOpt !== undefined && userSelectedOpt !== null) {
                if (userSelectedOpt === qNode.c) {
                    questionStatusBadge = '<span style="background: rgba(34, 197, 94, 0.12); color: #16a34a; border: 1px solid rgba(34, 197, 94, 0.28); font-size: 11px; font-weight: 700; padding: 2.5px 9px; border-radius: 9999px; display: inline-flex; align-items: center; gap: 4px; font-family: Outfit, sans-serif;"><i class="ph-bold ph-check-circle" style="font-size: 13px;"></i> Correct</span>';
                } else {
                    questionStatusBadge = '<span style="background: rgba(239, 68, 68, 0.12); color: #dc2626; border: 1px solid rgba(239, 68, 68, 0.28); font-size: 11px; font-weight: 700; padding: 2.5px 9px; border-radius: 9999px; display: inline-flex; align-items: center; gap: 4px; font-family: Outfit, sans-serif;"><i class="ph-bold ph-x-circle" style="font-size: 13px;"></i> Incorrect</span>';
                }
            } else {
                questionStatusBadge = '<span style="background: rgba(100, 116, 139, 0.12); color: #64748b; border: 1px solid rgba(100, 116, 139, 0.28); font-size: 11px; font-weight: 700; padding: 2.5px 9px; border-radius: 9999px; display: inline-flex; align-items: center; gap: 4px; font-family: Outfit, sans-serif;"><i class="ph-bold ph-minus-circle" style="font-size: 13px;"></i> Unattempted</span>';
            }

            const questionBoxHtml = 
                '<div class="analysis-question-box">' +
                '  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">' +
                '    <div style="display: flex; align-items: center; gap: 6px;">' +
                '      <span style="background: rgba(255, 107, 53, 0.09); color: var(--primary); font-size: 11px; font-weight: 800; padding: 2.5px 8px; border-radius: 6px; text-transform: uppercase; font-family: Outfit, sans-serif; letter-spacing: 0.5px;">Question ' + (index + 1) + '</span>' +
                '    </div>' +
                '    ' + questionStatusBadge +
                '  </div>' +
                '  <div class="analysis-question-text" style="' + qFontStyle + '">' + sanitizeQuestionText(qNode.q) + '</div>' +
                '</div>';

            let explanationHtml = "";
            if (qNode.s) {
                explanationHtml = 
                    '<div class="analysis-explanation-box" style="' + expFontStyle + '">' +
                    '  <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid var(--border-color); padding-bottom: 8px; margin-bottom: 10px;">' +
                    '    <div style="display: flex; align-items: center; gap: 7px; color: var(--primary); font-size: 11.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; font-family: Outfit, sans-serif;">' +
                    '      <i class="ph-bold ph-lightbulb" style="font-size: 15px;"></i>' +
                    '      <span>Explanation & Solution</span>' +
                    '    </div>' +
                    '    <span style="font-size: 11px; font-weight: 700; color: #15803d; background: rgba(34, 197, 94, 0.12); border: 1px solid rgba(34, 197, 94, 0.3); padding: 2px 8px; border-radius: 6px; font-family: Outfit, sans-serif;">Correct: Option ' + String.fromCharCode(64 + qNode.c) + '</span>' +
                    '  </div>' +
                    '  <div class="analysis-explanation-content" style="' + expFontStyle + '">' + formatMarkdownBold(qNode.s) + '</div>' +
                    '</div>';
            } else {
                explanationHtml = 
                    '<div class="analysis-explanation-box" style="opacity: 0.85; font-family: Outfit, sans-serif !important;">' +
                    '  <div style="display: flex; align-items: center; gap: 6px; color: var(--grey-text); font-size: 11.5px; font-weight: 700; text-transform: uppercase; margin-bottom: 6px;">' +
                    '    <i class="ph-bold ph-info" style="font-size: 15px;"></i>' +
                    '    <span>Explanation</span>' +
                    '  </div>' +
                    '  <div style="font-size: 13.5px; font-weight: 400 !important; color: var(--grey-text);">No detailed explanation provided for this question.</div>' +
                    '</div>';
            }

            detailCard.innerHTML = 
                '<div class="lang-' + _currentLanguage + '" style="' + fontStyle + '">' +
                '  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 8px;">' +
                '    <div style="display: flex; align-items: center; gap: 8px;">' +
                '      <div style="font-size:11px; font-weight:bold; color:var(--primary); font-family: Outfit, sans-serif !important; text-transform: uppercase;">QUESTION ' + (index + 1) + ' ANALYSIS (' + _currentLanguage.toUpperCase() + ')</div>' +
                '    </div>' +
                '    <div style="display: flex; align-items: center; gap: 12px;">' +
                (analysisLangBtnHtml ? '       ' + analysisLangBtnHtml : '') +
                '       ' + analysisSaveBtnHtml +
                '       ' + analysisReportBtnHtml +
                '    </div>' +
                '  </div>' +
                '  ' + revealedBannerHtml +
                '  ' + questionBoxHtml +
                (qNode.image ? '<div class="analysis-question-image-box" style="margin: -10px 0 15px; text-align: center;"><img src="' + qNode.image + '" style="max-width: 100%; max-height: 250px; border-radius: 12px; border: 1.5px solid var(--border-color); box-shadow: 0 4px 12px rgba(0,0,0,0.05); object-fit: contain; background: white;" referrerPolicy="no-referrer"></div>' : '') +
                '  <div style="margin-top:10px;">' + optSelectionsHtml + '</div>' +
                '  ' + explanationHtml +
                '  ' + sourceHtml +
                '  ' + navigationHtml +
                '</div>';

            triggerMathJax();
        }

        function handleClosePaymentSuccessModal() {
            document.getElementById("paymentSuccessPopupModal").style.display = "none";
            handleTabNavigation('home');
        }

        // IndexedDB Cache Storage helper to make the page load instantly on subsequent opens
        var CACHE_DB_NAME = "TaiyariyaCachedDB";
        var CACHE_STORE_NAME = "DatabaseStore";
        var QUESTIONS_CACHE_STORE = "ExamQuestionsStore";
        var CACHE_KEY = "assembled_config";

        function upgradeDBSchema(e) {
            var db = e.target.result;
            if (!db.objectStoreNames.contains(CACHE_STORE_NAME)) {
                db.createObjectStore(CACHE_STORE_NAME);
            }
            if (!db.objectStoreNames.contains(QUESTIONS_CACHE_STORE)) {
                db.createObjectStore(QUESTIONS_CACHE_STORE);
            }
        }

        var _dbInstance = null;
        var _dbOpeningPromise = null;

        function getDB() {
            if (_dbInstance) {
                return Promise.resolve(_dbInstance);
            }
            if (_dbOpeningPromise) {
                return _dbOpeningPromise;
            }

            _dbOpeningPromise = new Promise(function(resolve, reject) {
                var isResolved = false;
                
                // Add a smart safety fallback timeout of 450ms! If IndexedDB doesn't open
                // within 450ms, we assume it is blocked/locked and reject the promise immediately.
                // This allows the app to load instantly from external configuration without any loader hang!
                var timeoutId = setTimeout(function() {
                    if (!isResolved) {
                        isResolved = true;
                        console.warn("IndexedDB connection timed out (450ms). Bypassing cache to avoid any loader hang.");
                        reject(new Error("Timeout"));
                        _dbOpeningPromise = null;
                    }
                }, 450);

                try {
                    var req = indexedDB.open(CACHE_DB_NAME, 2);
                    
                    req.onupgradeneeded = upgradeDBSchema;
                    
                    req.onsuccess = function(e) {
                        if (isResolved) {
                            try { e.target.result.close(); } catch(err){}
                            return;
                        }
                        clearTimeout(timeoutId);
                        isResolved = true;
                        _dbInstance = e.target.result;
                        
                        // Close if database shifts (e.g., version changes)
                        _dbInstance.onversionchange = function() {
                            try { _dbInstance.close(); } catch(err){}
                            _dbInstance = null;
                        };
                        
                        resolve(_dbInstance);
                        _dbOpeningPromise = null;
                    };
                    
                    req.onerror = function() {
                        if (isResolved) return;
                        clearTimeout(timeoutId);
                        isResolved = true;
                        reject(new Error("IndexedDB Open Error"));
                        _dbOpeningPromise = null;
                    };
                    
                    req.onblocked = function() {
                        if (isResolved) return;
                        clearTimeout(timeoutId);
                        isResolved = true;
                        console.warn("IndexedDB upgrade blocked! Rejecting immediately.");
                        reject(new Error("IndexedDB Blocked"));
                        _dbOpeningPromise = null;
                    };
                } catch(err) {
                    if (isResolved) return;
                    clearTimeout(timeoutId);
                    isResolved = true;
                    reject(err);
                    _dbOpeningPromise = null;
                }
            });

            return _dbOpeningPromise;
        }

        function getCachedPayload() {
            return new Promise(function(resolve) {
                getDB().then(function(db) {
                    try {
                        var tx = db.transaction(CACHE_STORE_NAME, "readonly");
                        var store = tx.objectStore(CACHE_STORE_NAME);
                        var getReq = store.get(CACHE_KEY);
                        getReq.onsuccess = function() {
                            var data = getReq.result;
                            if (data && typeof data === "object" && data.payload) {
                                resolve(data);
                            } else if (typeof data === "string") {
                                resolve({ payload: data, buildId: "" });
                            } else {
                                resolve(null);
                            }
                        };
                        getReq.onerror = function() {
                            resolve(null);
                        };
                    } catch(txErr) {
                        resolve(null);
                    }
                }).catch(function(err) {
                    console.warn("Skipping getCachedPayload due to DB mismatch/timeout", err);
                    resolve(null);
                });
            });
        }

        function savePayloadToCache(payload, buildId) {
            getDB().then(function(db) {
                try {
                    var tx = db.transaction(CACHE_STORE_NAME, "readwrite");
                    var store = tx.objectStore(CACHE_STORE_NAME);
                    store.put({ payload: payload, buildId: buildId || "" }, CACHE_KEY);
                } catch(e) {
                    console.error("IndexedDB cache save failed:", e);
                }
            }).catch(function(err) {
                console.warn("Skip savePayloadToCache, db locked:", err);
            });
        }

        function clearAllExamQuestionsCache() {
            return new Promise(function(resolve) {
                getDB().then(function(db) {
                    try {
                        var tx = db.transaction(QUESTIONS_CACHE_STORE, "readwrite");
                        var store = tx.objectStore(QUESTIONS_CACHE_STORE);
                        var req = store.clear();
                        req.onsuccess = function() {
                            console.log("IndexedDB questions cache purged cleanly.");
                            resolve(true);
                        };
                        req.onerror = function() {
                            resolve(false);
                        };
                    } catch(e) {
                        resolve(false);
                    }
                }).catch(function() {
                    resolve(false);
                });
            });
        }

        function getCachedExamQuestions(examId, expectedVersion, expectedUpdatedAt) {
            return new Promise(function(resolve) {
                getDB().then(function(db) {
                    try {
                        var tx = db.transaction(QUESTIONS_CACHE_STORE, "readonly");
                        var store = tx.objectStore(QUESTIONS_CACHE_STORE);
                        var getReq = store.get(examId);
                        getReq.onsuccess = function() {
                            var cached = getReq.result;
                            if (!cached) {
                                resolve(null);
                                return;
                            }
                            // Version Validation: If test has an updated qVersion or timestamp that does not match, cache is stale
                            if (expectedVersion && cached.qVersion && cached.qVersion !== expectedVersion) {
                                console.log("Cached questions version mismatch (" + cached.qVersion + " vs " + expectedVersion + "). Cache invalidated!");
                                resolve(null);
                                return;
                            }
                            if (expectedUpdatedAt && cached.updatedAt && cached.updatedAt < expectedUpdatedAt) {
                                console.log("Cached questions older than test definition. Cache invalidated!");
                                resolve(null);
                                return;
                            }
                            var currentBuild = window.__studentAppBuildId || "";
                            if (currentBuild && cached.buildId && cached.buildId !== currentBuild) {
                                console.log("Cached questions from different build (" + cached.buildId + " vs " + currentBuild + "). Cache invalidated!");
                                resolve(null);
                                return;
                            }
                            resolve(cached);
                        };
                        getReq.onerror = function() {
                            resolve(null);
                        };
                    } catch(txErr) {
                        resolve(null);
                    }
                }).catch(function() {
                    resolve(null);
                });
            });
        }

        function saveExamQuestionsToCache(examId, questionsPayload) {
            getDB().then(function(db) {
                try {
                    var tx = db.transaction(QUESTIONS_CACHE_STORE, "readwrite");
                    var store = tx.objectStore(QUESTIONS_CACHE_STORE);
                    var toSave = Object.assign({}, questionsPayload, {
                        savedAt: Date.now(),
                        buildId: window.__studentAppBuildId || ""
                    });
                    store.put(toSave, examId);
                } catch(txErr) {
                    console.warn("Could not save questions in transaction", txErr);
                }
            }).catch(function(err) {
                console.warn("Skip saveExamQuestionsToCache, db locked:", err);
            });
        }

        // Image memory caching & preheating for zero-latency page loading on mobile and desktop
        window.__imgCache = window.__imgCache || {};
        window.__imgCacheLoaded = false;

        function initImageCache() {
            return new Promise(function(resolve) {
                window.__imgCacheLoaded = true;
                resolve();
            });
        }

        function preloadAllMediaAssets() {
            if (!DB) return;
            try {
                var urls = [];
                if (Array.isArray(DB.sliders)) {
                    DB.sliders.forEach(function(s) { if (s && s.image) urls.push(s.image); });
                }
                if (Array.isArray(DB.popups)) {
                    DB.popups.forEach(function(p) { if (p && p.imageUrl) urls.push(p.imageUrl); });
                }
                if (Array.isArray(DB.notifications)) {
                    DB.notifications.forEach(function(n) { if (n && n.image) urls.push(n.image); });
                }
                if (Array.isArray(DB.testCategories)) {
                    DB.testCategories.forEach(function(c) { if (c && c.image) urls.push(c.image); });
                }
                if (Array.isArray(DB.pdfCategories)) {
                    DB.pdfCategories.forEach(function(c) { if (c && c.image) urls.push(c.image); });
                }
                if (DB.appConfig) {
                    if (DB.appConfig.logoUrl) urls.push(DB.appConfig.logoUrl);
                    if (DB.appConfig.ogImage) urls.push(DB.appConfig.ogImage);
                }

                urls.forEach(function(url) {
                    if (url && typeof url === "string" && url.trim().length > 0) {
                        var clean = enhanceImageUrlQuality(url);
                        var img = new Image();
                        img.src = clean;
                    }
                });
            } catch(e) {
                console.warn("Preload media error:", e);
            }
        }

        // Image caching with super-fast instant URL resolution
        function getCachedImageUrl(url) {
            url = enhanceImageUrlQuality(url);
            return Promise.resolve(url);
        }

        var _bgRefreshQueue = [];
        var _bgRefreshProcessing = false;

        function processNextBgRefresh() {
            if (_bgRefreshQueue.length === 0) {
                _bgRefreshProcessing = false;
                return;
            }
            _bgRefreshProcessing = true;
            
            var item = _bgRefreshQueue.shift();
            var url = item.url;
            var existingValue = item.existingValue;

            fetch(url)
                .then(function(response) {
                    if (!response.ok) throw new Error("HTTP " + response.status);
                    return response.blob();
                })
                .then(function(blob) {
                    var reader = new FileReader();
                    reader.onloadend = function() {
                        var newValue = reader.result;
                        if (newValue !== existingValue) {
                            if (window.__imgCache) {
                                window.__imgCache[url] = newValue;
                            }
                            getDB().then(function(db) {
                                try {
                                    var txWrite = db.transaction(CACHE_STORE_NAME, "readwrite");
                                    var storeWrite = txWrite.objectStore(CACHE_STORE_NAME);
                                    storeWrite.put(newValue, "img_" + url);
                                } catch(err) {
                                    console.error("Failed to write to database image store value", err);
                                }
                            }).catch(function() {});

                            // Live seamless transition: find any matching img tags currently visible and update their src
                            var images = document.getElementsByTagName("img");
                            for (var i = 0; i < images.length; i++) {
                                var img = images[i];
                                if (img.src === url || img.src === newValue || img.getAttribute("data-original-src") === url) {
                                    img.src = newValue;
                                }
                            }
                        }
                        // Delay 200ms before processing next image to keep the interface absolutely silky smooth at 60 FPS
                        setTimeout(processNextBgRefresh, 200);
                    };
                    reader.readAsDataURL(blob);
                })
                .catch(function() {
                    // Suppress and continue gently
                    setTimeout(processNextBgRefresh, 150);
                });
        }

        // Silent background fetch, cache save, and live update of matching images on-screen
        function triggerBackgroundRefresh(url, existingValue) {
            if (existingValue) {
                return;
            }
            if (!url || url.indexOf("data:") === 0 || url.indexOf("blob:") === 0) return;
            
            // Avoid duplicate queueing
            for (var i = 0; i < _bgRefreshQueue.length; i++) {
                if (_bgRefreshQueue[i].url === url) return;
            }

            _bgRefreshQueue.push({ url: url, existingValue: existingValue });
            
            if (!_bgRefreshProcessing) {
                // Wait 1.5 seconds after portal loading before executing background network operations
                // to make sure user scrolling on sliders/category grid/alerts doesn't lag!
                setTimeout(processNextBgRefresh, 1500);
            }
        }

        function ensurePaymentQrCached() {
            try {
                var qrUrl = "";
                if (_activeCategoryForPayment) {
                    qrUrl = _activeCategoryForPayment.paymentQr || (DB && DB.social && DB.social.paymentQr) || "";
                } else {
                    qrUrl = (DB && DB.social && DB.social.paymentQr) || "";
                }
                if (qrUrl) {
                    var img = document.getElementById("displayPayQrImage");
                    if (img) {
                        img.setAttribute("data-original-src", qrUrl);
                        if (window.__imgCache && window.__imgCache[qrUrl]) {
                            img.src = window.__imgCache[qrUrl];
                        } else {
                            img.src = qrUrl;
                            if (typeof getCachedImageUrl === "function") {
                                getCachedImageUrl(qrUrl).then(function(cachedUrl) {
                                    if (cachedUrl && cachedUrl !== qrUrl && img) {
                                        img.src = cachedUrl;
                                    }
                                });
                            }
                        }
                    }
                }
            } catch(e) {
                console.warn("Could not cache payment QR:", e);
            }
        }

        async function _fetchStudentsDatabase() {
            try {
                var cacheBuster = "?v=" + Date.now();
                var candidateUrls = [
                    _getRegistryPath("students_db.txt") + cacheBuster,
                    _getRegistryPath("student_db.txt") + cacheBuster,
                    "./students_db.txt" + cacheBuster,
                    "./student_db.txt" + cacheBuster,
                    "/students_db.txt" + cacheBuster,
                    "/student_db.txt" + cacheBuster
                ];

                // Remove duplicate entries
                candidateUrls = Array.from(new Set(candidateUrls));
                console.log("Synchronizing student directory from candidate URLs...");

                var loaded = false;
                for (var i = 0; i < candidateUrls.length; i++) {
                    var url = candidateUrls[i];
                    try {
                        var res = await fetch(url, { cache: "no-store", headers: { "Cache-Control": "no-cache, no-store, must-revalidate" } });
                        if (!res.ok) continue;

                        var dataText = await res.text();
                        if (!dataText || dataText.trim() === "") continue;

                        var trimmedText = dataText.trim();
                        // Ignore HTML responses (e.g. 200 OK SPA fallback from .htaccess)
                        if (trimmedText.startsWith("<") || trimmedText.toLowerCase().startsWith("<!doctype")) {
                            continue;
                        }

                        var decoded = decodeObfuscatedPayload(trimmedText);
                        var parsedStudents = null;
                        try {
                            parsedStudents = JSON.parse(decoded);
                        } catch (e1) {
                            try {
                                parsedStudents = JSON.parse(trimmedText);
                            } catch (e2) {}
                        }

                        if (Array.isArray(parsedStudents) && parsedStudents.length > 0) {
                            DB.students = parsedStudents;
                            try {
                                localStorage.setItem("_cached_students_db", JSON.stringify(parsedStudents));
                            } catch (e) {}
                            console.log("Student profiles loaded from " + url + " (" + parsedStudents.length + " students)");

                            if (_studentLoggedInUser) {
                                var freshMatch = parsedStudents.find(function(s) {
                                    var uMail = (_studentLoggedInUser.emailOrMobile || _studentLoggedInUser.email || "").toString().trim().toLowerCase();
                                    var sMail = (s.emailOrMobile || s.email || "").toString().trim().toLowerCase();
                                    return sMail === uMail;
                                });
                                if (freshMatch) {
                                    _studentLoggedInUser = freshMatch;
                                    localStorage.setItem("_secured_active_aspirant", JSON.stringify(freshMatch));
                                }
                            }
                            loaded = true;
                            break;
                        }
                    } catch (eUrl) {
                        // ignore and try next URL
                    }
                }

                if (!loaded && (!DB.students || DB.students.length === 0)) {
                    var localCache = localStorage.getItem("_cached_students_db");
                    if (localCache) {
                        try {
                            DB.students = JSON.parse(localCache);
                            console.log("Restored student profiles from local storage cache.");
                        } catch (e) {}
                    }
                }
            } catch (err) {
                console.warn("Could not load dynamic student directories, using embedded local cache.", err);
            }
        }

        async function _fetchCategoryPaymentConfig() {
            try {
                var cacheBuster = "?v=" + Date.now();
                var r2PaymentUrl = _getRegistryPath("CategoryPayment.txt") + cacheBuster;
                console.log("Synchronizing category payment setup from R2...");
                
                var res = await fetch(r2PaymentUrl, { cache: "no-store", headers: { "Cache-Control": "no-cache, no-store, must-revalidate" } });
                if (res.ok) {
                    var dataText = await res.text();
                    if (dataText && dataText.trim() !== "") {
                        var parsedConfig = JSON.parse(dataText.trim());
                        console.log("Successfully fetched category payments override:", parsedConfig);
                        
                        var mergePayment = function(cat) {
                            if (parsedConfig[cat.id]) {
                                var override = parsedConfig[cat.id];
                                cat.isPaid = !!override.isPaid;
                                if (override.paymentAmount) cat.paymentAmount = override.paymentAmount;
                                if (override.paymentValidityDays) cat.paymentValidityDays = override.paymentValidityDays;
                                if (override.paymentBenefits) cat.paymentBenefits = override.paymentBenefits;
                                if (override.paymentQr) cat.paymentQr = override.paymentQr;
                                if (override.paymentUrl) cat.paymentUrl = override.paymentUrl;
                                if (override.paymentHelpdeskUrl) cat.paymentHelpdeskUrl = override.paymentHelpdeskUrl;
                            }
                        };
                        
                        if (DB.testCategories) DB.testCategories.forEach(mergePayment);
                        if (DB.pdfCategories) DB.pdfCategories.forEach(mergePayment);
                    }
                }
            } catch (err) {
                console.warn("Could not load dynamic CategoryPayment.txt overrides, using embedded local values.", err);
            }
        }

        function dismissInitSplash() {
            try {
                var splash = document.getElementById("appInitSplash");
                if (splash) {
                    splash.style.opacity = "0";
                    splash.style.pointerEvents = "none";
                    setTimeout(function() {
                        try {
                            if (splash && splash.parentNode) {
                                splash.parentNode.removeChild(splash);
                            }
                        } catch(e){}
                    }, 500);
                }
            } catch(e){}
        }

        var _portalInitialized = false;
        async function finishPortalInitialization() {
            if (_portalInitialized) return;
            _portalInitialized = true;

            try {
                preloadAllMediaAssets();
            } catch(e) {}

            // Synchronize latest student login credentials and category payment setups dynamically in background (non-blocking)
            _fetchCategoryPaymentConfig().catch(function(err) {
                console.error("Dynamic category payment setup fetch error:", err);
            });

            _fetchStudentsDatabase().catch(function(err) {
                console.error("Dynamic student DB fetch error:", err);
            });

            try {
                setupAntiPiracyBlockers();
            } catch(e) {
                console.error("error setting up blockers:", e);
            }
            try {
                launchSlidersCarousel();
            } catch(e) {
                console.error("error loading carousel:", e);
            }
            try {
                renderNoticesScrollingBoard();
            } catch(e) {
                console.error("error rendering notices:", e);
            }

            // Load saved user session
            try {
                const cachedUser = localStorage.getItem("_secured_active_aspirant");
                if (cachedUser) {
                    try {
                        _studentLoggedInUser = JSON.parse(cachedUser);
                        setTimeout(function() {
                            try { syncSavedQuestionsWithCloud("pull"); } catch(e){}
                        }, 500);
                    } catch(e) {
                        _studentLoggedInUser = null;
                    }
                }
            } catch(e) {
                console.error("error loading cached session:", e);
            }

            // Periodically check live concurrent session statuses
            try {
                if (_studentLoggedInUser) {
                    checkConcurrentUserSession();
                }
                setInterval(function() {
                    if (_studentLoggedInUser) {
                        checkConcurrentUserSession();
                    }
                }, 15000);
            } catch(e) {
                console.error("error starting concurrent session checks", e);
            }

            try {
                refreshStudentAccountProfileGate();
            } catch(e) {
                console.error("error refreshing profile gate:", e);
            }
            try {
                renderSavedQuestionsBox();
            } catch(e) {
                console.error("error rendering saved questions:", e);
            }
            try {
                checkActiveWebsitePopups();
                setInterval(checkActiveWebsitePopups, 5000); // Check every 5 seconds for scheduled popups to appear automatically
            } catch(e) {
                console.error("error launching popup active:", e);
            }

            // Restore Dark/Light mode preference on init with automatic system theme fallback
            try {
                const stored = localStorage.getItem("_preemptive_theme_mode");
                let isDark = false;
                if (stored === "dark") {
                    isDark = true;
                } else if (stored === "light") {
                    isDark = false;
                } else {
                    isDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
                }

                if (isDark) {
                    document.body.classList.add("dark-mode");
                } else {
                    document.body.classList.remove("dark-mode");
                }
                updateThemeIcons(isDark);

                // Listen to device theme changes if no override is saved in localStorage
                if (!stored && window.matchMedia) {
                    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function(e) {
                        if (!localStorage.getItem("_preemptive_theme_mode")) {
                            const newDark = e.matches;
                            if (newDark) {
                                document.body.classList.add("dark-mode");
                            } else {
                                document.body.classList.remove("dark-mode");
                            }
                            updateThemeIcons(newDark);
                        }
                    });
                }
            } catch(e) {}

            // Always start on the Home tab on startup under root domain ('https://taiyariya.in/')
            _isHandlingPopState = true;
            try {
                handleTabNavigation("home");
            } catch(e) {
                handleTabNavigation("home");
            } finally {
                _isHandlingPopState = false;
            }

            // If a specific deep link route was opened (e.g. https://taiyariya.in/test),
            // smoothly transition / redirect to it after root home view initializes
            if (_initialRequestedDeepLinkPath && _initialRequestedDeepLinkPath !== '/' && _initialRequestedDeepLinkPath !== '/home') {
                var pendingRoute = _initialRequestedDeepLinkPath;
                _initialRequestedDeepLinkPath = null;
                setTimeout(function() {
                    try {
                        handleDeepLinking(pendingRoute);
                    } catch (e) {
                        console.error("Deep link trigger error:", e);
                    }
                }, 60);
            }

            try {
                initEmailCooldowns();
            } catch(e) {
                console.error("error initializing email cooldowns:", e);
            }

            // Dismiss blinking logo splash screen smoothly once initialization is complete
            setTimeout(function() {
                try { dismissInitSplash(); } catch(e){}
            }, 120);
        }

        // Load Persistent Sessions on Start
        async function startStudentPortal() {
            // Safety fallback timeout: Ensure loading splash overlay dismisses even if offline or network stalls for over 12s
            setTimeout(function() {
                if (!_portalInitialized) {
                    if (!DB || !DB.testCategories) {
                        DB = { testCategories: [], pdfCategories: [], sliders: [], notices: [], appName: "Taiyariya", logo: "", social: {} };
                    }
                    try { finishPortalInitialization(); } catch(e){}
                } else {
                    try { dismissInitSplash(); } catch(e){}
                }
            }, 12000);

            try { initImageCache(); } catch(e){}
            
            // Clear any legacy ServiceWorker or CacheStorage left behind by webviews
            try {
                if ('serviceWorker' in navigator) {
                    navigator.serviceWorker.getRegistrations().then(function(regs) {
                        for (var r = 0; r < regs.length; r++) { regs[r].unregister(); }
                    }).catch(function(){});
                }
                if ('caches' in window) {
                    caches.keys().then(function(keys) {
                        for (var k = 0; k < keys.length; k++) { caches.delete(keys[k]); }
                    }).catch(function(){});
                }
            } catch(swErr) {}

            var currentBuildId = window.__studentAppBuildId || "";
            var cachedBuildId = localStorage.getItem("prayas_one_student_db_build_id") || "";

            // If build ID changed, invalidate stale local storage payload
            if (currentBuildId && cachedBuildId && currentBuildId !== cachedBuildId) {
                console.log("New build ID detected (" + currentBuildId + " vs " + cachedBuildId + "). Purging stale local database cache!");
                try { localStorage.removeItem("prayas_one_student_db_payload"); } catch(e){}
                try { localStorage.removeItem("prayas_one_student_db_etag"); } catch(e){}
                try { localStorage.removeItem("prayas_one_student_db_build_id"); } catch(e){}
                try { clearAllExamQuestionsCache(); } catch(e){}
            }

            var loadedSuccessfully = true;
            var loadedFromCache = false;
            var cachedData = null;

            if (window.__studentAppChunkCount && window.__studentAppChunkCount > 0) {
                // Try to load synchronously from localStorage first for absolute instantaneous booting
                try {
                    var localPayload = localStorage.getItem("prayas_one_student_db_payload");
                    if (localPayload && localPayload.trim() !== "") {
                        var parsed = JSON.parse(decodeObfuscatedPayload(localPayload));
                        if (parsed && parsed.testCategories && parsed.testCategories.length > 0) {
                            DB = parsed;
                            enhanceAllDbImages(DB);
                            loadedFromCache = true;
                            console.log("Database loaded features instantly from localStorage cache!");
                            try { ensurePaymentQrCached(); } catch(e){}
                            
                            try {
                                finishPortalInitialization();
                            } catch(err_init) {
                                console.error("Error doing hot start from localStorage:", err_init);
                            }
                        }
                    }
                } catch (localErr) {
                    console.warn("Could not load from localStorage cache:", localErr);
                }

                // If not loaded from localStorage, try IndexedDB cache immediately
                if (!loadedFromCache) {
                    try {
                        cachedData = await getCachedPayload();
                        if (cachedData && cachedData.payload && cachedData.payload.trim() !== "") {
                            var parsed = JSON.parse(decodeObfuscatedPayload(cachedData.payload));
                            if (parsed && parsed.testCategories && parsed.testCategories.length > 0) {
                                DB = parsed;
                                enhanceAllDbImages(DB);
                                loadedFromCache = true;
                                console.log("Database loaded features instantly from IndexedDB cache!");
                                try { ensurePaymentQrCached(); } catch(e){}
                                
                                try {
                                    finishPortalInitialization();
                                } catch(err_init) {
                                    console.error("Error doing hot start from IndexedDB:", err_init);
                                }
                            }
                        }
                    } catch (cacheErr) {
                        console.warn("Could not load from local IndexedDB cache, fetching fresh...", cacheErr);
                    }
                }

                // If still not loaded from local cache, check for embedded site shell database to boot instantly!
                if (!loadedFromCache) {
                    var embeddedB64 = "${base64Config}";
                    if (embeddedB64 && embeddedB64.trim() !== "") {
                        try {
                            var parsed = JSON.parse(decodeObfuscatedPayload(embeddedB64.trim()));
                            if (parsed && parsed.testCategories && parsed.testCategories.length > 0) {
                                DB = parsed;
                                enhanceAllDbImages(DB);
                                loadedFromCache = true;
                                console.log("Database loaded instant site structure from embedded shell payload!");
                                try { ensurePaymentQrCached(); } catch(e){}
                                try {
                                    finishPortalInitialization();
                                } catch(err_init) {
                                    console.error("Error launching from embedded shell payload:", err_init);
                                }
                            }
                        } catch(shellErr) {
                            console.warn("Could not decode embedded shell payload:", shellErr);
                        }
                    }
                }

                // Reusable split chunks fetcher supporting background check as well as instant force-refresh
                window.fetchDatabaseSplitChunks = async function(forceRefresh) {
                    var skipFetch = false;
                    var serverETag = null;
                    var currentBuildId = window.__studentAppBuildId || "";
                    var cachedBuildId = localStorage.getItem("prayas_one_student_db_build_id") || "";

                    if (forceRefresh) {
                        skipFetch = false;
                    } else if (currentBuildId && cachedBuildId && currentBuildId !== cachedBuildId) {
                        console.log("New build detected (" + currentBuildId + " vs cached " + cachedBuildId + "). Forcing database re-sync!");
                        skipFetch = false;
                    } else {
                        try {
                            var cacheBuster = "?v=" + Date.now();
                            var r2Url = _getRegistryPath("config_part_1.txt") + cacheBuster;
                            var controller = typeof AbortController !== "undefined" ? new AbortController() : null;
                            var timeoutId = controller ? setTimeout(function() { controller.abort(); }, 1200) : null;
                            var headRes = await fetch(r2Url, { method: "HEAD", cache: "no-store", headers: { "Cache-Control": "no-cache, no-store, must-revalidate" }, signal: controller ? controller.signal : undefined });
                            if (timeoutId) clearTimeout(timeoutId);
                            if (headRes && headRes.ok) {
                                serverETag = headRes.headers.get("ETag") || headRes.headers.get("Last-Modified");
                                var cachedETag = localStorage.getItem("prayas_one_student_db_etag") || "";
                                if (serverETag && cachedETag && serverETag === cachedETag) {
                                    console.log("Database is up-to-date (ETag matches). Stopping sync.");
                                    skipFetch = true;
                                }
                            }
                        } catch(etagErr) {
                            console.warn("Could not perform ETag update check:", etagErr);
                        }
                    }

                    if (skipFetch) {
                        if (!_portalInitialized) {
                            if (!DB || !DB.testCategories) {
                                DB = { testCategories: [], pdfCategories: [], sliders: [], notices: [], appName: "Taiyariya", logo: "", social: {} };
                            }
                            try { finishPortalInitialization(); } catch(e){}
                        }
                        return;
                    }

                    var loadedChunks = new Array(window.__studentAppChunkCount);
                    var fetchedCount = 0;
                    var promises = [];
                    // Dynamic timestamp cache buster ensures Chrome & mobile browsers always fetch fresh chunks directly from server
                    var buildQuery = "?v=" + encodeURIComponent(currentBuildId) + "&_t=" + Date.now();

                    for (var i = 0; i < window.__studentAppChunkCount; i++) {
                        (function(index) {
                            var filename = "config_part_" + (index + 1) + ".txt";
                            var r2Url = _getRegistryPath(filename) + buildQuery;
                            // Use no-store to force fetching fresh bytes from server
                            var fetchPromise = fetch(r2Url, { cache: "no-store", headers: { "Cache-Control": "no-cache, no-store, must-revalidate" } })
                                .then(function(res) {
                                    if (!res.ok) {
                                        throw new Error("HTTP " + res.status + " retrieving " + filename);
                                    }
                                    return res.text();
                                })
                                .then(function(text) {
                                    loadedChunks[index] = text.trim();
                                    fetchedCount++;
                                })
                                .catch(function(e) {
                                    console.warn("Background fetch failed for segment " + filename, e);
                                });
                            promises.push(fetchPromise);
                        })(i);
                    }

                    try {
                        // Load ALL segments concurrently! This uses maximum internet speed to download chunks in parallel.
                        await Promise.all(promises);

                        var base64ConfigJoined = loadedChunks.join("");
                        if (!base64ConfigJoined || base64ConfigJoined.trim() === "") {
                            console.warn("Downloaded chunks were empty, ignoring update.");
                            if (!_portalInitialized) {
                                if (!DB || !DB.testCategories) {
                                    DB = { testCategories: [], pdfCategories: [], sliders: [], notices: [], appName: "Taiyariya", logo: "", social: {} };
                                }
                                try { finishPortalInitialization(); } catch(e){}
                            }
                            return;
                        }
                        
                        // Check if data actually changed compared to the cache
                        var cachedPayload = "";
                        try {
                            cachedPayload = localStorage.getItem("prayas_one_student_db_payload") || "";
                        } catch (e) {}
                        if (!cachedPayload && cachedData && cachedData.payload) {
                            cachedPayload = cachedData.payload;
                        }

                        if (!forceRefresh && cachedPayload && cachedPayload.trim() === base64ConfigJoined.trim()) {
                            console.log("Database payload matches cached database exactly. Bypassing save.");
                            if (serverETag) {
                                localStorage.setItem("prayas_one_student_db_etag", serverETag);
                            }
                            if (!_portalInitialized) {
                                try { finishPortalInitialization(); } catch(e){}
                            }
                            return;
                        }

                        // Save compiled config in storage with current build ID
                        var currentBuildId = window.__studentAppBuildId || "";
                        savePayloadToCache(base64ConfigJoined, currentBuildId);
                        
                        try {
                            localStorage.setItem("prayas_one_student_db_payload", base64ConfigJoined);
                            localStorage.setItem("prayas_one_student_db_build_id", currentBuildId);
                            if (serverETag) {
                                localStorage.setItem("prayas_one_student_db_etag", serverETag);
                            }
                            clearAllExamQuestionsCache();
                            console.log("Database payload successfully updated in localStorage.");
                        } catch(lsErr) {
                            console.warn("Could not write updated database payload to localStorage:", lsErr);
                        }
                        console.log("Database cache successfully saved / refreshed.");
                        
                        // Parse & display
                        try {
                            DB = JSON.parse(decodeObfuscatedPayload(base64ConfigJoined));
                            enhanceAllDbImages(DB);
                            try { preloadAllMediaAssets(); } catch(e){}
                            console.log("Seamlesly synchronized memory database with freshly downloaded copy.");
                            try { ensurePaymentQrCached(); } catch(e){}
                            
                            if (!_portalInitialized) {
                                try { finishPortalInitialization(); } catch(e){}
                            } else {
                                // Silent live updates of view tabs when user is not taking an exam
                                var inActiveAttempt = (typeof _activeAttemptState !== 'undefined' && _activeAttemptState) || 
                                                        (document.getElementById("activeQuizTimer") && document.getElementById("activeQuizTimer").style.display !== "none");
                                if (!inActiveAttempt) {
                                    try { launchSlidersCarousel(); } catch(e){}
                                    try { renderNoticesScrollingBoard(); } catch(e){}
                                    try { refreshStudentAccountProfileGate(); } catch(e){}
                                    try {
                                        var activeTab = localStorage.getItem("_student_active_tab_id") || "home";
                                        if (activeTab === "tests") {
                                            renderCategorySelectionScreen('test');
                                        } else if (activeTab === "pdfs") {
                                            renderCategorySelectionScreen('pdf');
                                        } else if (activeTab === "home") {
                                            renderSavedQuestionsBox();
                                        }
                                    } catch(e){}
                                }
                            }
                        } catch (e) {
                            console.error("Could not parse freshly compiled background copy:", e);
                            if (!_portalInitialized) {
                                try { finishPortalInitialization(); } catch(e){}
                            }
                        }
                    } catch (e) {
                        console.error("Split chunk parallel load failed:", e);
                        if (!_portalInitialized) {
                            try { finishPortalInitialization(); } catch(e){}
                        }
                    }
                };

                window.handleForceRefreshDatabase = async function(manualClick) {
                    try {
                        var syncIcons = [
                            document.getElementById("headerSyncIcon"),
                            document.getElementById("dSyncIcon")
                        ];
                        var btnAcc = document.getElementById("btnForceRefreshUpdates");
                        
                        syncIcons.forEach(function(ic) {
                            if (ic) ic.style.animation = "db-spin 0.8s linear infinite";
                        });
                        if (btnAcc) {
                            btnAcc.disabled = true;
                            btnAcc.innerHTML = '<i class="ph-bold ph-spinner-gap" style="animation: db-spin 0.8s linear infinite; display: inline-block;"></i> <span>Syncing Latest Updates...</span>';
                        }

                        // Invalidate local caches completely
                        try { localStorage.removeItem("prayas_one_student_db_payload"); } catch(e){}
                        try { localStorage.removeItem("prayas_one_student_db_etag"); } catch(e){}
                        try { localStorage.removeItem("prayas_one_student_db_build_id"); } catch(e){}
                        try { await clearAllExamQuestionsCache(); } catch(e){}

                        if (window.fetchDatabaseSplitChunks) {
                            await window.fetchDatabaseSplitChunks(true);
                        }

                        syncIcons.forEach(function(ic) {
                            if (ic) ic.style.animation = "";
                        });
                        if (btnAcc) {
                            btnAcc.disabled = false;
                            btnAcc.innerHTML = '<i class="ph-bold ph-arrows-clockwise"></i> <span>Sync Live Updates (अपडेट रिफ्रेश करें)</span>';
                        }

                        var statusEl = document.getElementById("updateSyncStatusMsg");
                        if (statusEl) {
                            statusEl.style.display = "block";
                            statusEl.innerText = "✓ Latest tests & questions successfully synchronized!";
                            setTimeout(function() { statusEl.style.display = "none"; }, 4000);
                        }

                        if (manualClick) {
                            showCustomAlert("Sync Completed", "✓ All latest tests, questions, answer keys and solutions have been synchronized from server.");
                        }
                    } catch(syncErr) {
                        console.error("Failed to force sync:", syncErr);
                        var syncIcons = [
                            document.getElementById("headerSyncIcon"),
                            document.getElementById("dSyncIcon")
                        ];
                        syncIcons.forEach(function(ic) {
                            if (ic) ic.style.animation = "";
                        });
                        var btnAcc = document.getElementById("btnForceRefreshUpdates");
                        if (btnAcc) {
                            btnAcc.disabled = false;
                            btnAcc.innerHTML = '<i class="ph-bold ph-arrows-clockwise"></i> <span>Sync Live Updates (अपडेट रिफ्रेश करें)</span>';
                        }
                        if (manualClick) {
                            alert("⚠️ Sync failed: Could not fetch new data from server. Please check internet connection.");
                        }
                    }
                };

                await window.fetchDatabaseSplitChunks(false);
            } else {
                // Inline single file fallback
                try {
                    const embeddedB64 = "${base64Config}";
                    if (embeddedB64 && embeddedB64 !== "") {
                        DB = JSON.parse(decodeObfuscatedPayload(embeddedB64));
                        enhanceAllDbImages(DB);
                    }
                } catch (e) {
                    console.error("Single file DB decode exception:", e);
                }
                finishPortalInitialization();
            }
        }

        function handleDeepLinking(customPath) {
            try {
                // Decode query-based redirect (404.html trick)
                var l = window.location;
                var path = customPath || l.pathname;

                if (!customPath && l.search && l.search[1] === '/' ) {
                    var decoded = l.search.slice(1).split('&').map(function(s) { 
                        return s.replace(/~and~/g, '&'); 
                    }).join('?');
                    path = decoded;
                    var baseDir = window.__studentAppBaseDir || '/';
                    var cleanBaseDir = baseDir.endsWith('/') ? baseDir.slice(0, -1) : baseDir;
                    var cleanDecoded = decoded.startsWith('/') ? decoded : '/' + decoded;
                    window.history.replaceState(null, null, cleanBaseDir + cleanDecoded + (l.hash || ''));
                }

                // Extract path from pathname or hash
                if (path && path.indexOf('#/') === 0) {
                    path = path.slice(1);
                } else if (path && path.indexOf('#') === 0 && path.indexOf('#!') !== 0) {
                    path = path.slice(1);
                }

                var segments = (path || '').split('/').filter(function(s) {
                    return s && s !== 'index.html' && s !== 'student' && s !== 'student.html' && s !== '?';
                });

                // Deduplicate duplicated path cycles if any (e.g. ["Fatman2ndEdition","Geography","SolarSy-tem","Fatman2ndEdition","Geography"] -> ["Fatman2ndEdition","Geography","SolarSy-tem"])
                if (segments.length >= 3) {
                    var firstCat = segments[0] ? segments[0].toLowerCase() : "";
                    for (var segIdx = 1; segIdx < segments.length; segIdx++) {
                        if (segments[segIdx].toLowerCase() === firstCat) {
                            segments = segments.slice(0, segIdx);
                            break;
                        }
                    }
                }

                if (segments.length === 0) return false;

                var firstSegment = segments[0] ? segments[0].toLowerCase() : null;

                if (firstSegment === 'privacy-policy' || firstSegment === 'privacy') {
                    handleTabNavigation('acc');
                    handleTriggerShowLegalModal('privacy', false);
                    return true;
                }
                if (firstSegment === 'terms-and-conditions' || firstSegment === 'terms' || firstSegment === 'terms-conditions' || firstSegment === 'terms-of-service') {
                    handleTabNavigation('acc');
                    handleTriggerShowLegalModal('terms', false);
                    return true;
                }
                if (firstSegment === 'legal-disclaimer' || firstSegment === 'disclaimer' || firstSegment === 'terms-and-disclaimer') {
                    handleTabNavigation('acc');
                    handleTriggerShowLegalModal('disclaimer', false);
                    return true;
                }
                if (firstSegment === 'copyright-policy' || firstSegment === 'copyright' || firstSegment === 'copyright-notice') {
                    handleTabNavigation('acc');
                    handleTriggerShowLegalModal('copyright', false);
                    return true;
                }

                // 1. Core tabs check
                if (firstSegment === 'home') {
                    handleTabNavigation('home');
                    try {
                        var cleanPath = window.__studentAppBaseDir || '/';
                        window.history.replaceState(null, null, cleanPath + (l.search || '') + (l.hash || ''));
                    } catch(e) {}
                    return true;
                }
                if (firstSegment === 'test' || firstSegment === 'tests') {
                    if (segments.length === 1) {
                        handleTabNavigation('tests');
                        return true;
                    }
                    segments.shift(); // remove "test" prefix and resolve nested categories
                } else if (firstSegment === 'pdf' || firstSegment === 'pdfs') {
                    if (segments.length === 1) {
                        handleTabNavigation('pdfs');
                        return true;
                    }
                    segments.shift(); // remove "pdf" prefix and resolve nested categories
                } else if (firstSegment === 'account' || firstSegment === 'acc' || firstSegment === 'my-account') {
                    handleTabNavigation('acc');
                    return true;
                }

                var catSlug = segments[0] ? segments[0].toLowerCase() : null;
                var subSlug = segments[1] ? segments[1].toLowerCase() : null;
                var topicSlug = segments[2] ? segments[2].toLowerCase() : null;

                if (!catSlug) return false;

                // Search in testCategories and pdfCategories
                var foundCat = null;
                var foundType = 'test';
                
                var allCats = ((DB.testCategories || []).map(function(c) { return {cat: c, type: 'test'}; }))
                    .concat((DB.pdfCategories || []).map(function(c) { return {cat: c, type: 'pdf'}; }));

                for (var i = 0; i < allCats.length; i++) {
                    var cNode = allCats[i];
                    if (toSlug(cNode.cat.name) === catSlug) {
                        foundCat = cNode.cat;
                        foundType = cNode.type;
                        break;
                    }
                }

                if (!foundCat) return false;

                // If only category matches
                if (!subSlug) {
                    handleTabNavigation(foundType === 'test' ? 'tests' : 'pdfs');
                    handleSelectCategoryNode(foundCat, foundType);
                    return true;
                }

                // Find matching subcategory
                var foundSub = null;
                var subCategoriesList = foundCat.subCategories || [];
                for (var j = 0; j < subCategoriesList.length; j++) {
                    var sNode = subCategoriesList[j];
                    if (toSlug(sNode.name) === subSlug) {
                        foundSub = sNode;
                        break;
                    }
                }

                if (!foundSub) {
                    handleTabNavigation(foundType === 'test' ? 'tests' : 'pdfs');
                    handleSelectCategoryNode(foundCat, foundType);
                    return true;
                }

                if (!topicSlug) {
                    handleTabNavigation(foundType === 'test' ? 'tests' : 'pdfs');
                    handleSelectCategoryNode(foundCat, foundType);
                    handleSelectSubcategoryNode(foundSub, foundType);
                    return true;
                }

                // Find match topic
                var foundTopic = null;
                var topicsList = foundSub.topics || [];
                for (var k = 0; k < topicsList.length; k++) {
                    var tNode = topicsList[k];
                    if (toSlug(tNode.name) === topicSlug) {
                        foundTopic = tNode;
                        break;
                    }
                }

                if (!foundTopic) {
                    handleTabNavigation(foundType === 'test' ? 'tests' : 'pdfs');
                    handleSelectCategoryNode(foundCat, foundType);
                    handleSelectSubcategoryNode(foundSub, foundType);
                    return true;
                }

                // Topic matched
                handleTabNavigation(foundType === 'test' ? 'tests' : 'pdfs');
                handleSelectCategoryNode(foundCat, foundType);
                handleSelectSubcategoryNode(foundSub, foundType);
                handleSelectTopicNode(foundTopic, foundType);
                return true;

            } catch (err) {
                console.error("Deep linking route parse error:", err);
            }
            return false;
        }

        // Run instantly as soon as parsed (since the script is at the bottom of the body, DOM is already ready)
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", startStudentPortal);
        } else {
            startStudentPortal();
        }

        function updateThemeIcons(isDark) {
            const sun = document.getElementById("themeSunIcon");
            const moon = document.getElementById("themeMoonIcon");
            const dSun = document.getElementById("dthemeSunIcon");
            const dMoon = document.getElementById("dthemeMoonIcon");
            const dText = document.getElementById("dthemeText");
            if (isDark) {
                if (sun) sun.style.setProperty("display", "inline-flex", "important");
                if (moon) moon.style.setProperty("display", "none", "important");
                if (dSun) dSun.style.setProperty("display", "inline-flex", "important");
                if (dMoon) dMoon.style.setProperty("display", "none", "important");
                if (dText) dText.innerText = "Light";
            } else {
                if (sun) sun.style.setProperty("display", "none", "important");
                if (moon) moon.style.setProperty("display", "inline-flex", "important");
                if (dSun) dSun.style.setProperty("display", "none", "important");
                if (dMoon) dMoon.style.setProperty("display", "inline-flex", "important");
                if (dText) dText.innerText = "Dark";
            }
        }

        function handleToggleThemeMode() {
            const isDark = document.body.classList.toggle("dark-mode");
            localStorage.setItem("_preemptive_theme_mode", isDark ? "dark" : "light");
            updateThemeIcons(isDark);
        }
    </script>
</body>
</html>`;
}
