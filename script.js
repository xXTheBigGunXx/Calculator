let mainDiv = document.createElement("div");
mainDiv.setAttribute("id", "main");
//Inserting main div for calculator
////////////////////////////////////////////////////////////////////////////////////
let numPad = document.createElement("div");
numPad.setAttribute("id", "numbers");

for(let i = 0; i < 3; i++){
    let bar = document.createElement("div");
    bar.setAttribute("id",`bar-${i+1}`);

    for(let j = 0; j < 3; j++){
        let child = document.createElement("button");
        let number = 7 - (i*3) + j;

        child.setAttribute("class", `num-${number}`);    
        child.innerText = number;

        bar.appendChild(child);
    }
    numPad.appendChild(bar);
}
let bar = document.createElement("div");
bar.setAttribute("div","bottom");

let zero = document.createElement("button");
zero.setAttribute("class",`num-${0}`);
zero.innerHTML = 0;

let comma = document.createElement("button");
comma.setAttribute("class","num-comma");
comma.innerHTML = '.';

let plusMinus = document.createElement("button");
plusMinus.setAttribute("class", "plusMinus");
plusMinus.innerHTML = "+/-";

bar.appendChild(plusMinus);
bar.appendChild(zero);
bar.appendChild(comma);

numPad.appendChild(bar);
//number pad is inserted into a div
///////////////////////////////////////////////////////////////////////////////////
let arithmetic = document.createElement("div");
arithmetic.setAttribute("id", "arit");

let hashset = new Set(['÷','x','-','+','=']);

hashset.forEach(x => {
    let child = document.createElement("button");
    child.setAttribute("class", `${x}-operator`);
    child.innerHTML = `${x}`;
    arithmetic.appendChild(child);
});
/// arithmetic operation bar is appended
////////////////////////////////////////////////////////////////////////////////////////////

let input = document.createElement("div");
input.setAttribute("id","input");
// input box a calculation
/////////////////////////////////////////////////////////////////////////////////////////////
let clearanceBar = document.createElement("div");
clearanceBar.setAttribute("id", "clear-bar");

hashset = new Set(['C', "del",'%']);

hashset.forEach(x => {
    let child = document.createElement("button");
    child.setAttribute("class", `bar-${x}`);
    child.innerHTML = `${x}`;
    clearanceBar.appendChild(child);
});
// clearn button on the top on numpad   
/////////////////////////////
let bones = document.createElement("div");
bones.setAttribute("id", "bones");

let left = document.createElement("div");
let right = document.createElement("div");

left.setAttribute("id", "left");
right.setAttribute("id", "right");

left.appendChild(clearanceBar);
left.appendChild(numPad);
right.appendChild(arithmetic);

mainDiv.appendChild(left);
mainDiv.appendChild(right);

bones.appendChild(input);
bones.appendChild(mainDiv);

document.body.append(bones);
/// With this line of code I divide the numb pad into two different sides - left and right
////////////////////////////////////////////////////////////////////////////////////////////

const distributor = (event) => {
    console.log(event);

    const {key} = event;
    console.log(key);

    const numb = new Set(['0','1','2','3','4','5','6','7','8','9','.']);
    const hashset = new Set(['/','*','-','+','=',]);
    const clearButton = new Set(['Backspace','Delete','%']);
    
    if(numb.has(key)){
        numPadExpresion("", key);
    }
    else if(hashset.has(key)){
        if(key === '*')
            aritExpresion("",'x');
        else if(key === '/')
            aritExpresion("",'÷');
        else
            aritExpresion("",key);
    }
    else if (clearButton.has(key)){
        clearanceButtons("",key);
    }else if(key === 'F9'){
        numPadExpresion("", key);
    }
}

