import {SvgPlus} from "./4.js"
import {Messages, Message, Contact} from "./Messages.js"

class VMessage extends SvgPlus {
  #read = new SvgPlus("p");
  #message = null;
  #messageName = null;
  #messageContent = null;
  #VMessages = null;

  constructor(message, vMessages) {
    super("div");
    //msg box
    let msg = this.createChild("div");

    // Senders name
    this.messageName = msg.createChild("div", {
      class: "message-name"
    })

    // Message Content
    this.messageContent = msg.createChild("div", {
      class: "message-content"
    });

    this.message = message;
    this.vMessages = vMessages;
  }

  set vMessages(mv){
    if (SvgPlus.is(mv, VMessages)) {
      this.#VMessages = mv;
      let isFrom = mv.from + "" == this.message.from + "";
      this.class = isFrom ? "from" : "to"
    } else {
      this.#VMessages = null;
      this.class = "";
    }
  }
  get vMessages(){
    return this.#VMessages;
  }

  delete(){
    if (this.vMessages != null) {
      this.vMessages.removeMessage(this);
    }
  }

  set message(message){
    if (message instanceof Message) {
      this.messageName.innerHTML = message.from.name;
      this.messageContent.innerHTML = message.content;
      message.vMessage = this;
      this.#message = message;

      this.read(message.read);
      message.onupdate = () => {
        this.read(message.read);
      }

      this.onclick = () => {
        if (message.read == false) {
          let time = this.time;
          message.read = time;
        }
      }
      this.ondblclick = () => {
        this.delete();
      }
    } else {
      this.#message = null;
    }
  }
  get message(){return this.#message;}

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
    if (!date) {
      if (this.contains(this.#read)) this.removeChild(this.#read)
    } else {
      this.#read.innerHTML = "read " + date
      if (!this.contains(this.#read)) this.appendChild(this.#read);
    }
  }
}

class VMessages extends SvgPlus {
  #messagesBox = null;
  #addMessageBox = null;
  #messages = null;
  #send = null;
  #input = null;
  #_from = null;
  #to = null;
  constructor(el){
    super(el);
    this.innerHTML = "";
    this.#messagesBox = this.createChild("div", {class: "messages"});
    let addMessage = new SvgPlus("div");
    addMessage.class = "add-message";
    this.#input = addMessage.createChild("textarea");
    this.#send = addMessage.createChild("span", {content: "send", class: "btn"});
    this.#addMessageBox = addMessage;
  }

  set vContacts(contacts) {
    this.from = contacts.from;
    this.to = contacts.to;
  }

  set messages(messages){
    if (messages instanceof Messages) {
      this.#messages = messages;
    }else {
      this.#messages = null;
    }
    this.update();
  }
  get messages(){
    return this.#messages;
  }

  set from(value){
    if (value != null) {
      this.#_from = new Contact(value) + "";
    } else {
      this.#_from = null;
    }
    this.update();
  }
  get from(){
    if (this.#_from == null) {
      return null;
    } else {
      return new Contact(this.#_from);
    }
  }

  set to(value){
    if (value != null) {
      this.#to = new Contact(value) + "";
    } else {
      this.#to = null;
    }
    this.update();
  }
  get to(){
    if (this.#to == null) {
      return null;
    } else {
      return new Contact(this.#to);
    }
  }

  addMessage(message) {
    let newM = typeof message === "string";
    newM |= typeof message === "object" && !(message instanceof Message);
    newM &= message != null;
    if (newM && this.messages != null) {
      message = this.messages.addMessage(message);
    }

    if (message instanceof Message) {
      this.#messagesBox.appendChild(new VMessage(message, this))
    }
  }

  removeMessage(message) {
    let vMessage = null;
    if (message instanceof Message) {
      vMessage = message.vMessage;
    } else if (SvgPlus.is(message, VMessage)) {
      vMessage = message;
      message = vMessage.message;
    }

    if (this.messages != null) {
      this.messages.removeMessage(message);
    }

    if (this.#messagesBox.contains(vMessage)) {
      this.#messagesBox.removeChild(vMessage);
    }
  }

  clear(){
    if (this.contains(this.#addMessageBox)) {
      this.removeChild(this.#addMessageBox);
    }
    this.#messagesBox.innerHTML = "";
  }

  update() {
    let from = this.from;
    let to = this.to;
    let messages = this.messages;

    if (to == null || from == null || messages == null) {
      this.clear();
      return;
    }

    //get messages between to and from
    messages = messages.getMessagesBetween(from, to);

    //add message input box
    if (!this.contains(this.#addMessageBox)) {
      this.appendChild(this.#addMessageBox);
    }

    //add all messages
    this.#messagesBox.innerHTML = "";
    for (let message of messages) {
      this.addMessage(message);
    }

    //clear message input textarea
    this.#input.value = "";

    this.#send.onclick = () => {
      let message = this.addMessage({
        from: from,
        to: to,
        content: this.#input.value
      })
      this.#input.value = "";
    }
  }
}

SvgPlus.defineHTMLElement(VMessages)
