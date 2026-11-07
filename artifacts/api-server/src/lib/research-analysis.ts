type GlossaryItem = {
  term: string;
  aliases: string[];
  meaning: string;
  koreanName: string;
};

const glossary: GlossaryItem[] = [
  {
    term: "Artificial intelligence",
    aliases: ["artificial intelligence", "AI"],
    meaning: "사람의 판단·언어·인식 같은 능력을 컴퓨터가 수행하도록 만드는 기술 분야입니다.",
    koreanName: "인공지능",
  },
  {
    term: "Machine learning",
    aliases: ["machine learning", "ML"],
    meaning: "데이터에서 패턴을 학습해 예측이나 판단을 수행하는 AI의 한 분야입니다.",
    koreanName: "머신러닝",
  },
  {
    term: "Deep learning",
    aliases: ["deep learning"],
    meaning: "여러 층의 신경망으로 복잡한 데이터의 특징을 학습하는 방법입니다.",
    koreanName: "딥러닝",
  },
  {
    term: "Large language model",
    aliases: ["large language model", "LLM", "LLMs"],
    meaning: "대규모 텍스트로 학습해 글을 이해하고 생성하는 언어 모델입니다.",
    koreanName: "대규모 언어 모델",
  },
  {
    term: "Generative AI",
    aliases: ["generative AI", "generative artificial intelligence"],
    meaning: "학습한 패턴을 바탕으로 글·이미지·음성·코드 같은 새 콘텐츠를 만드는 AI입니다.",
    koreanName: "생성형 AI",
  },
  {
    term: "Neural network",
    aliases: ["neural network", "neural networks"],
    meaning: "데이터의 관계를 학습하도록 연결된 계산 단위들로 이루어진 모델 구조입니다.",
    koreanName: "신경망",
  },
  {
    term: "Inference",
    aliases: ["inference"],
    meaning: "학습이 끝난 모델에 새 입력을 주고 답이나 예측을 계산하는 단계입니다.",
    koreanName: "추론",
  },
  {
    term: "Fine-tuning",
    aliases: ["fine-tuning", "fine tuning", "finetuning"],
    meaning: "이미 학습된 모델을 특정 작업이나 데이터에 맞게 추가로 조정하는 과정입니다.",
    koreanName: "파인튜닝",
  },
  {
    term: "Token",
    aliases: ["tokens", "token"],
    meaning: "언어 모델이 문장을 처리할 때 사용하는 단어 조각이나 기호 단위입니다.",
    koreanName: "토큰",
  },
  {
    term: "Context window",
    aliases: ["context window", "context length"],
    meaning: "모델이 한 번에 참고할 수 있는 입력과 대화의 최대 범위입니다.",
    koreanName: "컨텍스트 길이",
  },
  {
    term: "Retrieval-augmented generation",
    aliases: ["retrieval-augmented generation", "retrieval augmented generation", "RAG"],
    meaning: "외부 문서에서 관련 정보를 찾은 뒤 그 자료를 바탕으로 답을 생성하는 방식입니다.",
    koreanName: "검색 증강 생성",
  },
  {
    term: "Embedding",
    aliases: ["embeddings", "embedding"],
    meaning: "글이나 이미지의 의미를 숫자 배열로 표현해 유사도를 비교할 수 있게 하는 방법입니다.",
    koreanName: "임베딩",
  },
  {
    term: "Vector database",
    aliases: ["vector database", "vector database", "vector store"],
    meaning: "임베딩 벡터를 저장하고 의미상 가까운 자료를 빠르게 찾는 데이터베이스입니다.",
    koreanName: "벡터 데이터베이스",
  },
  {
    term: "AI agent",
    aliases: ["AI agent", "AI agents", "agentic"],
    meaning: "목표를 이루기 위해 정보를 확인하고 도구를 선택해 여러 단계를 수행하는 AI 시스템입니다.",
    koreanName: "AI 에이전트",
  },
  {
    term: "Benchmark",
    aliases: ["benchmark", "benchmarks"],
    meaning: "기술이나 모델의 성능을 같은 기준으로 비교하기 위한 평가 방법 또는 시험 데이터입니다.",
    koreanName: "벤치마크",
  },
  {
    term: "Hallucination",
    aliases: ["hallucination", "hallucinations"],
    meaning: "생성형 AI가 사실과 다른 내용을 그럴듯하게 만들어 내는 현상입니다.",
    koreanName: "환각",
  },
  {
    term: "GPU",
    aliases: ["GPU", "GPUs"],
    meaning: "많은 계산을 동시에 처리해 AI 모델 학습과 실행을 가속하는 프로세서입니다.",
    koreanName: "GPU",
  },
  {
    term: "Transformer",
    aliases: ["transformer", "transformers"],
    meaning: "문장 안에서 단어들 사이의 관계를 계산하는 데 널리 쓰이는 신경망 구조입니다.",
    koreanName: "트랜스포머",
  },
  {
    term: "Open source",
    aliases: ["open-source", "open source"],
    meaning: "소스 코드를 공개해 사용·검토·수정할 수 있도록 한 배포 방식입니다.",
    koreanName: "오픈소스",
  },
  {
    term: "Latency",
    aliases: ["latency"],
    meaning: "요청을 보낸 뒤 응답이 돌아오기까지 걸리는 시간입니다.",
    koreanName: "응답 지연",
  },
  {
    term: "Throughput",
    aliases: ["throughput"],
    meaning: "일정 시간 동안 시스템이 처리할 수 있는 요청이나 데이터의 양입니다.",
    koreanName: "처리량",
  },
  {
    term: "Quantization",
    aliases: ["quantization", "quantized"],
    meaning: "모델 숫자 표현의 정밀도를 낮춰 메모리 사용량과 실행 비용을 줄이는 기법입니다.",
    koreanName: "양자화",
  },
  {
    term: "Multimodal",
    aliases: ["multimodal", "multimodality"],
    meaning: "텍스트뿐 아니라 이미지·음성·영상 등 여러 종류의 입력이나 출력을 다루는 특성입니다.",
    koreanName: "멀티모달",
  },
  {
    term: "API",
    aliases: ["API", "APIs"],
    meaning: "서로 다른 프로그램이 정해진 규칙에 따라 기능이나 데이터를 주고받는 연결 규격입니다.",
    koreanName: "API",
  },
  {
    term: "Cloud computing",
    aliases: ["cloud computing", "cloud infrastructure"],
    meaning: "인터넷을 통해 서버·저장공간·컴퓨팅 자원을 필요할 때 사용하는 방식입니다.",
    koreanName: "클라우드 컴퓨팅",
  },
  {
    term: "Cybersecurity",
    aliases: ["cybersecurity", "cyber security"],
    meaning: "시스템과 데이터를 공격·오용·무단 접근으로부터 보호하는 기술과 절차입니다.",
    koreanName: "사이버 보안",
  },
];

