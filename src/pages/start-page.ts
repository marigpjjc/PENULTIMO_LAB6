import { onAuthChange } from "../services/firebase/auth-service";

class StartPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.renderSkeleton();
    this.handleAuth();
  }

  private renderSkeleton() {
    this.shadowRoot!.innerHTML = `
      <style>
  @import url("https://fonts.googleapis.com/css2?family=Special+Elite&display=swap");

  :host {
    display: block;
    font-family: 'Special Elite', 'Courier New', monospace;
    --bg-color: #fdeef4;
    --soft-pink: #f4c2c2;
    --soft-purple: #d8b4dd;
    --text-light: #5a2a2a;
    --text-muted: #a87e8e;
    --card-bg: #f9e7ee;
    --btn-radius: 30px;
  }

  .container {
    padding: 50px 20px;
    max-width: 900px;
    margin: auto;
    text-align: center;
    background: var(--bg-color);
    min-height: 100vh;
  }

  .auth-box {
    background: var(--card-bg);
    border: 2px solid var(--soft-purple);
    border-radius: 16px;
    padding: 40px 30px;
    box-shadow: 0 0 15px var(--soft-pink);
    animation: fadeIn 1s ease-in;
  }

  h1 {
    font-size: 2.8rem;
    color: var(--soft-purple);
  }

  p {
    color: var(--text-muted);
    font-size: 1.1rem;
    margin: 20px 0;
  }

  .actions {
    margin-top: 30px;
    display: flex;
    justify-content: center;
    gap: 35px;
    flex-wrap: wrap;
  }

  button {
    font-size: 1rem;
    padding: 14px 28px;
    border-radius: var(--btn-radius);
    border: none;
    cursor: pointer;
    color: #5a2a2a;
    background: var(--soft-purple);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  button:hover {
    transform: translateY(-4px);
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(15px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 600px) {
    h1 {
      font-size: 2rem;
    }

    .actions {
      flex-direction: column;
      gap: 15px;
    }

    button {
      width: 100%;
      max-width: 250px;
    }
  }
</style>

<div class="container">
  <!-- contenido dinámico -->
</div>
    `;
  }

  private handleAuth() {
    onAuthChange(user => {
      if (user) {
        // Usuario autenticado: redirigir a /tasks y emitir evento para el router
        window.history.pushState({}, "", "/tasks");
        this.dispatchEvent(new CustomEvent("route-change", {
          bubbles: true,
          composed: true,
          detail: { path: "/tasks" },
        }));
      } else {
        // Usuario no autenticado: mostrar opciones de login/registro
        this.showAuthOptions();
      }
    });
  }

  private showAuthOptions() {
    const container = this.shadowRoot!.querySelector(".container");
    if (!container) return;

    container.innerHTML = `
      <div class="auth-box" role="region" aria-label="Opciones de autenticación">
        <h1>HOlAAA</h1>
        <p>Organicemonos juntas</p>
        <p><small>Vamos, que estas esperando?</small></p>
        <div class="actions">
          <button id="login-btn" aria-label="Iniciar sesión">Login</button>
          <button id="register-btn" aria-label="Registrarse">Singup</button>
        </div>
      </div>
    `;
    this.setupEventListeners();
  }

  private setupEventListeners() {
    const loginBtn = this.shadowRoot!.getElementById("login-btn");
    const registerBtn = this.shadowRoot!.getElementById("register-btn");

    if (loginBtn) {
      loginBtn.addEventListener("click", () => {
        window.history.pushState({}, "", "/login");
        this.dispatchEvent(new CustomEvent("route-change", {
          bubbles: true,
          composed: true,
          detail: { path: "/login" },
        }));
      });
    }

    if (registerBtn) {
      registerBtn.addEventListener("click", () => {
        window.history.pushState({}, "", "/register");
        this.dispatchEvent(new CustomEvent("route-change", {
          bubbles: true,
          composed: true,
          detail: { path: "/register" },
        }));
      });
    }
  }
}

customElements.define("start-page", StartPage);
export default StartPage;
