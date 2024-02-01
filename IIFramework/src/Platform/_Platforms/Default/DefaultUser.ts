/// <reference path="../../Base/UserBase.ts" />
namespace numas {
    export class DefaultUser extends UserBase implements IUser {
        IsAuthedUserInfo(): boolean { return true; }
        AuthUserInfo(buttonNode: cc.Node, onSuccess: Function, onFail: Function): void { onSuccess(); }
        LoginPlatform(loginCallback: PlatformLoginCallback, isAuthedUserInfo: boolean): void {
            loginCallback({
                success: true,
                openid: "dev_openid"
            });
        }
        ReportScore(realKey: string, score: number) { /** do nothing */ }
        protected GetGameCenterCfg(): TGameCenterCfg { return this.sdkCfg.iOS.GameCenter; }
        protected OnLoginServerSuccess(): void { }
        protected OnLoginServerFailed(): void { }
        FiveStar(): void { /** do nothing */ }
        IsSupportLeaderboard(): boolean { return false; }
        ShowDefaultLeaderboard(): void { /** do nothing */ }
        IsSupportRateUsByOpenUrl(): boolean { return false; }
        RateUsByOpenUrl(): void { /** do nothing */ }
        IsSupportContactUs(): boolean { return false; }
        ContactUs(): void { /** do nothing */ }
    }
}
