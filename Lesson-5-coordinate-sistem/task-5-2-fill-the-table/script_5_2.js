const num = Math.floor(Math.random() * data.length);
const headerLength = data[num].header.length;
const numberOfRows = 4, score = 10;
let count = 0, mark = 0; 
let table = document.querySelector('table');
const btnCheck = document.querySelector(".check");
const btnBack = document.querySelector(".back");
const btnReset = document.querySelector(".reset");
const spanResult = document.querySelector('.span-result');

const calculateValues = () =>{
    let arrTableValue = [];
    for (let i=0; i<numberOfRows; i++){
        let a = [randomInt(-10, 10), randomInt(-10, 10)];
        let b = [randomInt(-10, 10), randomInt(-10, 10)];
        let m = [(a[0]+b[0])/2, (a[1]+b[1])/2];
        let d = Math.round(Math.sqrt(Math.pow((a[1]-a[0]), 2)+Math.pow((b[1]-b[0]), 2)));
        let l = randomInt(0, 9);
        let lambda = l % 2 === 0 ? l+1 : l;
        let m1 = [(b[0]-lambda*a[0])/(1+lambda), (b[1]-lambda*a[1])/(1+lambda)];
        arrTableValue.push([a, b, m, d, m1, lambda]);
    }
    data[num].tableValues = arrTableValue;
}

const randomInt = (min, max) => {
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}

const randomize = (arr) =>{
    return [...arr].map(a => ({ value: a, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(a => a.value);   
};

const createVariant = () =>{
    let arrVariant = [];
    for (let i=0; i<numberOfRows; i++){
        const arr1 = Array(headerLength - data[num].numMissedCells).fill(1); 
        const arr2 = Array(data[num].numMissedCells).fill(0);
        arrVariant.push(randomize(arr1.concat(arr2)));
    }
    data[num].variant = arrVariant;
}

const switchCoord = (elem, arr)=>{
    switch(elem){
        case 'A': 
            return `(${arr[0]})`;
        case 'B': 
            return `(${arr[1]})`;
        case 'M': 
            return `(${arr[2]})`;
        case 'd': 
            return arr[3];
        case 'M1':
            return `(${arr[4]})`;
        case 'lambda':
            return arr[5];
    }
}

const rememberMissingValues = ()=>{
    let missingValues = [];
    for (let i=0; i<numberOfRows; i++){
        data[num].header.forEach((el, index) =>{
            if (data[num].variant[i][index] === 0) missingValues.push(switchCoord(el, data[num].tableValues[i]));
        });
    }
    data[num].missingValues = missingValues;
}

const createTable = (val = Array(data[num].numMissedCells * 4).fill("")) =>{      
    table.innerHTML = `<thead><tr class="header"></tr></thead>`;
    let header = document.querySelector('.header');
    data[num].header.forEach(el=>{
        header.innerHTML += `<th>${el}</th>`;
    });
    let n = 0;       
    for (let i=0; i<numberOfRows; i++){
        let row = document.createElement('tr');
        table.appendChild(row);
    
        data[num].header.forEach((el, index) =>{  
            row.innerHTML += (data[num].variant[i][index] === 1) ? `<td>${switchCoord(el, data[num].tableValues[i])}</td>` : 
                     `<td><input type='text' value = "${val[n++]}"></td>`;
        });
    }
}

createVariant();
calculateValues();
rememberMissingValues();
createTable();

btnCheck.addEventListener('click', ()=>{
    count = 0, mark = 0;
    const arrInputs = document.querySelectorAll('input');
    data[num].userAnsw = [...arrInputs].map(el=> el.value);
    
    arrInputs.forEach((el, index) =>{
        count += (el.value == data[num].missingValues[index])? 1 : -1;
        const res = count * score / arrInputs.length;
        mark = res <= 0 ? 0 : Math.round(res);
    });
    data[num].mark = mark;
    spanResult.textContent = "Результат: " + mark + " из " + score;
    console.log('check', data[num]);
    //console.log(count, mark);
});

btnBack.addEventListener('click', ()=>{
    console.log('back', data[num]);

    const arrInputs = document.querySelectorAll('input');
    let numInput = 0;
    data[num].userAnsw = [...arrInputs].map(el=> el.value); 
    createTable(data[num].userAnsw);
});

btnReset.addEventListener('click', ()=>{
    console.log('reset', data[num]);
    const arrInputs = document.querySelectorAll('input');
    arrInputs.forEach(el=>{
        el.value = "";
    });
    data[num].userAnsw = [];
    data[num].mark = 0;
    spanResult.textContent = "";
});