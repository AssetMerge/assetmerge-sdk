import { Contract, providers } from 'ethers';
import { ERC721, ERC721Item } from './tokens';
export declare const getBalance: (token: ERC721, address: string, provider: providers.Provider, liquidityPool?: string) => Promise<ERC721Item[]>;
export declare const createBalanceManager: (token: ERC721, address: string, provider: providers.Provider, liquidityPool: string, updateCallback: (newData: any) => void) => Promise<BalanceManager>;
export declare class BalanceManager {
    token: ERC721;
    address: string;
    _nft: Contract;
    _liquidityPool: Contract;
    _liquidityPoolAddr: string;
    items: ERC721Item[];
    updateCallback: (newData: any) => void;
    provider: providers.Provider;
    constructor(token: ERC721, address: string, provider: providers.Provider, liquidityPool: string, items: ERC721Item[], updateCallback: (newData: ERC721Item[]) => void);
    stopUpdates(): void;
}
