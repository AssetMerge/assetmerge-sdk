"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const ethers_1 = require("ethers");
const tokens_1 = require("../tokens");
const tokenBalances_1 = require("./tokenBalances");
(0, ava_1.default)('Fetch token balances', async (t) => {
    const provider = ethers_1.providers.getDefaultProvider();
    const token = await (0, tokens_1.fetchERC721)('0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D', provider);
    const items = await (0, tokenBalances_1.getBalance)(token, '0xb88f61e6fbda83fbfffabe364112137480398018', provider);
    t.true(items.length > 0);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9rZW5CYWxhbmNlcy5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9wb29scy90b2tlbkJhbGFuY2VzLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw4Q0FBdUI7QUFDdkIsbUNBQW1DO0FBRW5DLHNDQUFnRDtBQUVoRCxtREFBNkM7QUFFN0MsSUFBQSxhQUFJLEVBQUMsc0JBQXNCLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO0lBQ3ZDLE1BQU0sUUFBUSxHQUFHLGtCQUFTLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztJQUNoRCxNQUFNLEtBQUssR0FBVyxNQUFNLElBQUEsb0JBQVcsRUFDckMsNENBQTRDLEVBQzVDLFFBQVEsQ0FDVCxDQUFDO0lBQ0YsTUFBTSxLQUFLLEdBQUcsTUFBTSxJQUFBLDBCQUFVLEVBQzVCLEtBQUssRUFDTCw0Q0FBNEMsRUFDNUMsUUFBUSxDQUNULENBQUM7SUFDRixDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDM0IsQ0FBQyxDQUFDLENBQUMifQ==