interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * Open Food Facts MCP.
 */


const BASE = 'https://world.openfoodfacts.org';
const UA = 'pipeworx-mcp-openfoodfacts/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  {
    name: 'product',
    description: 'Product by barcode.',
    inputSchema: {
      type: 'object',
      properties: { barcode: { type: 'string' } },
      required: ['barcode'],
    },
  },
  {
    name: 'search',
    description: 'Full-text search.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        page: { type: 'number' },
        page_size: { type: 'number' },
        sort_by: { type: 'string', description: 'unique_scans_n | product_name | created_t | last_modified_t | nutriscore_score | nova_score' },
        fields: { type: 'string', description: 'Comma-sep return fields.' },
      },
      required: ['query'],
    },
  },
  {
    name: 'category',
    description: 'Products by category.',
    inputSchema: {
      type: 'object',
      properties: {
        category: { type: 'string' },
        page: { type: 'number' },
        page_size: { type: 'number' },
      },
      required: ['category'],
    },
  },
  {
    name: 'brand',
    description: 'Products by brand.',
    inputSchema: {
      type: 'object',
      properties: {
        brand: { type: 'string' },
        page: { type: 'number' },
        page_size: { type: 'number' },
      },
      required: ['brand'],
    },
  },
  {
    name: 'country',
    description: 'Products from a country.',
    inputSchema: {
      type: 'object',
      properties: {
        country: { type: 'string' },
        page: { type: 'number' },
        page_size: { type: 'number' },
      },
      required: ['country'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'product':
      return offGet(`/api/v2/product/${encodeURIComponent(reqStr(args, 'barcode', '"3017620422003"'))}.json`);
    case 'search': {
      const p = new URLSearchParams({
        search_terms: reqStr(args, 'query', '"nutella"'),
        json: '1',
        page: String(Math.max(1, (args.page as number) ?? 1)),
        page_size: String(Math.min(100, Math.max(1, (args.page_size as number) ?? 24))),
      });
      if (args.sort_by) p.set('sort_by', String(args.sort_by));
      if (args.fields) p.set('fields', String(args.fields));
      return offGet(`/cgi/search.pl?${p}`);
    }
    case 'category':
      return offGet(`/category/${encodeURIComponent(reqStr(args, 'category', '"chocolates"'))}.json?page=${(args.page as number) ?? 1}&page_size=${(args.page_size as number) ?? 24}`);
    case 'brand':
      return offGet(`/brand/${encodeURIComponent(reqStr(args, 'brand', '"Coca-Cola"'))}.json?page=${(args.page as number) ?? 1}&page_size=${(args.page_size as number) ?? 24}`);
    case 'country':
      return offGet(`/country/${encodeURIComponent(reqStr(args, 'country', '"france"'))}.json?page=${(args.page as number) ?? 1}&page_size=${(args.page_size as number) ?? 24}`);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function offGet(path: string): Promise<unknown> {
  const res = await fetch(`${BASE}${path}`, { headers: { Accept: 'application/json', 'User-Agent': UA } });
  if (res.status === 404) throw new Error('Open Food Facts: not found');
  if (!res.ok) throw new Error(`Open Food Facts: ${res.status}`);
  return res.json();
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
