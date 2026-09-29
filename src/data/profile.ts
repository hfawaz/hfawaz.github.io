export const profile = {
  name: 'Hassan Ismail Fawaz',
  role: 'AI Expert',
  organization: 'GOSI',
  organizationUrl: 'https://gosi.gov.sa/',
  location: 'Riyadh, Saudi Arabia',
  email: 'hassanismailfawaz@gmail.com',
  cv: '/cv.pdf',
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
    { label: 'Hugging Face', url: 'https://huggingface.co/hfawaz' },
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
      'An ensemble of deep convolutional networks for scalable time series classification, with an open-source implementation of the research.',
    url: 'https://github.com/hfawaz/InceptionTime',
    label: 'Explore the code',
    paper: 'ismailFawaz2020incpetionTime',
    figure: {
      src: '/figures/inception-module.svg',
      width: 406,
      height: 160,
      alt: 'Inception module with a bottleneck, parallel convolutions of different lengths, and max pooling.',
      caption: 'Fig. 2 \u00b7 Inside an Inception module',
      pdf: 'https://arxiv.org/pdf/1909.04939v3#page=6',
    },
  },
  {
    number: '02',
    category: 'RESEARCH · REPRODUCIBILITY',
    title: 'Deep learning for time series',
    description:
      'An open-source benchmark accompanying our review: 8,730 trained models evaluated across 97 time series datasets.',
    url: 'https://github.com/hfawaz/dl-4-tsc',
    label: 'Explore the benchmark',
    paper: 'ismailfawaz2018deep',
    figure: {
      src: '/figures/classifier-comparison.svg',
      width: 382,
      height: 83,
      alt: 'Critical difference diagram comparing nine deep learning classifiers on the UCR/UEA time series archive, with ResNet and FCN ranked highest.',
      caption: 'Fig. 7 \u00b7 Comparing nine deep classifiers',
      pdf: 'https://arxiv.org/pdf/1809.04356v4#page=22',
    },
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
    figure: {
      src: '/figures/domain-shifts.svg',
      width: 317,
      height: 146,
      alt: 'Source and target time series illustrating temporal shift along the time axis and feature shift in signal values.',
      caption: 'Fig. 1 \u00b7 Temporal and feature shifts',
      pdf: 'https://arxiv.org/pdf/2312.09857v3#page=4',
    },
  },
];
