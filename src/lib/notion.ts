import { Client } from "@notionhq/client";
import type {
  BlockObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const DATA_SOURCE_ID = process.env.NOTION_DATA_SOURCE_ID!;

type RichText = RichTextItemResponse[];

interface Review {
  id: string;
  name: string;
  slug: string;
  blocks: Block[];
}

type Block =
  | { type: "paragraph"; text: RichText }
  | { type: "heading_2"; text: RichText }
  | { type: "heading_3"; text: RichText }
  | { type: "bulleted_list_item"; text: RichText }
  | { type: "numbered_list_item"; text: RichText };

function extractRichText(block: BlockObjectResponse): RichText | null {
  const b = block as any;
  switch (block.type) {
    case "paragraph":
      return b.paragraph.rich_text;
    case "heading_2":
      return b.heading_2.rich_text;
    case "heading_3":
      return b.heading_3.rich_text;
    case "bulleted_list_item":
      return b.bulleted_list_item.rich_text;
    case "numbered_list_item":
      return b.numbered_list_item.rich_text;
    default:
      return null;
  }
}

function transformBlock(block: BlockObjectResponse): Block | null {
  const richText = extractRichText(block);
  if (!richText) return null;

  switch (block.type) {
    case "paragraph":
      return { type: "paragraph", text: richText };
    case "heading_2":
      return { type: "heading_2", text: richText };
    case "heading_3":
      return { type: "heading_3", text: richText };
    case "bulleted_list_item":
      return { type: "bulleted_list_item", text: richText };
    case "numbered_list_item":
      return { type: "numbered_list_item", text: richText };
    default:
      return null;
  }
}

async function getPageBlocks(pageId: string): Promise<Block[]> {
  const blocks: Block[] = [];
  let cursor: string | undefined;

  do {
    const response = await notion.blocks.children.list({
      block_id: pageId,
      start_cursor: cursor,
    });

    for (const block of response.results) {
      if ("type" in block) {
        const transformed = transformBlock(block);
        if (transformed) {
          blocks.push(transformed);
        }
      }
    }

    cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
  } while (cursor);

  return blocks;
}

export async function getReviews(): Promise<Review[]> {
  const response = await notion.dataSources.query({
    data_source_id: DATA_SOURCE_ID,
    filter: {
      property: "Published",
      checkbox: {
        equals: true,
      },
    },
    sorts: [
      {
        property: "Name",
        direction: "ascending",
      },
    ],
  });

  const reviews: Review[] = [];

  for (const page of response.results) {
    if (!("properties" in page)) continue;

    const props = page.properties as any;
    const name =
      props.Name?.title?.[0]?.plain_text || props.title?.title?.[0]?.plain_text;

    if (!name) continue;

    const slug =
      props.Slug?.rich_text?.[0]?.plain_text ||
      name.toLowerCase().replace(/\s+/g, "-");

    const blocks = await getPageBlocks(page.id);

    reviews.push({
      id: page.id,
      name,
      slug,
      blocks,
    });
  }

  return reviews;
}

export type { Review, Block, RichText };
