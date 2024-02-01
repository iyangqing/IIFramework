namespace numas {
    export class UIUtil {
        // 获取组件，没有该组件时，添加一个；
        static getOrAddComponent<T extends cc.Component>(node: cc.Node, typ: {new(): T}): T {
            let comp = node.getComponent<T>(typ);
            if(!comp) {
                comp = node.addComponent<T>(typ);
            }
            return comp;
        }

        // 将 node 节点移动到 targetParent 节点，保持当前的位置不变
        static transferTo(node: cc.Node, targetParent: cc.Node, cleanup: boolean = false) {
            if(node.parent === targetParent) {
                return
            }
            let np = targetParent.convertToNodeSpaceAR(node.convertToWorldSpaceAR(cc.Vec3.ZERO))
            node.removeFromParent(cleanup)
            node.position = np
            targetParent.addChild(node)
        }

        static positionInTarget(node: cc.Node, targetParent: cc.Node): cc.Vec3 {
            let wp = node.convertToWorldSpaceAR(cc.Vec3.ZERO)
            return targetParent.convertToNodeSpaceAR(wp)
        }

        //#region //! UI Action
        static fadeInBackgroundAction(bg: cc.Node, opacity: number = 255, duration: number = 0.4) { this.showAction(bg, duration, { opacity: opacity }, null, 0, true) }
        static fadeOutBackgroundAction(bg: cc.Node, cb: Function = null, opacity: number = 0, duration: number = 0.3, delay: number = 0.4) { this.hideAction(bg, duration, { opacity: opacity }, cb, delay, true) }

        static scaleAction(node: cc.Node, scale: number) {
            cc.tween(node)
                    .to(0.15, {scale: scale})
                    .to(0.2, {scale: 1})
                    .start()
        }
        static moveAction(node: cc.Node, isShow: boolean, hidePosition: cc.Vec3, duration: number = 0.8, cb?: Function, delay: number = 0.0, easing:(t: number)=>number = cc.easing.backOut) {
            let tw = cc.tween(node)
            if(delay > 0) { tw.delay(delay) }
            tw.to(duration, {position: isShow ? cc.Vec3.ZERO : hidePosition}, {easing: isShow ? easing : cc.easing.backIn})
            if(cb){
                tw.call(cb)
            }
            tw.start()
        }
        static hideAction(node: cc.Node, duration: number, to: {scale?: number, opacity?: number, easing?: string }, cb: Function=null, delay: number=0, block: boolean = true) { return this.BaseAction(node, false, duration, to, cb, delay, block) }
        static showAction(node: cc.Node, duration: number, to: {scale?: number, opacity?: number, easing?: string }, cb: Function=null, delay: number=0, block: boolean = true) { return this.BaseAction(node, true, duration, to, cb, delay, block) }
        private static BaseAction(node: cc.Node, isShow: boolean, duration: number, to: {scale?: number, opacity?: number, easing?: string }, cb: Function=null, delay: number=0, block: boolean = true) {
            if(duration == 0){
                node.active = isShow
                if(node.scale !== null || node.scale !== undefined){
                    node.scale = to.scale
                }
                if(node.opacity !== null || node.opacity !== undefined){
                    node.opacity = to.opacity
                }
                console.assert(delay == 0)
                if(cb){ cb(node) }
                return
            }
            node.active = true
            if(block) { UIMgr.ins.AddBlockRef(); }
            let tw = cc.tween(node)
            if(delay > 0) { tw.delay(delay) }
            tw.to(duration, to)
            .call((node)=>{
                node.active = isShow
                if(block) { UIMgr.ins.DecBlockRef(); }
                if(cb){ cb(node) }
            })
            .start()
        }
        //#endregion
    }
}
