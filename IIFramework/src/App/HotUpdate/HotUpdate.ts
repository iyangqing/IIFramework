// /// <reference path="../../Res/UIComp.ts" />
// /// <reference path="../../Res/UIPanel.ts" />
// /// <reference path="../../Res/UIZIndex.ts" />

// namespace numas {
//     export namespace hotupdate {
//         export interface IHotUpdateProgressEvent {
//             getPercent(): number;
//             getDownloadedBytes(): number;
//             getTotalBytes(): number;
        
//             getPercentByFile(): number;
//             getDownloadedFiles(): number;
//             getTotalFiles(): number;
//         }
        
//         export interface IHotUpdateUIHandler {
//             OnHotUpdateEnterGame(): void;
//             OnHotUpdateErrorAndHasToQuit(key: string): void;
//             OnHotUpdateErrorAndHasToDo(key: string, func: Function): void;
//             OnHotUpdateCheckUpdateStart(): void;
//             OnHotUpdateCheckUpdateEnd(): void;
//             OnHotUpdateComfirmToUpdate(key: string, func: Function): void;
//             OnHotUpdateUpdateResourceStart(): void;
//             OnHotUpdateProgress(event: IHotUpdateProgressEvent): void;
//             OnHotUpdateOpenAppStore(): void;
//         }
        
//         export class HotUpdateAssetsManager extends cc.Component {
//             private readonly LSK_HOTUPDATE_CURRENT_VERSION: string = "HotUpdateCurrentVersion"
//             private _projectManifest: cc.Asset = <any>null;
//             private _storagePath = '';
//             private _versionCompareHandle: (versionOld: string, versionNew: string)=>number = <any>null;
//             private _am = <any>null;
//             private _canRetry = false;
//             private _failCount = 0;
//             private _maxFailCount = 3; // 最多多少次失败
//             private _isAppStoreVersion: boolean = false; // 必须到应用商店更新版本
//             private _oldVersion: string = null; 
//             private _newVersion: string = null; 
//             //#region 事件监听机制
//             private _uiHandler?: IHotUpdateUIHandler = null;
//             SetUIHandler(handler: IHotUpdateUIHandler) {
//                 this._uiHandler = handler;
//             }
//             //#endregion
        
//             /**
//              * 初始化并开始版本检测
//              * @param projectManifest 
//              */
//             Init(projectManifest: cc.Asset) {
//                 this._projectManifest = projectManifest;
//                 this._storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'my-remote-asset');
        
//                 // Setup your own version compare handler, versionOld and versionNew is versions in string
//                 // if the return value greater than 0, versionOld is greater than versionNew,
//                 // if the return value equals 0, versionOld equals to versionNew,
//                 // if the return value smaller than 0, versionOld is smaller than versionNew.
//                 // ! 特殊的规则：大版本的判定，当新版本的第一个数字大于第二个的时候，那么是大版本更新，必须到应用商店更新
//                 let self = this;
//                 this._versionCompareHandle = function (versionOld: string, versionNew: string) {
//                     console.info("[HotUpdate] >>>> JS Custom Version Compare: version A is " + versionOld + ', version B is ' + versionNew);
//                     self._oldVersion = versionOld;
//                     self._newVersion = versionNew;
                    
//                     // 记录当前的版本信息
//                     HotUpdateMgr.ins.HotUpdateVersion = versionOld;
        
//                     var vA = versionOld.split('.');
//                     var vB = versionNew.split('.');
//                     for (var i = 0; i < vA.length; ++i) {
//                         var a = parseInt(vA[i]);
//                         var b = parseInt(vB[i] || '0');
//                         if (a === b) {
//                             continue;
//                         } else {
//                             if(i==0 && a < b) {
//                                 self._isAppStoreVersion = true;
//                             }
//                             return a - b;
//                         }
//                     }
//                     return 0;
//                 };
        
//                 // Init with empty manifest url for testing custom manifest
//                 this._am = new jsb.AssetsManager('', this._storagePath, this._versionCompareHandle);
        
//                 // Setup the verification callback, but we don't have md5 check function yet, so only print some message
//                 // Return true if the verification passed, otherwise return false
//                 this._am.setVerifyCallback(function (path: string, asset: any) {
//                     // When asset is compressed, we don't need to check its md5, because zip file have been deleted.
//                     var compressed = asset.compressed;
//                     // Retrieve the correct md5 value.
//                     var expectedMD5 = asset.md5;
//                     // asset.path is relative path and path is absolute.
//                     var relativePath = asset.path;
//                     // The size of asset file, but this value could be absent.
//                     // var size = asset.size;
//                     if (compressed) {
//                         console.info("[HotUpdate] >>>> Verification passed : " + relativePath)
//                         return true;
//                     } else {
//                         console.info("[HotUpdate] >>>> Verification passed : " + relativePath + ' (' + expectedMD5 + ')')
//                         return true;
//                     }
//                 });
        
