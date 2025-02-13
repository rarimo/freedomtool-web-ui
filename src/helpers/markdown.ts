export function markdownToPlainText(markdown: string): string {
  return (
    markdown
      // Replace headings
      .replace(/^(#+\s)/gm, '')
      // Replace links
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      // Replace bold text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      // Replace italic text
      .replace(/\*(.*?)\*/g, '$1')
      // Remove new lines
      .replace(/\n/g, ' ')
      .trim()
  )
}
