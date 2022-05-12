import Web3 from "web3";

export const configureWeb3 = (provider = null) => {
  // check if provider exists
  if (!window.ethereum && !provider) {
    throw new Error('no ethereum provider detected')
  }

  // check custom provider to be initialized else use window.ethereum
  return new Web3(provider ?
      new Web3.providers.HttpProvider(provider)
    :
      window.ethereum
  );
};
