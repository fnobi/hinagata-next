import { makeSubPageMetadata } from "~/features/lib/defaultMetadata";
import { PAGE_MY_PROMPT } from "~/features/lib/page-path";
import MyPromptScene from "~/features/components/MyPromptScene";

export const metadata = makeSubPageMetadata({
  page: PAGE_MY_PROMPT,
  subPageTitle: "保存したプロンプト"
});

const PageMyPrompt = () => <MyPromptScene />;

export default PageMyPrompt;
