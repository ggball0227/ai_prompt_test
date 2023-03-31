import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.png" />
          <meta
            name="site"
            content="prompt 百宝箱"
          />
          <meta property="og:site_name" content="Chat Simplifier" />
          <meta
            property="og:description"
            content="Simplify your chat content in seconds."
          />
          <meta property="og:title" content="Chat Simplifier" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Chat Simplifier" />
          <meta
            name="twitter:description"
            content="Simplify your chat content in seconds."
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
