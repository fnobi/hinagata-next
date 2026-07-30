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
  | {
      type: "not-found";
    }
  | {
      type: "admin-permission-error";
    }
  | {
      type: "crash-in-register-score";
    };
