"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiquidityPool = exports.createPool = void 0;
const ether_state_1 = require("ether-state");
const ethers_1 = require("ethers");
const utils_1 = require("ethers/lib/utils");
const constants_1 = require("../constants");
const interfaces_1 = require("../interfaces");
const tokenBalances_1 = require("./tokenBalances");
const createPool = (ftToken, nftToken, provider, itemCallBack, stateCallback) => new Promise(async (resolve, reject) => {
    try {
        const factory = new ethers_1.Contract(constants_1.PAIRFACTORY_ADDRESS, interfaces_1.PairFactoryInterface, provider);
        const pairAddress = await factory.getPair(constants_1.FACTORY_TEMPLATE, ftToken.address, nftToken.address);
        if (pairAddress !== ethers_1.constants.AddressZero) {
            const balanceManager = await (0, tokenBalances_1.createBalanceManager)(nftToken, pairAddress, provider, pairAddress, itemCallBack !== null && itemCallBack !== void 0 ? itemCallBack : null);
            resolve(new LiquidityPool(pairAddress, ftToken, nftToken, balanceManager, provider, stateCallback !== null && stateCallback !== void 0 ? stateCallback : null));
        }
        else {
            reject("CreatePool: Pair does not exist");
        }
    }
    catch (error) {
        reject(error);
    }
});
exports.createPool = createPool;
class LiquidityPool {
    constructor(pairAddress, ftToken, nftToken, balanceManager, provider, stateCallback) {
        this.address = (0, utils_1.getAddress)(pairAddress);
        this.ftToken = ftToken;
        this.nftToken = nftToken;
        this.nfts = balanceManager;
        this.stateCallback = stateCallback !== null && stateCallback !== void 0 ? stateCallback : null;
        this._sync = new ether_state_1.Sync([
            {
                trigger: ether_state_1.Trigger.BLOCK,
                input: () => [],
                output: (result) => {
                    this.ftReserves = result[0];
                    stateCallback({ ftReserves: this.ftReserves, nftReserves: this.nftReserves, lpSupply: this.lpSupply });
                },
                call: {
                    target: () => this.address,
                    interface: interfaces_1.ERC721PoolInterface,
                    selector: 'FT_RESERVES'
                }
            },
            {
                trigger: ether_state_1.Trigger.BLOCK,
                input: () => [],
                output: (result) => {
                    this.nftReserves = result[0];
                    stateCallback({ ftReserves: this.ftReserves, nftReserves: this.nftReserves, lpSupply: this.lpSupply });
                },
                call: {
                    target: () => this.address,
                    interface: interfaces_1.ERC721PoolInterface,
                    selector: 'GLOBAL_NFT_WEIGHT'
                }
            },
            {
                trigger: ether_state_1.Trigger.BLOCK,
                input: () => [],
                output: (result) => {
                    this.lpSupply = result[0];
                    stateCallback({ ftReserves: this.ftReserves, nftReserves: this.nftReserves, lpSupply: this.lpSupply });
                },
                call: {
                    target: () => pairAddress,
                    interface: interfaces_1.ERC721PoolInterface,
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
exports.LiquidityPool = LiquidityPool;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9vbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvcG9vbHMvcG9vbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2Q0FBNEM7QUFDNUMsbUNBQW1FO0FBQ25FLDRDQUE4QztBQUM5Qyw0Q0FBcUU7QUFDckUsOENBQTBFO0FBRzFFLG1EQUF1RTtBQUVoRSxNQUFNLFVBQVUsR0FBRyxDQUN4QixPQUFjLEVBQ2QsUUFBZ0IsRUFDaEIsUUFBNEIsRUFDNUIsWUFBb0MsRUFDcEMsYUFBcUMsRUFDckMsRUFBRSxDQUFDLElBQUksT0FBTyxDQUFnQixLQUFLLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO0lBQ3hELElBQUk7UUFDRixNQUFNLE9BQU8sR0FBRyxJQUFJLGlCQUFRLENBQUMsK0JBQW1CLEVBQUUsaUNBQW9CLEVBQUUsUUFBUSxDQUFDLENBQUE7UUFDakYsTUFBTSxXQUFXLEdBQUcsTUFBTSxPQUFPLENBQUMsT0FBTyxDQUFDLDRCQUFnQixFQUFFLE9BQU8sQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQzlGLElBQUksV0FBVyxLQUFLLGtCQUFTLENBQUMsV0FBVyxFQUFFO1lBQ3pDLE1BQU0sY0FBYyxHQUFHLE1BQU0sSUFBQSxvQ0FBb0IsRUFBQyxRQUFRLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsWUFBWSxhQUFaLFlBQVksY0FBWixZQUFZLEdBQUksSUFBSSxDQUFDLENBQUE7WUFDckgsT0FBTyxDQUFDLElBQUksYUFBYSxDQUFDLFdBQVcsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUUsYUFBYSxhQUFiLGFBQWEsY0FBYixhQUFhLEdBQUksSUFBSSxDQUFDLENBQUMsQ0FBQTtTQUM1RzthQUFNO1lBQ0wsTUFBTSxDQUFDLGlDQUFpQyxDQUFDLENBQUE7U0FDMUM7S0FDRjtJQUFDLE9BQU8sS0FBSyxFQUFFO1FBQ2QsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFBO0tBQ2Q7QUFDSCxDQUFDLENBQUMsQ0FBQTtBQW5CVyxRQUFBLFVBQVUsY0FtQnJCO0FBRUYsTUFBYSxhQUFhO0lBWXhCLFlBQVksV0FBbUIsRUFBRSxPQUFjLEVBQUUsUUFBZ0IsRUFBRSxjQUE4QixFQUFFLFFBQTRCLEVBQUUsYUFBcUM7UUFDcEssSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFBLGtCQUFVLEVBQUMsV0FBVyxDQUFDLENBQUE7UUFDdEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDekIsSUFBSSxDQUFDLElBQUksR0FBRyxjQUFjLENBQUM7UUFDM0IsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLGFBQWIsYUFBYSxjQUFiLGFBQWEsR0FBSSxJQUFJLENBQUE7UUFFMUMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLGtCQUFJLENBQUM7WUFDcEI7Z0JBQ0UsT0FBTyxFQUFFLHFCQUFPLENBQUMsS0FBSztnQkFDdEIsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUU7Z0JBQ2YsTUFBTSxFQUFFLENBQUMsTUFBbUIsRUFBRSxFQUFFO29CQUM5QixJQUFJLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQTtvQkFDM0IsYUFBYSxDQUFDLEVBQUUsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO2dCQUN4RyxDQUFDO2dCQUNELElBQUksRUFBRTtvQkFDSixNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU87b0JBQzFCLFNBQVMsRUFBRSxnQ0FBbUI7b0JBQzlCLFFBQVEsRUFBRSxhQUFhO2lCQUN4QjthQUNGO1lBQ0Q7Z0JBQ0UsT0FBTyxFQUFFLHFCQUFPLENBQUMsS0FBSztnQkFDdEIsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUU7Z0JBQ2YsTUFBTSxFQUFFLENBQUMsTUFBbUIsRUFBRSxFQUFFO29CQUM5QixJQUFJLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQTtvQkFDNUIsYUFBYSxDQUFDLEVBQUUsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO2dCQUN4RyxDQUFDO2dCQUNELElBQUksRUFBRTtvQkFDSixNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU87b0JBQzFCLFNBQVMsRUFBRSxnQ0FBbUI7b0JBQzlCLFFBQVEsRUFBRSxtQkFBbUI7aUJBQzlCO2FBQ0Y7WUFDRDtnQkFDRSxPQUFPLEVBQUUscUJBQU8sQ0FBQyxLQUFLO2dCQUN0QixLQUFLLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRTtnQkFDZixNQUFNLEVBQUUsQ0FBQyxNQUFtQixFQUFFLEVBQUU7b0JBQzlCLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFBO29CQUN6QixhQUFhLENBQUMsRUFBRSxVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUE7Z0JBQ3hHLENBQUM7Z0JBQ0QsSUFBSSxFQUFFO29CQUNKLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxXQUFXO29CQUN6QixTQUFTLEVBQUUsZ0NBQW1CO29CQUM5QixRQUFRLEVBQUUsYUFBYTtpQkFDeEI7YUFDRjtTQUNGLEVBQUUsUUFBUSxDQUFDLENBQUE7SUFDZCxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDeEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUN2QixDQUFDO0NBRUY7QUFuRUQsc0NBbUVDO0FBQUEsQ0FBQyJ9