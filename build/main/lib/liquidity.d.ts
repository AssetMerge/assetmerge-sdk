import { BigNumber } from "ethers";
import { ERC20, ERC721, ERC721Item } from "./tokens";
export declare const createAddLiquidityParams: (ftToken: ERC20, nftToken: ERC721, to: string, ftReserves: BigNumber, globalNftWeight: BigNumber, inputs: {
    item: ERC721Item;
    price: BigNumber;
}[], customFloor?: BigNumber) => [string, string, BigNumber, BigNumber[], BigNumber[], string];
export declare const createAddEtherLiquidityParams: (nftToken: ERC721, to: string, ftReserves: BigNumber, globalNftWeight: BigNumber, inputs: {
    item: ERC721Item;
    price: BigNumber;
}[], customFloor?: BigNumber) => [string, BigNumber[], BigNumber[], string, {
    value: BigNumber;
}];
export declare const weightToLiquidityPrice: (weight: BigNumber, ftReserves: BigNumber, globalNftWeight: BigNumber) => BigNumber;
