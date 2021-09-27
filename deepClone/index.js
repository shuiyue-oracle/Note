function deepClone(p) {
    if (typeof p !== 'object' || p === undefined || p === null) return p;

    if (Object.prototype.toString.call(p) === '[object Object]') {
        const res = {}
        for (const key in p) {
            res[key] = deepClone(p[key])
        }
        return res
    } else if (Object.prototype.toString.call(p) === '[object Array]') {
        const res = []
        for(let i=0; i<p.length; i++) {
            res[i] = deepClone(p[i])
        }
        return res
    }
}




const p1 = {
    code: 1,
    name: 'tt',
    list: [
        {sex: 'f'}
    ]
}

const d = deepClone(p1)
d.code = 2
console.log(d)
console.log(p1)