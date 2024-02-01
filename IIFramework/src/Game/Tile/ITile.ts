namespace numas {
    export interface ITileData {
        col: number;
        row: number;
    }
    export interface ITile extends ITileData {
        col: number;
        row: number;
        Return(): void;
    }
}
