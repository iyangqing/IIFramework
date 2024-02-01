namespace numas {
    //! 这个类不允许调用框架层的相关组件，必须是框架无关的
    export class PlatformUtil {
        static get IsiOS(): boolean { return cc.sys.platform == cc.sys.IPHONE || cc.sys.platform == cc.sys.IPAD; }
        static get IsWechat(): boolean { return cc.sys.platform === cc.sys.WECHAT_GAME; }

        // ! 热更新时调用的接口，App 尚未实例化时调用
        static OpenAppStore(cfg: TSDKCfg): void {
            if(this.IsiOS) {
                cc.sys.openURL(`itms-apps://itunes.apple.com/app/id${cfg.iOS.AppId}`)
            }
        }
    }
}
