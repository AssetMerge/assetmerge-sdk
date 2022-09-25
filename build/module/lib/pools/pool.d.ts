import { Sync } from 'ether-state';
import { BigNumber, providers } from 'ethers';
import { ERC20, ERC721 } from '../tokens';
import { BalanceManager } from './tokenBalances';
export declare const createPool: (ftToken: ERC20, nftToken: ERC721, provider: providers.Provider, itemCallBack: (newData: any) => void, stateCallback: (newData: any) => void) => Promise<LiquidityPool>;
export declare class LiquidityPool {
    address: string;
    ftToken: ERC20;
    nftToken: ERC721;
    ftReserves: BigNumber;
    nftReserves: BigNumber;
    lpSupply: BigNumber;
    nfts: BalanceManager;
    provider: providers.Provider;
    _sync: Sync;
    stateCallback: (newData: {
        ftReserves: BigNumber;
        nftReserves: BigNumber;
    }) => void;
    constructor(pairAddress: string, ftToken: ERC20, nftToken: ERC721, balanceManager: BalanceManager, provider: providers.Provider, stateCallback: (newData: any) => void);
    stopUpdates(): void;
}
