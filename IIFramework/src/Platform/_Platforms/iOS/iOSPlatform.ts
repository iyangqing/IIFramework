/// <reference path="../../Base/PlatformBase.ts" />
namespace numas {
    export class iOSPlatform extends PlatformBase {
        protected GetUserClass(): any { return iOSUser; }
        protected GetADClass(): any { return iOSIronSourceAD; }
        protected GetVibrateClass() { return iOSVibrate; }

        Init(cfg: TSDKCfg): iOSPlatform {
            super.Init(cfg)
            iOSATT.ins.Init(cfg);
            return this;
        } 
    }
}
