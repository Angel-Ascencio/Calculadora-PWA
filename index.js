let pantalla = document.getElementById('pantalla');
let actual = '0.0';
let signo = '';
let anterior = '';
let reiniciar = false;
let mostrando = false;

function mostrar() {
    pantalla.textContent = actual;
    pantalla.parentElement.scrollLeft = pantalla.parentElement.scrollWidth;
}

function borrar() {
    actual = '0.0';
    signo = '';
    anterior = '';
    reiniciar = false;
    mostrando = false;
    mostrar();
}

function retroceso() {
    // Si solo queda un numero reinicia todo
    if (actual.length <= 1) {
        actual = '0';
        mostrando = false;
        reiniciar = false;
        signo = '';
        anterior = '';
        mostrar();
        return;
    }

    if (signo && mostrando) {
        let pos = actual.indexOf(signo);
        let segundo = actual.substring(pos + 1);

        if (segundo.length > 0) {
            actual = actual.slice(0, -1);
        } else {
            actual = anterior;
            signo = '';
            mostrando = false;
        }
    } else {
        actual = actual.slice(0, -1);
    }

    mostrar();
}

function numero(num) {
    if (mostrando) {
        actual += num;
    } else if (reiniciar) {
        actual = num;
        reiniciar = false;
    } else if (actual === '0' || actual === '0.0') {
        actual = num;
    } else {
        actual += num;
    }
    mostrar();
}

function punto() {
    if (reiniciar) {
        actual = '0';
        reiniciar = false;
        mostrando = false;
    }

    let ultimoNumero = actual;
    if (signo && mostrando) {
        let pos = actual.indexOf(signo);
        ultimoNumero = actual.substring(pos + 1);
    }

    if (!ultimoNumero.includes('.')) {
        actual += '.';
        mostrar();
    }
}


function operador(op) {
    if (signo && !reiniciar && !mostrando) {
        igual();
    }
    
    signo = op;
    anterior = actual;
    actual = anterior + op;
    mostrando = true;
    reiniciar = false;
    mostrar();
}

function igual() {
    if (signo && anterior) {
        let prev = parseFloat(anterior);
        let num;

        if (mostrando) {
            let texto = actual;
            let pos = texto.indexOf(signo);
            let segundo = texto.substring(pos + 1);
            num = parseFloat(segundo) || 0;
        } else {
            num = parseFloat(actual);
        }

        let resultado;
        switch (signo) {
            case '+': resultado = prev + num; break;
            case '−': resultado = prev - num; break;
            case '×': resultado = prev * num; break;
            case '÷': resultado = num !== 0 ? prev / num : 'Error'; break;
            default: return;
        }

        // Redondear a 3 decimales
        if (typeof resultado === 'number') {
            resultado = Math.round(resultado * 1000) / 1000;
        }

        actual = resultado.toString();
        signo = '';
        anterior = '';
        reiniciar = true;
        mostrando = false;
        mostrar();
    }
}

// Soporte para teclado
document.addEventListener('keydown', function(e) {
    const tecla = e.key;
    
    if (tecla >= '0' && tecla <= '9') {
        numero(tecla);
    } else if (tecla === '.') {
        punto();
    } else if (tecla === '+') {
        operador('+');
    } else if (tecla === '-') {
        operador('−');
    } else if (tecla === '*') {
        operador('×');
    } else if (tecla === '/') {
        e.preventDefault();
        operador('÷');
    } else if (tecla === 'Enter' || tecla === '=') {
        igual();
    } else if (tecla === 'Escape') {
        borrar();
    } else if (tecla === 'Backspace') {
        retroceso();
    }
});
