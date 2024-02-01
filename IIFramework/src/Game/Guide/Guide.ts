/// <reference path="../../Res/UIPanel.ts" />

/**
 * 目前支持的配置说明：
 * 
 */

namespace numas {
    export namespace guide {
        export const Event = {
            DRAG_START: "ii.guide.DRAG_START"
            ,DRAG_END: "ii.guide.DRAG_END"
        }
        /**
         * 动作的名称枚举
         */
        export const ActionType = {
            fade: "fade"
            ,up_down: "up_down"
        }

        /**
         * 动作数据结构定义
         */
        export type ActionData<T> = {
            typ: string,
            delay: number,
            duration: number,
            from: T,
            to: T
        }

        /**
         * 位置类型
         */
        export const PositionType = {
            related_to_node_id: "related_to_node_id"
        }

        /**
         * 位置数据定义
         */
        export type PositionData = {
            typ: string,
            node_id: string,
            dx: number,
            dy: number
        }

        export type StepData = {
            typ: string;
            kv: {k: string, v: any}[];
        }
        export type GuideData = {
            steps: StepData[];
        }

        export class Step {
            private m_Data: StepData = null;
            private m_Helper: IGuidePlayer = null;
            private m_NextStepOnceFunc: Function = null;

            get NextStep(): Function { return this.m_NextStepOnceFunc; }
            
            constructor(data: StepData, helper: IGuidePlayer, nextStepOnceFunc: Function) {
                this.m_Data = data;
                this.m_Helper = helper;
                this.m_NextStepOnceFunc = nextStepOnceFunc;
            }
            GetV(k: string): any {
                for(let i = 0; i< this.m_Data.kv.length; ++i) {
                    if(this.m_Data.kv[i].k == k) { return this.m_Data.kv[i].v; }
                }
                console.error(`[Error] k: \"${k}\" has no config in \"${this.typ}\"'s kv`)
            }
            GetVWithDefault(k: string, defaultV: any): any {
                for(let i = 0; i< this.m_Data.kv.length; ++i) {
                    if(this.m_Data.kv[i].k == k) { return this.m_Data.kv[i].v; }
                }
                return defaultV;
            }
            get typ(): string { return this.m_Data.typ; }
            get kv() { return this.m_Data.kv; }
            get args(): any { return this.GetVWithDefault("args", null); }
            get click_bg(): boolean { return this.GetVWithDefault("click_bg", false); } /** dialog */
            get color(): number { return this.GetVWithDefault("color", 0); }
            get col_row(): ITileData { return this.GetV("col_row"); }
            get dir(): Dir { return this.GetV("dir"); }
            get dx(): number { return this.GetV("dx"); }
            get dy(): number { return this.GetV("dy"); }
            get enter_action(): ActionData<number> { return this.GetV("enter_action")}
            get exit_action(): ActionData<number> { return this.GetV("exit_action")}
            get path_action(): { from: PositionData, to: PositionData, duration: number, interval: number } { return this.GetV("path_action"); }
            get position(): PositionData { return this.GetV("position"); }
            get res_key(): string { return this.GetVWithDefault("res_key", null); }
            get text(): string { return this.GetV("text"); }
            get time(): number { return this.GetV("time"); } /** delay */
            get tiles(): ITileData[] { return this.GetV("tiles"); } 
            get node_id(): string { return this.GetV("node_id")}
            get next_step_event(): string { return this.GetV("next_step_event"); }
            get x(): number { return this.GetVWithDefault("x", 0); }
            get y(): number { return this.GetVWithDefault("y", 0); }
            get z(): number { return this.GetVWithDefault("z", 0); }

            GetNodePosition(node: cc.Node, positionData: PositionData): cc.Vec3 { return this.m_Helper.GetNodePosition(node, positionData); }
            CheckColRow(oColRow: ITileData): boolean {
                if(this.typ === "check_col_row") {
                    let _targetColRow: ITileData = this.col_row;
                    let _isOK = _targetColRow.col == oColRow.col && _targetColRow.row == oColRow.row;
                    if(_isOK) {
                        this.NextStep();
                    }
                    return _isOK;
                }
                return false;
            }
        }

        export abstract class ActionUtil {
            static Run<T>(node: cc.Node, action: ActionData<T>, cb: Function): cc.Tween {
                switch (action.typ) {
                    case "fade":
                        return this.RunFadeAction(node, action as any as ActionData<number>, cb);
                    case "up_down":
                        return this.RunUpDownAction(node, action as any as ActionData<number>);
                    default:
                        throw new Error(`未处理的动作类型 ${action.typ}`);
                }
            }
            private static RunFadeAction(node: cc.Node, action: ActionData<number>, cb: Function): cc.Tween {
                node.opacity = action.from;
                let _fade_tw = cc.tween(node)
                    .delay(action.delay)
                    .to(action.duration, {
                        opacity: action.to
                    })
                    .call(()=>Util.safeCall(cb))
                    .start();
                return _fade_tw;
            }

