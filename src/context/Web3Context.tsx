import React, { useState, useCallback, useMemo } from "react";
import Web3 from "web3";

async function launchModalLazy() {
  const [
    WalletConnectProvider,
    Portis,
    Authereum,
    Fortmatic,
    Torus,
    Web3Modal,
  ] = await Promise.all([
    import("@walletconnect/web3-provider"),
    import("@portis/web3"),
    import("authereum"),
    import("fortmatic"),
    import("@toruslabs/torus-embed"),
    import("web3modal"),
  ]);

  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: process.env.REACT_APP_INFURA_ID,
      },
    },
    fortmatic: {
      package: Fortmatic,
      options: {
        key: process.env.REACT_APP_FORTMATIC_KEY,
      },
    },
    torus: {
      package: Torus,
      options: {},
    },
    portis: {
      package: Portis,
      options: {
        id: process.env.REACT_APP_PORTIS_ID,
      },
    },
    authereum: {
      package: Authereum,
      options: {},
    },
  };

  const web3Modal = new Web3Modal.default({
    cacheProvider: false,
    providerOptions,
  });

  return web3Modal.connect();
}

export interface Web3ContextData {
  web3Network: Web3;
  web3Authed: Web3 | null;
  web3ModalProvider: any | null;
  isAuthed: boolean;
  login: () => Promise<any>;
}

export const Web3Context = React.createContext<Web3ContextData | undefined>(
  undefined
);

export const Web3Provider = ({ children }: { children: JSX.Element }) => {
  const [web3Network] = useState<Web3>(
    () =>
      new Web3(
        `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_ID}`
      )
  );

  const [web3Authed, setWeb3Authed] = useState<Web3 | null>(null);

  const [web3ModalProvider, setWeb3ModalProvider] = useState<any | null>(null);

  const login = useCallback(async () => {
    const provider = await launchModalLazy();

    setWeb3ModalProvider(provider);

    setWeb3Authed(new Web3(provider));
  }, [setWeb3Authed]);

  let value = useMemo(
    () => ({
      web3Network,
      web3Authed,
      web3ModalProvider,
      login,
      isAuthed: web3Authed != null,
    }),
    [web3Network, web3Authed, login, web3ModalProvider]
  );

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

export function useWeb3() {
  const context = React.useContext(Web3Context);

  if (context === undefined) {
    throw new Error(`useWeb3Network must be used within a Web3NetworkProvider`);
  }

  return context;
}

export interface Web3AuthedContextData {
  web3: Web3;
  address: string;
}

export function useAuthedWeb3() {
  const { isAuthed, web3Authed } = useWeb3();

  let web3 = web3Authed!;

  const value = {
    web3,
    //@ts-ignore
    address: web3Authed?.currentProvider?.selectedAddress,
  };

  if (isAuthed) {
    return value;
  } else {
    throw new Error(`Used useAuthedWeb3 while not authenticated!`);
  }
}
