/// <reference path="BaseLink.ts" />
namespace numas {
    export abstract class Queue<T> extends BaseLink<T> {
        /***************************************************************************************************************************
         * Queue<T> 定义
         ***************************************************************************************************************************/
        public get Front(): T { return this.FrontValue(); }
        public get Tail(): T { return this.TailValue(); }
        public Enqueue(elem: T): void { this.AddTail(elem); }
        public Dequeue(): T { return this.Get(); }
        public ReverseDequeue(): T { return this.ReverseGet(); }
    }
}
