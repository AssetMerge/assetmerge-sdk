import { constants, Contract } from 'ethers';
import { getAddress } from 'ethers/lib/utils';
import { MULTCALL2_ADDRESS } from './constants';
import { ERC165Interface, ERC20Interface, Multicall2Interface, } from './interfaces';
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
export const fetchERC20 = (tokenAddress, provider) => new Promise(async (resolve, reject) => {
    try {
        const address = getAddress(tokenAddress);
        const bytecode = await provider.getCode(address);
        if (bytecode === '0x')
            throw 'No contract at tokenAddress';
        const multicall = new Contract(MULTCALL2_ADDRESS, Multicall2Interface, provider);
        const calls = [
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
        const { returnData } = await multicall.callStatic.aggregate(calls);
        const [name, symbol, decimals] = [
            ERC20Interface.decodeFunctionResult('name', returnData[0])[0],
            ERC20Interface.decodeFunctionResult('symbol', returnData[1])[0],
            ERC20Interface.decodeFunctionResult('decimals', returnData[2])[0],
        ];
        resolve({ address, name, symbol, decimals });
    }
    catch (error) {
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
export const fetchERC721 = (tokenAddress, provider) => new Promise(async (resolve, reject) => {
    try {
        const address = getAddress(tokenAddress);
        const bytecode = await provider.getCode(address);
        if (bytecode === '0x')
            throw 'No contract at tokenAddress';
        const multicall = new Contract(MULTCALL2_ADDRESS, Multicall2Interface, provider);
        const calls = [
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
        const { returnData } = await multicall.callStatic.aggregate(calls);
        const [name, symbol, supportsInterface] = [
            ERC20Interface.decodeFunctionResult('name', returnData[0])[0],
            ERC20Interface.decodeFunctionResult('symbol', returnData[1])[0],
            ERC165Interface.decodeFunctionResult('supportsInterface', returnData[2])[0],
        ];
        if (!supportsInterface)
            throw 'tokenAddress does not support ERC165 ERC721 identifier';
        resolve({ address, name, symbol });
    }
    catch (error) {
        reject(error);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9rZW5zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi90b2tlbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFhLFNBQVMsRUFBRSxRQUFRLEVBQWEsTUFBTSxRQUFRLENBQUM7QUFDbkUsT0FBTyxFQUFhLFVBQVUsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ3pELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUVoRCxPQUFPLEVBQ0wsZUFBZSxFQUNmLGNBQWMsRUFDZCxtQkFBbUIsR0FDcEIsTUFBTSxjQUFjLENBQUM7QUF1QnRCOzs7Ozs7Ozs7O0dBVUc7QUFDSCxNQUFNLENBQUMsTUFBTSxVQUFVLEdBQUcsQ0FDeEIsWUFBb0IsRUFDcEIsUUFBNEIsRUFDWixFQUFFLENBQ2xCLElBQUksT0FBTyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7SUFDcEMsSUFBSTtRQUNGLE1BQU0sT0FBTyxHQUFHLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUN6QyxNQUFNLFFBQVEsR0FBRyxNQUFNLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDakQsSUFBSSxRQUFRLEtBQUssSUFBSTtZQUFFLE1BQU0sNkJBQTZCLENBQUM7UUFDM0QsTUFBTSxTQUFTLEdBQUcsSUFBSSxRQUFRLENBQzVCLGlCQUFpQixFQUNqQixtQkFBbUIsRUFDbkIsUUFBUSxDQUNULENBQUM7UUFDRixNQUFNLEtBQUssR0FBOEM7WUFDdkQ7Z0JBQ0UsTUFBTSxFQUFFLFlBQVk7Z0JBQ3BCLFFBQVEsRUFBRSxjQUFjLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDO2FBQ3BEO1lBQ0Q7Z0JBQ0UsTUFBTSxFQUFFLFlBQVk7Z0JBQ3BCLFFBQVEsRUFBRSxjQUFjLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDO2FBQ3REO1lBQ0Q7Z0JBQ0UsTUFBTSxFQUFF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