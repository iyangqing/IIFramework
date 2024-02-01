/// <reference path="BaseUIComp.ts" />

namespace numas {
    export abstract class UIComp<T> extends BaseUIComp implements IAutoCloseUIComp<T> {
        // 打开页面时传入的参数
        protected args: T = null;
        
        // 当前页面是否处于 Open 状态 （创建 -> Open)
        private _$isOpened_: boolean = false;
        private _$isOpening_: boolean = false;
        private _i_Close: boolean = false;
        $__internal_Create() {
            this.OnCreate();
        }

        Close() {
            if(this._i_Close) {
                return;
            }
            this._i_Close = true;
            this.OnRelease();
            this.UnbindAllBV();
            this.InterrupteAction();
            this.__i_CloseAllAutoCloseUIComp();
            this.node.removeFromParent();
            this.node.destroy();
        }

        //! 框架层调用此方法
        $__internal_OnOpen(uiArgs: T) {
            if(this._$isOpened_) {
                console.error("UIComp >> 已经处于打开状态，不应该重复调用此方法")
                return;
            }
            this._$isOpening_ = true;
            this._$isOpened_ = true;
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
        protected abstract OnOpen(uiArgs: any): void;

        /**
         * 定义什么时候允许数据绑定，重写父类方法，只有在打开的情况下才允许进行绑定
         */
        //#region //! 数据绑定相关接口
        private _m_BVList_: BV<any>[] = [];
        protected BindBV<T>(observer: BV<T>, callback: ValueChangedFunc<T>, callOnBinded: boolean) {
            observer.Bind(callback, callOnBinded, this)
            this._m_BVList_.push(observer)
        }
        protected UnbindAllBV(){ while(this._m_BVList_.length > 0) { this._m_BVList_.pop().TargetUnbind(this) } }
        //#endregion

        //! 自动 Close 关联的 UIComp
        CloseBy<SELF extends UIComp<T>>(target: IAutoCloseUIComp<any>): SELF { return target.__i_AutoCloseUIComp(this) as any; }
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

        protected onDestroy() {
            if(!this._i_Close) {
                console.warn(`不规范的调用方式 >> 未调用 ${this.name}.Close() 方法进行对象的移除`)
                this._i_Close = true;
                //! 一定要先调用 OnRelease ，让开发者定义的逻辑先走完，再进行资源相关的解绑和释放；
                this.OnRelease();
                this.InterrupteAction();
                this.__i_CloseAllAutoCloseUIComp();
                this.UnbindAllBV();
            }
            super.onDestroy();
        }

        //#region //! Tween 动画管理
        /* ***************************************
        * Action 管理
        * ***************************************/
        /** 正在执行一个动作，如果中途被打断了，执行此函数 */
        private _im_StopCallLinkedList: Queue<((self: any)=>void)> = null;
        private get _I_StopCallLinkedList(): Queue<((self: any)=>void)> {
            if(this._im_StopCallLinkedList === null) {
                this._im_StopCallLinkedList = AnyQueue.Borrow();
            }
            return this._im_StopCallLinkedList;
        }
        AddStopActionCall(stopCallback: (self: any)=>void) { this._I_StopCallLinkedList.Enqueue(stopCallback) }
        RemoveStopCall(call) { this._I_StopCallLinkedList.RemoveFirst(func=>func === call); }
        StopAllAction() {
            this._I_StopCallLinkedList.RemoveAll(stopCallback => stopCallback(this))
            this.node.stopAllActions()
        }
        private InterrupteAction() {
            if(this._im_StopCallLinkedList !== null && this._im_StopCallLinkedList.Count > 0) {
                this._im_StopCallLinkedList.RemoveAll()
                this.node.stopAllActions()
            }
        }
        //#endregion
    }
}
