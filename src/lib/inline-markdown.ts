import { createMarkdownProcessor } from '@astrojs/markdown-remark';

// Le chapeau (« lead ») est saisi en markdown restreint dans le CMS
// (gras, italique, citation). Il vit dans le frontmatter, donc Astro ne le
// rend pas tout seul : on le passe par le même moteur markdown que le corps
// du texte, une seule fois pour tout le build.
let processor: Awaited<ReturnType<typeof createMarkdownProcessor>> | null = null;

export async function renderInlineMarkdown(source: string | undefined): Promise<string> {
	const text = (source ?? '').trim();
	if (!text) return '';
	processor ??= await createMarkdownProcessor({});
	const { code } = await processor.render(text);
	return code;
}
