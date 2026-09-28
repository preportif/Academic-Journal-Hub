import { useMemo, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, BookOpen, Check, ChevronDown, Download, Menu, Search, X } from 'lucide-react';
import { Link, Route, Switch, useLocation, useRoute } from 'wouter';
import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';

type Article = {
  slug: string;
  title: string;
  deck: string;
  authors: string[];
  affiliation: string;
  section: string;
  pages: string;
  published: string;
  abstract: string;
  keywords: string[];
  issue: string;
  volume: number;
  issueNumber: number;
  accent: string;
};
type Issue = { volume: number; number: number; season: string; date: string; theme: string; articles: Article[] };

const articles: Article[] = [
  {
    slug: 'the-afterlife-of-a-river',
    title: 'The Afterlife of a River',
    deck: 'Memory, maintenance, and the civic imagination along the lower Danube.',
    authors: ['Mara Iliescu', 'Jonas Feld'],
    affiliation: 'University of Bucharest · University of Vienna',
    section: 'Feature essay', pages: '1–28', published: '14 September 2024',
    abstract: 'Rivers are often described as natural boundaries, but the lower Danube is better understood as a shared archive. Drawing on oral histories, municipal records, and a decade of field observation, this essay follows the small acts of maintenance through which communities remember a changing waterway. It argues that infrastructure is not merely an answer to environmental uncertainty; it is one of the places where collective memory becomes durable.',
    keywords: ['river studies', 'infrastructure', 'memory', 'Danube'], issue: 'Autumn 2024', volume: 18, issueNumber: 3, accent: 'ochre',
  },
  {
    slug: 'listening-to-the-unbuilt-city',
    title: 'Listening to the Unbuilt City',
    deck: 'Sound archives and the politics of urban possibility.',
    authors: ['Nadia Okafor'], affiliation: 'Goldsmiths, University of London',
    section: 'Research article', pages: '29–51', published: '14 September 2024',
    abstract: 'What can a city sound like before it exists? This article examines recordings, planning documents, and public testimony from three unrealised civic projects. By treating sound as evidence rather than atmosphere, it reveals how imagined streets and missing buildings continue to organize political feeling.',
    keywords: ['sound studies', 'urbanism', 'archives', 'public space'], issue: 'Autumn 2024', volume: 18, issueNumber: 3, accent: 'blue',
  },
  {
    slug: 'a-small-theory-of-attention',
    title: 'A Small Theory of Attention',
    deck: 'On notebooks, marginalia, and the ethics of looking closely.',
    authors: ['Tessa McBride', 'Ravi Raman'], affiliation: 'University of Glasgow · Jawaharlal Nehru University',
    section: 'Forum', pages: '52–68', published: '14 September 2024',
    abstract: 'Attention is usually measured as a scarce resource. This essay proposes a different account: attention as a relation that can be practiced, shared, and repaired. Across notebooks kept by a botanist, a translator, and a museum guard, it locates a quiet politics in the margin.',
    keywords: ['attention', 'material culture', 'ethics', 'reading'], issue: 'Autumn 2024', volume: 18, issueNumber: 3, accent: 'coral',
  },
  {
    slug: 'the-weather-of-work',
    title: 'The Weather of Work',
    deck: 'Heat, prediction, and the embodied knowledge of seasonal labour.',
    authors: ['Elena Rossi'], affiliation: 'University of Bologna',
    section: 'Research article', pages: '69–94', published: '14 September 2024',
    abstract: 'Seasonal workers do not simply experience weather; they interpret, anticipate, and work through it. This study brings labour history into conversation with climate science to show how weather forecasts can both recognize and erase embodied expertise.',
    keywords: ['labour', 'climate', 'forecasting', 'knowledge'], issue: 'Autumn 2024', volume: 18, issueNumber: 3, accent: 'sage',
  },
  {
    slug: 'the-grammar-of-repair',
    title: 'The Grammar of Repair',
    deck: 'Broken objects and the language of care in postwar museums.',
    authors: ['Lena Hoffmann', 'Caleb Price'], affiliation: 'Humboldt-Universität zu Berlin · University of Leeds',
    section: 'Research article', pages: '95–121', published: '2 June 2024',
    abstract: 'This article traces the vocabulary of repair across museum catalogues, conservation reports, and exhibition labels from 1948 to the present. It suggests that the grammar of repair is never neutral: every restored object carries an argument about what a public is obliged to remember.',
    keywords: ['museums', 'repair', 'conservation', 'public memory'], issue: 'Summer 2024', volume: 18, issueNumber: 2, accent: 'ochre',
  },
  {
    slug: 'salt-lines',
    title: 'Salt Lines',
    deck: 'A coastal history of extraction, taste, and the Indian Ocean.',
    authors: ['Amina Shah'], affiliation: 'University of Cape Town',
    section: 'Feature essay', pages: '7–34', published: '7 March 2024',
    abstract: 'Salt is at once mineral, commodity, preservative, and metaphor. Following its routes between East Africa, Gujarat, and the Arabian Peninsula, this essay shows how a seemingly ordinary substance carries the imprint of oceanic power.',
    keywords: ['Indian Ocean', 'trade', 'food history', 'extraction'], issue: 'Spring 2024', volume: 18, issueNumber: 1, accent: 'blue',
  },
  {
    slug: 'archives-of-the-common',
    title: 'Archives of the Common',
    deck: 'How neighbourhood collections make a public out of fragments.',
    authors: ['Mateo Sanz', 'June Harada'], affiliation: 'Universitat de Barcelona · Waseda University',
    section: 'Research article', pages: '35–60', published: '7 March 2024',
    abstract: 'Community archives are often evaluated by what they preserve. This article asks instead what they allow people to do together. Through two neighbourhood collections, it examines cataloguing as a form of assembly and disagreement as an archival resource.',
    keywords: ['community archives', 'commons', 'cataloguing', 'neighbourhoods'], issue: 'Spring 2024', volume: 18, issueNumber: 1, accent: 'coral',
  },
  {
    slug: 'after-the-map',
    title: 'After the Map',
    deck: 'Cartographic leftovers and the politics of being difficult to locate.',
    authors: ['Samira Bell'], affiliation: 'University of Toronto',
    section: 'Review essay', pages: '61–78', published: '7 March 2024',
    abstract: 'Maps promise a stable relation between place and knowledge. This review essay considers recent work that lingers with what maps leave out: routes interrupted, names translated, and lives that refuse a single coordinate.',
    keywords: ['cartography', 'place', 'translation', 'politics'], issue: 'Spring 2024', volume: 18, issueNumber: 1, accent: 'sage',
  },
  {
    slug: 'the-right-to-remain-untranslated',
    title: 'The Right to Remain Untranslated',
    deck: 'Language, refusal, and the work of not being made legible.',
    authors: ['Pilar Ortiz', 'Hyejin Park'], affiliation: 'Universidad Nacional Autónoma de México · Seoul National University',
    section: 'Forum', pages: '79–98', published: '9 November 2023',
    abstract: 'Translation is frequently described as hospitality. But what happens when legibility is itself a demand? This conversation considers the protective, political, and generative uses of refusing a complete translation.',
    keywords: ['translation', 'language', 'refusal', 'legibility'], issue: 'Winter 2023', volume: 17, issueNumber: 4, accent: 'ochre',
  },
  {
    slug: 'the-museum-after-dark',
    title: 'The Museum After Dark',
    deck: 'Night work and the hidden choreography of cultural institutions.',
    authors: ['Nikhil Varma'], affiliation: 'University of Sydney',
    section: 'Research article', pages: '99–126', published: '9 November 2023',
    abstract: 'Museums after hours are not empty spaces. They are workplaces with their own rhythms, hierarchies, and forms of care. Based on interviews with cleaners, guards, and conservators, this article attends to the labour that makes cultural quiet possible.',
    keywords: ['museums', 'night work', 'care', 'labour'], issue: 'Winter 2023', volume: 17, issueNumber: 4, accent: 'blue',
  },
];
const issues: Issue[] = [
  { volume: 18, number: 3, season: 'Autumn 2024', date: 'September 2024', theme: 'Ways of attending', articles: articles.filter(a => a.volume === 18 && a.issueNumber === 3) },
  { volume: 18, number: 2, season: 'Summer 2024', date: 'June 2024', theme: 'The work of repair', articles: articles.filter(a => a.issueNumber === 2) },
  { volume: 18, number: 1, season: 'Spring 2024', date: 'March 2024', theme: 'Oceanic crossings', articles: articles.filter(a => a.issueNumber === 1) },
  { volume: 17, number: 4, season: 'Winter 2023', date: 'November 2023', theme: 'Against legibility', articles: articles.filter(a => a.issueNumber === 4) },
];

