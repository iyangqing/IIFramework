/// <reference path="BaseUIComp.ts" />

namespace numas {
    export abstract class UIPanel<ARGS=any> extends BaseUIComp implements IAutoCloseUIComp<ARGS> {
        // 打开页面时传入的参数
        protected args: ARGS = null;
        // 当前页面是否处于 Open 状态 （创建 -> Open)
        private _$isOpened_: boolean = false;
        private _$isOpening_: boolean = false;
        //! UIMgr 关闭此节点时使用此变量，不允许更改名称
        private _$uph_: UIPH = null;
        GetUPH(): UIPH { return this._$uph_; }
        GetResKey(): string { return this._$uph_.GetResKey(); }
        //! 框架层在 cc.instantiate UIPanel 前，会调用此函数，和 $__i_CloseByUPH 成对出现。
        $__i_InitByUPH(placeHolder: UIPH) {
            this._$uph_ = placeHolder;
            this.OnCreate();
        }

        //! 框架层在 destroy UIPanel 前，会调用此函数，和 $__i_InitByUPH 成对出现。
        $__i_CloseByUPH() {
            if(this._$isOpening_) {
                console.error(`UIPanel >> Open ${this.name} 时调用了关闭，这是不允许的逻辑`)
                return;
            }
            this._$isOpened_ = false;
            this.OnRelease();
            //! 一定要先调用 OnRelease ，让开发者定义的逻辑先走完，再进行资源相关的解绑和释放；
            this.__i_CloseAllAutoCloseUIComp();
        }

        //! 框架层调用此方法
        $__i_OnOpen(uiArgs: ARGS) {
            if(this._$isOpened_) {
                console.error("UIPanel >> 已经处于打开状态，不应该重复调用此方法")
                return;
            }
            this._$isOpened_ = true;
            this._$isOpening_ = true;
            this.args = uiArgs;
            this.OnOpen(uiArgs);
            this._$isOpening_ = false;
        }
        
        /**
         * 页面被创建出来时调用的函数，由子类实现该接口
         */
        protected abstract OnCreate(): void;

        /**
         * 页面释放时调用的
         */
        protected abstract OnRelease(): void;

        /**
         * 页面被创建出来时调用的函数，由子类实现该接口
         * @param uiArgs 打开页面时传入的参数
         */
        protected abstract OnOpen(uiArgs: ARGS): void;

        /**
         * 销毁页面应当调用此接口 
         */
        Close() {
            this.TryNotifyGuideEvent();
            // 当前节点的父节点来进行释放
            UIMgr.ins.Close(this)
        }

        /**
         * 定义什么时候允许数据绑定，重写父类方法，只有在打开的情况下才允许进行绑定
         */
        private _m_BVList_: BV<any>[] = [];
        protected BindBV<T>(observer: BV<T>, callback: ValueChangedFunc<T>, callOnBinded: boolean) {
            observer.Bind(callback, callOnBinded, this)
            this._m_BVList_.push(observer)
        }
        protected UnbindAllBV(){ while(this._m_BVList_.length > 0) { this._m_BVList_.pop().TargetUnbind(this) } }

        protected onDestroy() {
            if(this._$isOpened_) {
                console.warn(`不规范的调用方式 >> 未调用 ${this.name}.Close() 方法进行对象的移除`)
            }
            this.UnbindAllBV();
            this.__i_CloseAllAutoCloseUIComp();
            super.onDestroy();
        }

        //#region //! 引导模块支持
        private _guideNotify: boolean = false;
        SetGuideNotificationActive(active: boolean) {
            this._guideNotify = active;
        }
        private TryNotifyGuideEvent() {
            if(!this._guideNotify) {
                return;
            }
            let event = `guide.ui.close.${this.GetResKey()}`;
            console.info(`引导 >> 全局关闭消息 >> 派发 ${event}`)
            EventCenter.ins.emit(event);
        }
        //#endregion

        //! 自动 Close 关联的 UIComp
        __i_AutoCloseUIComp<T extends UIComp<any>>(uiComp: T): T {
            this._I_AutoCloseUICompQueue.Enqueue(uiComp);
            return uiComp;
        }
        private _i_UICompQueue: Queue<UIComp<any>> = null;
        private get _I_AutoCloseUICompQueue(): Queue<UIComp<any>> {
            if(this._i_UICompQueue === null) {
                this._i_UICompQueue = AnyQueue.Borrow();
            }
            return this._i_UICompQueue;
        }
        private __i_CloseAllAutoCloseUIComp() {
            if(this._i_UICompQueue !== null) {
                this._i_UICompQueue.RemoveAll(uiComp=>uiComp.Close());
                this._i_UICompQueue.Return();
                this._i_UICompQueue = null;
            }
        }
    }
}
