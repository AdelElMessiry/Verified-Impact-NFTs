# Verified-Impact-NFTs
An NFTs platform dedicated to impact causes with verification of the benificiaries. 


The steps below are a quick start if you have already set up your [develoment environment](https://docs.casperlabs.io/en/latest/dapp-dev-guide/setup-of-rust-contract-sdk.html), the [casper node](https://github.com/CasperLabs/casper-node), and the [nctl](https://github.com/CasperLabs/casper-node/tree/master/utils/nctl) testing tool. 


### Set up the Rust toolchain

You need the Rust toolchain to run the keys manager (or any other Casper smart contracts).

```bash
 rustup install $(cat rust-toolchain)
 rustup target add --toolchain $(cat rust-toolchain) wasm32-unknown-unknown
```

### Compile the Smart Contracts

To compile the WASM file, use these commands:

```bash
 cd contracts
 make prepare
 make build-contract
```

### Client installation

To install the client, run `yarn install` in the `client` folder.

```bash
 cd client
 yarn install
```

### Running prepared scenarios

```bash
yarn start
```
