namespace numas {
    /**
     * 占位节点
     * 当打开某个层级的 UI 时，因为加载 UI 相关的资源是异步的，因此需要使用到此占位节点作为容器节点
     **/
    export class UIPH extends cc.Component {
        static Borrow(): UIPH { return NodePool.Get("__i_UIPH", UIPH); }
        
        private _prefabKey: string = null;
        private _args: any = null;
        private _uiPanel: UIPanel = null;
        private _isLoading: boolean = false;
        private _isCloseAfterLoading: boolean = false;
        IsSameResKey(prefabKey: string): boolean { return this._prefabKey == prefabKey; }
        GetResKey(): string { return this._prefabKey; }
        OpenUI<ARGS>(zNode: cc.Node, prefabKey: string, args?: ARGS, cb?: Function|Resolve2<any,any>): void {
            this._prefabKey = prefabKey;
            this._args = args;
            this._isLoading = true;
            this.node.parent = zNode;
            this.node.setContentSize(zNode.getContentSize());

            ResMgr.ins.Load<cc.Prefab>(prefabKey, (prefab, resKey)=>{
                this._isLoading = false;
                let _node = cc.instantiate(prefab);
                _node.parent = this.node;
                this.node.name = `【UIPH】${prefabKey.substring(prefabKey.lastIndexOf("/")+1)}`;
                _node.setContentSize(this.node.getContentSize());
                let uiPanel = _node.getComponent(UIPanel);

                //! 绑定资源释放逻辑（原则-谁加载谁释放 ）
                //! PlaceHolder 会调用节点的 destroy 方法，导致 onDestroy 方法被调用，从而是否此资源引用计数
                uiPanel.AutoReleaseRes(resKey);
                this._uiPanel = uiPanel;
                uiPanel.$__i_InitByUPH(this);
                uiPanel.$__i_OnOpen(this._args);
                if(cb){ cb(this._uiPanel, this._args); }
                if(this._isCloseAfterLoading) {
                    this._isCloseAfterLoading = false;
                    this.CloseUI();
                }
            })
        }

        CloseUI() {
            if(this._isLoading) {
                // 正在加载的过程中，被其他业务逻辑关闭
                this._isCloseAfterLoading = true;
                return;
            }
            this.__CloseUI();
        }

        private __CloseUI() {
            this._uiPanel.$__i_CloseByUPH();
            this._uiPanel.node.removeFromParent(true);
            this._uiPanel.node.destroy();
            this._uiPanel = null;
            
            this.node.removeFromParent(true);
            this._isLoading = false;
            this._args = null;
            this._prefabKey = null;
            NodePool.Put("__i_UIPH", this);
        }
    }
}
