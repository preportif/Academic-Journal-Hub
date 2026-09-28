import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Building2, CalendarDays, ChevronDown, ExternalLink, FileText, Menu, Search, ShieldCheck, X } from 'lucide-react';
import { Link, Route, Switch, useLocation, useRoute } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';

type Article = {
  slug: string;
  title: string;
  authors: string[];
  sourceJournal?: string;
  abstract?: string;
  keywords?: string[];
  pdfUrl?: string;
};

type Issue = {
  volume: number;
  number: number;
  month: string;
  year: number;
  articles: Article[];
};

const uploadedArticles: Article[] = [
  {
    slug: 'analisis-sistem-pemeliharaan-alat-kesehatan-di-puskesmas-kabupaten-tanggamus-berbasis-data-aspak',
    title: 'ANALISIS SISTEM PEMELIHARAAN ALAT KESEHATAN DI PUSKESMAS KABUPATEN TANGGAMUS BERBASIS DATA APLIKASI SARANA, PRASARANA, DAN ALAT KESEHATAN (ASPAK)',
    authors: ['Rizki Iskandar', 'Achmad Lukman Hakim'],
    sourceJournal: 'PREPOTIF Jurnal Kesehatan Masyarakat',
    abstract: 'Studi pendahuluan di Kabupaten Tanggamus menunjukkan bahwa pelaksanaan pemeliharaan alat kesehatan masih terkendala keterbatasan anggaran, keterbatasan sumber daya manusia, serta rendahnya konsistensi perawatan dan pencatatan pemeliharaan. Kondisi tersebut berdampak pada tidak mutakhirnya data pemeliharaan dan kalibrasi alat kesehatan dalam Aplikasi Sarana, Prasarana, dan Alat Kesehatan (ASPAK). Penelitian ini menggunakan pendekatan kualitatif dengan desain studi kasus pada empat Puskesmas yang dipilih secara purposive. Pengumpulan data dilakukan melalui wawancara mendalam, observasi lapangan, dan studi dokumentasi. Analisis data menggunakan model Miles dan Huberman. Hasil penelitian menunjukkan bahwa Puskesmas telah memiliki kebijakan, standar operasional prosedur, serta petugas pengelola sarana prasarana dan ASPAK. Namun, implementasi pemeliharaan belum berjalan optimal akibat keterbatasan SDM khusus, beban kerja rangkap, keterbatasan sarana pendukung, serta keterbatasan anggaran pemeliharaan dan kalibrasi yang belum mencukupi. Pemeliharaan preventif, korektif, dan kalibrasi telah dilaksanakan sesuai SOP, tetapi belum konsisten di seluruh unit pelayanan. Pencatatan dan pemutakhiran data ASPAK masih bersifat administratif sehingga belum sepenuhnya mencerminkan kondisi riil alat kesehatan.',
    keywords: ['alat kesehatan', 'pemeliharaan', 'ASPAK', 'sistem informasi', 'Puskesmas', 'Tanggamus'],
    pdfUrl: '/jurnal-preportif-analisis-sistem-pemeliharaan-alat-kesehatan.pdf',
  },
];
const currentIssue: Issue = {
  volume: 7,
  number: 3,
  month: 'October',
  year: 2026,
  articles: uploadedArticles,
};
const issues: Issue[] = [currentIssue];

const platformUrl = 'https://journal.universitaspahlawan.ac.id/index.php/jkt/article/view/60108';
const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/current-issue', label: 'Current Issue' },
  { href: '/archives', label: 'Archives' },
  { href: '/editorial-team', label: 'Editorial Team' },
  { href: '/author-guidelines', label: 'Author Guidelines' },
  { href: '/contact', label: 'Contact' },
];

