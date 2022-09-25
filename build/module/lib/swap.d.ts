import { BigNumber } from "ethers";
import { ERC20, ERC721, ERC721Item } from "./tokens";
export declare const getDelta: (weight: BigNumber, globalNftWeight: BigNumber) => BigNumber;
export declare const getBuyPrices: (items: ERC721Item[], ftReserves: BigNumber, nftReserves: BigNumber) => {
    total: BigNumber;
    prices: {
        [id: string]: BigNumber;
    };
};
export declare const getBuyPrice: (item: ERC721Item, weightSumIncItem: BigNumber, ftReserves: BigNumber, nftReserves: BigNumber) => BigNumber;
export declare const getSellPrices: (items: ERC721Item[], ftReserves: BigNumber, nftReserves: BigNumber) => {
    total: BigNumber;
    prices: {
        [id: string]: BigNumber;
    };
};
export declare const getSellPrice: (item: ERC721Item, weightSumIncItem: BigNumber, ftReserves: BigNumber, nftReserves: BigNumber) => BigNumber;
export declare const createBuyParams: (ftToken: ERC20, nftToken: ERC721, to: string, items: ERC721Item[], ftReserves: BigNumber, nftReserves: BigNumber) => [BigNumber, string, string, BigNumber[], string];
export declare const createSellParams: (nftToken: ERC721, to: string, items: ERC721Item[], ftReserves: BigNumber, nftReserves: BigNumber) => [string, BigNumber[], BigNumber, string];
export declare const createEtherBuyParams: (nftToken: ERC721, to: string, items: ERC721Item[], ftReserves: BigNumber, nftReserves: BigNumber) => [string, BigNumber[], string, {
    value: BigNumber;
}];
export declare const createEtherSellParams: (nftToken: ERC721, to: string, items: ERC721Item[], ftReserves: BigNumber, nftReserves: BigNumber) => [string, BigNumber[], BigNumber, string];
