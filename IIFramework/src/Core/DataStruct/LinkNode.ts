namespace numas {
    export class LinkNode implements IReference
    {
        public Next: LinkNode = null;
        public Previous: LinkNode = null;
        public Value: any;

        Reset(): void {
            this.Next = null;
            this.Previous = null;
            this.Value = null;
        }

        public static Borrow(value: any = null): LinkNode {
            let ret = ReferencePool.Borrow(LinkNode);
            ret.Value = value;
            return ret;
        }
        
        public Return(): void { ReferencePool.Return(LinkNode, this); }
    }
}
