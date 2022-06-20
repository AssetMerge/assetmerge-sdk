import test from 'ava';
import { providers } from 'ethers';

import { ERC721, fetchERC721 } from './tokens';

import { getBalance } from './tokenBalances';

test('Fetch token balances', async (t) => {
  const provider = providers.getDefaultProvider();
  const token: ERC721 = await fetchERC721(
    '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
    provider
  );
  const items = await getBalance(
    token,
    '0xb88f61e6fbda83fbfffabe364112137480398018',
    provider
  );
  t.true(items.length > 0);
});
