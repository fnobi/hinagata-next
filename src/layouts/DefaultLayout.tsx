import Head from 'next/head';
import META from '~/meta';

export default (({ children }) => (
  <div>
    <Head>
      <title>{META.TITLE}</title>
      <meta name='viewport' content='width=device-width initial-scale=1' ></meta>
      <meta name='description' content={META.DESCRIPTION} ></meta>
      <meta name='keywords' content={META.KEYWORDS.join(',')} ></meta>
      <meta property='og:url' content={META.URL}></meta>
      <meta property='og:image' content={META.SHARE_IMAGE_URL} ></meta>
      <meta property='og:title' content={META.TITLE} ></meta>
      <meta property='og:description' content={META.DESCRIPTION} ></meta>
      <meta property='twitter:card' content='summary_large_image' ></meta>
      <meta property='twitter:image' content={META.SHARE_IMAGE_URL} ></meta>
      <meta property='twitter:title' content={META.TITLE} ></meta>
      <meta property='twitter:description' content={META.DESCRIPTION} ></meta>
      <link rel='canonical' href={META.URL} />
      <link rel='icon' type='image/x-icon' href={META.FAVICON_PATH} />
    </Head>
    {children}
  </div>
)) as React.StatelessComponent<React.Props<{}>>;