const path = require("path");

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  return new Promise((resolve, reject) => {
      graphql(
        `
        {
          allPages(filter: {template: { in: ["default-template.js"]}}) {
            edges {
              node {
                id
                title
                slug
                template
                content
                next
                head
              }
            }
          }
          pages(id: { eq: "home" }) {
            id
            content
          }
        }
        `
      ).then(result => {
        if (result.errors) {
          console.log("ERROR CREATING PAGES", result.errors);
          reject(result.errors);
        }

        result.data.allPages.edges.forEach(edge => {
          const template = path.resolve(
            `src/templates/${edge.node.template}`
          );

          console.log("CREATING PAGE", edge.node.title);
          createPage({
            path: edge.node.slug, // required
            component: template,
            layout: "default",
            context: {
              slug: edge.node.slug
            }
          });
        });

        const content = JSON.parse(result.data.pages.content)
        const events = content['program-elements-collection']

        Object.keys(events).forEach(eventId => {
          const event = events[eventId]
          const template = path.resolve(
            `src/templates/event-template.js`
          );

          console.log({ event })

          console.log("CREATING EVENT PAGE", event['program-elements-title']['text']);
          createPage({
            path: event.slug, // required
            component: template,
            layout: "default",
            context: {
              event
            }
          });
        })

        resolve();
      })
  });
};


exports.onCreateWebpackConfig = ({ stage, loaders, actions, getConfig }) => {
  if (stage === "build-html") {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /react-rte/,
            use: loaders.null(),
          },
        ],
      },
    })
  }
}