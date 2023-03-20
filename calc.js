const ButtonsConfigs = [
    { id: "n-7", value: "7", htmlContent: '<i class="fa-solid fa-7"></i>' },
    { id: "n-8", value: "8", htmlContent: '<i class="fa-solid fa-8"></i>' },
    { id: "n-9", value: "9", htmlContent: '<i class="fa-solid fa-9"></i>' },
    {
      id: "op-multiply",
      value: "*",
      htmlContent: '<i class="fa-solid fa-xmark"></i>'
    },
  
    { id: "n-4", value: "4", htmlContent: '<i class="fa-solid fa-4"></i>' },
    { id: "n-5", value: "5", htmlContent: '<i class="fa-solid fa-5"></i>' },
    { id: "n-6", value: "6", htmlContent: '<i class="fa-solid fa-6"></i>' },
    {
      id: "op-substract",
      value: "-",
      htmlContent: '<i class="fa-solid fa-minus"></i>'
    },
  
    { id: "n-1", value: "1", htmlContent: '<i class="fa-solid fa-1"></i>' },
    { id: "n-2", value: "2", htmlContent: '<i class="fa-solid fa-2"></i>' },
    { id: "n-3", value: "3", htmlContent: '<i class="fa-solid fa-3"></i>' },
    { id: "op-add", value: "+", htmlContent: '<i class="fa-solid fa-plus"></i>' },
  
    { id: "n-0", value: "0", htmlContent: '<i class="fa-solid fa-0"></i>' },
    { id: "n-Dot", value: ".", htmlContent: "." },
    {
      id: "op-plus-minus",
      value: "plusminus",
      htmlContent: '<i class="fa-solid fa-plus-minus"></i>'
    },
    {
      id: "op-divide",
      value: "/",
      htmlContent: '<i class="fa-solid fa-divide"></i>'
    },
  
    { id: "op-ac", value: "clear", htmlContent: "AC" },
    {
      id: "op-erase",
      value: "erase",
      htmlContent: '<i class="fa-solid fa-delete-left"></i>'
    },
    {
      id: "op-equal",
      value: "equal",
      htmlContent: '<i class="fa-solid fa-equals"></i>'
    }
  ];
  
  class Calculator {
    buttons = [];
    calculatorElement;
    keyboardElement;
    operationElement;
    resultElement;
  
    leftOperand = null;
    rightOperand = null;
    operation = null;
    result = 0;
  
    constructor(id) {
      this.calculatorElement = document.getElementById(id);
      if (!this.calculatorElement) {
        throw new Error(
          `Unable to initialize calculator. No element with id '${id}' found.`
        );
      }
  
      this.initComponents();
      this.initEvents();
    }
  
    initComponents() {
      // Crée la calutrice
      let calculatorScreen = document.createElement("div");
      calculatorScreen.classList.add("cal-ecran");
  
      this.operationElement = document.createElement("div");
      this.operationElement.id = "calOperation";
      this.operationElement.classList.add("cal-operation");
  
      this.resultElement = document.createElement("div");
      this.resultElement.id = "calResult";
      this.resultElement.classList.add("cal-resultat");
  
      calculatorScreen.appendChild(this.operationElement);
      calculatorScreen.appendChild(this.resultElement);
  
      this.keyboardElement = document.createElement("div");
      this.keyboardElement.id = "calKeyboard";
      this.keyboardElement.classList.add("cal-keyboard");
  
      this.calculatorElement.appendChild(calculatorScreen);
      this.calculatorElement.appendChild(this.keyboardElement);
  
      // Crée les buttons
      ButtonsConfigs.forEach((btnConfig) => {
        let btn = this.initButton(btnConfig);
        this.buttons.push(btn);
        this.keyboardElement.appendChild(btn.html);
      });
    }
  
    initEvents() {
      this.keyboardElement.addEventListener("btn-numeric", (evt) => {
        this.onNumericBtnClick(evt);
      });
  
      this.keyboardElement.addEventListener("btn-operator", (evt) => {
        this.onOperatorBtnClick(evt);
      });
    }
  
    /**
     * Initialise un boutton de calculatrice
     * @param {{id: string, value: string, htmlContent: string}} config
     * @returns {{html: HTMLButtonElement, type: string}} button created
     */
    initButton(config) {
      let button = { html: HTMLButtonElement.prototype, type: "" };
  
      button.html = document.createElement("button");
      button.html.setAttribute("data-cal-btn", config.id);
      button.html.innerHTML = config.htmlContent;
      button.html.classList.add("btn", `btn-${config.id}`);
  
      if (config.id.includes("op-")) {
        button.type = "btn-operator";
      } else if (config.id.includes("n-")) {
        button.type = "btn-numeric";
      }
  
      // setup event handling for a button
      button.html.addEventListener("click", (evt) => {
        evt.preventDefault();
  
        button.html.dispatchEvent(
          new CustomEvent(button.type, {
            bubbles: true,
            detail: config
          })
        );
      });
  
      return button;
    }
  
    onNumericBtnClick(evt) {
      evt.stopPropagation();
      this.resultElement.textContent += evt.detail.value;
      this.result = parseFloat(this.resultElement.textContent);
  
      if (this.operation === null) {
        if (this.leftOperand !== null) {
          this.leftOperand = this.result;
        } else {
          this.leftOperand = parseFloat(evt.detail.value);
          this.resultElement.textContent = this.leftOperand;
        }
      } else if (typeof this.operation == "string" && this.operation) {
        if (this.rightOperand !== null) {
          this.rightOperand = this.result;
        } else {
          this.rightOperand = parseFloat(evt.detail.value);
          this.resultElement.textContent = this.rightOperand;
        }
      }
    }
  
    onOperatorBtnClick(evt) {
      evt.stopPropagation();
  
      if (evt.detail.id === "op-equal") {
        if (this.rightOperand) {
          this.operationElement.innerHTML = `${this.leftOperand} <span data-cal-btn='${evt.detail.id}'>${this.operation}</span> ${this.rightOperand}`;
          this.result = eval(
            this.leftOperand + this.operation + this.rightOperand
          );
          this.resultElement.textContent = this.result.toFixed(2);
  
          this.resetVariables();
        }
      } else if (evt.detail.id === "op-ac") {
        this.resetVariables();
        this.operationElement.innerHTML = "";
        this.resultElement.textContent = "";
        this.result = null;
      } else if (evt.detail.id === "op-erase") {
        if (this.operation === null) {
          if (
            this.leftOperand !== null &&
            this.leftOperand.toString().length > 1
          ) {
            this.leftOperand = parseFloat(
              this.leftOperand
                .toString()
                .substr(0, this.leftOperand.toString().length - 1)
            );
          } else {
            this.leftOperand = null;
          }
          this.resultElement.textContent = this.leftOperand ?? "";
          this.result = this.leftOperand;
        } else if (typeof this.operation === "string" && this.operation) {
          if (
            this.rightOperand !== null &&
            this.rightOperand.toString().length > 1
          ) {
            this.rightOperand = parseFloat(
              this.rightOperand
                .toString()
                .substr(0, this.rightOperand.toString().length - 1)
            );
          } else {
            this.rightOperand = null;
          }
          this.resultElement.textContent = this.rightOperand ?? "";
          this.result = this.rightOperand;
        }
      } else if (evt.detail.id === "op-plus-minus") {
        this.result = this.result ? -1 * this.result : null;
        this.resultElement.textContent = this.result ?? "";
        this.operation === null
          ? (this.leftOperand = this.result)
          : (this.rightOperand = this.result);
      } else {
        this.result = null;
        this.resultElement.textContent = "";
        this.operation = evt.detail.value;
        this.operationElement.innerHTML = `${this.leftOperand} <span data-cal-btn='${evt.detail.id}'>${this.operation}</span>`;
      }
    }
  
    resetVariables() {
      this.leftOperand = null;
      this.rightOperand = null;
      this.operation = null;
    }
  }
  
  let calculator = new Calculator("appCalculator");
  