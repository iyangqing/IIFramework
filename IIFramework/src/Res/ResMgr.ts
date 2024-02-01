namespace numas {
    /**
     * 资源类型定义
     */
    export enum EResType {
        Asset = 0,
        Audio,
        Json,
        Prefab,
        Stage,
        SpriteFrame,
        Anim,
        Spine,
        LangJson,
        AutoAtlas,
    }
    /**
     * 资源相对于 Bundle 的 Url
     * @param resType 资源类型
     * @param resKey 资源关键字
     */
    function ResKey2Url(resType: EResType, resKey: string): string {
        return `Res/${EResType[resType]}/${resKey}`;
    }

    /**
     * 资源类型转 Asset 资源类型
     * @param resType 资源类型
     */
    function ResType2AssetType(resType: EResType): typeof cc.Asset {
        switch (resType) {
            case EResType.Asset:
                return cc.Asset;
            case EResType.Audio:
                return cc.AudioClip;
            case EResType.Json:
                return cc.JsonAsset;
            case EResType.Prefab:
                return cc.Prefab;
            case EResType.Stage:
                return cc.Prefab;
            case EResType.SpriteFrame:
                return cc.SpriteFrame;
            case EResType.Anim:
                return cc.AnimationClip;
            case EResType.Spine:
                return sp.SkeletonData;
            case EResType.LangJson:
                return cc.JsonAsset;
            case EResType.AutoAtlas:
                return cc.SpriteFrame;
            default:
                throw new Error(`未知的资源类型: ${resType}`)
        }
    }

    //#region //! 资源注册以及格式转换
    /**
     * 注册资源关键字包名
     * @param resKey 资源关键字
     * @param bundleName 包名
     */
     export function registerRes(resKey: string, bundleName: string, resType: EResType) {
        if(CC_DEBUG) {
            if(ResKey2BundleName.ins.HasBundleName(resKey)) {
                if(ResKey2BundleName.ins.GetBundleName(resKey) !== bundleName) {
                    console.error(`registerRes >> 资源关键字 ${resKey} 的包名前后不一致：${ResKey2BundleName.ins.GetBundleName(resKey)} -> ${bundleName}`)
                    return;
                }
            }
            if(ResKey2ResType.ins.HasResType(resKey)) {
                if(ResKey2ResType.ins.GetResType(resKey) !== resType) {
                    console.error(`registerRes >> 资源关键字 ${resKey} 的资源类型前后不一致：${ResKey2ResType.ins.GetResType(resKey)} -> ${resType}`)
                    return;
                }
            }
        }
        ResKey2BundleName.ins.SetBundleName(resKey, bundleName);
        ResKey2ResType.ins.SetResType(resKey, resType)
    }

    export function registerResDict(dict: StringKeyDict<string>, bundleName: string, resType: EResType) {
        for(let k in dict) {
            registerRes(dict[k], bundleName, resType)
        }
    }

    export function resDict2ResKeyList(cfg: StringKeyDict<string>): string[] {
        let resKeys: string[] = [];
        for(let k in cfg) {
            resKeys.push(cfg[k]);
        }
        return resKeys;
    }

    
    export type TPrefabCfg = {
        panel: StringKeyDict<{key: string, z: UIZIndex}>
        ,comp: StringKeyDict<{ key: string }>
    }
    /** 注册某个模块的预制信息 */
    export function registerPrefabCfg(pfbCfg: TPrefabCfg, bundleName: string) {
        for(let k in pfbCfg.panel) {
            registerUIPanel(pfbCfg.panel[k].key, pfbCfg.panel[k].z, bundleName)
        }
        for(let k in pfbCfg.comp) {
            registerRes(pfbCfg.comp[k].key, bundleName, EResType.Prefab)
        }
    }
    // 配置格式转换函数
    export function prefabCfg2ResKeyList(cfg: StringKeyDict<{ key: string }>): string[] {
        let resKeys: string[] = [];
        for(let k in cfg) {
            resKeys.push(cfg[k].key);
        }
        return resKeys;
    }
    export function registerLangJsonCfg(langJsonCfg: StringKeyDict<string>, bundleName: string) {
        for(let k in langJsonCfg) {
            registerRes(langJsonCfg[k], bundleName, EResType.LangJson)
        }
    }
    //#endregion
    export enum EItemType {
        ResKey = 0
        ,DataCache
        ,IReference
    }
    export class AutoReleaseItem implements IReference {
        resKey: any = null;
        resTyp: EItemType = null;
        static Borrow(key: any, typ: EItemType): AutoReleaseItem {
            let it = ReferencePool.Borrow(AutoReleaseItem);
            it.resKey = key;
            it.resTyp = typ;
            return it;
        }
        Reset(): void {
            this.resKey = null;
            this.resTyp = null;
        }
        Return(): void {
            ReferencePool.Return(AutoReleaseItem, this);
        }
    }

    class LoadingItem implements IReference {
        resKey: string = null;
        cb: (asset: any, resKey: string)=>void = null;
        static Borrow(key: string, cb: (asset: any, resKey: string)=>void): LoadingItem {
            let it = ReferencePool.Borrow(LoadingItem);
            it.resKey = key;
            it.cb = cb;
            return it;
        }
        Reset(): void {
            this.resKey = null;
            this.cb = null;
        }
        Return(): void {
            ReferencePool.Return(LoadingItem, this);
        }
    }

    /**
     * 资源管理器
     */
    export class ResMgr extends cc.Component {
        static ins: ResMgr = null;
        
        onLoad() {
            if(CC_DEBUG) {
                console.info(">> ResMgr::onLoad")
            }
            if(ResMgr.ins === null) {
                ResMgr.ins = this;
            }
            else {
                this.destroy();
            }
        }

        //#region //! Asset Management
        private _i_AssetCache: _i_AC<cc.Asset> = new _i_AC({
            addRef: <ASSET extends cc.Asset>(asset: ASSET, resKey: string)=>asset.addRef(),
            decRef: <ASSET extends cc.Asset>(asset: ASSET, resKey: string)=>{
                if(CC_DEBUG) {
                    if(asset.refCount === 1) {
                        console.warn(`AC >> 资源引用计数为 0, 卸载 ${resKey}`)
                    }
                }
                asset.decRef()
            },
            delete: <ASSET extends cc.Asset>(asset: ASSET, resKey: string)=>{}
        });
        /**
         * 添加资源关键字的引用
         * @param resKey 资源关键字
         */
        AddResRef(resKey: string): void {
            this._i_AssetCache.AddRef(resKey);
        }
        
        /**
         * 减少资源关键字的引用
         * @param resKey 资源关键字
         */
        DecResRef(resKey: string): void {
            this._i_AssetCache.DecRef(resKey);
        }

        /**
         * 获取资源
         * @param resKey 资源关键字
         * @returns 
         */
        GetRes<T extends cc.Asset>(resKey: string): T {
            return this._i_AssetCache.GetRes(resKey);
        }

        /**
         * 获取资源
         * @param resKey 资源关键字
         * @returns 
         */
        HasRes(resKey: string): boolean {
            return this._i_AssetCache.HasRes(resKey);
        }

        /**
         * 缓存资源
         * @param resKey 
         * @param asset 
         */
        SetRes<T extends cc.Asset>(resKey, asset: T) {
            this._i_AssetCache.SetRes(resKey, asset);
            let resType = ResKey2ResType.ins.GetResType(resKey);
            switch (resType) {
                case EResType.LangJson:
                    LangUtil.AddLangCfg((asset as any as cc.JsonAsset).json);
                    break;
            
                default:
                    break;
            }
        }

        /**
         * 是否注册了资源
         * @param resKey 资源关键字
         */
        HasRegister(resKey: string): boolean {
            return ResKey2BundleName.ins.HasBundleName(resKey) && ResKey2ResType.ins.HasResType(resKey);
        }

        /**
         * 加载包
         * @param bundleName 
         * @param resolve 
         * @returns 
         */
        GetOrLoadBundle(bundleName: string, resolve: (bundle: cc.AssetManager.Bundle)=>void): void {
            return L.GetOrLoadBundle(bundleName, resolve);
        }
        private __Load<T extends cc.Asset>(resKey: string, cb: (asset: T, resKey: string)=>void) {
            this._i_AssetCache.AddRef(resKey);
            if(this._i_AssetCache.HasRes(resKey)){
                let asset = this._i_AssetCache.GetRes(resKey);
                cb(<T>asset, resKey);
                this._i_AssetCache.DecRef(resKey)
            }else{
                this._i_AssetCache.AddLoadingRef(resKey);
                let bundleName: string = ResKey2BundleName.ins.GetBundleName(resKey);
                L.GetOrLoadBundle(bundleName, bundle => {
                    let resType = ResKey2ResType.ins.GetResType(resKey);
                    let url: string = ResKey2Url(resType, resKey);
                    let typ: typeof cc.Asset = ResType2AssetType(resType)
                    L.Load(bundle, url, typ, asset => {
                        this.SetRes(resKey, asset);
                        this._i_AssetCache.DecLoadingRef(resKey);
                        cb(<T>asset, resKey);
                        this._i_AssetCache.DecRef(resKey);
                    });
                })
            }
        }
        /**
         * 加载资源方法（添加对象引用计数的过程）
         * @param resKey 
         * @param cb 
         */
        Load<T extends cc.Asset>(resKey: string, cb: (asset: T, resKey: string)=>void) {
            let bundleName: string = ResKey2BundleName.ins.GetBundleName(resKey);
            if(bundleName === undefined) {
                console.error(`找不到 BundleName >> ${resKey}`)
            }
            this.__Load(resKey, cb);
        }

        LoadWithEvent<T extends cc.Asset>(event: string, resKey: string) {
            this.Load(resKey, (asset: T, resKey: string)=>{
                this.node.emit(event, asset, resKey)
                this.node.off(event);
            });
        }

        LoadWithEventByGroup<T extends cc.Asset>(event: string, resKey: string, group: string) {
            this.LoadByGroup(resKey, (asset: T, resKey: string)=>{
                this.node.emit(event, asset, resKey)
                this.node.off(event);
            }, group);
        }
        private LoadByGroup<T extends cc.Asset>(resKey: string, cb: (asset: T, resKey: string)=>void, group: string) {
            let bundleName: string = ResKey2BundleName.ins.GetBundleName(resKey);
            if(bundleName === undefined) {
                console.error(`找不到 BundleName >> ${resKey}`)
            }
            if(!this.HasLoadingGroup(group)) {
                this.AddLoadingGroup(group);
                this.__Load(resKey, (asset: T, resKey)=>{
                    cb(asset, resKey);
                    this.__i_TryToLoadNextGroupItem(group);
                    this.DecLoadingGroup(group);
                });
            }else{
                this.AddLoadingGroup(group);
                let loadingGroup = this.GetLoadingGroup(group);
                loadingGroup.Enqueue(LoadingItem.Borrow(resKey, (asset: T, resKey: string)=>{
                    cb(asset, resKey);
                    this.DecLoadingGroup(group);
                }));
            }
        }
        private __i_TryToLoadNextGroupItem(group: string) {
            if(!this.HasLoadingGroup(group)) {
                return;
            }
            let loadingGroup = this.GetLoadingGroup(group);
            if(loadingGroup.Count == 0) {
                return;
            }
            let it = loadingGroup.Dequeue();
            let resKey = it.resKey;
            let cb = it.cb;
            it.Return();
            return this.LoadByGroup(resKey, cb, group);
        }
        //! 分组加载引用计数管理
        private _i_LoadingGroupCache: _i_AC<Queue<LoadingItem>> = new _i_AC({
            addRef: (asset: Queue<LoadingItem>, groupKey: string)=>{},
            decRef: (asset: Queue<LoadingItem>, groupKey: string)=>{},
            delete: (asset: Queue<LoadingItem>, groupKey: string)=>{ asset.Return(); }
        });
        private AddLoadingGroup(group:string) {
            if(this._i_LoadingGroupCache.HasRes(group)) {
                this._i_LoadingGroupCache.AddRef(group);
            }else{
                this._i_LoadingGroupCache.AddLoadingRef(group);
                this._i_LoadingGroupCache.AddRef(group);
                this._i_LoadingGroupCache.SetRes(group, AnyQueue.Borrow());
                this._i_LoadingGroupCache.DecLoadingRef(group);
            }
        }
        private HasLoadingGroup( group:string ): boolean { return this._i_LoadingGroupCache.HasRes(group); }
        private GetLoadingGroup<T extends Queue<LoadingItem>>( group:string ): T { return <T>this._i_LoadingGroupCache.GetRes(group); }
        private DecLoadingGroup( group:string ) { this._i_LoadingGroupCache.DecRef(group); }
        //#endregion

        //#region //! DataCache Management
        private _i_DataCacheCache: _i_AC<DataCache> = new _i_AC({
            addRef: <ASSET>(asset: ASSET, resKey: string)=>{},
            decRef: <ASSET extends DataCache>(asset: ASSET, resKey: string)=>{},
            delete: <ASSET extends DataCache>(asset: ASSET, resKey: string)=>{
                asset.__i_OnUnRegister();
                this.node.removeComponent(asset);
                asset.destroy();
                if(CC_DEBUG) {
                    console.warn(`ResMgr >> 销毁 DataCache: ${resKey}`)
                }
            }
        });
        GetDataCache<T extends DataCache>( dataCacheName:string ): T {
            return <T>this._i_DataCacheCache.GetRes(dataCacheName);
        }
        AddDataCache<T extends DataCache>(dataCacheName:string, type: {new(): T}) {
            if(this._i_DataCacheCache.HasRes(dataCacheName)) {
                this._i_DataCacheCache.AddRef(dataCacheName);
            }else{
                this._i_DataCacheCache.AddLoadingRef(dataCacheName);
                this._i_DataCacheCache.AddRef(dataCacheName);
                let dataCache = this.node.addComponent(type);
                dataCache.DataCacheName = dataCacheName;
                this._i_DataCacheCache.SetRes(dataCache.DataCacheName, dataCache);
                this._i_DataCacheCache.DecLoadingRef(dataCacheName);
                dataCache.__i_OnRegisterTo();
            }
        }
        hasDataCache( dataCacheName:string ): boolean {
            return this._i_DataCacheCache.HasRes(dataCacheName);
        }
        DecDataCache( dataCacheName:string ) {
            this._i_DataCacheCache.DecRef(dataCacheName);
        }
        //#endregion
        
        //#region //! 自动释放管理 资源延迟几帧释放策略
        private _i_NextFrameToReleaseResQueue: Queue<AutoReleaseItem> = AnyQueue.Borrow();
        private _i_Next2FrameToReleaseResQueue: Queue<AutoReleaseItem> = AnyQueue.Borrow();
        private _i_TickScheduler: Function = null;
        DestroyAutoReleaseItems(autoReleaseItemQueue: Queue<AutoReleaseItem>) {
            autoReleaseItemQueue.RemoveAll(it=>this._i_NextFrameToReleaseResQueue.Enqueue(it));
            this.GC();
        }
        GC() {
            if( this._i_TickScheduler === null &&
                (this._i_NextFrameToReleaseResQueue.Count > 0 || this._i_Next2FrameToReleaseResQueue.Count > 0)
            ){
                this._i_TickScheduler = this.__i_Tick.bind(this);
                this.schedule(this._i_TickScheduler, 0, cc.macro.REPEAT_FOREVER, 0);
            }
        }
        private __i_StopTickSchedule() {
            if(this._i_TickScheduler !== null) {
                this.unschedule(this._i_TickScheduler);
                this._i_TickScheduler = null;
            }
        }
        private __i_Tick() {
            if(this.m_bLoadingGame) {
                //! 加载 GameScene 的过程中，不进行资源的释放
                return;
            }
            if(this._i_Next2FrameToReleaseResQueue.Count > 0) {
                let it = this._i_Next2FrameToReleaseResQueue.Dequeue();
                switch(it.resTyp) {
                    case EItemType.ResKey:{ this.DecResRef(it.resKey) } break;
                    case EItemType.DataCache: { this.DecDataCache(it.resKey) } break;
                    case EItemType.IReference: { (it.resKey as IReference).Return(); } break;
                    default: { console.error(`ResMgr.DestroyAutoReleaseItems >> 未处理的回收类型:${EItemType[it.resTyp]}`)}
                }
                return;
            }
            if(this._i_NextFrameToReleaseResQueue.Count > 0) {
                this._i_Next2FrameToReleaseResQueue.Enqueue(this._i_NextFrameToReleaseResQueue.Dequeue())
                return;
            }

            this.__i_StopTickSchedule();

            // 回收 JavaScript 对象池
            ReferencePool.ClearAll();
        }
        //#endregion

        //#region //! UIStage 管理
        private m_bLoadingGame: boolean = false;
        private m_Current: UIStage = null;
        /**
         * @param gameBundleName 子游戏包名
         * @param stageName 游戏场景名
         * @param args 打开场景所需参数
         * @param onUICompleted 切换场景完毕，UI 完成替换
         */
        LoadStage(gameBundleName: string, stageName: string, args?: any, onUICompleted?: Function): void {
            registerUIStage(stageName, gameBundleName);
            this.m_bLoadingGame = true;
            UIMgr.ins.Open(stageName, args, (stage: UIStage, _args)=>{
                if(this.m_Current !== null) {
                    this.m_Current.Close();
                }
                this.m_Current = stage;
                stage.__i_Init(()=>{
                    // 加载完毕后
                    this.m_bLoadingGame = false;
                    Util.safeCall(onUICompleted);
                    this.GC();
                }, _args);
            })
        }
        /**
         * 加载子游戏的接口（子游戏独立在某个 Bundle 中，这个 Bundle 下必须要有同名场景
         * @param gameBundleName 子游戏包名
         * @param args 打开场景所需参数
         * @param onUICompleted 切换场景完毕，UI 完成替换
         */
        LoadBundleStage(gameBundleName: string, args?: any, onUICompleted?: Function): void {
            this.LoadStage(gameBundleName, gameBundleName, args, onUICompleted);
        }
        //#endregion


        Debug() {
            console.warn(" -------- ResMgr::Debug begin -------- ")
            this._i_AssetCache.Debug();         
            console.warn(" -------- ResMgr::Debug end -------- ")
        }
    }

    /**
     * 资源加载器
     */
    class L {
        public static DEBUG: boolean = true;
        private static _loadingResQueues : Map<string, Queue<Resolve<cc.Asset>>> = new Map();
        private static _loadingBundleQueues : Map<string, Queue<Resolve<cc.AssetManager.Bundle>>> = new Map();
        /**
         * 加载并取得 Bundle
         * @param bundleName Bundle 名称
         * @param resolve 回调函数
         */
        static GetOrLoadBundle(bundleName: string, resolve: (bundle: cc.AssetManager.Bundle)=>void): void {
            let _bundle = cc.assetManager.getBundle(bundleName);
            if(_bundle) {
                resolve(_bundle);
            }else{
                if(this._loadingBundleQueues.has(bundleName)) {
                    this._loadingBundleQueues.get(bundleName).Enqueue(resolve);
                }else{
                    let _q = AnyQueue.Borrow();
                    _q.Enqueue(resolve);
                    this._loadingBundleQueues.set(bundleName, _q);
                    cc.assetManager.loadBundle(bundleName, (err, bundle)=>{
                        if(err) {
                            console.error(err);
                        }else{
                            let _queue = this._loadingBundleQueues.get(bundleName);
                            this._loadingResQueues.delete(bundleName);
                            _queue.RemoveAll(_resolve => _resolve(bundle));
                            _queue.Return();
                        }
                    })
                }
            }
        }
        /**
         * 加载包装类，支持关键字顺序加载
         * @param bundle 资源包
         * @param url 资源路径
         * @param typ 资源类型
         * @param resolve 成功回调
         * @param reject 错误回调
         */
        static Load<T extends cc.Asset>(bundle: cc.AssetManager.Bundle, url: string, typ: typeof cc.Asset, resolve: Resolve<T>): void
        {
            let _asset = <T>bundle.get(url, typ);
            if(_asset != null) {
                resolve(_asset);
                return;
            }
            // 引入队列
            if(this._loadingResQueues.has(url)) {
                this._loadingResQueues.get(url).Enqueue(resolve);
            }else{
                let _q = AnyQueue.Borrow();
                _q.Enqueue(resolve);
                this._loadingResQueues.set(url, _q);
                bundle.load(url, typ, (err, res: T) => {
                    if (!err) {
                        // if(this.DEBUG && CC_DEBUG) {
                        //     console.info(`L::load >> 加载资源 >> [${bundle.name}] ${url}`)
                        // }
                        let _queue = this._loadingResQueues.get(url);
                        this._loadingResQueues.delete(url);
                        _queue.RemoveAll(_resolve => _resolve(res));
                        _queue.Return();
                    }else{
                        console.error(`L::load >> 加载资源出错 ${url} 原因: ${err.message}`)
                    }
                })
            }
        }

        /**
         * 根据 UUID 加载资源
         * @param uuid 
         * @param onComplete 
         */
        private loadWithUUID(uuid: string, onComplete: (data: any) => void): void {
            cc.assetManager.loadAny({uuid}, (e, r)=>{
                if(e) {
                    console.error(e);
                    return;
                }
                onComplete(r);
            });
        }
    }

    /**
     * 缓存中的资源项
     * 受到功能的影响，主要提供 4 种类型的引用计数：
     * 1. 无论有没有资源（正常逻辑下，是没有资源的），加载前和加载后维护的引用计数为 loadingRef
     * 2. 某个对象需要引用到此资源，但是此资源尚未加载完毕（且 ref 为 0），因此需要加载完毕后再增加引用计数，通过 addRef 维护
     * 3. 减引用的时候，资源正处于加载中，因此需要加载完毕后，再减引用 decRef
     * 4. 资源引用 ref
     */
    class AssetRefItem implements IReference {
        public static Borrow(): AssetRefItem { return ReferencePool.Borrow(AssetRefItem); }
        public Return() { ReferencePool.Return(AssetRefItem, this); }

        Reset(): void {
            this.loadingRef = 0;
            this.addRef = 0;
            this.decRef = 0;
            this.ref = 0;
            this.asset = null;
        }
        loadingRef: number = 0; // 加载引用
        addRef: number = 0; // 加引用（因为可能没资源，所以先加引用）
        decRef: number = 0; // 减引用（因为正在加载中，所以需要加载完毕时再调用）
        ref: number = 0; // 资源引用
        asset: any = null; // 资源
    }

    interface IAssetRefHelper<ASSET> {
        addRef(asset: ASSET, resKey: string);
        decRef(asset: ASSET, resKey: string);
        delete(asset: ASSET, resKey: string);
    }
    

    /**
     * 通用引用类型资源的缓冲池
     */
    class _i_AC<ASSET> {
        private _i_Helper: IAssetRefHelper<ASSET> = null;
        constructor(assetHelper: IAssetRefHelper<ASSET>) {
            this._i_Helper = assetHelper;
        }
        private _resCache: Map<string, AssetRefItem> = new Map<string, AssetRefItem>()
        AddLoadingRef(resKey: string): void {
            if(!this._resCache.has(resKey)) {
                let it = AssetRefItem.Borrow();
                it.loadingRef = 1;
                this._resCache.set(resKey, it)
            }else{
                this._resCache.get(resKey).loadingRef += 1;
            }
        }
        DecLoadingRef(resKey: string): void {
            let it = this._resCache.get(resKey);
            it.loadingRef -= 1;
            if(it.loadingRef === 0) {
                // ! 如果存在加引用，那么生效
                while(it.addRef > 0) {
                    --it.addRef;
                    ++it.ref;
                    this._i_Helper.addRef(it.asset, resKey);
                }
                // ! 加载行为都结束后，尝试生效加载过程中解引用的部分
                while(it.decRef > 0) {
                    --it.decRef;
                    --it.ref;
                    this._i_Helper.decRef(it.asset, resKey);
                }
                this.TryRelease(resKey);
            }
        }

        // 通过 AddRef 引用的资源，必须通过 DecRef 解引用
        /**
         * 添加资源关键字对应的引用
         * @param resKey 资源关键字
         */
        AddRef(resKey: string) {
            if(!this._resCache.has(resKey)) {
                let it = AssetRefItem.Borrow();
                it.addRef = 1;
                this._resCache.set(resKey, it)
            }else{
                let it = this._resCache.get(resKey);
                if(it.ref > 0) {
                    this._i_Helper.addRef(it.asset, resKey);
                    ++it.ref;
                }else{
                    ++it.addRef;
                }
            }
        }
        DecRef(resKey: string) {
            let it = this._resCache.get(resKey);
            if(it.loadingRef > 0) {
                // ! 加载过程中解除引用（加载完毕时，需要解引用）
                ++it.decRef;
            }else{
                if(it.ref > 0) {
                    this._i_Helper.decRef(it.asset, resKey);
                    --it.ref;
                    this.TryRelease(resKey);
                }else{
                    if(it.addRef > 0) {
                        --it.addRef;
                        this.TryRelease(resKey);
                    }else{
                        // ! 如果到这里，逻辑肯定是错误的
                        console.error(`资源管理逻辑出现错误 _i_AC:DecRef >> resKey: ${resKey}`)
                    }   
                }
            }
        }
        HasRes(resKey: string): boolean {
            if(this._resCache.has(resKey)) {
                return this._resCache.get(resKey).ref > 0;
            }
            return false;
        }
        GetRes<T>(resKey: string): T {
            if(!this.HasRes(resKey)) {
                console.error(`_i_AC::getRes() >> 找不到资源对象 resKey = ${resKey}`);
                return null;
            }
            return <T>this._resCache.get(resKey).asset;
        }
        SetRes(resKey: string, res: any) {
            let it = this._resCache.get(resKey);
            if(it.asset != null && it.asset != res) {
                console.error(`_i_AC::setRes >> 资源关键字 ${resKey} 的资源发生了更改，这是错误的！`);
                return;
            }
            it.asset = res;
        }

        /**
         * 尝试清除关键字
         * @param resKey 资源关键字
         */
        private TryRelease(resKey: string): void {
            if(this._resCache.has(resKey)) {
                let it = this._resCache.get(resKey);
                if(it.loadingRef === 0 && it.addRef === 0 && it.decRef === 0 && it.ref === 0) {
                    this._i_Helper.delete(it.asset, resKey);
                    this._resCache.delete(resKey)
                    it.Return();
                }
            }
        }

        Debug() {
            console.info("           _resCache >>")
            console.info(this._resCache)
        }
    }
}
