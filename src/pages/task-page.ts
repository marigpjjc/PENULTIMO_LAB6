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
  :host {
    --bg: #fff0f6;
    --text: #5e3366;
    --card-bg: #fbe4ff;
    --accent: #e7b9d9;
    --accent-dark: #d88abf;
    --warning: #ffc2d1;
    --success: #d6ffe0;
    --danger: #ff9aa2;
    font-family: 'Cormorant Garamond', serif;
    display: block;
  }

  .container {
    padding: 2rem;
    color: var(--text);
    background: var(--bg);
    min-height: 100vh;
  }

  .top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  .top-bar h1 {
    color: var(--accent-dark);
    margin: 0;
    font-size: 2.5rem;
  }

  button {
    background: var(--accent);
    color: #fff;
    border: none;
    padding: 0.6rem 1.4rem;
    border-radius: 999px;
    cursor: pointer;
    font-weight: bold;
    font-family: inherit;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }

  button:hover {
    background: var(--accent-dark);
    transform: translateY(-2px);
  }

  #logout-btn {
    background: transparent;
    border: 2px solid var(--accent);
    color: var(--accent-dark);
  }

  .tasks {
    display: grid;
    gap: 2rem;
  }

  .section {
    background: var(--card-bg);
    padding: 1.5rem;
    border-radius: 20px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
  }

  .section h2 {
    margin-top: 0;
    color: var(--accent-dark);
    font-size: 1.8rem;
  }

  .list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .list li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fcdff0;
    margin-bottom: 0.7rem;
    padding: 0.9rem 1.2rem;
    border-radius: 16px;
    box-shadow: inset 0 0 0.5px #ffebf5;
  }

  .list li.done {
    opacity: 0.6;
    text-decoration: line-through;
  }

  .actions {
    display: flex;
    gap: 0.6rem;
  }

  .actions button {
    background: none;
    border: none;
    color: var(--text);
    font-size: 1.3rem;
    cursor: pointer;
    transition: transform 0.2s ease;
  }

  .actions button:hover {
    transform: scale(1.3);
  }

  .empty {
    color: #a68dad;
    text-align: center;
    font-style: italic;
    font-size: 1rem;
  }

  .modal {
    position: fixed;
    inset: 0;
    background: rgba(255, 229, 246, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

.modal-box {
  background: #ffe3f1;
  padding: 2rem;
  border-radius: 16px;
  width: 100%;
  max-width: 360px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  color: var(--text);
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  position: relative;
  border: 2px solid var(--accent);
}


  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .modal-header h2 {
    margin: 0;
    color: var(--accent-dark);
  }

  .close {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: violet;
    cursor: pointer;
  }

  input {
    width: calc(100% - 1rem);
    margin-bottom: 1rem;
    padding: 0.6rem;
    border: 2px solid var(--accent);
    border-radius: 10px;
    background: #fffafc;
    color: var(--text);
    font-size: 1rem;
    font-family: inherit;
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
          <button class="close">x</button>
        </div>
        <input id="title" placeholder="Ponle un nombrecito" required />
        <input id="desc" placeholder="Agrega una descripcion si quieres" />
        <div style="text-align:right">
          <button id="cancel">Cancelar</button>
          <button id="save">Guardar</button>
        </div>
      </div>
    `;
    this.shadowRoot!.appendChild(modal);

    modal.querySelector(".close")!.addEventListener("click", () => modal.remove());
    modal.querySelector("#cancel")!.addEventListener("click", () => modal.remove());

    modal.querySelector("#save")!.addEventListener("click", async () => {
      const title = (modal.querySelector("#title")! as HTMLInputElement).value.trim();
      const desc  = (modal.querySelector("#desc")!  as HTMLInputElement).value.trim();
      if (!title) return alert("El título es obligatorio");
      const uid = localStorage.getItem("userId")!;
      await svcAddTask({ userId: uid, title, description: desc, status: "todo" });
      modal.remove();
    });
  }
}

customElements.define("tasks-page", TasksPage);
export default TasksPage;