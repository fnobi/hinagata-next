import Head from 'next/head';

const DefaultLayout: React.StatelessComponent<React.Props<{}>> = ({ children }) => (
  <div>
    <Head>
      <title>hinagata-next</title>
    </Head>
    {children}
  </div>
);

export default DefaultLayout;

