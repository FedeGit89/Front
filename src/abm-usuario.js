import { PolymerElement, html } from "@polymer/polymer/polymer-element.js";
import "./shared-styles.js";
import "@material/mwc-textfield";
import "@material/mwc-button";
import "@material/mwc-icon";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/app-route/app-location.js";

class AbmUsuario extends PolymerElement {
  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          display: block;

          padding: 10px;
        }
      </style>

      <div class="card">
        <h2>Consulta de usuarios</h2>

        <p>
          <iron-ajax
            auto
            url="http://localhost:3000/apirest/usuarios/"
            method="GET"
            handle-as="json"
            last-response="{{usuario}}"
          ></iron-ajax>
        </p>

        <p>
          <mwc-button raised label="Alta" on-click="consultar"></mwc-button>
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
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Dni</th>
                      </tr>
                    </thead>
                    <tbody>
                      <template is="dom-repeat" items="[[usuario]]">
                        <tr>
                          <td>[[item.nombre]]</td>
                          <td>[[item.apellido]]</td>
                          <td>[[item.dni]]</td>
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
  consultar() {
    this.$.ConsultarAjax.url = "http://localhost:3000/apirest/usuarios/";
    this.$.ConsultarAjax.generateRequest();
  }
  handleUserResponse(event) {
    // var response = JSON.parse(event.detail.response);
    var response = event.detail.response;
    if (response.email) {
      this.error = "";
      this.storedUser = {
        loggedin: true,
      };
      // redirect to Secret Quotes
      this.set("route.path", "/accounts");
    }
    // reset form data
    this.formData = {};
  }
  handleUserError(event) {
    this.error = JSON.parse(event.detail.request.xhr.response).mensaje;
  }
}

window.customElements.define("abm-usuario", AbmUsuario);
