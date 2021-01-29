import { PolymerElement, html } from "@polymer/polymer/polymer-element.js";
import "./shared-styles.js";
import "@material/mwc-textfield";
import "@material/mwc-button";
import "@material/mwc-icon";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/app-route/app-location.js";
import "@polymer/app-route/app-route.js";
import "@polymer/paper-spinner/paper-spinner.js";

class CotizUsd extends PolymerElement {
  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          display: block;

          padding: 10px;
        }
      </style>

      <iron-ajax
        auto
        id="consultaCotizacionAjax"
        method="GET"
        url="https://www.dolarsi.com/api/api.php?type=valoresprincipales"
        handle-as="json"
        last-response="{{cotiz}}"
        loading="{{cargando}}"
      ></iron-ajax>

      <div class="card">
        <h2>Consulta de cotizaciones</h2>

        <paper-spinner alt="Cargando la cotizacion..." active="[[cargando]]"></paper-spinner>

        <template is="dom-if" if="{{!cargando}}">
          <ul>
            <template is="dom-repeat" items="{{cotiz}}">
              <h2>[[item.casa.nombre]]</h2>
              <li>Cotizacion de Compra: [[item.casa.compra]]</li>
              <li>Cotizacion de Venta: [[item.casa.venta]]</li>
            </template>
          </ul>
        </template>
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
      this.getCotizacion();
    }
  }

  getCotizacion() {
    this.$.consultaCotizacionAjax.generateRequest();
  }
}
window.customElements.define("cotiz-usd", CotizUsd);
