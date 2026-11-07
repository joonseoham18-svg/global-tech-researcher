import { isIP } from "node:net";
import { Router, type IRouter } from "express";
import { AnalyzeResearchBody, AnalyzeResearchResponse } from "@workspace/api-zod";
import { analyzeText, extractArticle } from "../lib/research-analysis";

const router: IRouter = Router();
const MAX_URL_LENGTH = 2_048;
const MAX_ARTICLE_LENGTH = 200_000;
const blockedHostSuffixes = [
  ".localhost",
  ".local",
  ".internal",
  ".test",
  ".example",
  ".invalid",
  ".onion",
];

function looksLikeUrl(source: string): boolean {
  return (
    /^[a-z][a-z0-9+.-]*:\/\//i.test(source) ||
    /^www\./i.test(source) ||
    (/^[a-z0-9.-]+\.[a-z]{2,}(\/[^\s]*)?$/i.test(source) && !/\s/.test(source))
  );
}

function parsePublicArticleUrl(source: string): URL | null {
  const normalized = /^[a-z][a-z0-9+.-]*:\/\//i.test(source)
    ? source
    : `https://${source}`;
  if (normalized.length > MAX_URL_LENGTH) return null;

  let url: URL;
  try {
    url = new URL(normalized);
  } catch {
    return null;
  }

  if (!["http:", "https:"].includes(url.protocol)) return null;
  if (url.username || url.password) return null;
  if (url.port && url.port !== "80" && url.port !== "443") return null;

  const hostname = url.hostname.toLowerCase().replace(/\.$/, "");
  if (!hostname.includes(".") || isIP(hostname) !== 0) return null;
  if (hostname === "localhost" || blockedHostSuffixes.some((suffix) => hostname.endsWith(suffix))) {
    return null;
  }

  url.hash = "";
  return url;
}

async function readLimited(response: Response, maxCharacters: number): Promise<string> {
  if (!response.body) return (await response.text()).slice(0, maxCharacters);
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let text = "";

  while (text.length < maxCharacters) {
    const { done, value } = await reader.read();
    if (done) break;
    text += decoder.decode(value, { stream: true });
  }

  text += decoder.decode();
  if (text.length > maxCharacters) {
    await reader.cancel();
    text = text.slice(0, maxCharacters);
  }
  return text;
}

async function getArticleText(url: URL): Promise<{ content: string; title: string }> {
  const response = await fetch(`https://r.jina.ai/${url.href}`, {
    headers: { Accept: "text/plain" },
    signal: AbortSignal.timeout(25_000),
  });

  if (!response.ok) {
    throw new Error(`Jina Reader returned ${response.status}`);
  }

  const readerText = await readLimited(response, MAX_ARTICLE_LENGTH);
  const article = extractArticle(readerText);
  if (article.content.length < 40) {
    throw new Error("Jina Reader returned too little article text");
  }
  return article;
}

router.post("/research/analyze", async (req, res): Promise<void> => {
  const parsed = AnalyzeResearchBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "URL 또는 영문 텍스트를 확인해 주세요." });
    return;
  }

  const source = parsed.data.source.trim();
  const urlInput = looksLikeUrl(source);
  let articleText = source;
  let title = "입력한 영문 텍스트";
  let sourceUrl: string | null = null;
  let sourceType: "url" | "text" = "text";

  if (urlInput) {
    const url = parsePublicArticleUrl(source);
    if (!url) {
      res.status(400).json({
        error: "공개된 웹사이트의 http 또는 https 주소만 분석할 수 있습니다.",
      });
      return;
    }

    try {
      const article = await getArticleText(url);
      articleText = article.content;
      title = article.title === "입력한 영문 텍스트" ? url.hostname : article.title;
      sourceUrl = url.href;
      sourceType = "url";
    } catch (error) {
      req.log.warn({ errorName: error instanceof Error ? error.name : "unknown" }, "Article extraction failed");
      res.status(502).json({
        error: "본문을 가져오지 못했습니다. 공개 URL인지 확인하거나 영문 본문을 직접 붙여 넣어 주세요.",
      });
      return;
    }
  } else {
    const article = extractArticle(source);
    articleText = article.content;
    title = article.title;
  }

  try {
    const { content } = extractArticle(articleText);
    const result = AnalyzeResearchResponse.parse(
      analyzeText(content, { title, sourceUrl, sourceType }),
    );
    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "텍스트를 분석하지 못했습니다.";
    res.status(400).json({ error: message });
  }
});

export default router;
