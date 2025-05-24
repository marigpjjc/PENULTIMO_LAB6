import "../components/login-form";
import "../components/signup-form";
import "../pages/start-page";
import "../pages/error-page";
import "../pages/task-page";

class RootApp extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.setupRouting();
    
    
    this.addEventListener("route-change", (e: Event) => {
      const custom = e as CustomEvent<{ path: string }>;
      if (custom.detail?.path) {
        window.history.pushState({}, "", custom.detail.path);
        this.handleRouteChange();
      }
    });
  }

  private setupRouting() {
    this.handleRouteChange();
    window.addEventListener("popstate", () => this.handleRouteChange());
    this.shadowRoot!.addEventListener("click", (e: Event) => {
      const target = (e.target as HTMLElement);
      if (target.tagName === "A" && target.hasAttribute("href")) {
        e.preventDefault();
        const href = target.getAttribute("href")!;
        window.history.pushState({}, "", href);
        this.handleRouteChange();
      }
    });
  }

  private handleRouteChange() {
    const path = window.location.pathname;
    const content = this.shadowRoot!.getElementById("content")!;
    switch (path) {
      case "/":
        content.innerHTML = `<start-page></start-page>`;
        break;
      case "/login":
        content.innerHTML = `<login-form></login-form>`;
        break;
      case "/register":
        content.innerHTML = `<signup-form></signup-form>`;
        break;
      case "/tasks":
        content.innerHTML = `<tasks-page></tasks-page>`;
        break;
      default:
        content.innerHTML = `<error-page></error-page>`;
    }
  }

  private render() {
    this.shadowRoot!.innerHTML = `
      <style>
        :host {
          display: block;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Segoe UI', sans-serif;
          background-color: #fdeef4;
          color: #0ff;
        }
        }
        .app-container {
          min-height: 100vh;
        }
        main {
          padding: 20px;
        }
      </style>
      <div class="app-container">
        <main id="content"></main>
      </div>
    `;
  }
}

customElements.define("root-app", RootApp);
export default RootApp;