import React, { createContext, useState, useEffect } from 'react';
import { Signer } from 'casper-js-sdk';

import { getAccountBalance } from '../utils/contract-utils';
interface IEntityInfo {
  publicKey: string | null;
}
interface IAuthContextValue {
  isLoggedIn: boolean;
  balance: number | null;
  entityInfo: IEntityInfo;
  login: () => void;
  logout: () => void;
  refreshAuth: () => void;
}

async function getActivePublicKey(): Promise<string> {
  let pk = await Signer.getActivePublicKey().catch((err) => {
    // console.log("Couldn't get active pub key, it should be locked", err);
    // Signer.sendConnectionRequest();
    return '';
  });
  console.log('Got active pub key:', pk);
  return pk;
}

async function getConnectionStatus(): Promise<null | string> {
  if (!window.casperlabsHelper) {
    // alert("Please install Casper signer Signer extension")
    console.log('Casper signer not available :(');
    return null;
  }

  const isConnected = await Signer.isConnected();
  if (isConnected) {
    let pk = await getActivePublicKey();
    if (pk) {
      console.log('connected to signer successfully');
      return pk;
    }
    console.log(`connected to signer, but it is locked`);
  }
  return null;
}

const AuthContext = createContext<IAuthContextValue>({
  isLoggedIn: false,
  balance: null,
  entityInfo: { publicKey: null },
  login: () => {},
  logout: () => {},
  refreshAuth: () => {},
});

const AuthProvider = (props: any) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [balance, setBalance] = useState(null);
  const [entityInfo, setEntityInfo] = useState<IEntityInfo>({
    publicKey: null,
  });

  function updateLoginStatus(isLoggedIn: boolean, pubKey: string | null) {
    setLoggedIn(isLoggedIn);
    setEntityInfo({ publicKey: pubKey });
  }

  function refreshEntityInfo() {
    if (loggedIn) setEntityInfo({ publicKey: entityInfo.publicKey });
    else setEntityInfo({ publicKey: null });
  }

  useEffect(() => {
    window.addEventListener('signer:locked', (msg) => {
      console.log('Signer locked');
      updateLoginStatus(false, null);
    });
    window.addEventListener('signer:disconnected', (msg) => {
      console.log('Signer disconnected');
      updateLoginStatus(false, null);
    });
    window.addEventListener('signer:connected', async (msg) => {
      console.log('Signer connected');
      const publicKey = await getActivePublicKey();
      if (publicKey) {
        updateLoginStatus(true, publicKey);
      }
    });
    window.addEventListener('signer:unlocked', async (msg) => {
      console.log('Signer unlocked');
      const publicKey = await getActivePublicKey();
      if (publicKey) {
        updateLoginStatus(true, publicKey);
      }
    });
    setTimeout(async () => {
      const publicKey = await getConnectionStatus();
      if (publicKey) {
        updateLoginStatus(true, publicKey);
      }
    }, 300);
  }, []);

  const login = async () => {
    if (loggedIn) {
      console.log('Already logged in !');
      return false;
    }
    Signer.sendConnectionRequest();
    return true;
  };

  const logout = () => {
    if (!loggedIn) {
      console.log('Already logged out !');
      return false;
    }
    Signer.disconnectFromSite();
    return true;
  };

  const contextValue: IAuthContextValue = {
    isLoggedIn: loggedIn,
    balance,
    entityInfo,
    login,
    logout,
    refreshAuth: refreshEntityInfo,
  };

  useEffect(() => {
    console.log(
      '\n\nAuth details changed\n',
      { isLoggedIn: loggedIn, pubKey: entityInfo.publicKey },
      '\n\n\n'
    );
    (async () => {
      if (entityInfo.publicKey && balance == null) {
        const currentWalletBalance = await getAccountBalance(
          entityInfo.publicKey
        );
        setBalance(currentWalletBalance.toString());
        console.log(currentWalletBalance.toString());
      }
    })();
  }, [loggedIn, entityInfo, balance]);

  return <AuthContext.Provider value={contextValue} {...props} />;
};

const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };
