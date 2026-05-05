import { Extension } from '@tiptap/core';

export interface WordCountOptions {
  onUpdate: (wordCount: number, charCount: number) => void;
}

export const WordCount = Extension.create<WordCountOptions>({
  name: 'wordCount',

  addOptions() {
    return {
      onUpdate: () => {},
    };
  },

  onUpdate() {
    const text = this.editor.state.doc.textContent;
    const charCount = text.replace(/\s/g, '').length;
    const wordCount = charCount; // For Chinese, word count = character count
    this.options.onUpdate(wordCount, charCount);
  },
});
