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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL2ludGVyZmFjZXMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBRTdDLE9BQU8sYUFBYSxNQUFNLG1CQUFtQixDQUFDO0FBQzlDLE9BQU8sU0FBUyxNQUFNLGVBQWUsQ0FBQztBQUN0QyxPQUFPLFFBQVEsTUFBTSxjQUFjLENBQUM7QUFDcEMsT0FBTyxhQUFhLE1BQU0sbUJBQW1CLENBQUM7QUFDOUMsT0FBTyxjQUFjLE1BQU0sb0JBQW9CLENBQUM7QUFFaEQsY0FBYztBQUNkLE1BQU0sQ0FBQyxNQUFNLG9CQUFvQixHQUFHLElBQUksU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBRWxFLGNBQWM7QUFDZCxNQUFNLENBQUMsTUFBTSxtQkFBbUIsR0FBRyxJQUFJLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUVoRSxjQUFjO0FBQ2QsTUFBTSxDQUFDLE1BQU0sY0FBYyxHQUFHLElBQUksU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBRXRELGNBQWM7QUFDZCxNQUFNLENBQUMsTUFBTSxtQkFBbUIsR0FBRyxJQUFJLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUVoRSxjQUFjO0FBQ2QsTUFBTSxDQUFDLE1BQU0sZUFBZSxHQUFHLElBQUksU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBRXhELGNBQWM7QUFDZCxNQUFNLENBQUMsTUFBTSxlQUFlLEdBQUcsSUFBSSxTQUFTLENBQUM7SUFDM0M7UUFDRSxNQUFNLEVBQUU7WUFDTjtnQkFDRSxZQUFZLEVBQUUsUUFBUTtnQkFDdEIsSUFBSSxFQUFFLGFBQWE7Z0JBQ25CLElBQUksRUFBRSxRQUFRO2FBQ2Y7U0FDRjtRQUNELElBQUksRUFBRSxtQkFBbUI7UUFDekIsT0FBTyxFQUFFO1lBQ1A7Z0JBQ0UsWUFBWSxFQUFFLE1BQU07Z0JBQ3BCLElBQUksRUFBRSxFQUFFO2dCQUNSLElBQUksRUFBRSxNQUFNO2FBQ2I7U0FDRjtRQUNELGVBQWUsRUFBRSxNQUFNO1FBQ3ZCLElBQUksRUFBRSxVQUFVO0tBQ2pCO0NBQ0YsQ0FBQyxDQUFDIn0=