const stopWords = new Set([
  "about", "after", "again", "against", "also", "among", "because", "been",
  "before", "being", "between", "both", "could", "does", "during", "each",
  "from", "have", "here", "into", "just", "more", "most", "much", "must",
  "only", "other", "over", "same", "should", "some", "such", "than", "that",
  "their", "them", "then", "there", "these", "they", "this", "those", "through",
  "under", "very", "were", "what", "when", "where", "which", "while", "will",
  "with", "would", "your", "and", "are", "but", "for", "not", "the", "its",
  "our", "out", "can", "may", "new", "use", "used", "using", "you", "his",
  "her", "she", "him", "all", "any", "has", "had", "who", "why", "how",
  "data", "model", "models", "system", "systems", "technology", "technologies",
  "company", "companies", "developer", "developers", "researcher", "researchers",
  "people", "computer", "computers", "machine", "machines", "learning",
  "artificial", "intelligence", "large", "various", "types", "task", "tasks",
  "make", "made", "help", "based", "first", "well", "work", "works",
]);

const summaryLabels = ["배경", "핵심 내용", "의미와 영향"];

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function findTerms(text: string): GlossaryItem[] {
  return glossary.filter((item) =>
    item.aliases.some((alias) => {
      const expression = new RegExp(`\\b${escapeRegExp(alias)}\\b`, "i");
      return expression.test(text);
    }),
  );
}

