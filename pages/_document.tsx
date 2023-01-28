import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="icon" href="/favicons/favicon.svg" />
        <link rel="manifest" href="/favicons/site.webmanifest" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@200;300;400;500;600;700;900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="bg-[#f1f1f1] text-lp-black dark:bg-[#1e293b] dark:text-lp-white">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
