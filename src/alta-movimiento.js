import { PolymerElement, html } from "@polymer/polymer/polymer-element.js";
import "./shared-styles.js";
import "@material/mwc-textfield";
import "@material/mwc-button";
import "@material/mwc-icon";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/app-route/app-location.js";
import "@polymer/app-route/app-route.js";

class AbmCuenta extends PolymerElement {
  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          display: block;

          padding: 10px;
        }
      </style>

      <div class="card">
        <app-location route="{{route}}"></app-location>
        <h2>Saldo de la Cuenta</h2>
        <p>
        
          <iron-ajax
            auto
            url="http://localhost:3000/apirest/cuentas"
            id="Mascara"
            method="GET"
            handle-as="json"
            on-response="handleMascaraResponse"
          >
          </iron-ajax>

          <iron-ajax
            id="ActualizarCuenta"
            method="PUT"
            handle-as="json"
            on-response="handleUserResponse"
          >
          </iron-ajax>

          <iron-ajax
            id="GrabarMovimiento"
            method="POST"
            content-type="application/json"
            handle-as="json"
            on-response="handleUserResponse"
          >
          </iron-ajax>

          <iron-ajax
            id="ValidarMail"
            method="GET"
            content-type="application/json"
            handle-as="json"
            on-response="handleUserResponseValidarMail"
          ></iron-ajax>

          <iron-ajax
            id="AjaxVerMovimientos"
            method="GET"
            handle-as="json"
            last-response="{{movimientos}}"
          ></iron-ajax>

          <iron-ajax
            id="AjaxObtenerSaldo"
            method="GET"
            handle-as="json"
            last-response="{{cuenta}}"
          ></iron-ajax>

          <iron-ajax
          id="AjaxValidarSaldo"
          method="GET"
          handle-as="json"
          on-response="handleUserResponseValidarSaldo""
          last-response="{{cuenta}}"
        ></iron-ajax>
        </p>

        <div>
          <h2>
            <b> $ <label>[[cuenta.saldo]]</label></b>
          </h2>
        </div>

        <p>
          <mwc-textfield
            id="Importe"
            class="left right"
            ;
            required
            validationMessage="Importe obligatorio"
            label="Importe a transferir "
            outlined
          >
          </mwc-textfield>

          <mwc-textfield
            id="email"
            class="left right"
            ;
            required
            validationMessage="El correo es un campo obligatorio"
            label="Mail destino"
            type="email"
            iconTrailing="alternate_email"
            outlined
          >
          </mwc-textfield>

          <mwc-button label="Validar" on-click="Validar"></mwc-button>

          <mwc-button
            raised
            label="Transferir"
            on-click="Transferir"
          ></mwc-button>
        </p>

        <body>
          <div class="container">
            <div class="col-12">
              <div class="row">
                <div class="col-12">
                  <table
                    class="table table-bordered dataTable"
                    id="dataTable"
                    width="50%"
                    cellspacing="0"
                    role="grid"
                    border="1"
                    aria-describedby="dataTable_info"
                    style="width: 100%;"
                  >
                    <thead>
                      <tr>
                        <th>Usuario debito</th>
                        <th>Importe</th>
                        <th>Usuario credito</th>
                        <th>Fecha movimiento</th>
                      </tr>
                    </thead>
                    <tbody>
                      <template is="dom-repeat" items="[[movimientos]]">
                        <tr>
                          <td>[[item.mailDebito]]</td>
                          <td>[[item.importe]]</td>
                          <td>[[item.mailCredito]]</td>
                          <td>[[item.fechaMovimiento]]</td>
                        </tr>
                      </template>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </body>
      </div>
    `;
  }

  Validar() {
    this.$.AjaxValidarSaldo.url =
      "http://localhost:3000/apirest/cuentas/" +
      localStorage.getItem("usuarioLogin");
    this.$.AjaxValidarSaldo.generateRequest();

    this.$.ValidarMail.url =
      "http://localhost:3000/apirest/usuarios/" + this.$.email.value;
    this.$.ValidarMail.generateRequest();
  }

  handleUserResponseValidarMail(event) {
    var response = event.detail.response;
    console.log(response.email);
    if (!response.email) {
      alert(response.mensaje);
    } else {
      localStorage.setItem("validarMail", "ok");
    }
  }

  Transferir() {
    let validarMail = localStorage.getItem("validarMail");
    let validarSaldo = localStorage.getItem("validarSaldo");
    if (validarMail == "ok" && validarSaldo == "ok") {
      let email = localStorage.getItem("usuarioLogin");
      let opcion = "D";
      let importe = this.$.Importe.value;
      this.$.ActualizarCuenta.url =
        "http://localhost:3000/apirest/cuentas/" +
        email +
        "&" +
        opcion +
        "&" +
        importe;
      this.$.ActualizarCuenta.generateRequest();
      console.log("aca3");
      email = this.$.email.value;
      opcion = "C";

      this.$.ActualizarCuenta.url =
        "http://localhost:3000/apirest/cuentas/" +
        email +
        "&" +
        opcion +
        "&" +
        importe;
      this.$.ActualizarCuenta.generateRequest();
      console.log("aca4");
      this.$.GrabarMovimiento.url =
        "http://localhost:3000/apirest/movimientos/";
      this.$.GrabarMovimiento.body = {
        mailDebito: localStorage.getItem("usuarioLogin"),
        mailCredito: this.$.email.value,
        importe: this.$.Importe.value,
      };
      this.$.GrabarMovimiento.generateRequest();
      localStorage.setItem("validarSaldo", "");
      localStorage.setItem("validarMail", "");
      location.reload();
      this.formData = {};
    } else {
      alert("Debe validar el movimiento antes de transferir");
    }
  }

  handleMascaraResponse() {
    let email = localStorage.getItem("usuarioLogin");
    this.$.AjaxObtenerSaldo.url =
      "http://localhost:3000/apirest/cuentas/" + email;
    this.$.AjaxObtenerSaldo.generateRequest();

    this.$.AjaxVerMovimientos.url =
      "http://localhost:3000/apirest/movimientos/" + email;
    this.$.AjaxVerMovimientos.generateRequest();
    localStorage.setItem("validarSaldo", "");
    localStorage.setItem("validarMail", "");
    this.formData = {};
  }

  handleUserResponseValidarSaldo(event) {
    var response = event.detail.response;
    if (response.saldo < this.$.Importe.value) {
      alert("Importe a transferir es mayor al saldo de la cuenta");
    } else {
      localStorage.setItem("validarSaldo", "ok");
    }
  }
}

window.customElements.define("abm-cuenta", AbmCuenta);