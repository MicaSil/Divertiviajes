//Slider
const slider = document.querySelector("#slider");
let sliderSection =  document.querySelectorAll('.slider--section');
let sliderSectionLast = sliderSection[sliderSection.length - 1];

const btnLeft = document.querySelector('#btn-left');
const btnRight = document.querySelector('#btn-right');

slider.insertAdjacentElement('afterbegin', sliderSectionLast);

function moverDerecha(){
    let sliderSectionFirst = document.querySelectorAll('.slider--section')[0];
    slider.style.marginLeft = "-200%";
    slider.style.transition = "all 0.5s";
    setTimeout(function(){
        slider.style.transition = "none";
        slider.insertAdjacentElement('beforeend', sliderSectionFirst);
        slider.style.marginLeft = "-100%";

    }, 500);
    
}

function moverIzquierda(){
    let sliderSection =  document.querySelectorAll('.slider--section');
    let sliderSectionLast = sliderSection[sliderSection.length - 1];
    slider.style.marginLeft = "0";
    slider.style.transition = "all 0.5s";
    setTimeout(function(){
        slider.style.transition = "none";
        slider.insertAdjacentElement('afterbegin', sliderSectionLast);
        slider.style.marginLeft = "-100%";

    }, 500);
    
}

btnRight.addEventListener('click', function(){
    moverDerecha()
})

btnLeft.addEventListener('click', function(){
    moverIzquierda()
})

//Calculadora de viajes

let vacacionesCalc = document.getElementById('vacacionesCalc')

vacacionesCalc.addEventListener('submit', calcExpenses)

function valores(){
    let destino = document.getElementById('destino').value;
    let presupuesto = document.getElementById('presupuesto').value;
    let hospedaje = document.getElementById('hospedaje').value;
    let transporte = document.getElementById('transporte').value;
    let comida = document.getElementById('comida').value;

    return {destino, presupuesto, hospedaje, transporte, comida}
}

function calcExpenses (e) {

    e.preventDefault();
    
    const {destino, presupuesto, hospedaje, transporte, comida} = valores();

    let gastos = parseInt(hospedaje) + parseInt(transporte) + parseInt(comida)

    let balance = presupuesto - gastos

    UI(destino, presupuesto, balance)


}

function UI(destino, presupuesto, balance){
    let result = document.getElementById('result')
    let dataPrint = document.createElement('div')

    dataPrint.innerHTML= `
    <div class="row">
        <div class="col s4">
            <h6>${destino}</h6>
        </div>
        <div class="col s4">
            <h6>${presupuesto}</h6>
        </div>
        <div class="col s4">
            <h6>${balance}</h6>
        </div>
    </div>
    `
    result.appendChild(dataPrint)

    reset();
}

function reset(){
    document.getElementById('vacacionesCalc').reset()
}


//CARRITO DE COMPRAS

const clickButton = document.querySelectorAll('.button')
const tbody = document.querySelector('.tbody')
let carrito = []

clickButton.forEach(btn => {
    btn.addEventListener('click', addToCarritoItem)
})

function addToCarritoItem(e){
    const button = e.target
    const item = button.closest('.card')
    const itemTitle = item.querySelector('.card-title').textContent;
    const itemPrice = item.querySelector('.precio').textContent;
    const itemImg = item.querySelector('.card-img-top').src;
    
    const newItem = {
        title: itemTitle,
        precio: itemPrice,
        img: itemImg,
        cantidad: 1
    }

    addItemCarrito(newItem)
}

function addItemCarrito(newItem){
    const alert = document.querySelector('.alert')

    setTimeout(function(){
        alert.classList.add('hide')
    }, 2000)
    alert.classList.remove('hide')

    const InputElemnto = tbody.getElementsByClassName('input__elemento')
    for(let i =0; i < carrito.length ; i++){
        if(carrito[i].title.trim() === newItem.title.trim()){
        carrito[i].cantidad ++;
        const inputValue = InputElemnto[i]
        inputValue.value++;
        CarritoTotal()
        return null;
        }
    }
    
    carrito.push(newItem)
    
    renderCarrito()
} 


function renderCarrito(){
    tbody.innerHTML = ''
    carrito.map(item => {
        const tr = document.createElement('tr')
        tr.classList.add('ItemCarrito')
        const Content = `
            <th scope="row">1</th>
            <td >
                <div class="table--destinos">
                    <img src=${item.img}  alt="">
                    <h6 class="title">${item.title}</h6>
                </div
            </td>
            <td class="table--precio"><p>${item.precio}</p></td>
            <td class="table--cantidad">
                <input type="number" min="1" value=${item.cantidad} class="input__elemento">
                <button class="delete btn btn-danger">x</button>
            </td>`
        tr.innerHTML = Content;
        tbody.append(tr)

        tr.querySelector(".delete").addEventListener('click', removeItemCarrito)
        tr.querySelector(".input__elemento").addEventListener('change', sumaCantidad)

    
    })
    CarritoTotal()
}


function CarritoTotal(){
    let Total = 0;
    const itemCartTotal = document.querySelector('.itemCartTotal')
    carrito.forEach((item) => {
        const precio = Number(item.precio.replace("U$S", ''))
        Total = Total + precio*item.cantidad
    })

    itemCartTotal.innerHTML = `Total $${Total}`
    addLocalStorage()
}


function removeItemCarrito(e){
    const buttonDelete = e.target
    const tr = buttonDelete.closest(".ItemCarrito")
    const title = tr.querySelector('.title').textContent;
    for(let i=0; i<carrito.length; i++){
        if(carrito[i].title.trim() === title.trim()){
            carrito.splice(i, 1)
        }
    }
    const alert = document.querySelector('.remove')

    setTimeout(function(){
        alert.classList.add('remove')
    }, 2000)
    alert.classList.remove('remove')

    tr.remove()
    CarritoTotal()
}

function sumaCantidad(e){
    const sumaInput = e.target
    const tr= sumaInput.closest(".ItemCarrito")
    const title = tr.querySelector('.title').textContent;
    carrito.forEach(item => {
        if(item.title.trim() === title){
            sumaInput.value < 1 ? (sumaInput.value = 1) : sumaInput.value;
            item.cantidad = sumaInput.value;
            CarritoTotal()
        }
    })
}

function addLocalStorage(){
    localStorage.setItem('carrito', JSON.stringify(carrito))
}

window.onload = function(){
    const storage = JSON.parse(localStorage.getItem('carrito'));
    if(storage) {
        carrito = storage;
        renderCarrito()
    }
}
