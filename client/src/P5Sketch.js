import React, {useState} from "react";
import { ReactP5Wrapper } from "@p5-wrapper/react";



export default function P5Sketch({}) {
  let x = 50;
  let y = 50;
  const speed = 5;

  function sketch(p5) {
  p5.setup = () => {
    p5.createCanvas(window.innerWidth, window.innerHeight);
  };

  p5.draw = () => {
      p5.background(220);
      p5.square(x, y, 50);

      if (p5.keyIsDown(65)) { // A
        x -= speed
      }
      if (p5.keyIsDown(68)) { // D
        x += speed
      }
      if (p5.keyIsDown(87)) { // W
        y -= speed
      }
      if (p5.keyIsDown(83)) { // S
        y += speed
      }
    };
  }
  return <ReactP5Wrapper sketch={sketch} />;
}
