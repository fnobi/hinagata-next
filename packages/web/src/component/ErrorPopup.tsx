import MockPopup from "~/component/MockPopup";
import { type AppErrorParameter } from "~/feature/AppErrorParameter";

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
