// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

// GitHub Pages project site: https://ved1211.github.io/aleph-alpha-application/
// If the repository gets a different name, change `base` to match it.
export default defineConfig({
  site: "https://ved1211.github.io",
  base: "/aleph-alpha-application",
  output: "static",
  // Keep source whitespace so links that start on a new line keep their space.
  compressHTML: false,
  // Inline the small stylesheet so the first paint does not wait for it.
  build: {
    inlineStylesheets: "always",
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      // Only the tokenizer from transformers.js is used, so leave out the
      // ONNX model runtime (see src/lib/ort-stub.js).
      alias: {
        "onnxruntime-web/webgpu": fileURLToPath(new URL("./src/lib/ort-stub.js", import.meta.url)),
      },
    },
  },
});
