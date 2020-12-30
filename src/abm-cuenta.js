import { PolymerElement, html } from "@polymer/polymer/polymer-element.js";
import "./shared-styles.js";
import "@material/mwc-textfield";
import "@material/mwc-button";
import "@material/mwc-icon";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/app-route/app-location.js";

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
        <h2>Saldo de la Cuenta</h2>
        <p>
          <iron-ajax
            id="ActualizarCuenta"
            url="[[urlCuenta]]"
            method="PUT"
            handle-as="json"
            on-response="handleUserResponse"
          >
          </iron-ajax>

          <iron-ajax
            id="GrabarMovimiento"
            url="[[urlMovimiento]"
            method="POST"
            content-type="application/json"
            handle-as="json"
            on-response="handleUserResponse"
          >
          </iron-ajax>

          <iron-ajax
            auto
            url="http://localhost:3000/apirest/movimientos/"
            method="GET"
            handle-as="json"
            last-response="{{movimientos}}"
          ></iron-ajax>

          <iron-ajax
            auto
            url="http://localhost:3000/apirest/cuentas/a@gmail.com"
            method="GET"
            handle-as="json"
            last-response="{{cuentas}}"
          ></iron-ajax>
        </p>

        <div>
          <template is="dom-repeat" items="[[cuentas]]">
            <h2>$ [[item.saldo]]</h2>
          </template>
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
  Transferir() {
    let email = "a@gmail.com";
    let opcion = "D";
    let importe = this.$.Importe.value;
    this.$.ActualizarCuenta.url = "http://localhost:3000/apirest/cuentas/"+email+"&"+opcion+"&"+importe;
    this.$.ActualizarCuenta.generateRequest();

    email = this.$.email.value;
    opcion = "C";

    this.$.ActualizarCuenta.url = "http://localhost:3000/apirest/cuentas/"+email+"&"+opcion+"&"+importe;
    this.$.ActualizarCuenta.generateRequest();

    this.$.GrabarMovimiento.url = "http://localhost:3000/apirest/movimientos/";
    this.$.GrabarMovimiento.body = {
      mailDebito: "a@gmail.com",
      mailCredito: this.$.email.value,
      importe: this.$.Importe.value,
    };
    this.$.GrabarMovimiento.generateRequest();
    this.set("route.path", "/dashboard");
    this.formData = {};
  }
  handleUserResponse(event) {
    // var response = JSON.parse(event.detail.response);
    var response = event.detail.response;
    // if (response.email) {
    // this.error = "";
    // this.storedUser = {
    //   loggedin: true,
    // };
    // redirect to Secret Quotes
    //this.set("route.path", "/accounts");
    //}
    // reset form data
    
    //this.formData = {};
  }
}

window.customElements.define("abm-cuenta", AbmCuenta);
