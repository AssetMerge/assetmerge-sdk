import { BigNumber, constants } from "ethers";
import { ERC20, ERC721, ERC721Item } from "./tokens";

export const getDelta = (weight: BigNumber, globalNftWeight: BigNumber) => {
  return weight.mul(constants.WeiPerEther).div(globalNftWeight);
}

export const getBuyPrices = (items: ERC721Item[], ftReserves: BigNumber, nftReserves: BigNumber): { total: BigNumber, prices: { [id: string]: BigNumber } } => {
  if (items.length === 0) return { total: BigNumber.from(0), prices: {} }
  const weights = items.map((item) => item.weight.add(getDelta(item.weight, nftReserves)));
  const weightSum = weights.reduce((acc, curr) => acc.add(curr), BigNumber.from(0));
  const numerator = ftReserves.mul(weightSum).mul(100);
  const denominator = nftReserves.sub(weightSum).mul(99);
  const total = numerator.div(denominator).add(1);
  const prices = items.reduce((acc, item, index: number) => ({ ...acc, [item.id.toString()]: weights[index].mul(total).div(weightSum) }), {});
  return { total, prices }
}

export const getBuyPrice = (item: ERC721Item, weightSumIncItem: BigNumber, ftReserves: BigNumber, nftReserves: BigNumber): BigNumber => {
  const itemWeight = item.weight.add(getDelta(item.weight, nftReserves));
  const numerator = ftReserves.mul(weightSumIncItem).mul(100);
  const denominator = nftReserves.sub(weightSumIncItem).mul(99);
  const total = numerator.div(denominator).add(1);
  return itemWeight.mul(total).div(weightSumIncItem);
}

export const getSellPrices = (items: ERC721Item[], ftReserves: BigNumber, nftReserves: BigNumber): { total: BigNumber, prices: { [id: string]: BigNumber } } => {
  if (items.length === 0) return { total: BigNumber.from(0), prices: {} }
  const weights = items.map((item) => item.weight.sub(getDelta(item.weight, nftReserves)));
  const weightSum = weights.reduce((acc, curr) => acc.add(curr), BigNumber.from(0));
  const weightSumWithFee = weightSum.mul(99);
  const numerator = weightSumWithFee.mul(ftReserves);
  const denominator = nftReserves.mul(100).add(weightSumWithFee);
  const total = numerator.div(denominator);
  const prices = items.reduce((acc, item, index: number) => ({ ...acc, [item.id.toString()]: weights[index].mul(total).div(weightSum) }), {});
  return { total, prices }
}

export const getSellPrice = (item: ERC721Item, weightSumIncItem: BigNumber, ftReserves: BigNumber, nftReserves: BigNumber): BigNumber => {
  const weightSumWithFee = weightSumIncItem.mul(99);
  const numerator = weightSumWithFee.mul(ftReserves);
  const denominator = nftReserves.mul(100).add(weightSumWithFee);
  const total = numerator.div(denominator);
  return item.weight.sub(getDelta(item.weight, nftReserves)).mul(total).div(weightSumIncItem);
}

export const createBuyParams = (ftToken: ERC20, nftToken: ERC721, to: string, items: ERC721Item[], ftReserves: BigNumber, nftReserves: BigNumber): [BigNumber, string, string, BigNumber[], string] => {
  const ids = items.map(nft => nft.id);
  const { total } = getBuyPrices(items, ftReserves, nftReserves)
  return [total, ftToken.address, nftToken.address, ids, to];
}

export const createSellParams = (nftToken: ERC721, to: string, items: ERC721Item[], ftReserves: BigNumber, nftReserves: BigNumber): [string, BigNumber[], BigNumber, string] => {
  const ids = items.map(nft => nft.id);
  const { total } = getSellPrices(items, ftReserves, nftReserves)
  return [nftToken.address, ids, total, to];
}

export const createEtherBuyParams = (nftToken: ERC721, to: string, items: ERC721Item[], ftReserves: BigNumber, nftReserves: BigNumber): [string, BigNumber[], string, { value: BigNumber }] => {
  const ids = items.map(nft => nft.id);
  const { total } = getBuyPrices(items, ftReserves, nftReserves)
  return [nftToken.address, ids, to, { value: total }];
}

export const createEtherSellParams = (ftToken: ERC20, nftToken: ERC721, to: string, items: ERC721Item[], ftReserves: BigNumber, nftReserves: BigNumber): [string, string, BigNumber[], BigNumber, string] => {
  const ids = items.map(nft => nft.id);
  const { total } = getSellPrices(items, ftReserves, nftReserves)
  return [ftToken.address, nftToken.address, ids, total, to];
}
