import { useCallback, useState } from "react";
import { extractFirebaseError } from "~/common/FirebaseErrorParameter";
import { extractAppError } from "~/feature/AppError";
import { type AppErrorParameter } from "~/feature/AppErrorParameter";

const useAsyncHandler = ({
  onError
}: {
  onError: (e: AppErrorParameter) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const runAsyncHandler = useCallback(
    async (fn: () => Promise<unknown>) => {
      setIsLoading(true);
      await fn().catch(err => {
        const firebaseError = extractFirebaseError(err);
        onError(
          firebaseError.type === "firestore-unknown-error"
            ? extractAppError(err)
            : firebaseError
        );
      });
      setIsLoading(false);
    },
    [onError]
  );

  return { isLoading, runAsyncHandler };
};

export default useAsyncHandler;
