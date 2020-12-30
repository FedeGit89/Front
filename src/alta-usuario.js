import { PolymerElement, html } from "@polymer/polymer/polymer-element.js";
import "./shared-styles.js";
import "@material/mwc-textfield";
import "@material/mwc-button";
import "@material/mwc-icon";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/app-route/app-location.js";
import "@polymer/app-route/app-route.js";

class AltaUsuario extends PolymerElement {
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
        id="RegistrarAjax"
        url="[[urlLogin]]"
        method="POST"
        content-type="application/json"
        handle-as="json"
        on-response="handleUserResponse"
        loading="{{cargando}}"
      >
      </iron-ajax>

      <div class="card">
        <h2>Alta de usuario</h2>

        <p>
          <mwc-textfield
            id="nombre"
            class="left right"
            ;
            required
            validationMessage="Nombre obligatorio"
            label="Nombre"
            outlined
          >
          </mwc-textfield>
        </p>

        <p>
          <mwc-textfield
            id="apellido"
            class="left right"
            ;
            required
            validationMessage="Apellido obligatorio"
            label="Apellido"
            outlined
          >
          </mwc-textfield>
        </p>

        <p>
          <mwc-textfield
            id="dni"
            class="left right"
            ;
            required
            validationMessage="DNI obligatorio"
            label="DNI"
            outlined
          >
          </mwc-textfield>
        </p>

        <p>
          <mwc-textfield
            id="fechaNacimiento"
            class="left right"
            ;
            required
            validationMessage="Fecha de nacimineto obligatoria"
            label="Fecha de nacimiento"
            type="date"
            iconTrailing="date_range"
            outlined
          >
          </mwc-textfield>
        </p>

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
            validationMessage="Ingresar contraseña"
            label="Password"
            type="password"
            iconTrailing="vpn_key"
            outlined
          >
          </mwc-textfield>
        </p>

        <p>
          <mwc-textfield
            id="confirmacionPasswrod"
            class="left right"
            ;
            required
            validationMessage="Confirmar contraseña"
            label="Confirmar contraseña"
            type="password"
            iconTrailing="vpn_key"
            outlined
          >
          </mwc-textfield>
        </p>

        <p>
          <mwc-button raised label="Alta" on-click="registrar"></mwc-button>
        </p>
      </div>
    `;
  }
  registrar() {
    this.$.RegistrarAjax.url =
      "http://localhost:3000/apirest/usuarios/registrar";
    this.$.RegistrarAjax.body = {
      email: this.$.email.value,
      password: this.$.password.value,
      nombre: this.$.nombre.value,
      apellido: this.$.apellido.value,
      dni: this.$.dni.value,
      fechaNacimiento: this.$.fechaNacimiento.value,
    };
    this.$.RegistrarAjax.generateRequest();
  }
  handleUserResponse(event) {
    var response = event.detail.response;
      if (Object.entries(response).length == 0) {
      this.set("route.path", "/login");
    } else {
      alert("Email "+  this.$.email.value + " ya se encuentra registrado");
    }
    // reset form data
    this.formData = {};
  }
}

window.customElements.define("alta-usuario", AltaUsuario);
