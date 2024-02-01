/// <reference path="./SDKBase.ts" />
namespace numas {
    export abstract class VibrateBase extends SDKBase implements IVibrate {
        private _off: BooleanBV = null;
        get off(): BooleanBV { return this._off; }
        
        Toggle(): boolean {
            this._off.v = !this._off.v;
            return this._off.v;
        }

        protected OnInit(cfg: TSDKCfg): void {
            this._off = BooleanBV.BorrowAsLS("ll_vibrate_off", false, false);
        }

        Default(): void {
            if(this._off.v){ return; }
            this.DefaultImpl();
        }
        abstract DefaultImpl(): void;
    }
}
