```javascript
// --- Lógica para la Evaluación (Quiz) ---
const respuestasCorrectas = {
    p1: "b",
    p2: "b",
    p3: "c",
    p4: "b",
    p5: "c",
    p6: "b",
    p7: "b",
    p8: "b",
    p9: "b",
    p10: "c"
};

function calcularResultado() {
    let puntaje = 0;
    const form = document.getElementById("quizForm");
    const resultadoDiv = document.getElementById("resultadoQuiz");
    const totalPreguntas = Object.keys(respuestasCorrectas).length;

    for (const pregunta in respuestasCorrectas) {
        const respuestaSeleccionada = form.elements[pregunta].value;
        if (respuestaSeleccionada === respuestasCorrectas[pregunta]) {
            puntaje++;
        }
    }

    const nota = (puntaje / totalPreguntas) * 100;
    resultadoDiv.innerHTML = `Tu nota es: ${nota.toFixed(0)}% (${puntaje} de ${totalPreguntas} correctas).`;

    if (nota >= 70) {
        resultadoDiv.innerHTML += "<br>¡Felicidades! Has aprobado este módulo.";
        document.getElementById("btnSiguienteModulo").style.display = "inline-block";
        // Guardar estado de aprobación en localStorage (para GitHub Pages)
        localStorage.setItem("modulo1_aprobado", "true");
        localStorage.setItem("modulo1_nota", nota.toFixed(0));
    } else {
        resultadoDiv.innerHTML += "<br>Necesitas al menos 70% para aprobar. ¡Inténtalo de nuevo!";
        document.getElementById("btnSiguienteModulo").style.display = "none";
        localStorage.setItem("modulo1_aprobado", "false");
        localStorage.setItem("modulo1_nota", nota.toFixed(0));
    }
}

function irAlSiguienteModulo() {
    // Redirigir al Módulo 2. Cambia 'modulo2.html' por el nombre de tu siguiente archivo.
    window.location.href = "modulo2.html";
}

// Verificar al cargar la página si el módulo ya fue aprobado
window.onload = function() {
    if (localStorage.getItem("modulo1_aprobado") === "true") {
        document.getElementById("btnSiguienteModulo").style.display = "inline-block";
        const notaGuardada = localStorage.getItem("modulo1_nota");
        if (notaGuardada) {
             // Opcional: Mostrar un mensaje si ya estaba aprobado
            const resultadoDiv = document.getElementById("resultadoQuiz");
            if (resultadoDiv) { // Asegurarse que el div existe
                 resultadoDiv.innerHTML = `Ya has aprobado este módulo anteriormente con ${notaGuardada}%.`;
            }
        }
    }
};


// --- Lógica para el Juego de Clasificación ---
const equiposData = {
    "eq1": { nombre: "Computadora", categoriaCorrecta: "tecnologico" },
    "eq2": { nombre: "Archivador Metálico", categoriaCorrecta: "tecnico" },
    "eq3": { nombre: "Impresora Multifuncional", categoriaCorrecta: "tecnologico" },
    "eq4": { nombre: "Engrapadora", categoriaCorrecta: "tecnico" },
    "eq5": { nombre: "Software Contable", categoriaCorrecta: "tecnologico" }, // Considerado parte de un sistema tecnológico
    "eq6": { nombre: "Calculadora Básica", categoriaCorrecta: "tecnico" }
};

let equiposArrastrados = {}; // Para guardar dónde se soltó cada equipo: { eq1: "tecnico", eq2: "tecnologico" ... }

document.addEventListener('DOMContentLoaded', () => {
    const equiposItems = document.querySelectorAll('.equipo-item');
    const categoriasDestino = document.querySelectorAll('.categoria-destino');

    equiposItems.forEach(item => {
        item.addEventListener('dragstart', dragStart);
        // Para click en móviles donde drag and drop es menos intuitivo
        item.addEventListener('click', handleClickAsignar);
    });

    categoriasDestino.forEach(categoria => {
        categoria.addEventListener('dragover', dragOver);
        categoria.addEventListener('dragleave', dragLeave);
        categoria.addEventListener('drop', drop);
    });
});

let draggedItem = null;
let itemOriginalParent = null;

function dragStart(e) {
    draggedItem = e.target;
    itemOriginalParent = e.target.parentNode; // Guardar el contenedor original
    setTimeout(() => {
        // e.target.style.display = 'none'; // Ocultar mientras se arrastra
    }, 0);
}

function dragOver(e) {
    e.preventDefault();
    e.target.closest('.categoria-destino').classList.add('hover');
}

function dragLeave(e) {
    e.target.closest('.categoria-destino').classList.remove('hover');
}

function drop(e) {
    e.preventDefault();
    const targetCategoriaDiv = e.target.closest('.categoria-destino');
    targetCategoriaDiv.classList.remove('hover');

    if (draggedItem && targetCategoriaDiv) {
        // Mover el elemento
        targetCategoriaDiv.appendChild(draggedItem);
        // Registrar dónde se soltó
        equiposArrastrados[draggedItem.id] = targetCategoriaDiv.dataset.categoria;
    }
    // draggedItem.style.display = 'block'; // Hacer visible de nuevo
    draggedItem = null;
}

// Lógica para manejar clic en lugar de arrastrar
let itemSeleccionadoParaAsignar = null;

function handleClickAsignar(e) {
    const equipoClickeado = e.target.closest('.equipo-item');
    if (itemSeleccionadoParaAsignar === equipoClickeado) {
        // Deseleccionar si se hace clic de nuevo en el mismo
        equipoClickeado.style.border = "1px solid #b3d7ff";
        itemSeleccionadoParaAsignar = null;
    } else {
        // Deseleccionar el anterior si existe
        if (itemSeleccionadoParaAsignar) {
            itemSeleccionadoParaAsignar.style.border = "1px solid #b3d7ff";
        }
        // Seleccionar el nuevo
        itemSeleccionadoParaAsignar = equipoClickeado;
        itemSeleccionadoParaAsignar.style.border = "2px solid #007bff"; // Resaltar seleccionado
    }
}

document.querySelectorAll('.categoria-destino').forEach(categoriaDiv => {
    categoriaDiv.addEventListener('click', function(e) {
        if (itemSeleccionadoParaAsignar) {
            const targetCategoriaDiv = e.target.closest('.categoria-destino');
            targetCategoriaDiv.appendChild(itemSeleccionadoParaAsignar);
            equiposArrastrados[itemSeleccionadoParaAsignar.id] = targetCategoriaDiv.dataset.categoria;
            
            itemSeleccionadoParaAsignar.style.border = "1px solid #b3d7ff"; // Quitar resaltado
            itemSeleccionadoParaAsignar = null; // Limpiar selección
        }
    });
});


function verificarJuegoClasificacion() {
    let correctos = 0;
    let totalJuego = Object.keys(equiposData).length;
    let feedback = "Resultados del juego:<br>";

    for (const equipoId in equiposData) {
        const equipoInfo = equiposData[equipoId];
        const categoriaAsignada = equiposArrastrados[equipoId];

        feedback += `${equipoInfo.nombre}: Asignado a ${categoriaAsignada || "No asignado"}. `;
        if (categoriaAsignada === equipoInfo.categoriaCorrecta) {
            correctos++;
            feedback += "<span style='color:green;'>¡Correcto!</span><br>";
        } else {
            feedback += `<span style='color:red;'>Incorrecto (era ${equipoInfo.categoriaCorrecta})</span><br>`;
        }
    }

    feedback += `<br>Obtuviste ${correctos} de ${totalJuego} clasificaciones correctas.`;
    document.getElementById("resultadoJuego").innerHTML = feedback;
}
