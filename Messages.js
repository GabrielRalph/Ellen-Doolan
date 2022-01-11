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
  constructor(data){
  }

  addMessage(formObj){
    let message = new Message(formObj);
    console.log(message);
    let hashA = message.to;
    let hashB = message.from;
    if (!(hashA in this.#messages)) this.#messages[hashA] = {};
    if (!(hashB in this.#messages)) this.#messages[hashB] = {};
    if (!(hashB in this.#messages[hashA])) this.#messages[hashA][hashB] = [];
    if (!(hashA in this.#messages[hashB])) this.#messages[hashB][hashA] = [];
    this.#messages[hashA][hashB].push(message);
    this.#messages[hashB][hashA].push(message);

    return message;
  }

  get contacts(){
    return this.getContactsKeys(this.#messages);
  }

  getContactsKeys(obj) {
    let contacts = [];
    for (let key in obj) {
      contacts.push(new Contact(key))
    }
    return contacts;
  }

  getContactsContacts(contact) {
    let contact_hash = new Contact(contact) + "";
    let messages = this.#messages[contact_hash];
    return this.getContactsKeys(messages);
  }

  getMessagesBetween(from, to) {
    let a = null;
    if (from in this.#messages && to in this.#messages[from]) {
      a = this.#messages[from][to];
    }
    return a;
  }
}


export {Messages, Contact}