const numPadExpresion = (event = "", key = "") => {
    let target = event.target 

    if(key === 'F9' || (typeof(target) !== 'undefined' && target.className === "plusMinus")){
        if(numb.length !== 0)
            if(numb[0] === '-'){
                numb = numb.slice(1,numb.length);
            }else{
                numb = '-' + numb;
            }
    }else{
        if(typeof(target) === 'undefined'){
            numb += key;
        }else{
            numb += target.innerHTML;
        }
    }

    input.innerHTML = currentExpression.join(" ") + numb;
}

const aritExpresion = (event = "", key = "") => {
    let target = event.target;

    if(numb !== "")
        currentExpression.push(numb);

    if(typeof(target) === 'undefined'){
        currentExpression.push(key);
    }else{
        currentExpression.push(target.innerHTML);
    }
    numb = "";
    
    input.innerHTML = currentExpression.join(" ");

    if(key === '=' || (typeof(target) !== 'undefined' && target.className === '=-operator')){
        currentExpression.pop();
        let eval = getEvaluation(infixToPolish(currentExpression));
        console.log(eval);
        input.innerHTML = eval;
        currentExpression = [];   
    }
}

const clearanceButtons = (event = "", key = "") => {
    let target = event.target

    if(key === 'Backspace' || (typeof(target) !== 'undefined' && target.className === "bar-del")){
        if(numb.length === 0){
            if(currentExpression.length !== 0){
                currentExpression.pop();
            }
        }
        else{
            let copyNumb = numb.toString();
            copyNumb = copyNumb.slice(0, -1);
            numb = copyNumb;

            if (isNaN(numb)) {
                numb = "";
            }
        }
    }
    else if(key === '%' || (typeof(target) !== 'undefined' && target.className === "bar-%")){
        currentExpression.push(numb);
        numb = "";
        currentExpression.push('%');   
    }
    else if(key === 'Delete' || (typeof(target) !== 'undefined' && target.className === "bar-C")){
        currentExpression = [];
        numb = "";
    }

    updateTextBox();
    console.log(currentExpression, numb);
}

const infixToPolish = arr => {
    const precedence = {'+': 1,'-': 1,'*': 2,'/': 2, '%':2};

    const output = [];
    const operators = [];

    arr = arr.map(x => 
        x === 'x' ? '*' : 
        x === '÷' ? '/' : 
        x
    );

    console.log(arr);

    arr.reverse();

    arr.forEach(token => {
        if (!isNaN(token)) {
            output.push(token);
        } else if (precedence[token]) {
            while (operators.length && precedence[operators[operators.length - 1]] >= precedence[token]) {
                output.push(operators.pop());
            }
            operators.push(token);
        }
    });

    while (operators.length) {
        output.push(operators.pop());
    }

    return output.reverse();
}

const getEvaluation = arr => {
    let st = [];

    for (let i = arr.length-1; i >= 0; i--) {
        let c = arr[i];
        if (c === '+') {
            let second = st.pop();
            let first = st.pop();
            st.push(first + second);
        } else if (c === "-") {
            let second = st.pop();
            let first = st.pop();
            //st.push(first - second);
            st.push(second - first);
        } else if (c === "*") {
            let second = st.pop();
            let first = st.pop();
            st.push(first * second);
        } else if (c === "/") {
            let second = st.pop();
            let first = st.pop();
            //st.push(first / second);
            st.push(second / first);
        } else if (c === '%'){
            let second = st.pop();
            let first = st.pop();
            st.push(second % first);
        } else if(!isNaN(c)){
            st.push(parseFloat(c));
        }
    }
    numb = st[0];
    return st.pop();
}

const updateTextBox = () => {
    if(isFloat(numb)){
        numb = numb.toFixed(6);
    }
    input.innerHTML = currentExpression.join("") + numb;
};

function isFloat(n) {
    return Number(n) === n && !Number.isInteger(n);
}

// All the main functions

let numb = "";
let currentExpression = [];

numPad.addEventListener("click",event => numPadExpresion(event));
arithmetic.addEventListener("click", event => aritExpresion(event));
clearanceBar.addEventListener("click", event => clearanceButtons(event));
document.addEventListener("keydown", event => distributor(event));

// Event listeners