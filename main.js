document.addEventListener("DOMContentLoaded", function () {
  const boton = document.getElementById("btn-mostrar");
  const contenedor = document.getElementById("inputs-container");

  boton.addEventListener("click", function () {
    contenedor.style.display = "block";
  });

  mostrarTareasGuardadas();
});

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

  const tareas = obtenerTareas();
  tareas.push(tarea);
  localStorage.setItem("tareas", JSON.stringify(tareas));

  agregarTareaAlDOM(tarea);
  limpiarInputs();
}

function obtenerTareas() {
  return JSON.parse(localStorage.getItem("tareas")) || [];
}

function mostrarTareasGuardadas() {
  const tareas = obtenerTareas();
  tareas.forEach(tarea => agregarTareaAlDOM(tarea));
}

//esta funcion sirvi para agregar las tareas al DOM
function agregarTareaAlDOM(tarea) {
  const contenedor = document.getElementById(`lista_${tarea.estado}`);
  const div = document.createElement("div");
  div.className = `tarea ${tarea.estado}`;
  div.setAttribute("data-id", tarea.id);
  div.innerHTML = `
    <strong>${tarea.titulo}</strong>
    <p>${tarea.descripcion}</p>
    ${tarea.estado === "pendiente" ? `
      <button onclick="moverAEnProceso(${tarea.id})"> En proceso</button>
    ` : tarea.estado === "en_proceso" ? `
      <button onclick="marcarComoTerminada(${tarea.id})"> Terminar</button>
    ` : `
      <button onclick="eliminarTarea(${tarea.id})">🗑 Eliminar</button>
    `}
  `;
  contenedor.appendChild(div);
}

function moverAEnProceso(id) {
  let tareas = obtenerTareas();
  const index = tareas.findIndex(t => t.id === id);
  if (index !== -1) {
    tareas[index].estado = "en_proceso";
    localStorage.setItem("tareas", JSON.stringify(tareas));
    recargarTareas();
  }
}

function marcarComoTerminada(id) {
  let tareas = obtenerTareas();
  const index = tareas.findIndex(t => t.id === id);
  if (index !== -1) {
    tareas[index].estado = "terminado";
    localStorage.setItem("tareas", JSON.stringify(tareas));
    recargarTareas();
  }
}

function eliminarTarea(id) {
  let tareas = obtenerTareas().filter(t => t.id !== id);
  localStorage.setItem("tareas", JSON.stringify(tareas));
  recargarTareas();
}

function recargarTareas() {
  document.getElementById("lista_pendiente").innerHTML = "";
  document.getElementById("lista_en_proceso").innerHTML = "";
  document.getElementById("lista_terminado").innerHTML = "";
  mostrarTareasGuardadas();
}

function limpiarInputs() {
  document.getElementById("titulo").value = "";
  document.getElementById("descripcion").value = "";
  document.getElementById("pendiente").checked = true;
}
