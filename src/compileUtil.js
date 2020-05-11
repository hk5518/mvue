
import Watcher from './watcher.js'

// 编译工具
const compileUtil = {
    getVal(expr, vm) {
        return expr.split('.').reduce((data, currentVal) => {
            return data[currentVal];
        }, vm.$data);
    },
    setVal(expr, vm, inputVal) {
        expr.split('.').reduce((data, currentVal) => {
            data[currentVal] = inputVal;
        }, vm.$data);
    },
    getContent(expr, vm) {
        // {{person.name}}--{{person.age}}
        // 防止修改person.name使得所有值全部被替换
        return expr.replace(/\{\{(.+?)\}\}/g, (...args)=>{
            return this.getVal(args[1], vm);
        });
    },
    // 编译文本处理
    text(node, expr, vm) {
        let value = '';
        if (expr.indexOf('{{') !== -1) {
            value = expr.replace(/\{\{(.+?)\}\}/g, (...args) => {
                
                new Watcher(args[1], vm, () => {
                    this.updater.textUpdater(node, this.getContent(expr, vm));
                })
                
                return this.getVal(args[1], vm);
            })
            
        } else {
            value = this.getVal(expr, vm);
        }
        this.updater.textUpdater(node, value);
    },
    // 编译html处理
    html(node, expr, vm) {
        let value = this.getVal(expr, vm);
        new Watcher(expr, vm, (newVal) => {
            this.updater.htmlUpdater(node, newVal);
        })
        this.updater.htmlUpdater(node, value);
    },
    // 编译model处理
    model(node, expr, vm) {
        let value = this.getVal(expr, vm);

        new Watcher(expr, vm, (newVal) => {
            console.log(newVal);
            this.updater.modelUpdater(node, newVal);
        })

        // 监听输入框变化进行更新值
        node.addEventListener('input', (e) => {
            this.setVal(expr, vm, e.target.value);
        })
        this.updater.modelUpdater(node, value);
    },
    // 编译事件处理
    on(node, expr, vm, detailVal) {
        let fn = vm.$options.methods && vm.$options.methods[expr];
        node.addEventListener(detailVal, fn.bind(vm), false);
    },
    bind(node, expr, vm, detailVal) {
        console.log(expr, detailVal)
        node.setAttribute(detailVal, expr);
    },
    // 更新器
    updater: {
        // 更新text
        textUpdater(node, value) {
            node.textContent = value;
        },
        // 更新html
        htmlUpdater(node, value) {
            node.innerHTML = value;
        },
        // 更新model
        modelUpdater(node, value){
            node.value = value;
        }
    }
}

export default compileUtil