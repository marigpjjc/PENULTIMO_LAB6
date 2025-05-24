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
    this.root.innerHTML = `
       <style>
        @import url('https://fonts.googleapis.com/css2?family=Special+Elite&display=swap');

        :host {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color:  #fdeef4;
          font-family: 'Special Elite', 'Courier New', monospace;
        }

        .form-box {
          background-color: #f7d6e0;
          border: 2px solid #decaa7;
          border-radius: 16px;
          padding: 2.5rem;
          width: 420px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          animation: fadeIn 0.7s ease-in-out;
        }

        .form-box h1 {
          color: #2e2e2e;
          text-align: center;
          margin-bottom: 2rem;
          font-size: 2rem;
          letter-spacing: 1px;
        }

        input {
          padding: 0.9rem 1.1rem;
          margin-bottom: 1.2rem;
          background: #ffffff;
          border: 1px solid #decaa7;
          color: #2e2e2e;
          border-radius: 10px;
          font-size: 1rem;
          font-family: inherit;
          transition: border 0.3s, box-shadow 0.3s;
        }

        input:focus {
          border-color: #c9d6ea;
          box-shadow: 0 0 6px #c9d6ea99;
          outline: none;
        }

        button {
          background-color: #c9d6ea;
          color: #2e2e2e;
          padding: 0.9rem;
          font-size: 1rem;
          font-weight: bold;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease-in-out;
        }

        button:hover {
          background-color: #decaa7;
          color: #ffffff;
        }

        .error {
          margin-top: 0.5rem;
          color: #bb4b66;
          text-align: center;
          font-size: 0.95rem;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      </style>

      <div class="form-box">
        <h1>Bienvenida, querida</h1>
        <input type="email" id="emailInput" placeholder="Escribe tu correo..." />
        <input type="password" id="passwordInput" placeholder="Tu contraseña secreta" />
        <button id="accessBtn">Ingresar a tu Mundo</button>
        <div class="error" id="errorBox"></div>
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
