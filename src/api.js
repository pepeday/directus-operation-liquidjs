import { Liquid } from 'liquidjs';

export default {
  id: 'use-liquid-templates',
  handler: async ({ collection, templateNameField, templateContentField, templateName, inputData }, { services, database, accountability, getSchema }) => {
    const MAX_INCLUDE_DEPTH = 10;
    const engine = new Liquid();
    
    const { ItemsService } = services;
    const schema = await getSchema({ database });
    const templatesService = new ItemsService(collection, {
      schema: schema,
      accountability: accountability,
    });

    const parseInputData = (data) => {
      if (typeof data === 'object' && data !== null) return data;
      if (typeof data === 'string') {
        try {
          return JSON.parse(data);
        } catch (error) {
          throw new Error('Invalid JSON provided in input data');
        }
      }
      throw new Error('Invalid input data format');
    };

    const fetchTemplate = async (name) => {
      const template = await templatesService.readByQuery({
        filter: { [templateNameField]: name },
        limit: 1,
      });

      if (!template?.length) {
        throw new Error(`Template '${name}' not found`);
      }

      return template[0][templateContentField];
    };

    const processIncludes = async (content, depth = 0) => {
      if (depth >= MAX_INCLUDE_DEPTH) {
        throw new Error(`Maximum template inclusion depth (${MAX_INCLUDE_DEPTH}) exceeded`);
      }

      const includeRegex = /{%\s*include\s+['"]([^'"]+)['"]\s*%}/g;
      
      // Process all includes at this level first
      const replacements = new Map();
      let match;
      
      // Gather all unique includes at this level
      while ((match = includeRegex.exec(content)) !== null) {
        const [fullMatch, templateName] = match;
        if (!replacements.has(fullMatch)) {
          const includedContent = await fetchTemplate(templateName);
          const processedContent = await processIncludes(includedContent, depth + 1);
          replacements.set(fullMatch, processedContent);
        }
      }

      // Apply all replacements
      let processedContent = content;
      for (const [fullMatch, replacement] of replacements) {
        processedContent = processedContent.replaceAll(fullMatch, replacement);
      }

      return processedContent;
    };

    try {
      const parsedData = parseInputData(inputData);
      const mainTemplate = await fetchTemplate(templateName);
      const processedTemplate = await processIncludes(mainTemplate);
      const renderedContent = await engine.parseAndRender(processedTemplate, parsedData);

      return { renderedContent };
    } catch (error) {
      throw new Error(`Template processing failed: ${error.message}`);
    }
  },
};