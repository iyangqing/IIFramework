/// <reference path="./BaseComp.ts" />
namespace numas {
    export function dirty(seconds: number){
        return function<T extends DataCache>(target: T, methodName: string, descriptor: PropertyDescriptor) {
            let oldMethod = descriptor.value
            descriptor.value = function(...args : any[]){
                let _dirty = oldMethod.apply(this, args);
                if(_dirty) {
                    this.markDirty(seconds);
                }
            }
            return descriptor
        }
    }

    export abstract class DataCache extends BaseComp {
        protected abstract OnRegister();
        protected abstract OnUnRegister();
        protected abstract OnDirty();

        private _i_Name: string = null;
        get DataCacheName(): string { return this._i_Name; }
        set DataCacheName(dataCacheName: string) { this._i_Name = dataCacheName; }

        private _i_Dirty: boolean = false;
        private _i_DirtySeconds: number = 0;
        private _i_MaxSecondsToSave: number = 86400;

        private __i_Tick(dt: number) {
            if(this._i_Dirty) {
                this._i_DirtySeconds += dt;
                if(this._i_DirtySeconds >= this._i_MaxSecondsToSave) {
                    this.__i_StopTick();
                    this.OnDirty();
                }
            }
        }
        private __i_StopTick() {
            if(this.GetUserData("_i_TICK")) {
                this._i_MaxSecondsToSave = 86400;
                this._i_Dirty = false;
                this._i_DirtySeconds = 0;
                this.unschedule(this.GetUserData("_i_TICK"))
            }
        }

        protected __i_OnPreRegister() { /** do nothing */}
        __i_OnRegisterTo() {
            this.__i_OnPreRegister();
            this.OnRegister();
        }
        __i_OnUnRegister() {
            this.__i_StopTick();
            if(this._i_Dirty) {
                this.OnDirty();
            }
            this.OnUnRegister();
        }

        protected markDirty(maxSecondsToSave: number) {
            if(!this._i_Dirty) {
                this._i_Dirty = true;
                if(maxSecondsToSave < this._i_MaxSecondsToSave) {
                    this._i_MaxSecondsToSave = maxSecondsToSave;
                }
                if(!this.HasUserData("_i_TICK")) {
                    this.SetUserData("_i_TICK", this.__i_Tick.bind(this, 1));
                }
                this.schedule(this.GetUserData("_i_TICK"), 1, cc.macro.REPEAT_FOREVER)
            }else{
                if(maxSecondsToSave < this._i_MaxSecondsToSave) {
                    this._i_MaxSecondsToSave = maxSecondsToSave;
                }
            }
        }
    }

    export abstract class LSDataCache<DATA extends {} = any> extends DataCache {
        protected abstract get LSKey(): string;
        private _lsData: DATA = null;
        protected get data(): DATA { return this._lsData; };
        protected abstract get DefaultLSData(): DATA;
        protected Save() { UserLSMgr.ins.setObject(this.LSKey, this._lsData, true); }
        protected OnDirty() { this.Save(); }
        __i_OnPreRegister() {
            if(UserLSMgr.ins.hasKey(this.LSKey)) {
                this._lsData = UserLSMgr.ins.getObject(this.LSKey);
            }else{
                this._lsData = this.DefaultLSData;
            }
        }
    }


    export abstract class Logic {
        protected static GetDataCache<T>(dataCacheName): T { return ResMgr.ins.GetDataCache(dataCacheName) as any; }
        protected static emitGlobal(key: string, arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any): void { EventCenter.ins.emit(key, arg1, arg2, arg3, arg4, arg5); }
    }

    export abstract class Entity extends cc.EventTarget implements IReference {
        abstract Reset();
        Return() {
            this.Reset();
            this.UnbindAllBV();
            this.Destroy_AutoRelease();
        }

        //#region //! AutoReturn
        ReturnBy<SELF extends Entity>(target: IAutoReturn): SELF { return target.AutoReturn(this) as any; }
        AutoReturn<T extends IReference>(bv: T): T{ this._I_AutoReleaseItemQueue.Enqueue(AutoReleaseItem.Borrow(bv, EItemType.IReference)); return bv; }
        private _i_AutoQueue: Queue<AutoReleaseItem> = null;
        private get _I_AutoReleaseItemQueue(): Queue<AutoReleaseItem> {
            if(this._i_AutoQueue === null) {
                this._i_AutoQueue = AnyQueue.Borrow();
            }
            return this._i_AutoQueue;
        }
        private Destroy_AutoRelease() {
            // 释放资源，组件销毁时自动调用
            if(this._i_AutoQueue != null) {
                ResMgr.ins.DestroyAutoReleaseItems(this._i_AutoQueue);
                this._i_AutoQueue.Return();
                this._i_AutoQueue = null;
            }
        }
        //#endregion

        //#region //! BindBV
        private _m_BVList_: BV<any>[] = [];
        protected BindBV<T>(observer: BV<T>, callback: ValueChangedFunc<T>, callOnBinded: boolean) {
            observer.Bind(callback, callOnBinded, this)
            this._m_BVList_.push(observer)
        }
        protected UnbindAllBV(){ while(this._m_BVList_.length > 0) { this._m_BVList_.pop().TargetUnbind(this) } }
        //#endregion
    }
}