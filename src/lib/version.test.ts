// @vitest-environment node
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { APP_VERSION } from "./version";

const root = path.resolve(__dirname, "../..");

describe("release version", () => {
  it("matches package.json and the service-worker cache name", () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
    expect(pkg.version).toBe(APP_VERSION);
    const sw = fs.readFileSync(path.join(root, "public/sw.js"), "utf8");
    expect(sw).toContain(`sabbir-os-v${APP_VERSION}`);
  });
});
