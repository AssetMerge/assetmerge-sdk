import test from 'ava';
import { providers } from 'ethers';
import { getAddress } from 'ethers/lib/utils';

import { ERC20, ERC721, fetchERC20, fetchERC721 } from './tokens';

test('ERC721 Populate', async (t) => {
  const provider = providers.getDefaultProvider();
  const token: ERC721 = await fetchERC721(
    '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
    provider
  );
  t.is(token.name, 'BoredApeYachtClub');
  t.is(token.symbol, 'BAYC');
  t.is(token.address, getAddress('0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D'));
});

test('ERC20 Populate', async (t) => {
  const provider = providers.getDefaultProvider();
  const token: ERC20 = await fetchERC20(
    '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    provider
  );
  t.is(token.name, 'Dai Stablecoin');
  t.is(token.symbol, 'DAI');
  t.is(token.decimals, 18);
  t.is(token.address, getAddress('0x6B175474E89094C44Da98b954EedeAC495271d0F'));
});
