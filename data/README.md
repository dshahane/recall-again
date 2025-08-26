## Palette Data Structure Explained

This JSON file defines the structure for your workflow builder's component palette. Each object in the main array represents a category, which organizes nodes into logical groups.

Here's a breakdown of the fields:

* **`label`**: A **string** that provides a human-readable title for the category (e.g., "Triggers," "Models," "Sinks"). This is what users see in the palette.

* **`description`**: A **string** that briefly explains the purpose of the nodes within the category. This can be used for tooltips or as a sub-heading to provide more context.

* **`items`**: An **array of objects**, where each object represents a draggable node.  Each item has two essential properties:
    * **`label`**: A **string** for the node's display name (e.g., "Query," "LLM," "Condition"). This label also becomes the default name for the node when it's added to the canvas.
    * **`kind`**: A **string** that serves as the unique identifier for the node's type (e.g., `"query"`, `"llm"`). This `kind` property is crucial because it links the node to its associated configuration and metadata (like icons and colors) in your `node-config.ts` file.