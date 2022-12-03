let arr = [1,2,3,4,6]
arr.forEach(item=>console.log(item))


const newarr = arr.filter( num => num%2 === 0)
console.log(newarr)

const squares = arr.map(item=>item*item)
console.log(squares)

const x  = arr.find(item=>item > 5)
console.log(x)