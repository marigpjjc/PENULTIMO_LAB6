import { loginUser } from "../services/firebase/auth-service";

class LoginForm extends HTMLElement {
  private root: ShadowRoot;

  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.bindEvents();
  }

private render() {
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
        width: 100%;
        max-width: 480px;
        text-align: center;
      }

      h1 {
        font-size: 1.6rem;
        color: var(--retro-pink-dark);
        text-shadow: 2px 2px var(--retro-shadow);
        margin-bottom: 32px;
      }

      input {
        font-family: 'Press Start 2P', cursive;
        font-size: 0.7rem;
        width: 80%;
        padding: 16px;
        border: 3px solid var(--retro-shadow);
        border-radius: 12px;
        margin: 12px 0;
        background: #fff;
        color: #444;
        box-shadow: 2px 2px 0 var(--retro-shadow);
      }

      input::placeholder {
        color: #888;
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
        margin-top: 24px;
        box-shadow: 2px 2px 0 var(--retro-shadow);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }

      button:hover {
        transform: translateY(-5px);
        box-shadow: 4px 4px 0 var(--retro-shadow);
        background: #b02f69;
      }

      .error {
        color: var(--retro-purple);
        font-size: 0.65rem;
        margin-top: 18px;
        text-shadow: 1px 1px var(--retro-border);
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
          font-size: 1.1rem;
        }

        button {
          width: 100%;
          max-width: 240px;
        }
      }
    </style>

    <div class="container">
      <div class="auth-box">
        <h1>Hola de Nuevo</h1>
        <input type="email" id="emailInput" placeholder="Correo..." />
        <input type="password" id="passwordInput" placeholder="Contraseña..." />
        <button id="accessBtn">ENTRAR</button>
        <div class="error" id="errorBox"></div>
      </div>
    </div>
  `;
}

  private bindEvents() {
    const emailEl = this.root.getElementById("emailInput") as HTMLInputElement;
    const passEl  = this.root.getElementById("passwordInput") as HTMLInputElement;
    const btn     = this.root.getElementById("accessBtn") as HTMLButtonElement;
    const errorBox= this.root.getElementById("errorBox") as HTMLDivElement;

    btn.addEventListener("click", async () => {
      errorBox.textContent = "";
      const userEmail    = emailEl.value.trim();
      const userPassword = passEl.value.trim();

      if (!userEmail || !userPassword) {
        errorBox.textContent = "Completa todos los campos.";
        return;
      }

      btn.disabled   = true;
      btn.textContent= "Accediendo...";

      const result = await loginUser(userEmail, userPassword);

      if (result.success) {
       
        window.location.href = "/tasks";
        
      } else {
        const msg = (result.error as any)?.message 
                  || "Credenciales inválidas o error de conexión.";
        errorBox.textContent = msg;
        btn.disabled   = false;
        btn.textContent= "Entrar";
      }
    });
  }
}

if (!customElements.get("login-form")) {
  customElements.define("login-form", LoginForm);
}
export default LoginForm;
