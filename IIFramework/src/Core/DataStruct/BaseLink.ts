namespace numas {
    export abstract class BaseLink<T> implements IReference
    {
        /***************************************************************************************************************************
         * Public API
         ***************************************************************************************************************************/
        public get Count(): number { return this.m_len };
        public IndexOf(find: Predicate<T>): number { return this.__IndexOf(true, find); }
        public ReverseIndexOf(find: Predicate<T>): number { return this.__IndexOf(false, find); }
        public Fetch(find: Predicate<T>): T { return this.__Fetch(true, find); }
        public ReverseFetch(find: Predicate<T>): T { return this.__Fetch(false, find); }
        public FetchByIndex(index: number): T { return this.__FetchByIndex(true, index); }
        public ReverseFetchByIndex(index: number): T { return this.__FetchByIndex(false, index); }
        public Remove(find: Predicate<T>, handler?: Action<T>): void { this.__RemoveByFind(true, find, handler); }
        public ReverseRemove(find: Predicate<T>, handler: Action<T>): void { this.__RemoveByFind(false, find, handler); }
        public RemoveFirst(find: Predicate<T>, handler?: Action<T>): void { this.__RemoveFirstByFind(true, find, handler); }
        public ReverseRemoveFirst(find: Predicate<T>, handler: Action<T>): void { this.__RemoveFirstByFind(false, find, handler); }
        public RemoveAll(handler?: Action<T>) { this.__RemoveByFind(true, elem => true, handler); }
        public ReverseRemoveAll(handler?: Action<T>) { this.__RemoveByFind(true, elem => true, handler); }
        public For(breakIf: Predicate<T>): boolean { return this.__For(true, breakIf); }
        public ReverseFor(breakIf: Predicate<T>): boolean { return this.__For(false, breakIf); }
        public ForEach(handler: Action<T>): void { this.__ForEach(true, handler); }
        public ReverseForEach(handler: Action<T>): void { this.__ForEach(false, handler); }
        public CountIf(ifFunc: Predicate<T>): number {
            let count = 0;
            let parent = this.m_front;
            while (parent.Next != this.m_tail) {
                if (ifFunc(parent.Next.Value)) { ++count; }
                parent = parent.Next;
            }
            return count;
        }
        public Contains(find: Predicate<T>, handler?: Action<T>): boolean {
            let parent = this.m_front;
            while (parent.Next != this.m_tail) {
                if (find(parent.Next.Value)) {
                    handler && handler(parent.Next.Value);
                    return true;
                }
                parent = parent.Next;
            }
            return false;
        }
        /***************************************************************************************************************************
         * protected
         ***************************************************************************************************************************/
        protected FrontValue() : T { return this.m_front.Next.Value; }
        protected TailValue() : T { return this.m_tail.Previous.Value; }
        protected AddFront(elem: T) { this.AddNext(this.m_front, elem); }
        protected AddTail(elem: T) { this.AddPrevious(this.m_tail, elem); }
        protected Get(): T {
            if(this.Count > 0) {
                return this.RemoveNext(this.m_front);
            }else{
                throw new Error("Ensure 'Count > 0' before Get!");
            }
        }
        protected ReverseGet(): T {
            if(this.Count > 0) {
                return this.RemovePrevious(this.m_tail);
            }else{
                throw new Error("Ensure 'Count > 0' before ReverseGet!");
            }
        }
        /***************************************************************************************************************************
         * IReference
         ***************************************************************************************************************************/
        Reset(): void {
            this.RemoveAll();
            this.m_front.Next = this.m_tail;
            this.m_tail.Previous = this.m_front;
        }
        abstract Return(): void;
        /***************************************************************************************************************************
         * Private
         ***************************************************************************************************************************/
        private m_front: LinkNode = LinkNode.Borrow();
        private m_tail: LinkNode = LinkNode.Borrow();
        private m_len: number = 0;
        constructor() {
            this.m_front.Next = this.m_tail;
            this.m_tail.Previous = this.m_front;
        }
        private AddNext(pre: LinkNode, elem: T): void {
            let node = LinkNode.Borrow();
            node.Value = elem;
            node.Next = pre.Next;
            node.Previous = pre;
            pre.Next.Previous = node;
            pre.Next = node;
            ++this.m_len;
        }
        private AddPrevious(next: LinkNode, elem: T): void {
            let node = LinkNode.Borrow();
            node.Value = elem;
            node.Next = next;
            node.Previous = next.Previous;
            next.Previous.Next = node;
            next.Previous = node;
            ++this.m_len;
        }
        private RemoveNext(pre: LinkNode): T {
            let elem: T = pre.Next.Value;
            let node = pre.Next;
            node.Next.Previous = pre;
            pre.Next = node.Next;
            --this.m_len;
            node.Return();
            return elem;
        }
        private RemovePrevious(next: LinkNode): T{
            let elem: T = next.Previous.Value;
            let node = next.Previous;
            node.Previous.Next = next;
            next.Previous = node.Previous;
            --this.m_len;
            node.Return();
            return elem;
        } 
        private __RemoveByFind(isFromHead: boolean, find: Predicate<T> , handler?: Action<T>): void {
            if(isFromHead) {
                let parent = this.m_front;
                while (parent.Next != this.m_tail)
                {
                    if (find(parent.Next?.Value))
                    {
                        let elem = this.RemoveNext(parent);
                        handler && handler(elem);
                    }
                    else
                    {
                        parent = parent.Next;
                    }
                }
            }else{
                let parent = this.m_tail;
                while (parent.Previous != this.m_front)
                {
                    if (find(parent.Previous.Value))
                    {
                        let elem = this.RemovePrevious(parent);
                        handler && handler(elem);
                    }
                    else
                    {
                        parent = parent.Previous;
                    }
                }
            }
        }
        private __RemoveFirstByFind(isFromHead: boolean, find: Predicate<T> , handler?: Action<T>): void {
            if(isFromHead) {
                let parent = this.m_front;
                while (parent.Next != this.m_tail)
                {
                    if (find(parent.Next?.Value))
                    {
                        let elem = this.RemoveNext(parent);
                        handler && handler(elem);
                        return;
                    }
                    else
                    {
                        parent = parent.Next;
                    }
                }
            }else{
                let parent = this.m_tail;
                while (parent.Previous != this.m_front)
                {
                    if (find(parent.Previous.Value))
                    {
                        let elem = this.RemovePrevious(parent);
                        handler && handler(elem);
                        return;
                    }
                    else
                    {
                        parent = parent.Previous;
                    }
                }
            }
        }
        private __IndexOf(isFromHead: boolean, find: Predicate<T>): number {
            let index = 0;
            if(isFromHead) {
                let parent = this.m_front;
                while (parent.Next != this.m_tail) {
                    if(find(parent.Next.Value)) { return index; }
                    parent = parent.Next;
                    ++index;
                }
            }else{
                let parent = this.m_tail;
                while (parent.Previous != this.m_front) {
                    if(find(parent.Previous.Value)) { return index; }
                    parent = parent.Previous;
                    ++index;
                }
            }
            return -1;
        }
        private __Fetch(isFromHead: boolean, find: Predicate<T>): T {
            let index = 0;
            if(isFromHead) {
                let parent = this.m_front;
                while (parent.Next != this.m_tail) {
                    if(find(parent.Next.Value)) { return parent.Next.Value; }
                    parent = parent.Next;
                    ++index;
                }
            }else{
                let parent = this.m_tail;
                while (parent.Previous != this.m_front) {
                    if(find(parent.Previous.Value)) { return parent.Previous.Value; }
                    parent = parent.Previous;
                    ++index;
                }
            }
            throw new Error("Can't Fetch target object");
        }
        private __FetchByIndex(isFromHead: boolean, index: number): T {
            let _index = 0;
            if(isFromHead) {
                let parent = this.m_front;
                while (parent.Next != this.m_tail) {
                    if(_index == index) { return parent.Next.Value; }
                    parent = parent.Next;
                    ++_index;
                }
            }else{
                let parent = this.m_tail;
                while (parent.Previous != this.m_front) {
                    if(_index == index) { return parent.Previous.Value; }
                    parent = parent.Previous;
                    ++_index;
                }
            }
            throw new Error("Can't Fetch target object");
        }
        private __For(isFromHead: boolean, breakIf: Predicate<T>): boolean {
            if(isFromHead) {
                let parent = this.m_front;
                while (parent.Next != this.m_tail) {
                    if (breakIf(parent.Next.Value)) { return true; }
                    parent = parent.Next;
                }
            }else{
                let parent = this.m_tail;
                while (parent.Previous != this.m_front) {
                    if (breakIf(parent.Previous.Value)) { return true; }
                    parent = parent.Previous;
                }
            }
            return false;
        }
        private __ForEach(isFromHead: boolean, handler: Action<T>): void {
            if(isFromHead) {
                let parent = this.m_front;
                while (parent.Next != this.m_tail) {
                    handler(parent.Next.Value);
                    parent = parent.Next;
                }
            }else{
                let parent = this.m_tail;
                while (parent.Previous != this.m_front) {
                    handler(parent.Previous.Value);
                    parent = parent.Previous;
                }
            }
        }
    }
}
