import type { NextPage } from 'next';
import Head from 'next/head';
import App from '../components/App';

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Creatomate JSON Preview</title>
        <meta name="description" content="Preview videos using Creatomate and JSON" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <App />
      </main>
    </div>
  );
};

export default Home;
