import PageEntry from "~/common/lib/PageEntry";

describe("PageEntry", () => {
  const topPage = new PageEntry("https://example.com");
  it("make root page", () => {
    expect(topPage.href).toEqual("/");
    expect(topPage.url).toEqual("https://example.com/");
  });
  it("make sub page", () => {
    const aboutPage = topPage.child("about");
    expect(aboutPage.href).toEqual("/about/");
    expect(aboutPage.url).toEqual("https://example.com/about/");
  });
  it("make child static paths", () => {
    const paths = ["a", "b", "c"].map(id => topPage.child(id).basePath);
    expect(paths).toEqual(["/a", "/b", "/c"]);
  });
  it("assert segment", () => {
    expect(() => new PageEntry("https://example.com/")).toThrow();
    expect(() => new PageEntry("https://example.com", "hoge/")).toThrow();
    expect(() => topPage.child("/hoge")).toThrow();
    expect(() => topPage.child("hoge/")).toThrow();
  });
});
