# @pipeworx/openfoodfacts

[Open Food Facts](https://world.openfoodfacts.org) MCP — collaborative database of food products from around the world (~3M products with ingredients, nutrition, allergens, Nutri-Score, packaging). Keyless.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

- `product(barcode)` — product by barcode (EAN-13 / UPC-A)
- `search(query, page?, page_size?, sort_by?, fields?)` — full-text search
- `category(category, page?, page_size?)` — products by category
- `brand(brand, page?, page_size?)` — products by brand
- `country(country, page?, page_size?)` — products from a country

## Data source

`https://world.openfoodfacts.org/`

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "openfoodfacts": {
      "url": "https://gateway.pipeworx.io/openfoodfacts/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Openfoodfacts data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
