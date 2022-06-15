import { Interface } from 'ethers/lib/utils';

import ERC721PoolABI from './ERC721Pool.json';
import ERC721ABI from './ERC721.json';
import ERC20ABI from './ERC20.json';
import Multicall2ABI from './Multicall2.json';
import PairFactoryABI from './PairFactory.json';

/** @ignore */
export const PairFactoryInterface = new Interface(PairFactoryABI);

/** @ignore */
export const ERC721PoolInterface = new Interface(ERC721PoolABI);

/** @ignore */
export const ERC20Interface = new Interface(ERC20ABI);

/** @ignore */
export const Multicall2Interface = new Interface(Multicall2ABI);

/** @ignore */
export const ERC721Interface = new Interface(ERC721ABI);

/** @ignore */
export const ERC165Interface = new Interface([
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
