/* istanbul ignore file */
import React from "react";
import ReactDOM from "react-dom";

import App from "./components/App";

import * as serviceWorker from "./serviceWorker";

import "./index.css";

// Remove this ignore when TypeScript PR gets merged.
// @ts-ignore
import PWAPrompt from "react-ios-pwa-prompt";

import { ThemeProvider, CSSReset, theme } from "@chakra-ui/core";

import ErrorPage from "./components/pages/ErrorPage";
import { ErrorBoundary } from "react-error-boundary";
import { Web3Provider } from "./context/Web3Context";
import { ContractsProvider } from "./context/ContractsContext";
import { TokensProvider } from "./context/TokensContext";

ReactDOM.render(
  <>
    <PWAPrompt
      timesToShow={10}
      permanentlyHideOnDismiss={false}
      copyTitle="Add this site to your home screen!"
      copyBody="The Rari Portal works best when added to your homescreen. Without doing this, you may have a degraded experience."
      copyClosePrompt="Close"
    />
    <ThemeProvider theme={theme}>
      <CSSReset />

      <ErrorBoundary FallbackComponent={ErrorPage}>
        <TokensProvider>
          <Web3Provider>
            <ContractsProvider>
              <App />
            </ContractsProvider>
          </Web3Provider>
        </TokensProvider>
      </ErrorBoundary>
    </ThemeProvider>
  </>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
