export default class PageEntry {
  private baseUrl: string;

  private basePath: string;

  public readonly href: string;

  public readonly url: string;

  public constructor(baseUrl: string, path: string = "") {
    this.baseUrl = PageEntry.normalizeSegment(baseUrl);
    this.basePath = PageEntry.normalizeBasePath(path);
    this.href = PageEntry.normalizeHref(this.basePath);
    this.url = this.baseUrl + this.href;
  }

  private static normalizeSegment(p: string) {
    return p.replace(/^\//, "").replace(/\/$/, "");
  }

  private static normalizeBasePath(p: string) {
    return /^\//.test(p) ? p : `/${p}`;
  }

  private static normalizeHref(p: string) {
    return /\/$/.test(p) ? p : `${p}/`;
  }

  public child(id: string) {
    return new PageEntry(
      this.baseUrl,
      this.href + PageEntry.normalizeSegment(id)
    );
  }

  public childStaticPaths(ids: string[]) {
    return ids.map(id => this.child(id).basePath);
  }
}
