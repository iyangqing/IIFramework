/// <reference path="Res/BaseUIComp.ts" />

namespace numas {
    export abstract class App extends BaseUIComp {
        abstract get Version(): string;
        abstract get sdkCfg(): TSDKCfg;
        protected abstract get StartBundlePrefabCfg(): TPrefabCfg;
        protected abstract AdapterCanvas(canvas: cc.Canvas): void;
        protected get FrameRate(): number { return 60; }
        protected abstract OnAppLoad(): void;
        protected get AppTracing(): boolean { return true; }

        static ins: App = null;
        private _canvas: cc.Canvas = null;
        private _platform: PlatformBase = null;
        get p(): PlatformBase { return this._platform; }

        private readonly START_BUNDLE_NAME: string = "StartBundle"; // 游戏基础包名



    
        onLoad() {
            if(CC_DEBUG) {
                console.info(">> App::onLoad")
            }
            if(App.ins === null) { App.ins = this; }
            else { this.destroy(); }
            
            this._canvas = this.getComponent(cc.Canvas);
            this.AdapterCanvas(this._canvas);
            // 设置当前节点为常驻节点
            cc.game.addPersistRootNode(this.node)
            this.setDisplayStats(false);
            this.setFrameRate(this.FrameRate);
            // 本地存储管理器-设备级别
            this.addComponent(LSMgr).UseDefaultHelper();
            // 本地存储管理器-用户级别
            this.addComponent(UserLSMgr).UseDefaultHelper();
            // 初始化资源管理器
            this.addComponent(ResMgr);
            // 初始化界面管理器
            this.addComponent(UIMgr);
            // 音频管理
            this.addComponent(AudioMgr).UseDefaultHelper();
            // 平台帮助类
            this._platform = (<PlatformBase>this.addComponent(this.GetPlatformComponent())).Init(this.sdkCfg);
            // // 热更新组件
            // this.addComponent(HotUpdateMgr).Init(this.START_BUNDLE_NAME)

            //! 默认语言包加载
            LangUtil.AddLangCfg(_LangCfg_DefaultJson);
            //! 注册预制
            registerPrefabCfg(IIStartPrefabCfg.dft, this.START_BUNDLE_NAME);
            // registerPrefabCfg(IIStartPrefabCfg.hotupdate, this.START_BUNDLE_NAME);
            registerPrefabCfg(this.StartBundlePrefabCfg, this.START_BUNDLE_NAME);
            //! 热更新检测
            let __CehckUpdateOnlyOnce = Util.onceCall(()=>{
                this.__LoadStartResListAndOnLoad();
            }, 3)
            UIMgr.ins.Open(IIStartPrefabCfg.dft.panel.BlockInputUIPanel.key, null, __CehckUpdateOnlyOnce);
            UIMgr.ins.Open(IIStartPrefabCfg.dft.panel.LoadingUIPanel.key, null, __CehckUpdateOnlyOnce);
            UIMgr.ins.Open(IIStartPrefabCfg.dft.panel.WaitingUIPanel.key, null, __CehckUpdateOnlyOnce);
        }

        private __LoadStartResListAndOnLoad() {
            let resKeys = [];
            for(let k in this.StartBundlePrefabCfg.panel) {
                resKeys.push(this.StartBundlePrefabCfg.panel[k].key);
            }
            for(let k in this.StartBundlePrefabCfg.comp) {
                resKeys.push(this.StartBundlePrefabCfg.comp[k].key);
            }
            this.LoadResList(resKeys, this.OnPreAppLoad.bind(this), true, true);
        }

        private OnPreAppLoad() {
            if(this.AppTracing) {
                if(PlatformUtil.IsiOS) {
                    iOSATT.ins.RequestTrackingAuthorization(auth=>{
                        this.OnAppLoad();
                    }, true);
                }else{
                    this.OnAppLoad();
                }
            }else{
                this.OnAppLoad();
            }
        }

        protected EnterFirstGame(firstGameBundleName: string): void {
            // 初始化广告模块
            this.p.ad.InitByScript();
            // 进入游戏场景
            UIMgr.ins.LoadBundleStage(firstGameBundleName);
        }

