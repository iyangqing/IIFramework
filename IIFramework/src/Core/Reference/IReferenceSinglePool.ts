namespace numas {
    export interface IReferenceSinglePool {
        Borrow(): IReference;
        Return(reference: IReference): void;
        Add(count: number): void;
        Remove(count: number): void;
        RemoveAll();
    }
}
