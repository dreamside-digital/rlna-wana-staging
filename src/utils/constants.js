export const MAXIMUM_IMAGE_SIZE = 2 * 1024 * 1024; //less than 2MB in bytes

export const NOTIFICATION_MESSAGES = {
  'contact-form-success': "Thanks for your message, we'll get back to you soon!",
}

export const LANGUAGE_OPTIONS = [
  { label: "English", value: "en" },
];

export const CATEGORY_OPTIONS = [
  { label: "Uncategorized", value: "uncategorized" },
];

export const DEFAULT_LANGUAGE = "en"

export const PAGE_TYPES = [
  { label: "Basic page", value: { type: "basic_page", template: "default-template.js" } },
];

export const PERMANENT_PAGES = [
  "home",
]

export const CONTENT_MAP = {
  header: { type: "header", content: { text: "Header" } },
  subHeading: { type: "subHeading", content: { text: "Sub-heading" } },
  paragraph: { type: "paragraph", content: { text: "Paragraph" } },
  image: { type: "image" },
  imageCarousel: { type: "imageCarousel", content: {} },
  readings: { type: "readings", content: {} },
  embeddedIframe: { type: "embeddedIframe" },
  timeline: { type: "timeline", content: { alignment: "left" } },
  button: { type: "button", content: { anchor: "Button", link: "/" } },
  link: { type: "link", content: { anchor: "Link text", link: "/" } },
  expandableText: { type: "expandableText", content: { header: "Name", description: "<p>Bio</p>" } },
  videos: { type: "videos", content: { playlistId: { text: ""} }},
  quote: {
    type: "quote",
    content: {
      image: { imageSrc: "" },
      "quote-text": { text: "Quote text" },
      author: { text: "Author" },
      position: { text: "Position or organization" }
    }
  }
}

export const SECTION_MAP = {
  default: {
    type: "default",
    content: [
      { type: "header", content: { text: "Header text" }},
      { type: "paragraph", content: { text: "<p>Section text</p>" }},
    ]
  },
  highlight: {
    type: "highlight",
    content: [
      { type: "header", content: { text: "Header text" }},
      { type: "paragraph", content: { text: "<p>Section text</p>" }},
    ]
  },
  read: {
    type: "read",
    content: [
      { type: "subHeading", content: { text: "Read" }},
      { type: "paragraph", content: { text: "<p>Section introduction</p>" }},
      { type: "readings", content: {} }
    ]
  },
  engage: {
    type: "engage",
    content: [
      { type: "subHeading", content: { text: "Engage & Discuss" }},
      { type: "questions", content: {} }
    ]
  },
  listen: {
    type: "listen",
    content: [
      { type: "subHeading", content: { text: "Listen" }},
      { type: "podcasts", content: {} }
    ]
  },
  resources: {
    type: "resources",
    content: [
      { type: "subHeading", content: { text: "Additional Resources" }},
      { type: "resources", content: {} }
    ]
  },
  watch: {
    type: "watch",
    content: [
      { type: "subHeading", content: { text: "Watch" }},
      { type: "paragraph", content: { text: "<p>Section introduction</p>" }},
      { type: "videos", content: { playlist: { text: "https://www.youtube.com/playlist?list=PLdoZWhB3tGKokaXE3fw7Qe_i9kCWGOYzW" }}}
    ]
  },
}

export const HOME_URLS = {
  en: "/",
  fr: "/fr/"
}

export const REFERENCE_URLS = {
  "definition-of-terms": true,
  "frequently-asked-questions": true
}
