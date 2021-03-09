
let activeEnv =
  process.env.GATSBY_ACTIVE_ENV || process.env.NODE_ENV || "development"

console.log(`Using environment config: '${activeEnv}'`)

require("dotenv").config({
  path: `.env.${activeEnv}`,
})

const firebaseConfig = require(`./config/firebase-config.${process.env.GATSBY_FIREBASE_ENVIRONMENT}.json`)

module.exports = {
  siteMetadata: {
    title: `Responsible Leaders Network Activation West Asia North Africa`,
    description: `Responsible Leaders Network Activation`,
    url: `https://connect-wana.online`
  },
  pathPrefix: `/`,
  plugins: [
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: "Responsible Leaders Network Activation",
        short_name: "Responsible Leaders Network Activation",
        start_url: "https://connect-wana.online",
        background_color: "#000",
        theme_color: "#00A6CE", // blue
        display: "minimal-ui",
        icon: "static/icon.png" // This path is relative to the root of the site.
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: "gatsby-source-firebase-nl",
      options: {
        credential: firebaseConfig.serviceAccountKey,
        databaseURL: firebaseConfig.databaseURL,
        types: [
          {
            type: "Pages",
            path: "pages",
            map: node => {
              node.content = JSON.stringify(node.content);

              return node
            },
          },
          {
            type: "Events",
            path: "events"
          },
          {
            type: "Materials",
            path: "materials"
          }
        ]
      }
    },
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        precision: 8,
      },
    },
    {
    resolve: `gatsby-plugin-firebase-messaging`,
      options: {
        //required unless removeFirebaseServiceWorker == true
        config: {
          apiKey: firebaseConfig.apiKey,
          appId: firebaseConfig.appId,
          messagingSenderId: firebaseConfig.messagingSenderId,
          projectId: firebaseConfig.projectId,
        },
        //optionally override the firebase version used by the service worker
        firebaseVersion: '7.5.2', //e.g., '8.1.1'
        //optionally disables development service worker
        // disableDevelopment: true,
        //optionally tells plugin to help unregistering/removing service worker
        // removeFirebaseServiceWorker: true,
      },
    },
    {
      resolve: `gatsby-plugin-csp`,
      options: {
        // disableOnDev: true,
        reportOnly: false, // Changes header to Content-Security-Policy-Report-Only for csp testing purposes
        mergeScriptHashes: true, // you can disable scripts sha256 hashes
        mergeStyleHashes: true, // you can disable styles sha256 hashes
        mergeDefaultDirectives: true,
        directives: {
          "script-src": "'self' www.google-analytics.com",
          "style-src": "'self' 'unsafe-inline'",
          "img-src": "'self' data: www.google-analytics.com",
          "font-src": "*"
          // you can add your directives or override defaults
        }
      }
    }
  ]
};
