import {SvgPlus} from "./4.js"
import {Messages} from "./Messages.js"


class AppPanel extends SvgPlus {
  constructor(el){
    super(el);
    let messages = new Messages();
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


    let contacts = this.querySelector("contacts-view");
    let messageView = this.querySelector("message-view");
    setTimeout(() => {
      contacts.messages = messages;
      messageView.messages = messages;
      contacts.addEventListener("select", () => {
        messageView.setRecipients(contacts.fromKey, contacts.toKey);
      });
      contacts.addEventListener("unselect", () => {
        messageView.clear();
      });
    }, 5)
  }
}

SvgPlus.defineHTMLElement(AppPanel)
