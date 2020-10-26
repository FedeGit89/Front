import { PolymerElement, html } from "@polymer/polymer/polymer-element.js";
import "./shared-styles.js";
import "@material/mwc-textfield";
import "@material/mwc-button";
import "@material/mwc-icon";
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';

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
        url="[[urlLogin]]"
        method="POST"
        content-type="application/json"
        handle-as="json"
        on-response="handleUserResponse"
        on-error="handleUserError"
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
          <mwc-button
            raised
            label="Ingresar"
            on-click="login"
          ></mwc-button>
          <mwc-button
            label="Registrarse"
            on-click="registrar"
          ></mwc-button>
        </p>
      </div>
    `;
  }
  login() {
    this.$.LoginAjax.url = 'http://localhost:3000/api/v1/usuarios/login';
    this.$.LoginAjax.body = {email: this.$.email.value, password: this.$.password.value };
    this.$.LoginAjax.generateRequest();
  }
  handleUserResponse(event) {
    // var response = JSON.parse(event.detail.response);
    var response = event.detail.response;
    if (response.email) {
        this.error = '';
        this.storedUser = {
            loggedin: true
        };
        // redirect to Secret Quotes
        this.set('route.path', '/accounts');
    }
    // reset form data
    this.formData = {};
}
handleUserError(event) {
    this.error = JSON.parse(event.detail.request.xhr.response).mensaje;
}
}

window.customElements.define("login-app", LoginApp);
