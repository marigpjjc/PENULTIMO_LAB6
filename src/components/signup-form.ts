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
      :host {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        font-family: 'Georgia', serif;
        background:  #fdeef4;
      }

      .form-wrapper {
        width: 420px;
        padding: 2.5rem;
        border-radius: 1.5rem;
        background: #fffaf5;
        border: 2px dashed #d9b88f;
        box-shadow: 0 10px 25px rgba(139, 115, 85, 0.2);
        color:rgb(77, 54, 63);
      }

      h2 {
        text-align: center;
        margin-bottom: 2rem;
        font-size: 1.8rem;
        color: #7b4d2b;
        font-family: 'Courier New', monospace;
      }

      .form-group {
        margin-bottom: 1.25rem;
      }

      label {
        display: block;
        margin-bottom: 0.4rem;
        font-weight: 600;
        font-size: 1rem;
        color: #3d2b1f;
      }

      input {
        width: 100%;
        padding: 0.75rem 1rem;
        background: #fefaf3;
        border: 1px solid #dec5aa;
        color: #6a4b3c;
        border-radius: 0.75rem;
        font-size: 1rem;
        font-family: 'Courier New', monospace;
      }

      input:focus {
        outline: none;
        border-color: #c9a27e;
        background: #fff7ef;
      }

      button {
        width: 100%;
        margin-top: 1.5rem;
        padding: 0.9rem;
        font-size: 1rem;
        font-weight: bold;
        color: #fffaf5;
        background: #c9a27e;
        border: none;
        border-radius: 0.75rem;
        cursor: pointer;
        transition: background 0.3s ease;
        font-family: 'Georgia', serif;
      }

      button:disabled {
        opacity: 0.5;
        cursor: default;
      }

      button:hover:enabled {
        background: #a78364;
      }

      .error {
        margin-top: 1.25rem;
        text-align: center;
        color: #b33c3c;
        font-size: 0.95rem;
      }

      .footer {
        margin-top: 2rem;
        text-align: center;
        font-size: 0.95rem;
        color: #7c6c5c;
      }

      .footer a {
        color: #a67c52;
        cursor: pointer;
        text-decoration: underline;
        font-weight: 600;
      }
    </style>

    <div class="form-wrapper">
      <h2>Crear una cuenta</h2>
      <form id="registerForm">
        <div class="form-group">
          <label for="username">Tu nombre</label>
          <input id="username" type="text" required placeholder="Escribe tu nombre completo" />
        </div>
        <div class="form-group">
          <label for="email">Correo</label>
          <input id="email" type="email" required placeholder="nombre@ejemplo.com" />
        </div>
        <div class="form-group">
          <label for="password">Elige una contraseña</label>
          <input id="password" type="password" required placeholder="Mínimo 6 caracteres" />
        </div>
        <div class="form-group">
          <label for="confirm">Confirma tu contraseña</label>
          <input id="confirm" type="password" required placeholder="Repite la contraseña" />
        </div>
        <button type="submit" id="submitBtn">Crear cuenta</button>
        <div class="error" id="errorMsg"></div>
      </form>
      <div class="footer">
        ¿Ya estás registrada? <a id="loginLink">Iniciar sesión</a>
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