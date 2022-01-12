import {SvgPlus} from "./4.js"
import {Messages} from "./Messages.js"

let messages = new Messages();

class AppPanel extends SvgPlus {
  constructor(el){
    super(el);

    this.update();
  }

  update(){
    let vContacts = this.querySelector("v-contacts");
    let vMessages = this.querySelector("v-messages");
    setTimeout(() => {
      vContacts.messages = messages;
      vMessages.messages = messages;
      vContacts.addEventListener("select", () => {
        vMessages.vContacts = vContacts;
      });
      vContacts.addEventListener("unselect", () => {
        vMessages.clear();
      });
    }, 5)
  }

  set welcome(value){
    if (value.indexOf("demo") !== -1) {
      messages.addMessage({
        "from": "garry~0~040303323",
        "to": "jeff~0~0401222333",
        "content": "hey jeff, what u doin bebe"
      });
      messages.addMessage({
        "from": "jeff~0~0401222333",
        "to": "garry~0~040303323",
        "content": "not much garry"
      })
      messages.addMessage({
        "from": "jeff~0~0401222333",
        "to": "bert~0~0400123123",
        "content": "miss you boo"
      })
      messages.addMessage({
        "to": "garry~0~040303323",
        "from": "bert~0~0400123123",
        "content": "i wanna eat you up u sexy mink",
      })
      messages.addMessage({
        "from": "garry~0~040303323",
        "to": "jeff~0~0401222333",
        "content": "you wanna hang?"
      })
      messages.addMessage({
        "from": "jeff~0~0401222333",
        "to": "garry~0~040303323",
        "content": "not really"
      })
      this.update();
    }
    let welcome = this.querySelector("span[name='welcome-message']");
    welcome.innerHTML = value;
  }
}

SvgPlus.defineHTMLElement(AppPanel)
