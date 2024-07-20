import { CLOSE_ICON, MESSAGE_ICON, styles } from "./assets.js";

class MessageWidget {
  constructor(position = "bottom-right") {
    this.position = this.getPosition(position);
    this.open = false;
    this.initialize();
    this.injectStyles();
  }

  position = "";
  open = false;
  widgetContainer = null;

  getPosition(position) {
    const [vertical, horizontal] = position.split("-");
    return {
      [vertical]: "30px",
      [horizontal]: "30px",
    };
  }

  async initialize() {
    /**
     * Create and append a div element to the document body
     */
    const container = document.createElement("div");
    container.style.position = "fixed";
    Object.keys(this.position).forEach(
      (key) => (container.style[key] = this.position[key])
    );
    document.body.appendChild(container);

    /**
     * Create a button element and give it a class of button__container
     */
    const buttonContainer = document.createElement("button");
    buttonContainer.classList.add("button__container");

    /**
     * Create a span element for the widget icon, give it a class of 'widget__icon', update it's innerHTML property to an icon which would serve as the widget icon.
     */
    const widgetIconElement = document.createElement("span");
    widgetIconElement.innerHTML = MESSAGE_ICON;
    widgetIconElement.classList.add("widget__icon");
    this.widgetIcon = widgetIconElement;

    /**
     * Create a span element for the close icon, give it a class of 'widget__icon' and 'widget__hidden' which would be removed whenever the widget is closed, update it's innerHTML property to an icon which would serve as the widget icon during that state.
     */
    const closeIconElement = document.createElement("span");
    closeIconElement.innerHTML = CLOSE_ICON;
    closeIconElement.classList.add("widget__icon", "widget__hidden");
    this.closeIcon = closeIconElement;

    buttonContainer.appendChild(this.widgetIcon);
    buttonContainer.appendChild(this.closeIcon);
    buttonContainer.addEventListener("click", this.toggleOpen.bind(this));

    this.widgetContainer = document.createElement("div");
    this.widgetContainer.classList.add("widget__hidden", "widget__container");

    this.addSubmitHandler();
    container.appendChild(this.widgetContainer);
    container.appendChild(buttonContainer);
  }
  addSubmitHandler() {
    const container = document.createElement('div');
    container.classList.add('container');
    container.innerHTML = `
                    <style>
                        /* Estilos para el formulario */
                        .container {
                        padding: 10px;
                        background-color: #0f172a;
                        display: flex;
                        flex-direction: column;
                        gap: 10px;
                        }

                        form {
                            display: flex;
                            flex-direction: column;
                            width: 300px;
                            margin: 0 auto;
                            background-color: #0f172a;
                            padding: 20px;
                            border: 1px solid #ccc;
                            border-radius: 5px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }
                        h3 {
                          margin:auto;
                          color: white;
                        }
                        label {
                            margin-bottom: 5px;
                            color: white;
                            font-weight: bold;
                        }
                        input {
                            margin-bottom: 10px;
                            padding: 8px;
                            border: 1px solid #ccc;
                            border-radius: 4px;
                        }
                        button {
                            padding: 10px;
                            background-color: 240 10% 3.9%;
                            color: black;
                            cursor: pointer;
                            border-color: #0f172a;
                            border-style: solid;
                            border-width: 1px;
                            border-radius: 4px;
                            font-weight: bold;

                            }
                            button:hover {
                              background-color: #0f172a;
                              color: white;
                              border-color: 240 10% 3.9%;
                              border-style: solid;
                              border-width: 1px;
                              border-radius: 4px;
                              font-weight: bold;

                        }
                    </style>
                    <h3>Chat Name</h3>
                    <form id="loginForm">
                        <label for="email">Email</label>
                        <input type="text" id="email" name="email" required>
                        <label for="password">Contraseña</label>
                        <input type="password" id="password" name="password" required>
                        <button type="submit">Iniciar Sesión</button>
                    </form>
                `;
    this.widgetContainer.attachShadow({ mode: 'open' });
    this.widgetContainer.shadowRoot.appendChild(container);

    this.widgetContainer.shadowRoot.getElementById('loginForm').addEventListener('submit', (event) => {
        event.preventDefault();
        console.log(this.widgetContainer.shadowRoot)
        const email = this.widgetContainer.shadowRoot.getElementById('email').value;
        const password = this.widgetContainer.shadowRoot.getElementById('password').value;
        fetch(`https://api-dev.griot.com.co/api/v1/public/identity/tenant/unknown/user/${email}/sign-in`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email, password: password })
        })
        .then(response => response.json())
        .then(data => {
          console.log("procesando data"+ data)
          if (data.access_token) {
            localStorage.setItem('access_token', data.access_token);
            console.log(data);
            alert('Login successful!');
          } else {
            alert('Invalid credentials');
          }
        })
        .catch(error => console.error('Error:', error));
      });

  }

  injectStyles() {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = styles.replace(/^\s+|\n/gm, "");

    document.head.appendChild(styleTag);
  }

  toggleOpen() {
    this.open = !this.open;
    if (this.open) {
      this.widgetIcon.classList.add("widget__hidden");
      this.closeIcon.classList.remove("widget__hidden");
      this.widgetContainer.classList.remove("widget__hidden");
    } else {
      this.addSubmitHandler();
      this.widgetIcon.classList.remove("widget__hidden");
      this.closeIcon.classList.add("widget__hidden");
      this.widgetContainer.classList.add("widget__hidden");
    }
  }
}

function initializeWidget() {
  return new MessageWidget();
}

initializeWidget();