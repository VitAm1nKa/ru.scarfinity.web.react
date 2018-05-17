//Currying (каррирование)
function declOfNum(titles){
    number = Math.abs(number);
    var cases = [2, 0, 1, 1, 1, 2];
    return function(number){
        return  titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
    }
}
// use:
// declOfNum(['Яблоко','Яблока','Яблок'])(2); // Яблока

// var apples = declOfNum(['Яблоко','Яблока','Яблок']);
// apples(0) // Яблок
// apples(1) // Яблоко
// apples(2) // Яблока



//Auto Currying (автоматическое каррирование)
var declOfNum = (function(){
    var cases = [2, 0, 1, 1, 1, 2];
    var declOfNumSubFunction = function(titles, number){
        number = Math.abs(number);
        return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
    }
    return function(_titles) {
        if ( arguments.length === 1 ){
            return function(_number){
                return declOfNumSubFunction(_titles, _number)
            }
        }else{
            return declOfNumSubFunction.apply(null,arguments)
        }
    }
})()


// use:
// declOfNum(['Яблоко','Яблока','Яблок'], 0); // Яблок
// declOfNum(['Яблоко','Яблока','Яблок'], 1); // Яблоко
// declOfNum(['Яблоко','Яблока','Яблок'], 2); // Яблока

//

export var count__reviews = declOfNum(['Отзыв', 'Отзыва', 'Отзывов']);
export var count__cartItems = declOfNum(['Товар', 'Товара', 'Товаров']);
export var count__shipDuration__day = declOfNum(['День', 'Дня', 'Дней']);
export var count__shipDuration__week = declOfNum(['Неделя', 'Недели', 'Недель']);