//                 if (cc.sys.os === cc.sys.OS_ANDROID) {
//                     // Some Android device may slow down the download process when concurrent tasks is too much.
//                     // The value may not be accurate, please do more test and find what's most suitable for your game.
//                     this._am.setMaxConcurrentTask(2);
//                 }
        
//                 this.CheckUpdate();
//             }
        
//             /**
//              * 用户当前是手机平台，并且使用的是流量的时候，需要询问
//              */
//             private NeedToAskPermissionToUpdate(): boolean {
//                 return cc.sys.getNetworkType() == cc.sys.NetworkType.WWAN;
//             }
        
//             private CheckUpdate() {
//                 if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
//                     var url = this._projectManifest.nativeUrl;
//                     this._am.loadLocalManifest(url);
//                 }
//                 if (!this._am.getLocalManifest() || !this._am.getLocalManifest().isLoaded()) {
//                     console.error("[HotUpdate] >>>> 无法加载本地的 manifest ！")
//                     return;
//                 }
//                 this._am.setEventCallback(this.__CheckCb.bind(this));
        
//                 // ! 只有第一次会派发版本检测开始的消息
//                 this._uiHandler?.OnHotUpdateCheckUpdateStart();
        
//                 this._am.checkUpdate();
//             }
        
//             private __CheckCb(event: any) {
//                 switch (event.getEventCode()) {
//                     case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
//                         console.error("[HotUpdate] >>>> [Check Version] >>>> No local manifest file found, hot update skipped.")
//                         this._am.setEventCallback(null);
//                         this._uiHandler?.OnHotUpdateCheckUpdateEnd();
//                         // !!! 弹窗提示用户出错，给用户一个点击退出的按钮
//                         this._uiHandler?.OnHotUpdateErrorAndHasToQuit(LangCfg.hotupdate.err_no_local_manifest);
//                         break;
//                     case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
//                         console.warn("[HotUpdate] >>>> [Check Version] >>>> Fail to download manifest file, hot update skipped.");
//                         this._am.setEventCallback(null);
//                         this._uiHandler?.OnHotUpdateCheckUpdateEnd();
//                         // !!! 弹窗提示用户检查网络情况
//                         this._uiHandler?.OnHotUpdateErrorAndHasToDo(LangCfg.hotupdate.err_check_network, ()=>{
//                             this.CheckUpdate();
//                         });
//                         break;
//                     case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
//                         console.warn("[HotUpdate] >>>> [Check Version] >>>> 版本文件解析失败, hot update skipped.");
//                         this._am.setEventCallback(null);
//                         this._uiHandler?.OnHotUpdateCheckUpdateEnd();
//                         // !!! 弹窗提示用户出错，给用户一个点击退出的按钮
//                         this._uiHandler?.OnHotUpdateErrorAndHasToQuit(LangCfg.hotupdate.err_parse_manifest);
//                         break;
//                     case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
//                         console.info("[HotUpdate] >>>> [Check Version] >>>> Already up to date with the latest remote version.");
//                         this._am.setEventCallback(null);
//                         this._uiHandler?.OnHotUpdateCheckUpdateEnd();
//                         if(this.tryDeleteCacheVersionResources(this._oldVersion)) {
//                             // 如果当前版本是 3.0.0, 记录的版本是 2.0.0, 服务器版本是 3.0.0 那么需要先删除缓存后重启
//                             return;
//                         }
//                         // !!! 调用 APP 的入口函数
//                         this._uiHandler?.OnHotUpdateEnterGame();
//                         break;
//                     case jsb.EventAssetsManager.NEW_VERSION_FOUND:
//                         console.info(`[HotUpdate] >>>> [Check Version] >>>> New version found, please try to update. (${Math.ceil(this._am.getTotalBytes() / 1024)}kb)`);
//                         this._am.setEventCallback(null);
//                         this._uiHandler?.OnHotUpdateCheckUpdateEnd();
//                         if(this._isAppStoreVersion) {
//                             // 弹出跳转 AppStore
//                             this._uiHandler?.OnHotUpdateOpenAppStore();
//                         }else{
//                             if(this.tryDeleteCacheVersionResources(this._oldVersion)) {
//                                 // 如果当前版本是 3.0.0, 记录的版本是 2.0.0, 服务器版本是 3.0.1 那么需要先删除缓存后重启
//                                 return;
//                             }
//                             if(this.NeedToAskPermissionToUpdate()) {
//                                 // 弹出对话框，让用户确认更新
//                                 this._uiHandler?.OnHotUpdateComfirmToUpdate(LangCfg.hotupdate.new_version_found_use_wwan_download, ()=>{
//                                     this.DoHotUpdate();
//                                 })
//                             }else{
//                                 this.DoHotUpdate();
//                             }
//                         }
        
