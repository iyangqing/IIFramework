/// <reference path="../../Base/PlatformBase.ts" />
namespace numas {
    export class DefaultPlatform extends PlatformBase {        
        protected GetUserClass(): any { return DefaultUser; }
        protected GetADClass(): any { return DefaultAD; }
        protected GetVibrateClass() { return DefaultVibrate; }
    }
}
