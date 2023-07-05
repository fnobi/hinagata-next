class PageEntry<T extends string = string> {
  private baseUrl: string;

  public readonly basePath: string;

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

  public child<TT extends string>(id: T) {
    if (!id || /^\//.test(id)) {
      throw new Error(`invalid id format: ${id}`);
    }
    return new PageEntry<TT>(this.baseUrl, this.href + id);
  }

  public static makeStaticPaths<TT extends string>(
    page: PageEntry<TT>,
    arr: TT[]
  ) {
    return arr.map(id => page.child(id).basePath);
  }
}

export default PageEntry;