            private static RunUpDownAction(node: cc.Node, action: ActionData<number>): cc.Tween {
                node.position = new cc.Vec3(node.position.x, action.from, node.position.z);
                let _tw = cc.tween(node)
                    .to(action.duration, { y: action.to })
                    .to(action.duration, { y: action.from})
                    .to(action.duration, { y: action.to })
                    .to(action.duration, { y: action.from})
                    .delay(action.delay);
                let _up_down_tw = cc.tween(node)
                    .repeatForever(_tw)
                    .start();
                return _up_down_tw;
            }
        }

        export interface IGuideDelegate {
            OnGuideFinished();
            OnGuideGetNode(node_id: string): cc.Node;
            OnGuideStep(step: Step);
        }

        export interface IGuideDialog {
            node: cc.Node;
            Show(step: Step, nextFunc: Function);
        }
        
        export interface IGuideFinger {
            node: cc.Node;
            Show(step: Step);
            Hide();
            OnDragStart();
            OnDragEnd();
        }
        
        export type GuideUIPanelArgs = {
            guideCtrl: GuideCtrl,
            delegate: IGuideDelegate,
            guideData: GuideData,
            onCompleted: Function
        }

        export interface IGuidePlayer {
            GetNodePosition(node: cc.Node, positionData: PositionData): cc.Vec3;
            Step: Step;
        }

        /**
         * 引导主界面，规定了其参数类型
         */
        export abstract class GuidePlayerUIPanel extends UIPanel<GuideUIPanelArgs> implements IGuidePlayer {
            protected abstract get TransferRoot(): cc.Node;
            protected abstract get Background(): cc.Node;
            protected abstract get Dialog(): IGuideDialog;
            protected abstract get Finger(): IGuideFinger;
            protected get Delegate(): IGuideDelegate { return this.args.delegate; }
            private _stepIndex: number = -1;
            protected get stepDatas(): StepData[] { return this.args.guideData.steps; }
            private _bInitNextStep: boolean = false;
            private _step: Step = null;
            get Step(): Step { return this._step; };
            private m_OnBackgroundClick_: Function = null;
            private m_NodeParentMap: Map<string, cc.Node> = new Map();

            //#region //! 生命周期
            protected abstract OnCreateSelf();
            protected abstract OnReleaseSelf();
            protected abstract SetBackgroundClickHandler(handler: Function);
            protected abstract OnOpenSelf();
            protected OnCreate(): void {
                this.Background.opacity = 0;
                this.OnCreateSelf();
                EventCenter.ins.on(Event.DRAG_START, this.Finger.OnDragStart.bind(this.Finger), this);
                EventCenter.ins.on(Event.DRAG_END, this.Finger.OnDragEnd.bind(this.Finger), this);
            }
            protected OnOpen(uiArgs: GuideUIPanelArgs) {
                this.args.guideCtrl.GuidePlayer = this;
                // 背景层点击事件使用机制保证会实现
                this.SetBackgroundClickHandler(()=>{
                    if(this.m_OnBackgroundClick_ != null) {
                        AudioMgr.ins.PlayEffect();
                        this.m_OnBackgroundClick_();
                    }
                });
                
                this.OnOpenSelf()
                this._bInitNextStep = true;
                this.nextStep();
            }
            protected OnRelease(): void {
                this.OnReleaseSelf();
            }

            protected onDestroy() {
                EventCenter.ins.targetOff(this)
                this.m_NodeParentMap.clear();
                this.m_NodeParentMap = null;
                super.onDestroy();
            }
            //#endregion

            private nextStep() {
                if(!this._bInitNextStep) {
                    console.error("只能在 OnOpen 之后调用 nextStep")
                    return;
                }
                if(this._stepIndex + 1 >= this.stepDatas.length) {
                    // 引导结束
                    this.Delegate.OnGuideFinished();
                    this.args.onCompleted(); /** 此方法会对引导进度进行保存 */
                    this.Close();
                    return;
                }
                ++this._stepIndex;
                let stepData: StepData = this.stepDatas[this._stepIndex];
                this._step = new Step(stepData, this, Util.onceCall(this.nextStep.bind(this), 1));
                this.__doStep(this._step);
            }