function tokenize(text: string): string[] {
  return (text.toLowerCase().match(/[a-z][a-z0-9+#.-]{1,}/g) ?? [])
    .map((word) => word.replace(/[.#-]+$/g, ""))
    .filter((word) => word.length > 2 && !stopWords.has(word));
}

function splitSentences(text: string): string[] {
  const cleaned = text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/[`*_>#~]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const fromPunctuation = cleaned
    .split(/(?<=[.!?])\s+(?=[A-Z0-9"'(])/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => tokenize(sentence).length >= 5);

  if (fromPunctuation.length >= 3) return fromPunctuation;

  const paragraphs = cleaned
    .split(/(?<=[.!?])\s+|(?<=;)\s+|(?<=:)\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => tokenize(sentence).length >= 4);

  return paragraphs.length ? paragraphs : (cleaned ? [cleaned] : []);
}

function getKeywords(sentences: string[]): string[] {
  const text = sentences.join(" ");
  const matchedTerms = glossary
    .map((item) => {
      const count = item.aliases.reduce((total, alias) => {
        const expression = new RegExp(`\\b${escapeRegExp(alias)}\\b`, "gi");
        return total + (text.match(expression)?.length ?? 0);
      }, 0);
      return { item, count };
    })
    .filter(({ count }) => count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
  const termWords = new Set(
    matchedTerms.flatMap(({ item }) => item.aliases.flatMap((alias) => tokenize(alias))),
  );
  const counts = new Map<string, number>();
  const sentenceCoverage = new Map<string, number>();

  for (const sentence of sentences) {
    const uniqueWords = new Set(tokenize(sentence));
    for (const word of tokenize(sentence)) {
      counts.set(word, (counts.get(word) ?? 0) + 1);
    }
    for (const word of uniqueWords) {
      sentenceCoverage.set(word, (sentenceCoverage.get(word) ?? 0) + 1);
    }
  }

  const wordKeywords = [...counts.entries()]
    .map(([word, count]) => ({
      word,
      score: count * (1 + (sentenceCoverage.get(word) ?? 0) / sentences.length),
    }))
    .filter(({ word }) => !termWords.has(word))
    .sort((a, b) => b.score - a.score || a.word.localeCompare(b.word))
    .slice(0, Math.max(0, 6 - matchedTerms.length))
    .map(({ word }) => word.toUpperCase());

  return [...matchedTerms.map(({ item }) => item.term), ...wordKeywords];
}

function chooseSentences(sentences: string[], keywords: string[]): string[] {
  const scored = sentences.map((sentence, index) => {
    const words = tokenize(sentence);
    const unique = new Set(words);
    const glossaryHits = findTerms(sentence).length;
    const keywordHits = keywords.filter((keyword) =>
      sentence.toLowerCase().includes(keyword.toLowerCase()),
    ).length;
    const positionBoost = 1 / (1 + index * 0.08);
    const lengthPenalty = Math.sqrt(Math.max(words.length, 1));
    return {
      sentence,
      index,
      words: unique,
      score: ((keywordHits * 2) + glossaryHits * 1.5 + Math.log1p(unique.size)) * positionBoost / lengthPenalty,
    };
  });

  const chosen: typeof scored = [];
  for (const candidate of [...scored].sort((a, b) => b.score - a.score)) {
    const tooSimilar = chosen.some((picked) => {
      const intersection = [...candidate.words].filter((word) => picked.words.has(word)).length;
      return intersection / Math.max(candidate.words.size, 1) > 0.72;
    });
    if (!tooSimilar) chosen.push(candidate);
    if (chosen.length === 3) break;
  }

  if (!chosen.length && sentences.length) chosen.push(scored[0]);
  while (chosen.length < 3 && chosen.length > 0) {
    chosen.push(chosen[chosen.length % Math.min(chosen.length, sentences.length)]);
  }

  return chosen
    .sort((a, b) => a.index - b.index)
    .map(({ sentence }) => sentence.slice(0, 420));
}

function koreanSummaryFor(sentence: string, keywords: string[], terms: GlossaryItem[]): string {
  const topic = terms[0]?.koreanName ?? keywords[0] ?? "이 기술";
  const secondary = terms[1]?.koreanName ?? keywords[1] ?? "관련 기술";
  const lower = sentence.toLowerCase();

  if (
    /\bbenchmark(s)?\b/.test(lower) &&
    /\b(independent|independently|verify|verified|validate|validated|evaluate)\b/.test(lower)
  ) {
    return "벤치마크 결과를 독립적으로 검증해야 한다는 점을 강조합니다.";
  }
  if (
    /\b(privacy|security)\b/.test(lower) &&
    /\b(challenge|challenges|remain|remains|risk|risks|concern|concerns)\b/.test(lower)
  ) {
    return "기업 도입에서 개인정보 보호와 보안이 주요 과제로 남아 있다고 설명합니다.";
  }
  if (
    /\bquantization\b/.test(lower) &&
    /\b(memory|requirements|reduce|reduced|lower|lowering)\b/.test(lower)
  ) {
    return "양자화로 메모리 요구량을 낮춰 모델 배포 효율을 높이는 접근입니다.";
  }
  if (
    /\binference\b/.test(lower) &&
    /\b(speed|faster|improve|improves|improved)\b/.test(lower) &&
    /\b(cost|costs|operating|reduce|reducing)\b/.test(lower)
  ) {
    return "모델 추론 속도를 높이는 동시에 운영 비용을 낮추는 것이 핵심 변화입니다.";
  }
  if (/\bAPI\b/i.test(sentence) && /\b(developer|developers|access|use|using)\b/.test(lower)) {
    return "개발자가 API를 통해 해당 시스템을 사용할 수 있도록 제공합니다.";
  }
  if (
    /\b(machine learning|ML)\b/i.test(sentence) &&
    /\b(data|patterns?|learn|learning|predict)\b/.test(lower)
  ) {
    return "머신러닝은 데이터의 패턴을 학습해 예측이나 판단에 활용하는 접근입니다.";
  }
  if (/\b(launch|launched|release|released|introduce|introduced|announce|announced|unveil|unveiled)\b/.test(lower)) {
    return `${topic} 관련 신제품·기술 공개 소식과 주요 특징을 다룹니다.`;
  }
  if (/\b(risk|risks|challenge|challenges|cost|costs|privacy|security|concern|concerns)\b/.test(lower)) {
    return `${topic} 적용 시의 비용·보안·운영 과제를 함께 살펴볼 필요가 있습니다.`;
  }
  if (/\b(improve|improved|increase|increased|reduce|reduced|faster|performance|efficient|efficiency)\b/.test(lower)) {
    return `${topic}의 성능이나 효율 변화가 주요 내용이며, ${secondary}와 함께 언급됩니다.`;
  }
  if (/\b(enable|enables|allow|allows|potential|possible|impact)\b/.test(lower)) {
    return `${topic} 관련 기술이 어떤 활용을 가능하게 하는지 설명합니다.`;
  }
  return `${topic} 관련 내용입니다. 구체적인 주장과 조건은 인용된 원문에서 확인해 주세요.`;
}

export type ResearchAnalysis = {
  title: string;
  sourceUrl: string | null;
  sourceType: "url" | "text";
  summary: Array<{
    label: string;
    koreanSummary: string;
    originalSentence: string;
  }>;
  keywords: string[];
  terms: Array<{ term: string; meaning: string }>;
  insight: string;
  characterCount: number;
};

export function analyzeText(
  text: string,
  options: { title: string; sourceUrl: string | null; sourceType: "url" | "text" },
): ResearchAnalysis {
  const sentences = splitSentences(text);
  if (!sentences.length || tokenize(text).length < 8) {
    throw new Error("분석하려면 영문 본문을 8개 이상의 단어로 입력해 주세요.");
  }

  const keywords = getKeywords(sentences);
  const selectedSentences = chooseSentences(sentences, keywords);
  const matchedTerms = findTerms(text);
  const summaries = selectedSentences.map((sentence, index) => ({
    label: summaryLabels[index] ?? "요점",
    koreanSummary: koreanSummaryFor(sentence, keywords, findTerms(sentence)),
    originalSentence: sentence,
  }));
  const topicPhrase = matchedTerms.length
    ? matchedTerms.slice(0, 3).map((item) => item.koreanName).join("·")
    : keywords.slice(0, 3).join("·");
  const keywordPhrase = keywords.slice(0, 3).join(", ");

  return {
    ...options,
    summary: summaries,
    keywords,
    terms: matchedTerms.slice(0, 8).map(({ term, meaning }) => ({ term, meaning })),
    insight: topicPhrase
      ? `본문에서 확인된 주요 개념은 ${topicPhrase}입니다. ${keywordPhrase ? `핵심 키워드 ${keywordPhrase}가 ` : ""}실제 성능·비용·적용 조건과 어떤 관계인지 원문 근거와 함께 확인해 보세요.`
      : `본문의 핵심 키워드(${keywordPhrase})를 중심으로 주장과 근거가 실제 적용 환경에서도 이어지는지 확인해 보세요.`,
    characterCount: text.length,
  };
}

export function extractArticle(text: string): { title: string; content: string } {
  const titleMatch = text.match(/^Title:\s*(.+)$/im);
  const headingMatch = text.match(/^#\s+(.+)$/m);
  const title = titleMatch?.[1]?.trim() || headingMatch?.[1]?.trim() || "입력한 영문 텍스트";
  const content = text
    .replace(/^Title:.*$/gim, "")
    .replace(/^URL Source:.*$/gim, "")
    .replace(/^Markdown Content:.*$/gim, "")
    .replace(/^#\s+.+$/gm, "")
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return { title, content };
}
