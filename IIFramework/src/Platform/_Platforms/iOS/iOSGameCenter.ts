namespace numas {
    export class iOSGameCenter {
        private static _ins: iOSGameCenter = null;
        static get ins(): iOSGameCenter {
            if(this._ins === null) {
                this._ins = new iOSGameCenter();
            }
            return this._ins;
        }

        Init(cfg: TSDKCfg): void {
            iOSMsgBridge.ins.on('NMEventUser', jsonData=>this.iOSCallbackHandler(jsonData), this);
        }

        private m_LoginCallback: (success: boolean, error?: string) => void = null;
        private InvokeLoginCallback(success: boolean, error?: string): void {
            if(this.m_LoginCallback) {
                let __cb = this.m_LoginCallback;
                this.m_LoginCallback = null;
                __cb(success, error);
            }
        }
        /**
         * 登陆接口
         * @param cb 登陆回调
         */
        Login(loginCallback: PlatformLoginCallback): void {
            this.m_LoginCallback = (success: boolean, error?: string)=>{
                if(success) {
                    loginCallback({
                        success: true,
                        openid: this.GetUserId()
                    })
                }else{
                    loginCallback({
                        success: false,
                        error: error
                    });
                }
            };
            this.LoginGameCenter();
        }

        //#region  登陆服务器回调
        
        //#endregion

        //#region ******************************** iOS 通知 TS 的事件处理 ********************************
        private iOSCallbackHandler( jsonData: {event: string} | { success: boolean, reason: string } | {identifier: string, score: number} ){
            switch ((jsonData as {event: string}).event) {
                case "LOGIN": 
                    this.HandleLogin(jsonData as { success: boolean, reason: string });
                    break;
                case "REQUEST_LOCAL_PLAYER_SCORE":
                    this.HandleRequestLocalPlayerScore(jsonData as {identifier: string, score: number});
                    break;
                default:
                    console.warn(`Unhandled iOS Event >> ${(jsonData as {event: string}).event}`)
                    break;
            }
        }
        private HandleLogin(jsonData: { success: boolean, reason: string }) { this.InvokeLoginCallback(jsonData.success, jsonData.reason); }


        //#region 同步 GameCenter 排行榜数据
        private m_sync_uid: string = null;
        // 处理当前用户的排行榜数据（卸载后重装）
        private HandleRequestLocalPlayerScore(jsonData: {identifier: string, score: number}) {
            let _uid = this.m_sync_uid;
            if(this.m_SyncHandler !== null) {
                this.m_SyncHandler(jsonData.identifier, jsonData.score);
                this.SetIsSynced(_uid, true);
            }
        }
        //#endregion

        //#region 重新安装时尝试从服务器请求玩家数据
        private m_SyncHandler: (reakKey: string, score: number)=>void = null;
        SyncGameCenter(uid: string, gameCenterCfg: TGameCenterCfg, handler: (reakKey: string, score: number)=>void) {
            if(!this.GetIsSynced(uid)) {
                this.m_SyncHandler = handler;
                console.info(`iOSGameCenter >> 开始同步服务器数据 uid: ${uid}`)
                this.m_sync_uid = uid;
                gameCenterCfg.Ranks.forEach(item => {
                    this.RequestLocalPlayScore(item.v);
                })
            }
        }
        private GetIsSynced(uid: string): boolean { return LSMgr.ins.getBoolWithDefault(`${uid}_ls_gamecenter_sync`, false); }
        private SetIsSynced(uid: string, sync: boolean) { LSMgr.ins.setBool(`${uid}_ls_gamecenter_sync`, sync, false); }
        //#endregion

        private LoginGameCenter(): void { jsb.reflection.callStaticMethod("NMProxyUser", "Login"); }
        private GetUserId(): string { return jsb.reflection.callStaticMethod("NMProxyUser", "GetUserId") }
        private IsAuthenticated(): boolean { return jsb.reflection.callStaticMethod("NMProxyUser", "IsAuthenticated") }
        ReportScore(leaderboardIdentifier: string, score: number){ jsb.reflection.callStaticMethod("NMProxyUser", "ReportScore:withScore:", leaderboardIdentifier, score) }
        ReportAchievement(achievementIdentifier: string, percentComplete: number){ jsb.reflection.callStaticMethod("NMProxyUser", "ReportAchievement:percentComplete:", achievementIdentifier, percentComplete) }
        FiveStar(){ jsb.reflection.callStaticMethod("NMProxyUser", "FiveStar") }
        ShowDefaultLeaderboard() { jsb.reflection.callStaticMethod("NMProxyUser", "ShowDefaultLeaderboard") }
        ShowLeaderboards(leaderboardIdentifier: string, timeScope: number){ jsb.reflection.callStaticMethod("NMProxyUser", "ShowLeaderboards:timeScope:", leaderboardIdentifier, timeScope) }
        ShowAchievement(){ jsb.reflection.callStaticMethod("NMProxyUser", "ShowAchievement") }
        RateUsByOpenUrl(app_id: string){ jsb.reflection.callStaticMethod("NMProxyUser", "RateUsByOpenUrl:", app_id) }
        RateUsWithinApp(app_id: string){ jsb.reflection.callStaticMethod("NMProxyUser", "RateUsWithinApp:", app_id) }
        RequestLocalPlayScore(leaderboardIdentifier: string) { if(this.IsAuthenticated()) { jsb.reflection.callStaticMethod("NMProxyUser", "RequestLocalPlayScore:", leaderboardIdentifier) } }
    }
}
