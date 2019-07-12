export type Meta = {
  TITLE: string;
  DESCRIPTION: string;
  URL: string;
  BASE_PATH: string;
  KEYWORDS: string[];
  SHARE_IMAGE_URL: string;
  FAVICON_PATH: string;
};

const TITLE = 'hinagata-next';
const DESCRIPTION = 'Awsome next.js project.';
const KEYWORDS = ['next', 'javascript'];
const BASE_PATH = '/';
const URL = `https://hinagata-next.example.com${BASE_PATH}`;
const SHARE_IMAGE_URL = `${URL}ogp.png`;
const FAVICON_PATH = '/favicon.ico';

export default {
  TITLE,
  DESCRIPTION,
  KEYWORDS,
  BASE_PATH,
  URL,
  SHARE_IMAGE_URL,
  FAVICON_PATH
} as Meta;