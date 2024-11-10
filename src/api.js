import { Liquid } from 'liquidjs';

export default {
  id: 'use-liquid-templates',
  handler: async ({ collection, templateNameField, templateContentField, templateName, inputData }, { services, database, accountability, getSchema }) => {
    const { ItemsService } = services;

    const schema = await getSchema({ database });
    const templatesService = new ItemsService(collection, {
      schema: schema,
      accountability: accountability,
    });

    const engine = new Liquid();

    // Parse inputData to handle both JSON objects and strings
    let parsedData;
    try {
      if (typeof inputData === 'string') {
        parsedData = JSON.parse(inputData);
      } else if (typeof inputData === 'object') {
        parsedData = inputData;
      } else {
        throw new Error('Invalid input data format');
      }
    } catch (error) {
      throw new Error('Invalid JSON provided in input data');
    }

    // Fetch the main template based on the provided templateName
    let mainTemplate = await templatesService.readByQuery({
      filter: {
        [templateNameField]: templateName,
      },
      limit: 1,
    });

    if (!mainTemplate || mainTemplate.length === 0) {
      throw new Error('Main template not found');
    }

    let templateContent = mainTemplate[0][templateContentField];

    // Function to fetch and replace nested templates recursively
    async function replaceIncludes(templateContent) {
      const includeMatches = templateContent.match(/{% include '(\w+)' %}/g);

      if (includeMatches) {
        for (const match of includeMatches) {
          const includedTemplateName = match.match(/'(\w+)'/)[1];

          // Fetch the included template content dynamically
          const includedTemplate = await templatesService.readByQuery({
            filter: {
              [templateNameField]: includedTemplateName,
            },
            limit: 1,
          });

          if (includedTemplate && includedTemplate.length > 0) {
            const includedTemplateContent = includedTemplate[0][templateContentField];

            // Recursively replace includes in the included template content
            const processedContent = await replaceIncludes(includedTemplateContent);

            // Replace the include tag with the processed content of the included template
            templateContent = templateContent.replace(match, processedContent);
          } else {
            throw new Error(`Template '${includedTemplateName}' not found`);
          }
        }
      }
      return templateContent;
    }

    // Process the main template to replace all includes with their content
    templateContent = await replaceIncludes(templateContent);

    // Render the final processed template content
    const renderedContent = await engine.parseAndRender(templateContent, parsedData);

    return { renderedContent };
  },
};
