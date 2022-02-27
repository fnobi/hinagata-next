import PageEntry from "../PageEntry";

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
    const paths = topPage.childStaticPaths(["a", "b", "c"]);
    expect(paths).toEqual(["/a", "/b", "/c"]);
  });
  it("normalize path", () => {
    const page = new PageEntry("https://example.com/", "/");
    expect(page.href).toEqual("/");
    expect(page.url).toEqual("https://example.com/");
    expect(page.childStaticPaths(["/d"])).toEqual(["/d"]);
  });
});
