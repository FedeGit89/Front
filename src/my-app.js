/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { PolymerElement, html } from "@polymer/polymer/polymer-element.js";
import {
  setPassiveTouchGestures,
  setRootPath,
} from "@polymer/polymer/lib/utils/settings.js";
import "@polymer/app-layout/app-drawer/app-drawer.js";
import "@polymer/app-layout/app-drawer-layout/app-drawer-layout.js";
import "@polymer/app-layout/app-header/app-header.js";
import "@polymer/app-layout/app-header-layout/app-header-layout.js";
import "@polymer/app-layout/app-scroll-effects/app-scroll-effects.js";
import "@polymer/app-layout/app-toolbar/app-toolbar.js";
import "@polymer/app-route/app-location.js";
import "@polymer/app-route/app-route.js";
import "@polymer/iron-pages/iron-pages.js";
import "@polymer/iron-selector/iron-selector.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "./my-icons.js";

// Gesture events like tap and track generated from touch will not be
// preventable, allowing for better scrolling performance.
setPassiveTouchGestures(true);

// Set Polymer's root path to the same value we passed to our service worker
// in `index.html`.
setRootPath(MyAppGlobals.rootPath);

class MyApp extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          --app-primary-color: #4285f4;
          --app-secondary-color: black;

          display: block;
        }

        app-drawer-layout:not([narrow]) [drawer-toggle] {
          display: none;
        }

        app-header {
          color: #fff;
          background-color: var(--app-primary-color);
        }

        app-header paper-icon-button {
          --paper-icon-button-ink-color: white;
        }

        .drawer-list {
          margin: 0 20px;
        }

        .drawer-list a {
          display: block;
          padding: 0 16px;
          text-decoration: none;
          color: var(--app-secondary-color);
          line-height: 40px;
        }

        .drawer-list a.iron-selected {
          color: black;
          font-weight: bold;
        }
      </style>

      <app-location route="{{route}}" url-space-regex="^[[rootPath]]">
      </app-location>

      <app-route
        route="{{route}}"
        pattern="[[rootPath]]:page"
        data="{{routeData}}"
        tail="{{subroute}}"
      >
      </app-route>

      <app-drawer-layout fullbleed="" narrow="{{narrow}}">
        <!-- Drawer content -->
        <app-drawer id="drawer" slot="drawer" swipe-open="[[narrow]]">
          <app-toolbar>Menu</app-toolbar>
          <iron-selector
            selected="[[page]]"
            attr-for-selected="name"
            class="drawer-list"
            role="navigation"
          >
            <span id="lnkMenu">
              <a name="datos" href="[[rootPath]]datos">Mis Datos</a>
              <a name="cuenta" href="[[rootPath]]cuenta">Cuenta</a>
              <a name="cotizacion" href="[[rootPath]]cotizacion">Cotizacion</a>
              <a name="salir" href="[[rootPath]]salir">Salir</a>
            </span>
          </iron-selector>
        </app-drawer>

        <!-- Main content -->
        <app-header-layout has-scrolling-region="">
          <app-header slot="header" condenses="" reveals="" effects="waterfall">
            <app-toolbar>
              <paper-icon-button
                icon="my-icons:menu"
                drawer-toggle=""
              ></paper-icon-button>
              <div main-title="">Proyecto</div>
            </app-toolbar>
          </app-header>

          <iron-pages
            selected="[[page]]"
            attr-for-selected="name"
            selected-attribute="active"
            role="main"
          >
            <view-dashboard name="dashboard"></view-dashboard>
            <alta-usuario name="registrar"></alta-usuario>
            <modif-usuario name="datos"></modif-usuario>
            <abm-cuenta name="cuenta"></abm-cuenta>
            <cotiz-usd name="cotizacion"></cotiz-usd>
            <login-app name="login"></login-app>
            <view-404 name="view404"></view-404>
            <salir-app name="salir"></salir-app>
          </iron-pages>
        </app-header-layout>
      </app-drawer-layout>
    `;
  }

  static get properties() {
    return {
      page: {
        type: String,
        reflectToAttribute: true,
        observer: "_pageChanged",
      },
      routeData: Object,
      subroute: Object,
    };
  }

  static get observers() {
    return ["_routePageChanged(routeData.page)"];
  }

  _routePageChanged(page) {
    // Show the corresponding page according to the route.
    //
    // If no page was found in the route data, page will be an empty string.
    // Show 'view1' in that case. And if the page doesn't exist, show 'view404'.
    if ((!page) || (page == "components") || (page == "login")) {
      this.page = "login";
      this.$.lnkMenu.hidden = true;
    } else if (["registrar","salir"].indexOf(page) !== -1) {
      this.page = page;
      this.$.lnkMenu.hidden = true;
    } else if (["dashboard", "cuenta", "datos", "cotizacion"].indexOf(page) !== -1) {
      this.$.lnkMenu.hidden = false;
      this.page = page;
    } else {
      this.$.lnkMenu.hidden = true;
      this.page = "view404";
    }

    // Close a non-persistent drawer when the page & route are changed.
    if (!this.$.drawer.persistent) {
      this.$.drawer.close();
    }
  }

  _pageChanged(page) {
    // Import the page component on demand.
    //
    // Note: `polymer build` doesn't like string concatenation in the import
    // statement, so break it up.
    switch (page) {
      case "dashboard":
        import("./view-dashboard.js");
        break;
      case "registrar":
        import("./alta-usuario.js");
        break;
      case "cuenta":
        import("./alta-movimiento.js");
        break;
      case "datos":
        import("./modif-usuario.js");
        break;
      case "cotizacion":
        import("./cotiz-usd.js");
        break;
      case "login":
        import("./login-app.js");
        break;
      case "view404":
        import("./view-404.js");
        break;
      case "salir":
        import("./salir-app.js");
        break;
    }
  }
}

window.customElements.define("my-app", MyApp);
