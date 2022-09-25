import { Sync, Trigger } from 'ether-state';
import { constants, Contract } from 'ethers';
import { getAddress } from 'ethers/lib/utils';
import { FACTORY_TEMPLATE, PAIRFACTORY_ADDRESS } from '../constants';
import { ERC721PoolInterface, PairFactoryInterface } from '../interfaces';
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
    provider;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9vbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvcG9vbHMvcG9vbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUM1QyxPQUFPLEVBQWEsU0FBUyxFQUFFLFFBQVEsRUFBYSxNQUFNLFFBQVEsQ0FBQztBQUNuRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDOUMsT0FBTyxFQUFFLGdCQUFnQixFQUFFLG1CQUFtQixFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQ3JFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUcxRSxPQUFPLEVBQWtCLG9CQUFvQixFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFdkUsTUFBTSxDQUFDLE1BQU0sVUFBVSxHQUFHLENBQ3hCLE9BQWMsRUFDZCxRQUFnQixFQUNoQixRQUE0QixFQUM1QixZQUFvQyxFQUNwQyxhQUFxQyxFQUNyQyxFQUFFLENBQUMsSUFBSSxPQUFPLENBQWdCLEtBQUssRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7SUFDeEQsSUFBSTtRQUNGLE1BQU0sT0FBTyxHQUFHLElBQUksUUFBUSxDQUFDLG1CQUFtQixFQUFFLG9CQUFvQixFQUFFLFFBQVEsQ0FBQyxDQUFBO1FBQ2pGLE1BQU0sV0FBVyxHQUFHLE1BQU0sT0FBTyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxPQUFPLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUM5RixJQUFJLFdBQVcsS0FBSyxTQUFTLENBQUMsV0FBVyxFQUFFO1lBQ3pDLE1BQU0sY0FBYyxHQUFHLE1BQU0sb0JBQW9CLENBQUMsUUFBUSxFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLFlBQVksSUFBSSxJQUFJLENBQUMs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