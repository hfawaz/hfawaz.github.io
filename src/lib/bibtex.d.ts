export interface Entry {
  citationKey: string;
  entryType: string;
  entryTags?: Record<string, string>;
}
export function toJSON(input: string): Entry[];
export function toBibtex(entries: Entry[], compact?: boolean): string;
