import type { Review, Block, RichText } from "@/lib/notion";

interface ReviewsProps {
  reviews: Review[];
}

function RichTextRenderer({ richText }: { richText: RichText }) {
  return (
    <>
      {richText.map((item, i) => {
        let content: React.ReactNode = item.plain_text;

        if (item.annotations.bold) {
          content = <strong key={i}>{content}</strong>;
        }
        if (item.annotations.italic) {
          content = <em key={i}>{content}</em>;
        }
        if (item.annotations.strikethrough) {
          content = <s key={i}>{content}</s>;
        }
        if (item.annotations.code) {
          content = <code key={i}>{content}</code>;
        }

        if (item.type === "text" && item.text.link) {
          content = (
            <a key={i} href={item.text.link.url} target="_blank" rel="noopener noreferrer">
              {content}
            </a>
          );
        }

        return <span key={i}>{content}</span>;
      })}
    </>
  );
}

function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case "paragraph":
      return (
        <p>
          <RichTextRenderer richText={block.text} />
        </p>
      );
    case "heading_2":
      return (
        <h2>
          <RichTextRenderer richText={block.text} />
        </h2>
      );
    case "heading_3":
      return (
        <h3>
          <RichTextRenderer richText={block.text} />
        </h3>
      );
    case "bulleted_list_item":
      return (
        <li>
          <RichTextRenderer richText={block.text} />
        </li>
      );
    case "numbered_list_item":
      return (
        <li>
          <RichTextRenderer richText={block.text} />
        </li>
      );
    default:
      return null;
  }
}

function groupListItems(blocks: Block[]): (Block | { type: "ul"; items: Block[] } | { type: "ol"; items: Block[] })[] {
  const result: (Block | { type: "ul"; items: Block[] } | { type: "ol"; items: Block[] })[] = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];

    if (block.type === "bulleted_list_item") {
      const items: Block[] = [];
      while (i < blocks.length && blocks[i].type === "bulleted_list_item") {
        items.push(blocks[i]);
        i++;
      }
      result.push({ type: "ul", items });
    } else if (block.type === "numbered_list_item") {
      const items: Block[] = [];
      while (i < blocks.length && blocks[i].type === "numbered_list_item") {
        items.push(blocks[i]);
        i++;
      }
      result.push({ type: "ol", items });
    } else {
      result.push(block);
      i++;
    }
  }

  return result;
}

function ReviewContent({ blocks }: { blocks: Block[] }) {
  const grouped = groupListItems(blocks);

  return (
    <>
      {grouped.map((item, i) => {
        if ("items" in item) {
          if (item.type === "ul") {
            return (
              <ul key={i}>
                {item.items.map((block, j) => (
                  <BlockRenderer key={j} block={block} />
                ))}
              </ul>
            );
          } else {
            return (
              <ol key={i}>
                {item.items.map((block, j) => (
                  <BlockRenderer key={j} block={block} />
                ))}
              </ol>
            );
          }
        }
        return <BlockRenderer key={i} block={item} />;
      })}
    </>
  );
}

export function Reviews({ reviews }: ReviewsProps) {
  return (
    <div className="space-y-3 [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mt-12 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5">
      {reviews.map((review, i) => (
        <div key={review.id}>
          <h2 className={i === 0 ? "!mt-0" : ""}>{review.name}</h2>
          <ReviewContent blocks={review.blocks} />
        </div>
      ))}
    </div>
  );
}