const currentIssue = issues[0];
const queryClient = new QueryClient();
const iconForAccent = (accent: string) => ({ ochre: '#C58A43', blue: '#547C83', coral: '#C56B57', sage: '#80917C' }[accent] ?? '#C58A43');

function DownloadPdf({ article, compact = false }: { article: Article; compact?: boolean }) {
  const download = () => {
    const lines = [
      article.title,
      article.authors.join(', '),
      article.affiliation,
      '',
      'ABSTRACT',
      article.abstract,
      '',
      `Keywords: ${article.keywords.join(', ')}`,
      '',
      `The Meridian Review · ${article.issue} · Volume ${article.volume}, Issue ${article.issueNumber}`,
    ];
    const stream = lines.map((line, index) => `BT /F1 10 Tf 48 ${750 - index * 22} Td (${line.replace(/[()\\]/g, '\\$&')}) Tj ET`).join('\n');
    const pdf = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
5 0 obj
<< /Length ${stream.length} >>
stream
${stream}
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000279 00000 n 
0000000350 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
${350 + stream.length}
%%EOF`;
    const blob = new Blob([pdf], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url; anchor.download = `${article.slug}.pdf`; anchor.click(); URL.revokeObjectURL(url);
  };
  return <button onClick={download} data-testid={`button-download-pdf-${article.slug}`} className={`inline-flex items-center gap-2 ${compact ? 'text-xs' : 'px-5 py-3'} mono uppercase tracking-[.12em] text-[hsl(var(--primary))] transition-colors hover:text-[hsl(var(--accent))]`}><Download size={compact ? 14 : 16} /> {compact ? 'PDF' : 'Download PDF'}</button>;
}

function Header() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const nav = [{ href: '/', label: 'Journal' }, { href: '/current-issue', label: 'Current issue' }, { href: '/archives', label: 'Archives' }];
  return <header className="sticky top-0 z-20 border-b border-[hsl(var(--border))] bg-[hsl(var(--background)/.94)] backdrop-blur-md">
    <div className="mx-auto flex h-[74px] max-w-[1280px] items-center justify-between px-5 md:px-9">
      <Link href="/" onClick={() => setOpen(false)} data-testid="link-logo" className="group flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center border border-[hsl(var(--primary))] text-[hsl(var(--accent))]"><span className="serif text-2xl italic">M</span></span>
        <span><span className="block serif text-xl leading-none tracking-tight">The Meridian Review</span><span className="mono mt-1 block text-[9px] uppercase tracking-[.18em] text-[hsl(var(--muted-foreground))]">Interdisciplinary journal</span></span>
      </Link>
      <nav className="hidden items-center gap-8 md:flex">{nav.map(item => <Link key={item.href} href={item.href} data-testid={`link-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`} className={`nav-link mono text-[11px] uppercase tracking-[.11em] ${location === item.href ? 'active text-[hsl(var(--accent))]' : 'text-[hsl(var(--muted-foreground))]'}`}>{item.label}</Link>)}</nav>
      <div className="hidden items-center gap-4 md:flex"><span className="h-5 w-px bg-[hsl(var(--border))]" /><Link href="/archives" data-testid="link-browse-journal" className="link-arrow inline-flex items-center gap-2 mono text-[10px] uppercase tracking-[.14em]">Browse journal <ArrowRight size={14} /></Link></div>
      <button onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} data-testid="button-toggle-menu" className="md:hidden">{open ? <X size={22} /> : <Menu size={22} />}</button>
    </div>
    {open && <div className="menu-panel border-t border-[hsl(var(--border))] bg-[hsl(var(--card))] px-5 py-5 md:hidden"><nav className="grid gap-4">{nav.map(item => <Link key={item.href} href={item.href} onClick={() => setOpen(false)} data-testid={`link-mobile-${item.label.toLowerCase().replaceAll(' ', '-')}`} className="mono border-b border-[hsl(var(--border))] pb-3 text-xs uppercase tracking-[.12em]">{item.label}</Link>)}</nav></div>}
  </header>;
}

function Footer() {
  return <footer className="mt-24 bg-[hsl(var(--primary))] px-5 py-12 text-[hsl(var(--primary-foreground))] md:px-9"><div className="mx-auto grid max-w-[1280px] gap-12 md:grid-cols-[1.5fr_1fr_1fr]"><div><div className="serif text-3xl italic">The Meridian Review</div><p className="mt-4 max-w-sm text-sm leading-6 text-[hsl(var(--primary-foreground)/.65)]">Research for the space between disciplines. Published from London, read everywhere.</p></div><div><div className="eyebrow text-[hsl(var(--primary-foreground)/.55)]">Explore</div><div className="mt-5 grid gap-3 text-sm"><Link href="/current-issue" data-testid="link-footer-current">Current issue</Link><Link href="/archives" data-testid="link-footer-archives">Archives</Link><Link href="/archives" data-testid="link-footer-about">About the journal</Link></div></div><div><div className="eyebrow text-[hsl(var(--primary-foreground)/.55)]">Volume 18 · Issue 3</div><p className="mt-5 text-sm leading-6 text-[hsl(var(--primary-foreground)/.65)]">Autumn 2024<br />Ways of attending</p><Link href="/current-issue" data-testid="link-footer-read" className="mt-5 inline-flex items-center gap-2 text-sm text-[hsl(var(--accent))]">Read the issue <ArrowRight size={14} /></Link></div></div><div className="mx-auto mt-14 max-w-[1280px] border-t border-[hsl(var(--primary-foreground)/.16)] pt-5 mono text-[10px] uppercase tracking-[.12em] text-[hsl(var(--primary-foreground)/.42)]">© 2024 The Meridian Review · ISSN 2754-0182</div></footer>;
}

function Shell({ children }: { children: ReactNode }) { return <div className="paper-grain min-h-[100dvh]"><Header />{children}<Footer /></div>; }

function IssueMark({ issue = currentIssue, large = false }: { issue?: Issue; large?: boolean }) {
  return <div className={`relative overflow-hidden bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] ${large ? 'min-h-[440px] p-7 md:p-10' : 'min-h-[190px] p-5'}`}><div className="absolute -right-10 -top-20 h-64 w-64 rounded-full border-[18px] border-[hsl(var(--accent)/.55)]" /><div className="absolute -bottom-16 -left-12 h-48 w-48 rounded-full border border-[hsl(var(--primary-foreground)/.24)]" /><div className="relative flex h-full flex-col justify-between"><div className="flex justify-between"><span className="eyebrow text-[hsl(var(--primary-foreground)/.62)]">The Meridian Review</span><span className="mono text-[10px] text-[hsl(var(--primary-foreground)/.62)]">Vol. {issue.volume} · No. {issue.number}</span></div><div><div className={`serif italic ${large ? 'text-6xl md:text-8xl' : 'text-5xl'}`}>{issue.season.split(' ')[0]}</div><div className="mt-2 max-w-[220px] text-sm leading-5 text-[hsl(var(--primary-foreground)/.65)]">{issue.theme}</div></div><div className="flex items-end justify-between"><span className="mono text-[10px] uppercase tracking-[.14em] text-[hsl(var(--primary-foreground)/.55)]">{issue.date}</span><span className="serif text-4xl">{String(issue.number).padStart(2, '0')}</span></div></div></div>;
}

function ArticleRow({ article, featured = false }: { article: Article; featured?: boolean }) {
  return <article className={`article-row reveal group border-t border-[hsl(var(--border))] ${featured ? 'py-8 md:py-10' : 'py-6'}`} data-testid={`article-card-${article.slug}`}><Link href={`/article/${article.slug}`} data-testid={`link-article-${article.slug}`} className="grid gap-4 md:grid-cols-[90px_1fr_auto] md:items-start"><div className="mono text-[10px] uppercase tracking-[.12em] text-[hsl(var(--accent))]">{article.section}</div><div><h3 className={`serif leading-[.98] transition-colors group-hover:text-[hsl(var(--accent))] ${featured ? 'text-4xl md:text-5xl' : 'text-3xl'}`}>{article.title}</h3><p className="mt-3 max-w-2xl text-sm leading-6 text-[hsl(var(--muted-foreground))]">{article.deck}</p><p className="mt-4 text-xs">{article.authors.join(' · ')}</p></div><div className="flex items-center justify-between gap-5 md:block md:text-right"><span className="mono text-[10px] text-[hsl(var(--muted-foreground))]">{article.pages}</span><ArrowRight className="text-[hsl(var(--accent))] transition-transform group-hover:translate-x-1 md:ml-auto md:mt-7" size={18} /></div></Link></article>;
}

function Home() {
  return <Shell><main><section className="mx-auto grid max-w-[1280px] gap-12 px-5 pb-20 pt-16 md:grid-cols-[1.15fr_.85fr] md:items-end md:px-9 md:pb-28 md:pt-24"><div className="reveal"><div className="eyebrow">Issue 18 · Autumn 2024</div><h1 className="serif mt-7 max-w-3xl text-[4.5rem] leading-[.84] tracking-[-.04em] md:text-[8.5rem]">The work<br /><em>of noticing.</em></h1><p className="mt-8 max-w-xl text-lg leading-7 text-[hsl(var(--muted-foreground))] md:text-xl">The Meridian Review is a journal for research that changes how we see the familiar. Our latest issue asks what it means to pay attention — to a river, a city, a margin, a season.</p><div className="mt-9 flex flex-wrap items-center gap-6"><Link href="/current-issue" data-testid="link-read-current" className="link-arrow inline-flex items-center gap-3 bg-[hsl(var(--accent))] px-5 py-3 mono text-[10px] uppercase tracking-[.14em] text-[hsl(var(--accent-foreground))]">Read the current issue <ArrowRight size={15} /></Link><Link href="/archives" data-testid="link-explore-archives" className="link-arrow inline-flex items-center gap-2 mono text-[10px] uppercase tracking-[.14em]">Explore the archive <ArrowDown size={15} /></Link></div></div><div className="reveal delay-2 mx-auto w-full max-w-[360px] md:justify-self-end"><div className="cover-art rotate-[-5deg] shadow-[18px_22px_0_hsl(var(--accent)/.2)]"><IssueMark large /></div><p className="mt-8 mono text-[10px] uppercase tracking-[.12em] text-[hsl(var(--muted-foreground))]">A quarterly journal of ideas, evidence, and the world in between.</p></div></section><div className="border-y border-[hsl(var(--border))] bg-[hsl(var(--secondary)/.55)]"><div className="mx-auto grid max-w-[1280px] gap-8 px-5 py-8 md:grid-cols-3 md:px-9"><div><div className="eyebrow">The journal</div><p className="mt-3 max-w-xs text-sm leading-6">We publish scholarship with a strong point of view, across the humanities, social sciences, and public life.</p></div><div><div className="eyebrow">Since 2007</div><p className="mt-3 max-w-xs text-sm leading-6">Independent, peer-reviewed, and committed to taking ideas beyond their usual borders.</p></div><div><div className="eyebrow">Now reading</div><p className="mt-3 max-w-xs text-sm leading-6">A river as archive. A city before it is built. The ethics of looking closely.</p></div></div></div><section className="mx-auto max-w-[1280px] px-5 py-20 md:px-9 md:py-28"><div className="mb-10 flex items-end justify-between"><div><div className="eyebrow">From the current issue</div><h2 className="serif mt-3 text-5xl md:text-6xl">Selected reading</h2></div><Link href="/current-issue" data-testid="link-see-all-current" className="link-arrow hidden items-center gap-2 mono text-[10px] uppercase tracking-[.13em] md:inline-flex">View all <ArrowRight size={14} /></Link></div><div>{currentIssue.articles.slice(0, 3).map((article, i) => <ArticleRow key={article.slug} article={article} featured={i === 0} />)}</div><Link href="/current-issue" data-testid="link-see-all-mobile" className="mt-8 inline-flex items-center gap-2 mono text-[10px] uppercase tracking-[.13em] md:hidden">View all articles <ArrowRight size={14} /></Link></section><section className="bg-[hsl(var(--primary))] px-5 py-20 text-[hsl(var(--primary-foreground))] md:px-9 md:py-28"><div className="mx-auto grid max-w-[1280px] gap-12 md:grid-cols-[.8fr_1.2fr] md:items-center"><div><div className="eyebrow text-[hsl(var(--accent))]">A living archive</div><h2 className="serif mt-4 max-w-lg text-5xl leading-[.95] md:text-7xl">Stay with an idea for a while.</h2></div><div className="md:pl-16"><p className="max-w-xl text-lg leading-8 text-[hsl(var(--primary-foreground)/.66)]">Browse eighteen volumes of essays, research articles, forums, and reviews. Every piece remains open to return to, with the context of its issue intact.</p><Link href="/archives" data-testid="link-enter-archive" className="link-arrow mt-8 inline-flex items-center gap-3 border-b border-[hsl(var(--accent))] pb-2 mono text-[10px] uppercase tracking-[.14em] text-[hsl(var(--accent))]">Enter the archive <ArrowRight size={15} /></Link></div></div></section></main></Shell>;
}

function IssuePage() {
  return <Shell><main className="mx-auto max-w-[1280px] px-5 py-14 md:px-9 md:py-20"><div className="reveal"><div className="eyebrow">Latest publication</div><div className="mt-5 flex flex-wrap items-end justify-between gap-6 border-b border-[hsl(var(--border))] pb-8"><div><h1 className="serif text-6xl leading-none md:text-8xl">Volume 18,<br /><em>Issue 3.</em></h1><p className="mt-5 text-lg text-[hsl(var(--muted-foreground))]">Autumn 2024 · Ways of attending</p></div><div className="mono text-right text-[10px] uppercase tracking-[.13em] text-[hsl(var(--muted-foreground))]">Published<br />14 September 2024</div></div></div><div className="grid gap-14 py-12 md:grid-cols-[.42fr_1fr] md:py-16"><div className="reveal delay-1"><IssueMark issue={currentIssue} /><Link href="/archives" data-testid="link-back-archives" className="mt-5 inline-flex items-center gap-2 mono text-[10px] uppercase tracking-[.13em] text-[hsl(var(--muted-foreground))]"><ArrowLeft size={14} /> All archives</Link></div><div><div className="mb-7 flex items-center justify-between"><div className="eyebrow">In this issue · 04 articles</div><span className="mono text-[10px] text-[hsl(var(--muted-foreground))]">ISSN 2754-0182</span></div>{currentIssue.articles.map(article => <ArticleRow key={article.slug} article={article} />)}</div></div></main></Shell>;
}

function Archives() {
  const [query, setQuery] = useState('');
  const [volume, setVolume] = useState('all');
  const [expanded, setExpanded] = useState<number | null>(18);
  const filtered = useMemo(() => issues.map(issue => ({ ...issue, articles: issue.articles.filter(a => `${a.title} ${a.authors.join(' ')} ${a.keywords.join(' ')}`.toLowerCase().includes(query.toLowerCase())) })).filter(issue => volume === 'all' || String(issue.volume) === volume), [query, volume]);
  return <Shell><main className="mx-auto max-w-[1280px] px-5 py-14 md:px-9 md:py-20"><div className="reveal grid gap-8 border-b border-[hsl(var(--border))] pb-12 md:grid-cols-[1fr_.65fr] md:items-end"><div><div className="eyebrow">The collection</div><h1 className="serif mt-5 text-7xl leading-[.88] md:text-9xl">The<br /><em>archive.</em></h1></div><p className="max-w-md text-lg leading-7 text-[hsl(var(--muted-foreground))]">Four issues a year, eighteen volumes of research that keeps its questions open. Find a place to begin.</p></div><div className="mt-10 flex flex-col gap-4 border-b border-[hsl(var(--border))] pb-6 md:flex-row md:items-center md:justify-between"><label className="relative block w-full md:max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" size={16} /><input value={query} onChange={e => setQuery(e.target.value)} data-testid="input-search-archive" placeholder="Search titles, authors, keywords" className="w-full border-b border-[hsl(var(--border))] bg-transparent py-3 pl-10 pr-3 text-sm outline-none placeholder:text-[hsl(var(--muted-foreground))] focus:border-[hsl(var(--accent))]" /></label><div className="flex items-center gap-3"><span className="mono text-[10px] uppercase tracking-[.12em] text-[hsl(var(--muted-foreground))]">Filter volume</span><select value={volume} onChange={e => setVolume(e.target.value)} data-testid="select-filter-volume" className="border border-[hsl(var(--border))] bg-transparent px-3 py-2 text-sm outline-none"><option value="all">All volumes</option><option value="18">Volume 18</option><option value="17">Volume 17</option></select></div></div><div className="mt-10">{filtered.map(issue => <section key={`${issue.volume}-${issue.number}`} className="border-b border-[hsl(var(--border))]"><button onClick={() => setExpanded(expanded === issue.volume * 10 + issue.number ? null : issue.volume * 10 + issue.number)} data-testid={`button-toggle-issue-${issue.volume}-${issue.number}`} className="flex w-full items-center justify-between py-7 text-left"><span><span className="eyebrow">Volume {issue.volume}</span><span className="serif ml-4 text-4xl md:text-5xl">{issue.season}</span><span className="ml-3 mono text-[10px] text-[hsl(var(--muted-foreground))]">No. {issue.number}</span></span><ChevronDown size={20} className={`transition-transform ${expanded === issue.volume * 10 + issue.number ? 'rotate-180' : ''}`} /></button>{expanded === issue.volume * 10 + issue.number && <div className="pb-7 pl-0 md:pl-20">{issue.articles.length ? issue.articles.map(article => <ArticleRow key={article.slug} article={article} />) : <div className="border-l-2 border-[hsl(var(--accent))] px-5 py-6 text-sm text-[hsl(var(--muted-foreground))]">No articles match your search in this issue.</div>}</div>}</section>)}{filtered.length === 0 && <div className="py-24 text-center"><BookOpen className="mx-auto text-[hsl(var(--accent))]" size={30} /><h2 className="serif mt-5 text-4xl">Nothing found yet.</h2><p className="mt-3 text-sm text-[hsl(var(--muted-foreground))]">Try a different title, author, or keyword.</p><button onClick={() => { setQuery(''); setVolume('all'); }} data-testid="button-clear-archive-filter" className="mt-6 border-b border-[hsl(var(--accent))] pb-1 mono text-[10px] uppercase tracking-[.12em]">Clear filters</button></div>}</div></main></Shell>;
}

function ArticlePage() {
  const [, params] = useRoute('/article/:slug');
  const article = articles.find(item => item.slug === params?.slug);
  if (!article) return <Shell><main className="mx-auto max-w-3xl px-5 py-28 text-center"><div className="eyebrow">Article unavailable</div><h1 className="serif mt-5 text-6xl">We could not find that article.</h1><Link href="/archives" data-testid="link-article-not-found" className="mt-8 inline-flex items-center gap-2 border-b border-[hsl(var(--accent))] pb-2 mono text-[10px] uppercase tracking-[.13em]">Return to archives <ArrowRight size={14} /></Link></main></Shell>;
  return <Shell><main><div className="bg-[hsl(var(--primary))] px-5 py-16 text-[hsl(var(--primary-foreground))] md:px-9 md:py-24"><div className="mx-auto max-w-[1120px]"><Link href={article.volume === 18 && article.issueNumber === 3 ? '/current-issue' : '/archives'} data-testid="link-article-back" className="mb-16 inline-flex items-center gap-2 mono text-[10px] uppercase tracking-[.13em] text-[hsl(var(--primary-foreground)/.6)]"><ArrowLeft size={14} /> {article.volume === 18 && article.issueNumber === 3 ? 'Current issue' : 'Archive'}</Link><div className="eyebrow text-[hsl(var(--accent))]">{article.section} · {article.issue}</div><h1 className="serif mt-7 max-w-5xl text-6xl leading-[.9] md:text-9xl">{article.title}</h1><p className="mt-8 max-w-2xl text-xl leading-8 text-[hsl(var(--primary-foreground)/.68)]">{article.deck}</p><div className="mt-12 grid gap-4 border-t border-[hsl(var(--primary-foreground)/.16)] pt-5 text-sm md:grid-cols-2"><div><span className="eyebrow text-[hsl(var(--primary-foreground)/.46)]">By</span><p className="mt-2">{article.authors.join(' · ')}</p><p className="mt-1 text-[hsl(var(--primary-foreground)/.56)]">{article.affiliation}</p></div><div className="md:text-right"><span className="eyebrow text-[hsl(var(--primary-foreground)/.46)]">Published</span><p className="mt-2">{article.published}</p><p className="mt-1 text-[hsl(var(--primary-foreground)/.56)]">Volume {article.volume}, Issue {article.issueNumber} · pp. {article.pages}</p></div></div></div></div><div className="mx-auto grid max-w-[1120px] gap-14 px-5 py-16 md:grid-cols-[1fr_280px] md:px-9 md:py-24"><article><div className="eyebrow">Abstract</div><p className="serif mt-6 text-3xl leading-[1.25] md:text-4xl">{article.abstract}</p><div className="mt-16 border-t border-[hsl(var(--border))] pt-7"><div className="eyebrow">Keywords</div><div className="mt-4 flex flex-wrap gap-2">{article.keywords.map(keyword => <span key={keyword} data-testid={`keyword-${keyword}`} className="border border-[hsl(var(--border))] px-3 py-2 mono text-[10px] uppercase tracking-[.08em] text-[hsl(var(--muted-foreground))]">{keyword}</span>)}</div></div></article><aside className="md:border-l md:border-[hsl(var(--border))] md:pl-8"><div className="sticky top-28"><div className="eyebrow">Article details</div><dl className="mt-5 grid gap-5 text-sm"><div><dt className="text-[hsl(var(--muted-foreground))]">Publication date</dt><dd className="mt-1">{article.published}</dd></div><div><dt className="text-[hsl(var(--muted-foreground))]">Citation</dt><dd className="mt-1 leading-6">{article.authors[0].split(' ').pop()}, {article.authors.length > 1 ? 'et al.' : ''} “{article.title}.” <em>The Meridian Review</em>, {article.volume}.{article.issueNumber} ({article.published.slice(-4)}): {article.pages}.</dd></div><div><dt className="text-[hsl(var(--muted-foreground))]">DOI</dt><dd className="mt-1 mono text-xs">10.48211/tmr.{article.volume}.{article.issueNumber}.{article.slug.split('-')[0]}</dd></div></dl><div className="mt-9 border-t border-[hsl(var(--border))] pt-5"><DownloadPdf article={article} /><p className="mt-3 text-xs leading-5 text-[hsl(var(--muted-foreground))]">Download a reader-friendly PDF of this article.</p></div></div></aside></div><div className="border-t border-[hsl(var(--border))] bg-[hsl(var(--secondary)/.55)] px-5 py-12 md:px-9"><div className="mx-auto flex max-w-[1120px] items-center justify-between gap-6"><div><div className="eyebrow">Continue reading</div><p className="serif mt-2 text-3xl">More from {article.issue}</p></div><Link href={article.volume === 18 && article.issueNumber === 3 ? '/current-issue' : '/archives'} data-testid="link-article-continue" className="link-arrow inline-flex shrink-0 items-center gap-2 mono text-[10px] uppercase tracking-[.12em]">View issue <ArrowRight size={14} /></Link></div></div></main></Shell>;
}

function Router() {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}><Switch><Route path="/" component={Home} /><Route path="/current-issue" component={IssuePage} /><Route path="/archives" component={Archives} /><Route path="/article/:slug" component={ArticlePage} /><Route component={NotFound} /></Switch></ErrorBoundary>;
}
function App() { return <QueryClientProvider client={queryClient}><TooltipProvider><Router /><Toaster /></TooltipProvider></QueryClientProvider>; }
export default App;