import { BigNumber, constants, Contract, providers } from 'ethers';
import { BytesLike, getAddress } from 'ethers/lib/utils';
import { MULTCALL2_ADDRESS } from './constants';

import {
  ERC165Interface,
  ERC20Interface,
  Multicall2Interface,
} from './interfaces';

export type ERC20 = {
  /** Contract address of token */
  address: string;
  name: string;
  symbol: string;
  decimals: number;
};

export type ERC721 = {
  /** Contract address of token */
  address: string;
  name: string;
  symbol: string;
};

export type ERC721Item = {
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
export const fetchERC20 = (
  tokenAddress: string,
  provider: providers.Provider
): Promise<ERC20> =>
  new Promise(async (resolve, reject) => {
    try {
      const address = getAddress(tokenAddress);
      const bytecode = await provider.getCode(address);
      if (bytecode === '0x') throw 'No contract at tokenAddress';
      const multicall = new Contract(
        MULTCALL2_ADDRESS,
        Multicall2Interface,
        provider
      );
      const calls: { target: string; callData: BytesLike }[] = [
        {
          target: tokenAddress,
          callData: ERC20Interface.encodeFunctionData('name'),
        },
        {
          target: tokenAddress,
          callData: ERC20Interface.encodeFunctionData('symbol'),
        },
        {
          target: tokenAddress,
          callData: ERC20Interface.encodeFunctionData('decimals'),
        },
        {
          target: tokenAddress,
          callData: ERC20Interface.encodeFunctionData('totalSupply'),
        },
        {
          target: tokenAddress,
          callData: ERC20Interface.encodeFunctionData('balanceOf', [
            constants.AddressZero,
          ]),
        },
        {
          target: tokenAddress,
          callData: ERC20Interface.encodeFunctionData('allowance', [
            constants.AddressZero,
            constants.AddressZero,
          ]),
        },
      ];
      const { returnData }: { returnData: BytesLike[] } =
        await multicall.callStatic.aggregate(calls);
      const [name, symbol, decimals] = [
        ERC20Interface.decodeFunctionResult('name', returnData[0])[0],
        ERC20Interface.decodeFunctionResult('symbol', returnData[1])[0],
        ERC20Interface.decodeFunctionResult('decimals', returnData[2])[0],
      ];
      resolve({ address, name, symbol, decimals });
    } catch (error) {
      reject(error);
    }
  });

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
export const fetchERC721 = (
  tokenAddress: string,
  provider: providers.Provider
): Promise<ERC721> =>
  new Promise(async (resolve, reject) => {
    try {
      const address = getAddress(tokenAddress);
      const bytecode = await provider.getCode(address);
      if (bytecode === '0x') throw 'No contract at tokenAddress';
      const multicall = new Contract(
        MULTCALL2_ADDRESS,
        Multicall2Interface,
        provider
      );
      const calls: { target: string; callData: BytesLike }[] = [
        {
          target: tokenAddress,
          callData: ERC20Interface.encodeFunctionData('name'),
        },
        {
          target: tokenAddress,
          callData: ERC20Interface.encodeFunctionData('symbol'),
        },
        {
          target: tokenAddress,
          callData: ERC165Interface.encodeFunctionData('supportsInterface', [
            '0x80ac58cd',
          ]),
        },
      ];
      const { returnData }: { returnData: BytesLike[] } =
        await multicall.callStatic.aggregate(calls);
      const [name, symbol, supportsInterface] = [
        ERC20Interface.decodeFunctionResult('name', returnData[0])[0],
        ERC20Interface.decodeFunctionResult('symbol', returnData[1])[0],
        ERC165Interface.decodeFunctionResult(
          'supportsInterface',
          returnData[2]
        )[0],
      ];
      if (!supportsInterface)
        throw 'tokenAddress does not support ERC165 ERC721 identifier';
      resolve({ address, name, symbol });
    } catch (error) {
      reject(error);
    }
  });
