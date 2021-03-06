import {SvgPlus, TBody} from "./4.js"


class LoginForm extends SvgPlus {
  _username = "";
  _password = "";
  constructor(el){
    super(el);
    this.makeInputBoxes();
  }

  get username(){return this._username;}
  get password(){return this._password;}

  makeInputBoxes(){
    let inputBoxes = this.querySelector("div[name='input-boxes']");

    let table = new SvgPlus("table");
    let tbody = new TBody(2, 2);
    tbody[0][0].value = "Username:"
    let username = tbody[0][1].createChild("input")
    tbody[1][0].value = "Password:"
    let password = tbody[1][1].createChild("input", {type: "password"})
    table.appendChild(tbody);

    inputBoxes.innerHTML = "";
    inputBoxes.appendChild(table);

    let loginBtn = document.querySelector("div[class='btn']");
    loginBtn.onclick = () => {
      this._username = username.value;
      this._password = password.value;
      const event = new Event("submit");
      this.dispatchEvent(event);
    }
  }
}

SvgPlus.defineHTMLElement(LoginForm)
