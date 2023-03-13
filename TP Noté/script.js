class MyMeteo extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const ville = this.getAttribute("ville") || "Paris";
    const shadowDom = this.attachShadow({ mode: "open" });
    shadowDom.innerHTML = `
      <div class="loading">Chargement de la météo de ${ville}...</div>
    `;

    const xhr = new XMLHttpRequest();
    xhr.open("GET", `https://www.prevision-meteo.ch/services/json/${ville}`);
    xhr.onload = () => {
      const response = JSON.parse(xhr.responseText);
      if (xhr.status === 200) {
        if (response.errors) {
          shadowDom.innerHTML = `
            Erreur lors du chargement de la météo de ${ville}
          `;
          return;
        } else {
          const time = response.current_condition.date;
          const hour = response.current_condition.hour;
          const wind = response.current_condition.wnd_spd;
          const humidity = response.current_condition.humidity;
          const img = response.current_condition.icon_big;
          shadowDom.innerHTML = `
            <style>
              div {
                display : inline-block;
                background-color: #fff;
                border-radius: 20px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
                padding: 20px;
                margin: 20px;
                width: 300px;
                text-align: center;
              }
              p {
                margin: 0;
              }
              img {
                width: 100px;
              }
            </style>
            <div>
              <h2>${ville}</h2>
              <p>Date : ${time}</p>
              <p>Heure locale: ${hour}</p>
              <p>Vitesse du vent : ${wind} km/h</p>
              <p>Taux d'humidité : ${humidity} %</p>
              <img src="${img}" />
            </div>
          `;
        }
      }
    };
    xhr.send();
  }
}

customElements.define("my-meteo", MyMeteo);
