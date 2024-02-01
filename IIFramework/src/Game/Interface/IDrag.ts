namespace numas {
    export interface IDrag<T> {
        SetZIndex(zIndex: number): void;
        OnDragStart(event: cc.Event.EventTouch, delegate: IDragDelegate<T>): void;
        OnDragMove(event: cc.Event.EventTouch, delegate: IDragDelegate<T>): void;
        OnDragEnd(event: cc.Event.EventTouch, delegate: IDragDelegate<T>): void;
        DragTarget(): T;
    }
    
    export interface IDragDelegate<T> {
        OnDragTouchStart (item: IDrag<T>, event: cc.Event.EventTouch): boolean;
        OnDragTouchMove (item: IDrag<T>, event: cc.Event.EventTouch);
        OnDragTouchEnd (item: IDrag<T>, event: cc.Event.EventTouch);
    }    
}
