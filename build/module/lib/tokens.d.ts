import { BigNumber, providers } from 'ethers';
export declare type ERC20 = {
    /** Contract address of token */
    address: string;
    name: string;
    symbol: string;
    decimals: number;
};
export declare type ERC721 = {
    /** Contract address of token */
    address: string;
    name: string;
    symbol: string;
};
export declare type ERC721Item = {
    id: BigNumber;
    uri: string;
    weight?: BigNumber;
};
/**
 * Fetches ERC20 details and returns an [[`ERC20`]] object
 *
 * @param provider - A valid Ethers provider or signer
 * ### Example
 * ```ts
 * import { fetchERC20 } from '@assetmerge/sdk'
 * await fetchERC20('0x6B175474E89094C44Da98b954EedeAC495271d0F')
 * // => ERC20 { address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', name: 'Dai Stablecoin', symbol: 'DAI', decimals: 18 }
 * ```
 */
export declare const fetchERC20: (tokenAddress: string, provider: providers.Provider) => Promise<ERC20>;
/**
 * Fetches ERC721 details and returns an [[`ERC721`]] object
 *
 * @param provider - A valid Ethers provider or signer
 * ### Example
 * ```ts
 * import { fetchERC721 } from '@assetmerge/sdk'
 * await fetchERC721('0x6B175474E89094C44Da98b954EedeAC495271d0F')
 * // => ERC721 { address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', name: 'Dai Stablecoin', symbol: 'DAI', decimals: 18 }
 * ```
 */
export declare const fetchERC721: (tokenAddress: string, provider: providers.Provider) => Promise<ERC721>;
