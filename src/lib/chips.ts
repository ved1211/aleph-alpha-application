// Shared by the server render and the browser demo: shows leading spaces as
// a dot so that pieces like " committee" stay readable.
export function chipParts(piece: string): { space: string; text: string } {
  const match = /^( +)/.exec(piece);
  const lead = match ? match[1].length : 0;
  const rest = piece.slice(lead);
  return { space: "·".repeat(lead), text: rest.replace(/\n/g, "↵").replace(/ /g, "·") };
}
