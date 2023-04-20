//https://www.youtube.com/watch?v=7JbBr9q4UF8
//https://www.youtube.com/watch?v=dqqxkrKhfS4
//https://www.youtube.com/watch?v=-tlb4tv4mC4
"use strict";

const section = document.querySelector("section");
const btnCheck = document.querySelector(".check");
const btnReset = document.querySelector(".reset");
const spanResult = document.querySelector(".span-result");
const condition = document.querySelector(".condition");
let mark = 0, count = 0;

condition.innerHTML = `<h3>${cond[0]}</h3><p>${cond[1]}</p>`;
//randomize
const randomize = (arr) =>{
    return [...arr].map(a => ({ value: a, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(a => a.value);   
};

const createData = () =>{
    const arrItems = [];
    randomize(data).slice(0, numberOfCards).forEach((item) => {
        for (let i=0; i<item.imageSrc.length; i++){
            arrItems.push({name: item.name, imageSrc: item.imageSrc[i]});
        }});
    return randomize(arrItems);
}
/*const duplicateArr = (arr, n) =>{
    let newArr = [];
    for (let i=0; i<n; i++){
        newArr = newArr.concat(arr);
    }
    return newArr;
}*/

//card generation function
const cardGenerator = (cardData) =>{
    cardData.forEach((item) => {
        const card = document.createElement("div");
        card.classList.add('card'); //append class 'card' to the element
        card.setAttribute("name", item.name);
        card.innerHTML = `<img class="face" src="${item.imageSrc}"/>`;
        section.appendChild(card);
        
        card.addEventListener('click', (e)=>{
            checkCards(e);
        });     
    });
};

//check cards
const checkCards = (e) =>{
    const clickedCard = e.target;
    if (!clickedCard.classList.contains("clicked")){
        clickedCard.classList.add("clicked");
        const flippedCards = document.querySelectorAll(".clicked");
        const flippedFace = document.querySelectorAll("div.card.clicked img.face");
        createSyle(flippedFace, 'yellow');

        if (flippedCards.length === numberOfFlipCards){
            if([...flippedCards].every(el => el.getAttribute("name") === flippedCards[0].getAttribute("name")) ){
                createSyle(flippedFace, 'lightgreen');
                flippedCards.forEach((card)=>{
                    card.classList.remove("clicked");
                    card.style.pointerEvents = "none"; //make anclickable element
                    card.classList.add('right');
                });
               //countRightPair++; 
            }else{
                createSyle(flippedFace, 'red');
                setTimeout(()=>{
                    flippedCards.forEach((card)=>{
                    card.classList.remove("clicked");
                });
                    createSyle(flippedFace, 'transparent');
                }, 1000);
                //countRightPair--;
                count--;
            }
        }
    }else{
        clickedCard.firstChild.style.backgroundColor = 'white';
        clickedCard.classList.remove("clicked");
    }
    console.log(count);
}

const createSyle = (flip, str) =>{
    flip.forEach((elem)=>{
        elem.style.backgroundColor = str;
    });
}

btnReset.addEventListener('click', ()=>{
     mark = 0;
    /*let cardData = createData();
    let faces = document.querySelectorAll(".face");
    let cards = document.querySelectorAll(".card");
    createSyle(faces, "white");
    cardData.forEach((item, index)=>{
        cards[index].removeAttribute("style");
        cards[index].setAttribute("name", item.name);
        faces[index].src = item.imageSrc;
    });*/
    section.replaceChildren();
    cardGenerator(randomize(cardData));
    spanResult.textContent = "";
});   

btnCheck.addEventListener('click', ()=>{
    const countRightPair = section.querySelectorAll('.right');
    const res = countRightPair.length / numberOfFlipCards + count;
    mark = res <= 0 ? 0 : Math.round(res * score / numberOfCards);
    spanResult.textContent = "Результат: " + mark + " из " + score;
    console.log(res, count);
});

let cardData = createData();
cardGenerator(cardData);