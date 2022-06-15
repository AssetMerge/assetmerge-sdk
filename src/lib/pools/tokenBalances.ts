import { BigNumber, BytesLike, Contract, providers, utils } from 'ethers';
import { getAddress } from 'ethers/lib/utils';
import { MULTCALL2_ADDRESS } from '../constants';

import {
  ERC721Interface,
  ERC721PoolInterface,
  Multicall2Interface,
} from '../interfaces';
import { ERC721 } from '../tokens';

export const getBalance = async (
  token: ERC721,
  address: string,
  provider: providers.BaseProvider,
  liquidityPool: string = null
): Promise<{
  ids: BigNumber[];
  weights: { [id: string]: BigNumber };
}> => {
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
    const ownerPromise = multicall.callStatic.aggregate(ownerCalls);

    let ownerReturnData: BytesLike[], weightReturnData: BytesLike[];

    if (liquidityPool) {
      const weightCalls: { target: string; callData: BytesLike }[] =
        historicalIds.map((id) => ({
          target: liquidityPool,
          callData: ERC721PoolInterface.encodeFunctionData('getNFTWeight', [
            id,
          ]),
        }));
      const weightPromise = multicall.callStatic.aggregate(weightCalls);
      const [ownerResult, weightResult] = await Promise.all([
        ownerPromise,
        weightPromise,
      ]);
      ownerReturnData = ownerResult[1];
      weightReturnData = weightResult[1];
    } else {
      ownerReturnData = (await ownerPromise)[1];
    }

    const ids: BigNumber[] = ownerReturnData
      .map((data: BytesLike, index: number) => ({
        id: historicalIds[index],
        owner: ERC721Interface.decodeFunctionResult('ownerOf', data)[0],
      }))
      .filter(
        (item: { owner: string }) =>
          getAddress(item.owner) === getAddress(address)
      )
      .map((item: { id: BigNumber; owner: string }) => item.id);

    if (liquidityPool) {
      const weights: { readonly [id: string]: BigNumber } = weightReturnData
        .map((data: BytesLike, index: number) => ({
          id: historicalIds[index].toString(),
          weight: ERC721PoolInterface.decodeFunctionResult(
            'getNFTWeight',
            data
          )[0],
        }))
        .filter((item: { id: string }) =>
          ids.map((id) => id.toString()).includes(item.id)
        )
        .reduce(
          (previousValue, currentValue) =>
            (previousValue[currentValue.id] = currentValue.weight),
          {}
        );
      return { ids, weights };
    } else {
      return { ids, weights: {} };
    }
  } catch (error) {
    throw error;
  }
};

export const createBalanceManager = (token: ERC721, address: string, provider: providers.BaseProvider, liquidityPool: string = null, updateCallback: (newData: any) => void): Promise<BalanceManager> => new Promise<BalanceManager>(async (resolve, reject) => {
  try {
    const { weights, ids } = await getBalance(token, address, provider, liquidityPool)
    resolve(new BalanceManager(token, address, provider, liquidityPool, weights, ids, updateCallback ?? null))
  } catch (error) {
    reject(error)
  }
})

export class BalanceManager {
  token: ERC721;
  address: string;
  _liquidityPool: Contract;
  _liquidityPoolAddr: string;
  data: {
    weights: { [ids: string]: BigNumber }
    ids: BigNumber[]
  }
  updateCallback: (newData: any) => void
  provider: providers.BaseProvider

  constructor(
    token: ERC721,
    address: string,
    provider: providers.BaseProvider,
    liquidityPool: string = null,
    weights: { [ids: string]: BigNumber },
    ids: BigNumber[],
    updateCallback: (newData: any) => void
  ) {
    this.token = token;
    this.address = getAddress(address);
    this.data.ids = ids
    this.provider = provider
    if (liquidityPool) this.data.weights = weights
    else this.data.weights = {}
    this.updateCallback = updateCallback ?? null
    this._liquidityPool = new Contract(liquidityPool, ERC721PoolInterface, provider)
    this._liquidityPoolAddr = liquidityPool

    this.provider.on({
      address: this.token.address,
      topics: [
        utils.id("Transfer(address,address,uint256)"),
        null,
        [utils.hexZeroPad(this.address, 32), ...(this._liquidityPoolAddr ? [utils.hexZeroPad(this._liquidityPoolAddr, 32)] : [])]
      ]
    }, async (log: { data: BytesLike, topics: string[] }) => {
      const { to, tokenId } = ERC721Interface.decodeEventLog('Transfer', log.data, log.topics)
      if (this._liquidityPool) {
        const weight = await this._liquidityPool.getNFTWeight(tokenId)
        this.data.weights[tokenId.toString()] = weight
      }
      if (to === this.address && this.data.ids.findIndex((id) => id.eq(tokenId)) < 0) {
        this.data.ids.push(tokenId)
      }
      if (this.updateCallback) this.updateCallback(this.data)
    })

    this.provider.on({
      address: this.token.address,
      topics: [
        utils.id("Transfer(address,address,uint256)"),
        [utils.hexZeroPad(this.address, 32), ...(this._liquidityPoolAddr ? [utils.hexZeroPad(this._liquidityPoolAddr, 32)] : [])]
      ]
    }, async (log: { data: BytesLike, topics: string[] }) => {
      const { from, tokenId } = ERC721Interface.decodeEventLog('Transfer', log.data, log.topics)
      if (from === this.address && this.data.ids.findIndex((id) => id.eq(tokenId)) >= 0) {
        this.data.ids.splice(this.data.ids.findIndex((id) => id.eq(tokenId)), 1)
        if (this._liquidityPoolAddr && Object.keys(this.data.weights).includes(tokenId.toString())) delete this.data.weights[tokenId.toString()]
      }
      if (this.updateCallback) this.updateCallback(this.data)
    })
  }

  stopUpdates() {
    this.provider.removeAllListeners()
  }
}
