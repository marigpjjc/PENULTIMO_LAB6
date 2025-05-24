class ErrorPage extends HTMLElement {
  private shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.setListeners();
  }

  private render() {
    this.shadow.innerHTML = `
      <style>
  :host {
    display: block;
    height: 100vh;
    background: linear-gradient(135deg, #fbe9f3 0%, #f7d9e1 100%);
    font-family: 'Georgia', serif;
    color: #a55a6a;
  }

  .container {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 2rem;
  }

  .glitch {
    font-size: 6rem;
    color: #c06c84;
    font-family: 'Courier New', monospace;
    letter-spacing: 0.1em;
    /* Animación removida */
  }

  .message {
    margin-top: 1rem;
    font-size: 1.5rem;
    color: #ad7c87;
    font-family: 'Georgia', serif;
  }

  .info {
    font-size: 1rem;
    color: #c8a6ad;
    margin-bottom: 2rem;
    font-family: 'Georgia', serif;
    font-style: italic;
  }

  button {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: bold;
    border: none;
    border-radius: 12px;
    color: #fbe9f3;
    background: #c06c84;
    cursor: pointer;
    transition: background 0.3s, transform 0.2s;
    font-family: 'Courier New', monospace;
    letter-spacing: 0.05em;
    box-shadow: 0 0 8px #c06c84aa;
  }

  button:hover {
    background: #ad5a73;
    transform: scale(1.05);
    box-shadow: 0 0 12px #ad5a73cc;
  }
</style>

<div class="container">
  <div class="error">error</div>
  <div class="message">Página no encontrada :cc</div>
  <div class="info">Parece que esta dirección no existe o fue eliminada</div>
  <button id="goHome">Ir al inicio</button>
</div>
    `;
  }

  private setListeners() {
    const btn = this.shadowRoot!.getElementById("goHome") as HTMLButtonElement;
    btn.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("route-change", {
        bubbles: true,
        composed: true,
        detail: { path: "/" }
      }));
    });
  }
}

customElements.define("error-page", ErrorPage);
export default ErrorPage;
