class Mypromise {
    constructor(handle) {
        this._value = undefined;
        this._state = 'pending';
        this._fulfilledQueues = []
        this._rejectedQueues = []
        try {
            handle(this._resolve.bind(this), this._reject.bind(this));
        } catch(error) {
            this._reject(error);
        }
    }

    _resolve(val) {
        const run = () => {
            if(this._state !== 'pending') return;
            this._state = 'fulfilled'

            const runFulFill = value => {
                let cb;
                while(cb = this._fulfilledQueues.shift()) {
                    cb(value)
                }
            }
            const runReject = error => {
                let cb;
                while(cb = this._rejectedQueues.shift()) {
                    cb(error)
                }
            }
            if (val instanceof Mypromise) {
                val.then(v => {
                    this._value = v
                    runFulFill(v)
                }, 
                e => {
                    this._value = e
                    runReject(e)
                })
            } else {
                this._value = val
                runFulFill(val)
            }
        }
        setTimeout(run, 0)
    }
    _reject(val) {
        const run = () => {
            if(this._state !== 'pending') return;
            this._value = val
            this._state = 'rejected'
            let cb;
            while(cb = this._rejectedQueues.shift()) {
                cb(val)
            }
        }
        setTimeout(run, 0)
    }
    isFunc(handle) {
        return handle && typeof handle === 'function'
    }
    then(onFulfilled, onRejected) {
        const { _value, _state } = this;
        return new Mypromise((onFulfilledNext, onRejectedNext) => {
            const fulfilled = (val)=>{
                try {
                    if (!this.isFunc(onFulfilled)) {
                        onFulfilledNext(val)
                    } else {
                        const res = onFulfilled(val)
                        if (res instanceof Mypromise) {
                            res.then(onFulfilledNext, onRejectedNext)
                        } else {
                            onFulfilledNext(res)
                        }
                    }
                } catch(error) {
                    onRejectedNext(error)
                }
            };
            const rejected = (val)=>{
                try {
                    if (!this.isFunc(onRejected)) {
                        onRejectedNext(val)
                    } else {
                        const res = onRejected(val)
                        if (res instanceof Mypromise) {
                            res.then(onFulfilledNext, onRejectedNext)
                        } else {
                            onRejectedNext(res)
                        }
                    }
                } catch(error) {
                    onRejectedNext(error)
                }
            };

            switch(_state) {
                case 'pending':
                    this._fulfilledQueues.push(fulfilled)
                    this._rejectedQueues.push(rejected)
                    break;
                case 'fulfilled':
                    fulfilled(_value);
                    break;
                case 'rejected':
                    rejected(_value);
                    break;
            }
        })
    }

    static resolve(value) {
        if(value instanceof Mypromise) {
            return value
        } else {
            return new Mypromise((resolve) => resolve(value))
        }
    }

    static reject(error) {
        if(value instanceof Mypromise) {
            return value
        } else {
            return new Mypromise((resolve, reject) => reject(error))
        }
    }

    static all(list) {
        return new Mypromise((resolve, reject) => {
            const value = []
            let count = 0
            for(let [i, p] of list.entries()) {
                this.resolve(p).then(v => {
                    value[i] = v
                    count++
                    if(count === list.length) resolve(value)
                }, e => reject(e))
            }
        })
    }

    static race(list) {
        return new Mypromise((resolve, reject) => {
            for(let v of list) {
                this.resolve(v).then(res => {
                    resolve(res)
                }, e => reject(e))
            }
        })
    }
    // es2020新增：传入数组，每个数组对象皆为一个promise对象，无论每个promise对象执行成功还是失败，最后的状态都是fulfilled，并返回每个promise对象对象的结果
    static allSettled(list) {
        return new Mypromise((resolve, reject) => {
            const value = []
            let count = 0
            for(let [i, p] of list.entries()) {
                if(p instanceof Mypromise) {
                    p.then(v => {
                        value[i] = v
                        count++
                        if(count === list.length) resolve(value)
                    }, e => {
                        value[i] = e
                        count++
                        if(count === list.length) resolve(value)
                    })
                }
            }
        })
    }

    catch(onRejected) {
        return this.then(undefined, onRejected)
    }

    finally(cb) {
        return this.then(
            value => Mypromise.resolve(cb()).then(() => value),
            error => Mypromise.reject(cb()).then(() => value)
        )
    }
}
const p1 = new Mypromise((resolve, reject) => {
    setTimeout(()=>{
        resolve('resolve1')
    }, 1000)
})
const p2 = new Mypromise((resolve, reject) => {
    setTimeout(()=>{
        reject('reject1')
    }, 1000)
})

// Mypromise.all([p1, p2])
// .then(r => {
//     console.log(r)
// })
// .finally(()=>{
//     console.log('结束')
// })

Mypromise.allSettled([p1, p2])
.then(r => {
    console.log(r)
})