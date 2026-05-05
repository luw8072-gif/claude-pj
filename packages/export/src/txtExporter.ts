import type { Novel, Volume, Chapter } from '@novel-writer/core';

export interface ExportResult {
  success: boolean;
  filePath?: string;
  error?: string;
}

export async function exportTxt(
  novel: Novel,
  volumes: Volume[],
  chaptersByVolume: Record<string, Chapter[]>,
  outputDir: string
): Promise<ExportResult> {
  try {
    const fs = await import('fs');
    const path = await import('path');

    const lines: string[] = [];
    lines.push(novel.title);
    lines.push(`作者：${novel.author || '未设置'}`);
    lines.push('');
    lines.push(novel.description);
    lines.push('='.repeat(40));
    lines.push('');

    for (const vol of volumes) {
      lines.push('');
      lines.push(vol.title);
      lines.push('-'.repeat(20));
      lines.push('');

      const chs = chaptersByVolume[vol.id] || [];
      for (const ch of chs) {
        lines.push(ch.title);
        lines.push('');
        const text = ch.content
          .replace(/<[^>]+>/g, '')
          .replace(/&nbsp;/g, ' ')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"');
        lines.push(text);
        lines.push('');
      }
    }

    const sanitizedTitle = novel.title.replace(/[<>:"/\\|?*]/g, '_');
    const filePath = path.join(outputDir, `${sanitizedTitle}.txt`);
    fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');

    return { success: true, filePath };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}
