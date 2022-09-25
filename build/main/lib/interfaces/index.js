"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERC165Interface = exports.ERC721Interface = exports.Multicall2Interface = exports.ERC20Interface = exports.ERC721PoolInterface = exports.PairFactoryInterface = void 0;
const utils_1 = require("ethers/lib/utils");
const ERC721Pool_json_1 = __importDefault(require("./ERC721Pool.json"));
const ERC721_json_1 = __importDefault(require("./ERC721.json"));
const ERC20_json_1 = __importDefault(require("./ERC20.json"));
const Multicall2_json_1 = __importDefault(require("./Multicall2.json"));
const PairFactory_json_1 = __importDefault(require("./PairFactory.json"));
/** @ignore */
exports.PairFactoryInterface = new utils_1.Interface(PairFactory_json_1.default);
/** @ignore */
exports.ERC721PoolInterface = new utils_1.Interface(ERC721Pool_json_1.default);
/** @ignore */
exports.ERC20Interface = new utils_1.Interface(ERC20_json_1.default);
/** @ignore */
exports.Multicall2Interface = new utils_1.Interface(Multicall2_json_1.default);
/** @ignore */
exports.ERC721Interface = new utils_1.Interface(ERC721_json_1.default);
/** @ignore */
exports.ERC165Interface = new utils_1.Interface([
    {
        inputs: [
            {
                internalType: 'bytes4',
                name: 'interfaceId',
                type: 'bytes4',
            },
        ],
        name: 'supportsInterface',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL2ludGVyZmFjZXMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsNENBQTZDO0FBRTdDLHdFQUE4QztBQUM5QyxnRUFBc0M7QUFDdEMsOERBQW9DO0FBQ3BDLHdFQUE4QztBQUM5QywwRUFBZ0Q7QUFFaEQsY0FBYztBQUNELFFBQUEsb0JBQW9CLEdBQUcsSUFBSSxpQkFBUyxDQUFDLDBCQUFjLENBQUMsQ0FBQztBQUVsRSxjQUFjO0FBQ0QsUUFBQSxtQkFBbUIsR0FBRyxJQUFJLGlCQUFTLENBQUMseUJBQWEsQ0FBQyxDQUFDO0FBRWhFLGNBQWM7QUFDRCxRQUFBLGNBQWMsR0FBRyxJQUFJLGlCQUFTLENBQUMsb0JBQVEsQ0FBQyxDQUFDO0FBRXRELGNBQWM7QUFDRCxRQUFBLG1CQUFtQixHQUFHLElBQUksaUJBQVMsQ0FBQyx5QkFBYSxDQUFDLENBQUM7QUFFaEUsY0FBYztBQUNELFFBQUEsZUFBZSxHQUFHLElBQUksaUJBQVMsQ0FBQyxxQkFBUyxDQUFDLENBQUM7QUFFeEQsY0FBYztBQUNELFFBQUEsZUFBZSxHQUFHLElBQUksaUJBQVMsQ0FBQztJQUMzQztRQUNFLE1BQU0sRUFBRTtZQUNOO2dCQUNFLFlBQVksRUFBRSxRQUFRO2dCQUN0QixJQUFJLEVBQUUsYUFBYTtnQkFDbkIsSUFBSSxFQUFFLFFBQVE7YUFDZjtTQUNGO1FBQ0QsSUFBSSxFQUFFLG1CQUFtQjtRQUN6QixPQUFPLEVBQUU7WUFDUDtnQkFDRSxZQUFZLEVBQUUsTUFBTTtnQkFDcEIsSUFBSSxFQUFFLEVBQUU7Z0JBQ1IsSUFBSSxFQUFFLE1BQU07YUFDYjtTQUNGO1FBQ0QsZUFBZSxFQUFFLE1BQU07UUFDdkIsSUFBSSxFQUFFLFVBQVU7S0FDakI7Q0FDRixDQUFDLENBQUMifQ==