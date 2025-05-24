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
      @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

      :host {
        display: block;
        font-family: 'Press Start 2P', cursive;
        --retro-pink-light: #f9c4d2;
        --retro-pink-dark: #d13f7c;
        --retro-purple: #a86ecf;
        --retro-bg: #fff0f5;
        --retro-card: #ffe6f0;
        --retro-shadow: #a23168;
        --retro-border: #d88db1;
      }

      .container {
        padding: 60px 20px;
        max-width: 880px;
        margin: auto;
        min-height: 100vh;
        background: var(--retro-bg);
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .auth-box {
        background: var(--retro-card);
        border: 4px solid var(--retro-border);
        border-radius: 18px;
        padding: 60px 40px;
        box-shadow: 0 0 20px var(--retro-shadow);
        animation: fadeIn 0.9s ease-in-out;
      }

      h1 {
        font-size: 1.8rem;
        color: var(--retro-pink-dark);
        text-shadow: 2px 2px var(--retro-shadow);
        margin-bottom: 20px;
      }

      p {
        color: var(--retro-purple);
        font-size: 0.85rem;
        margin: 12px 0;
        text-shadow: 1px 1px var(--retro-border);
      }

      .actions {
        margin-top: 40px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        gap: 40px;
        flex-wrap: wrap;
      }

      button {
        font-family: 'Press Start 2P', cursive;
        font-size: 0.7rem;
        padding: 18px 28px;
        background: var(--retro-pink-dark);
        color: #fff;
        border: 3px solid var(--retro-shadow);
        border-radius: 12px;
        cursor: pointer;
        box-shadow: 2px 2px 0 var(--retro-shadow);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }

      button:hover {
        transform: translateY(-5px);
        box-shadow: 4px 4px 0 var(--retro-shadow);
        background: #b02f69;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @media (max-width: 600px) {
        h1 {
          font-size: 1.3rem;
        }

        .actions {
          flex-direction: column;
          gap: 20px;
        }

        button {
          width: 100%;
          max-width: 240px;
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
