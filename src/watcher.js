
import compileUtil from './compileUtil.js'
import Dep from './dep.js'

export default class Watcher {
    constructor(expr, vm, cb) {
        this.$expr = expr;
        this.$vm = vm;
        this.$cb = cb;
        this.oldVal = this.getOldVal();
    }
    getOldVal() {
        Dep.target = this;
        const oldVal = compileUtil.getVal(this.$expr, this.$vm);
        Dep.target = null;
        return oldVal;
    }
    update() {
        const newVal = compileUtil.getVal(this.$expr, this.$vm);
        if (newVal !== this.oldVal) {
            this.$cb(newVal);
        }
    }
}