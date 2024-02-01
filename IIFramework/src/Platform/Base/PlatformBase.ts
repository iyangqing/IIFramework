namespace numas {
    export abstract class PlatformBase extends cc.Component {
        private _isInit: boolean = false;        
        protected sdkCfg: TSDKCfg = null;
        /**
         * 初始化接口
         * @param cfg 各个平台的 sdk 配置信息
         * @returns 组件自身
         */
        Init(cfg: TSDKCfg): PlatformBase {
            if(this._isInit) {
                throw new Error("PlatformBase >> 重复的初始化！");
            }
            this.sdkCfg = cfg;
            this._user = <UserBase>(this.addComponent(this.GetUserClass()));
            this._user.Init(this.sdkCfg);
            this._ad = <ADBase>(this.addComponent(this.GetADClass()));
            this._ad.Init(this.sdkCfg)
            this._vibrate = <VibrateBase>(this.addComponent(this.GetVibrateClass()));
            this._vibrate.Init(this.sdkCfg)
            return this;
        }

        //#region user //! ////////////////////////////////////
        protected abstract GetUserClass(): any;
        get user(): IUser { return this._user; }
        private _user: IUser = null;
        //#endregion //! ////////////////////////////////////


        //#region ad //! ////////////////////////////////////
        protected abstract GetADClass(): any;
        get ad(): IAD { return this._ad; }
        private _ad: IAD = null;
        //#endregion //! ////////////////////////////////////

        //#region vibrate //! ////////////////////////////////////
        protected abstract GetVibrateClass(): any;
        get vibrate(): IVibrate { return this._vibrate; }
        private _vibrate: IVibrate = null;
        //#endregion //! ////////////////////////////////////
    }
}
