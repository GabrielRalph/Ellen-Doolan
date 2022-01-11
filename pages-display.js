import {SvgPlus, TBody} from "./4.js"

async function wait(t){
  return new Promise(function(resolve, reject) {
    setTimeout(resolve, t)
  });
}

class PagesDisplay extends SvgPlus {
  #templates = {}
  constructor(el){
    super(el);

    let templates = {};
    let temp_els = this.getElementsByTagName("template");
    for (let template of temp_els) {
      templates[template.getAttribute("name")] = template.innerHTML;
    }

    this.#templates = templates;

    let loader = this.querySelector("div[name='loader']").innerHTML;

    this.innerHTML = "";
    this.window = this.createChild("div", {class: "window"});
    this.loader = this.createChild("div", {class: "loader"});
    this.loader.innerHTML = loader;
  }

  set template(value){
    if (value in this.#templates) {
      this.window.innerHTML = this.#templates[value];
      const event = new Event(value);
      this.dispatchEvent(event);
    }
  }

  get pageElement(){
    return this.window.children[0];
  }

  async goto(page){
    await this.fade(false)
    this.template = page;
    await wait(1000);
    await this.fade(true);
  }

  async fade(value = true, time = 300){
    value = !value;
    let contains = this.contains(this.loader);
    await this.waveTransition((t) => {
      if (value && !contains) {
        this.appendChild(this.loader);
        contains = true;
      }
      this.loader.styles = {"--fade-factor": t}
    }, time, value);
    if (!value && this.contains(this.loader)){
      this.removeChild(this.loader);
    }
  }
}

SvgPlus.defineHTMLElement(PagesDisplay)
