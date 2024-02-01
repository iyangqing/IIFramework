namespace numas {
    export class Tile implements IReference {
        public col: number = 0;
        public row: number = 0;
        static Borrow(): Tile { return ReferencePool.Borrow(Tile) }
        Return(): void { ReferencePool.Return(Tile, this); }
        Reset(): void { }
        Init(col: number, row: number): Tile {
            this.col = col;
            this.row = row;
            return this;
        }
    }
}