            private __doStep(step: Step) {
                switch (step.typ) {
                    case "delay": { this.scheduleOnce(step.NextStep, step.time); } break;
                    case "transfer": {
                        let node_id = step.node_id;
                        let node = this.Delegate.OnGuideGetNode(node_id);
                        this.m_NodeParentMap.set(node_id, node.parent);
                        UIUtil.transferTo(node, this.TransferRoot, false);
                        node.zIndex = step.z
                        step.NextStep();
                    } break;
                    case "transfer_back": {
                        let node_id = step.node_id;
                        let node = this.Delegate.OnGuideGetNode(node_id);
                        UIUtil.transferTo(node, this.m_NodeParentMap.get(node_id), false);
                        step.NextStep();
                    } break;
                    case "show_bg": {
                        this.Background.opacity = 0;
                        ActionUtil.Run(this.Background, step.enter_action, step.NextStep);
                    } break;
                    case "hide_bg": {
                        ActionUtil.Run(this.Background, step.exit_action, step.NextStep);
                    } break;
                    case "dialog": {
                        let _nextStepOnceCall = Util.onceCall(()=>{
                            this.m_OnBackgroundClick_ = null;
                            this.Dialog.node.active = false;
                            step.NextStep();
                        }, 1);
                        if(step.click_bg) {
                            this.m_OnBackgroundClick_ = _nextStepOnceCall;
                        }
                        this.Dialog.node.active = true;
                        this.Dialog.node.position = this.GetNodePosition(this.Dialog.node, step.position);
                        this.Dialog.Show(step, _nextStepOnceCall);
                    } break;
                    case "finger": {
                        this.Finger.node.active = true;
                        this.Finger.Show(step);
                        step.NextStep();
                    } break;
                    case "hide_finger": {
                        this.Finger.Hide();
                        step.NextStep();
                    } break;
                    case "open_ui": {
                        EventCenter.ins.once(step.next_step_event, ()=>{
                            console.info(`引导 >> 全局关闭消息 >> 处理 ${step.next_step_event}`)
                            step.NextStep()
                        }, this)
                        UIMgr.ins.Open(step.res_key, step.args);
                    } break;
                    case "audio": {
                        AudioMgr.ins.PlayEffect(step.res_key);
                        step.NextStep();
                    } break;
                    default:
                        this.Delegate.OnGuideStep(step)
                        break;
                }
            }

            /**
             * 某个 node 在不改变父节点的情况下，想要显示到 positionData 时的位置 
             * @param node 要移动的节点
             * @param positionData 位置信息
             * @returns 
             */
            GetNodePosition(node: cc.Node, positionData: PositionData): cc.Vec3 {
                switch (positionData.typ) {
                    case "related_to_node_id":
                        let _node = this.Delegate.OnGuideGetNode(positionData.node_id);
                        let _pos: cc.Vec3 = new cc.Vec3(_node.position.x + positionData.dx, _node.position.y + positionData.dy, _node.position.z);
                        let _targetPosition = node.parent.convertToNodeSpaceAR(_node.parent.convertToWorldSpaceAR(_pos));
                        return _targetPosition
                    default:
                        console.error(`Guide >> 未处理的位置类型 typ = ${positionData.typ}`)
                        break;
                }
            }
        }

        /**
         * 引导控制器（负责引导功能的出入口）
         */
        export class GuideCtrl {
            //#region //! GuidingStatus
            private static _playingDict: Map<string, boolean> = new Map(); 
            static GetIsGuiding(guideKey: string): boolean {
                if(this._playingDict.has(guideKey)) {
                    return this._playingDict.get(guideKey);
                }else{
                    return false;
                }
            }
            static SetIsGuiding(guideKey: string, isGuiding: boolean) {
                this._playingDict.set(guideKey, isGuiding);
            }
            //#endregion

            private _guideKey: string = null;
            private _delegate: IGuideDelegate = null;
            static Create(guideKey: string, delegate: IGuideDelegate): GuideCtrl {
                let _guideCtrl = new GuideCtrl(guideKey, delegate);
                return _guideCtrl;
            }
            private constructor(guideKey: string, delegate: IGuideDelegate) {
                this._guideKey = guideKey;
                this._delegate = delegate;
            }
            Release() {

            }

            IsGuided(): boolean { return UserLSMgr.ins.getBoolWithDefault(this._guideKey, false); }
            
            get IsGuiding(): boolean { return GuideCtrl.GetIsGuiding(this._guideKey); }

            StartGuide(pfbKey: string, guideData: GuideData) {
                console.assert(!this.IsGuiding, "错误的调用逻辑 >> 已经在播放引导了！");
                GuideCtrl.SetIsGuiding(this._guideKey, true);
                //! 打开播放器页面
                UIMgr.ins.Open<GuideUIPanelArgs>(pfbKey, {
                    guideCtrl: this,
                    delegate: this._delegate,
                    guideData: guideData,
                    onCompleted: this.FinishGuide.bind(this)
                })
            }
        
            private FinishGuide() {
                GuideCtrl.SetIsGuiding(this._guideKey, false);
                UserLSMgr.ins.setBool(this._guideKey, true, true);
            }

            private _guidePlayer: IGuidePlayer = null;
            get GuidePlayer(): IGuidePlayer { return this._guidePlayer; }
            set GuidePlayer(guidePlayer: IGuidePlayer) { this._guidePlayer = guidePlayer; }
            get Step(): Step { return this._guidePlayer.Step; }
        }
    }
}
