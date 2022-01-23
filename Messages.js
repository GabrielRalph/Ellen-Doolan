const formObjKeys = ["to-name", "to-number", "from-name", "from-number", 'message']

class Contact {
  _name = "invalid";
  _number = "invalid";
  constructor(obj, prefix = "") {
    try{
      if (typeof obj === "object" && obj) {
        this._name = obj[prefix + "name"];
        this._number = obj[prefix + "number"];
      } else if (typeof obj === "string") {
        let split = obj.split("~0~")
        this._name = split[0];
        this._number = split[1];
      }
    } catch(e) {
      console.log(e);
    }
  }

  get name() { return this._name; }
  get number() { return this._number; }
  get json() {return {name: this._name, number: this._number}; }

  toString(){return this._name + "~0~" + this._number; }
}

class Message{
  _to = "invalid";
  _from = "invalid";
  _content = "";
  _ts = 0;
  _read = false;
  constructor(obj){
    try{
      if (obj instanceof Message) {
        obj = obj + "";
      }
      if (typeof obj === "object" && obj) {
        this._to = new Contact(obj["to"]);
        this._from = new Contact(obj["from"]);
        this._content = obj["content"];
        this._ts = new Date().getTime();
      } else if (typeof obj === "string") {
        let split = obj.split("~1~");
        if (split.length > 2) {
          this._to = new Contact(split[0]);
          this._from = new Contact(split[1]);
          this._content = split[2];
        }
        if (split.length > 3) {
          this._ts = parseInt(split[3]);
        }
        if (split.length > 4) {
          this._read = parseInt(split[4]);
        }
      }
    }catch(e) {
      console.log(e);
    }
  }

  _updateListeners = [];
  addUpdateListener(cb) {
    if (cb instanceof Function) {
      this.updateListeners.push(cb);
    }
  }
  update(){
    if (this.onupdate instanceof Function) {
      this.onupdate();
    }
    for (let cb of this._updateListeners) {
      cb();
    }
  }

  set read(value){
    this._read = value
    this.update()
  }

  get read(){
    return this._read;
  }

  get to(){
    return new Contact(this._to);
  }

  get from(){
    return new Contact(this._from)
  }

  get content(){
    return this._content;
  }

  toString() {
    return this.from + "~1~" + this.to + "~1~" + this.content + "~1~" + this.ts;
  }
}

class Messages{
  _messages = {};
  _message_list = [];

  contains(message) {
    return this._message_list.indexOf(message) != -1;
  }

  addContact(contact) {
    contact = new Contact(contact);
    if (!(contact in this._messages)) {
      this._messages[contact] = {};
    }
  }

  addMessage(formObj){
    let message = new Message(formObj);
    let from = message.from;
    let to = message.to;

    this.addContact(to);
    this.addContact(from);

    if (!(to in this._messages[from])) this._messages[from][to] = [];
    if (!(from in this._messages[to])) this._messages[to][from] = [];

    this._messages[from][to].push(message);
    this._messages[to][from].push(message);
    this._message_list.push(message);

    return message;
  }

  removeMessage(message) {
    if (this.contains(message)) {
      let array = this._messages[message.from][message.to];
      let idx = array.indexOf(message);
      array.splice(idx, 1);

      array = this._messages[message.to][message.from];
      idx = array.indexOf(message);
      array.splice(idx, 1);

      array = this._message_list;
      idx = array.indexOf(message);
      array.splice(idx, 1);
    }
  }

  get contacts(){
    let contacts = [];
    for (let key in this._messages) {
      contacts.push(new Contact(key))
    }
    return contacts;
  }

  getContactsOf(contact) {
    contact = new Contact(contact) + "";
    let contacts = [];
    for (let key in this._messages) {
      if (key != contact) contacts.push(new Contact(key))
    }
    return contacts;
  }

  getMessagesBetween(from, to) {
    let a = [];
    if (from in this._messages && to in this._messages[from]) {
      a = this._messages[from][to];
    }
    return a;
  }
}

export {Messages, Message, Contact}
