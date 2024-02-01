namespace numas {
    /// 引用池。
    export class ReferencePool
    {
        private static readonly s_ReferenceCollections =  new Map<New<IReference>, IReferenceSinglePool>()
        public static Debug() {
            console.warn(" -------- ReferencePool::Debug begin -------- ")
            console.info(this.s_ReferenceCollections)
            console.warn(" -------- ReferencePool::Debug end -------- ")
        }
        /// <summary>
        /// 获取引用池的数量。
        /// </summary>
        public static get Count(): number
        {
            return this.s_ReferenceCollections.size;
        }

        /// <summary>
        /// 清除所有引用池。
        /// </summary>
        public static ClearAll() : void
        {
            this.s_ReferenceCollections.forEach((k, v)=>{
                this.s_ReferenceCollections.delete(v);
                k.RemoveAll();
            });
        }

        /// <summary>
        /// 从引用池获取引用。
        /// </summary>
        /// <typeparam name="T">引用类型。</typeparam>
        /// <returns>引用。</returns>
        public static Borrow<T extends IReference>(typ: New<T>): T
        {
            return this.GetReferenceCollection(typ).Borrow() as T;
        }

        /// <summary>
        /// 将引用归还引用池。
        /// </summary>
        /// <param name="reference">引用。</param>
        public static Return<T extends IReference>(typ: New<T>, reference: T): void
        {
            if (!reference)
            {
                throw new Error("Reference is invalid.");
            }

            this.GetReferenceCollection(typ).Return(reference);
        }

        /// <summary>
        /// 向引用池中追加指定数量的引用。
        /// </summary>
        /// <typeparam name="T">引用类型。</typeparam>
        /// <param name="count">追加数量。</param>
        public static Add<T extends IReference>(typ: { new(): T ;}, count: number): void
        {
            this.GetReferenceCollection(typ).Add(count);
        }

        /// <summary>
        /// 从引用池中移除指定数量的引用。
        /// </summary>
        /// <typeparam name="T">引用类型。</typeparam>
        /// <param name="count">移除数量。</param>
        public static Remove<T extends IReference>(typ: { new(): T ;}, count: number): void
        {
            this.GetReferenceCollection(typ).Remove(count);
        }

        /// <summary>
        /// 从引用池中移除所有的引用。
        /// </summary>
        /// <typeparam name="T">引用类型。</typeparam>
        public static RemoveAll<T extends IReference>(typ: { new(): T ;}): void
        {
            let referenceCollection: IReferenceSinglePool;
            if (this.s_ReferenceCollections.has(typ))
            {
                referenceCollection = this.s_ReferenceCollections.get(typ) as IReferenceSinglePool;
                referenceCollection.RemoveAll();
                this.s_ReferenceCollections.delete(typ);
            }
        }

        private static GetReferenceCollection<T extends IReference>(referenceType: { new(): T }) : IReferenceSinglePool
        {
            let referenceCollection: IReferenceSinglePool;
            if (!this.s_ReferenceCollections.has(referenceType))
            {
                referenceCollection = new ReferenceSinglePool<T>(referenceType);
                this.s_ReferenceCollections.set(referenceType, referenceCollection);
            }else{
                referenceCollection = this.s_ReferenceCollections.get(referenceType) as IReferenceSinglePool;
            }
            return referenceCollection;
        }
    }

}