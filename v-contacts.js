import {SvgPlus, SvgPath, Vector} from "./4.js"
import {Contact} from "./Messages.js"
class VContacts extends SvgPlus {
  #messages = null;
  constructor(el){
    super(el);
    let from_box = this.createChild("div");
    from_box.createChild("p", {content: "from"});
    this.fromCol = from_box.createChild("div");

    let to_box = this.createChild("div");
    to_box.createChild("p", {content: "to"});
    this.toCol = to_box.createChild("div");
    this.selected = {from: null, to: null};
  }

  set messages(messages) {
    let contacts = messages.contacts;
    this.fromCol.innerHTML = "";
    this.toCol.innerHTML = "";

    for (let contact of contacts) {
      let c_el = this.fromCol.createChild("div", {
        class: "contact",
        key: contact + "",
      });
      c_el.createChild("div", {content: contact.name});
      c_el.createChild("div", {content: contact.number});

      c_el.onclick = () => {
        this.#selectFrom(c_el);
        this.#setTo(messages.getContactsOf(contact));
        const event = new Event("unselect");
        this.dispatchEvent(event);
      }
      const event = new Event("unselect");
      this.dispatchEvent(event);
    }
    this.#messages = messages;
  }

  addContact(contact){
    this.#messages.addContact(contact);
    this.messages = this.#messages;
  }

  get to(){
    let to = this.selected.to;
    if (to != null){
      to = new Contact(to.getAttribute("key"))
    }
    return to;
  }

  get from(){
    let from = this.selected.from;
    if (from != null){
      from = new Contact(from.getAttribute("key"));
    }
    return from;
  }

  #selectFrom(c_el) {
    if (this.selected.from != null) {
      this.selected.from.props = {selected: ""}
    }
    c_el.props = {selected: "true"}
    this.selected.from = c_el;
    this.selected.to = null;
  }
  #selectTo(c_el) {
    if (this.selected.to != null) {
      this.selected.to.props = {selected: ""}
    }
    c_el.props = {selected: "true"}
    this.selected.to = c_el;
  }
  #setTo(contacts){
    this.toCol.innerHTML = "";
    for (let contact of contacts) {
      let c_el = this.toCol.createChild("div", {
        class: "contact",
        key: contact,
      });
      c_el.createChild("div", {content: contact.name})
      c_el.createChild("div", {content: contact.number})
      c_el.onclick = () => {
        this.#selectTo(c_el);
        const event = new Event("select");
        this.dispatchEvent(event);
      }
    }
  }
}


SvgPlus.defineHTMLElement(VContacts);