//                         break;
//                     default:
//                         return;
//                 }
//             }
        
//             private DoHotUpdate() {
//                 this._am.setEventCallback(this.UpdateCb.bind(this));
//                 this._failCount = 0;
//                 this._uiHandler?.OnHotUpdateUpdateResourceStart();
//                 this._am.update();
//             }
        
//             private UpdateCb(event: any) {
//                 var needRestart = false;
//                 var failed = false;
//                 switch (event.getEventCode()) {
//                     case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
//                         console.error("[HotUpdate] >>>> [Update Version] >>>> No local manifest file found, hot update skipped.")
//                         failed = true;
//                         break;
//                     case jsb.EventAssetsManager.UPDATE_PROGRESSION:
//                         this._uiHandler?.OnHotUpdateProgress(event);
//                         break;
//                     case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
//                     case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
//                         console.error("[HotUpdate] >>>> [Update Version] >>>> Fail to download manifest file, hot update skipped.")
//                         failed = true;
//                         break;
//                     case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
//                         failed = true;
//                         console.error("[HotUpdate] >>>> [Update Version] >>>> 不可能出现的情况！一定是有版本更新才会进入此逻辑！")
//                         break;
//                     case jsb.EventAssetsManager.UPDATE_FINISHED:
//                         console.info("[HotUpdate] >>>> [Update Version] >>>> 更新完成")
//                         // 更新完毕后，写入本地，以方便后续大版本更新时，删除本地缓存
//                         cc.sys.localStorage.setItem(this.LSK_HOTUPDATE_CURRENT_VERSION, this._newVersion);
//                         needRestart = true;
//                         break;
//                     case jsb.EventAssetsManager.UPDATE_FAILED:
//                         this._canRetry = true;
//                         ++this._failCount;
//                         break;
//                     case jsb.EventAssetsManager.ERROR_UPDATING:
//                         console.error(`[HotUpdate] >>>> [Update Version] >>>> 资源更新出错: ${event.getAssetId()}, ${event.getMessage()}`)
//                         break;
//                     case jsb.EventAssetsManager.ERROR_DECOMPRESS:
//                         console.error(`[HotUpdate] >>>> [Update Version] >>>> 解压失败: ${event.getMessage()}`)
//                         break;
//                     default:
//                         break;
//                 }
        
//                 if (failed) {
//                     this._am.setEventCallback(null);
//                     this._uiHandler?.OnHotUpdateErrorAndHasToDo(LangCfg.hotupdate.err_update_failed, ()=>{
//                         this.RestartGame();
//                     });
//                     return;
//                 }
        
//                 if (needRestart) {
//                     this._am.setEventCallback(null);
//                     // Prepend the manifest's search path
//                     var searchPaths = jsb.fileUtils.getSearchPaths();
//                     var newPaths = this._am.getLocalManifest().getSearchPaths();
//                     console.info(JSON.stringify(newPaths));
//                     Array.prototype.unshift.apply(searchPaths, newPaths);
//                     // This value will be retrieved and appended to the default search path during game startup,
//                     // please refer to samples/js-tests/main.js for detailed usage.
//                     // !!! Re-add the search paths in main.js is very important, otherwise, new scripts won't take effect.
//                     localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
//                     jsb.fileUtils.setSearchPaths(searchPaths);
        
//                     // restart game.
//                     this.RestartGame();        
//                 }
        
//                 if(this._canRetry) {
//                     this._canRetry = false;
//                     this.Retry();
//                 }
//             }
        
//             private Retry() {
//                 if(this._failCount < this._maxFailCount) {
//                     console.debug('[HotUpdate] >>>> [Update Version] >>>> Retry failed Assets...');
//                     this._am.downloadFailedAssets();
//                 }else{
//                     // 不再重试
//                     this._uiHandler?.OnHotUpdateErrorAndHasToQuit(LangCfg.hotupdate.retry_failed)
//                 }
//             }
        
//             /**
//              * 和当前大版本不一致的情况下，尝试删除本地缓存，删除成功返回 true
//              */
//             private tryDeleteCacheVersionResources(currentVersion: string): boolean {
//                 let storageVersion: string = cc.sys.localStorage.getItem(this.LSK_HOTUPDATE_CURRENT_VERSION);
//                 if(storageVersion) {
//                     var vStorage = storageVersion.split('.');
//                     var vCurrent = currentVersion.split('.');
//                     if(parseInt(vStorage[0]) < parseInt(vCurrent[0])) {
//                         // 大版本不一致，删除资源缓存
//                         jsb.fileUtils.removeDirectory(this._storagePath);
//                         // 删除本地版本标记
//                         cc.sys.localStorage.removeItem(this.LSK_HOTUPDATE_CURRENT_VERSION);
//                         // 重启游戏
//                         this.RestartGame();
//                         return true;
//                     }
//                 }
//                 return false;
//             }
        
