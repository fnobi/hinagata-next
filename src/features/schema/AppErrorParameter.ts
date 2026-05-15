import type FirebaseErrorParameter from "~/common/schema/FirebaseErrorParameter";

export type AppErrorParameter =
  | {
      type: "unknown";
    }
  | {
      type: "unauthorized";
    }
  | {
      type: "bad-parameter";
    }
  | {
      type: "fail-to-google-auth";
    }
  | {
      type: "error-in-transaction";
    }
  | FirebaseErrorParameter;
