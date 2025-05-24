import { TaskType } from "../types/TypesDB";
import {
  subscribeTasksByUser,
  addTask as svcAddTask,
  updateTask as svcUpdateTask,
  deleteTask as svcDeleteTask
} from "../services/firebase/task-service";
import { logoutUser } from "../services/firebase/auth-service";

class TasksPage extends HTMLElement {
  private tasks: TaskType[] = [];
  private unsubscribeTasks?: () => void;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.attachEvents();
    this.startRealtimeSubscription();
  }

  disconnectedCallback() {
    this.unsubscribeTasks?.();
  }

  private render() {
    this.shadowRoot!.innerHTML = `
     <style>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

:host {
  --retro-pink-light: #ffb6c1;
  --retro-pink-dark: #d1477f;
  --retro-bg: #ffe4f0;
  --retro-card-bg: #ffdaf0;
  --retro-text-dark: #5b2245;
  --retro-text-light: #fff0f6;
  --retro-accent: #f46ea6;

  font-family: 'Press Start 2P', cursive;
  display: block;
  background: var(--retro-bg);
  min-height: 100vh;
  padding: 2rem;
  box-sizing: border-box;
  color: var(--retro-text-dark);
}

.container {
  max-width: 900px;
  margin: 0 auto;
  background: var(--retro-card-bg);
  padding: 2rem;
  border: 8px double var(--retro-pink-dark);
  border-radius: 20px;
  box-shadow:
    inset 0 0 10px var(--retro-pink-dark),
    0 0 20px var(--retro-pink-light);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.top-bar {
  grid-column: 1 / -1;
  background: var(--retro-pink-dark);
  padding: 1.5rem 2rem;
  border-radius: 15px;
  box-shadow: 0 0 15px var(--retro-pink-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--retro-text-light);
  font-size: 1rem;
  text-shadow: 2px 2px 4px #a23168;
  letter-spacing: 1px;
  font-family: 'Press Start 2P', cursive;
  gap: 10.3rem;
}

button {
  background: transparent;
  color: var(--retro-accent);
  border: 3px solid var(--retro-pink-dark);
  padding: 0.75rem 1.5rem;
  font-size: 0.9rem;
  border-radius: 10px;
  cursor: pointer;
  box-shadow:
    0 0 5px var(--retro-pink-dark),
    inset 0 0 10px var(--retro-pink-light);
  transition: 0.3s ease all;
  font-family: 'Press Start 2P', cursive;
}

button:hover {
  background: var(--retro-pink-dark);
  color: var(--retro-text-light);
  box-shadow:
    0 0 15px var(--retro-pink-light),
    inset 0 0 20px var(--retro-pink-light);
  transform: scale(1.05) rotate(-2deg);
}

#logout-btn {
  border-color: var(--retro-accent);
  color: var(--retro-accent);
  box-shadow: 0 0 8px var(--retro-accent);
}

#logout-btn:hover {
  background: var(--retro-accent);
  color: var(--retro-text-light);
  box-shadow: 0 0 15px var(--retro-accent);
}

.tasks {
  display: grid;
  gap: 2.3rem;
  width: 800px;
}

.section {
  background: var(--retro-bg);
  border: 4px dotted var(--retro-pink-dark);
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: inset 3px 3px 8px #ffd3ec, inset -3px -3px 8px #ffabe1;
  display: flex;
  flex-direction: column;
  min-height: 300px;
}

.section h2 {
  font-family: 'Press Start 2P', cursive;
  font-size: 1rem;
  color: var(--retro-pink-dark);
  text-align: center;
  margin-bottom: 1.5rem;
  text-shadow: 1px 1px 2px #a23168;
}

.list {
  list-style: none;
  padding: 0;
  margin: 0;
  overflow-y: auto;
  flex-grow: 1;
}

.list li {
  background: linear-gradient(135deg, #ffafd4 0%, #ffcce3 100%);
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 12px;
  box-shadow:
    3px 3px 5px #c85b82,
    inset 0 0 8px #fff0f6;
  font-family: 'Press Start 2P', cursive;
  font-size: 0.8rem;
  color: var(--retro-text-dark);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 2px solid var(--retro-pink-dark);
  transition: background 0.3s ease;
  cursor: pointer;
}

.list li:hover {
  background: linear-gradient(135deg, #f993c0 0%, #ffb6d1 100%);
  box-shadow:
    0 0 15px #ff8cc1,
    inset 0 0 10px #ffd3ec;
}

.list li.done {
  filter: grayscale(70%) contrast(0.8);
  text-decoration: line-through;
  opacity: 0.7;
  cursor: default;
}

.actions {
  display: flex;
  gap: 0.7rem;
}

.actions button {
  background: var(--retro-pink-dark);
  border-radius: 6px;
  border: none;
  color: var(--retro-text-light);
  font-size: 0.9rem;
  padding: 0.5rem 0.8rem;
  box-shadow:
    0 0 5px #ff8cc1,
    inset 0 0 8px #ffbad1;
  transition: transform 0.2s ease, box-shadow 0.3s ease;
}

.actions button:hover {
  transform: scale(1.2) rotate(-8deg);
  box-shadow:
    0 0 15px #ff8cc1,
    inset 0 0 12px #ffbad1;
}

.empty {
  color: var(--retro-pink-dark);
  font-style: italic;
  font-size: 0.7rem;
  text-align: center;
  margin-top: 1rem;
}

.modal {
  position: fixed;
  inset: 0;
  background: rgba(255, 182, 193, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-box {
  background: var(--retro-card-bg);
  border: 5px dotted var(--retro-pink-dark);
  border-radius: 25px;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  box-shadow:
    0 0 25px var(--retro-pink-light),
    inset 0 0 20px #ffb6c1;
  color: var(--retro-pink-dark);
  font-family: 'Press Start 2P', cursive;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  position: relative;
}

.modal-header {
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 2px dashed var(--retro-pink-dark);
  padding-bottom: 0.5rem;
}

.modal-header h2 {
  font-family: 'Press Start 2P', cursive;
  font-size: 1rem;
  color: var(--retro-pink-dark);
  text-shadow: 1px 1px 2px #a23168;
  margin: 0;
}

.close {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: var(--retro-pink-dark);
  cursor: pointer;
  text-shadow: 0 0 10px #ff77aa;
  transition: color 0.3s ease;
}

.close:hover {
  color: var(--retro-pink-light);
}

input {
  width: 90%;
  padding: 0.8rem 1rem;
  border: 3px double var(--retro-pink-dark);
  border-radius: 15px;
  background: var(--retro-bg);
  font-family: 'Press Start 2P', cursive;
  font-size: 0.7rem;
  color: var(--retro-pink-dark);
  box-shadow:
    inset 1px 1px 5px #fff0f6,
    0 0 8px var(--retro-pink-light);
  outline: none;
  transition: box-shadow 0.3s ease;
}

input:focus {
  box-shadow:
    0 0 12px var(--retro-pink-dark),
    inset 0 0 15px var(--retro-pink-light);
}
</style>


      <div class="container">
        <div class="top-bar">
          <h1>Tareas</h1>
          <div>
            <button id="add-btn">Nueva Tarea</button>
            <button id="logout-btn">Logout</button>
          </div>
        </div>

        <div class="tasks">
          <div class="section" id="pending-section">
            <h2>Pendientes</h2>
            <ul class="list" id="pending-list"></ul>
          </div>
          <div class="section" id="completed-section">
            <h2>Completadas</h2>
            <ul class="list" id="completed-list"></ul>
          </div>
        </div>
      </div>
    `;
  }

  private attachEvents() {
    this.shadowRoot!.getElementById("add-btn")!
      .addEventListener("click", () => this.showModal());
    this.shadowRoot!.getElementById("logout-btn")!
      .addEventListener("click", async () => {
        await logoutUser();
        this.unsubscribeTasks?.();
        window.location.href = "/";
      });
  }

  private startRealtimeSubscription() {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    this.unsubscribeTasks = subscribeTasksByUser(userId, tasks => {
      this.tasks = tasks;
      this.renderTasks();
    });
  }

  private renderTasks() {
    const pendEl = this.shadowRoot!.getElementById("pending-list") as HTMLUListElement;
    const compEl = this.shadowRoot!.getElementById("completed-list") as HTMLUListElement;

    const pending = this.tasks.filter(t => t.status !== "completed");
    const completed = this.tasks.filter(t => t.status === "completed");

    pendEl.innerHTML = pending.length
      ? pending.map(t => this.taskItemHTML(t, false)).join("")
      : `<li class="empty">No hay tareas pendientes</li>`;

    compEl.innerHTML = completed.length
      ? completed.map(t => this.taskItemHTML(t, true)).join("")
      : `<li class="empty">No hay tareas completadas</li>`;

    this.shadowRoot!.querySelectorAll(".btn-complete").forEach(btn => {
      btn.addEventListener("click", e => {
        const id = (e.currentTarget as HTMLElement).dataset.id!;
        this.toggleStatus(id);
      });
    });
    this.shadowRoot!.querySelectorAll(".btn-delete").forEach(btn => {
      btn.addEventListener("click", e => {
        const id = (e.currentTarget as HTMLElement).dataset.id!;
        this.deleteTask(id);
      });
    });
  }

  private taskItemHTML(task: TaskType, done: boolean) {
    return `
      <li class="${done ? "done" : ""}">
        <span>${task.title}</span>
        <div class="actions">
          <button class="btn-complete" data-id="${task.id}" title="${done ? "Desmarcar" : "Marcar completa"}">
            ${done ? "↺" : "✓"}
          </button>
          <button class="btn-delete" data-id="${task.id}" title="Eliminar">x</button>
        </div>
      </li>
    `;
  }

  private async toggleStatus(id: string) {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return;
    const next = task.status === "completed" ? "todo" : "completed";
    const ok = await svcUpdateTask(id, { status: next });
    if (!ok) console.error("Error al actualizar estado");
  }

  private async deleteTask(id: string) {
    const ok = await svcDeleteTask(id);
    if (!ok) console.error("Error al eliminar tarea");
  }

  private showModal() {
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `
      <div class="modal-box">
        <div class="modal-header">
          <h2>Nueva tarea</h2>
        </div>
        <input id="title" placeholder="Escribe tu tarea" required />
        <div style="text-align:center">
          <button id="cancel">Cancelar</button>
          <button id="save">Guardar</button>
        </div>
      </div>
    `;
    this.shadowRoot!.appendChild(modal);

    modal.querySelector("#cancel")!.addEventListener("click", () => modal.remove());
    modal.querySelector("#save")!.addEventListener("click", async () => {
      const title = (modal.querySelector("#title")! as HTMLInputElement).value.trim();
      if (!title) return alert("El campo es obligatorio");
      const uid = localStorage.getItem("userId")!;
      await svcAddTask({ userId: uid, title, completed: "", description: "", status: "todo" });
      modal.remove();
    });
  }
}

customElements.define("tasks-page", TasksPage);
export default TasksPage;