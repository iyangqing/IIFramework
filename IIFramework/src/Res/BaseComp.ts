namespace numas {
    class AssetItemKeeper implements IReference {
        target: cc.Asset = null;
        Reset(): void {
            if(this.target !== null) {
                this.target.decRef();
                this.target = null;
            }
        }
        public static Borrow(): AssetItemKeeper { return ReferencePool.Borrow(AssetItemKeeper) }
        public Return() { ReferencePool.Return(AssetItemKeeper, this); }
        ReplaceWith(data: cc.Asset): AssetItemKeeper {
            data.addRef();
            this.Reset();
            this.target = data;
            return this;
        }
    }

    export class BaseComp extends cc.Component {
        protected onDestroy() {
            this.StopAllScheduler();
            this.offGlobal();
            this.RemoveAllAssetProperty();
            this.Destroy_AutoRelease();
            this.RemoveAllUserData();
        }

        //#region //! 用户数据
        private __im_UserData: Map<string, any> = null;
        private get _i_userdata(): Map<string, any> { if(this.__im_UserData === null) { this.__im_UserData = new Map(); } return this.__im_UserData; }
        SetUserData(key:string, data: any) { this._i_userdata.set(key, data); }
        GetUserData<T>(key:string): T { return <T>this._i_userdata.get(key); }
        HasUserData(key:string): boolean { return this._i_userdata.has(key); }
        RemoveUserData(key: string) { this._i_userdata.delete(key); }
        RemoveAllUserData() { if(this.__im_UserData !== null) { this._i_userdata.clear(); } }
        //#endregion

        //#region //! EventCenter
        protected onGlobal<T extends Function>(type: string, callback: T): T { return EventCenter.ins.on(type, callback, this); }
        protected emitGlobal(key: string, arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any): void { EventCenter.ins.emit(key, arg1, arg2, arg3, arg4, arg5); }
        protected offGlobal() { EventCenter.ins.targetOff(this); }
        //#endregion

        //#region //! 自动释放关联资源
        AutoReturn<T extends IReference>(bv: T): T{ this._I_AutoReleaseItemQueue.Enqueue(AutoReleaseItem.Borrow(bv, EItemType.IReference)); return bv; }
        //! DataCache
        protected GetDataCache<T>(dataCacheName): T { return ResMgr.ins.GetDataCache(dataCacheName) as any as T }
        protected AddAutoReleaseDataCache<T extends DataCache>(dataCacheName:string, type: {new(): T})  { ResMgr.ins.AddDataCache(dataCacheName, type); this._I_AutoReleaseItemQueue.Enqueue(AutoReleaseItem.Borrow(dataCacheName, EItemType.DataCache)); }
        //! 自动释放的资源
        AutoReleaseRes(resKey: string | string[]) { if(typeof(resKey) === "string") { this.__AutoReleaseRes(resKey); }else{ resKey.forEach(k => this.__AutoReleaseRes(k)); } }
        private __AutoReleaseRes(resKey: string) { ResMgr.ins.AddResRef(resKey); this._I_AutoReleaseItemQueue.Enqueue(AutoReleaseItem.Borrow(resKey, EItemType.ResKey)); }

        /**
         * 组件销毁时自动释放所有keep的资源
         */
        private Destroy_AutoRelease() {
            // 释放资源，组件销毁时自动调用
            if(this._i_AutoQueue != null) {
                ResMgr.ins.DestroyAutoReleaseItems(this._i_AutoQueue);
                this._i_AutoQueue.Return();
                this._i_AutoQueue = null;
            }
        }
        private _i_AutoQueue: Queue<AutoReleaseItem> = null;
        private get _I_AutoReleaseItemQueue(): Queue<AutoReleaseItem> {
            if(this._i_AutoQueue === null) {
                this._i_AutoQueue = AnyQueue.Borrow();
            }
            return this._i_AutoQueue;
        }
        //#endregion
    
        //#region //! 替换型号占位功能（举例子：设置某个图片的时，需要对 SpriteFrame 进行 addRef，再次设置前，旧的对象需要 decRef）
        private __im_RefData: Map<string, AssetItemKeeper> = null;
        private get _i_RefData(): Map<string, AssetItemKeeper> { if(this.__im_RefData === null) { this.__im_RefData = new Map(); } return this.__im_RefData; }
        protected SetAssetProperty<T extends cc.Asset>(key:string, data: T) {
            if(this._i_RefData.has(key)) {
                this._i_RefData.get(key).ReplaceWith(data)
            }else{
                this._i_RefData.set(key, AssetItemKeeper.Borrow().ReplaceWith(data));
            }
            return data;
        }
        protected RemoveAllAssetProperty() {
            if(this.__im_RefData === null) {
                return;
            }
            this.__im_RefData.forEach(it=>it.Return());
            this.__im_RefData.clear();
            this.__im_RefData = null;
        }
        //#endregion
    
        //#region //! 调度功能
        private __im_SchedulerMap: Map<string, Function> = null;
        private get _I_SchedulerMap(): Map<string, Function> { if(this.__im_SchedulerMap === null) { this.__im_SchedulerMap = new Map(); } return this.__im_SchedulerMap; }
        protected HasScheduler(key: string): boolean { return (this.__im_SchedulerMap !== null) && this.__im_SchedulerMap.has(key); }
        protected RegisterScheduler(key: string, func: Function) {
            if(this.HasScheduler(key)) {
                console.error(`${this.name}.RegisterScheduler >> 已注册有调度函数 >> 关键字${key}`)
            }
            this._I_SchedulerMap.set(key, func);
        }
        protected StartScheduler(key: string, func: Function, interval: number, repeat: number = cc.macro.REPEAT_FOREVER, delay: number = 0): void {
            if(!this.HasScheduler(key)) {
                this.RegisterScheduler(key, func);
                this.schedule(func, interval, repeat, delay);
            }
        }
        protected StopScheduler(key): void {
            if(this.HasScheduler(key)) {
                let scheduler = this.__im_SchedulerMap.get(key)
                this.__im_SchedulerMap.delete(key);
                this.unschedule(scheduler);
            }
        }
        private StopAllScheduler() {
            if(this.__im_SchedulerMap !== null) {
                let m = this.__im_SchedulerMap;
                this.__im_SchedulerMap = null;
                m.forEach(func=>this.unschedule(func));
                m.clear();
            }
        }
        //#endregion
    } 
}
