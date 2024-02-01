namespace numas {
    class NPool {
        constructor(k: string) {
            this._k = k;
        }
        private _p: any[] = [];
        private _k: string = "";

        private __C(typ): any {
            let node = new cc.Node(this._k);
            return node.addComponent(typ)
        }

        Get(typ): any {
            if(this._p.length > 0) {
                let cp = this._p.pop();
                cp.node.active = true;
                return cp;
            }else{
                return this.__C(typ);
            }
        }
        Put(comp: any): void {
            comp.node.active = false;
            this._p.push(comp);
        }

        Clear(): void {
            while(this._p.length > 0) {
                let _n = this._p.pop();
                (<cc.Node>(_n.node)).destroy();
            }
        }
    }

    export class NodePool {
        private static _m: Map<string, NPool> = new Map<string, NPool>()
        static Get<T extends cc.Component>(k:string, typ: {new(): T}): T {
            let _p: NPool = this.GetPool(k);
            return _p.Get(typ)
        }
        static Put<T extends cc.Component>(k: string, c: T): void {
            let _p: NPool = this.GetPool(k);
            _p.Put(c);
        }

        private static GetPool(k: string): NPool {
            let _p: NPool = null;
            if(!this._m.has(k)) {
                _p = new NPool(k);
                this._m.set(k, _p);
            }else{
                _p = this._m.get(k);
            }
            return _p;
        }
    }
}