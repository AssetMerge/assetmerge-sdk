import { Sync, Trigger } from 'ether-state';
import { BigNumber, constants, Contract, providers } from 'ethers';
import { getAddress } from 'ethers/lib/utils';
import { FACTORY_TEMPLATE, PAIRFACTORY_ADDRESS } from '../constants';
import { ERC721PoolInterface, PairFactoryInterface } from '../interfaces';

import { ERC20, ERC721 } from '../tokens';
import { BalanceManager, createBalanceManager } from './tokenBalances';

export const createPool = (
  ftToken: ERC20,
  nftToken: ERC721,
  provider: providers.BaseProvider,
  itemCallBack: (newData: any) => void,
  stateCallback: (newData: any) => void
) => new Promise<LiquidityPool>(async (resolve, reject) => {
  try {
    const factory = new Contract(PAIRFACTORY_ADDRESS, PairFactoryInterface, provider)
    const pairAddress = await factory.getPair(FACTORY_TEMPLATE, ftToken.address, nftToken.address)
    if (pairAddress === constants.AddressZero) reject("CreatePool: Pair does not exist")
    const balanceManager = await createBalanceManager(nftToken, pairAddress, provider, pairAddress, itemCallBack ?? null)
    resolve(new LiquidityPool(pairAddress, ftToken, nftToken, balanceManager, provider, stateCallback ?? null))
  } catch (error) {
    reject(error)
  }
})

export class LiquidityPool {
  address: string;
  ftToken: ERC20;
  nftToken: ERC721;
  ftReserves: BigNumber;
  nftReserves: BigNumber;
  nfts: BalanceManager;
  provider: providers.BaseProvider
  _sync: Sync
  stateCallback: (newData: { ftReserves: BigNumber, nftReserves: BigNumber }) => void

  constructor(pairAddress: string, ftToken: ERC20, nftToken: ERC721, balanceManager: BalanceManager, provider: providers.BaseProvider, stateCallback: (newData: any) => void) {
    this.address = getAddress(pairAddress)
    this.ftToken = ftToken;
    this.nftToken = nftToken;
    this.nfts = balanceManager;
    this.stateCallback = stateCallback ?? null

    this._sync = new Sync([
      {
        trigger: Trigger.BLOCK,
        input: () => [],
        output: (result: [BigNumber]) => {
          this.ftReserves = result[0]
          stateCallback({ ftReserves: this.ftReserves, nftReserves: this.nftReserves })
        },
        call: {
          target: () => pairAddress,
          interface: ERC721PoolInterface,
          selector: 'FT_RESERVES'
        }
      },
      {
        trigger: Trigger.BLOCK,
        input: () => [],
        output: (result: [BigNumber]) => {
          this.nftReserves = result[0]
          stateCallback({ ftReserves: this.ftReserves, nftReserves: this.nftReserves })
        },
        call: {
          target: () => pairAddress,
          interface: ERC721PoolInterface,
          selector: 'GLOBAL_NFT_WEIGHT'
        }
      }
    ], provider)
  }

  stopUpdates() {
    this.nfts.stopUpdates();
    this._sync.destroy();
  }

};
