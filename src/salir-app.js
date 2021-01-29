import { PolymerElement, html } from "@polymer/polymer/polymer-element.js";
import "./shared-styles.js";
import "@material/mwc-textfield";
import "@material/mwc-button";
import "@material/mwc-icon";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/app-route/app-location.js";
import "@polymer/app-route/app-route.js";

class SalirApp extends PolymerElement {
  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          display: block;

          padding: 10px;
        }
      </style>
      <app-location route="{{route}}"></app-location>
      <div class="card">
        <h1>Hasta Luego</h1>

        <p>
          <mwc-button raised label="Volver a loguearse" on-click="login"></mwc-button>
        </p>
      </div>
    `;
  }

  login() {
    localStorage.setItem("usuarioLogin", "");
    this.set("route.path", "/login");
    this.formData = {};
  }
}

window.customElements.define("salir-app", SalirApp);
