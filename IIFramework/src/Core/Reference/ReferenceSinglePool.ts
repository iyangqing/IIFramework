namespace numas {
    /// <summary>
    /// 某个关键字对于的引用池。
    /// </summary>
    export class ReferenceSinglePool<T extends IReference> implements IReferenceSinglePool
    {
        private m_References : T[] = [];
        private m_UsingReferenceCount: number = 0;
        private m_BorrowReferenceCount: number = 0;
        private m_ReleaseReferenceCount: number = 0;
        private m_AddReferenceCount: number = 0;
        private m_RemoveReferenceCount: number = 0;
        private m_New: New<T>

        constructor(creator: New<T>)
        {
            this.m_New = creator;
            this.m_UsingReferenceCount = 0;
            this.m_BorrowReferenceCount = 0;
            this.m_ReleaseReferenceCount = 0;
            this.m_AddReferenceCount = 0;
            this.m_RemoveReferenceCount = 0;
        }

        public get UnusedReferenceCount(): number
        {
            return this.m_References.length;
        }

        public get UsingReferenceCount(): number
        {
            return this.m_UsingReferenceCount;
        }

        public get BorrowReferenceCount(): number
        {
            return this.m_BorrowReferenceCount;
        }

        public get ReleaseReferenceCount(): number
        {
            return this.m_ReleaseReferenceCount;
        }

        public get AddReferenceCount(): number
        {
            return this.m_AddReferenceCount;
        }

        public get RemoveReferenceCount(): number
        {
            return this.m_RemoveReferenceCount;
        }

        public Borrow(): IReference
        {
            this.m_UsingReferenceCount++;
            this.m_BorrowReferenceCount++;
            if (this.m_References.length > 0)
            {
                return this.m_References.pop() as T;
            }

            this.m_AddReferenceCount++;
            return new this.m_New;
        }

        public Return(reference: IReference): void
        {
            reference.Reset();
            if (this.m_References.indexOf(reference as T) !== -1)
            {
                throw new Error("The reference has been released.");
            }

            this.m_References.push(reference as T);

            ++this.m_ReleaseReferenceCount;
            --this.m_UsingReferenceCount;
        }

        public Add(count: number): void
        {
            this.m_AddReferenceCount += count;
            while (count-- > 0)
            {
                this.m_References.push(new this.m_New());
            }
        }

        public Remove(count: number): void
        {
            if (count > this.m_References.length)
            {
                count = this.m_References.length;
            }

            this.m_RemoveReferenceCount += count;
            while (count-- > 0)
            {
                this.m_References.pop();
            }
        }

        public RemoveAll(): void
        {
            this.Remove(this.m_References.length);
        }
    }
}
