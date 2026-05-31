import { type AppErrorParameter } from "~/feature/AppErrorParameter";
import MockPopup from "~/component/MockPopup";

const ErrorPopup = ({
  error,
  onClose
}: {
  error: AppErrorParameter;
  onClose: () => void;
}) => {
  return (
    <MockPopup onClose={onClose}>
      <div>
        <p>ERROR:</p>
        {error.type}
      </div>
    </MockPopup>
  );
};

export default ErrorPopup;
