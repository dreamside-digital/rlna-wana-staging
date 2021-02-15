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