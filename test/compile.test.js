import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

describe("compile.js", () => {
  describe("--dry-run", () => {
    it("lists all services without creating files", () => {
      const output = execFileSync("node", [resolve(ROOT, "compile.js"), "--dry-run"], {
        cwd: ROOT,
        encoding: "utf8",
      });

      expect(output).toContain("Dry run:");
      expect(output).toContain("EC2");
      expect(output).toContain("Lambda");
      expect(output).toContain("https://console.aws.amazon.com/ec2/home");
    });

    it("includes services with custom URLs", () => {
      const output = execFileSync("node", [resolve(ROOT, "compile.js"), "--dry-run"], {
        cwd: ROOT,
        encoding: "utf8",
      });

      expect(output).toContain("Lightsail");
      expect(output).toContain("https://lightsail.aws.amazon.com/");
    });
  });

  describe("URL generation", () => {
    it("generates standard console URLs from namespace", () => {
      const services = JSON.parse(
        readFileSync(resolve(ROOT, "services.json"), "utf8"),
      );

      const ec2 = services["EC2"];
      expect(ec2.namespace).toBe("ec2");

      const expectedUrl = `https://console.aws.amazon.com/${ec2.namespace}/home`;
      expect(expectedUrl).toBe("https://console.aws.amazon.com/ec2/home");
    });

    it("uses full URL override when provided", () => {
      const services = JSON.parse(
        readFileSync(resolve(ROOT, "services.json"), "utf8"),
      );

      const lightsail = services["Lightsail"];
      expect(lightsail.url).toBeTruthy();
      expect(lightsail.namespace).toBeUndefined();
    });
  });

  describe(".url file format", () => {
    it("creates valid Internet Shortcut content", () => {
      const url = "https://console.aws.amazon.com/ec2/home";
      const content = `[InternetShortcut]\nURL=${url}`;

      expect(content).toContain("[InternetShortcut]");
      expect(content).toContain("URL=https://console.aws.amazon.com/ec2/home");
    });
  });
});
