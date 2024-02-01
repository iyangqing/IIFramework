/// <reference path="./SDKBase.ts" />
namespace numas {
    export abstract class UserBase extends SDKBase implements IUser {
        protected OnInit(cfg: TSDKCfg): void { this.UserDefaultServerLoginHelper(); }
        abstract IsAuthedUserInfo(): boolean;
        abstract AuthUserInfo(buttonNode: cc.Node, onSuccess: Function, onFail: Function): void;
        abstract LoginPlatform(loginCallback: PlatformLoginCallback, isAuthedUserInfo: boolean): void;

        //#region // ! 登陆服务器
        private m_UserId: string = Cfg.DefaultUserKey;
        protected get uid(): string { return this.m_UserId; }

        private _serverLoginHelper: IServerLoginHelper = null;
        private UserDefaultServerLoginHelper(): void { this._serverLoginHelper = new DefaultServerLoginHelper(); }
        LoginServer(platformLoginResult: PlatformLoginResult, loginCallback: ServerLoginCallback): void {
            if(!this._serverLoginHelper) {
                console.error(`UserBase::Login >> 请先使用 SetHelper(loginHelper: IServerLoginHelper) 设置 IServerLoginHelper`);
                return;
            }
            this._serverLoginHelper.Login(platformLoginResult, (result: ServerLoginResult)=>{
                if(CC_DEBUG) {
                    if(result.success) {
                        // 登陆平台成功
                        console.info(`登陆游戏服务器成功！>> uid: ${result.uid}`)
                        
                    }else{
                        console.info(`登陆游戏服务器失败！>> error: ${result.error}`)
                    }
                }
                this.m_UserId = result.success ? result.uid : Cfg.DefaultUserKey;
                UserLSMgr.ins.setUserId(this.uid);
                if(result.success) {
                    // 开启调度
                    this.StartGameTimeScheduler();
                    this.OnLoginServerSuccess();
                }else{
                    // 关闭调度
                    this.StopGameSimeScheduler();
                    this.OnLoginServerFailed();
                }
                loginCallback(result);
            });
        }

        protected abstract OnLoginServerSuccess(): void;
        protected abstract OnLoginServerFailed(): void;
        //#endregion // ! 登陆服务器

        
        //#region // !排行榜本地数据存储
        private m_Dict: Map<string, MaxNumberBV> = new Map<string, MaxNumberBV>();
        /** 
         * 将存储关键字转为用户相关的关键字
         * @param key 
         * @returns 
         */
        protected Key2UserKey(uid: string, key: string): string { return `${uid}_${key}`; }
        protected DevKey2RealKey(devKey: string): string { return CfgUtil.k2v(this.GetGameCenterCfg().Ranks, devKey); }
        protected RealKey2DevKey(realKey: string): string { return CfgUtil.v2k(this.GetGameCenterCfg().Ranks, realKey); }
        private GetGameCenterBV(uid: string, devKey: string): MaxNumberBV {
            let userKey: string = this.Key2UserKey(uid, devKey);
            if(!this.m_Dict.has(userKey)) {
                let _bv = MaxNumberBV.BorrowAsLS(userKey, 0, true);
                this.m_Dict.set(userKey, _bv)
                _bv.Bind(v => {
                    this.ReportScoreWithDevKey(devKey, v);
                }, false, this);
                return _bv;
            }
            return this.m_Dict.get(userKey);
        }
        ReportScoreWithDevKey(devKey: string, score: number): void { this.ReportScore(this.DevKey2RealKey(devKey), score); }

        protected abstract GetGameCenterCfg(): TGameCenterCfg;
        protected abstract ReportScore(realKey: string, score: number);

        GetGameCenterVal(devKey: string): number { return this.GetGameCenterBV(this.uid, devKey).v; }
        SetGameCenterVal(devKey: string, val: number): void { this.GetGameCenterBV(this.uid, devKey).v = val; }
        //#endregion // !排行榜本地数据存储
        
        //#region // ! 游戏时长
        // 待上传的时间存在本地
        private m_ToUploadGameTimeLS: NumberBV = null;
        UploadGameTime(): void {
            if(this.m_ToUploadGameTimeLS !== null && this.m_ToUploadGameTimeLS.v > 0) {
                this.SetGameCenterVal("GameTime", this.GetGameCenterVal("GameTime") + this.m_ToUploadGameTimeLS.v);
                this.m_ToUploadGameTimeLS.v = 0;
            }
        }
        private m_GameTimeScheduler: Function = null;
        private readonly TIME_INC_INTERVAL: number = 7;
        private StartGameTimeScheduler(): void {
            if(this.m_GameTimeScheduler === null) {
                this.m_GameTimeScheduler = this.GameTimeTick.bind(this);
                this.m_ToUploadGameTimeLS = NumberBV.BorrowAsUserLS("ii_user_touploadtime", 0, true);
                this.schedule(this.m_GameTimeScheduler, this.TIME_INC_INTERVAL, cc.macro.REPEAT_FOREVER);
            }
        }
        private StopGameSimeScheduler(): void {
            if(this.m_GameTimeScheduler !== null) {
                let _scheduler = this.m_GameTimeScheduler;
                this.m_GameTimeScheduler = null;
                this.unschedule(_scheduler);
                if(this.m_ToUploadGameTimeLS !== null) {
                    this.m_ToUploadGameTimeLS.Return();
                }
            }
        }
        private GameTimeTick(): void {
            this.m_ToUploadGameTimeLS.v += this.TIME_INC_INTERVAL;
            // 时间超过 60 秒就上传一次
            if(this.m_ToUploadGameTimeLS.v >= 59) {
                this.UploadGameTime();
            }
        }
        //#endregion // ! 游戏时长

        abstract FiveStar(): void;
        abstract IsSupportLeaderboard(): boolean;
        abstract ShowDefaultLeaderboard(): void;
        abstract IsSupportRateUsByOpenUrl(): boolean;
        abstract RateUsByOpenUrl(): void;
        abstract IsSupportContactUs(): boolean;
        abstract ContactUs(): void;
    }
}
