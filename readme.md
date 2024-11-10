# Directus Dynamic Templating Extension

## Overview
This Directus extension is designed to render templates using [LiquidJS](https://liquidjs.com/) with support for nested templates and loops. The extension can be configured to process data dynamically and render complex templates, making it suitable for scenarios where modular template management and nested structures are required.

## Features
- Dynamic template rendering with nested support.
- Recursively handles `{% include 'template_name' %}` tags for nested templates.
- Supports loops within templates to render arrays, such as `inspections` or `chips`.
- Customizable and reusable templates for complex data structures.

## Installation

1. **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd directus-dynamic-templating-extension
    ```

2. **Install dependencies**:
    Ensure you have Node.js installed, then run:
    ```bash
    npm install
    ```

3. **Build the extension**:
    ```bash
    npm run build
    ```

4. **Copy the extension**:
    Copy the `dist` folder into the `extensions/operations` directory of your Directus instance.

5. **Restart Directus**:
    ```bash
    npx directus start
    ```

## Configuration

1. **Templates Collection**:
   Ensure you have a collection in Directus that stores your templates, with fields for the template name and content.

2. **Fields**:
   - **Template Name Field**: The field that holds the name of the template (e.g., `template_name`).
   - **Template Content Field**: The field that contains the Liquid template content (e.g., `template_content`).

## How to Use

1. **Create Templates**:
   - Create and store your main and nested templates in your designated Directus collection.
   - Example structure:
     - `asset_template`
     - `inspection_template`
     - `chip_template`

2. **Configure the Operation in a Flow**:
   - Set up a Directus Flow and add the `use-liquid-templates` operation.
   - Configure the operation by specifying the collection, template name field, template content field, and the main template name.

3. **Input Data**:
   - Ensure your `inputData` includes all necessary properties, such as arrays for loops (e.g., `inspections` and `chips`).

### Example Input Data Structure

```json
{
  "id": 1,
  "name": "Asset Name",
  "inspections": [
    {
      "id": 1,
      "notes": "Inspection 1",
      "chips": [
        { "chip_color": "#FF0000", "chip_text": "Urgent", "chip_icon": "warning" },
        { "chip_color": "#00FF00", "chip_text": "Safe", "chip_icon": "check_circle" }
      ]
    },
    {
      "id": 2,
      "notes": "Inspection 2",
      "chips": [
        { "chip_color": "#FFFF00", "chip_text": "Caution", "chip_icon": "error_outline" }
      ]
    }
  ]
}
```

### Template Structure

**`asset_template.liquid`**:
```liquid
<h1>{{ name }}</h1>
<h2>Inspections</h2>
{% for inspection in inspections %}
  {% include 'inspection_template' %}
{% endfor %}
```

**`inspection_template.liquid`**:
```liquid
<div class="inspection">
  <p>Notes: {{ inspection.notes }}</p>
  <div class="chips">
    {% for chip in inspection.chips %}
      {% include 'chip_template' %}
    {% endfor %}
  </div>
</div>
```

**`chip_template.liquid`**:
```liquid
<div class="chip" style="background-color: {{ chip.chip_color }}; padding: 5px; margin: 2px; display: inline-block; border-radius: 5px;">
  <i class="material-icons">{{ chip.chip_icon }}</i> {{ chip.chip_text }}
</div>
```

## Development

### Testing
- Run the extension locally to test the rendering logic with different data structures.
- Use Directus logs to debug any issues or errors during the rendering process.

### Contributions
Feel free to open issues or pull requests to improve this extension. Your contributions are welcome!

### License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments
- [LiquidJS](https://liquidjs.com/) for the powerful templating engine.
- [Directus](https://directus.io/) for providing a flexible headless CMS platform.
