
export default class Dep {
    constructor() {
        this.subs = [];
    }
    // 添加观察者
    addWatcher(watcher) {
        this.subs.push(watcher);
    }
    // 通知观察者
    notify() {
        console.log('观察者', this.subs);
        this.subs.forEach(watcher => watcher.update());
    }
}