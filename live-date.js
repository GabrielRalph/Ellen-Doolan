import {SvgPlus} from "./4.js"

class LiveDate extends SvgPlus {
  constructor(el){
    super(el);
    setInterval(() => {
      let date = (new Date()+"").split(" ");
      let hr = date[4].split(":");
      let m = parseInt(hr[1]);
      hr = parseInt(hr[0]);
      let ampm = "am";
      if (hr > 12) {
        hr -= 12;
        ampm = "pm";
      }

      this.innerHTML = `${date[0]} ${date[2]} ${date[1]} ${hr}:${m} ${ampm}`
    }, 500)
  }

}

SvgPlus.defineHTMLElement(LiveDate)
