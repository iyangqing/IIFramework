/// <reference path="BaseLink.ts" />
namespace numas {
    export abstract class Stack<T> extends BaseLink<T>  {
        /***************************************************************************************************************************
         * Stack<T>
         ***************************************************************************************************************************/
        public get Top(): T { return this.FrontValue(); }
        public get Bottom(): T { return this.TailValue(); }
        public Push(elem: T): void { this.AddFront(elem); }
        public Pop(): T { return this.Get(); }
        public ReversePop(): T { return this.ReverseGet(); }
    }
}
