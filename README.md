# CCIP Subgraphs

### The following folders contains a subgraph for the CCIP router contract deployed on Arbitrum One on [01/25/2024](https://twitter.com/chainlink/status/1750580692252086512 "Announcement Tweet").

This subgraph can be easily copied to index all CCIP router contracts on all chains. The full list of Router Addresses and Chain Selectors are below.

CCIP works by having `offRamp` and `onRamp` contracts whereby each chain (for example, Arbitrum) has multiple `offRamp` contracts that can connect to it. onRamp contracts are the contracts that the router on Arbitrum uses to interact with the oracle network. Expressed visually:

![Alt text](https://docs.chain.link/images/ccip/ccip-diagram-04_v04.webp "CCIP Architecture")

Due to the architecture of CCIP, the data that is emitted by the `Router` contract is hashed with Keccak.
This means that if the `Receiver` contract does not emit the raw data, the only way to see that data is to look at the CCIP (oracle) explorer.

## Router Addresses and Chain Selectors

### Ethereum mainnet

Router Address: 0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D
Chain Selector: 5009297550715157269

### Optimism mainnet

Router Address: 0x3206695CaE29952f4b0c22a169725a865bc8Ce0f
Chain Selector: 3734403246176062136

### Arbitrum mainnet

Router Address: 0x141fa059441E0ca23ce184B6A78bafD2A517DdE8
Chain Selector: 4949039107694359620

### Polygon mainnet

Router Address: 0x849c5ED5a80F5B408Dd4969b78c2C8fdf0565Bfe
Chain Selector: 4051577828743386545

### Avalanche mainnet

Router Address: 0xF4c7E640EdA248ef95972845a62bdC74237805dB
Chain Selector: 6433500567565415381

### BNB Chain mainnet

Router Address: 0x34B03Cb9086d7D758AC55af71584F81A598759FE
Chain Selector: 11344663589394136015

### Base mainnet

Router Address: 0x881e3A65B4d4a04dD529061dd0071cf975F58bCD
Chain Selector: 15971525489660198786
