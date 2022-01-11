import {SvgPlus} from "./4.js"
import {Messages, Contact} from "./Messages.js"


class Message extends SvgPlus {
  constructor(message, from) {
    super("div");
    from = new Contact(from)+"";
    let isFrom = message.from+"" == from;
    this.class = isFrom ? "from" : "to";
    if (isFrom) {
      this.createChild("div", {
        content: message.content,
        class: "message-content"
      });
      this.createChild("div", {
        content: message.from.name + ":",
        class: "message-name"
      })
    } else {
      this.createChild("div", {
        content: message.from.name + ":",
        class: "message-name"
      })
      this.createChild("div", {
        content: message.content,
        class: "message-content"
      });
    }
  }
}

class MessageView extends SvgPlus {
  #messagesBox = null;
  #addMessage = null;
  #messages = null;
  #send = null;
  #input = null;
  constructor(el){
    super(el);
    this.innerHTML = "";
    this.#messagesBox = this.createChild("div", {class: "messages"});
    let addMessage = new SvgPlus("div");
    addMessage.class = "add-message";
    this.#input = addMessage.createChild("textarea");
    this.#send = addMessage.createChild("span", {content: "send", class: "btn"});
    this.#addMessage = addMessage;
  }



  set messages(messages){
    if (messages instanceof Messages) {
      this.#messages = messages;
    }else {
      this.#messages = null;
    }
  }

  addMessage(message, from) {
    this.#messagesBox.appendChild(new Message(message, from))
  }

  pushMessage(message, from){
    this.addMessage(message, from);
  }

  clear(){
    if (this.contains(this.#addMessage)) {
      this.removeChild(this.#addMessage);
    }
  }

  setRecipients(from, to) {
    let messages = this.#messages
    if (messages != null) {
      messages = messages.getMessagesBetween(from, to);
    } else {
      messages = [];
    }
    console.log(messages);

    this.#messagesBox.innerHTML = "";
    for (let message of messages) {
      this.addMessage(message, from);
    }
    if (!this.contains(this.#addMessage)) {
      this.appendChild(this.#addMessage);
    }
    this.#input.value = "";
    this.#send.onclick = () => {
      let message = this.#messages.addMessage({
        from: from,
        to: to,
        content: this.#input.value
      })
      this.pushMessage(message, from);
    }
  }
}

SvgPlus.defineHTMLElement(MessageView)
