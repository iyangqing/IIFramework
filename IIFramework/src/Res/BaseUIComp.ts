/// <reference path="../Core/DataBinding/BV.ts" />
/// <reference path="./BaseComp.ts" />
namespace numas {
    export class ResListLoaderInfo {
        private static _ins: ResListLoaderInfo = null;
        static get ins(): ResListLoaderInfo {
            if(this._ins === null) {
                this._ins = new ResListLoaderInfo();
            }
            return this._ins;
        }
        loaderCnt: NumberBV = NumberBV.Borrow(0);
        totalTaskCnt: NumberBV = NumberBV.Borrow(0);
        finishTaskCnt: NumberBV = NumberBV.Borrow(0);
    }

    export interface IAutoCloseUIComp<ARGS> {
        __i_AutoCloseUIComp<T extends UIComp<ARGS>>(uiComp: T): T;
    }

    export class BaseUIComp extends BaseComp {
        private static _s_LOAD_EVENT_ID: number = 0;
        private static get LOAD_EVENT(): string { ++this._s_LOAD_EVENT_ID; return `_i_ResKeeper_${this._s_LOAD_EVENT_ID}`; }
        PositionTo<SELF extends BaseUIComp>(x: cc.Vec2|cc.Vec3|number, y?: number, z?: number): SELF { this.node.setPosition(x, y, z); return this as any; }
        protected onDestroy() {
            this.RemoveAllIIClickHandler();
            this.Destroy_LoadResKey();
            super.onDestroy();
        }
        //! 任务
        protected get Task(): task.TaskComponent { return UIUtil.getOrAddComponent(this.node, task.TaskComponent); }
        
        //! 资源加载
        protected UUID_GROUP_KEY(key: string): string { return `${this.uuid}${key}` }
        private _i_b_LoadFunctionCalled: boolean = false;
        protected LoadRes<T extends cc.Asset>(resKey: string, cb: (asset: T, resKey: string)=>void, autoReleaseRes: boolean, group: string = null): void {
            this._i_b_LoadFunctionCalled = true;
            let _event = BaseUIComp.LOAD_EVENT;
            ResMgr.ins.node.on(_event, (asset: T, resKey: string)=>{
                if(autoReleaseRes) {
                    this.AutoReleaseRes(resKey);
                }
                cb(asset, resKey);
            }, this);
            if(group != null) {
                ResMgr.ins.LoadWithEventByGroup(_event, resKey, group);
            }else{
                ResMgr.ins.LoadWithEvent(_event, resKey);
            }
        }
        private Destroy_LoadResKey(): void {
            if(this._i_b_LoadFunctionCalled) {
                this._i_b_LoadFunctionCalled = false;
                ResMgr.ins.node.targetOff(this);
            }
        }
        //! 资源加载
        /** 加载多个资源的一定是需要保持引用 */
        protected LoadResList(resKeyList: string[], cb: Function, hideLoading: boolean = false, showWaiting: boolean = false, parallelCount: number = 5): void {
            if(resKeyList.length == 0) {
                Util.safeCall(cb);
                return;
            }
            if(showWaiting) {
                UIMgr.ins.AddWaitingRef();
            }else{
                UIMgr.ins.AddBlockRef();
            }
            if(!hideLoading) {
                // 进度信息
                ResListLoaderInfo.ins.totalTaskCnt.v += resKeyList.length;
                ++ResListLoaderInfo.ins.loaderCnt.v;
            }

            let _task = this.Task;
            resKeyList.forEach(resKey => { 
                this.AutoReleaseRes(resKey);
                _task.AddFunc((resolve)=>{
                    ResMgr.ins.Load(resKey, (asset, resKey)=>{
                        if(!hideLoading) {
                            // ! 进度信息
                            ++ResListLoaderInfo.ins.finishTaskCnt.v;
                        }
                        resolve();
                    });
                })
            });

            _task.Run(parallelCount, ()=>{
                if(!hideLoading) {
                    // ! 进度信息
                    --ResListLoaderInfo.ins.loaderCnt.v;
                    if(ResListLoaderInfo.ins.loaderCnt.v == 0) {
                        ResListLoaderInfo.ins.finishTaskCnt.v = 0;
                        ResListLoaderInfo.ins.totalTaskCnt.v = 0;
                    }
                }
                if(showWaiting) {
                    UIMgr.ins.DecWaitingRef();
                }else{
                    UIMgr.ins.DecBlockRef();
                }
                Util.safeCall(cb);
            });
        }

        //#region //! 点击事件的绑定
        public OnIIClick(event: cc.Event.EventTouch, key: string) {
            if(key == null) {
                console.info(`UIComp::OnIIClick >> 按钮点击未设置关键字 CustomData`);
                return;
            }
            if(this.m_IIEventHandler.has(key)) {
                let handler = this.m_IIEventHandler.get(key);
                return handler(event);
            }else{
                console.info(`UIComp::OnIIClick >> 点击事件 ${key} 没有响应函数`)
                return;
            }
        }
        
        private m_IIEventHandler: Map<string, Function> = new Map<string, Function>()
        protected SetIIClickHandler(key:string, handler: Function, hideSound: boolean = false, blockInputSeconds: number = 0) {
            this.m_IIEventHandler.set(key, (event)=>{
                if(blockInputSeconds > 0) {
                    UIMgr.ins.blockSeconds(blockInputSeconds, null);
                }
                if(!hideSound) {
                    AudioMgr.ins.PlayEffect();
                }
                if(handler) {
                    handler(event)
                }
            });
        }
        protected RemoveIIClickHandler(key:string): void { if(this.m_IIEventHandler.has(key)) { this.m_IIEventHandler.delete(key); } }
        protected RemoveAllIIClickHandler(): void { this.m_IIEventHandler.clear(); }
        //#endregion
    }
}
