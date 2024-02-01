namespace numas {
    export type PlatformLoginResult = {
        success: boolean;
        openid?: string;
        error?: string;
    }
    
    /**
     * 登陆回调
     */
    export type PlatformLoginCallback = (args: PlatformLoginResult)=>void;

    export interface IUser {
        Init(cfg: TSDKCfg): void;
        /**
         * 获取 GameCenter 对应的绑定数据
         * @param devKey 开发关键字
         */
        GetGameCenterVal(devKey: string): number;

        /**
         * 设置 GameCenter 对应的绑定数据
         * @param devKey 开发关键字
         * @param val 值
         */
        SetGameCenterVal(devKey: string, val: number): void;

        /**
         * 是否获得了用户授权（主要用来兼容微信平台）
         */
        IsAuthedUserInfo(): boolean;

        /**
         * 获取用户的授权
         * @param buttonNode 
         * @param onSuccess 
         * @param onFail 
         */
        AuthUserInfo(buttonNode: cc.Node, onSuccess: Function, onFail: Function): void;

        /**
         * 登陆平台
         * @param loginCallback 
         */
        LoginPlatform(loginCallback: PlatformLoginCallback, isAuthedUserInfo: boolean): void;

        /**
         * 登陆平台
         * @param platformLoginResult 
         * @param loginCallback 
         */
        LoginServer(platformLoginResult: PlatformLoginResult, loginCallback: ServerLoginCallback): void;

        /**
         * 上传一次游戏时长
         */
        UploadGameTime(): void;

        /**
         * 五星好评
         */
        FiveStar(): void;
        /**
         * 是否支持排行榜
         */
        IsSupportLeaderboard(): boolean;
        
        /**
         * 显示默认排行榜
         */
        ShowDefaultLeaderboard(): void;

        /**
         * 是否支持前往商店评价
         */
        IsSupportRateUsByOpenUrl(): boolean;

        /**
         * 前往商店评价
         */
        RateUsByOpenUrl(): void;

        /**
         * 是否支持联系我们
         */
        IsSupportContactUs(): boolean;

        /**
         * 联系我们
         */
        ContactUs(): void;
    }
}
