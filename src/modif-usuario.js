import { PolymerElement, html } from "@polymer/polymer/polymer-element.js";
import "./shared-styles.js";
import "@material/mwc-textfield";
import "@material/mwc-button";
import "@material/mwc-icon";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/app-route/app-location.js";
import "@polymer/app-route/app-route.js";
import { AppLayoutBehavior } from "@polymer/app-layout/app-layout-behavior/app-layout-behavior";

class ModifUsuario extends PolymerElement {
  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          display: block;

          padding: 10px;
        }
      </style>

      <iron-ajax
        id="ModificarAjax"
        url="[[urlLogin]]"
        method="PUT"
        content-type="application/json"
        handle-as="json"
        on-response="handleUserResponseModificar"
        loading="{{cargando}}"
      >
      </iron-ajax>

      <iron-ajax
        auto
        id="ObtenerDatos"
        method="GET"
        content-type="application/json"
        handle-as="json"
        on-response="handleUserResponse"
        last-response="{{usuario}}"
      ></iron-ajax>

      <div class="card">
        <h2>Datos personales</h2>

        <p>
          <mwc-textfield
            id="nombre"
            class="left right"
            ;
            required
            validationMessage="Nombre obligatorio"
            label="Nombre"
            value="[[usuario.nombre]]"
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
            value="[[usuario.apellido]]"
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
            value="[[usuario.dni]]"
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
            value="[[usuario.fechaNacimiento]]"
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
            readonly
            value="[[usuario.email]]"
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
            value=""
            type="password"
            iconTrailing="vpn_key"
            outlined
          >
          </mwc-textfield>
        </p>

        <p>
          <mwc-button
            raised
            label="Modificar"
            on-click="modificar"
          ></mwc-button>
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
      this.formData = {};
      this.$.ObtenerDatos.url =
      "http://localhost:3000/apirest/usuarios/" +
      localStorage.getItem("usuarioLogin");
    this.$.ObtenerDatos.generateRequest();
    } else {
      this.formData = {};
    }
  }

  modificar() {
    if (this.$.password.value > "") {
      this.$.ModificarAjax.url =
        "http://localhost:3000/apirest/usuarios/" + this.$.email.value;
      this.$.ModificarAjax.body = {
        email: this.$.email.value,
        password: this.$.password.value,
        nombre: this.$.nombre.value,
        apellido: this.$.apellido.value,
        dni: this.$.dni.value,
        fechaNacimiento: this.$.fechaNacimiento.value,
      };
      this.$.ModificarAjax.generateRequest();
    } else {
      alert("Debe cargar la contraseña");
    }
  }

  volver() {
    this.set("route.path", "/login");
  }

  handleUserResponse(event) {
    // reset form data
    this.formData = {};
  }

  handleUserResponseModificar() {
    this.$.password.value = "";
    alert("Se han modificado los datos");
  }
}

window.customElements.define("modif-usuario", ModifUsuario);
