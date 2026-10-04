// Llama 3 uses byte-level BPE (as in GPT-2): every byte is stored as a
// printable character. This turns a raw token string back into readable text.

let table: Map<string, number> | undefined;

function byteTable(): Map<string, number> {
  if (table) return table;
  const bytes: number[] = [];
  for (let i = 33; i <= 126; i++) bytes.push(i);
  for (let i = 161; i <= 172; i++) bytes.push(i);
  for (let i = 174; i <= 255; i++) bytes.push(i);
  const chars = [...bytes];
  let n = 0;
  for (let b = 0; b < 256; b++) {
    if (!bytes.includes(b)) {
      bytes.push(b);
      chars.push(256 + n);
      n++;
    }
  }
  table = new Map(bytes.map((b, i) => [String.fromCharCode(chars[i]), b]));
  return table;
}

const decoder = new TextDecoder();

export function tokenText(token: string): string {
  const map = byteTable();
  return decoder.decode(Uint8Array.from([...token], (ch) => map.get(ch) ?? 63));
}