function SeoMetadata() {
  useEffect(() => {
    document.title = 'Jurnal Kesehatan Tambusai';
    const description = 'Jurnal Kesehatan Tambusai published by Lembaga Penelitian dan Pengabdian Masyarakat Universitas Pahlawan Tuanku Tambusai.';
    let descriptionTag = document.querySelector('meta[name="description"]');
    if (!descriptionTag) {
      descriptionTag = document.createElement('meta');
      descriptionTag.setAttribute('name', 'description');
      document.head.appendChild(descriptionTag);
    }
    descriptionTag.setAttribute('content', description);
    const setOg = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };
    setOg('og:title', 'Jurnal Kesehatan Tambusai');
    setOg('og:description', description);
    setOg('og:type', 'website');
  }, []);
  return null;
}

function OfficialLogo({ className = '' }: { className?: string }) {
  return (
    <img
      src="/jurnal-kesehatan-tambusai-logo.jpeg"
      alt="Jurnal Kesehatan Tambusai"
      className={`official-logo block h-auto object-contain ${className}`}
    />
  );
}

function Header() {
  const [location, setLocation] = useLocation();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const active = (href: string) => href === '/' ? location === '/' || location === '/journal' : location.startsWith(href);
  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchOpen(false);
    setOpen(false);
    setLocation(`/archives${query.trim() ? `?query=${encodeURIComponent(query.trim())}` : ''}`);
  };
  return (
    <header className="sticky top-0 z-40 border-b border-[hsl(var(--border))] bg-[hsl(var(--card)/.97)] backdrop-blur">
      <div className="bg-[hsl(var(--primary))] px-5 py-2 text-[hsl(var(--primary-foreground))] md:px-8">
        <div className="mx-auto flex max-w-[1260px] items-center justify-between gap-3 text-[10px]">
          <span className="mono uppercase tracking-[.08em] text-[hsl(var(--primary-foreground)/.8)]">Public journal publication portal</span>
          <span className="hidden text-[hsl(var(--primary-foreground)/.7)] sm:block">Universitas Pahlawan Tuanku Tambusai</span>
        </div>
      </div>
      <div className="mx-auto flex min-h-[78px] max-w-[1260px] items-center justify-between gap-5 px-5 py-4 md:px-8">
        <Link href="/" onClick={() => setOpen(false)} className="flex min-w-0 items-center" data-testid="link-logo">
          <OfficialLogo className="w-[430px] max-w-[64vw] sm:max-w-[50vw]" />
        </Link>
        <nav className="hidden items-center gap-5 xl:flex" aria-label="Primary navigation">
          {navItems.map(item => <Link key={item.href} href={item.href} data-testid={`link-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`} className={`nav-link whitespace-nowrap text-[11px] font-semibold ${active(item.href) ? 'active text-[hsl(var(--primary))]' : 'text-[hsl(var(--muted-foreground))]'}`}>{item.label}</Link>)}
        </nav>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setSearchOpen(value => !value)} aria-label="Open search" aria-expanded={searchOpen} data-testid="button-open-search" className="grid h-10 w-10 place-items-center rounded-md text-[hsl(var(--primary))] transition-colors hover:bg-[hsl(var(--secondary))]"><Search size={19} /></button>
          <button type="button" onClick={() => setOpen(value => !value)} aria-label={open ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={open} data-testid="button-toggle-menu" className="grid h-10 w-10 place-items-center rounded-md text-[hsl(var(--primary))] hover:bg-[hsl(var(--secondary))] xl:hidden">{open ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
      </div>
      {searchOpen && <div className="border-t border-[hsl(var(--border))] bg-[hsl(var(--secondary)/.55)] px-5 py-4 md:px-8"><form onSubmit={submitSearch} className="mx-auto flex max-w-[1260px] gap-3" role="search"><label htmlFor="site-search" className="sr-only">Search articles</label><div className="flex min-w-0 flex-1 items-center gap-3 rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3"><Search size={17} className="shrink-0 text-[hsl(var(--muted-foreground))]" /><input id="site-search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search titles, authors, or keywords" autoFocus data-testid="input-site-search" className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-[hsl(var(--muted-foreground))]" /></div><button type="submit" data-testid="button-submit-search" className="rounded-md bg-[hsl(var(--primary))] px-5 text-xs font-semibold text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--accent))]">Search</button></form></div>}
      {open && <div className="menu-panel border-t border-[hsl(var(--border))] bg-[hsl(var(--card))] px-5 py-4 xl:hidden"><nav className="mx-auto grid max-w-[1260px] gap-1" aria-label="Mobile navigation">{navItems.map(item => <Link key={item.href} href={item.href} onClick={() => setOpen(false)} data-testid={`link-mobile-${item.label.toLowerCase().replaceAll(' ', '-')}`} className={`rounded-md px-3 py-3 text-sm font-semibold ${active(item.href) ? 'bg-[hsl(var(--secondary))] text-[hsl(var(--primary))]' : 'text-[hsl(var(--foreground))]'}`}>{item.label}</Link>)}</nav></div>}
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-20 border-t border-[hsl(var(--border))] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]">
      <div className="mx-auto grid max-w-[1260px] gap-10 px-5 py-12 md:grid-cols-[1.4fr_1fr_1fr] md:px-8">
        <div><div className="w-fit max-w-full rounded bg-white p-1"><OfficialLogo className="w-[390px] max-w-full" /></div><p className="mt-5 max-w-md text-sm leading-6 text-[hsl(var(--primary-foreground)/.72)]">A public publication portal for Jurnal Kesehatan Tambusai, published by Lembaga Penelitian dan Pengabdian Masyarakat, Universitas Pahlawan Tuanku Tambusai.</p></div>
        <div><div className="eyebrow text-[hsl(var(--primary-foreground)/.65)]">Explore</div><div className="mt-4 grid gap-3 text-sm text-[hsl(var(--primary-foreground)/.82)]"><Link href="/current-issue" className="hover:text-white" data-testid="link-footer-current-issue">Current Issue</Link><Link href="/archives" className="hover:text-white" data-testid="link-footer-archives">Archives</Link><Link href="/about" className="hover:text-white" data-testid="link-footer-about">About the journal</Link></div></div>
        <div><div className="eyebrow text-[hsl(var(--primary-foreground)/.65)]">Current issue</div><p className="mt-4 text-sm leading-6 text-[hsl(var(--primary-foreground)/.82)]">Volume 7, Number 3<br />October 2026</p><Link href="/current-issue" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[hsl(var(--primary-foreground))]" data-testid="link-footer-read-issue">View issue <ArrowRight size={15} /></Link></div>
      </div>
      <div className="border-t border-[hsl(var(--primary-foreground)/.18)] px-5 py-5 md:px-8"><div className="mx-auto max-w-[1260px] text-xs text-[hsl(var(--primary-foreground)/.6)]">© Jurnal Kesehatan Tambusai · Universitas Pahlawan Tuanku Tambusai</div></div>
    </footer>
  );
}

