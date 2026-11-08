/*
 * 글로벌 테크 리서처 — 정적(브라우저 실행) 버전
 *
 * Replit 개발 프리뷰는 (1) 유휴 시 꺼지고 (2) 보는 사람이 Replit에 로그인해야만 열립니다.
 * 그래서 서버 없이 브라우저에서 바로 도는 버전을 GitHub Pages에 올렸습니다.
 * 본문 추출은 무료 Jina Reader(r.jina.ai, CORS 허용)를 브라우저에서 직접 호출하고,
 * 요약·용어 해설은 아래 규칙 기반 로직으로 브라우저에서 계산합니다(서버 비용 0원).
 */
(function () {
  'use strict';

  /* ---------------- 설정 ---------------- */
  // 개인용 잠금을 쓰고 싶으면 true로 바꾸세요. (화면만 가리는 로컬 잠금입니다)
  var REQUIRE_PIN = false;
  var DESK_PIN = '1004';

  var JINA_ENDPOINT = 'https://r.jina.ai/';
  var MAX_URL_LENGTH = 2048;
  var MAX_ARTICLE_LENGTH = 200000;
  var FETCH_TIMEOUT_MS = 30000;

  /* ---------------- 용어 사전 ---------------- */
  var glossary = [
    { term: 'Artificial intelligence', aliases: ['artificial intelligence', 'AI'], meaning: '사람의 판단·언어·인식 같은 능력을 컴퓨터가 수행하도록 만드는 기술 분야입니다.', koreanName: '인공지능' },
    { term: 'Machine learning', aliases: ['machine learning', 'ML'], meaning: '데이터에서 패턴을 학습해 예측이나 판단을 수행하는 AI의 한 분야입니다.', koreanName: '머신러닝' },
    { term: 'Deep learning', aliases: ['deep learning'], meaning: '여러 층의 신경망으로 복잡한 데이터의 특징을 학습하는 방법입니다.', koreanName: '딥러닝' },
    { term: 'Large language model', aliases: ['large language model', 'LLM', 'LLMs'], meaning: '대규모 텍스트로 학습해 글을 이해하고 생성하는 언어 모델입니다.', koreanName: '대규모 언어 모델' },
    { term: 'Generative AI', aliases: ['generative AI', 'generative artificial intelligence'], meaning: '학습한 패턴을 바탕으로 글·이미지·음성·코드 같은 새 콘텐츠를 만드는 AI입니다.', koreanName: '생성형 AI' },
    { term: 'Neural network', aliases: ['neural network', 'neural networks'], meaning: '데이터의 관계를 학습하도록 연결된 계산 단위들로 이루어진 모델 구조입니다.', koreanName: '신경망' },
    { term: 'Inference', aliases: ['inference'], meaning: '학습이 끝난 모델에 새 입력을 주고 답이나 예측을 계산하는 단계입니다.', koreanName: '추론' },
    { term: 'Fine-tuning', aliases: ['fine-tuning', 'fine tuning', 'finetuning'], meaning: '이미 학습된 모델을 특정 작업이나 데이터에 맞게 추가로 조정하는 과정입니다.', koreanName: '파인튜닝' },
    { term: 'Token', aliases: ['tokens', 'token'], meaning: '언어 모델이 문장을 처리할 때 사용하는 단어 조각이나 기호 단위입니다.', koreanName: '토큰' },
    { term: 'Context window', aliases: ['context window', 'context length'], meaning: '모델이 한 번에 참고할 수 있는 입력과 대화의 최대 범위입니다.', koreanName: '컨텍스트 길이' },
    { term: 'Retrieval-augmented generation', aliases: ['retrieval-augmented generation', 'retrieval augmented generation', 'RAG'], meaning: '외부 문서에서 관련 정보를 찾은 뒤 그 자료를 바탕으로 답을 생성하는 방식입니다.', koreanName: '검색 증강 생성' },
    { term: 'Embedding', aliases: ['embeddings', 'embedding'], meaning: '글이나 이미지의 의미를 숫자 배열로 표현해 유사도를 비교할 수 있게 하는 방법입니다.', koreanName: '임베딩' },
    { term: 'Vector database', aliases: ['vector database', 'vector store'], meaning: '임베딩 벡터를 저장하고 의미상 가까운 자료를 빠르게 찾는 데이터베이스입니다.', koreanName: '벡터 데이터베이스' },
    { term: 'AI agent', aliases: ['AI agent', 'AI agents', 'agentic'], meaning: '목표를 이루기 위해 정보를 확인하고 도구를 선택해 여러 단계를 수행하는 AI 시스템입니다.', koreanName: 'AI 에이전트' },
    { term: 'Benchmark', aliases: ['benchmark', 'benchmarks'], meaning: '기술이나 모델의 성능을 같은 기준으로 비교하기 위한 평가 방법 또는 시험 데이터입니다.', koreanName: '벤치마크' },
    { term: 'Hallucination', aliases: ['hallucination', 'hallucinations'], meaning: '생성형 AI가 사실과 다른 내용을 그럴듯하게 만들어 내는 현상입니다.', koreanName: '환각' },
    { term: 'GPU', aliases: ['GPU', 'GPUs'], meaning: '많은 계산을 동시에 처리해 AI 모델 학습과 실행을 가속하는 프로세서입니다.', koreanName: 'GPU' },
    { term: 'Transformer', aliases: ['transformer', 'transformers'], meaning: '문장 안에서 단어들 사이의 관계를 계산하는 데 널리 쓰이는 신경망 구조입니다.', koreanName: '트랜스포머' },
    { term: 'Open source', aliases: ['open-source', 'open source'], meaning: '소스 코드를 공개해 사용·검토·수정할 수 있도록 한 배포 방식입니다.', koreanName: '오픈소스' },
    { term: 'Latency', aliases: ['latency'], meaning: '요청을 보낸 뒤 응답이 돌아오기까지 걸리는 시간입니다.', koreanName: '응답 지연' },
    { term: 'Throughput', aliases: ['throughput'], meaning: '일정 시간 동안 시스템이 처리할 수 있는 요청이나 데이터의 양입니다.', koreanName: '처리량' },
    { term: 'Quantization', aliases: ['quantization', 'quantized'], meaning: '모델 숫자 표현의 정밀도를 낮춰 메모리 사용량과 실행 비용을 줄이는 기법입니다.', koreanName: '양자화' },
    { term: 'Multimodal', aliases: ['multimodal', 'multimodality'], meaning: '텍스트뿐 아니라 이미지·음성·영상 등 여러 종류의 입력이나 출력을 다루는 특성입니다.', koreanName: '멀티모달' },
    { term: 'API', aliases: ['API', 'APIs'], meaning: '서로 다른 프로그램이 정해진 규칙에 따라 기능이나 데이터를 주고받는 연결 규격입니다.', koreanName: 'API' },
    { term: 'Cloud computing', aliases: ['cloud computing', 'cloud infrastructure'], meaning: '인터넷을 통해 서버·저장공간·컴퓨팅 자원을 필요할 때 사용하는 방식입니다.', koreanName: '클라우드 컴퓨팅' },
    { term: 'Cybersecurity', aliases: ['cybersecurity', 'cyber security'], meaning: '시스템과 데이터를 공격·오용·무단 접근으로부터 보호하는 기술과 절차입니다.', koreanName: '사이버 보안' }
  ];

  var stopWords = ['about', 'after', 'again', 'against', 'also', 'among', 'because', 'been',
    'before', 'being', 'between', 'both', 'could', 'does', 'during', 'each',
    'from', 'have', 'here', 'into', 'just', 'more', 'most', 'much', 'must',
    'only', 'other', 'over', 'same', 'should', 'some', 'such', 'than', 'that',
    'their', 'them', 'then', 'there', 'these', 'they', 'this', 'those', 'through',
    'under', 'very', 'were', 'what', 'when', 'where', 'which', 'while', 'will',
    'with', 'would', 'your', 'and', 'are', 'but', 'for', 'not', 'the', 'its',
    'our', 'out', 'can', 'may', 'new', 'use', 'used', 'using', 'you', 'his',
    'her', 'she', 'him', 'all', 'any', 'has', 'had', 'who', 'why', 'how',
    'data', 'model', 'models', 'system', 'systems', 'technology', 'technologies',
    'company', 'companies', 'developer', 'developers', 'researcher', 'researchers',
    'people', 'computer', 'computers', 'machine', 'machines', 'learning',
    'artificial', 'intelligence', 'large', 'various', 'types', 'task', 'tasks',
    'make', 'made', 'help', 'based', 'first', 'well', 'work', 'works',
    'said', 'says', 'told', 'ago', 'like', 'even', 'many', 'one', 'two', 'three',
    'next', 'now', 'back', 'still', 'get', 'got', 'way', 'ways', 'time', 'times',
    'year', 'years', 'day', 'days', 'week', 'weeks', 'month', 'months', 'today',
    'according', 'including', 'which'];
  var stopWordSet = new Set(stopWords);

  var summaryLabels = ['배경', '핵심 내용', '의미와 영향'];

  /* ---------------- 텍스트 분석 (서버 로직을 그대로 옮김) ---------------- */
  function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function findTerms(text) {
    return glossary.filter(function (item) {
      return item.aliases.some(function (alias) {
        return new RegExp('\\b' + escapeRegExp(alias) + '\\b', 'i').test(text);
      });
    });
  }

  function tokenize(text) {
    var matches = text.toLowerCase().match(/[a-z][a-z0-9+#.-]{1,}/g);
    if (!matches) return [];
    return matches
      .map(function (word) { return word.replace(/[.#-]+$/g, ''); })
      .filter(function (word) { return word.length > 2 && !stopWordSet.has(word); });
  }

  // Jina Reader가 함께 물고 오는 사이트 안내 문구(구독·로그인·목록 안내)를 걸러 냅니다.
  var boilerplatePattern = /(daily email digest|homepage feed|newsletter|create a free account|all rights reserved|cookie (settings|policy)|advertisement|skip to (main )?content|share this (article|story)|this topic will be added|we use cookies|cookies and similar|\bcookies?\b)/i;
  var boilerplateStart = /^(follow|see all|share|subscribe|sign in|log in|menu|advertisement|skip to|read more|listen|comment)/i;

  function isBoilerplate(sentence) {
    return boilerplatePattern.test(sentence) || boilerplateStart.test(sentence.trim());
  }

  function splitSentences(text) {
    var cleaned = text
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/<[^>]+>/g, ' ')
      .replace(/[`*_>#~]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    var fromPunctuation = cleaned
      .split(/(?<=[.!?])\s+(?=[A-Z0-9"'(])/)
      .map(function (sentence) { return sentence.trim(); })
      .filter(function (sentence) { return tokenize(sentence).length >= 5 && !isBoilerplate(sentence); });

    if (fromPunctuation.length >= 3) return fromPunctuation;

    var paragraphs = cleaned
      .split(/(?<=[.!?])\s+|(?<=;)\s+|(?<=:)\s+/)
      .map(function (sentence) { return sentence.trim(); })
      .filter(function (sentence) { return tokenize(sentence).length >= 4 && !isBoilerplate(sentence); });

    if (paragraphs.length) return paragraphs;
    return fromPunctuation.length ? fromPunctuation : (cleaned ? [cleaned] : []);
  }

  function getKeywords(sentences) {
    var text = sentences.join(' ');
    var matchedTerms = glossary
      .map(function (item) {
        var count = item.aliases.reduce(function (total, alias) {
          var expression = new RegExp('\\b' + escapeRegExp(alias) + '\\b', 'gi');
          var found = text.match(expression);
          return total + (found ? found.length : 0);
        }, 0);
        return { item: item, count: count };
      })
      .filter(function (entry) { return entry.count > 0; })
      .sort(function (a, b) { return b.count - a.count; })
      .slice(0, 6);

    var termWords = new Set();
    matchedTerms.forEach(function (entry) {
      entry.item.aliases.forEach(function (alias) {
        tokenize(alias).forEach(function (word) { termWords.add(word); });
      });
    });

    var counts = new Map();
    var sentenceCoverage = new Map();

    sentences.forEach(function (sentence) {
      var words = tokenize(sentence);
      var uniqueWords = new Set(words);
      words.forEach(function (word) {
        counts.set(word, (counts.get(word) || 0) + 1);
      });
      uniqueWords.forEach(function (word) {
        sentenceCoverage.set(word, (sentenceCoverage.get(word) || 0) + 1);
      });
    });

    var wordKeywords = Array.from(counts.entries())
      .map(function (entry) {
        var word = entry[0];
        var count = entry[1];
        return {
          word: word,
          score: count * (1 + (sentenceCoverage.get(word) || 0) / sentences.length)
        };
      })
      .filter(function (entry) { return !termWords.has(entry.word); })
      .sort(function (a, b) { return b.score - a.score || a.word.localeCompare(b.word); })
      .slice(0, Math.max(0, 6 - matchedTerms.length))
      .map(function (entry) { return entry.word.toUpperCase(); });

    return matchedTerms.map(function (entry) { return entry.item.term; }).concat(wordKeywords);
  }

  function chooseSentences(sentences, keywords) {
    var scored = sentences.map(function (sentence, index) {
      var words = tokenize(sentence);
      var unique = new Set(words);
      var glossaryHits = findTerms(sentence).length;
      var keywordHits = keywords.filter(function (keyword) {
        return sentence.toLowerCase().indexOf(keyword.toLowerCase()) !== -1;
      }).length;
      var positionBoost = 1 / (1 + index * 0.08);
      var lengthPenalty = Math.sqrt(Math.max(words.length, 1));
      return {
        sentence: sentence,
        index: index,
        words: unique,
        score: ((keywordHits * 2) + glossaryHits * 1.5 + Math.log1p(unique.size)) * positionBoost / lengthPenalty
      };
    });

    var chosen = [];
    var sorted = scored.slice().sort(function (a, b) { return b.score - a.score; });
    for (var i = 0; i < sorted.length; i += 1) {
      var candidate = sorted[i];
      var tooSimilar = chosen.some(function (picked) {
        var intersection = Array.from(candidate.words).filter(function (word) {
          return picked.words.has(word);
        }).length;
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
      .sort(function (a, b) { return a.index - b.index; })
      .map(function (entry) { return entry.sentence.slice(0, 420); });
  }

  function koreanNameOf(keyword) {
    if (!keyword) return '';
    var found = glossary.filter(function (item) {
      return item.term.toLowerCase() === String(keyword).toLowerCase();
    })[0];
    return found ? found.koreanName : keyword;
  }

  function koreanSummaryFor(sentence, keywords, terms) {
    var topic = (terms[0] && terms[0].koreanName) || koreanNameOf(keywords[0]) || '이 기술';
    var secondary = (terms[1] && terms[1].koreanName) || koreanNameOf(keywords[1]) || '관련 기술';
    var lower = sentence.toLowerCase();

    if (/\bbenchmark(s)?\b/.test(lower) &&
      /\b(independent|independently|verify|verified|validate|validated|evaluate)\b/.test(lower)) {
      return '벤치마크 결과를 독립적으로 검증해야 한다는 점을 강조합니다.';
    }
    if (/\b(privacy|security)\b/.test(lower) &&
      /\b(challenge|challenges|remain|remains|risk|risks|concern|concerns)\b/.test(lower)) {
      return '기업 도입에서 개인정보 보호와 보안이 주요 과제로 남아 있다고 설명합니다.';
    }
    if (/\bquantization\b/.test(lower) &&
      /\b(memory|requirements|reduce|reduced|lower|lowering)\b/.test(lower)) {
      return '양자화로 메모리 요구량을 낮춰 모델 배포 효율을 높이는 접근입니다.';
    }
    if (/\binference\b/.test(lower) &&
      /\b(speed|faster|improve|improves|improved)\b/.test(lower) &&
      /\b(cost|costs|operating|reduce|reducing)\b/.test(lower)) {
      return '모델 추론 속도를 높이는 동시에 운영 비용을 낮추는 것이 핵심 변화입니다.';
    }
    if (/\bAPI\b/i.test(sentence) && /\b(developer|developers|access|use|using)\b/.test(lower)) {
      return '개발자가 API를 통해 해당 시스템을 사용할 수 있도록 제공합니다.';
    }
    if (/\b(machine learning|ML)\b/i.test(sentence) &&
      /\b(data|patterns?|learn|learning|predict)\b/.test(lower)) {
      return '머신러닝은 데이터의 패턴을 학습해 예측이나 판단에 활용하는 접근입니다.';
    }
    if (/\b(launch|releas|introduc|announc|unveil)/.test(lower)) {
      return topic + ' 관련 신제품·기술 공개 소식과 주요 특징을 다룹니다.';
    }
    if (/\b(risk|risks|challenge|challenges|cost|costs|privacy|security|concern|concerns)\b/.test(lower)) {
      return topic + ' 적용 시의 비용·보안·운영 과제를 함께 살펴볼 필요가 있습니다.';
    }
    if (/\b(improv|increas|reduc|faster|performance|efficienc|speed)/.test(lower)) {
      return topic + '의 성능이나 효율 변화가 주요 내용이며, ' + secondary + '와 함께 언급됩니다.';
    }
    if (/\b(enable|enables|allow|allows|potential|possible|impact)\b/.test(lower)) {
      return topic + ' 관련 기술이 어떤 활용을 가능하게 하는지 설명합니다.';
    }
    var percents = sentence.match(/\b\d+(?:\.\d+)?\s?(?:%|percent)\b/gi);
    if (percents && percents.length >= 2) {
      return topic + ' 관련 수치가 ' + percents[0] + '에서 ' + percents[1] + '로 달라졌다고 전합니다.';
    }
    if (/\b(available|availability|rolling out|will roll out|starting (today|next week|this week)|general availability)\b/.test(lower)) {
      return '누가 언제부터 쓸 수 있는지(출시·제공 범위)를 설명하는 대목입니다.';
    }
    if (/\b(researchers|study|studies|survey|found that|shows that|according to)\b/.test(lower)) {
      return '연구·조사에서 확인된 결과를 근거로 제시합니다.';
    }
    return topic + '에 대한 설명이 이어지는 대목입니다. 구체적인 주장과 조건은 인용된 원문에서 확인해 주세요.';
  }

  function analyzeText(text, options) {
    var sentences = splitSentences(text);
    if (!sentences.length || tokenize(text).length < 8) {
      throw new Error('분석하려면 영문 본문을 8개 이상의 단어로 입력해 주세요.');
    }

    var keywords = getKeywords(sentences);
    var selectedSentences = chooseSentences(sentences, keywords);
    var matchedTerms = findTerms(text);
    var summaries = selectedSentences.map(function (sentence, index) {
      return {
        label: summaryLabels[index] || '요점',
        koreanSummary: koreanSummaryFor(sentence, keywords, findTerms(sentence)),
        originalSentence: sentence
      };
    });
    var topicPhrase = matchedTerms.length
      ? matchedTerms.slice(0, 3).map(function (item) { return item.koreanName; }).join('·')
      : keywords.slice(0, 3).join('·');
    var keywordPhrase = keywords.slice(0, 3).join(', ');

    return {
      title: options.title,
      sourceUrl: options.sourceUrl,
      sourceType: options.sourceType,
      summary: summaries,
      keywords: keywords,
      terms: matchedTerms.slice(0, 8).map(function (item) {
        return { term: item.term, meaning: item.meaning };
      }),
      insight: topicPhrase
        ? '본문에서 확인된 주요 개념은 ' + topicPhrase + '입니다. ' + (keywordPhrase ? '핵심 키워드 ' + keywordPhrase + '가 ' : '') + '실제 성능·비용·적용 조건과 어떤 관계인지 원문 근거와 함께 확인해 보세요.'
        : '본문의 핵심 키워드(' + keywordPhrase + ')를 중심으로 주장과 근거가 실제 적용 환경에서도 이어지는지 확인해 보세요.',
      characterCount: text.length
    };
  }

  // 기사 끝에 붙는 쿠키 동의·회사 약관·저작권 블록은 요약 대상에서 잘라 냅니다.
  var footerMarkers = [
    'When you visit our website, we store cookies',
    'Strictly Necessary Cookies',
    'This website is now part of',
    'All rights reserved',
    'Terms of Use',
    'Privacy Policy'
  ];

  function cutFooterBlock(text) {
    var cutAt = -1;
    footerMarkers.forEach(function (marker) {
      var index = text.indexOf(marker);
      if (index !== -1 && index > text.length * 0.25 && (cutAt === -1 || index < cutAt)) {
        cutAt = index;
      }
    });
    return cutAt === -1 ? text : text.slice(0, cutAt);
  }

  function extractArticle(text) {
    var titleMatch = text.match(/^Title:\s*(.+)$/im);
    var headingMatch = text.match(/^#\s+(.+)$/m);
    var title = (titleMatch && titleMatch[1] && titleMatch[1].trim()) ||
      (headingMatch && headingMatch[1] && headingMatch[1].trim()) ||
      '입력한 영문 텍스트';
    var trimmed = cutFooterBlock(text);
    var content = trimmed
      .replace(/^Title:.*$/gim, '')
      .replace(/^URL Source:.*$/gim, '')
      .replace(/^Published Time:.*$/gim, '')
      .replace(/^Final URL:.*$/gim, '')
      .replace(/^Markdown Content:.*$/gim, '')
      .replace(/!\[Image \d+\]\([^)]*\)/g, '')
      .replace(/^#\s+.+$/gm, '')
      .replace(/\r/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    return { title: title, content: content };
  }

  /* ---------------- URL 처리 ---------------- */
  var blockedHostSuffixes = ['.localhost', '.local', '.internal', '.test', '.example', '.invalid', '.onion'];

  function looksLikeUrl(source) {
    return /^[a-z][a-z0-9+.-]*:\/\//i.test(source) ||
      /^www\./i.test(source) ||
      (/^[a-z0-9.-]+\.[a-z]{2,}(\/[^\s]*)?$/i.test(source) && !/\s/.test(source));
  }

  function isIpHost(hostname) {
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)) return true;
    if (hostname.indexOf(':') !== -1) return true;
    return false;
  }

  function parsePublicArticleUrl(source) {
    var normalized = /^[a-z][a-z0-9+.-]*:\/\//i.test(source) ? source : 'https://' + source;
    if (normalized.length > MAX_URL_LENGTH) return null;

    var url;
    try {
      url = new URL(normalized);
    } catch (error) {
      return null;
    }

    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    if (url.username || url.password) return null;
    if (url.port && url.port !== '80' && url.port !== '443') return null;

    var hostname = url.hostname.toLowerCase().replace(/\.$/, '');
    if (hostname.indexOf('.') === -1 || isIpHost(hostname)) return null;
    if (hostname === 'localhost') return null;
    if (blockedHostSuffixes.some(function (suffix) { return hostname.slice(-suffix.length) === suffix; })) return null;

    url.hash = '';
    return url;
  }

  /* ---------------- 본문 가져오기 (Jina Reader) ---------------- */
  function jinaFetch(url) {
    var controller = new AbortController();
    var timer = setTimeout(function () { controller.abort(); }, FETCH_TIMEOUT_MS);
    return fetch(JINA_ENDPOINT + url.href, {
      headers: { Accept: 'text/plain' },
      signal: controller.signal
    }).then(function (response) {
      if (!response.ok) throw new Error('Jina Reader returned ' + response.status);
      return response.text();
    }).then(function (text) {
      clearTimeout(timer);
      return text.slice(0, MAX_ARTICLE_LENGTH);
    }).catch(function (error) {
      clearTimeout(timer);
      throw error;
    });
  }

  async function getArticleText(url) {
    var readerText = await jinaFetch(url);
    var article = extractArticle(readerText);
    if (article.content.length < 40) {
      throw new Error('Jina Reader returned too little article text');
    }
    return article;
  }

  async function analyzeSource(source) {
    var value = source.trim();
    if (!value) throw new Error('URL 또는 영문 텍스트를 확인해 주세요.');

    if (!looksLikeUrl(value)) {
      var inline = extractArticle(value);
      var inlineResult = analyzeText(inline.content, {
        title: inline.title,
        sourceUrl: null,
        sourceType: 'text'
      });
      return inlineResult;
    }

    var url = parsePublicArticleUrl(value);
    if (!url) throw new Error('공개된 웹사이트의 http 또는 https 주소만 분석할 수 있습니다.');

    var article;
    try {
      article = await getArticleText(url);
    } catch (error) {
      throw new Error('본문을 가져오지 못했습니다. 공개 URL인지 확인하거나 영문 본문을 직접 붙여 넣어 주세요.');
    }

    return analyzeText(article.content, {
      title: article.title === '입력한 영문 텍스트' ? url.hostname : article.title,
      sourceUrl: url.href,
      sourceType: 'url'
    });
  }

  /* ---------------- 노션용 Markdown ---------------- */
  function markdownFor(result) {
    var source = result.sourceUrl ? '[원문 링크](' + result.sourceUrl + ')' : '직접 입력한 영문 텍스트';
    var summary = result.summary.map(function (line) {
      return '### ' + line.label + '\n' + line.koreanSummary + '\n\n> ' + line.originalSentence;
    }).join('\n\n');
    var terms = result.terms.map(function (item) {
      return '- **' + item.term + '** — ' + item.meaning;
    }).join('\n');
    return [
      '# ' + result.title,
      '',
      '- 출처: ' + source,
      '- 입력 형식: ' + (result.sourceType === 'url' ? 'URL' : '영문 텍스트'),
      '- 원문 분량: ' + result.characterCount.toLocaleString() + '자',
      '',
      '## 3줄 요약',
      '',
      summary || '정리 항목이 없습니다.',
      '',
      '## 키워드',
      '',
      result.keywords.map(function (word) { return '`' + word + '`'; }).join(' · ') || '없음',
      '',
      '## 용어 해설',
      '',
      terms || '정리된 용어가 없습니다.',
      '',
      '## 한 줄 인사이트',
      '',
      result.insight,
      '',
      '> 한국어 요약은 규칙 기반 참고 메모입니다. 원문 문장과 함께 확인하세요.'
    ].join('\n');
  }

  /* ---------------- 화면 ---------------- */
  var el = {
    page: document.getElementById('page'),
    pinScreen: document.getElementById('pin-screen'),
    pinForm: document.getElementById('pin-form'),
    pinInput: document.getElementById('pin-input'),
    pinError: document.getElementById('pin-error'),
    composer: document.getElementById('composer'),
    source: document.getElementById('article-source'),
    hint: document.getElementById('hint'),
    analyzeButton: document.getElementById('analyze-button'),
    fieldLabel: document.getElementById('field-label'),
    modeUrl: document.getElementById('mode-url'),
    modeText: document.getElementById('mode-text'),
    result: document.getElementById('result'),
    empty: document.getElementById('empty-state')
  };

  var state = {
    mode: 'url',
    pending: false,
    lastSubmitted: '',
    result: null
  };

  var spinnerSvg = '<svg class="spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>';
  var arrowSvg = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>';
  var copySvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path></svg>';
  var checkSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg>';

  function make(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  function setMode(mode) {
    state.mode = mode;
    var isUrl = mode === 'url';
    el.modeUrl.classList.toggle('active', isUrl);
    el.modeUrl.setAttribute('aria-pressed', String(isUrl));
    el.modeText.classList.toggle('active', !isUrl);
    el.modeText.setAttribute('aria-pressed', String(!isUrl));
    el.fieldLabel.textContent = isUrl ? '아티클 주소' : '영문 원문';
    el.source.placeholder = isUrl ? 'https://example.com/technology/article' : '영문 아티클을 여기에 붙여넣으세요.';
  }

  function updateComposer() {
    var length = el.source.value.length;
    el.hint.textContent = length.toLocaleString() + ' / 200,000 · 원문 문장도 함께 남깁니다';
    el.analyzeButton.disabled = !el.source.value.trim() || state.pending;
  }

  function renderLoading() {
    el.empty.hidden = true;
    var card = make('div', 'card loading');
    card.appendChild(make('div', 'skeleton title'));
    card.appendChild(make('div', 'skeleton line'));
    card.appendChild(make('div', 'skeleton short'));
    card.appendChild(make('div', 'skeleton line'));
    el.result.replaceChildren(card);
  }

  function renderError(message) {
    var box = make('div', 'error');
    box.setAttribute('role', 'alert');
    box.appendChild(make('span', null, message));
    var retry = make('button', 'ghost', '다시 시도');
    retry.type = 'button';
    retry.addEventListener('click', function () {
      if (state.lastSubmitted) runAnalysis(state.lastSubmitted);
    });
    box.appendChild(retry);
    el.result.replaceChildren(box);
  }

  function renderResult(result) {
    var article = make('article', 'card note');

    var head = make('header', 'note-head');
    var titleWrap = make('div', 'note-title-wrap');
    titleWrap.appendChild(make('h2', 'note-title', result.title));
    if (result.sourceUrl) {
      var link = make('a', 'source-link', result.sourceUrl);
      link.href = result.sourceUrl;
      link.target = '_blank';
      link.rel = 'noreferrer';
      titleWrap.appendChild(link);
    }
    var meta = make('div', 'note-meta');
    meta.appendChild(make('span', null, result.characterCount.toLocaleString() + '자'));
    meta.appendChild(make('span', null, result.sourceType === 'url' ? 'URL' : '직접 입력'));
    meta.appendChild(make('span', null, result.summary.length + '줄 요약 · 용어 ' + result.terms.length + '개'));
    titleWrap.appendChild(meta);
    head.appendChild(titleWrap);

    var copyButton = make('button', 'ghost');
    copyButton.type = 'button';
    copyButton.innerHTML = copySvg;
    copyButton.appendChild(document.createTextNode(' 노션으로 복사'));
    copyButton.addEventListener('click', function () {
      copyMarkdown(copyButton);
    });
    head.appendChild(copyButton);
    article.appendChild(head);

    article.appendChild(make('h3', 'label', '3줄 요약'));
    var takeaways = make('div', 'takeaways');
    if (result.summary.length === 0) {
      takeaways.appendChild(make('p', 'empty-copy', '추출된 요점이 없습니다. 원문을 확인해 주세요.'));
    }
    result.summary.forEach(function (line, index) {
      var item = make('div', 'takeaway');
      item.appendChild(make('span', 'takeaway-index', String(index + 1)));
      var body = document.createElement('div');
      body.appendChild(make('p', 'takeaway-text', line.koreanSummary));
      body.appendChild(make('blockquote', 'original', line.originalSentence));
      item.appendChild(body);
      takeaways.appendChild(item);
    });
    article.appendChild(takeaways);

    article.appendChild(make('h3', 'label', '키워드'));
    var chips = make('div', 'chips');
    if (result.keywords.length === 0) {
      chips.appendChild(make('span', 'empty-copy', '추출된 키워드가 없습니다.'));
    }
    result.keywords.forEach(function (keyword) {
      chips.appendChild(make('span', 'chip', keyword));
    });
    article.appendChild(chips);

    article.appendChild(make('h3', 'label', '용어 해설'));
    var terms = make('div', 'terms');
    if (result.terms.length === 0) {
      terms.appendChild(make('span', 'empty-copy', '정리된 용어가 없습니다.'));
    }
    result.terms.forEach(function (item) {
      var term = make('div', 'term');
      term.appendChild(make('span', 'term-name', item.term));
      term.appendChild(make('span', 'term-meaning', item.meaning));
      terms.appendChild(term);
    });
    article.appendChild(terms);

    article.appendChild(make('div', 'insight', result.insight));
    article.appendChild(make('p', 'disclaimer', '한국어 요약은 무료 규칙 기반 참고 메모입니다. 판단은 원문 문장으로 확인하세요.'));

    el.result.replaceChildren(article);
  }

  function fallbackCopy(text) {
    var area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.top = '-1000px';
    document.body.appendChild(area);
    area.select();
    var ok = false;
    try {
      ok = document.execCommand('copy');
    } catch (error) {
      ok = false;
    }
    document.body.removeChild(area);
    return ok;
  }

  function copyMarkdown(button) {
    if (!state.result) return;
    var text = markdownFor(state.result);
    var done = function (ok) {
      button.innerHTML = ok ? checkSvg : copySvg;
      button.appendChild(document.createTextNode(ok ? ' 복사 완료' : ' 복사 실패'));
      setTimeout(function () {
        button.innerHTML = copySvg;
        button.appendChild(document.createTextNode(' 노션으로 복사'));
      }, 2200);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(fallbackCopy(text)); });
    } else {
      done(fallbackCopy(text));
    }
  }

  async function runAnalysis(value) {
    if (state.pending) return;
    state.pending = true;
    state.lastSubmitted = value;
    el.analyzeButton.disabled = true;
    el.analyzeButton.innerHTML = '읽는 중 ' + spinnerSvg;
    renderLoading();

    try {
      var result = await analyzeSource(value);
      state.result = result;
      renderResult(result);
    } catch (error) {
      state.result = null;
      var message = error && error.message
        ? error.message
        : '요약을 만들지 못했습니다. 잠시 후 다시 시도해 주세요.';
      if (error && error.name === 'AbortError') {
        message = '본문을 가져오지 못했습니다. 응답이 너무 늦어 중단했습니다. 잠시 후 다시 시도해 주세요.';
      }
      renderError(message);
    } finally {
      state.pending = false;
      el.analyzeButton.innerHTML = '요약 카드 만들기 ' + arrowSvg;
      updateComposer();
    }
  }

  /* ---------------- 이벤트 ---------------- */
  el.modeUrl.addEventListener('click', function () { setMode('url'); });
  el.modeText.addEventListener('click', function () { setMode('text'); });
  el.source.addEventListener('input', updateComposer);
  el.composer.addEventListener('submit', function (event) {
    event.preventDefault();
    var value = el.source.value.trim();
    if (!value || state.pending) return;
    runAnalysis(value);
  });

  function unlock() {
    el.pinScreen.hidden = true;
    el.pinScreen.style.display = 'none';
    el.page.hidden = false;
    el.page.style.display = 'flex';
    updateComposer();
  }

  function start() {
    var unlocked = !REQUIRE_PIN || sessionStorage.getItem('research-desk-unlocked') === 'true';
    if (unlocked) {
      unlock();
      return;
    }
    el.page.hidden = true;
    el.page.style.display = 'none';
    el.pinScreen.hidden = false;
    el.pinScreen.style.display = 'grid';
    el.pinInput.focus();
  }

  el.pinForm.addEventListener('submit', function (event) {
    event.preventDefault();
    if (el.pinInput.value === DESK_PIN) {
      sessionStorage.setItem('research-desk-unlocked', 'true');
      el.pinError.textContent = '';
      unlock();
      return;
    }
    el.pinError.textContent = 'PIN이 맞지 않습니다.';
    el.pinInput.value = '';
  });

  setMode('url');
  start();
})();
