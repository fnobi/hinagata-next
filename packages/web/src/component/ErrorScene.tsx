import MockCenteringLayout from "~/component/MockCenteringLayout";
import { type AppErrorParameter } from "~/feature/AppErrorParameter";

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