function Shell({ children }: { children: ReactNode }) {
  return <div className="min-h-[100dvh] bg-[hsl(var(--background))]"><SeoMetadata /><Header />{children}<Footer /></div>;
}

function PageHero({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return <section className="border-b border-[hsl(var(--border))] bg-[hsl(var(--secondary)/.45)] px-5 py-12 md:px-8 md:py-16"><div className="mx-auto max-w-[1260px]"><div className="eyebrow">{eyebrow}</div><h1 className="serif mt-4 max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-.03em] text-[hsl(var(--primary))] md:text-7xl">{title}</h1>{description && <p className="mt-5 max-w-2xl text-base leading-7 text-[hsl(var(--muted-foreground))] md:text-lg">{description}</p>}</div></section>;
}

function IssueBadge({ issue = currentIssue }: { issue?: Issue }) {
  return <div className="blue-grid relative overflow-hidden rounded-lg border border-[hsl(var(--primary)/.2)] bg-[hsl(var(--primary))] p-6 text-[hsl(var(--primary-foreground))] shadow-[0_18px_40px_hsl(var(--primary)/.14)] md:p-8"><div className="absolute -right-12 -top-16 h-40 w-40 rounded-full border-[16px] border-[hsl(var(--primary-foreground)/.08)]" /><div className="relative"><div className="flex items-center justify-between gap-4"><span className="eyebrow text-[hsl(var(--primary-foreground)/.7)]">Current issue</span><span className="mono text-[10px] text-[hsl(var(--primary-foreground)/.72)]">JKT</span></div><div className="mt-14"><div className="text-sm text-[hsl(var(--primary-foreground)/.72)]">Volume {issue.volume} · Number {issue.number}</div><div className="serif mt-2 text-5xl leading-none md:text-6xl">{issue.month}</div><div className="mt-2 text-lg text-[hsl(var(--primary-foreground)/.78)]">{issue.year}</div></div><div className="mt-14 border-t border-[hsl(var(--primary-foreground)/.2)] pt-4 text-sm text-[hsl(var(--primary-foreground)/.72)]">{issue.articles.length} uploaded article {issue.articles.length === 1 ? 'record' : 'records'} available</div></div></div>;
}

function OfficialEmptyState({ compact = false }: { compact?: boolean }) {
  return <div className={`rounded-lg border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--card))] text-center ${compact ? 'px-5 py-10' : 'px-6 py-16 md:px-12 md:py-20'}`} data-testid="status-official-content-unavailable"><div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[hsl(var(--secondary))] text-[hsl(var(--primary))]"><FileText size={21} /></div><h2 className={`serif mt-5 text-[hsl(var(--primary))] ${compact ? 'text-2xl' : 'text-3xl md:text-4xl'}`}>Official content is not available yet</h2><p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[hsl(var(--muted-foreground))]">Official article content will appear here when journal files are uploaded.</p></div>;
}

function ArticleCard({ article }: { article: Article }) {
  return <article className="article-row border-t border-[hsl(var(--border))] py-6" data-testid={`card-article-${article.slug}`}><div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-start"><div><h2 className="text-lg font-semibold leading-7 text-[hsl(var(--primary))]">{article.title}</h2><p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">{article.authors.join(', ')}</p>{article.sourceJournal && <p className="mono mt-2 text-[10px] uppercase tracking-[.08em] text-[hsl(var(--accent))]">Source file: {article.sourceJournal}</p>}{article.abstract && <p className="mt-3 text-sm leading-6 text-[hsl(var(--muted-foreground))]">{article.abstract}</p>}</div><Link href={`/article/${article.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-[hsl(var(--primary))]" data-testid={`link-read-article-${article.slug}`}>Read article <ArrowRight size={15} /></Link></div></article>;
}

function Home() {
  return <Shell><main><section className="blue-grid border-b border-[hsl(var(--border))] px-5 py-14 md:px-8 md:py-20"><div className="mx-auto grid max-w-[1260px] gap-12 md:grid-cols-[1.15fr_.85fr] md:items-center"><div className="reveal"><div className="eyebrow">Jurnal Kesehatan Tambusai</div><h1 className="serif mt-5 max-w-3xl text-5xl font-semibold leading-[.98] tracking-[-.035em] text-[hsl(var(--primary))] md:text-8xl">Publication for health science.</h1><p className="mt-6 max-w-2xl text-base leading-7 text-[hsl(var(--muted-foreground))] md:text-lg">Jurnal Kesehatan Tambusai is a public journal portal published by Lembaga Penelitian dan Pengabdian Masyarakat, Universitas Pahlawan Tuanku Tambusai.</p><div className="mt-8 flex flex-wrap gap-3"><Link href="/current-issue" className="link-arrow inline-flex items-center gap-2 rounded-md bg-[hsl(var(--primary))] px-5 py-3 text-sm font-semibold text-[hsl(var(--primary-foreground))]" data-testid="link-home-current-issue">View current issue <ArrowRight size={16} /></Link><Link href="/archives" className="inline-flex items-center gap-2 rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-5 py-3 text-sm font-semibold text-[hsl(var(--primary))] hover:border-[hsl(var(--primary)/.4)]" data-testid="link-home-archives">Browse archives</Link></div></div><div className="reveal delay-2 md:pl-10"><IssueBadge /></div></div></section><section className="mx-auto max-w-[1260px] px-5 py-12 md:px-8 md:py-16"><div className="grid gap-5 border-y border-[hsl(var(--border))] py-6 md:grid-cols-3"><div className="flex gap-3"><CalendarDays className="mt-0.5 shrink-0 text-[hsl(var(--accent))]" size={20} /><div><div className="text-sm font-semibold text-[hsl(var(--primary))]">Current publication</div><div className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">Volume 7, Number 3 · October 2026</div></div></div><div className="flex gap-3"><Building2 className="mt-0.5 shrink-0 text-[hsl(var(--accent))]" size={20} /><div><div className="text-sm font-semibold text-[hsl(var(--primary))]">Publisher</div><div className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">Lembaga Penelitian dan Pengabdian Masyarakat</div></div></div><div className="flex gap-3"><ShieldCheck className="mt-0.5 shrink-0 text-[hsl(var(--accent))]" size={20} /><div><div className="text-sm font-semibold text-[hsl(var(--primary))]">Public access</div><div className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">Official files will be presented as they are uploaded.</div></div></div></div></section><section className="mx-auto max-w-[1260px] px-5 pb-12 md:px-8 md:pb-20"><div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><div className="eyebrow">Volume 7 · Number 3</div><h2 className="serif mt-2 text-4xl font-semibold text-[hsl(var(--primary))] md:text-5xl">Current issue</h2></div><Link href="/current-issue" className="link-arrow inline-flex items-center gap-2 text-sm font-semibold text-[hsl(var(--primary))]" data-testid="link-home-view-issue">View issue <ArrowRight size={15} /></Link></div><OfficialEmptyState compact /></section><section className="border-y border-[hsl(var(--border))] bg-[hsl(var(--secondary)/.55)] px-5 py-12 md:px-8 md:py-16"><div className="mx-auto grid max-w-[1260px] gap-8 md:grid-cols-[.9fr_1.1fr] md:items-start"><div><div className="eyebrow">About the portal</div><h2 className="serif mt-3 max-w-md text-4xl font-semibold leading-tight text-[hsl(var(--primary))]">A clear home for the journal record.</h2></div><div className="text-sm leading-7 text-[hsl(var(--muted-foreground))]"><p>Use this portal to find the current issue, browse the archive, and access article records when official journal files are available.</p><div className="mt-5 flex flex-wrap gap-x-6 gap-y-3"><Link href="/about" className="font-semibold text-[hsl(var(--primary))] hover:text-[hsl(var(--accent))]" data-testid="link-home-about">About the journal <ArrowRight className="ml-1 inline" size={14} /></Link><Link href="/contact" className="font-semibold text-[hsl(var(--primary))] hover:text-[hsl(var(--accent))]" data-testid="link-home-contact">Contact information <ArrowRight className="ml-1 inline" size={14} /></Link></div></div></div></section></main></Shell>;
}

function IssuePage() {
  return <Shell><main><PageHero eyebrow="Current issue" title="Volume 7, Number 3" description="October 2026 · Jurnal Kesehatan Tambusai" /><div className="mx-auto grid max-w-[1260px] gap-10 px-5 py-12 md:grid-cols-[300px_1fr] md:px-8 md:py-16"><div><IssueBadge /><Link href="/archives" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))]" data-testid="link-issue-back-archives"><ArrowLeft size={15} /> All archives</Link></div><section aria-labelledby="issue-contents-heading"><div className="mb-6 flex flex-wrap items-baseline justify-between gap-3"><h2 id="issue-contents-heading" className="text-lg font-bold text-[hsl(var(--primary))]">Articles in this issue</h2><span className="mono text-[10px] uppercase tracking-[.1em] text-[hsl(var(--muted-foreground))]">{currentIssue.articles.length} available</span></div>{currentIssue.articles.length ? currentIssue.articles.map(article => <ArticleCard key={article.slug} article={article} />) : <OfficialEmptyState compact />}</section></div></main></Shell>;
}

function Archives() {
  const [location] = useLocation();
  const initialQuery = useMemo(() => new URLSearchParams(location.split('?')[1] ?? '').get('query') ?? '', [location]);
  const [title, setTitle] = useState(initialQuery);
  const [author, setAuthor] = useState('');
  const [keyword, setKeyword] = useState('');
  const matches = useMemo(() => uploadedArticles.filter(article => `${article.title} ${article.authors.join(' ')} ${(article.keywords ?? []).join(' ')}`.toLowerCase().includes(`${title} ${author} ${keyword}`.toLowerCase().trim())), [title, author, keyword]);
  const searching = Boolean(title || author || keyword);
  return <Shell><main><PageHero eyebrow="Journal archive" title="Issues & articles" description="The archive begins with the current publication. New official issue and article records can be added to the data structure as journal files become available." /><div className="mx-auto max-w-[1260px] px-5 py-12 md:px-8 md:py-16"><div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 md:p-6"><div className="flex items-center gap-2 text-sm font-semibold text-[hsl(var(--primary))]"><Search size={17} /> Search articles</div><div className="mt-5 grid gap-4 md:grid-cols-3"><label className="grid gap-2 text-xs font-semibold text-[hsl(var(--muted-foreground))]">Title<input value={title} onChange={event => setTitle(event.target.value)} placeholder="Search by title" data-testid="input-search-title" className="rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-3 text-sm font-normal text-[hsl(var(--foreground))] outline-none focus:border-[hsl(var(--accent))]" /></label><label className="grid gap-2 text-xs font-semibold text-[hsl(var(--muted-foreground))]">Author<input value={author} onChange={event => setAuthor(event.target.value)} placeholder="Search by author" data-testid="input-search-author" className="rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-3 text-sm font-normal text-[hsl(var(--foreground))] outline-none focus:border-[hsl(var(--accent))]" /></label><label className="grid gap-2 text-xs font-semibold text-[hsl(var(--muted-foreground))]">Keyword<input value={keyword} onChange={event => setKeyword(event.target.value)} placeholder="Search by keyword" data-testid="input-search-keyword" className="rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-3 py-3 text-sm font-normal text-[hsl(var(--foreground))] outline-none focus:border-[hsl(var(--accent))]" /></label></div></div><section className="mt-12" aria-labelledby="archive-current-heading"><div className="flex flex-wrap items-center justify-between gap-4 border-b border-[hsl(var(--border))] pb-5"><div><div className="eyebrow">2026</div><h2 id="archive-current-heading" className="mt-2 text-2xl font-bold text-[hsl(var(--primary))]">Volume 7, Number 3 <span className="font-normal text-[hsl(var(--muted-foreground))]">— October 2026</span></h2></div><Link href="/issue/vol-7-no-3" className="inline-flex items-center gap-2 text-sm font-semibold text-[hsl(var(--primary))]" data-testid="link-archive-current-issue">Issue details <ArrowRight size={15} /></Link></div><div className="mt-2">{matches.length ? matches.map(article => <ArticleCard key={article.slug} article={article} />) : searching ? <div className="py-14 text-center"><BookOpen className="mx-auto text-[hsl(var(--accent))]" size={25} /><h3 className="serif mt-4 text-3xl text-[hsl(var(--primary))]">No articles match this search</h3><p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">Search results are limited to official content currently available in the journal archive.</p><button type="button" onClick={() => { setTitle(''); setAuthor(''); setKeyword(''); }} className="mt-5 text-sm font-semibold text-[hsl(var(--primary))] underline underline-offset-4" data-testid="button-clear-search">Clear search</button></div> : <OfficialEmptyState compact />}</div></section><div className="mt-14 border-t border-[hsl(var(--border))] pt-6 text-sm text-[hsl(var(--muted-foreground))]">No prior issues are listed because official archive data has not been uploaded. {issues.length === 1 ? 'The current issue is the only official issue record available.' : ''}</div></div></main></Shell>;
}

function ArticlePage() {
  const [, params] = useRoute('/article/:slug');
  const article = uploadedArticles.find(item => item.slug === params?.slug);
  if (!article) return <Shell><main className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24"><div className="rounded-lg border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--card))] px-6 py-14 text-center md:px-12"><div className="eyebrow">Article unavailable</div><h1 className="serif mt-4 text-4xl font-semibold leading-tight text-[hsl(var(--primary))] md:text-6xl">This official article record is not available.</h1><p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-[hsl(var(--muted-foreground))]">Official article content will appear here when journal files are uploaded. No bibliographic details or PDF are available for this address.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/current-issue" className="inline-flex items-center gap-2 rounded-md bg-[hsl(var(--primary))] px-4 py-3 text-sm font-semibold text-[hsl(var(--primary-foreground))]" data-testid="link-unavailable-current-issue">Current issue <ArrowRight size={15} /></Link><Link href="/archives" className="inline-flex items-center gap-2 rounded-md border border-[hsl(var(--border))] px-4 py-3 text-sm font-semibold text-[hsl(var(--primary))]" data-testid="link-unavailable-archives">Archives</Link></div></div></main></Shell>;
  return <Shell><main><PageHero eyebrow="Article" title={article.title} description={article.authors.join(', ')} /><div className="mx-auto max-w-[900px] px-5 py-12 md:px-8 md:py-16"><article>{article.sourceJournal && <div className="mb-8 rounded-md border border-[hsl(var(--accent)/.3)] bg-[hsl(var(--secondary))] px-4 py-3 text-sm leading-6 text-[hsl(var(--muted-foreground))]"><span className="font-semibold text-[hsl(var(--primary))]">Source file journal label:</span> {article.sourceJournal}. This uploaded file is included at the publisher’s request.</div>}<div className="eyebrow">Abstract</div><p className="mt-5 text-lg leading-8 text-[hsl(var(--foreground))]">{article.abstract || 'Abstract not available.'}</p><div className="mt-10 border-t border-[hsl(var(--border))] pt-6"><div className="eyebrow">Keywords</div><div className="mt-3 flex flex-wrap gap-2">{(article.keywords ?? []).map(keyword => <span key={keyword} className="rounded-full bg-[hsl(var(--secondary))] px-3 py-1.5 text-xs text-[hsl(var(--muted-foreground))]">{keyword}</span>)}</div></div><div className="mt-10 flex flex-wrap gap-3">{article.pdfUrl && <a href={article.pdfUrl} download className="inline-flex items-center gap-2 rounded-md bg-[hsl(var(--primary))] px-4 py-3 text-sm font-semibold text-[hsl(var(--primary-foreground))]" data-testid="link-download-pdf"><FileText size={15} /> Download PDF</a>}<Link href="/current-issue" className="inline-flex items-center gap-2 rounded-md border border-[hsl(var(--border))] px-4 py-3 text-sm font-semibold text-[hsl(var(--primary))]" data-testid="link-article-current-issue">View current issue <ArrowRight size={15} /></Link></div></article></div></main></Shell>;
}

function About() {
  return <Shell><main><PageHero eyebrow="About the journal" title="Jurnal Kesehatan Tambusai" description="A public journal publication portal for the journal's official issue and article records." /><div className="mx-auto grid max-w-[1260px] gap-8 px-5 py-12 md:grid-cols-[1fr_1.1fr] md:px-8 md:py-16"><section className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 md:p-8"><div className="eyebrow">Verified information</div><dl className="mt-7 grid gap-6"><div><dt className="text-xs font-semibold uppercase tracking-[.08em] text-[hsl(var(--muted-foreground))]">Journal</dt><dd className="mt-1 text-lg font-semibold text-[hsl(var(--primary))]">Jurnal Kesehatan Tambusai</dd></div><div><dt className="text-xs font-semibold uppercase tracking-[.08em] text-[hsl(var(--muted-foreground))]">Publisher</dt><dd className="mt-1 text-base leading-6">Lembaga Penelitian dan Pengabdian Masyarakat</dd></div><div><dt className="text-xs font-semibold uppercase tracking-[.08em] text-[hsl(var(--muted-foreground))]">Institution</dt><dd className="mt-1 text-base leading-6">Universitas Pahlawan Tuanku Tambusai</dd></div></dl></section><section className="border-l-2 border-[hsl(var(--accent))] px-6 py-2 md:px-8"><div className="eyebrow">About this website</div><p className="mt-5 text-base leading-8 text-[hsl(var(--muted-foreground))]">This website is a public-facing publication portal. It is intended to present official issues and article information when those journal files have been uploaded.</p><p className="mt-5 text-base leading-8 text-[hsl(var(--muted-foreground))]">The current issue shell is Volume 7, Number 3, October 2026. No additional journal facts are presented until they are available from official sources.</p></section></div></main></Shell>;
}

function EditorialTeam() {
  return <Shell><main><PageHero eyebrow="Editorial Team" title="Editorial information" description="Official editorial information will be presented here when it has been uploaded by the journal." /><div className="mx-auto max-w-[900px] px-5 py-12 md:px-8 md:py-16"><OfficialEmptyState compact /></div></main></Shell>;
}

function AuthorGuidelines() {
  return <Shell><main><PageHero eyebrow="Author Guidelines" title="Guidelines" description="Information for authors will be published here by the journal." /><div className="mx-auto max-w-[900px] px-5 py-12 md:px-8 md:py-16"><div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-6 py-12 text-center md:px-12"><BookOpen className="mx-auto text-[hsl(var(--accent))]" size={25} /><p className="mt-5 text-lg text-[hsl(var(--primary))]" data-testid="text-author-guidelines-placeholder">Author guidelines will be provided by the journal.</p></div></div></main></Shell>;
}

function Contact() {
  return <Shell><main><PageHero eyebrow="Contact" title="Contact the journal" description="Official contact information has not been uploaded yet." /><div className="mx-auto max-w-[900px] px-5 py-12 md:px-8 md:py-16"><div className="rounded-lg border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--card))] px-6 py-12 md:px-10"><div className="flex items-start gap-4"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[hsl(var(--secondary))] text-[hsl(var(--primary))]"><Building2 size={18} /></div><div><h2 className="text-lg font-bold text-[hsl(var(--primary))]">Official contact information not uploaded</h2><p className="mt-2 text-sm leading-6 text-[hsl(var(--muted-foreground))]">Please refer to the official journal platform for source information.</p><a href={platformUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[hsl(var(--primary))] underline underline-offset-4 hover:text-[hsl(var(--accent))]" data-testid="link-official-platform">Open official journal platform <ExternalLink size={15} /></a></div></div></div></div></main></Shell>;
}

function Router() {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}><Switch><Route path="/" component={Home} /><Route path="/journal" component={Home} /><Route path="/current-issue" component={IssuePage} /><Route path="/archives" component={Archives} /><Route path="/issue/vol-7-no-3" component={IssuePage} /><Route path="/article/:slug" component={ArticlePage} /><Route path="/about" component={About} /><Route path="/editorial-team" component={EditorialTeam} /><Route path="/author-guidelines" component={AuthorGuidelines} /><Route path="/contact" component={Contact} /><Route component={NotFound} /></Switch></ErrorBoundary>;
}

function App() {
  return <TooltipProvider><Router /><Toaster /></TooltipProvider>;
}

export default App;