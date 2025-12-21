# JavaScript 等于逻辑

```
特殊
	undefined == null
	NaN == NaN
类型相同
	比较值
类型不同
	都是原始类型
		转换为数字比较
	原始类型 vs 对象类型
		对象转为原始值后比较
			1. 先使用valueOf 比较，valueOf 的值非原始值；
      2. 就使用 toString 进行转换比较
```
