export function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOrganization",
        "@id": "https://codedecoded.com/#organization",
        "name": "Code Decoded",
        "url": "https://codedecoded.com",
        "logo": "https://codedecoded.com/images/logo.png",
        "sameAs": [
          "https://www.instagram.com/coded.ecoded",
          "https://www.youtube.com/@codedecoded01",
          "https://github.com/codedecoded"
        ],
        "description": "Coding made simple. Decoded for you. Free programming resources, interactive roadmaps, and cheat sheets for students and developers in India."
      },
      {
        "@type": "WebSite",
        "@id": "https://codedecoded.com/#website",
        "url": "https://codedecoded.com",
        "name": "Code Decoded",
        "publisher": {
          "@id": "https://codedecoded.com/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://codedecoded.com/resources?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
