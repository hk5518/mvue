
import Observer from './observer.js'
import Compile from './compile.js'

export default class Mvue {
    constructor(options) {
        this.$el = options.el;
        this.$data = options.data;
        this.$options = options;
        if (this.$el) {
            // 实例化观察者
            new Observer(this.$data);

            // 编译模板
            new Compile(this.$el, this)

            // 通过代理实现 this.person.name = 'xxx';
            this.proxyData(this.$data);
        }
    }

    proxyData(data) {
        let that = this;
        for(let key in data) {
            Object.defineProperty(this, key, {
                get() {
                    return data[key];
                },
                set(newVal) {
                    data[key] = newVal;
                }
            })
        }
    }
}