import { PAGE_REMOTE_PROFILE, PAGE_LOCAL_PROFILE } from "~/feature/page-path";
import MockActionButton from "~/component/MockActionButton";
import MockCenteringLayout from "~/component/MockCenteringLayout";

const TopScene = () => {
  return (
    <MockCenteringLayout>
      <div>
        <p>hinagata-next</p>
        <p>
          <MockActionButton
            action={{ type: "page-link", page: PAGE_LOCAL_PROFILE }}
          >
            リストサンプル（メモリ保存）
          </MockActionButton>
        </p>
        <p>
          <MockActionButton
            action={{ type: "page-link", page: PAGE_REMOTE_PROFILE }}
          >
            リストサンプル（DB保存）
          </MockActionButton>
        </p>
      </div>
    </MockCenteringLayout>
  );
};

export default TopScene;
