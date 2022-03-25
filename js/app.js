/*window.onload = () => {
    alert(`JavaScript Works 1`);
};*/

var inrice = document.getElementById(`inputtext`);
var outwater = document.getElementById(`outputtext`);
document.getElementById(`quantityrice`).hidden = true;
document.getElementById(`quantitywater`).hidden = true;
let white = false;
let seleccionar = document.querySelector(`select`);
seleccionar.addEventListener(`change`, ricechoice);
document.getElementById(`inputtext`).onkeydown = function() {handle(event);};
document.getElementById('inputtext').title =
   'Introduce cups of rice, you can use arrows keys to increase or decrease';
   
function ricechoice() {
    let eleccion = seleccionar.value;

    if (eleccion === `whiterice`) {
        document.getElementById(`opciones`).innerHTML =
        document.getElementById(`whiterice`).innerHTML;
        white = true;
        inrice.value = ``;
        outwater.value = ``;
    }
    else {
        document.getElementById(`opciones`).innerHTML =
        document.getElementById(`sproutedcaliforniarice`).innerHTML;
        white = false;
        inrice.value = ``;
        outwater.value = ``;
    }
    document.getElementById(`quantityrice`).hidden = false;
    document.getElementById(`quantitywater`).hidden = false;
    document.getElementById(`inputtext`).focus();
}

function handle(e){
    var key=e.keyCode || e.which;
    if (key== 38) {
        if (inrice.value == ``) inrice.value = 1;
        else inrice.value++;
        calculationwater();
    }
    else if (key== 40) {
        if (inrice.value == ``) inrice.value = 0;
        else {
            if (inrice.value != 0) inrice.value--;
        }
        calculationwater();
    }
}

function calculationwater() {
    if (white) {
        outwater.value = inrice.value*2;
    }
    else {
        outwater.value = (inrice.value*2)/1.25;
    }
}
