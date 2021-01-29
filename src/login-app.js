import { PolymerElement, html } from "@polymer/polymer/polymer-element.js";
import "./shared-styles.js";
import "@material/mwc-textfield";
import "@material/mwc-button";
import "@material/mwc-icon";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/app-route/app-location.js";
import "@polymer/app-route/app-route.js";

class LoginApp extends PolymerElement {
  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          display: block;

          padding: 10px;
        }
      </style>

      <app-location route="{{route}}"></app-location>
      <iron-ajax
        id="LoginAjax"
        method="POST"
        content-type="application/json"
        handle-as="json"
        on-response="handleUserResponse"
        loading="{{cargando}}"
      >
      </iron-ajax>

      <div class="card">
        <p>
          <mwc-textfield
            id="email"
            class="left right"
            ;
            required
            validationMessage="El correo es un campo obligatorio"
            label="mail"
            type="email"
            iconTrailing="alternate_email"
            outlined
          >
          </mwc-textfield>
        </p>

        <p>
          <mwc-textfield
            id="password"
            class="left right"
            ;
            required
            validationMessage="Ingrese contraseña"
            label="Contraseña"
            type="password"
            iconTrailing="vpn_key"
            outlined
          >
          </mwc-textfield>
        </p>

        <p>
          <mwc-button raised label="Ingresar" on-click="login"></mwc-button>
          <mwc-button label="Registrarse" on-click="registrar"></mwc-button>
        </p>
      </div>
    `;
  }

  static get properties() {
    return {
      active: {
        type: Boolean,
        observer: "_activeChanged",
      },
    };
  }
  _activeChanged(newValue, oldValue) {
    if (newValue) {
      this.$.email.value = "";
      this.$.password.value = "";
    }
  }

  login() {
    this.$.LoginAjax.url = "http://localhost:3000/apirest/usuarios/login";
    this.$.LoginAjax.body = {
      email: this.$.email.value,
      password: this.$.password.value,
    };
    this.$.LoginAjax.generateRequest();
  }

  registrar() {
    // redirect to Secret Quotes
    this.set("route.path", "/registrar");
  }
  handleUserResponse(event) {
    var response = event.detail.response;
    if (response.email) {
      localStorage.setItem("usuarioLogin", response.email);
      this.set("route.path", "/dashboard");
    } else {
      alert(response.mensaje);
    }
    // reset form data
    this.formData = {};
  }
}

window.customElements.define("login-app", LoginApp);
