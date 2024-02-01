namespace numas {
    export type TweenProgressFunc<T> = (start: T, end: T, current: T, t: number) => T; 
    export type TweenProgress<T> = { progress: TweenProgressFunc<T> }

    export abstract class TweenUtil {
        // Tween 的线性 progress 函数
        static readonly LinearProgress: TweenProgress<number> = { progress: (start, end, current, t): number => { return start + (end - start) * t; } }

        // Tween 的线性取整 progress 函数
        static readonly LinearFloorIntegerProgress: TweenProgress<number> = { progress: (start, end, current, t): number => { return Math.floor(start + (end - start) * t); } }
        static readonly LinearCeilIntegerProgress: TweenProgress<number> = { progress: (start, end, current, t): number => { return Math.ceil(start + (end - start) * t); } }
        static readonly LinearRoundIntegerProgress: TweenProgress<number> = { progress: (start, end, current, t): number => { return Math.round(start + (end - start) * t); } }
        static IntegerTo(duration: number, start: number, end: number, handler: ValueChangedFunc<number>, callOnBind: boolean) { this.__IntegerTo(duration, start, end, handler, callOnBind, this.LinearFloorIntegerProgress); }
        static CeilIntegerTo(duration: number, start: number, end: number, handler: ValueChangedFunc<number>, callOnBind: boolean) { this.__IntegerTo(duration, start, end, handler, callOnBind, this.LinearCeilIntegerProgress); }
        static RoundIntegerTo(duration: number, start: number, end: number, handler: ValueChangedFunc<number>, callOnBind: boolean) { this.__IntegerTo(duration, start, end, handler, callOnBind, this.LinearRoundIntegerProgress); }

        private static __IntegerTo(duration: number, start: number, end: number, handler: ValueChangedFunc<number>, callOnBind: boolean, progress: TweenProgress<number>) {
            let bv = NumberBV.Borrow(start);
            bv.Bind(handler, callOnBind, this);
            cc.tween(bv)
                .to(duration, {v: end}, progress)
                .call((target: NumberBV)=>target.Return())
                .start()
        }
    }
}
