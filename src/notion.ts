import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export async function checkProjectStatus() {
  const blockId = "16d8004e5f6a42a6981151c22ddada12";
  const response = await notion.blocks.children.list({
    block_id: blockId,
  });
  console.log(response);
}
