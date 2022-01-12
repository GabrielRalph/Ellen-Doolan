const formObjKeys = ["to-name", "to-number", "from-name", "from-number", 'message']

class Contact {
  #name = "invalid";
  #number = "invalid";
  constructor(obj, prefix = "") {
    try{
      if (typeof obj === "object" && obj) {
        this.#name = obj[prefix + "name"];
        this.#number = obj[prefix + "number"];
      } else if (typeof obj === "string") {
        let split = obj.split("~0~")
        this.#name = split[0];
        this.#number = split[1];
      }
    } catch(e) {
      console.log(e);
    }
  }

  get name() { return this.#name; }
  get number() { return this.#number; }
  get json() {return {name: this.#name, number: this.#number}; }

  toString(){return this.#name + "~0~" + this.#number; }
}

class Message{
  #to = "invalid";
  #from = "invalid";
  #content = "";
  #ts = 0;
  #read = false;
  constructor(obj){
    try{
      if (obj instanceof Message) {
        obj = obj + "";
      }
      if (typeof obj === "object" && obj) {
        this.#to = new Contact(obj["to"]);
        this.#from = new Contact(obj["from"]);
        this.#content = obj["content"];
        this.#ts = new Date().getTime();
      } else if (typeof obj === "string") {
        let split = obj.split("~1~");
        if (split.length > 2) {
          this.#to = new Contact(split[0]);
          this.#from = new Contact(split[1]);
          this.#content = split[2];
        }
        if (split.length > 3) {
          this.#ts = parseInt(split[3]);
        }
        if (split.length > 4) {
          this.#read = parseInt(split[4]);
        }
      }
    }catch(e) {
      console.log(e);
    }
  }

  #updateListeners = [];
  addUpdateListener(cb) {
    if (cb instanceof Function) {
      this.updateListeners.push(cb);
    }
  }
  update(){
    if (this.onupdate instanceof Function) {
      this.onupdate();
    }
    for (let cb of this.#updateListeners) {
      cb();
    }
  }

  set read(value){
    this.#read = value
    this.update()
  }

  get read(){
    return this.#read;
  }

  get to(){
    return new Contact(this.#to);
  }

  get from(){
    return new Contact(this.#from)
  }

  get content(){
    return this.#content;
  }

  toString() {
    return this.from + "~1~" + this.to + "~1~" + this.content + "~1~" + this.ts;
  }
}

class Messages{
  #messages = {};
  #message_list = [];

  contains(message) {
    return this.#message_list.indexOf(message) != -1;
  }

  addContact(contact) {
    contact = new Contact(contact);
    if (!(contact in this.#messages)) {
      this.#messages[contact] = {};
    }
  }

  addMessage(formObj){
    let message = new Message(formObj);
    let from = message.from;
    let to = message.to;

    this.addContact(to);
    this.addContact(from);

    if (!(to in this.#messages[from])) this.#messages[from][to] = [];
    if (!(from in this.#messages[to])) this.#messages[to][from] = [];

    this.#messages[from][to].push(message);
    this.#messages[to][from].push(message);
    this.#message_list.push(message);

    return message;
  }

  removeMessage(message) {
    if (this.contains(message)) {
      let array = this.#messages[message.from][message.to];
      let idx = array.indexOf(message);
      array.splice(idx, 1);

      array = this.#messages[message.to][message.from];
      idx = array.indexOf(message);
      array.splice(idx, 1);

      array = this.#message_list;
      idx = array.indexOf(message);
      array.splice(idx, 1);
    }
  }

  get contacts(){
    let contacts = [];
    for (let key in this.#messages) {
      contacts.push(new Contact(key))
    }
    return contacts;
  }

  getContactsOf(contact) {
    contact = new Contact(contact) + "";
    let contacts = [];
    for (let key in this.#messages) {
      if (key != contact) contacts.push(new Contact(key))
    }
    return contacts;
  }

  getMessagesBetween(from, to) {
    let a = [];
    if (from in this.#messages && to in this.#messages[from]) {
      a = this.#messages[from][to];
    }
    return a;
  }
}

export {Messages, Message, Contact}
