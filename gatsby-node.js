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
          allEvents {
            edges {
              node {
                id
                slug
                title {
                  text
                }
                startDate
                endDate
                timezone
                link
                description {
                  text
                }
                image {
                  imageSrc
                  title
                }
                video {
                  text
                }
                host {
                  text
                }
              }
            }
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

        result.data.allEvents.edges.forEach(edge => {
          const template = path.resolve(
            `src/templates/program-element.js`
          );

          console.log("CREATING EVENT PAGE", edge.node.title.text);
          createPage({
            path: edge.node.slug, // required
            component: template,
            layout: "default",
            context: {
              slug: edge.node.slug
            }
          });
        });

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