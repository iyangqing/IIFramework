namespace numas {
    export interface IVibrate {
        /**
         * 开关
         */
        off: BooleanBV;
        
        /**
         * 初始化接口
         * @param cfg 配置 
         */
        Init(cfg: TSDKCfg): void;

        /**
         * 切换震动开关
         */
        Toggle(): boolean;

        /**
         * 默认的震动，全局就一种震动的功能需求下，就调用此方法
         */
        Default(): void;
    }
}
