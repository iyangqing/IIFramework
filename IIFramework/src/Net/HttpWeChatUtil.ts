
namespace numas {
    export class HttpWeChatUtil {
        static Get(url:string, data: {}, onSuccess: Resolve<any>, onFail: Reject<any>): void { this.request(url, data, "GET", onSuccess, onFail); }
        static Post(url:string, data: {}, onSuccess: Resolve<any>, onFail: Reject<any>): void { this.request(url, data, "POST", onSuccess, onFail); }
        private static request(url: string, data: {}, method: string, onSuccess: Resolve<any>, onFail: Reject<any>): void {
            window["wx"].request({
                url: url,
                data: data,
                header: {
                    "content-type": "application/json"
                },
                method: method,
                success(res) {
                    if (CC_DEBUG) {
                        let uri = url.substr(url.lastIndexOf("/"));
                        console.debug(`uri==${uri}`, 'resp --', JSON.stringify(res.data), ', req --', data);
                    }
                    onSuccess(res.data);
                },
                fail(res) {
                    onFail(res);
                }
            })
        }
    }
}
