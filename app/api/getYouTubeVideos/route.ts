import { NextResponse } from "next/server";
import { XMLParser } from "fast-xml-parser";

function extractUcIdFromHtml(html: string) {
  const patterns = [
    /"channelId":"(UC[\w-]+)"/,
    /"externalId":"(UC[\w-]+)"/,
    /"browseId":"(UC[\w-]+)"/,
    /channel_id=(UC[\w-]+)/,
    /"UC[\w-]{10,}"/,
  ];

  for (const p of patterns) {
    const m = html.match(p);
    if (m?.[1]) return m[1];
  }
  const anyUc = html.match(/UC[\w-]{10,}/);
  return anyUc?.[0] ?? null;
}

async function resolveChannelId(channelInput: string) {
  if (channelInput.startsWith("UC")) return channelInput;

  const direct = channelInput.match(/youtube\.com\/channel\/(UC[\w-]+)/i)?.[1];
  if (direct) return direct;

  const url = channelInput.startsWith("http")
    ? channelInput
    : `https://www.youtube.com/${channelInput.startsWith("@") ? channelInput : "@" + channelInput}`;

  const res = await fetch(`${url}?hl=en&gl=US`, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9",
      Cookie: "CONSENT=YES+1; SOCS=CAI;",
    },
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch channel page");

  const html = await res.text();

  if (html.includes("consent.youtube.com")) {
    throw new Error(
      "YouTube consent page blocked channelId. Please provide /channel/UC... link."
    );
  }

  const channelId = extractUcIdFromHtml(html);
  if (!channelId) {
    throw new Error("Could not resolve channelId. Please provide /channel/UC... link.");
  }

  return channelId;
}


export async function POST(req: Request) {
  try {
    const { channel } = await req.json();
    if (!channel) return NextResponse.json({ message: "Missing channel" }, { status: 400 });

    const channelId = await resolveChannelId(channel);

    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    const rssRes = await fetch(rssUrl, { cache: "no-store" });
    if (!rssRes.ok) return NextResponse.json({ message: "Failed to fetch RSS" }, { status: 500 });

    const xml = await rssRes.text();

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "",
    });

    const json = parser.parse(xml);
    const entries = json?.feed?.entry ?? [];
    const list = Array.isArray(entries) ? entries : [entries];

    const items = list.map((e: any) => {
      const videoId = e?.["yt:videoId"];
      const title = e?.title;
      const publishedAt = e?.published;
      const url = e?.link?.href || (videoId ? `https://www.youtube.com/watch?v=${videoId}` : "");

      const description =
        e?.["media:group"]?.["media:description"] ?? "";

      const thumbnail =
        e?.["media:group"]?.["media:thumbnail"]?.url ||
        (videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : "");

      return { videoId, title, description, publishedAt, url, thumbnail };
    });

    return NextResponse.json({ channelId, items }, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: err?.message || "Server Error" }, { status: 500 });
  }
}
