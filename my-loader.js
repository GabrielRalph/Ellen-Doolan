import {SvgPlus, SvgPath, Vector} from "./4.js"

class MyLoader extends SvgPlus {
  constructor(el){
    super(el);
    this.start();
  }

  onconnect(){
    this.start();
  }

  start(){
    let next = (i) => {
      let theta = i / 120;
      let rad = 5;
      rad += 2 * Math.sin(theta) * Math.pow(Math.sin(theta / 6), 3);
      this.styles = {"--scale-factor": rad/7}
      if (this.isConnected) {
        window.requestAnimationFrame(next)
      }
    }

    window.requestAnimationFrame(next);
  }
}


SvgPlus.defineHTMLElement(MyLoader);
