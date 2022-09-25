"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const ethers_1 = require("ethers");
const utils_1 = require("ethers/lib/utils");
const tokens_1 = require("./tokens");
(0, ava_1.default)('ERC721 Populate', async (t) => {
    const provider = ethers_1.providers.getDefaultProvider();
    const token = await (0, tokens_1.fetchERC721)('0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D', provider);
    t.is(token.name, 'BoredApeYachtClub');
    t.is(token.symbol, 'BAYC');
    t.is(token.address, (0, utils_1.getAddress)('0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D'));
});
(0, ava_1.default)('ERC20 Populate', async (t) => {
    const provider = ethers_1.providers.getDefaultProvider();
    const token = await (0, tokens_1.fetchERC20)('0x6B175474E89094C44Da98b954EedeAC495271d0F', provider);
    t.is(token.name, 'Dai Stablecoin');
    t.is(token.symbol, 'DAI');
    t.is(token.decimals, 18);
    t.is(token.address, (0, utils_1.getAddress)('0x6B175474E89094C44Da98b954EedeAC495271d0F'));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9rZW5zLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3Rva2Vucy5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsOENBQXVCO0FBQ3ZCLG1DQUFtQztBQUNuQyw0Q0FBOEM7QUFFOUMscUNBQWtFO0FBRWxFLElBQUEsYUFBSSxFQUFDLGlCQUFpQixFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUNsQyxNQUFNLFFBQVEsR0FBRyxrQkFBUyxDQUFDLGtCQUFrQixFQUFFLENBQUM7SUFDaEQsTUFBTSxLQUFLLEdBQVcsTUFBTSxJQUFBLG9CQUFXLEVBQ3JDLDRDQUE0QyxFQUM1QyxRQUFRLENBQ1QsQ0FBQztJQUNGLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO0lBQ3RDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztJQUMzQixDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsSUFBQSxrQkFBVSxFQUFDLDRDQUE0QyxDQUFDLENBQUMsQ0FBQztBQUNoRixDQUFDLENBQUMsQ0FBQztBQUVILElBQUEsYUFBSSxFQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUNqQyxNQUFNLFFBQVEsR0FBRyxrQkFBUyxDQUFDLGtCQUFrQixFQUFFLENBQUM7SUFDaEQsTUFBTSxLQUFLLEdBQVUsTUFBTSxJQUFBLG1CQUFVLEVBQ25DLDRDQUE0QyxFQUM1QyxRQUFRLENBQ1QsQ0FBQztJQUNGLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ25DLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztJQUMxQixDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDekIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLElBQUEsa0JBQVUsRUFBQyw0Q0FBNEMsQ0FBQyxDQUFDLENBQUM7QUFDaEYsQ0FBQyxDQUFDLENBQUMifQ==