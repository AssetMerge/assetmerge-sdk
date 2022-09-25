"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalanceManager = exports.createBalanceManager = exports.getBalance = void 0;
const ethers_1 = require("ethers");
const utils_1 = require("ethers/lib/utils");
const constants_1 = require("../constants");
const interfaces_1 = require("../interfaces");
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
                const weight = interfaces_1.ERC721PoolInterface.decodeFunctionResult('getNFTWeight', weightResult[index])[0];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9rZW5CYWxhbmNlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvcG9vbHMvdG9rZW5CYWxhbmNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBMEU7QUFDMUUsNENBQThDO0FBQzlDLDRDQUFpRDtBQUVqRCw4Q0FJdUI7QUFHaEIsTUFBTSxVQUFVLEdBQUcsS0FBSyxFQUM3QixLQUFhLEVBQ2IsT0FBZSxFQUNmLFFBQTRCLEVBQzVCLGdCQUF3QixJQUFJLEVBQ0wsRUFBRTtJQUN6QixJQUFJO1FBQ0YsTUFBTSxDQUFDLFdBQVcsRUFBRSxZQUFZLENBQUMsR0FBRyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUM7WUFDcEQsUUFBUSxDQUFDLE9BQU8sQ0FBQztnQkFDZixPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU87Z0JBQ3RCLFNBQVMsRUFBRSxDQUFDO2dCQUNaLE1BQU0sRUFBRTtvQkFDTixjQUFLLENBQUMsRUFBRSxDQUFDLG1DQUFtQyxDQUFDO29CQUM3QyxJQUFJO29CQUNKLGNBQUssQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQztpQkFDOUI7YUFDRixDQUFDO1lBQ0YsUUFBUSxDQUFDLE9BQU8sQ0FBQztnQkFDZixPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU87Z0JBQ3RCLFNBQVMsRUFBRSxDQUFDO2dCQUNaLE1BQU0sRUFBRTtvQkFDTixjQUFLLENBQUMsRUFBRSxDQUFDLG1DQUFtQyxDQUFDO29CQUM3QyxjQUFLLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUM7aUJBQzlCO2FBQ0YsQ0FBQztTQUNILENBQUMsQ0FBQztRQUNILE1BQU0sS0FBSyxHQUE4QixFQUFFLENBQUM7UUFDNUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQzFCLE1BQU0sRUFBRSxPQUFPLEVBQUUsR0FBRyw0QkFBZSxDQUFDLGNBQWMsQ0FDaEQs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