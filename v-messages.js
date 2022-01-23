import {SvgPlus} from "./4.js"
import {Messages, Message, Contact} from "./Messages.js"

class VMessage extends SvgPlus {
  _read = new SvgPlus("p");
  _message = null;
  _messageName = null;
  _messageContent = null;
  _VMessages = null;

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
      this._VMessages = mv;
      let isFrom = mv.from + "" == this.message.from + "";
      this.class = isFrom ? "from" : "to"
    } else {
      this._VMessages = null;
      this.class = "";
    }
  }
  get vMessages(){
    return this._VMessages;
  }

  delete(){
    if (this.vMessages != null) {
      this.vMessages.removeMessage(this);
    }
  }

  set message(message){
    if (message instanceof Message) {
      this.messageName.innerHTML = message.from.name + ": ";
      this.messageContent.innerHTML = message.content;
      message.vMessage = this;
      this._message = message;

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
      this._message = null;
    }
  }
  get message(){return this._message;}

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
      if (this.contains(this._read)) this.removeChild(this._read)
    } else {
      this._read.innerHTML = "read " + date
      if (!this.contains(this._read)) this.appendChild(this._read);
    }
  }
}

class VMessages extends SvgPlus {
  _messagesBox = null;
  _addMessageBox = null;
  _messages = null;
  _send = null;
  _input = null;
  __from = null;
  _to = null;
  constructor(el){
    super(el);
    this.innerHTML = "";
    this._messagesBox = this.createChild("div", {class: "messages"});
    let addMessage = new SvgPlus("div");
    addMessage.class = "add-message";
    this._input = addMessage.createChild("textarea");
    this._send = addMessage.createChild("span", {content: "send", class: "btn"});
    this._addMessageBox = addMessage;
  }

  set vContacts(contacts) {
    this.from = contacts.from;
    this.to = contacts.to;
  }

  set messages(messages){
    if (messages instanceof Messages) {
      this._messages = messages;
    }else {
      this._messages = null;
    }
    this.update();
  }
  get messages(){
    return this._messages;
  }

  set from(value){
    if (value != null) {
      this.__from = new Contact(value) + "";
    } else {
      this.__from = null;
    }
    this.update();
  }
  get from(){
    if (this.__from == null) {
      return null;
    } else {
      return new Contact(this.__from);
    }
  }

  set to(value){
    if (value != null) {
      this._to = new Contact(value) + "";
    } else {
      this._to = null;
    }
    this.update();
  }
  get to(){
    if (this._to == null) {
      return null;
    } else {
      return new Contact(this._to);
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
      this._messagesBox.appendChild(new VMessage(message, this))
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

    if (this._messagesBox.contains(vMessage)) {
      this._messagesBox.removeChild(vMessage);
    }
  }

  clear(){
    if (this.contains(this._addMessageBox)) {
      this.removeChild(this._addMessageBox);
    }
    this._messagesBox.innerHTML = "";
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
    if (!this.contains(this._addMessageBox)) {
      this.appendChild(this._addMessageBox);
    }

    //add all messages
    this._messagesBox.innerHTML = "";
    for (let message of messages) {
      this.addMessage(message);
    }

    //clear message input textarea
    this._input.value = "";

    this._send.onclick = () => {
      let message = this.addMessage({
        from: from,
        to: to,
        content: this._input.value
      })
      this._input.value = "";
    }
  }
}

SvgPlus.defineHTMLElement(VMessages)
