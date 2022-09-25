"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalanceManager = exports.createBalanceManager = exports.getBalance = void 0;
const ethers_1 = require("ethers");
const utils_1 = require("ethers/lib/utils");
const constants_1 = require("./constants");
const interfaces_1 = require("./interfaces");
const getBalance = async (token, address, provider, liquidityPool = null) => {
    try {
        const [inTransfers, outTransfers] = await Promise.all([
            provider.getLogs({
                address: token.address,
                fromBlock: 0,
                topics: [
                    ethers_1.utils.id('Transfer(address,address,uint256)'),
                    null,
                    ethers_1.utils.hexZeroPad(address, 32),
                ],
            }),
            provider.getLogs({
                address: token.address,
                fromBlock: 0,
                topics: [
                    ethers_1.utils.id('Transfer(address,address,uint256)'),
                    ethers_1.utils.hexZeroPad(address, 32),
                ],
            }),
        ]);
        const count = {};
        inTransfers.forEach((log) => {
            const { tokenId } = interfaces_1.ERC721Interface.decodeEventLog('Transfer', log.data, log.topics);
            const id = tokenId.toString();
            if (count[id])
                count[id] = count[id] + 1;
            else
                count[id] = 1;
        });
        outTransfers.forEach((log) => {
            const { tokenId } = interfaces_1.ERC721Interface.decodeEventLog('Transfer', log.data, log.topics);
            const id = tokenId.toString();
            if (count[id])
                count[id] = count[id] - 1;
        });
        const historicalIds = [
            ...new Set(Object.keys(count).filter((id) => count[id] > 0)),
        ].map((idString) => ethers_1.BigNumber.from(idString));
        const multicall = new ethers_1.Contract(constants_1.MULTCALL2_ADDRESS, interfaces_1.Multicall2Interface, provider);
        const ownerCalls = historicalIds.map((id) => ({
            target: token.address,
            callData: interfaces_1.ERC721Interface.encodeFunctionData('ownerOf', [id]),
        }));
        const ownerReturnData = await multicall.callStatic.aggregate(ownerCalls);
        const ids = ownerReturnData[1]
            .map((data, index) => ({
            id: historicalIds[index],
            owner: interfaces_1.ERC721Interface.decodeFunctionResult('ownerOf', data)[0],
        })).filter((item) => (0, utils_1.getAddress)(item.owner) === (0, utils_1.getAddress)(address))
            .map((item) => item.id);
        const uriCalls = ids.map((id) => ({ target: token.address, callData: interfaces_1.ERC721Interface.encodeFunctionData('tokenURI', [id]) }));
        const uris = await multicall.callStatic.aggregate(uriCalls);
        if (liquidityPool) {
            const weightCalls = ids.map((id) => ({
                target: liquidityPool,
                callData: interfaces_1.ERC721PoolInterface.encodeFunctionData('getNFTWeight', [
                    id,
                ]),
            }));
            const weightResult = await multicall.callStatic.aggregate(weightCalls);
            const items = ids.map((id, index) => {
                const uri = interfaces_1.ERC721Interface.decodeFunctionResult('tokenURI', uris[1][index])[0];
                let weight = interfaces_1.ERC721PoolInterface.decodeFunctionResult('getNFTWeight', weightResult[1][index])[0];
                if (weight.eq(0))
                    weight = ethers_1.constants.WeiPerEther;
                return { id, uri, weight };
            });
            return items;
        }
        else {
            const items = ids.map((id, index) => {
                const uri = interfaces_1.ERC721Interface.decodeFunctionResult('tokenURI', uris[1][index])[0];
                return { id, uri };
            });
            return items;
        }
    }
    catch (error) {
        throw error;
    }
};
exports.getBalance = getBalance;
const createBalanceManager = (token, address, provider, liquidityPool = null, updateCallback) => new Promise(async (resolve, reject) => {
    try {
        const items = await (0, exports.getBalance)(token, address, provider, liquidityPool);
        resolve(new BalanceManager(token, address, provider, liquidityPool, items, updateCallback !== null && updateCallback !== void 0 ? updateCallback : null));
    }
    catch (error) {
        reject(error);
    }
});
exports.createBalanceManager = createBalanceManager;
class BalanceManager {
    constructor(token, address, provider, liquidityPool = null, items, updateCallback) {
        this.token = token;
        this.items = items;
        this.address = (0, utils_1.getAddress)(address);
        this.provider = provider;
        this.updateCallback = updateCallback !== null && updateCallback !== void 0 ? updateCallback : null;
        this._nft = new ethers_1.Contract(token.address, interfaces_1.ERC721Interface, provider);
        if (liquidityPool) {
            this._liquidityPool = new ethers_1.Contract(liquidityPool, interfaces_1.ERC721PoolInterface, provider);
            this._liquidityPoolAddr = liquidityPool;
        }
        if (this.updateCallback)
            this.updateCallback(this.items);
        this.provider.on({
            address: this.token.address,
            topics: [
                ethers_1.utils.id("Transfer(address,address,uint256)"),
                null,
                ethers_1.utils.hexZeroPad(this.address, 32)
            ]
        }, async (log) => {
            const { to, tokenId } = interfaces_1.ERC721Interface.decodeEventLog('Transfer', log.data, log.topics);
            let weight;
            if (this._liquidityPoolAddr) {
                weight = await this._liquidityPool.getNFTWeight(tokenId);
                if (weight.eq(0))
                    weight = ethers_1.constants.WeiPerEther;
            }
            const uri = this._nft.tokenURI(tokenId);
            if (to === this.address && this.items.findIndex((item) => item.id.eq(tokenId)) < 0) {
                if (weight)
                    this.items.push({ id: tokenId, weight, uri });
                else
                    this.items.push({ id: tokenId, uri });
            }
            else if (this._liquidityPoolAddr) {
                this.items[this.items.findIndex((item) => item.id.eq(tokenId))].weight = weight;
            }
            if (this.updateCallback)
                this.updateCallback(this.items);
        });
        this.provider.on({
            address: this.token.address,
            topics: [
                ethers_1.utils.id("Transfer(address,address,uint256)"),
                ethers_1.utils.hexZeroPad(this.address, 32)
            ]
        }, async (log) => {
            const { from, tokenId } = interfaces_1.ERC721Interface.decodeEventLog('Transfer', log.data, log.topics);
            if (from === this.address && this.items.findIndex((item) => item.id.eq(tokenId)) >= 0) {
                this.items.splice(this.items.findIndex((item) => item.id.eq(tokenId)), 1);
            }
            if (this.updateCallback)
                this.updateCallback(this.items);
        });
    }
    stopUpdates() {
        this.provider.removeAllListeners();
    }
}
exports.BalanceManager = BalanceManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9rZW5CYWxhbmNlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvdG9rZW5CYWxhbmNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBcUY7QUFDckYsNENBQThDO0FBQzlDLDJDQUFnRDtBQUVoRCw2Q0FJc0I7QUFHZixNQUFNLFVBQVUsR0FBRyxLQUFLLEVBQzdCLEtBQWEsRUFDYixPQUFlLEVBQ2YsUUFBNEIsRUFDNUIsZ0JBQXdCLElBQUksRUFDTCxFQUFFO0lBQ3pCLElBQUk7UUFDRixNQUFNLENBQUMsV0FBVyxFQUFFLFlBQVksQ0FBQyxHQUFHLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQztZQUNwRCxRQUFRLENBQUMsT0FBTyxDQUFDO2dCQUNmLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTztnQkFDdEIsU0FBUyxFQUFFLENBQUM7Z0JBQ1osTUFBTSxFQUFFO29CQUNOLGNBQUssQ0FBQyxFQUFFLENBQUMsbUNBQW1DLENBQUM7b0JBQzdDLElBQUk7b0JBQ0osY0FBSyxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDO2lCQUM5QjthQUNGLENBQUM7WUFDRixRQUFRLENBQUMsT0FBTyxDQUFDO2dCQUNmLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTztnQkFDdEIsU0FBUyxFQUFFLENBQUM7Z0JBQ1osTUFBTSxFQUFFO29CQUNOLGNBQUssQ0FBQyxFQUFFLENBQUMsbUNBQW1DLENBQUM7b0JBQzdDLGNBQUssQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQztpQkFDOUI7YUFDRixDQUFDO1NBQ0gsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxLQUFLLEdBQThCLEVBQUUsQ0FBQztRQUM1QyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7WUFDMUIsTUFBTSxFQUFFLE9BQU8sRUFBRSxHQUFHLDRCQUFlLENBQUMsY0FBYyxDQUNoRCxVQUFVLEVBQ1Ys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