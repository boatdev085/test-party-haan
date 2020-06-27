import "antd/dist/antd.css";
import { AppProps } from "next/app";
import { ThemeProvider } from "styled-components";
import { Layout } from "antd";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ThemeProvider theme={{}}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
};

export default MyApp;
