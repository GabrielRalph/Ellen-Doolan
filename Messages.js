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

  constructor(obj, prefix = ""){
    this.read = false;
    try{
      if (typeof obj === "object" && obj) {
        this.#to = new Contact(obj[prefix + "to"]);
        this.#from = new Contact(obj[prefix + "from"]);
        this.#content = obj[prefix + "content"];
        this.#ts = new Date().getTime()
      } else if (typeof obj === "string") {
        let split = obj.split("~1~");
        this.#to = new Contact(split[0]);
        this.#from = new Contact(split[1]);
        this.#content = split[2];
        this.#ts = parseInt(split[3]);
      }
    }catch(e) {
      console.log(e);
    }
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

    return message;
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


export {Messages, Contact}
