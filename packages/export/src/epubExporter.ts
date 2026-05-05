import type { Novel, Volume, Chapter } from '@novel-writer/core';
import type { ExportResult } from './txtExporter.js';

export async function exportEpub(
  novel: Novel,
  volumes: Volume[],
  chaptersByVolume: Record<string, Chapter[]>,
  outputDir: string
): Promise<ExportResult> {
  try {
    const path = await import('path');

    const content: Array<{ title: string; data: string }> = [];

    for (const vol of volumes) {
      const chs = chaptersByVolume[vol.id] || [];
      for (const ch of chs) {
        content.push({
          title: ch.title,
          data: `<h1>${ch.title}</h1>${ch.content || '<p></p>'}`,
        });
      }
    }

    const sanitizedTitle = novel.title.replace(/[<>:"/\\|?*]/g, '_');
    const filePath = path.join(outputDir, `${sanitizedTitle}.epub`);

    // Dynamic import of epub-gen
    const EpubGen = await import('epub-gen');
    const Epub = EpubGen.default || EpubGen;

    const option = {
      title: novel.title,
      author: novel.author || '未知作者',
      description: novel.description || '',
      publisher: '长篇写作',
      output: filePath,
      lang: 'zh-CN',
      content,
    };

    const instance = new Epub(option);
    await instance.promise;

    return { success: true, filePath };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}
