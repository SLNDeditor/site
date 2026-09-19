// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';
import remarkFootnotes from 'remark-footnotes';

// Ouvre tous les liens externes (http/https) dans un nouvel onglet.
// Concerne notamment les liens « Lire l'article » de la revue de presse
// et les liens vers les PDF des revues NADA.
function rehypeExternalLinksNewTab() {
	return (tree) => {
		const walk = (node) => {
			if (node.type === 'element' && node.tagName === 'a') {
				const href = node.properties && node.properties.href;
				if (typeof href === 'string' && /^https?:\/\//i.test(href)) {
					node.properties.target = '_blank';
					node.properties.rel = 'noopener noreferrer';
				}
			}
			if (node.children) node.children.forEach(walk);
		};
		walk(tree);
	};
}

// Ajoute des classes CSS et des data attributes aux notes de bas de page
// pour faciliter la stylisation et les interactions JavaScript
function rehypeFootnotesCustom() {
	return (tree) => {
		const walk = (node) => {
			// Ajoute la classe 'footnote-anchor' aux liens de note de bas de page
			if (
				node.type === 'element' &&
				node.tagName === 'a' &&
				node.properties &&
				node.properties.href &&
				typeof node.properties.href === 'string' &&
				node.properties.href.startsWith('#user-content-fn-')
			) {
				// C'est un lien vers une note de bas de page
				node.properties.className = node.properties.className || [];
				if (!Array.isArray(node.properties.className)) {
					node.properties.className = [node.properties.className];
				}
				node.properties.className.push('footnote-anchor');
				// Extrait le numéro de la note
				const match = node.properties.href.match(/fn-(\d+)/);
				if (match) {
					node.properties['data-footnote'] = match[1];
				}
			}

			// Ajoute la classe 'footnote-section' à la section de notes de bas de page
			if (node.type === 'element' && node.tagName === 'section' && node.properties && node.properties.dataFootnotes) {
				node.properties.className = node.properties.className || [];
				if (!Array.isArray(node.properties.className)) {
					node.properties.className = [node.properties.className];
				}
				node.properties.className.push('footnote-section');
			}

			if (node.children) node.children.forEach(walk);
		};
		walk(tree);
	};
}

// https://astro.build/config
export default defineConfig({
	site: 'https://zaliasekai.netlify.app',
	integrations: [mdx(), sitemap()],
	markdown: {
		remarkPlugins: [remarkFootnotes],
		rehypePlugins: [rehypeExternalLinksNewTab, rehypeFootnotesCustom],
	},
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'Atkinson',
			cssVariable: '--font-atkinson',
			fallbacks: ['sans-serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/atkinson-regular.woff'],
						weight: 400,
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/atkinson-bold.woff'],
						weight: 700,
						style: 'normal',
						display: 'swap',
					},
				],
			},
		},
	],
});
