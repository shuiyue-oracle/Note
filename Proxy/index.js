const data = {
    num: 0,
    arr: []
}
const proxy = new Proxy(data, {
    set: function(target, propKey, value, receiver) {
        console.log(`setting ${propKey}!`);
        return Reflect.set(target, propKey, value, receiver)
    },
    get: function(target, propKey, receiver) {
        console.log(`getting ${propKey}!`);
        return Reflect.get(target, propKey, receiver)
    }
})

proxy.num = 1
++proxy.num