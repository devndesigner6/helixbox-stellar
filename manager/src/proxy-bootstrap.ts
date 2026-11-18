export function bootstrapConfiguredProxies(urls: string[], password: string, insert: (url: string, password: string) => unknown): void {
  if (password && urls.length > 1) throw new Error('A bootstrap password can only configure one proxy');
  for (const url of urls) insert(url, password);
}
