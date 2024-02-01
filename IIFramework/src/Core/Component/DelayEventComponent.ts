namespace numas {
    export class DelayEventComponent extends cc.Component {
        //#region ******************************** 事件延迟机制 ********************************
        private m_IsEventHandlable: boolean = false;
        private m_EventQueue: Queue<Function> = null;
        private get EventQueue(): Queue<Function> {
            if(this.m_EventQueue === null) {
                this.m_EventQueue = AnyQueue.Borrow();
            }
            return this.m_EventQueue;
        }
        WrapEventHandler(handler: Function, target: any): Function {
            return (eventData: any) => {
                if(this.m_IsEventHandlable) {
                    handler.call(target, eventData)
                }else{
                    this.EventQueue.Enqueue(()=>handler.call(target, eventData));
                }
            }
        }
        HandleEvents() {
            this.m_IsEventHandlable = true;
            if(this.m_EventQueue !== null) {
                while(this.m_EventQueue.Count > 0) {
                    let cb: Function = this.m_EventQueue.Dequeue();
                    cb();
                }
            }
        }
        BlockEvents() {
            this.m_IsEventHandlable = false;
        }
        onDestroy() {
            if(this.m_EventQueue !== null) {
                this.m_EventQueue.Return();
                this.m_EventQueue = null;
            }
        }
    }
}
