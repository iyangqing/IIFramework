namespace numas {
    export interface ILocalStorageHelper {
        save(): void;
        deleteKey(key: string): void;
        hasKey(key: string): boolean;
        setBool(key: string, val: boolean, isEncrypt: boolean);
        getBool(key: string): boolean;
        getBoolWithDefault(key: string, defaultVal: boolean);
            
        setInt(key: string, val: number, isEncrypt: boolean);
        getInt(key: string): number;
        getIntWithDefault(key: string, defaultVal: number): number;
            
        setString(key: string, val: string, isEncrypt: boolean);
        getString(key: string): string;
        getStringWithDefault(key: string, defaultVal: string);
            
        setObject<T extends {}>(key: string, val: T, isEncrypt: boolean);
        getObject<T>(key: string): T;
        getObjectWithDefault<T>(key: string, defaultVal: T): T;
    }
}
