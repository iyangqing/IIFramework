namespace numas {    
    interface IValueChangeHandler<T> extends IReference {
        Return(): void;
        OnBindingValueChanged(cur: T, pre: T, bindableData: BV<T>): void
        Reset(): void;
    }
    
    class ValueChangeEventHandler implements IValueChangeHandler<any> {
        public static Borrow(): ValueChangeEventHandler { return ReferencePool.Borrow(ValueChangeEventHandler); }
        public Return() { ReferencePool.Return(ValueChangeEventHandler, this); }
        private m_Callback: ValueChangedFunc<any> = null;
        public SetCallback(callback: ValueChangedFunc<any>){ this.m_Callback = callback }
        OnBindingValueChanged(cur: any, pre: any): void { return this.m_Callback(cur, pre) }
        Reset(): void { this.m_Callback = null; }
    }

    class HandlerTargetPaire implements IReference {
        handler: ValueChangeEventHandler = null;
        target: any = null;
        Reset(): void {
            if(this.handler != null) {
                this.handler.Return();
            }
            this.handler = null;
            this.target = null;
        }
        public static Borrow(): HandlerTargetPaire { return ReferencePool.Borrow(HandlerTargetPaire); }
        public Return() { ReferencePool.Return(HandlerTargetPaire, this); }
    }

    export abstract class BV<T> implements IReference {
        protected m_CacheValue: T = null;
        constructor(val: T) {
            this.m_ObserversList = AnyQueue.Borrow();
            this.m_CacheValue = val;
        }
        Reset(): void {
            this.UnbindAll()
            this.m_CacheValue = null;
        }
        abstract Return(): void;
        ReturnBy<SELF extends BV<T>>(target: IAutoReturn): SELF { return target.AutoReturn(this) as any; }
        get v(): T { return this.m_CacheValue }
        set v(val: T) {
            let pre = this.m_CacheValue;
            if(!this.IsEqual(val, pre)) {
                this.m_CacheValue = val;
                this.NotifyObservers(val, pre)
            }
        }
        SetValueWithoutNotification(val: T) {
            this.m_CacheValue = val;
        }
        protected abstract IsEqual(newVal: T, curVal: T) : boolean;
        /* ***************************************
        * 观察者部分
        * ***************************************/
        private m_ObserversList: Queue<any> = null;
        protected NotifyObservers(cur: T, pre: T) { this.m_ObserversList.ForEach(obs => obs.handler.OnBindingValueChanged(cur, pre)) }
        Bind<SELF extends BV<T>>(handler: ValueChangedFunc<T>, callOnBind: boolean, target: any): SELF {
            let anyHandler = ValueChangeEventHandler.Borrow();
            anyHandler.SetCallback(handler);

            let obj = HandlerTargetPaire.Borrow();
            obj.handler = anyHandler;
            obj.target = target;
            this.m_ObserversList.Enqueue(obj)
            if(callOnBind){ anyHandler.OnBindingValueChanged(this.v, this.v) }
            return this as any;
        }

        TargetUnbind(target: any) { this.m_ObserversList.Remove(elem => elem.target === target, elem => elem.Return()) }
        UnbindAll() { this.m_ObserversList.RemoveAll(elem => elem.Return()) }
    }
}
