import MockPopup from "~/common/components/MockPopup";
import { type AppErrorParameter } from "~/features/schema/AppErrorParameter";

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