//             /**
//              * 重启游戏
//              */
//             private RestartGame() {
//                 // restart game.
//                 setTimeout(()=>{
//                     cc.game.restart();
//                 }, 1000)
//             }
//         }

//         export abstract class AHotUpdateUIChecking extends UIComp<any> { }

//         export abstract class AHotUpdateUIUpdating extends UIComp<any> {
//             abstract OnProgress(progress: IHotUpdateProgressEvent);
//         }

//         export type AHotUpdateUIPanelArgs = {
//             onCompleted: Function;
//         }
//         /**
//          * 此类的定位是，作为热更新 UI 和 逻辑的中介
//          */
//         export abstract class AHotUpdateUIPanel extends UIPanel<AHotUpdateUIPanelArgs> implements IHotUpdateUIHandler {
//             protected get ProjectManifest(): cc.Asset { return ResMgr.ins.GetRes(HotUpdateAssetCfg.project); }

//             /** 没有热更新的情况下，调用此函数进入游戏 */
//             private _entryFunc: Function = null;
//             private _hotUpdateAssetManager: HotUpdateAssetsManager = null;        
//             private _hotUpdateUIChecking: AHotUpdateUIChecking = null;
//             private _hotUpdateUIUpdating: AHotUpdateUIUpdating = null;

//             protected OnCreate(): void { }
//             protected OnRelease(): void { }
//             protected OnOpen(uiArgs: AHotUpdateUIPanelArgs): void {
//                 // entryFunc 进入游戏的函数（只有版本一致，不需要热更的情况下才调用此函数）
//                 this._entryFunc = this.args.onCompleted;
//                 this.LoadResList([
//                     ...resDict2ResKeyList(HotUpdateAssetCfg)
//                     ,...prefabCfg2ResKeyList(IIStartPrefabCfg.hotupdate.comp)
//                 ], ()=>{
//                     // 热更新版本检测 UI
//                     this._hotUpdateUIChecking = UIMgr.ins.Create<AHotUpdateUIChecking>(IIStartPrefabCfg.hotupdate.comp.HotUpdateUIChecking.key, null, this.node);
//                     this._hotUpdateUIChecking.node.active = false;
//                     // 热更新进度 UI
//                     this._hotUpdateUIUpdating = UIMgr.ins.Create<AHotUpdateUIUpdating>(IIStartPrefabCfg.hotupdate.comp.HotUpdateUIUpdating.key, null, this.node);
//                     this._hotUpdateUIUpdating.node.active = false;
//                     // 热更逻辑控制器
//                     this._hotUpdateAssetManager = this.addComponent(HotUpdateAssetsManager);
//                     this._hotUpdateAssetManager.SetUIHandler(this);
//                     this._hotUpdateAssetManager.Init(this.ProjectManifest);
//                 }, true, true)
//             }

//             //#region ---------------- IHotUpdateUIHandler 
//             OnHotUpdateEnterGame(): void {
//                 this._entryFunc();
//             }
//             OnHotUpdateCheckUpdateStart(): void {
//                 this._hotUpdateUIChecking.node.active = true;
//             }
//             OnHotUpdateCheckUpdateEnd(): void {
//                 this._hotUpdateUIChecking.node.active = false;
//             }
//             OnHotUpdateUpdateResourceStart(): void {
//                 this._hotUpdateUIUpdating.node.active = true;
//             }
//             OnHotUpdateProgress(progress: IHotUpdateProgressEvent): void {
//                 this._hotUpdateUIUpdating.OnProgress(progress);
//             }
//             OnHotUpdateErrorAndHasToQuit(key: string): void {
//                 UIMgr.ins.OpenDialog1(key, ()=>{
//                     cc.game.end();
//                 });
//             }
//             OnHotUpdateErrorAndHasToDo(key: string, func: Function): void {
//                 UIMgr.ins.OpenDialog1(key, func)
//             }
//             OnHotUpdateComfirmToUpdate(key: string, func: Function): void {
//                 UIMgr.ins.OpenDialog1(key, func, LangCfg.hotupdate.btn_txt_confirm_update)
//             }
//             OnHotUpdateOpenAppStore(): void {
//                 UIMgr.ins.OpenDialog1(LangCfg.hotupdate.goto_appstore, ()=>{
//                     PlatformUtil.OpenAppStore(App.ins.sdkCfg);
//                 }, LangCfg.hotupdate.btn_txt_goto);
//             }
//             //#endregion ---------------- IHotUpdateUIHandler
//         }
//     }
// }
