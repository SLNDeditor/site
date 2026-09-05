// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

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

// https://astro.build/config
export default defineConfig({
	site: 'https://zaliasekai.netlify.app',
	integrations: [mdx(), sitemap()],
	markdown: {
		rehypePlugins: [rehypeExternalLinksNewTab],
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
