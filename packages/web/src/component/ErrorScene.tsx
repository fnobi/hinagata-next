import { type AppErrorParameter } from "~/feature/AppErrorParameter";
import MockCenteringLayout from "~/component/MockCenteringLayout";

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