        /**
         * 是否显示左下角调试信息
         * @param displayStats 
         * @returns App 自己（链式调用）
         */
        setDisplayStats(displayStats: boolean): App {
            if(CC_DEBUG) {
                console.info(`>> App::setDisplayStats: ${displayStats}`)
            }
            cc.debug.setDisplayStats(displayStats);
            return this;
        }

        /**
         * 运行帧率
         * @param frameRate 帧率 
         * @returns App 自己（链式调用）
         */
        setFrameRate(frameRate: number): App {
            if(CC_DEBUG) {
                console.info(`>> App::setFrameRate: ${frameRate}`)
            }
            cc.game.setFrameRate(frameRate);
            return this;
        }

        protected FitHeight(): void {
            this._canvas.fitHeight = true;
            this._canvas.fitWidth = false;
        }

        protected FitWidth(): void {
            this._canvas.fitWidth = true;
            this._canvas.fitHeight = false;
        }

        /** 
         * 屏幕适配方案
         * @returns App 自己（链式调用）
         */
        protected FitCanvas(): App {
            // 适配解决方案
            let canvas = this._canvas;
            // 设计分辨率
            let _designWidth: number = canvas.designResolution.width;
            let _designHeight: number = canvas.designResolution.height;

         

            if (cc.winSize.width*_designHeight <= _designWidth*cc.winSize.height)
            {
                // 屏幕更窄（iPhoneX)
                // 设计分辨率更小，高度更小（ 当前设备 iPhone X ）
                canvas.fitHeight = false;
                canvas.fitWidth = true;
            }
            else
            {
                // 屏幕更宽（iPad)
                //（ 当前设备 iPad ）
                canvas.fitHeight = true;
                canvas.fitWidth = false;
            }
            if(CC_DEBUG) {
                console.info(`>> App::FitCanvas: fitHeight=${canvas.fitHeight} fitWidth=${canvas.fitWidth} `)
            }
            return this;
        }

        /** 
         * 屏幕适配方案，根据可视宽高
         * @returns App 自己（链式调用）
         */
        protected FitCanvasWithVisiableSize(visibleWidth:number, visibleHeight: number): App {
            // 适配解决方案
            let canvas = this._canvas;
            // 设计分辨率
            let _designWidth: number = canvas.designResolution.width;
            let _designHeight: number = canvas.designResolution.height;
            console.assert(visibleWidth <= _designWidth && visibleHeight <= _designHeight, "屏幕适配 >> 传入的可视区域必须小于设计分辨率");
            canvas.designResolution = cc.size(visibleWidth, visibleHeight)
            if (cc.winSize.width*visibleHeight <= visibleWidth*cc.winSize.height)
            {
                // 屏幕更窄（iPhoneX)
                // 设计分辨率更小，高度更小（ 当前设备 iPhone X ）
                canvas.fitHeight = false;
                canvas.fitWidth = true;
            }
            else
            {
                // 屏幕更宽（iPad)
                //（ 当前设备 iPad ）
                canvas.fitHeight = true;
                canvas.fitWidth = false;
            }
            this.node.setContentSize(cc.winSize);
            if(CC_DEBUG) {
                console.info(`>> App::FitCanvas: fitHeight=${canvas.fitHeight} fitWidth=${canvas.fitWidth} `)
            }
            return this;
        }

        delayCall(seconds: number, cb: Function, block: boolean = false) {
            if(block) {
                UIMgr.ins.blockSeconds(seconds, cb);
            }else{
                this.scheduleOnce(cb, seconds);
            }
        }

        Debug() {
            console.info(`>> App::Debug`)
            ResMgr.ins.Debug();
            UIMgr.ins.Debug();
            ReferencePool.Debug();
        }

        /**
         * 获取平台帮助类
         * @returns 平台帮助类
         */
        private GetPlatformComponent(): any {
            if(PlatformUtil.IsWechat) {
                // 微信平台
                return WeChatPlatform;
            }else{
                if(PlatformUtil.IsiOS) {
                    return iOSPlatform;
                }else{
                    return DefaultPlatform;
                }
            }
        }
    }
}
