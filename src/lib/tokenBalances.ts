import { BigNumber, BytesLike, constants, Contract, providers, utils } from 'ethers';
import { getAddress } from 'ethers/lib/utils';
import { MULTCALL2_ADDRESS } from './constants';

import {
  ERC721Interface,
  ERC721PoolInterface,
  Multicall2Interface,
} from './interfaces';
import { ERC721, ERC721Item } from './tokens';

export const getBalance = async (
  token: ERC721,
  address: string,
  provider: providers.Provider,
  liquidityPool: string = null
): Promise<ERC721Item[]> => {
  try {
    const [inTransfers, outTransfers] = await Promise.all([
      provider.getLogs({
        address: token.address,
        fromBlock: 0,
        topics: [
          utils.id('Transfer(address,address,uint256)'),
          null,
          utils.hexZeroPad(address, 32),
        ],
      }),
      provider.getLogs({
        address: token.address,
        fromBlock: 0,
        topics: [
          utils.id('Transfer(address,address,uint256)'),
          utils.hexZeroPad(address, 32),
        ],
      }),
    ]);
    const count: { [key: string]: number } = {};
    inTransfers.forEach((log) => {
      const { tokenId } = ERC721Interface.decodeEventLog(
        'Transfer',
        log.data,
        log.topics
      );
      const id = tokenId.toString();
      if (count[id]) count[id] = count[id] + 1;
      else count[id] = 1;
    });
    outTransfers.forEach((log) => {
      const { tokenId } = ERC721Interface.decodeEventLog(
        'Transfer',
        log.data,
        log.topics
      );
      const id = tokenId.toString();
      if (count[id]) count[id] = count[id] - 1;
    });
    const historicalIds: BigNumber[] = [
      ...new Set(Object.keys(count).filter((id) => count[id] > 0)),
    ].map((idString) => BigNumber.from(idString));
    const multicall = new Contract(
      MULTCALL2_ADDRESS,
      Multicall2Interface,
      provider
    );
    const ownerCalls: { target: string; callData: BytesLike }[] =
      historicalIds.map((id) => ({
        target: token.address,
        callData: ERC721Interface.encodeFunctionData('ownerOf', [id]),
      }));
    const ownerReturnData = await multicall.callStatic.aggregate(ownerCalls);
    const ids: BigNumber[] = ownerReturnData[1]
      .map((data: BytesLike, index: number) => ({
        id: historicalIds[index],
        owner: ERC721Interface.decodeFunctionResult('ownerOf', data)[0],
      })).filter(
        (item: { owner: string }) =>
          getAddress(item.owner) === getAddress(address)
      )
      .map((item: { id: BigNumber }) => item.id);

    const uriCalls: { target: string; callData: BytesLike }[] = ids.map((id) => ({ target: token.address, callData: ERC721Interface.encodeFunctionData('tokenURI', [id]) }));
    const uris = await multicall.callStatic.aggregate(uriCalls);

    if (liquidityPool) {
      const weightCalls: { target: string; callData: BytesLike }[] =
        ids.map((id) => ({
          target: liquidityPool,
          callData: ERC721PoolInterface.encodeFunctionData('getNFTWeight', [
            id,
          ]),
        }));
      const weightResult = await multicall.callStatic.aggregate(weightCalls);

      const items: ERC721Item[] = ids.map((id, index) => {
        const uri = ERC721Interface.decodeFunctionResult('tokenURI', uris[1][index])[0]
        let weight = ERC721PoolInterface.decodeFunctionResult('getNFTWeight', weightResult[1][index])[0]
        if (weight.eq(0)) weight = constants.WeiPerEther
        return { id, uri, weight }
      })
      return items;

    } else {
      const items: ERC721Item[] = ids.map((id, index) => {
        const uri = ERC721Interface.decodeFunctionResult('tokenURI', uris[1][index])[0]
        return { id, uri }
      })
      return items;
    }
  } catch (error) {
    throw error;
  }
};

export const createBalanceManager = (token: ERC721, address: string, provider: providers.Provider, liquidityPool: string = null, updateCallback: (newData: any) => void): Promise<BalanceManager> => new Promise<BalanceManager>(async (resolve, reject) => {
  try {
    const items = await getBalance(token, address, provider, liquidityPool)
    resolve(new BalanceManager(token, address, provider, liquidityPool, items, updateCallback ?? null))
  } catch (error) {
    reject(error)
  }
})

export class BalanceManager {
  token: ERC721;
  address: string;
  _nft: Contract;
  _liquidityPool: Contract;
  _liquidityPoolAddr: string;
  items: ERC721Item[]
  updateCallback: (newData: any) => void
  provider: providers.Provider

  constructor(
    token: ERC721,
    address: string,
    provider: providers.Provider,
    liquidityPool: string = null,
    items: ERC721Item[],
    updateCallback: (newData: ERC721Item[]) => void
  ) {
    this.token = token;
    this.items = items
    this.address = getAddress(address);
    this.provider = provider
    this.updateCallback = updateCallback ?? null
    this._nft = new Contract(token.address, ERC721Interface, provider)
    if (liquidityPool) {
      this._liquidityPool = new Contract(liquidityPool, ERC721PoolInterface, provider)
      this._liquidityPoolAddr = liquidityPool
    }
    if (this.updateCallback) this.updateCallback(this.items)

    this.provider.on({
      address: this.token.address,
      topics: [
        utils.id("Transfer(address,address,uint256)"),
        null,
        utils.hexZeroPad(this.address, 32)
      ]
    }, async (log: { data: BytesLike, topics: string[] }) => {
      const { to, tokenId } = ERC721Interface.decodeEventLog('Transfer', log.data, log.topics)
      let weight: BigNumber
      if (this._liquidityPoolAddr) {
        weight = await this._liquidityPool.getNFTWeight(tokenId)
        if (weight.eq(0)) weight = constants.WeiPerEther
      }
      const uri = this._nft.tokenURI(tokenId)
      if (to === this.address && this.items.findIndex((item) => item.id.eq(tokenId)) < 0) {
        if (weight) this.items.push({ id: tokenId, weight, uri })
        else this.items.push({ id: tokenId, uri })
      } else if (this._liquidityPoolAddr) {
        this.items[this.items.findIndex((item) => item.id.eq(tokenId))].weight = weight
      }
      if (this.updateCallback) this.updateCallback(this.items)
    })

    this.provider.on({
      address: this.token.address,
      topics: [
        utils.id("Transfer(address,address,uint256)"),
        utils.hexZeroPad(this.address, 32)
      ]
    }, async (log: { data: BytesLike, topics: string[] }) => {
      const { from, tokenId } = ERC721Interface.decodeEventLog('Transfer', log.data, log.topics)
      if (from === this.address && this.items.findIndex((item) => item.id.eq(tokenId)) >= 0) {
        this.items.splice(this.items.findIndex((item) => item.id.eq(tokenId)), 1)
      }
      if (this.updateCallback) this.updateCallback(this.items)
    })
  }

  stopUpdates() {
    this.provider.removeAllListeners()
  }
}
