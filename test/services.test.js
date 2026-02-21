import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const services = JSON.parse(
  readFileSync(resolve(ROOT, "services.json"), "utf8"),
);

describe("services.json", () => {
  it("is valid JSON with entries", () => {
    expect(typeof services).toBe("object");
    expect(Object.keys(services).length).toBeGreaterThan(0);
  });

  it("every entry has a name", () => {
    for (const [key, service] of Object.entries(services)) {
      expect(service.name, `${key} missing name`).toBeTruthy();
    }
  });

  it("every entry has either namespace or url", () => {
    for (const [key, service] of Object.entries(services)) {
      const hasNamespace = typeof service.namespace === "string";
      const hasUrl = typeof service.url === "string";
      expect(hasNamespace || hasUrl, `${key} has neither namespace nor url`).toBe(true);
    }
  });

  it("no entry has both namespace and url", () => {
    for (const [key, service] of Object.entries(services)) {
      if (service.namespace && service.url) {
        expect.fail(`${key} has both namespace and url`);
      }
    }
  });

  it("every entry has a matching icon file", () => {
    for (const key of Object.keys(services)) {
      const iconPath = resolve(ROOT, "icons", `${key}.png`);
      expect(existsSync(iconPath), `Missing icon: icons/${key}.png`).toBe(true);
    }
  });

  it("namespaces are non-empty strings", () => {
    for (const [key, service] of Object.entries(services)) {
      if (service.namespace) {
        expect(service.namespace.length, `${key} has empty namespace`).toBeGreaterThan(0);
      }
    }
  });

  it("urls are valid HTTP(S) URLs", () => {
    for (const [key, service] of Object.entries(services)) {
      if (service.url) {
        expect(
          service.url.startsWith("https://"),
          `${key} url must start with https://`,
        ).toBe(true);
      }
    }
  });

  it("no duplicate namespaces except where intentional (e.g. Aurora/RDS)", () => {
    const namespaceCounts = {};
    for (const [key, service] of Object.entries(services)) {
      if (service.namespace) {
        if (!namespaceCounts[service.namespace]) {
          namespaceCounts[service.namespace] = [];
        }
        namespaceCounts[service.namespace].push(key);
      }
    }

    const allowedDuplicates = ["rds"]; // Aurora and RDS share the same console
    for (const [namespace, keys] of Object.entries(namespaceCounts)) {
      if (keys.length > 1 && !allowedDuplicates.includes(namespace)) {
        expect.fail(
          `Duplicate namespace "${namespace}" used by: ${keys.join(", ")}`,
        );
      }
    }
  });
});
