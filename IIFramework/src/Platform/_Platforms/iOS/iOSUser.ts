/// <reference path="../../Base/UserBase.ts" />
namespace numas {
    export class iOSUser extends UserBase implements IUser {
        protected OnInit(cfg: TSDKCfg): void {
            super.OnInit(cfg);
            iOSGameCenter.ins.Init(cfg);
        }
        IsAuthedUserInfo(): boolean { return true; }
        AuthUserInfo(buttonNode: cc.Node, onSuccess: Function, onFail: Function): void { onSuccess(); }
        LoginPlatform(loginCallback: PlatformLoginCallback, isAuthedUserInfo: boolean): void { iOSGameCenter.ins.Login(loginCallback); }
        protected OnLoginServerSuccess(): void {
            iOSGameCenter.ins.SyncGameCenter(this.uid, this.sdkCfg.iOS.GameCenter, (realKey: string, score: number)=>{
                let devKey: string = this.RealKey2DevKey(realKey);
                this.SetGameCenterVal(devKey, this.GetGameCenterVal(devKey) + score);
            });
        }
        protected OnLoginServerFailed(): void { }
        protected GetGameCenterCfg(): TGameCenterCfg { return this.sdkCfg.iOS.GameCenter; }
        protected ReportScore(realKey: string, score: number) { iOSGameCenter.ins.ReportScore(realKey, score); }
        FiveStar(): void { iOSGameCenter.ins.FiveStar(); }
        IsSupportLeaderboard(): boolean { return true; }
        ShowDefaultLeaderboard(): void {
            // 打开排行榜的时候，上传一次数据
            this.UploadGameTime();
            // 显示排行榜
            iOSGameCenter.ins.ShowDefaultLeaderboard();
        }
        IsSupportRateUsByOpenUrl(): boolean { return true; }
        RateUsByOpenUrl(): void { iOSGameCenter.ins.RateUsByOpenUrl(this.sdkCfg.iOS.AppId); }
        IsSupportContactUs(): boolean { return true; }
        ContactUs(): void { this.openSystemMailApp("huaxing_zheng@qq.com", ""); }
        private openSystemMailApp(toMail: string, subject: string, _cc: string="", bcc: string="", body: string="") {
            let url: string = `mailto:${toMail}?subject=${subject}&cc=${_cc}&bcc=${bcc}&body=${body}`;
            cc.sys.openURL(url);
        }
    }
}
