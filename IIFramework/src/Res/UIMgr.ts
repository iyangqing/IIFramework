namespace numas {
    /**
     * 预制关键字到 ZIndex 的映射关系保持表
     */
    class UIKey2ZIndex {
        private static _ins: UIKey2ZIndex = null;
        static get ins(): UIKey2ZIndex {
            if(this._ins === null) {
                this._ins = new UIKey2ZIndex();
            }
            return this._ins;
        }
        private _m: Map<string, UIZIndex> = new Map()
        /**
         * 获取预制对应 UI 所属的层级
         * @param k 预制关键字（和类名一致）
         */
        GetZIndex(k: string): UIZIndex { return this._m.get(k); }

        /**
         * 设置预制对应的 UI 所在的 UI 层级
         * @param k 预制关键字（和类名一致） 
         * @param z 所在层级
         */
        SetZIndex(k: string, z: UIZIndex) {
            if(CC_DEBUG) {
                if(this._m.has(k)) {
                    if(this._m.get(k) !== z) {
                        console.error(`UIKey2ZIndex >> ${k} 前后设置了不同的层级`);
                    }
                    return;
                }
            }
            this._m.set(k, z);
        }
    }

    /**
     * 注册 UIStage
     * @param prefabKey 资源关键字
     * @param bundleName 预制的包名
     */
    export function registerUIStage(prefabKey: string, bundleName: string) {
        UIKey2ZIndex.ins.SetZIndex(prefabKey, UIZIndex.Stage);
        registerRes(prefabKey, bundleName, EResType.Stage);
    }

    /**
     * 注册 UIPanel
     * @param prefabKey 资源关键字
     * @param zIndex 预制类对应的层级
     * @param bundleName 预制的包名
     */
    export function registerUIPanel(prefabKey: string, zIndex: UIZIndex, bundleName: string) {
        UIKey2ZIndex.ins.SetZIndex(prefabKey, zIndex);
        registerRes(prefabKey, bundleName, EResType.Prefab);
    }

    /**
     * 注册 UIComp
     * @param resKey 资源关键字
     * @param bundleName 预制的包名
     */
    export function registerUIComp(resKey: string, bundleName: string): void {
        registerRes(resKey, bundleName, EResType.Prefab);
    }

    /**
     * UI 管理器
     */
    export class UIMgr extends cc.Component {
        static ins: UIMgr = null;
        /** 持有容器对象 */
        private _zs: {[key: number]: cc.Node} = {};
        /** UI 占位符 */
        private _phs: UIPH[] = [];

        onLoad() {
            if(CC_DEBUG) {
                console.info(">> UIMgr::onLoad")
            }
            if(UIMgr.ins === null) {
                UIMgr.ins = this;
            }
            else {
                this.destroy();
            }

            /*
             * 为每一个层级添加一个容器节点，不同层级的 UI 将放在对应的容器节点里，并设置容器节点尺寸为全屏尺寸
             */
            for(let key in UIZIndex) {
                if(isNaN(<any>key)){
                    let _node: cc.Node = new cc.Node("--" + key);
                    _node.setContentSize(this.node.getContentSize());
                    _node.parent = this.node;
                    let zIndex = parseInt(UIZIndex[key]);
                    _node.zIndex = zIndex;
                    this._zs[zIndex] = _node;
                }
            }

            this.block_ref.Bind(ref=>this.block.v = ref > 0, true, this);
            this.waiting_ref.Bind(ref=>this.waiting.v = ref > 0, true, this);
        }

        onDestroy() {
            this.waiting_ref.TargetUnbind(this);
            this.waiting.TargetUnbind(this);
            this.block_ref.TargetUnbind(this);
            this.block.TargetUnbind(this);
        }

        //#region //! Stage 管理
        /**
         * @param gameBundleName 子游戏包名
         * @param stageName 游戏场景名
         * @param args 打开场景所需参数
         * @param onUICompleted 切换场景完毕，UI 完成替换
         */
        LoadStage(gameBundleName: string, stageName: string, args?: any, onUICompleted?: Function): void {
            ResMgr.ins.LoadStage(gameBundleName, stageName, args, onUICompleted);
        }
        /**
         * 加载子游戏的接口（子游戏独立在某个 Bundle 中，这个 Bundle 下必须要有同名场景
         * @param gameBundleName 子游戏包名
         * @param args 打开场景所需参数
         * @param onUICompleted 切换场景完毕，UI 完成替换
         */
        LoadBundleStage(gameBundleName: string, args?: any, onUICompleted?: Function): void {
            ResMgr.ins.LoadStage(gameBundleName, gameBundleName, args, onUICompleted);
        }
        //#endregion

        //#region //! UI 管理
        /**
         * UIComp
         */
        Create<T extends UIComp<TARG>, TARG=any>(prefabKey: string, args?: TARG, parent?: cc.Node): T {
            let prefab = ResMgr.ins.GetRes<cc.Prefab>(prefabKey);
            let _node = cc.instantiate(prefab);
            let uiComp = <T>(_node.getComponent(UIComp));
            if(uiComp == null) {
                console.error(`>> ${prefabKey} 对应的组件资源没有提前注册`)
            }
            uiComp.$__internal_Create();
            if(parent != null) {
                uiComp.node.parent = parent;
            }
            uiComp.$__internal_OnOpen(args);
            return uiComp;
        }

        /**
         * 界面是否存在
         * @param prefabKey 
         * @returns 
         */
        Exist(prefabKey: string): boolean {
            // 如果使用已经打开过的 UI，判断当前是否打开过这类型的 UIPanel
            for(let i=this._phs.length-1; i>=0; --i) {
                if(this._phs[i].IsSameResKey(prefabKey)) {
                    return true;
                }
            }
            return false;
        }
        
        /**
         * 打开一个全屏的 UI
         * @param prefabKey 资源关键字
         * @param args UI 所需参数
         * @param afterOnOpen 打开后的回调
         */
        Open<ARGS=any>(prefabKey: string, args?: ARGS, afterOnOpen?: Resolve<any>|Function): void {
            let zIndex = UIKey2ZIndex.ins.GetZIndex(prefabKey);
            if(zIndex == null) {
                console.error(`${prefabKey} 拿不到 ZIndex`)
            }
            this.__Open(prefabKey, zIndex, args, afterOnOpen);
        }

        /**
         * 打开一个全屏的 UI
         * @param prefabKey 资源关键字
         * @param zIndex UI 所在的层级
         * @param args UI 所需参数
         * @param afterOnOpen 打开后的回调
         * @param useOpened 使用已经打开过的 UIPanel
         */
        private __Open<ARGS>(prefabKey: string, zIndex: UIZIndex, args?: ARGS, afterOnOpen?: Resolve<any>|Function): void {
            /** 获取 zIndex 对应的容器节点 */
            let zNode = this._zs[zIndex];
            let placeHolder = UIPH.Borrow();
            this._phs.push(placeHolder);
            placeHolder.OpenUI(zNode, prefabKey, args, afterOnOpen);
        }

        Close(uiPanel: UIPanel);
        Close(prefabKey: string, isAll: boolean);
        Close(...args: any[]): void {
            if(typeof args[0] === 'string') {
                let prefabKey: string = args[0];
                let isAll: boolean = args[1];
                for(let i=this._phs.length-1; i>=0; --i) {
                    if(this._phs[i].IsSameResKey(prefabKey)) {
                        let placeHolder = this._phs[i];
                        this._phs.splice(i, 1);
                        placeHolder.CloseUI();
                        if(!isAll) {
                            return;
                        }
                    }
                }
            }else{
                let uiPanel: UIPanel = args[0] as UIPanel;
                let _ph: UIPH = uiPanel.GetUPH();
                for(let i=this._phs.length-1; i>=0; --i) {
                    if(this._phs[i] === _ph) {
                        this._phs.splice(i, 1);
                        //! 只有找到的对象才能 Close，否则一定是已经被关闭了的对象
                        _ph.CloseUI();
                        break;
                    }
                }
            }
        }
        //#endregion

        //#region //! BlockInput 禁止输入
        /**
         * 引用计数
         */
        private readonly waiting_ref: NumberBV = NumberBV.Borrow(0);
        readonly waiting: BooleanBV = BooleanBV.Borrow(false);
        AddWaitingRef(): void { ++this.waiting_ref.v; }
        DecWaitingRef(): void { --this.waiting_ref.v; }
        private readonly block_ref: NumberBV = NumberBV.Borrow(0);
        AddBlockRef(): void { ++this.block_ref.v; }
        DecBlockRef(): void { --this.block_ref.v; }
        readonly block: BooleanBV = BooleanBV.Borrow(false);
        /**
         * 几秒后回调，禁止玩家输入
         * @param seconds 
         * @param cb 
         */
        blockSeconds(seconds: number, cb: Function) {
            ++this.block_ref.v;
            this.scheduleOnce(()=>{
                --this.block_ref.v;
                Util.safeCall(cb);
            }, seconds);
        }
        //#endregion

        //#region //! Dialog | Message
        OpenDialog1(msg: string, btnFunc0?: Function, label0?: string, title?: string) { this.Open(IIStartPrefabCfg.dft.panel.DialogUIPanel.key, DialogUIPanelArgs.Create1(msg, btnFunc0, label0, title)); }
        OpenDialog2(msg: string, btnFunc0Cancel?: Function, btnFunc1Sure?: Function, label0?: string, label1?: string, title?: string) { this.Open(IIStartPrefabCfg.dft.panel.DialogUIPanel.key, DialogUIPanelArgs.Create2(msg, btnFunc0Cancel, btnFunc1Sure, label0, label1, title)); }
        OpenDialog3(msg: string, btnFunc0?: Function, btnFunc1?: Function, btnFunc2?: Function, label0?: string, label1?: string, label2?: string, title?: string) { this.Open(IIStartPrefabCfg.dft.panel.DialogUIPanel.key, DialogUIPanelArgs.Create3(msg, btnFunc0, btnFunc1, btnFunc2, label0, label1, label2, title)); }
        ShowMsg(...msg: string[]) { this.Open<MsgUIPanelArgs>(IIStartPrefabCfg.dft.panel.MsgUIPanel.key, {msg}) }
        //#endregion

        Debug() {
            console.info("UIMgr >> Debug")
            for(let i=0;i<this._phs.length;++i) {
                console.info(`z: ${this._phs[i].node.zIndex} >> ${this._phs[i].GetResKey()}`)
            }
        }
    }
}
