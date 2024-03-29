import test from 'ava';
import { providers } from 'ethers';
import { getAddress } from 'ethers/lib/utils';
import { fetchERC20, fetchERC721 } from './tokens';
test('ERC721 Populate', async (t) => {
    const provider = providers.getDefaultProvider();
    const token = await fetchERC721('0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D', provider);
    t.is(token.name, 'BoredApeYachtClub');
    t.is(token.symbol, 'BAYC');
    t.is(token.address, getAddress('0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D'));
});
test('ERC20 Populate', async (t) => {
    const provider = providers.getDefaultProvider();
    const token = await fetchERC20('0x6B175474E89094C44Da98b954EedeAC495271d0F', provider);
    t.is(token.name, 'Dai Stablecoin');
    t.is(token.symbol, 'DAI');
    t.is(token.decimals, 18);
    t.is(token.address, getAddress('0x6B175474E89094C44Da98b954EedeAC495271d0F'));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9rZW5zLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3Rva2Vucy5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sSUFBSSxNQUFNLEtBQUssQ0FBQztBQUN2QixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sUUFBUSxDQUFDO0FBQ25DLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUU5QyxPQUFPLEVBQWlCLFVBQVUsRUFBRSxXQUFXLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFFbEUsSUFBSSxDQUFDLGlCQUFpQixFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUNsQyxNQUFNLFFBQVEsR0FBRyxTQUFTLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztJQUNoRCxNQUFNLEtBQUssR0FBVyxNQUFNLFdBQVcsQ0FDckMsNENBQTRDLEVBQzVDLFFBQVEsQ0FDVCxDQUFDO0lBQ0YsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLG1CQUFtQixDQUFDLENBQUM7SUFDdEMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzNCLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsNENBQTRDLENBQUMsQ0FBQyxDQUFDO0FBQ2hGLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUNqQyxNQUFNLFFBQVEsR0FBRyxTQUFTLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztJQUNoRCxNQUFNLEtBQUssR0FBVSxNQUFNLFVBQVUsQ0FDbkMsNENBQTRDLEVBQzVDLFFBQVEsQ0FDVCxDQUFDO0lBQ0YsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLGdCQUFnQixDQUFDLENBQUM7SUFDbkMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzFCLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUN6QixDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLDRDQUE0QyxDQUFDLENBQUMsQ0FBQztBQUNoRixDQUFDLENBQUMsQ0FBQyJ9