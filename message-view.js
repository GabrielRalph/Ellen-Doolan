import {SvgPlus} from "./4.js"
import {Messages, Contact} from "./Messages.js"


class Message extends SvgPlus {
  #read = null
  constructor(message, from) {
    super("div");
    from = new Contact(from)+"";
    let isFrom = message.from+"" == from;
    this.class = isFrom ? "from" : "to";
    let msg = this.createChild("div");
    msg.createChild("div", {
      content: message.from.name + ":",
      class: "message-name"
    })
    msg.createChild("div", {
      content: message.content,
      class: "message-content"
    });
    if (message.read != false) {
      this.read(message.read);
    }
    this.onclick = () => {
      console.log(message);
      if (message.read == false) {
        let time = this.time;
        message.read = time;
        this.read(time);
      }
    }
  }

  get time(){
    let date = (new Date()+"").split(" ");
    let hr = date[4].split(":");
    let m = hr[1];
    hr = parseInt(hr[0]);
    let ampm = "am";
    if (hr > 12) {
      hr -= 12;
      ampm = "pm";
    }
    return `${hr}:${m} ${ampm}`
  }

  read(date){
    if (date == null && this.contains(this.#read)) {
      this.removeChild(this.#read)
    } else {
      if (this.#read == null) {
        this.#read = this.createChild("p", {content: "read " + date})
      } else {
        this.removeChild(this.#read);
      }
      this.#read.innerHTML = "read " + date
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
    this.#messagesBox.innerHTML = "";
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
      this.#input.value = "";
    }
  }
}

SvgPlus.defineHTMLElement(MessageView)
