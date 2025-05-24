class AddTask extends HTMLElement {
  private shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.handleFormEvents();
  }

  private render() {
    this.shadow.innerHTML = `
      <style>
  @font-face {
    font-family: 'Mosocript';
    src: url('mosocript.woff2') format('woff2'); /* Asegúrate de tener este archivo */
    font-display: swap;
  }

  :host {
    display: block;
    max-width: 550px;
    margin: 0 auto;
    padding: 2.5rem 3rem;
    background: linear-gradient(to bottom right, #fff0f5, #ffe4e1);
    border: 3px double #f4c2c2;
    border-radius: 2rem;
    box-shadow: 0 0 25px rgba(244, 194, 194, 0.6), inset 0 0 15px #ffe4eb;
    font-family: 'Mosocript', cursive;
    color: #8b5e5e;
  }

  h3 {
    text-align: center;
    margin-bottom: 2rem;
    font-size: 2rem;
    color: #d96d94;
    font-family: 'Mosocript', cursive;
    letter-spacing: 0.08em;
    text-shadow: 1px 1px #fff;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1.8rem;
  }

  label {
    font-weight: bold;
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
    color: #a05d7a;
    font-family: 'Mosocript', cursive;
  }

  input, textarea {
    background: #fff0f8;
    border: 2px dashed #e9b2c4;
    border-radius: 15px;
    padding: 1rem 1.3rem;
    font-size: 1.1rem;
    font-family: 'Mosocript', cursive;
    color: #70495c;
    box-shadow: inset 0 0 8px #f6d1de;
    transition: all 0.3s ease;
  }

  input:focus, textarea:focus {
    outline: none;
    border-color: #d96d94;
    box-shadow: 0 0 12px #f6d1de;
    background-color: #fffafc;
  }

  textarea {
    min-height: 120px;
  }

  button {
    background: radial-gradient(circle at top left, #f4c2c2, #d96d94);
    color: #fff0f5;
    font-weight: bold;
    border: 2px solid #fce1e9;
    border-radius: 50px;
    padding: 1rem 1.5rem;
    font-size: 1.1rem;
    cursor: pointer;
    font-family: 'Mosocript', cursive;
    letter-spacing: 0.08em;
    box-shadow: 0 5px 15px rgba(217, 109, 148, 0.6);
    transition: transform 0.2s ease, box-shadow 0.3s ease;
  }

  button:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 25px rgba(217, 109, 148, 0.8);
  }

  button:active {
    transform: scale(0.98);
  }

  /* Opcional: Estilo de los campos en contenedores decorativos */
  div {
    background: #fffafc;
    border-radius: 1rem;
    padding: 1rem;
    box-shadow: inset 0 0 8px #f4c2c2;
    border: 1.5px solid #f7c6d1;
  }
</style>


<h3>Crear nueva tarea</h3>
<form id="taskForm">
  <div>
    <label for="title">Título</label>
    <input type="text" id="title" placeholder="Ej: Comprar materiales" required />
  </div>
  <div>
    <label for="description">Descripción</label>
    <textarea id="description" placeholder="Ej: Ir a la tienda por papel y lápices..."></textarea>
  </div>
  <button type="submit">Agregar tarea</button>
</form>
    `;
  }

  private handleFormEvents() {
    const shadow = this.shadow;
    const form = shadow.getElementById("taskForm") as HTMLFormElement | null;
    const title = shadow.getElementById("title") as HTMLInputElement | null;
    const description = shadow.getElementById("description") as HTMLTextAreaElement | null;

    if (!form || !title || !description) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const taskTitle = title.value.trim();
      const taskDescription = description.value.trim();

      if (!taskTitle) return;

      const newTask = {
        id: Date.now().toString(),
        title: taskTitle,
        description: taskDescription,
        status: 'todo' 
      };

    this.dispatchEvent(new CustomEvent("task-submitted", {
    detail: {
      title: taskTitle,
      description: taskDescription,
    },
    bubbles: true,
    composed: true
  }));


      form.reset();
    });
  }
}

customElements.define("add-task", AddTask);
export default AddTask;
