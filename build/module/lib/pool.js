import { Sync, Trigger } from 'ether-state';
import { constants, Contract } from 'ethers';
import { getAddress } from 'ethers/lib/utils';
import { ETHER_FACTORY_TEMPLATE, FACTORY_TEMPLATE, PAIRFACTORY_ADDRESS } from './constants';
import { ERC721PoolInterface, PairFactoryInterface } from './interfaces';
import { createBalanceManager } from './tokenBalances';
export const createPool = (ftToken, nftToken, provider, itemCallBack, stateCallback) => new Promise(async (resolve, reject) => {
    try {
        const factory = new Contract(PAIRFACTORY_ADDRESS, PairFactoryInterface, provider);
        const pairAddress = await factory.getPair(FACTORY_TEMPLATE, ftToken.address, nftToken.address);
        if (pairAddress !== constants.AddressZero) {
            const balanceManager = await createBalanceManager(nftToken, pairAddress, provider, pairAddress, itemCallBack ?? null);
            resolve(new LiquidityPool(pairAddress, ftToken, nftToken, balanceManager, provider, stateCallback ?? null));
        }
        else {
            reject("CreatePool: Pair does not exist");
        }
    }
    catch (error) {
        reject(error);
    }
});
export class LiquidityPool {
    address;
    ftToken;
    nftToken;
    ftReserves;
    nftReserves;
    lpSupply;
    nfts;
    _sync;
    stateCallback;
    constructor(pairAddress, ftToken, nftToken, balanceManager, provider, stateCallback) {
        this.address = getAddress(pairAddress);
        this.ftToken = ftToken;
        this.nftToken = nftToken;
        this.nfts = balanceManager;
        this.stateCallback = stateCallback ?? null;
        this._sync = new Sync([
            {
                trigger: Trigger.BLOCK,
                input: () => [],
                output: (result) => {
                    this.ftReserves = result[0];
                    stateCallback({ ftReserves: this.ftReserves, nftReserves: this.nftReserves, lpSupply: this.lpSupply });
                },
                call: {
                    target: () => this.address,
                    interface: ERC721PoolInterface,
                    selector: 'FT_RESERVES'
                }
            },
            {
                trigger: Trigger.BLOCK,
                input: () => [],
                output: (result) => {
                    this.nftReserves = result[0];
                    stateCallback({ ftReserves: this.ftReserves, nftReserves: this.nftReserves, lpSupply: this.lpSupply });
                },
                call: {
                    target: () => this.address,
                    interface: ERC721PoolInterface,
                    selector: 'GLOBAL_NFT_WEIGHT'
                }
            },
            {
                trigger: Trigger.BLOCK,
                input: () => [],
                output: (result) => {
                    this.lpSupply = result[0];
                    stateCallback({ ftReserves: this.ftReserves, nftReserves: this.nftReserves, lpSupply: this.lpSupply });
                },
                call: {
                    target: () => pairAddress,
                    interface: ERC721PoolInterface,
                    selector: 'totalSupply'
                }
            }
        ], provider);
    }
    stopUpdates() {
        this.nfts.stopUpdates();
        this._sync.destroy();
    }
}
;
export const createEtherPool = (nftToken, provider, itemCallBack, stateCallback) => new Promise(async (resolve, reject) => {
    try {
        const factory = new Contract(PAIRFACTORY_ADDRESS, PairFactoryInterface, provider);
        const pairAddress = await factory.getPair(ETHER_FACTORY_TEMPLATE, constants.AddressZero, nftToken.address);
        if (pairAddress !== constants.AddressZero) {
            const balanceManager = await createBalanceManager(nftToken, pairAddress, provider, pairAddress, itemCallBack ?? null);
            resolve(new EtherLiquidityPool(pairAddress, nftToken, balanceManager, provider, stateCallback ?? null));
        }
        else {
            reject("CreatePool: Pair does not exist");
        }
    }
    catch (error) {
        reject(error);
    }
});
export class EtherLiquidityPool {
    address;
    nftToken;
    ftReserves;
    nftReserves;
    lpSupply;
    nfts;
    _sync;
    stateCallback;
    constructor(pairAddress, nftToken, balanceManager, provider, stateCallback) {
        this.address = getAddress(pairAddress);
        this.nftToken = nftToken;
        this.nfts = balanceManager;
        this.stateCallback = stateCallback ?? null;
        this._sync = new Sync([
            {
                trigger: Trigger.BLOCK,
                input: () => [],
                output: (result) => {
                    this.ftReserves = result[0];
                    stateCallback({ ftReserves: this.ftReserves, nftReserves: this.nftReserves, lpSupply: this.lpSupply });
                },
                call: {
                    target: () => this.address,
                    interface: ERC721PoolInterface,
                    selector: 'FT_RESERVES'
                }
            },
            {
                trigger: Trigger.BLOCK,
                input: () => [],
                output: (result) => {
                    this.nftReserves = result[0];
                    stateCallback({ ftReserves: this.ftReserves, nftReserves: this.nftReserves, lpSupply: this.lpSupply });
                },
                call: {
                    target: () => this.address,
                    interface: ERC721PoolInterface,
                    selector: 'GLOBAL_NFT_WEIGHT'
                }
            },
            {
                trigger: Trigger.BLOCK,
                input: () => [],
                output: (result) => {
                    this.lpSupply = result[0];
                    stateCallback({ ftReserves: this.ftReserves, nftReserves: this.nftReserves, lpSupply: this.lpSupply });
                },
                call: {
                    target: () => pairAddress,
                    interface: ERC721PoolInterface,
                    selector: 'totalSupply'
                }
            }
        ], provider);
    }
    stopUpdates() {
        this.nfts.stopUpdates();
        this._sync.destroy();
    }
}
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9vbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvcG9vbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUM1QyxPQUFPLEVBQWEsU0FBUyxFQUFFLFFBQVEsRUFBYSxNQUFNLFFBQVEsQ0FBQztBQUNuRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDOUMsT0FBTyxFQUFFLHNCQUFzQixFQUFFLGdCQUFnQixFQUFFLG1CQUFtQixFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQzVGLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUd6RSxPQUFPLEVBQWtCLG9CQUFvQixFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFdkUsTUFBTSxDQUFDLE1BQU0sVUFBVSxHQUFHLENBQ3hCLE9BQWMsRUFDZCxRQUFnQixFQUNoQixRQUE0QixFQUM1QixZQUFvQyxFQUNwQyxhQUFxQyxFQUNyQyxFQUFFLENBQUMsSUFBSSxPQUFPLENBQWdCLEtBQUssRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7SUFDeEQsSUFBSTtRQUNGLE1BQU0sT0FBTyxHQUFHLElBQUksUUFBUSxDQUFDLG1CQUFtQixFQUFFLG9CQUFvQixFQUFFLFFBQVEsQ0FBQyxDQUFBO1FBQ2pGLE1BQU0sV0FBVyxHQUFHLE1BQU0sT0FBTyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxPQUFPLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUM5RixJQUFJLFdBQVcsS0FBSyxTQUFTLENBQUMsV0FBVyxFQUFFO1lBQ3pDLE1BQU0sY0FBYyxHQUFHLE1BQU0sb0JBQW9CLENBQUMsUUFBUSxFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLFlBQVksSUFBSSxJQUFJLENB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