// The share card is a checked-in file: re-run this after src/config/site.ts changes.
import { createRequire } from "node:module";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { company, seo } from "../src/config/site";

const require = createRequire(__filename);
const { ImageResponse } = require("next/og");
const h = require("react").createElement;

async function generate() {
  const logo = await readFile(join(process.cwd(), "public/brand/logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  const image = new ImageResponse(
    h(
      "div",
      {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ffffff",
          padding: "70px 80px",
        },
      },
      [
        h("img", { src: logoSrc, width: 300, height: 83 }),
        h(
          "div",
          { style: { display: "flex", flexDirection: "column" } },
          [
            h(
              "div",
              { style: { display: "flex", fontSize: 28, color: "#406ae4", letterSpacing: 2 } },
              "STUDY ABROAD · VISA · MIGRATION",
            ),
            h("div", { style: { display: "flex", fontSize: 62, color: "#1d1d1d", marginTop: 22, lineHeight: 1.15 } }, seo.title),
            h("div", { style: { display: "flex", fontSize: 30, color: "#4d585f", marginTop: 26, lineHeight: 1.35 } }, seo.description),
          ],
        ),
        h(
          "div",
          { style: { display: "flex", fontSize: 28, color: "#4d585f", borderTop: "2px solid #dde5ed", paddingTop: 28 } },
          `${company.founded} · Offices in ${seo.cities.join(", ")} · ${company.url.replace("https://", "")}`,
        ),
      ],
    ),
    { width: 1200, height: 630 },
  );

  await writeFile(join(process.cwd(), "public/brand/og.png"), Buffer.from(await image.arrayBuffer()));
  console.log("wrote public/brand/og.png");
}

generate();
