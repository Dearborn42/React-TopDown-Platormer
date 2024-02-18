import React, { useRef, useEffect } from 'react';
import p5 from 'p5';

const Sketch = () => {
  const sketchRef = useRef();

  useEffect(() => {
    const sketch = new p5(p => {
      let canvas;
      let centerX;
      let centerY;

      p.setup = () => {
        canvas = p.createCanvas(window.innerWidth, window.innerHeight);
        centerX = window.innerWidth / 2;
        centerY = window.innerHeight / 2;
        canvas.parent(sketchRef.current);
        p.background(220);
      };

      p.draw = () => {
        p.fill(255, 0, 0);
        p.ellipse(centerX, centerY, 50, 50);
      };
    });

    return () => {
      sketch.remove();
    };
  }, []);

  return <div ref={sketchRef} style={{ width: '99%', height: '99%' }}></div>;
};

export default Sketch;
