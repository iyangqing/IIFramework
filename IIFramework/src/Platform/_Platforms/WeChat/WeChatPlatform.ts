/// <reference path="../../Base/PlatformBase.ts" />
namespace numas {
    export class WeChatPlatform extends PlatformBase {
        protected GetUserClass(): any { return WeChatUser; }
        protected GetADClass(): any { return WeChatAD; }
        protected GetVibrateClass() { return WeChatVibrate; }
    }
}
