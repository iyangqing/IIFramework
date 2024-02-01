/// <reference path="Queue.ts" />
namespace numas {
    export class AnyQueue extends Queue<any> {
        public static Borrow(): AnyQueue { return ReferencePool.Borrow(AnyQueue); }
        public Return() { ReferencePool.Return(AnyQueue, this); }
    }
}
