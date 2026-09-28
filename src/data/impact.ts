import snapshot from './impact.json';

export const impact = snapshot;
export const number = (value: number) =>
  new Intl.NumberFormat('en-US').format(value);
export const checkedDate = (value: string) =>
  new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`));
export const githubStars = impact.github.repositories.reduce(
  (total, repo) => total + repo.stars,
  0,
);
export const repositoryImpact = (url: string) =>
  [...impact.github.repositories, ...impact.github.collaborations].find(
    (repo) => repo.url.replace(/\/$/, '') === url.replace(/\/$/, ''),
  );
export const paperImpact = (id: string) =>
  (
    impact.scholar.papers as Record<
      string,
      { count: number; url: string; title: string }
    >
  )[id];

export const datasets = [
  {
    name: 'DBpedia-14',
    description: 'Ontology classification',
    url: 'https://huggingface.co/datasets/fancyzhx/dbpedia_14',
    pullRequest: 'https://github.com/huggingface/datasets/pull/1116',
  },
  {
    name: 'Yelp Review Full',
    description: 'Review classification',
    url: 'https://huggingface.co/datasets/Yelp/yelp_review_full',
    pullRequest: 'https://github.com/huggingface/datasets/pull/1315',
  },
  {
    name: 'Amazon Polarity',
    description: 'Sentiment classification',
    url: 'https://huggingface.co/datasets/fancyzhx/amazon_polarity',
    pullRequest: 'https://github.com/huggingface/datasets/pull/1389',
  },
];
