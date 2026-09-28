import bibtex from '../../references.bib?raw';
import { toJSON, toBibtex } from '../lib/bibtex.js';

function plainText(value: string) {
  return value
    .replace(/\\'\{?([a-zA-Z])\}?/g, (_, letter) =>
      `${letter}\u0301`.normalize('NFC'),
    )
    .replace(/[{}]/g, '')
    .replace(/\\&/g, '&');
}

const entries = toJSON(bibtex).filter((entry) => entry.entryTags);
const ids = new Set<string>();
export const publications = entries
  .map((entry) => {
    const tags = Object.fromEntries(
      Object.entries(entry.entryTags!).map(([key, value]) => [
        key.toLowerCase(),
        value,
      ]),
    );
    for (const field of ['title', 'author', 'year']) {
      if (!tags[field])
        throw new Error(`Missing ${field} in ${entry.citationKey}`);
    }
    if (!/^\d{4}$/.test(tags.year) || ids.has(entry.citationKey)) {
      throw new Error(
        `Invalid year or duplicate citation: ${entry.citationKey}`,
      );
    }
    ids.add(entry.citationKey);
    for (const field of ['url', 'pdf', 'code']) {
      if (tags[field] && !/^https?:\/\//.test(tags[field])) {
        throw new Error(`Invalid ${field} URL in ${entry.citationKey}`);
      }
    }
    const title = plainText(tags.title);
    const authors = plainText(tags.author)
      .split(' and ')
      .map((author) => {
        const parts = author.split(',').map((part) => part.trim());
        return parts.length === 2 ? `${parts[1]} ${parts[0]}` : author;
      })
      .join(', ');
    const venue = plainText(tags.journal || tags.booktitle || '');
    return {
      id: entry.citationKey,
      title,
      authors,
      venue,
      year: Number(tags.year),
      acronym: tags.acronym || '',
      url: tags.url,
      pdf: tags.pdf,
      code: tags.code,
      bibtex: toBibtex([entry], false),
      searchText:
        `${title} ${authors} ${venue} ${tags.acronym || ''} ${tags.year}`.toLowerCase(),
    };
  })
  .sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));

export const selectedIds = [
  'Ismail-Fawaz2025DeepUnsupervised',
  'ismailFawaz2020incpetionTime',
  'ismailfawaz2018deep',
];
export const selectedPublications = selectedIds.map((id) => {
  const paper = publications.find((publication) => publication.id === id);
  if (!paper) throw new Error(`Selected publication not found: ${id}`);
  return paper;
});
export { bibtex };
