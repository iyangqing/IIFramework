/// <reference path="Stack.ts" />
namespace numas {
    export class AnyStack extends Stack<any> {
        public static Borrow(): AnyStack { return ReferencePool.Borrow(AnyStack); }
        public Return() { ReferencePool.Return(AnyStack, this); }
    }
}
