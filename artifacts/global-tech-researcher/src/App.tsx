import { useState, type FormEvent } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAnalyzeResearch } from '@workspace/api-client-react';
import { ArrowRight, Check, Clipboard, FileText, Link2, LockKeyhole, RotateCw } from 'lucide-react';
import { ErrorBoundary, type ErrorFallbackProps } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

const queryClient = new QueryClient();

/** 개인용으로 쓸 때만 true로 바꾸면 PIN 잠금 화면이 켜집니다. */
const REQUIRE_PIN = false;
const DESK_PIN = '1004';

type InputMode = 'url' | 'text';

function Brand() {
  return (
    <div className="brand">
      <span className="brand-mark" aria-hidden="true">GT</span>
      <span className="brand-name">글로벌 테크 리서처</span>
    </div>
  );
}

function DeskError({ error, resetError }: ErrorFallbackProps) {
  return (
    <main className="pin-screen">
      <section className="pin-card" role="alert">
        <h1 className="pin-title">화면을 열지 못했습니다</h1>
        <p className="pin-subtitle">{error.message || '잠시 후 다시 시도해 주세요.'}</p>
        <button className="primary" type="button" onClick={resetError}>다시 열기</button>
      </section>
    </main>
  );
}

function PinGate({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pin === DESK_PIN) {
      sessionStorage.setItem('research-desk-unlocked', 'true');
      onUnlock();
      return;
    }
    setError('PIN이 맞지 않습니다.');
    setPin('');
  }

  return (
    <main className="pin-screen">
      <div className="pin-wrap">
        <form className="pin-card" onSubmit={submit}>
          <Brand />
          <h1 className="pin-title">리서치 데스크</h1>
          <p className="pin-subtitle">PIN을 입력하면 노트가 열립니다.</p>
          <input
            className="pin-input"
            data-testid="input-pin"
            aria-label="PIN"
            autoComplete="off"
            inputMode="numeric"
            maxLength={4}
            type="password"
            value={pin}
            onChange={(event) => {
              setPin(event.target.value.replace(/\D/g, '').slice(0, 4));
              setError('');
            }}
            placeholder="••••"
            autoFocus
          />
          <div className="pin-error" role="status" data-testid="status-pin-error">{error}</div>
          <button className="primary pin-enter" data-testid="button-enter-pin" type="submit">데스크 열기</button>
          <p className="pin-note"><LockKeyhole size={11} /> 이 화면에서만 쓰는 로컬 잠금입니다.</p>
        </form>
      </div>
    </main>
  );
}

function markdownFor(result: {
  title: string;
  sourceUrl: string | null;
  sourceType: 'url' | 'text';
  summary: { label: string; koreanSummary: string; originalSentence: string }[];
  keywords: string[];
  terms: { term: string; meaning: string }[];
  insight: string;
  characterCount: number;
}) {
  const source = result.sourceUrl ? `[원문 링크](${result.sourceUrl})` : '직접 입력한 영문 텍스트';
  const summary = result.summary.map((line) => (
    `### ${line.label}\n${line.koreanSummary}\n\n> ${line.originalSentence}`
  )).join('\n\n');
  const terms = result.terms.map(({ term, meaning }) => `- **${term}** — ${meaning}`).join('\n');
  return [
    `# ${result.title}`,
    '',
    `- 출처: ${source}`,
    `- 입력 형식: ${result.sourceType === 'url' ? 'URL' : '영문 텍스트'}`,
    `- 원문 분량: ${result.characterCount.toLocaleString()}자`,
    '',
    '## 3줄 요약',
    '',
    summary || '정리 항목이 없습니다.',
    '',
    '## 키워드',
    '',
    result.keywords.map((word) => `\`${word}\``).join(' · ') || '없음',
    '',
    '## 용어 해설',
    '',
    terms || '정리된 용어가 없습니다.',
    '',
    '## 한 줄 인사이트',
    '',
    result.insight,
    '',
    '> 한국어 요약은 규칙 기반 참고 메모입니다. 원문 문장과 함께 확인하세요.',
  ].join('\n');
}

