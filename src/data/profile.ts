export const profile = {
  name: 'Hassan Ismail Fawaz',
  role: 'AI Expert',
  organization: 'GOSI',
  organizationUrl: 'https://gosi.gov.sa/',
  location: 'Riyadh, Saudi Arabia',
  email: 'hassanismailfawaz@gmail.com',
  cv: '/latex/CV-4-Industry/hassan.pdf',
  description:
    'AI expert and machine learning researcher working across generative AI, deep learning, and time series. Based in Riyadh, Saudi Arabia.',
  links: [
    {
      label: 'Google Scholar',
      url: 'https://scholar.google.com/citations?user=oUrGNaoAAAAJ&hl=en',
    },
    { label: 'GitHub', url: 'https://github.com/hfawaz' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/h-fawaz/' },
    { label: 'ORCID', url: 'https://orcid.org/0000-0003-1384-5996' },
    { label: 'arXiv', url: 'https://arxiv.org/a/ismailfawaz_h_1.html' },
    {
      label: 'dblp',
      url: 'https://dblp.uni-trier.de/pers/hd/f/Fawaz:Hassan_Ismail',
    },
    {
      label: 'ResearchGate',
      url: 'https://www.researchgate.net/profile/Hassan_Ismail_Fawaz2',
    },
    {
      label: 'Semantic Scholar',
      url: 'https://www.semanticscholar.org/author/Hassan-Ismail-Fawaz/19302914',
    },
    { label: 'X / Twitter', url: 'https://twitter.com/hassanfawaz93' },
  ],
};

export const experience = [
  {
    company: 'GOSI',
    role: 'AI Expert',
    detail:
      'Bringing advances in generative AI to the General Organization for Social Insurance.',
    url: 'https://gosi.gov.sa/',
    current: true,
  },
  {
    company: 'Beyond Limits',
    role: 'Senior Machine Learning Engineer',
    detail:
      'Fine-tuning large language models, benchmarking vector databases, and improving retrieval-augmented generation.',
    url: 'https://www.beyond.ai/',
    current: false,
  },
  {
    company: 'Ericsson',
    role: 'Machine Learning Researcher',
    detail:
      'Applying artificial intelligence to wireless telecommunication networks.',
    url: 'https://www.ericsson.com/en',
    current: false,
  },
  {
    company: 'Besedo',
    role: 'Machine Learning',
    detail:
      'Developing machine learning solutions for automatic content moderation.',
    url: 'https://besedo.com/',
    current: false,
  },
];

export const projects = [
  {
    number: '01',
    category: 'TIME SERIES · DEEP LEARNING',
    title: 'InceptionTime',
    description:
      'Exploring deep learning architectures for time series classification, inspired by the success of convolutional networks in computer vision.',
    url: 'https://github.com/hfawaz/InceptionTime',
    label: 'Explore the code',
    paper: 'ismailFawaz2020incpetionTime',
    visual: 'waves',
  },
  {
    number: '02',
    category: 'RESEARCH · REPRODUCIBILITY',
    title: 'Deep learning for time series',
    description:
      'A review and accompanying code for comparing deep learning approaches to time series classification.',
    url: 'https://github.com/hfawaz/dl-4-tsc',
    label: 'Explore the benchmark',
    paper: 'ismailfawaz2018deep',
    visual: 'grid',
  },
  {
    number: '03',
    category: 'TRANSFER LEARNING · BENCHMARKS',
    title: 'Learning across domains',
    description:
      'A benchmark of deep unsupervised domain adaptation methods for time series classification.',
    url: 'https://github.com/EricssonResearch/UDA-4-TSC',
    label: 'Explore the benchmark',
    paper: 'Ismail-Fawaz2025DeepUnsupervised',
    visual: 'domains',
  },
];
