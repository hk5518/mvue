
import compileUtil from './compileUtil.js'

export default class Compile {
    constructor(el, vm) {
        this.$el = this.isElement(el) ? el : document.querySelector(el);
        this.$vm = vm;
        // 1、获取文档碎片
        const fragment = this.node2Fragment(this.$el);

        // 2、编译文档
        this.compile(fragment);

        // 3、将文档碎片节点插入到根节点里面
        this.$el.appendChild(fragment);

    }

    // 编译
    compile(fragment) {
        let childNodes = fragment.childNodes;

        [...childNodes].forEach(node => {
            // 判断是否元素节点
            if (this.isElement(node)) {
                // 编译元素节点
                this.compileElement(node);
            } else {
                // 编译文本节点
                this.compileText(node);
            }
            // 递归遍历所有节点
            if (node.childNodes && node.childNodes.length) {
                this.compile(node)
            }
        })
    }
    // 编译元素节点
    compileElement(node) {
        let attributes = node.attributes;

        // 遍历所有节点属性
        [...attributes].forEach(attr => {
            let {name, value} = attr;  // v-text="name"  v-html=html  type="text"  v-model="name"
            
            // 判断是否为指令
            if(this.isDirective(name)) {
                // 指令处理逻辑
                let [, directive] = name.split('-'); // v-text  v-html  v-mode  v-bind  v-on:click v-bind:href=''

                let [dirName, detailVal] = directive.split(':');
                compileUtil[dirName] && compileUtil[dirName](node, value, this.$vm, detailVal);

                //移除指令属性
                node.removeAttribute(`v-${directive}`);

            } else if(this.isEventName(name)) {
                // 事件名处理逻辑 @click='handleClick'
                let [, detailVal] = name.split('@');
                compileUtil['on'](node, value, this.$vm, detailVal);

                //移除事件属性
                node.removeAttribute(`@${detailVal}`);

            }
        })
    }

    // 编译文本节点
    compileText(node) {
        // 编译文本中的{{person.age}}
        const content = node.textContent;
        const reg = /\{\{(.+?)\}\}/;
        if (reg.test(content)) {
            compileUtil['text'](node, content, this.$vm);
        }
    }

    // 文档节点转文档碎片
    node2Fragment(el) {
        const df = document.createDocumentFragment();
        let child = null;
        while(child = el.firstChild) {
            df.appendChild(child);
        }
        return df;
    }

    // 判断是否为事件名
    isEventName(str) {
        return str.startsWith('@');
    }

    // 判断是否为指令
    isDirective(str) {
        return str.startsWith('v-');
    }

    // 判断是否文档节点
    isElement(el) {
        return el.nodeType === 1
    }
}