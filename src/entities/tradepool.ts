import { Token  } from './token'
import JSBI from 'jsbi'
import {Decimal} from 'decimal.js'



export class AttenuationReward {

  public readonly startBlock: number //开始
  public readonly zooPerBlock: JSBI
  public readonly halfAttenuationCycle: number //减半周期

  constructor(args:{ startBlock:number,zooPerBlock:JSBI,halfAttenuationCycle:number} ){
    ({
      startBlock: this.startBlock,
      zooPerBlock: this.zooPerBlock,
      halfAttenuationCycle: this.halfAttenuationCycle,
    } = args);

  }



    public getZooRewardBetween(start: number,end :number) : JSBI {
      let getZooReardFromStart = (end:number):JSBI=>{

        if( start< this.startBlock || end < this.startBlock || start > end) {
          return JSBI.BigInt("0")
        }
        let cycle = Math.floor((end-this.startBlock)/(this.halfAttenuationCycle))
        if(cycle > 255) {
          cycle = 255;
        }
        let  attenuationMul =  1 << cycle;

        const multiply = 1000000

        let rest = JSBI.BigInt(Math.floor(multiply * ((this.halfAttenuationCycle*2)- (this.halfAttenuationCycle/attenuationMul)-( this.halfAttenuationCycle
          - (end-this.startBlock)% this.halfAttenuationCycle)/attenuationMul)))

          
        return JSBI.multiply(this.zooPerBlock,JSBI.divide( rest,JSBI.BigInt(multiply)))
       }

      return JSBI.subtract(getZooReardFromStart(end), getZooReardFromStart(start) )
    
    }

}



export class TradePool {
  public readonly token0!: Token
  public readonly token1!: Token
  public readonly isToken0Archor!: boolean
  public readonly totalLp!: JSBI // 总交易手续（以archortoken 为参考)
  // 总交易手续（以archortoken 为参考)
  public readonly accZooPerShare!: number // 每lp 对应奖励  times 1e12
 // 每lp 对应奖励 
  public readonly rewardEffect!: number // 奖励系数 *10000
 // 奖励系数 *10000
  public readonly lastRewardBlock!: number // 奖励系数 *10000
 // 当前zoo余额
 // 奖池
  public readonly rewardConfig!: AttenuationReward // 奖池配置

  public readonly myReward!: JSBI // 当前未领取奖励
 // 当前未领取奖励
  public readonly myCurrentLp!: JSBI // 当前未领取lp
 // 当前未领取lthis.p
  public readonly currentTradePoint!: number
  public readonly pid!: number


  constructor(data: Partial<TradePool>) {
      Object.assign(this, data);
  }

  // 显示用的helper 函数
  public  getDayReturn(currBlockNo:number,rewardPrice :number,archorPrice :number) : Decimal {
    // one day ≈  21600 block
    if(JSBI.greaterThan(this.totalLp,JSBI.BigInt(0))) {
     // const oneDayReward = JSBI.divide(JSBI.BigInt(this.rewardConfig.getZooRewardBetween(currBlockNo,currBlockNo + 21600)) ,this.totalLp)
      const oneDayReward = new  Decimal(this.rewardConfig.getZooRewardBetween(currBlockNo,currBlockNo + 21600).toString(10)).div( new Decimal(this.totalLp.toString(10)))
      // 0.3% fee
      return   oneDayReward.div(new Decimal(rewardPrice)).div(new Decimal(archorPrice))
    } else{
      return new Decimal(0)
    }
  }


  public  getTotalReward(currenBlockNo:number) : JSBI {
    return  JSBI.BigInt(this.rewardConfig.getZooRewardBetween(this.rewardConfig.startBlock,currenBlockNo))
  }


}
export class StakePool {
  public readonly token0!: Token
  public readonly token1!: Token
  public readonly token0Balance!: JSBI
  public readonly token1Balance!: JSBI

  public readonly lpAddress!: string
  public readonly totalLp!: JSBI 
  public readonly totalLpInPark!: JSBI 
  public readonly rewardEffect!: number // 奖励系数 *10000
 // 奖励系数 *10000
  public readonly lastRewardBlock!: number // 奖励系数 *10000
 // 当前zoo余额
  public readonly rewardConfig!: AttenuationReward // 奖池配置
  public readonly myCurrentLp!: JSBI
  public readonly myLpBalance!: JSBI
  public readonly myReward!: JSBI
  public readonly pid!: number


  constructor(data: Partial<StakePool>) {
    Object.assign(this, data);
  }

  public  getDayReturn(currBlockNo:number,rewardPrice :number,token0Price :number,token1Price:number) : Decimal {
    // one day ≈  21600 block
    if(JSBI.greaterThan(this.totalLpInPark,JSBI.BigInt(0))) {
      //const oneDayReward = JSBI.divide(JSBI.BigInt(this.rewardConfig.getZooRewardBetween(currBlockNo,currBlockNo + 21600)) ,this.totalLpInPark)
      const oneDayReward = new  Decimal(this.rewardConfig.getZooRewardBetween(currBlockNo,currBlockNo + 21600).toString(10)).div( new Decimal(this.totalLp.toString(10)))
      //       oneDayReward Price /OneDay reward * 100000
      // 0.3% fee

     return oneDayReward.mul(new Decimal(rewardPrice)).div(  (new Decimal(this.token0Balance.toString(10)).mul(token0Price).div(new Decimal(this.totalLpInPark.toString(10)) ) ).add(  
        new Decimal(this.token1Balance.toString(10)).mul(token1Price).div(new Decimal(this.totalLpInPark.toString(10)) ) 
      ))
    } else{
      return new Decimal(0)
    }
  }

}

export function jsbiFloor (val:number) {
  return JSBI.BigInt(Math.floor(val))
}