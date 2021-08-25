const template = document.createElement("template");
template.innerHTML = /*html*/`
<div class="col">
  <div class="card h-100 bg-light">
    <div class="card-header">
      <h3 ref="title" class="card-title"></h3>
    </div>

    <slot name="picture" class="card-img-top"></slot>

    <div ref="content" class="card-body">
      <slot name="content"></slot>
    </div>

    <div class="card-footer text-end">
      <div ref="status" style="display: inline;"></div>

      <!-- Badge : GitHub repository -->
      <a href-ref="repository" target="_blank">
        <div class="badge bg-dark">
          <i class="bi bi-github"></i> GitHub
        </div>
      </a>
    </div>
  </div>
</div>
`;

class ProjectCard extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    const parentCSSList = document.head.querySelectorAll("link[rel='stylesheet']");
    for (const css of parentCSSList) {
      shadowRoot.appendChild(css.cloneNode(true));
    }
    shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    //-- Fill attributes --
    if (this.hasAttributes()) {
      var attrs = this.attributes;
      for (const attr of attrs) {
        const k = attr.name;

        if (k === "status") {
          let icon = null;
          let text = null;
          let color = null;
          switch (attr.value) {
            case "development":
              icon = "clock-history";
              text = "En cours";
              color = "warning";
              break;
            case "mature":
              icon = "check-lg";
              text = "Actif";
              color = "success";
              break;
            case "archived":
              icon = "archive";
              text = "Archivé";
              color = "danger";
              break;
            default:
              icon = "question-lg";
              text = "Inconnu";
              color = "light";
              break;
          }

          const badge = this.shadowRoot.querySelector(`*[ref='status']`);
          badge.innerHTML = `<span class="badge bg-${color}">
            <i class="bi bi-${icon}"></i>&nbsp;${text}
          </span>`;
          continue;
        }

        const element = this.shadowRoot.querySelector(`*[ref='${k}']`);
        if (element) {
          // Replace the full inner html
          element.innerHTML = attr.value;
          continue;
        }

        const elementSrc = this.shadowRoot.querySelector(`*[href-ref='${k}']`);
        if (elementSrc) {
          // Replace the src attribute
          elementSrc.setAttribute("href", attr.value);
          continue;
        }

        console.warn(`Can't handle attribute ${k}`, this);
      }
    }
  }
}

customElements.define("project-card", ProjectCard);