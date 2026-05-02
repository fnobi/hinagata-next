import { makeSubPageMetadata } from "~/features/lib/defaultMetadata";
import { PAGE_TOP } from "~/features/lib/page-path";
import ProfileFormScene from "~/features/components/ProfileFormScene";

export const metadata = makeSubPageMetadata({
  page: PAGE_TOP,
  subPageTitle: "profile form"
});

const PageMyPrompt = () => <ProfileFormScene />;

export default PageMyPrompt;
