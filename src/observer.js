
import Dep from './dep.js'

export default class Observer {
    constructor(data) {
        this.observer(data);
    /**
     {
         name: 'hk',
         person: {
             name: 'h1',
             age: 20
         }
     }
     */
    }
    observer(data) {
        if (data && typeof data === 'object') {
            Object.keys(data).forEach(key => {
                this.defineReactive(data, key, data[key]);
            })
        }
    }
    // 通过Object.defineProperty方法对对象属性进行劫持
    defineReactive(obj, key, val) {
        // 递归观察
        this.observer(val);

        const dep = new Dep();

        // 数据劫持
        Object.defineProperty(obj, key, {
            configurable: false,
            enumerable: true,
            get() {
                Dep.target && dep.addWatcher(Dep.target);
                return val;
            },
            set: (newVal) => {
                if (newVal === val) return;
                this.observer(newVal);
                val = newVal;
                dep.notify();
            }
        })
    }
}