export default {
	id: 'use-liquid-templates',
	name: 'Render Templates with LiquidJS',
	icon: 'water_drop',
	description: 'Render templates using LiquidJS with nested template support.',
	overview: ({ templateName }) => [
	  {
		label: 'Template Name',
		text: templateName,
	  },
	],
	options: [
	  {
		field: 'collection',
		name: 'Templates Collection',
		type: 'string',
		meta: {
		  interface: 'system-collection',
		  width: 'full',
		  required: true,
		},
	  },
	  {
		field: 'templateNameField',
		name: 'Template Name Field',
		type: 'string',
		meta: {
		  interface: 'input',
		  width: 'half',
		  required: true,
		},
	  },
	  {
		field: 'templateContentField',
		name: 'Template Content Field',
		type: 'string',
		meta: {
		  interface: 'input',
		  width: 'half',
		  required: true,
		},
	  },
	  {
		field: 'templateName',
		name: 'Template Name',
		type: 'string',
		meta: {
		  interface: 'input',
		  width: 'full',
		  required: true,
		  options: {
			placeholder: 'Enter the name of the template to use',
		  },
		},
	  },
	  {
		field: 'inputData',
		name: 'Input Data (JSON)',
		type: 'text',
		meta: {
		  interface: 'input-multiline',
		  width: 'full',
		  required: true,
		  options: {
			placeholder: 'Enter JSON data or JSON array',
		  },
		},
	  },
	],
  };
  