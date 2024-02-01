/// <reference path="BindableValue.ts" />
namespace numas {
    export class BooleanBV extends BV<boolean> {
        constructor() { super(false); }
        protected IsEqual(newVal: boolean, curVal: boolean): boolean { return newVal === curVal; }
        public static Borrow(initValue: boolean): BooleanBV {
            let bv = ReferencePool.Borrow(BooleanBV);
            bv.m_CacheValue = initValue;
            return bv;
        }
        Return() { ReferencePool.Return(BooleanBV, this); }

        public static BorrowAsLS(key: string, defaultValue: boolean, isEncrypt: boolean): BooleanBV {
            let bv = ReferencePool.Borrow(BooleanBV);
            bv.m_CacheValue = LSMgr.ins.getBoolWithDefault(key, defaultValue);
            bv.Bind(val => LSMgr.ins.setBool(key, val, isEncrypt), false, bv)
            return bv;
        }

        public static BorrowAsUserLS(key: string, defaultValue: boolean, isEncrypt: boolean): BooleanBV {
            let bv = ReferencePool.Borrow(BooleanBV);
            bv.m_CacheValue = UserLSMgr.ins.getBoolWithDefault(key, defaultValue);
            bv.Bind(val => UserLSMgr.ins.setBool(key, val, isEncrypt), false, bv)
            return bv;
        }
    }

    export class NumberBV extends BV<number> {
        constructor() { super(0); }
        protected IsEqual(newVal: number, curVal: number): boolean { return newVal === curVal; }
        public static Borrow(initValue: number): NumberBV {
            let bv = ReferencePool.Borrow(NumberBV);
            bv.m_CacheValue = initValue;
            return bv;
        }
        Return() { ReferencePool.Return(NumberBV, this); }

        public static BorrowAsLS(key: string, defaultValue: number, isEncrypt: boolean): NumberBV {
            let bv = ReferencePool.Borrow(NumberBV);
            bv.m_CacheValue = LSMgr.ins.getIntWithDefault(key, defaultValue);
            bv.Bind(val => LSMgr.ins.setInt(key, val, isEncrypt), false, bv)
            return bv;
        }

        public static BorrowAsUserLS(key: string, defaultValue: number, isEncrypt: boolean): NumberBV {
            let bv = ReferencePool.Borrow(NumberBV);
            bv.m_CacheValue = UserLSMgr.ins.getIntWithDefault(key, defaultValue);
            bv.Bind(val => UserLSMgr.ins.setInt(key, val, isEncrypt), false, bv)
            return bv;
        }
    }

    export class MaxNumberBV extends BV<number> {
        constructor() { super(0); }
        protected IsEqual(newVal: number, curVal: number): boolean { return newVal <= curVal; }
        public static Borrow(initValue: number): MaxNumberBV {
            let bv = ReferencePool.Borrow(MaxNumberBV);
            bv.m_CacheValue = initValue;
            return bv;
        }
        Return() { ReferencePool.Return(MaxNumberBV, this); }

        public static BorrowAsLS(key: string, defaultValue: number, isEncrypt: boolean): MaxNumberBV {
            let bv = ReferencePool.Borrow(MaxNumberBV);
            bv.m_CacheValue = LSMgr.ins.getIntWithDefault(key, defaultValue);
            bv.Bind(val => LSMgr.ins.setInt(key, val, isEncrypt), false, bv)
            return bv;
        }

        public static BorrowAsUserLS(key: string, defaultValue: number, isEncrypt: boolean): MaxNumberBV {
            let bv = ReferencePool.Borrow(MaxNumberBV);
            bv.m_CacheValue = UserLSMgr.ins.getIntWithDefault(key, defaultValue);
            bv.Bind(val => UserLSMgr.ins.setInt(key, val, isEncrypt), false, bv)
            return bv;
        }
    }

    export class StringBV extends BV<string> {
        constructor() { super(""); }
        protected IsEqual(newVal: string, curVal: string): boolean { return newVal == curVal; }
        public static Borrow(initValue: string): StringBV {
            let bv = ReferencePool.Borrow(StringBV);
            bv.m_CacheValue = initValue;
            return bv;
        }
        Return() { ReferencePool.Return(StringBV, this); }

        public static BorrowAsLS(key: string, defaultValue: string, isEncrypt: boolean): StringBV {
            let bv = ReferencePool.Borrow(StringBV);
            bv.m_CacheValue = LSMgr.ins.getStringWithDefault(key, defaultValue);
            bv.Bind(val => LSMgr.ins.setString(key, val, isEncrypt), false, bv)
            return bv;
        }

        public static BorrowAsUserLS(key: string, defaultValue: string, isEncrypt: boolean): StringBV {
            let bv = ReferencePool.Borrow(StringBV);
            bv.m_CacheValue = UserLSMgr.ins.getStringWithDefault(key, defaultValue);
            bv.Bind(val => UserLSMgr.ins.setString(key, val, isEncrypt), false, bv)
            return bv;
        }
    }

    export class ObjectBV extends BV<Object> {
        constructor() { super(null); }
        protected IsEqual(newVal: Object, curVal: Object): boolean { return false; }
        public static Borrow(initValue: Object): ObjectBV {
            let bv = ReferencePool.Borrow(ObjectBV);
            bv.m_CacheValue = initValue;
            return bv;
        }
        Return() { ReferencePool.Return(ObjectBV, this); }

        public static BorrowAsLS(key: string, defaultValue: Object, isEncrypt: boolean): ObjectBV {
            let bv = ReferencePool.Borrow(ObjectBV);
            bv.m_CacheValue = LSMgr.ins.getObjectWithDefault(key, defaultValue);
            bv.Bind(val => LSMgr.ins.setObject(key, val, isEncrypt), false, bv)
            return bv;
        }

        public static BorrowAsUserLS(key: string, defaultValue: Object, isEncrypt: boolean): ObjectBV {
            let bv = ReferencePool.Borrow(ObjectBV);
            bv.m_CacheValue = UserLSMgr.ins.getObjectWithDefault(key, defaultValue);
            bv.Bind(val => UserLSMgr.ins.setObject(key, val, isEncrypt), false, bv)
            return bv;
        }
    }
}
