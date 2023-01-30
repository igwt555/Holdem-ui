export const networkConfigs = {
  "0x1": {
    chainId: 1,
    chainName: "Ethereum Mainnet",
    currencySymbol: "ETH",
    blockExplorerUrl: "https://etherscan.io",
    openSeaUrl: "https://opensea.io",
    playingCardsAddress: "0xC3a3D9f2263A82b740B921FBB386eC5820FDDf9e",
    holdemHeroesAddress: "0x9259C39495FCC81509ab6Ff82179950c7d36735f",
    texasHoldemV1Address: "",
    chainType: "l1",
    prefix: "Eth",
  },
  "0x4": {
    chainId: 4,
    chainName: "Ethereum Rinkeby",
    currencySymbol: "ETH",
    blockExplorerUrl: "https://rinkeby.etherscan.io",
    openSeaUrl: "https://testnets.opensea.io",
    playingCardsAddress: "0xc8c1ae576c1b275ecC6F054D1A132F86e3A232b7",
    holdemHeroesAddress: "0x076fDA4f0982546eDb285c9A0D833B5dCbC50a55",
    texasHoldemV1Address: "0xC8E3273c1D352dc2B2933BF44bccDD9894002D1B",
    chainType: "l1",
    prefix: "Eth",
  },
  "0xaa289": {
    chainId: 696969,
    chainName: "VorDev Chain",
    currencyName: "ETH",
    currencySymbol: "ETH",
    blockExplorerUrl: "http://localhost",
    openSeaUrl: "http://localhost",
    playingCardsAddress: "",
    holdemHeroesAddress: "",
    texasHoldemV1Address: "",
    chainType: "l1",
    prefix: "Eth",
  },
  "0x539": {
    chainId: 1337,
    chainName: "Local Chain",
    currencyName: "ETH",
    currencySymbol: "ETH",
    blockExplorerUrl: "http://localhost",
    openSeaUrl: "http://localhost",
    playingCardsAddress: "",
    holdemHeroesAddress: "",
    texasHoldemV1Address: "",
    chainType: "l1",
    prefix: "Eth",
  },
  "0x89": {
    chainId: 137,
    chainName: "Polygon Mainnet",
    currencyName: "MATIC",
    currencySymbol: "MATIC",
    blockExplorerUrl: "https://polygonscan.com",
    openSeaUrl: "https://opensea.io",
    playingCardsAddress: "0xC3a3D9f2263A82b740B921FBB386eC5820FDDf9e",
    holdemHeroesAddress: "0xfe54470e3e7676bA20A6FF27f0358651d0525CAa",
    texasHoldemV1Address: "0x1ED2b5820C8BB558a99696b3C140000926Df8F2f",
    chainType: "l2",
    prefix: "Polygon",
  },
  "0x13881": {
    chainId: 80001,
    chainName: "Polygon Mumbai",
    currencyName: "MATIC",
    currencySymbol: "MATIC",
    blockExplorerUrl: "https://mumbai.polygonscan.com/",
    openSeaUrl: "https://testnets.opensea.io",
    playingCardsAddress: "0x9d972f0313fFC22EC4A5f5BC4e921603bae92448",
    holdemHeroesAddress: "0xC6Af87603b2877ceE3a2Aa8d331275905f9515E1",
    texasHoldemV1Address: "0xfB3bf250007807c8416C0C3ed6F0C03159E82c53",
    chainType: "l2",
    prefix: "Polygon",
  },
};

export const getCurrencySymbol = (chain) => networkConfigs[chain]?.currencySymbol || "NATIVE";

export const getExplorer = (chain) => networkConfigs[chain]?.blockExplorerUrl;

export const getPlayingCardsAddress = (chain) => networkConfigs[chain]?.playingCardsAddress;

export const getHoldemHeroesAddress = (chain) => networkConfigs[chain]?.holdemHeroesAddress;

export const getTexasHoldemV1Address = (chain) => networkConfigs[chain]?.texasHoldemV1Address;

export const getOpenSeaUrl = (chain) => networkConfigs[chain]?.openSeaUrl;

export const getChainType = (chain) => networkConfigs[chain]?.chainType;

export const getBakendObjPrefix = (chain) => networkConfigs[chain]?.prefix;

export const getGameIsLive = (chain) => (networkConfigs[chain]?.texasHoldemV1Address !== "");

export const getHehIsLive = (chain) => (networkConfigs[chain]?.holdemHeroesAddress !== "");
