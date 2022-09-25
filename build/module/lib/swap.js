import { BigNumber, constants } from "ethers";
export const getDelta = (weight, globalNftWeight) => {
    return weight.mul(constants.WeiPerEther).div(globalNftWeight);
};
export const getBuyPrices = (items, ftReserves, nftReserves) => {
    if (items.length === 0)
        return { total: BigNumber.from(0), prices: {} };
    const weights = items.map((item) => item.weight.add(getDelta(item.weight, nftReserves)));
    const weightSum = weights.reduce((acc, curr) => acc.add(curr), BigNumber.from(0));
    const numerator = ftReserves.mul(weightSum).mul(100);
    const denominator = nftReserves.sub(weightSum).mul(99);
    const total = numerator.div(denominator).add(1);
    const prices = items.reduce((acc, item, index) => ({ ...acc, [item.id.toString()]: weights[index].mul(total).div(weightSum) }), {});
    return { total, prices };
};
export const getBuyPrice = (item, weightSumIncItem, ftReserves, nftReserves) => {
    const itemWeight = item.weight.add(getDelta(item.weight, nftReserves));
    const numerator = ftReserves.mul(weightSumIncItem).mul(100);
    const denominator = nftReserves.sub(weightSumIncItem).mul(99);
    const total = numerator.div(denominator).add(1);
    return itemWeight.mul(total).div(weightSumIncItem);
};
export const getSellPrices = (items, ftReserves, nftReserves) => {
    if (items.length === 0)
        return { total: BigNumber.from(0), prices: {} };
    const weights = items.map((item) => item.weight.sub(getDelta(item.weight, nftReserves)));
    const weightSum = weights.reduce((acc, curr) => acc.add(curr), BigNumber.from(0));
    const weightSumWithFee = weightSum.mul(99);
    const numerator = weightSumWithFee.mul(ftReserves);
    const denominator = nftReserves.mul(100).add(weightSumWithFee);
    const total = numerator.div(denominator);
    const prices = items.reduce((acc, item, index) => ({ ...acc, [item.id.toString()]: weights[index].mul(total).div(weightSum) }), {});
    return { total, prices };
};
export const getSellPrice = (item, weightSumIncItem, ftReserves, nftReserves) => {
    const weightSumWithFee = weightSumIncItem.mul(99);
    const numerator = weightSumWithFee.mul(ftReserves);
    const denominator = nftReserves.mul(100).add(weightSumWithFee);
    const total = numerator.div(denominator);
    return item.weight.sub(getDelta(item.weight, nftReserves)).mul(total).div(weightSumIncItem);
};
export const createBuyParams = (ftToken, nftToken, to, items, ftReserves, nftReserves) => {
    const ids = items.map(nft => nft.id);
    const { total } = getBuyPrices(items, ftReserves, nftReserves);
    return [total, ftToken.address, nftToken.address, ids, to];
};
export const createSellParams = (nftToken, to, items, ftReserves, nftReserves) => {
    const ids = items.map(nft => nft.id);
    const { total } = getSellPrices(items, ftReserves, nftReserves);
    return [nftToken.address, ids, total, to];
};
export const createEtherBuyParams = (nftToken, to, items, ftReserves, nftReserves) => {
    const ids = items.map(nft => nft.id);
    const { total } = getBuyPrices(items, ftReserves, nftReserves);
    return [nftToken.address, ids, to, { value: total }];
};
export const createEtherSellParams = (nftToken, to, items, ftReserves, nftReserves) => {
    const ids = items.map(nft => nft.id);
    const { total } = getSellPrices(items, ftReserves, nftReserves);
    return [nftToken.address, ids, total, to];
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3dhcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvc3dhcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUc5QyxNQUFNLENBQUMsTUFBTSxRQUFRLEdBQUcsQ0FBQyxNQUFpQixFQUFFLGVBQTBCLEVBQUUsRUFBRTtJQUN4RSxPQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUNoRSxDQUFDLENBQUE7QUFFRCxNQUFNLENBQUMsTUFBTSxZQUFZLEdBQUcsQ0FBQyxLQUFtQixFQUFFLFVBQXFCLEVBQUUsV0FBc0IsRUFBNkQsRUFBRTtJQUM1SixJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQztRQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLENBQUE7SUFDdkUsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3pGLE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsRixNQUFNLFNBQVMsR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNy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