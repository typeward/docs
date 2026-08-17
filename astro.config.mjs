// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator';

// https://astro.build/config
export default defineConfig({
	site: 'https://docs.typeward.com',
	// Pages removed in the open-source overhaul: settings sync via account no
	// longer exists (cloud sync replaced it) and there are no tiers to compare.
	redirects: {
		'/account/settings-sync/': '/projects/cloud-sync/',
		'/reference/free-vs-pro/': '/reference/open-source/',
	},
	// Every screenshot is a 2880px-wide 2x capture that never renders wider than
	// about 880 CSS px. Constrained layout makes Astro emit a srcset so a phone
	// is not made to download the retina desktop frame.
	image: {
		layout: 'constrained',
		responsiveStyles: true,
	},
	integrations: [
		starlight({
			title: 'Typeward Docs',
			// The brand mark from app/design_files/icon-kit, background-free: the
			// header has a background of its own, and the tiled build would sit a
			// second surface on top of it. Light and dark are separate artworks
			// rather than an inversion -- the light one deepens the amber so the
			// right arm survives on ivory.
			// Empty alt on purpose: the site title sits right beside it, so a
			// described logo would have a screen reader say the name twice.
			logo: {
				dark: './src/assets/brand/mark-on-dark.svg',
				light: './src/assets/brand/mark-on-light.svg',
				alt: '',
			},
			// The adaptive SVG carries both themes and switches on
			// prefers-color-scheme, exactly as the app's index.html does.
			favicon: '/favicon-adaptive.svg',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/typeward' }],
			editLink: {
				baseUrl: 'https://github.com/typeward/docs/edit/main/',
			},
			customCss: ['./src/styles/custom.css'],
			// Starlight emits twitter:card summary_large_image on every page but
			// provides no image itself; URLs must be absolute for scrapers.
			head: [
				{
					tag: 'meta',
					attrs: { property: 'og:image', content: 'https://docs.typeward.com/og.png' },
				},
				{
					tag: 'meta',
					attrs: { name: 'twitter:image', content: 'https://docs.typeward.com/og.png' },
				},
				// Starlight's `favicon` option emits one link; the rest of the icon
				// kit is declared here. The .ico is the fallback for anything that
				// will not take an SVG, and it carries hand-tuned 16/32/48 builds
				// rather than a downscale of the full artwork.
				{
					tag: 'link',
					attrs: { rel: 'icon', href: '/favicon.ico', sizes: '32x32' },
				},
				{
					tag: 'link',
					attrs: { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
				},
				{
					tag: 'link',
					attrs: { rel: 'manifest', href: '/site.webmanifest' },
				},
				// The pair is the no-JS baseline: the site follows the OS theme
				// until a reader picks one, and a single value would be wrong half
				// the time.
				{
					tag: 'meta',
					attrs: {
						name: 'theme-color',
						media: '(prefers-color-scheme: dark)',
						content: '#0d0c0a',
					},
				},
				{
					tag: 'meta',
					attrs: {
						name: 'theme-color',
						media: '(prefers-color-scheme: light)',
						content: '#f8f4ea',
					},
				},
				// A reader who overrides the OS with Starlight's picker changes
				// data-theme, which no media query can see, so the two metas above
				// would tint the browser chrome the wrong way round. Write the
				// resolved colour into both of them (whichever the media currently
				// matches then carries the right value) and track later changes.
				// The observer is installed before the first read on purpose: this
				// runs ahead of Starlight's provider, so the initial pass may see
				// no data-theme, and the observer corrects it the moment the
				// provider sets one.
				{
					tag: 'script',
					content:
						"(()=>{const p=()=>{const c=document.documentElement.dataset.theme==='light'?'#f8f4ea':'#0d0c0a';" +
						"for(const m of document.querySelectorAll('meta[name=\"theme-color\"]'))m.content=c;};" +
						"new MutationObserver(p).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});p();})()",
				},
			],
			plugins: [starlightLinksValidator()],
			// Publish finished pages only. The full information architecture
			// lives in the plan; groups and pages join the sidebar as their
			// content lands -- no "coming soon" stubs.
			sidebar: [
				{
					label: 'Getting started',
					items: [
						{ label: 'What is Typeward', slug: 'getting-started/what-is-typeward' },
						{ label: 'Install on Windows', slug: 'getting-started/install-windows' },
						{ label: 'Install on macOS', slug: 'getting-started/install-macos' },
						{ label: 'Install on Linux', slug: 'getting-started/install-linux' },
						{ label: 'Your first project', slug: 'getting-started/first-project' },
						{ label: 'LaTeX basics in Typeward', slug: 'getting-started/latex-basics' },
						{ label: 'Typst projects', slug: 'getting-started/typst' },
						{ label: 'Choosing a compile engine', slug: 'getting-started/compile-engines' },
						{ label: 'Importing from Overleaf', slug: 'getting-started/import-from-overleaf' },
						// Contributor-facing, so it sits after the reader path rather than
						// between the last installer and the first tutorial.
						{ label: 'Build from source', slug: 'getting-started/build-from-source' },
					],
				},
				{
					label: 'Editor',
					items: [
						{ label: 'Editor overview', slug: 'editor/overview' },
						{ label: 'Visual editing for LaTeX', slug: 'editor/visual-editing' },
						{ label: 'Autocomplete, snippets, and formatting', slug: 'editor/autocomplete-and-snippets' },
						{ label: 'Labels, references, and navigation', slug: 'editor/latex-navigation' },
						{ label: 'Search, replace, and navigation', slug: 'editor/search-and-navigation' },
						{ label: 'Grammar and spell checking', slug: 'editor/grammar-checking' },
						{ label: 'Focus mode and keybindings', slug: 'editor/focus-and-vim' },
						{ label: 'Editor context menu', slug: 'editor/context-menu' },
						{ label: 'Review comments and TODOs', slug: 'editor/review-comments' },
						{ label: 'Themes and appearance', slug: 'editor/themes' },
					],
				},
				{
					label: 'Compiling',
					items: [
						{ label: 'Compiling LaTeX and reading errors', slug: 'compiling/compiling-latex' },
						{ label: 'Chapter drafts', slug: 'compiling/chapter-drafts' },
						{ label: 'Per-project build configuration', slug: 'compiling/build-configuration' },
					],
				},
				{
					label: 'Preview',
					items: [
						{ label: 'PDF preview', slug: 'preview/pdf-preview' },
						{ label: 'Markdown preview', slug: 'preview/markdown-preview' },
					],
				},
				{
					label: 'Projects & templates',
					items: [
						{ label: 'The projects library', slug: 'projects/library' },
						{ label: 'Files and folders', slug: 'projects/files-and-folders' },
						{ label: 'Project templates', slug: 'projects/templates' },
						{ label: 'Autosave and crash recovery', slug: 'projects/autosave-recovery' },
						{ label: 'Version history', slug: 'projects/version-history' },
						{ label: 'Exporting your work', slug: 'projects/exports' },
					],
				},
				// Citing is a core writing task for this audience, on the same tier as
				// compiling and previewing, so it gets its own group rather than
				// sitting under a heading named for sync.
				{
					label: 'Citations & references',
					items: [
						{ label: 'How references work', slug: 'references/how-references-work' },
						{ label: 'Connecting Zotero, Mendeley, and DOI lookup', slug: 'references/connecting-reference-managers' },
					],
				},
				{
					label: 'Sync & integrations',
					items: [
						{ label: 'Git in Typeward', slug: 'projects/git' },
						{ label: 'Cloud sync with WebDAV', slug: 'projects/cloud-sync' },
						{ label: 'AI assistant', slug: 'ai/overview' },
					],
				},
				{
					label: 'Reference',
					items: [
						{ label: 'Keyboard shortcuts', slug: 'reference/keyboard-shortcuts' },
						{ label: 'Settings reference', slug: 'reference/settings' },
						{ label: 'Data locations, credentials, and uninstall', slug: 'reference/data-locations' },
						{ label: 'Privacy and network behavior', slug: 'reference/privacy-and-network' },
						{ label: 'How updates work', slug: 'reference/updates' },
						{ label: 'Open source and licensing', slug: 'reference/open-source' },
						{ label: 'Glossary', slug: 'reference/glossary' },
					],
				},
				{
					label: 'Troubleshooting & FAQ',
					items: [
						{ label: 'Troubleshooting', slug: 'troubleshooting/troubleshooting' },
						{ label: 'FAQ', slug: 'troubleshooting/faq' },
					],
				},
			],
		}),
	],
});
