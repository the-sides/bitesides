import type { ReactNode } from "react";
import type { Block, Post, RichText } from "@/lib/notion";

interface PostsProps {
  posts: Array<Post>;
}

type GroupedBlock =
  | Block
  | { type: "ul"; items: Array<Block> }
  | { type: "ol"; items: Array<Block> };

function RichTextRenderer({ richText }: { richText: RichText }) {
  return (
    <>
      {richText.map((item, index) => {
        let content: ReactNode = item.plain_text;

        if (item.annotations.bold) content = <strong>{content}</strong>;
        if (item.annotations.italic) content = <em>{content}</em>;
        if (item.annotations.strikethrough) content = <s>{content}</s>;
        if (item.annotations.code) content = <code>{content}</code>;

        if (item.type === "text" && item.text.link) {
          content = (
            <a href={item.text.link.url} target="_blank" rel="noopener noreferrer">
              {content}
            </a>
          );
        }

        return <span key={`${item.plain_text}-${index}`}>{content}</span>;
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
        <h3>
          <RichTextRenderer richText={block.text} />
        </h3>
      );
    case "heading_3":
      return (
        <h4>
          <RichTextRenderer richText={block.text} />
        </h4>
      );
    case "bulleted_list_item":
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

function groupListItems(blocks: Array<Block>) {
  const grouped: Array<GroupedBlock> = [];
  let index = 0;

  while (index < blocks.length) {
    const block = blocks[index];

    if (block.type === "bulleted_list_item") {
      const items: Array<Block> = [];
      while (
        index < blocks.length &&
        blocks[index].type === "bulleted_list_item"
      ) {
        items.push(blocks[index]);
        index++;
      }
      grouped.push({ type: "ul", items });
    } else if (block.type === "numbered_list_item") {
      const items: Array<Block> = [];
      while (
        index < blocks.length &&
        blocks[index].type === "numbered_list_item"
      ) {
        items.push(blocks[index]);
        index++;
      }
      grouped.push({ type: "ol", items });
    } else {
      grouped.push(block);
      index++;
    }
  }

  return grouped;
}

function PostBody({ blocks }: { blocks: Array<Block> }) {
  return (
    <div className="mt-5 space-y-4 font-['Avenir_Next','Gill_Sans',sans-serif] text-[0.95rem] leading-7 text-[#4f3d30] [&_a]:border-b [&_a]:border-[#b98535]/50 [&_a]:text-[#7a4d19] [&_code]:bg-[#e7d4bd] [&_code]:px-1 [&_h3]:font-['Bodoni_72','Didot','Baskerville',serif] [&_h3]:text-3xl [&_h3]:leading-none [&_h3]:text-[#221812] [&_h4]:text-sm [&_h4]:font-semibold [&_h4]:uppercase [&_h4]:tracking-[0.18em] [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:text-[#221812] [&_ul]:list-disc [&_ul]:pl-5">
      {groupListItems(blocks).map((item, index) => {
        if ("items" in item) {
          const List = item.type === "ol" ? "ol" : "ul";
          return (
            <List key={`${item.type}-${index}`}>
              {item.items.map((block, blockIndex) => (
                <BlockRenderer key={`${block.type}-${blockIndex}`} block={block} />
              ))}
            </List>
          );
        }

        return <BlockRenderer key={`${item.type}-${index}`} block={item} />;
      })}
    </div>
  );
}

function formatDate(value: string | null) {
  if (!value) return null;

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(value));
}

export function Posts({ posts }: PostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="bg-[#f4eadc] px-5 py-16 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-end justify-between gap-6 border-b border-[#221812]/15 pb-5">
          <div>
            <p className="font-['Avenir_Next','Gill_Sans',sans-serif] text-xs uppercase tracking-[0.26em] text-[#9b6e38]">
              Notes
            </p>
            <h2 className="mt-2 font-['Bodoni_72','Didot','Baskerville',serif] text-5xl leading-none text-[#221812] sm:text-6xl">
              Updates
            </h2>
          </div>
          {/* <span className="font-['Avenir_Next','Gill_Sans',sans-serif] text-xs uppercase tracking-[0.22em] text-[#6f5a45]">
            Jacob & Vicki
          </span> */}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {posts.map((post) => (
            <article
              key={post.id}
              className="border border-[#221812]/15 bg-[#fff8ee]/58 p-5 shadow-[0_18px_60px_rgba(54,38,22,0.08)] sm:p-6"
            >
              <div className="flex items-start justify-between gap-5">
                <h3 className="font-['Bodoni_72','Didot','Baskerville',serif] text-4xl leading-none text-[#221812]">
                  {post.title}
                </h3>
                {formatDate(post.date) && (
                  <time className="shrink-0 pt-1 font-['Avenir_Next','Gill_Sans',sans-serif] text-xs uppercase tracking-[0.18em] text-[#9b6e38]">
                    {formatDate(post.date)}
                  </time>
                )}
              </div>
              <PostBody blocks={post.blocks} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
