import { PAGE_MOCK_PROFILE } from "~/feature/page-path";
import MockActionButton from "~/component/MockActionButton";
import MockCenteringLayout from "~/component/MockCenteringLayout";

const TopScene = () => (
  <MockCenteringLayout>
    <div>
      <p>hinagata-next</p>
      <p>
        <MockActionButton
          action={{ type: "page-link", page: PAGE_MOCK_PROFILE }}
        >
          リストサンプル
        </MockActionButton>
      </p>
    </div>
  </MockCenteringLayout>
);

export default TopScene;
