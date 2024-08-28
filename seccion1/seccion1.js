let stn1 = document.querySelector(".seccion1");

stn1.innerHTML = `

<div class="header">
    <div class="logo">
        <img src="https://static.wixstatic.com/media/d1b317_4fe70cb66f9447c3991ad4cb8d7294d3~mv2.png/v1/fit/w_2500,h_1330,al_c/d1b317_4fe70cb66f9447c3991ad4cb8d7294d3~mv2.png" alt="Menu">
    </div>
    <div class="title">
        <h2>Multitasking</h2>
    </div>
    <div class="busqueda">
        <input type="text" id="searchInput" placeholder="Buscar">
    </div>
    
    <div class="buttons">
        <button class="add_tarea">+</button>
        <div> <<< Agregar tarea</div>
    </div>
</div>

<div class="task-header">
    <span>Nombre de la Tarea</span>
    <span>Persona a cargo </span>
    <span>Fecha de entrega</span>
    <span>Estado</span>
</div>

<div class="modal" id="modalForm">
    <div class="modal-content">
        <span class="close" id="closeModal">&times;</span>
        <h2>Nueva Tarea</h2>
        <form id="taskForm">
            <label for="taskName">Nombre de la tarea:</label>
            <input type="text" id="taskName" name="taskName" required>
            
            <label for="assignedTo">Persona a cargo:</label>
            <input type="text" id="assignedTo" name="assignedTo" required>

            <label for="dueDate">Fecha de culminación:</label>
            <input type="date" id="dueDate" name="dueDate" required>

            <label for="taskStatus">Estado de la tarea:</label>
            <select id="taskStatus" name="taskStatus">
                <option value="Sin asignar">Sin asignar</option>
                <option value="Asignado">Asignado</option>
                <option value="Completado">Completado</option>
                <option value="Completado con retraso">Completado con retraso</option>
                <option value="No presentado">No presentado</option>
            </select>

            <button type="submit">Crear tarea</button>
        </form>
    </div>
</div>
`;

let addTareaButton = document.querySelector(".add_tarea");
let modal = document.getElementById("modalForm");
let btncerrado = document.getElementById("closeModal");
let searchInput = document.getElementById("searchInput");
let seccion2 = document.querySelector(".seccion2");

// Abrir div
addTareaButton.addEventListener("click", () => {
    modal.style.display = "flex";
});

// Cerrar div
btncerrado.addEventListener("click", () => {
    modal.style.display = "none";
});

// Cerrar div si se hace clic afuera
window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

// Función para cargar las tareas guardadas
function cargarTareas() {
    let tareasGuardadas = JSON.parse(localStorage.getItem("tareas")) || [];
    tareasGuardadas.forEach(tarea => {
        crearTaskItem(tarea);
    });
}

// Crear un elemento de tarea y agregarlo a la sección
function crearTaskItem(tarea) {
    let taskItem = document.createElement("div");
    taskItem.classList.add("task-item");
    taskItem.innerHTML = `
        <span class="nombre">${tarea.taskName}</span>
        <span class="asignado">${tarea.assignedTo}</span>
        <span class="fecha">${tarea.dueDate}</span>
        <span class="estado">${tarea.taskStatus}</span>
        <button class="delete-task">X</button>
    `;

    // Agregar evento de eliminación
    taskItem.querySelector(".delete-task").addEventListener("click", function() {
        taskItem.remove();

        let tareasGuardadas = JSON.parse(localStorage.getItem("tareas")) || [];
        tareasGuardadas = tareasGuardadas.filter(t => {
            return !(t.taskName === tarea.taskName && t.assignedTo === tarea.assignedTo && t.dueDate === tarea.dueDate && t.taskStatus === tarea.taskStatus);
        });
        localStorage.setItem("tareas", JSON.stringify(tareasGuardadas));
    });

    seccion2.appendChild(taskItem);
}

// Filtrar las tareas según el término de búsqueda
function filtrarTareas() {
    let searchTerm = searchInput.value.toLowerCase();
    let taskItems = document.querySelectorAll(".task-item");

    taskItems.forEach(item => {
        let nombre = item.querySelector(".nombre").textContent.toLowerCase();
        let asignado = item.querySelector(".asignado").textContent.toLowerCase();
        
        if (nombre.includes(searchTerm) || asignado.includes(searchTerm)) {
            item.style.display = "flex"; // Mostrar tarea
        } else {
            item.style.display = "none"; // Ocultar tarea
        }
    });
}

// Cargar las tareas al iniciar
window.onload = cargarTareas;

// Agregar la tarea a seccion2 
document.getElementById("taskForm").addEventListener("submit", function(event) {
    event.preventDefault(); // para que no se recargue

    // Obtener info del formulario
    let taskName = document.getElementById("taskName").value;
    let assignedTo = document.getElementById("assignedTo").value;
    let dueDate = document.getElementById("dueDate").value;
    let taskStatus = document.getElementById("taskStatus").value;

    // Crear un nuevo div para la tarea
    let tarea = { taskName, assignedTo, dueDate, taskStatus };
    crearTaskItem(tarea);

    // Guardar tarea en localStorage
    let tareasGuardadas = JSON.parse(localStorage.getItem("tareas")) || [];
    tareasGuardadas.push(tarea);
    localStorage.setItem("tareas", JSON.stringify(tareasGuardadas));

    // Cerrar la modal y reiniciar el formulario
    modal.style.display = "none";
    document.getElementById("taskForm").reset();
});

// Agregar evento de búsqueda
searchInput.addEventListener("input", filtrarTareas);
