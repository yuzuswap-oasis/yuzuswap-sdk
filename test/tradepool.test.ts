import JSBI from 'jsbi'
import {
  ChainId,
  Token,
  //TokenAmount,
  AttenuationReward,
  TradePool,
  StakePool,
} from '../src'

describe('Trade', () => {
  const token0 = new Token(ChainId.MAINNET, '0x0000000000000000000000000000000000000001', 18, 't0')
  const token1 = new Token(ChainId.MAINNET, '0x0000000000000000000000000000000000000002', 18, 't1')
  /*
  const token2 = new Token(ChainId.MAINNET, '0x0000000000000000000000000000000000000003', 18, 't2')
  const token3 = new Token(ChainId.MAINNET, '0x0000000000000000000000000000000000000004', 18, 't3')

  const pair_0_1 = new Pair(new TokenAmount(token0, JSBI.BigInt(1000)), new TokenAmount(token1, JSBI.BigInt(1000)))
  const pair_0_2 = new Pair(new TokenAmount(token0, JSBI.BigInt(1000)), new TokenAmount(token2, JSBI.BigInt(1100)))
  const pair_0_3 = new Pair(new TokenAmount(token0, JSBI.BigInt(1000)), new TokenAmount(token3, JSBI.BigInt(900)))
  const pair_1_2 = new Pair(new TokenAmount(token1, JSBI.BigInt(1200)), new TokenAmount(token2, JSBI.BigInt(1000)))
  const pair_1_3 = new Pair(new TokenAmount(token1, JSBI.BigInt(1200)), new TokenAmount(token3, JSBI.BigInt(1300)))

  const pair_weth_0 = new Pair(
    new TokenAmount(WETH[ChainId.MAINNET], JSBI.BigInt(1000)),
    new TokenAmount(token0, JSBI.BigInt(1000))
  )

  const empty_pair_0_1 = new Pair(new TokenAmount(token0, JSBI.BigInt(0)), new TokenAmount(token1, JSBI.BigInt(0)))
  */

  const Zero = JSBI.BigInt(0)
  it('can calcuation day return', () => {
    const tradepool = new TradePool({
      token0 : token0,
      token1 : token1,
      isToken0Archor : true,
      totalLp:JSBI.BigInt(21600),
      accZooPerShare :0,
      rewardEffect:0,
      lastRewardBlock:10,
      rewardConfig : new AttenuationReward({startBlock:0,zooPerBlock:JSBI.BigInt(1),halfAttenuationCycle:1000000}),
      myReward:Zero,
      myCurrentLp:Zero,
      currentTradePoint:0
    })
    console.log(JSBI.toNumber(tradepool.getDayReturn(0,1,1)))
    expect(tradepool.getDayReturn(0,1,1)).toEqual(JSBI.BigInt(10000))
  })
  it('can calcuation day return', () => {
    const tradepool = new TradePool({
      token0 : token0,
      token1 : token1,
      isToken0Archor : true,
      totalLp:JSBI.BigInt(0),
      accZooPerShare :0,
      rewardEffect:0,
      lastRewardBlock:10,
      rewardConfig : new AttenuationReward({startBlock:0,zooPerBlock:JSBI.BigInt(1),halfAttenuationCycle:1000000}),
      myReward:Zero,
      myCurrentLp:Zero,
      currentTradePoint:0
    })
    expect(tradepool.getDayReturn(0,1,1)).toEqual(JSBI.BigInt(0))

  })
  it('can calcuation day return for zoopark', () => {
    const tradepool = new StakePool({
      token0 : token0,
      token1 : token1,
      token0Balance: JSBI.BigInt(10800),
      token1Balance: JSBI.BigInt(10800),
      totalLp:JSBI.BigInt(21600),
      lastRewardBlock:10,
      rewardConfig : new AttenuationReward({startBlock:0,zooPerBlock:JSBI.BigInt(1),halfAttenuationCycle:1000000}),
      myReward:Zero,
      myCurrentLp:Zero,
    })
    console.log(JSBI.toNumber(tradepool.getDayReturn(0,1,1,1)))
    expect(tradepool.getDayReturn(0,1,1,1)).toEqual(JSBI.BigInt(10000))
  })
})
