// Array global para almacenar tareas (solo mientras la página esté abierta)
let tareas = [];

// Mostrar/ocultar formulario
document.addEventListener("DOMContentLoaded", function () {
  const botonMostrar = document.getElementById("btn-mostrar");
  const botonOcultar = document.getElementById("btn-ocultar");
  const contenedor = document.getElementById("inputs-container");

  botonMostrar.addEventListener("click", () => contenedor.style.display = "block");
  botonOcultar.addEventListener("click", () => contenedor.style.display = "none");
});

// Guardar tarea (pero no en localStorage)
function guardar_info() {
  const titulo = document.getElementById("titulo").value;
  const descripcion = document.getElementById("descripcion").value;
  const estadoSeleccionado = document.querySelector('input[name="estado"]:checked');
  const estado = estadoSeleccionado ? estadoSeleccionado.value : "pendiente";

  const tarea = {
    id: Date.now(),
    titulo,
    descripcion,
    estado
  };

  tareas.push(tarea); // Agrega a la lista en memoria (no se guarda)
  agregarTareaAlDOM(tarea);
  limpiarInputs();
}

// Agregar tarea al DOM
function agregarTareaAlDOM(tarea) {
  const contenedor = document.getElementById(`lista_${tarea.estado}`);
  const div = document.createElement("div");
  div.className = `tarea ${tarea.estado}`;
  div.setAttribute("data-id", tarea.id);
  div.innerHTML = `
    <strong>${tarea.titulo}</strong>
    <p>${tarea.descripcion}</p>
    ${tarea.estado === "pendiente" ? `
      <button onclick="moverAEnProceso(${tarea.id})">En proceso</button>
    ` : tarea.estado === "en_proceso" ? `
      <button onclick="marcarComoTerminada(${tarea.id})">Terminar</button>
    ` : `
      <button onclick="eliminarTarea(${tarea.id})">🗑 Eliminar</button>
    `}
  `;
  contenedor.appendChild(div);
}

// Cambiar estado de las tareas (pero no se guardan)
function moverAEnProceso(id) {
  const tarea = tareas.find(t => t.id === id);
  if (tarea) {
    tarea.estado = "en_proceso";
    recargarTareas();
  }
}

function marcarComoTerminada(id) {
  const tarea = tareas.find(t => t.id === id);
  if (tarea) {
    tarea.estado = "terminado";
    recargarTareas();
  }
}

// Eliminar tarea
function eliminarTarea(id) {
  tareas = tareas.filter(t => t.id !== id);
  recargarTareas();
}

// Actualizar la lista en pantalla
function recargarTareas() {
  document.getElementById("lista_pendiente").innerHTML = "";
  document.getElementById("lista_en_proceso").innerHTML = "";
  document.getElementById("lista_terminado").innerHTML = "";
  tareas.forEach(tarea => agregarTareaAlDOM(tarea));
}

// Limpiar formulario
function limpiarInputs() {
  document.getElementById("titulo").value = "";
  document.getElementById("descripcion").value = "";
  document.getElementById("pendiente").checked = true;
}
