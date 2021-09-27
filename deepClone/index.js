function deepClone(p) {
    if (typeof p !== 'object' || p === undefined) return p;

    const res = p instanceof Array ? [] : {}
    for (const key in p) {
        if (p.hasOwnProperty(key)) {
            if (typeof p[key] === 'object' && p !== null) {
                deepClone(p[key])
            } else {
                res[key] = p[key]
            }
        }
    }

    return res
}




const p1 = {
    code: 1,
    name: 'tt',
    list: [
        {sex: 'f'}
    ]
}

const d = deepClone(p1)

console.log(d)