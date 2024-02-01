namespace numas {
    abstract class Base64 {
        private static base64hash: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';        
        // btoa method
        static encode(s) {
            if (/([^\u0000-\u00ff])/.test(s)) {
                throw new Error('INVALID_CHARACTER_ERR');
            }    
            let i = 0,
                prev,
                ascii,
                mod,
                result = [];
    
            while (i < s.length) {
                ascii = s.charCodeAt(i);
                mod = i % 3;
    
                switch(mod) {
                    // 第一个6位只需要让8位二进制右移两位
                    case 0:
                        result.push(this.base64hash.charAt(ascii >> 2));
                        break;
                    //第二个6位 = 第一个8位的后两位 + 第二个8位的前4位
                    case 1:
                        result.push(this.base64hash.charAt((prev & 3) << 4 | (ascii >> 4)));
                        break;
                    //第三个6位 = 第二个8位的后4位 + 第三个8位的前2位
                    //第4个6位 = 第三个8位的后6位
                    case 2:
                        result.push(this.base64hash.charAt((prev & 0x0f) << 2 | (ascii >> 6)));
                        result.push(this.base64hash.charAt(ascii & 0x3f));
                        break;
                }
    
                prev = ascii;
                i ++;
            }
    
            // 循环结束后看mod, 为0 证明需补3个6位，第一个为最后一个8位的最后两位后面补4个0。另外两个6位对应的是异常的“=”；
            // mod为1，证明还需补两个6位，一个是最后一个8位的后4位补两个0，另一个对应异常的“=”
            if(mod == 0) {
                result.push(this.base64hash.charAt((prev & 3) << 4));
                result.push('==');
            } else if (mod == 1) {
                result.push(this.base64hash.charAt((prev & 0x0f) << 2));
                result.push('=');
            }
    
            return result.join('');
        }
    
        // atob method
        // 逆转encode的思路即可
        static decode(s) {
            s = s.replace(/\s|=/g, '');
            let cur,
                prev,
                mod,
                i = 0,
                result = [];
    
            while (i < s.length) {
                cur = this.base64hash.indexOf(s.charAt(i));
                mod = i % 4;
    
                switch (mod) {
                    case 0:
                        break;
                    case 1:
                        result.push(String.fromCharCode(prev << 2 | cur >> 4));
                        break;
                    case 2:
                        result.push(String.fromCharCode((prev & 0x0f) << 4 | cur >> 2));
                        break;
                    case 3:
                        result.push(String.fromCharCode((prev & 3) << 6 | cur));
                        break;
                        
                }
    
                prev = cur;
                i ++;
            }
    
            return result.join('');
        }
    
        static Test(){
            console.log('>>Test Base64:')
            let _ = [
                {value: 'Man', encode: 'TWFu'},
                {value: 'A', encode: 'QQ=='},
                {value: 'BC', encode: 'QkM='},
            ].forEach(data => {
                let encodeStr = Base64.encode(data.value)
                let decodeStr = Base64.decode(encodeStr)
                if(data.value === decodeStr && encodeStr === data.encode){
                    console.log(data.value, ' ----> OK')
                }else{
                    throw "Error!";
                }
            })
        }
    }
    
    export class encrypt {
        static encodeBase64(s: string): string{ return Base64.encode(s) }
        static decodeBase64(s: string): string{ return Base64.decode(s) }
    }
}
