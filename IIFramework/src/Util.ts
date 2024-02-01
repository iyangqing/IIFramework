namespace numas {
    export class Util {
        static safeCall(cb: Function) { if(cb != null) { cb(); } }
        static onceCall = (cb: Function, cnt: number) => ()=>{ --cnt; if(cnt == 0){ cb() }; }
        static onceCallEx = <T>(cb: Action<T>, cnt: number) => (p: T)=>{ --cnt; if(cnt == 0){ cb(p) }; }

        static playParticleSystem(particle: cc.ParticleSystem, delay: number = 0): void {
            particle.node.opacity = 0;
            if(delay == 0) {
                particle.resetSystem()
                particle.scheduleOnce(()=>{
                    particle.node.opacity = 255;
                }, 0)
            }else{
                particle.scheduleOnce(()=>{
                    particle.resetSystem()
                    particle.scheduleOnce(()=>{
                        particle.node.opacity = 255;
                    }, 0)
                }, delay)
            }
        }

        static block(seconds: number){
            return function (target, methodName: string, descriptor: PropertyDescriptor) {
                let oldMethod = descriptor.value
                let isBlock = false
                descriptor.value = function(...args : any[]){
                    if(isBlock){
                        console.info('ii.Util.block >> blocking')
                        return
                    }
                    isBlock = true
                    setTimeout(()=>{
                        isBlock = false
                    }, seconds*1000)
                    oldMethod.apply(this, args)
                }
                return descriptor
            }
        }
    }
}
