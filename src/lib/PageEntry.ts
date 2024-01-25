class PageEntry<
  T extends string = string,
  Q extends Record<string, string> = {}
> {
  private baseUrl: string;

  public readonly basePath: string;

  private query: URLSearchParams | null;

  public constructor(
    url: string,
    path: string = "",
    query: URLSearchParams | null = null
  ) {
    if (!/^https?:\/\/.+[^/]$/.test(url)) {
      throw new Error(`invalid url format: ${url}`);
    }
    if ((path && !/^\//.test(path)) || /\/$/.test(path)) {
      throw new Error(`invalid path format: ${path}`);
    }
    this.baseUrl = url;
    this.basePath = path;
    this.query = query;
  }

  public get href() {
    const qs = this.query ? `?${this.query.toString()}` : "";
    return [this.basePath, qs].join("/");
  }

  public get url() {
    return this.baseUrl + this.href;
  }

  public child<TT extends string, QQ extends Record<string, string>>(id: T) {
    if (!id || /^\//.test(id)) {
      throw new Error(`invalid id format: ${id}`);
    }
    return new PageEntry<TT, QQ>(this.baseUrl, [this.basePath, id].join("/"));
  }

  public withQuery(q: Q) {
    return new PageEntry<T>(
      this.baseUrl,
      this.basePath,
      new URLSearchParams(q)
    );
  }

  public static makeStaticPaths<TT extends string>(
    page: PageEntry<TT>,
    arr: TT[]
  ) {
    return arr.map(id => page.child(id).basePath);
  }
}

export default PageEntry;
