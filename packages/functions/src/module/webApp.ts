import { onRequest } from "firebase-functions/v2/https";
import { defineSecret, defineString } from "firebase-functions/params";
import { timingSafeEqual } from "node:crypto";
import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, isAbsolute, join, relative } from "node:path";
import { errorLogger } from "~/lib/logger-helper";

// Value format: "user:pass". Set via `firebase functions:secrets:set BASIC_AUTH_CREDENTIALS`.
const basicAuthCredentials = defineSecret("BASIC_AUTH_CREDENTIALS");

// Set via `packages/functions/.env.{projectId}` (see deploy workflow).
// Must match the directory `scripts/prepare-firebase-deploy.js` copies the hosting build into.
const publicDirName = defineString("FUNCTIONS_PUBLIC_DIR_NAME", {
  default: "public"
});

const PUBLIC_DIR = join(__dirname, "..", publicDirName.value() || "public");

function safeEqual(a: string, b: string): boolean {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);
  if (bufferA.length !== bufferB.length) {
    return false;
  }
  return timingSafeEqual(bufferA, bufferB);
}

function isAuthorized(authorizationHeader: string | undefined): boolean {
  if (!authorizationHeader?.startsWith("Basic ")) {
    return false;
  }
  const provided = Buffer.from(
    authorizationHeader.slice("Basic ".length),
    "base64"
  ).toString("utf8");
  return safeEqual(provided, basicAuthCredentials.value());
}

function isInsidePublicDir(candidate: string): boolean {
  const relativeToPublicDir = relative(PUBLIC_DIR, candidate);
  return (
    relativeToPublicDir === "" ||
    (!relativeToPublicDir.startsWith("..") && !isAbsolute(relativeToPublicDir))
  );
}

const CONTENT_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};

function resolveContentType(filePath: string): string {
  return CONTENT_TYPES[extname(filePath)] || "application/octet-stream";
}

// Mirrors Next.js `trailingSlash: true` static export: "/about" and "/about/" both
// resolve to "about/index.html", since requests may arrive without the trailing slash.
// `pathname` must already be decoded by the caller.
function resolveFilePath(pathname: string): {
  filePath: string;
  status: number;
} {
  const relativePath = pathname.replace(/^\/+/, "");
  const targets =
    relativePath === "" || relativePath.endsWith("/")
      ? [`${relativePath}index.html`]
      : [relativePath, `${relativePath}/index.html`];

  for (const target of targets) {
    const candidate = join(PUBLIC_DIR, target);
    if (
      isInsidePublicDir(candidate) &&
      existsSync(candidate) &&
      statSync(candidate).isFile()
    ) {
      return { filePath: candidate, status: 200 };
    }
  }
  return { filePath: join(PUBLIC_DIR, "404.html"), status: 404 };
}

export default onRequest(
  { region: "asia-northeast1", secrets: [basicAuthCredentials] },
  (req, res) => {
    if (!isAuthorized(req.headers.authorization)) {
      res.set("WWW-Authenticate", 'Basic realm="Restricted"');
      res.status(401).send("Authentication required.");
      return;
    }

    let decoded: string;
    try {
      decoded = decodeURIComponent(req.path);
    } catch (e) {
      errorLogger("[webApp] failed to decode path", e as Error, {
        path: req.path
      });
      res.status(400).send("Bad Request");
      return;
    }

    const { filePath, status } = resolveFilePath(decoded);

    try {
      const body = readFileSync(filePath);
      res.status(status).set("Content-Type", resolveContentType(filePath));
      res.send(body);
    } catch (e) {
      errorLogger("[webApp] failed to read file", e as Error, { filePath });
      res.status(500).send("Internal Server Error");
    }
  }
);
