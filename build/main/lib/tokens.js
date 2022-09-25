"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchERC721 = exports.fetchERC20 = void 0;
const ethers_1 = require("ethers");
const utils_1 = require("ethers/lib/utils");
const constants_1 = require("./constants");
const interfaces_1 = require("./interfaces");
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
const fetchERC20 = (tokenAddress, provider) => new Promise(async (resolve, reject) => {
    try {
        const address = (0, utils_1.getAddress)(tokenAddress);
        const bytecode = await provider.getCode(address);
        if (bytecode === '0x')
            throw 'No contract at tokenAddress';
        const multicall = new ethers_1.Contract(constants_1.MULTCALL2_ADDRESS, interfaces_1.Multicall2Interface, provider);
        const calls = [
            {
                target: tokenAddress,
                callData: interfaces_1.ERC20Interface.encodeFunctionData('name'),
            },
            {
                target: tokenAddress,
                callData: interfaces_1.ERC20Interface.encodeFunctionData('symbol'),
            },
            {
                target: tokenAddress,
                callData: interfaces_1.ERC20Interface.encodeFunctionData('decimals'),
            },
            {
                target: tokenAddress,
                callData: interfaces_1.ERC20Interface.encodeFunctionData('totalSupply'),
            },
            {
                target: tokenAddress,
                callData: interfaces_1.ERC20Interface.encodeFunctionData('balanceOf', [
                    ethers_1.constants.AddressZero,
                ]),
            },
            {
                target: tokenAddress,
                callData: interfaces_1.ERC20Interface.encodeFunctionData('allowance', [
                    ethers_1.constants.AddressZero,
                    ethers_1.constants.AddressZero,
                ]),
            },
        ];
        const { returnData } = await multicall.callStatic.aggregate(calls);
        const [name, symbol, decimals] = [
            interfaces_1.ERC20Interface.decodeFunctionResult('name', returnData[0])[0],
            interfaces_1.ERC20Interface.decodeFunctionResult('symbol', returnData[1])[0],
            interfaces_1.ERC20Interface.decodeFunctionResult('decimals', returnData[2])[0],
        ];
        resolve({ address, name, symbol, decimals });
    }
    catch (error) {
        reject(error);
    }
});
exports.fetchERC20 = fetchERC20;
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
const fetchERC721 = (tokenAddress, provider) => new Promise(async (resolve, reject) => {
    try {
        const address = (0, utils_1.getAddress)(tokenAddress);
        const bytecode = await provider.getCode(address);
        if (bytecode === '0x')
            throw 'No contract at tokenAddress';
        const multicall = new ethers_1.Contract(constants_1.MULTCALL2_ADDRESS, interfaces_1.Multicall2Interface, provider);
        const calls = [
            {
                target: tokenAddress,
                callData: interfaces_1.ERC20Interface.encodeFunctionData('name'),
            },
            {
                target: tokenAddress,
                callData: interfaces_1.ERC20Interface.encodeFunctionData('symbol'),
            },
            {
                target: tokenAddress,
                callData: interfaces_1.ERC165Interface.encodeFunctionData('supportsInterface', [
                    '0x80ac58cd',
                ]),
            },
        ];
        const { returnData } = await multicall.callStatic.aggregate(calls);
        const [name, symbol, supportsInterface] = [
            interfaces_1.ERC20Interface.decodeFunctionResult('name', returnData[0])[0],
            interfaces_1.ERC20Interface.decodeFunctionResult('symbol', returnData[1])[0],
            interfaces_1.ERC165Interface.decodeFunctionResult('supportsInterface', returnData[2])[0],
        ];
        if (!supportsInterface)
            throw 'tokenAddress does not support ERC165 ERC721 identifier';
        resolve({ address, name, symbol });
    }
    catch (error) {
        reject(error);
    }
});
exports.fetchERC721 = fetchERC721;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9rZW5zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi90b2tlbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQW1FO0FBQ25FLDRDQUF5RDtBQUN6RCwyQ0FBZ0Q7QUFFaEQsNkNBSXNCO0FBdUJ0Qjs7Ozs7Ozs7OztHQVVHO0FBQ0ksTUFBTSxVQUFVLEdBQUcsQ0FDeEIsWUFBb0IsRUFDcEIsUUFBNEIsRUFDWixFQUFFLENBQ2xCLElBQUksT0FBTyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7SUFDcEMsSUFBSTtRQUNGLE1BQU0sT0FBTyxHQUFHLElBQUEsa0JBQVUsRUFBQyxZQUFZLENBQUMsQ0FBQztRQUN6QyxNQUFNLFFBQVEsR0FBRyxNQUFNLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDakQsSUFBSSxRQUFRLEtBQUssSUFBSTtZQUFFLE1BQU0sNkJBQTZCLENBQUM7UUFDM0QsTUFBTSxTQUFTLEdBQUcsSUFBSSxpQkFBUSxDQUM1Qiw2QkFBaUIsRUFDakIsZ0NBQW1CLEVBQ25CLFFBQVEsQ0FDVCxDQUFDO1FBQ0YsTUFBTSxLQUFLLEdBQThDO1lBQ3ZEO2dCQUNFLE1BQU0sRUFBRSxZQUFZO2dCQUNwQixRQUFRLEVBQUUsMkJBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUM7YUFDcEQ7WUFDRDtnQkFDRSxNQUFNLEVBQUUsWUFBWTtnQkFDcEIsUUFBUSxFQUFFLDJCQUFjLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDO2FBQ3REO1lBQ0Q7Z0JBQ0UsTUFBTSxFQUFFLFlBQVk7Z0JBQ3BCLFFBQVEsRUFBRSwyQkFBYyxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQzthQUN4RDtZQUNEO2dCQUNFLE1BQU0sRUFBRSxZQUFZO2dCQUNwQixRQUFRLEVBQUUsMkJBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLENBQUM7YUFDM0Q7WUFD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