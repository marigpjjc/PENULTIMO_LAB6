class TaskStatus extends HTMLElement {
  private tasks: TaskItem[] = [];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["status"];
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.loadTasks();
  }

  attributeChangedCallback() {
    if (this.shadowRoot) this.render();
  }

  get status() {
    return this.getAttribute("status") || "pending";
  }

  setupEventListeners() {
    document.addEventListener("task-added", ((e: CustomEvent) => {
      if (this.status === "pending") this.addTask(e.detail.task);
    }) as EventListener);

    this.shadowRoot?.addEventListener("task-toggle-complete", ((e: CustomEvent) => {
      this.toggleTaskComplete(e.detail.taskId);
    }) as EventListener);

    this.shadowRoot?.addEventListener("task-delete", ((e: CustomEvent) => {
      this.deleteTask(e.detail.taskId);
    }) as EventListener);

    const container = this.shadowRoot?.querySelector(".task-zone");
    container?.addEventListener("dragover", (e) => {
      e.preventDefault();
      container.classList.add("highlight-drop");
    });

    container?.addEventListener("dragleave", () => {
      container.classList.remove("highlight-drop");
    });

    container?.addEventListener("drop", ((e: DragEvent) => {
      e.preventDefault();
      container.classList.remove("highlight-drop");
      const taskId = e.dataTransfer?.getData("text/plain");
      if (taskId) this.moveTaskToStatus(taskId, this.status);
    }) as EventListener);
  }

  loadTasks() {
    const raw = localStorage.getItem("tasks");
    if (raw) {
      const all = JSON.parse(raw);
      this.tasks = this.filterTasksByStatus(all);
      this.render();
    }
  }

  filterTasksByStatus(allTasks: TaskItem[]) {
    const s = this.status;
    return allTasks.filter(t =>
      (s === "pending" && !t.completed && !t.inProgress && !t.inReview) ||
      (s === "in-progress" && t.inProgress && !t.completed && !t.inReview) ||
      (s === "review" && t.inReview && !t.completed) ||
      (s === "completed" && t.completed)
    );
  }

  saveTasks() {
    const saved = localStorage.getItem("tasks");
    let all: TaskItem[] = saved ? JSON.parse(saved) : [];

    all = all.filter(t => {
      const s = this.status;
      return (
        (s === "pending" && (t.inProgress || t.inReview || t.completed)) ||
        (s === "in-progress" && (!t.inProgress || t.inReview || t.completed)) ||
        (s === "review" && (!t.inReview || t.completed)) ||
        (s === "completed" && !t.completed)
      );
    });

    localStorage.setItem("tasks", JSON.stringify([...all, ...this.tasks]));
  }

  addTask(task: TaskItem) {
    const s = this.status;
    task.inProgress = s === "in-progress";
    task.inReview = s === "review";
    task.completed = s === "completed";
    this.tasks.push(task);
    this.saveTasks();
    this.render();
  }

  toggleTaskComplete(id: string) {
    this.tasks = this.tasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    this.saveTasks();
    this.render();
  }

  deleteTask(id: string) {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.saveTasks();
    this.render();
  }

  moveTaskToStatus(taskId: string, status: string) {
    const raw = localStorage.getItem("tasks");
    if (!raw) return;
    const all: TaskItem[] = JSON.parse(raw);
    const task = all.find(t => t.id === taskId);
    if (!task) return;

    task.inProgress = status === "in-progress";
    task.inReview = status === "review";
    task.completed = status === "completed";
    if (status === "pending") {
      task.inProgress = task.inReview = task.completed = false;
    }

    localStorage.setItem("tasks", JSON.stringify(all));
    document.dispatchEvent(new CustomEvent("tasks-updated"));
    this.loadTasks();
  }

  render() {
    if (!this.shadowRoot) return;

    const pending = this.tasks.filter(t => !t.completed);
    const done = this.tasks.filter(t => t.completed);

    this.shadowRoot.innerHTML = `
     <style>
      :host {
        display: block;
        font-family: 'Courier New', monospace;
        font-style: italic;
        color: #662244;
      }
      .task-zone {
        background: #fff0f6;
        border: 3px dotted #f8c8dc;
        border-radius: 1.5rem;
        padding: 2rem;
        box-shadow: 0 0 10px #fbc6e2;
      }
      .section {
        background: #fffdfd;
        border: 2px dashed #ffb6c1;
        border-radius: 1rem;
        padding: 1.2rem;
        margin-bottom: 2rem;
      }
      .section h3 {
        font-size: 1.2rem;
        color: #ff69b4;
        margin-bottom: 1rem;
        text-shadow: 1px 1px #ffeef3;
      }
      ul.task-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      li.task {
        background: #ffe4ec;
        border: 1px solid #ffc0cb;
        border-radius: 1rem;
        padding: 1rem;
        margin-bottom: 0.8rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 2px 5px #f9bfd8;
        transition: transform 0.2s ease;
      }
      li.task:hover {
        transform: scale(1.02);
      }
      li.task.done {
        background: #e9d7f5;
        text-decoration: line-through;
        opacity: 0.7;
      }
      .task-info {
        flex: 1;
        margin-right: 1rem;
      }
      .title {
        font-weight: bold;
        color: #aa336a;
        font-size: 1rem;
        margin-bottom: 0.2rem;
      }
      .desc {
        font-size: 0.85rem;
        color: #995577;
      }
      .actions {
        display: flex;
        gap: 0.4rem;
      }
      button {
        background-color: #fff0f6;
        border: 1px solid #ffb6c1;
        color: #d63384;
        border-radius: 6px;
        padding: 0.3rem 0.5rem;
        font-size: 0.9rem;
        cursor: pointer;
        font-family: 'Courier New', monospace;
        font-style: italic;
        transition: all 0.2s ease;
      }
      button:hover {
        background-color: #ffccdd;
        color: #83174d;
        box-shadow: 0 0 5px #f8b5cc;
      }
      .empty {
        color: #cc99aa;
        font-style: italic;
        text-align: center;
        padding: 1rem 0;
      }
      .highlight-drop {
        outline: 2px dashed #d48dc9;
        background-color: #ffe8f0;
      }
    </style>

    <div class="task-zone">
      <div class="section">
        <h3>🌸 Pendientes (${pending.length})</h3>
        ${pending.length
          ? `<ul class="task-list">
              ${pending.map(t => `
                <li class="task" data-id="${t.id}">
                  <div class="task-info">
                    <div class="title">✨ ${t.title}</div>
                    ${t.description ? `<div class="desc">${t.description}</div>` : ""}
                  </div>
                  <div class="actions">
                    <button class="complete-btn">💖</button>
                    <button class="delete-btn">❌</button>
                  </div>
                </li>`).join("")}
            </ul>`
          : `<p class="empty">No hay tareas aún, preciosa 🌷</p>`
        }
      </div>

      <div class="section">
        <h3>🧁 Completadas (${done.length})</h3>
        ${done.length
          ? `<ul class="task-list">
              ${done.map(t => `
                <li class="task done" data-id="${t.id}">
                  <div class="task-info">
                    <div class="title">🌟 ${t.title}</div>
                    ${t.description ? `<div class="desc">${t.description}</div>` : ""}
                  </div>
                  <div class="actions">
                    <button class="complete-btn">↩️</button>
                    <button class="delete-btn">❌</button>
                  </div>
                </li>`).join("")}
            </ul>`
          : `<p class="empty">Nada terminado aún 💭</p>`
        }
      </div>
    </div>
    `;

    
    this.shadowRoot.querySelectorAll(".complete-btn")
      .forEach(btn => {
        btn.addEventListener("click", e => {
          const li = (e.currentTarget as HTMLElement).closest("li.task") as HTMLElement;
          const id = li.dataset.id!;
          this.toggleTaskComplete(id);
        });
      });

    this.shadowRoot.querySelectorAll(".delete-btn")
      .forEach(btn => {
        btn.addEventListener("click", e => {
          const li = (e.currentTarget as HTMLElement).closest("li.task") as HTMLElement;
          const id = li.dataset.id!;
          this.deleteTask(id);
        });
      });
  }
}

interface TaskItem {
  id: string;
  title: string;
  description?: string;
  completed?: boolean;
  inProgress?: boolean;
  inReview?: boolean;
}

export default TaskStatus;