namespace numas {
    abstract class RandBase {
        private kMultiplier: number = 3125
        private kModer: number = 34359738337
        private kConstant: number = 0
        private kOriginRandomSeed: number = null
        private kRandomSeed: number = null
        private bIsDebug: boolean = false
        private kRandomCount: number = 0
        constructor(kMultiplier: number, kModer: number, kConstant: number, randomSeed: number, debug: boolean = false){
            this.kMultiplier = kMultiplier
            this.kModer = kModer
            this.kConstant = kConstant
            if(!randomSeed || randomSeed === 0){
                randomSeed = 1
            }
            this.kOriginRandomSeed = randomSeed
            this.kRandomSeed = randomSeed
            this.bIsDebug = debug
        }

        get seed(): number { return this.kOriginRandomSeed }

        random() {
            const nextSeed = (this.kRandomSeed * this.kMultiplier + this.kConstant) % this.kModer
            const ret = nextSeed / this.kModer
            this.kRandomSeed    = nextSeed

            if(this.bIsDebug){
                ++this.kRandomCount
                console.log(`>>Rand{${this.kOriginRandomSeed}}: Count{${this.kRandomCount}} Seed{${this.kRandomSeed}} Ret:{${ret}}`)
            }
            return ret
        }

        /**
         * @return inclusiveMin <= x < exclusiveMax 
         * @param inclusiveMin 最小值
         * @param exclusiveMax 最大值
         */
        range(inclusiveMin: number, exclusiveMax: number) {
            console.assert(inclusiveMin < exclusiveMax)
            const ret = Math.floor( this.random()*(exclusiveMax-inclusiveMin) + inclusiveMin )
            return ret
        }
    }
    // 乘法同余发生器
    export class MCGRand extends RandBase {
        constructor(randomSeed: number, debug: boolean = false){ super(3125, 34359738337, 0, randomSeed, debug) }
        private static _ins: MCGRand = null;
        public static get ins(): MCGRand {
            if(!this._ins) {
                this._ins = new MCGRand(date.getMilliTimeStamp(), false);
            }
            return this._ins;
        }
    }

    export class rand {
        // 获取组件，没有该组件时，添加一个；
        public static IntBetween(inclusiveMin: number, exclusiveMax: number): number { return MCGRand.ins.range(inclusiveMin, exclusiveMax); }
    }
}
