import { TypedMap } from "@graphprotocol/graph-ts/index";

// nameFromSource = (key: sourceChainSelector, value: name)
export const nameFromSource = new TypedMap<string, string>();
nameFromSource.set("5009297550715157269", "Ethereum mainnet");
nameFromSource.set("3734403246176062136", "Optimism mainnet");
nameFromSource.set("4949039107694359620", "Arbitrum mainnet");
nameFromSource.set("4051577828743386545", "Polygon mainnet");
nameFromSource.set("6433500567565415381", "Avalanche mainnet");
nameFromSource.set("11344663589394136015", "BNB Chain mainnet");
nameFromSource.set("15971525489660198786", "Base mainnet");
