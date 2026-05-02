import MockCenteringLayout from "~/common/components/MockCenteringLayout";
import { type AppErrorParameter } from "~/features/schema/AppErrorParameter";

const ErrorScene = ({ error }: { error: AppErrorParameter }) => {
  return (
    <MockCenteringLayout>
      <div>
        <p>ERROR:</p>
        {error.type}
      </div>
    </MockCenteringLayout>
  );
};

export default ErrorScene;
