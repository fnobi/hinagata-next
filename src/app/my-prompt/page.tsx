import { makeSubPageMetadata } from "~/features/lib/defaultMetadata";
import { PAGE_MY_PROMPT } from "~/features/lib/page-path";
import MyPromptScene from "~/features/components/MyPromptScene";

export const metadata = makeSubPageMetadata({
  page: PAGE_MY_PROMPT,
  subPageTitle: "お気に入りプロンプト"
});

const PageMyPrompt = () => <MyPromptScene />;

export default PageMyPrompt;
