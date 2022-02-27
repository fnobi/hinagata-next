export default class PageEntry {
  private baseUrl: string;

  private basePath: string;

  public readonly href: string;

  public readonly url: string;

  public constructor(url: string, path: string = "") {
    if (!/^https?:\/\/.+[^/]$/.test(url)) {
      throw new Error(`invalid url format: ${url}`);
    }
    if ((path && !/^\//.test(path)) || /\/$/.test(path)) {
      throw new Error(`invalid path format: ${path}`);
    }
    this.baseUrl = url;
    this.basePath = path;
    this.href = `${path}/`;
    this.url = this.baseUrl + this.href;
  }

  public child(id: string) {
    if (!id || /^\//.test(id)) {
      throw new Error(`invalid id format: ${id}`);
    }
    return new PageEntry(this.baseUrl, this.href + id);
  }

  public childStaticPaths(ids: string[]) {
    return ids.map(id => this.child(id).basePath);
  }
}
