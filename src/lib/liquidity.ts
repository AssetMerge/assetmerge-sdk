import { BigNumber } from "ethers";
import { ERC20, ERC721, ERC721Item } from "./tokens";

export const createAddLiquidityParams = (ftToken: ERC20, nftToken: ERC721, to: string, ftReserves: BigNumber, globalNftWeight: BigNumber, inputs: { item: ERC721Item, price: BigNumber }[], customFloor?: BigNumber): [string, string, BigNumber, BigNumber[], BigNumber[], string] => {
  const defaultWeight = BigNumber.from(10).pow(18);
  inputs.sort((a, b) => {
    if (a.price.lt(b.price)) return -1
    else if (a.price.gt(b.price)) return 1
    else return 0
  })
  const ids = inputs.map(nft => nft.item.id);
  const priceSum = inputs.reduce((acc, token) => acc.add(token.price), BigNumber.from(0));

  if (ftReserves.gt(0)) {
    const floorPrice = ftReserves.mul(defaultWeight).div(globalNftWeight);
    const tokenWeights = inputs.map((token) => {
      if (token.price.eq(floorPrice)) return defaultWeight;
      else return token.price.mul(globalNftWeight).div(ftReserves);
    });
    return [ftToken.address, nftToken.address, priceSum, ids, tokenWeights, to];
  } else {
    // First Liquidity
    const floorPrice = customFloor ?? inputs[0].price;
    const totalWeight = priceSum.mul(defaultWeight).div(floorPrice);
    const tokenWeights = inputs.map((token) => {
      if (token.price.eq(floorPrice)) return BigNumber.from(0);
      else {
        const weight = token.price.mul(totalWeight).div(priceSum);
        return weight;
      }
    });
    return [ftToken.address, nftToken.address, priceSum, ids, tokenWeights, to];
  }
}

export const weightToLiquidityPrice = (weight: BigNumber, ftReserves: BigNumber, globalNftWeight: BigNumber): BigNumber => {
  if (ftReserves.gt(0) && globalNftWeight.gt(0) && weight.gt(0)) {
    return weight.mul(ftReserves).div(globalNftWeight);
  } else return BigNumber.from(0)
}