function ResearchWorkspace() {
  const [mode, setMode] = useState<InputMode>('url');
  const [source, setSource] = useState('');
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [lastSubmitted, setLastSubmitted] = useState('');
  const analyze = useAnalyzeResearch();
  const result = analyze.data;
  const pending = analyze.isPending;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = source.trim();
    if (!value || pending) return;
    setLastSubmitted(value);
    setCopied(false);
    analyze.mutate({ data: { source: value } });
  }

  async function copyMarkdown() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(markdownFor(result));
      setCopied(true);
      setCopyFailed(false);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
      setCopyFailed(true);
      window.setTimeout(() => setCopyFailed(false), 2600);
    }
  }

  const errorMessage = analyze.error instanceof Error
    ? analyze.error.message
    : '요약을 만들지 못했습니다. 잠시 후 다시 시도해 주세요.';

  return (
    <div className="page">
      <header className="bar">
        <Brand />
        <span className="bar-note">무료 · Jina Reader</span>
      </header>

      <main className="main">
        <section className="hero">
          <h1>영문 테크 아티클,<br /><span>3줄 요약으로.</span></h1>
          <p>
            링크나 영문 텍스트를 넣으면 핵심 3줄 요약과 IT·AI 용어 해설 카드를 만들어 드립니다.
            결과는 버튼 한 번으로 노션에 붙여넣을 수 있습니다.
          </p>
        </section>

        <form className="card composer" onSubmit={submit} aria-label="아티클 분석 입력">
          <div className="segmented" role="group" aria-label="입력 형식 선택">
            <button
              type="button"
              data-testid="button-mode-url"
              aria-pressed={mode === 'url'}
              className={`segment ${mode === 'url' ? 'active' : ''}`}
              onClick={() => setMode('url')}
            >
              <Link2 size={13} /> URL
            </button>
            <button
              type="button"
              data-testid="button-mode-text"
              aria-pressed={mode === 'text'}
              className={`segment ${mode === 'text' ? 'active' : ''}`}
              onClick={() => setMode('text')}
            >
              <FileText size={13} /> 텍스트
            </button>
          </div>

          <label className="field-label" htmlFor="article-source">
            {mode === 'url' ? '아티클 주소' : '영문 원문'}
          </label>
          <textarea
            id="article-source"
            className="source-input"
            data-testid="input-research-source"
            value={source}
            onChange={(event) => setSource(event.target.value)}
            placeholder={mode === 'url'
              ? 'https://example.com/technology/article'
              : '영문 아티클을 여기에 붙여넣으세요.'}
            maxLength={200000}
            required
          />

          <div className="composer-foot">
            <span className="hint">{source.length.toLocaleString()} / 200,000 · 원문 문장도 함께 남깁니다</span>
            <button className="primary" type="submit" data-testid="button-analyze" disabled={!source.trim() || pending}>
              {pending
                ? <>읽는 중 <RotateCw size={14} className="spin" /></>
                : <>요약 카드 만들기 <ArrowRight size={15} /></>}
            </button>
          </div>
        </form>

        <section className="result" aria-live="polite">
          {pending && (
            <div className="card loading" data-testid="status-analysis-loading">
              <div className="skeleton title" />
              <div className="skeleton line" />
              <div className="skeleton short" />
              <div className="skeleton line" />
            </div>
          )}

          {analyze.isError && !pending && (
            <div className="error" role="alert" data-testid="status-analysis-error">
              <span>{errorMessage}</span>
              <button type="button" className="ghost" data-testid="button-retry-analysis" onClick={() => {
                if (lastSubmitted) analyze.mutate({ data: { source: lastSubmitted } });
              }}>다시 시도</button>
            </div>
          )}

          {!pending && !result && !analyze.isError && (
            <div className="empty" data-testid="empty-research-result">
              <p className="empty-title">아직 노트가 없습니다</p>
              <p className="empty-copy">위에 아티클 주소를 넣고 <strong>요약 카드 만들기</strong>를 눌러 보세요.</p>
            </div>
          )}

          {!pending && result && (
            <article className="card note" data-testid="card-research-result">
              <header className="note-head">
                <div className="note-title-wrap">
                  <h2 className="note-title" data-testid="text-result-title">{result.title}</h2>
                  {result.sourceUrl && (
                    <a className="source-link" data-testid="link-source-url" href={result.sourceUrl} target="_blank" rel="noreferrer">
                      {result.sourceUrl}
                    </a>
                  )}
                  <div className="note-meta">
                    <span data-testid="text-character-count">{result.characterCount.toLocaleString()}자</span>
                    <span>{result.sourceType === 'url' ? 'URL' : '직접 입력'}</span>
                    <span>{result.summary.length}줄 요약 · 용어 {result.terms.length}개</span>
                  </div>
                </div>
                <button type="button" className="ghost" data-testid="button-copy-markdown" onClick={copyMarkdown}>
                  {copied ? <Check size={14} /> : <Clipboard size={14} />}
                  {copied ? '복사 완료' : copyFailed ? '복사 실패' : '노션으로 복사'}
                </button>
              </header>

              <h3 className="label">3줄 요약</h3>
              <div className="takeaways">
                {result.summary.map((line, index) => (
                  <div className="takeaway" key={`${line.label}-${index}`} data-testid={`summary-item-${index}`}>
                    <span className="takeaway-index">{index + 1}</span>
                    <div>
                      <p className="takeaway-text">{line.koreanSummary}</p>
                      <blockquote className="original">{line.originalSentence}</blockquote>
                    </div>
                  </div>
                ))}
                {result.summary.length === 0 && <p className="empty-copy">추출된 요점이 없습니다. 원문을 확인해 주세요.</p>}
              </div>

              <h3 className="label">키워드</h3>
              <div className="chips" data-testid="list-research-keywords">
                {result.keywords.length > 0
                  ? result.keywords.map((keyword, index) => <span className="chip" key={`${keyword}-${index}`}>{keyword}</span>)
                  : <span className="empty-copy">추출된 키워드가 없습니다.</span>}
              </div>

              <h3 className="label">용어 해설</h3>
              <div className="terms" data-testid="list-research-terms">
                {result.terms.length > 0
                  ? result.terms.map((term, index) => (
                    <div className="term" key={`${term.term}-${index}`}>
                      <span className="term-name">{term.term}</span>
                      <span className="term-meaning">{term.meaning}</span>
                    </div>
                  ))
                  : <span className="empty-copy">정리된 용어가 없습니다.</span>}
              </div>

              <div className="insight" data-testid="text-research-insight">{result.insight}</div>

              <p className="disclaimer">한국어 요약은 무료 규칙 기반 참고 메모입니다. 판단은 원문 문장으로 확인하세요.</p>
            </article>
          )}
        </section>
      </main>

      <footer className="foot">
        <span>GLOBAL TECH RESEARCHER</span>
        <span>Jina Reader · 로컬 규칙 기반</span>
      </footer>
    </div>
  );
}

function Home() {
  const [unlocked, setUnlocked] = useState(
    () => !REQUIRE_PIN || sessionStorage.getItem('research-desk-unlocked') === 'true',
  );
  return unlocked ? <ResearchWorkspace /> : <PinGate onUnlock={() => setUnlocked(true)} />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ErrorBoundary FallbackComponent={DeskError}>
          <Home />
        </ErrorBoundary>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
