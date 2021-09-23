```javascript
        // 经典科里化函数题型
        /**
         * add(1)(2)(3) = 6
         * add(1,2,3)(4) = 10
         * add(1)(2)(3)(4)(5) = 15
         */
        function add(...args) {
            const _args = Array.prototype.slice.call(args)

            const _adder = (...args) => {
                _args.push(...args)
                return _adder
            }
            _adder.toString = () => _args.reduce((a, b) => a + b)
            return _adder
        }
```