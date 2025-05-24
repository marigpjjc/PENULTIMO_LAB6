import { registerUser } from "../services/firebase/auth-service";

class SignupForm extends HTMLElement {
  private shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.setupEvents();
  }

 private render() {
  this.shadow.innerHTML = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

      :host {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        font-family: 'Press Start 2P', cursive;
        background: var(--retro-bg, #fff0f5);
        --retro-pink-light: #f9c4d2;
        --retro-pink-dark: #d13f7c;
        --retro-purple: #a86ecf;
        --retro-bg: #fff0f5;
        --retro-card: #ffe6f0;
        --retro-shadow: #a23168;
        --retro-border: #d88db1;
      }

      .form-wrapper {
        width: 480px;
        padding: 60px 40px;
        background: var(--retro-card);
        border: 4px solid var(--retro-border);
        border-radius: 18px;
        box-shadow: 0 0 20px var(--retro-shadow);
        color: var(--retro-purple);
        animation: fadeIn 0.9s ease-in-out;
      }

      h2 {
        font-size: 1.2rem;
        text-align: center;
        color: var(--retro-pink-dark);
        text-shadow: 2px 2px var(--retro-shadow);
        margin-bottom: 40px;
      }

      .form-group {
        margin-bottom: 26px;
      }

      label {
        display: block;
        margin-bottom: 8px;
        font-size: 0.7rem;
        color: var(--retro-pink-dark);
        text-shadow: 1px 1px var(--retro-border);
      }

      input {
        width: 93%;
        padding: 14px;
        font-size: 0.65rem;
        font-family: 'Press Start 2P', cursive;
        border: 2px solid var(--retro-border);
        border-radius: 12px;
        background: #fff0f8;
        color: #7d3e5e;
        box-shadow: inset 2px 2px var(--retro-shadow);
      }

      input:focus {
        outline: none;
        border-color: var(--retro-pink-dark);
        background: #fff8fc;
      }

      button {
        width: 100%;
        padding: 18px;
        font-size: 0.7rem;
        font-family: 'Press Start 2P', cursive;
        background: var(--retro-pink-dark);
        color: white;
        border: 3px solid var(--retro-shadow);
        border-radius: 12px;
        cursor: pointer;
        box-shadow: 2px 2px 0 var(--retro-shadow);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }

      button:hover:enabled {
        transform: translateY(-5px);
        box-shadow: 4px 4px 0 var(--retro-shadow);
        background: #b02f69;
      }

      button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .error {
        margin-top: 24px;
        text-align: center;
        font-size: 0.7rem;
        color: #b33c3c;
        text-shadow: 1px 1px #ffb3b3;
      }

      .footer {
        margin-top: 36px;
        text-align: center;
        font-size: 0.7rem;
        color: var(--retro-purple);
      }

      .footer a {
        color: var(--retro-pink-dark);
        cursor: pointer;
        text-decoration: underline;
        font-weight: bold;
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
        .form-wrapper {
          padding: 40px 20px;
          width: 90%;
        }

        h2 {
          font-size: 1rem;
        }

        button {
          font-size: 0.6rem;
        }
      }
    </style>

    <div class="form-wrapper">
      <h2>Crear cuenta</h2>
      <form id="registerForm">
        <div class="form-group">
          <label for="username">Nombre</label>
          <input id="username" type="text" required placeholder="Tu nombre completo" />
        </div>
        <div class="form-group">
          <label for="email">Correo</label>
          <input id="email" type="email" required placeholder="nombre@correo.com" />
        </div>
        <div class="form-group">
          <label for="password">Contraseña</label>
          <input id="password" type="password" required placeholder="Mínimo 6 caracteres" />
        </div>
        <div class="form-group">
          <label for="confirm">Repite tu contraseña</label>
          <input id="confirm" type="password" required placeholder="Confirma contraseña" />
        </div>
        <button type="submit" id="submitBtn">Crear cuenta</button>
        <div class="error" id="errorMsg"></div>
      </form>
      <div class="footer">
        ¿Ya tienes cuenta? <a id="loginLink">Inicia sesión</a>
      </div>
    </div>
  `;
}


  private setupEvents() {
    const form      = this.shadow.getElementById("registerForm") as HTMLFormElement;
    const username  = this.shadow.getElementById("username")    as HTMLInputElement;
    const email     = this.shadow.getElementById("email")       as HTMLInputElement;
    const password  = this.shadow.getElementById("password")    as HTMLInputElement;
    const confirm   = this.shadow.getElementById("confirm")     as HTMLInputElement;
    const errorMsg  = this.shadow.getElementById("errorMsg")    as HTMLDivElement;
    const submitBtn = this.shadow.getElementById("submitBtn")   as HTMLButtonElement;
    const loginLink = this.shadow.getElementById("loginLink")   as HTMLAnchorElement;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      errorMsg.textContent = "";

      const u = username.value.trim();
      const m = email.value.trim();
      const p = password.value;
      const c = confirm.value;

      if (!u || !m || !p || !c) {
        errorMsg.textContent = "Todos los campos son obligatorios.";
        return;
      }
      if (p !== c) {
        errorMsg.textContent = "Las contraseñas no coinciden.";
        return;
      }
      if (p.length < 6) {
        errorMsg.textContent = "La contraseña debe tener al menos 6 caracteres.";
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "Registrando...";

      try {
        const result = await registerUser(m, p, u);
        if (result.success && result.user) {
          localStorage.setItem("userId", result.user.uid);
          window.location.href = "/tasks";
        } else {
          throw new Error((result.error as any)?.message || "Error al registrar");
        }
      } catch (err: any) {
        errorMsg.textContent = err.message;
        submitBtn.disabled = false;
        submitBtn.textContent = "Crear cuenta";
      }
    });

    loginLink.addEventListener("click", (e) => {
      e.preventDefault();
      this.dispatchEvent(new CustomEvent("route-change", {
        bubbles: true,
        composed: true,
        detail: { path: "/login" }
      }));
    });
  }
}

if (!customElements.get("signup-form")) {
  customElements.define("signup-form", SignupForm);
}
export default SignupForm;