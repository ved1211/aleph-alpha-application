// The site only uses the tokenizer from transformers.js, never a model.
// This small stand-in replaces the ONNX runtime in the browser build so the
// 27 MB WebAssembly file is not shipped. Running a model would fail clearly.
const unavailable = () => {
  throw new Error("Model inference is not included in this site build.");
};

export const env = { wasm: {}, webgpu: {}, logLevel: "warning" };
export class InferenceSession {
  static create = unavailable;
}
export class Tensor {}
export default { env, InferenceSession, Tensor };
