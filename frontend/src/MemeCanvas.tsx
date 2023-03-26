import React, { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { MemeCanvasState } from './State';

export const MemeCanvas: React.FC<{ memeState: MemeCanvasState; className: string; children: (Element | ReactNode) }> = (props) => {
  const fontBase = 1000, // selected default width for canvas
    fontSize = 100; // default size for font

  function getFont(width: number) {
    const ratio = fontSize / fontBase; // calc ratio
    const size = width * ratio; // get font size based on current width
    return (size | 0) + 'px Impact'; // set font
  }

  function drawText(
    ctx: CanvasRenderingContext2D,
    text: string,
    centerX: number,
    centerY: number,
    font: string
  ) {
    ctx.save();
    ctx.font = font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.fillText(text, centerX, centerY);
    ctx.strokeText(text, centerX, centerY);
    ctx.restore();
  }

  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height,
    };
  }

  function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(function AddResizeListerner() {
      function handleResize() {
        setWindowDimensions(getWindowDimensions());
      }

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
  }

  const windowDimensions = useWindowDimensions();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const imageElement = new Image();
    imageElement.src = props.memeState.visualFileURL;
    imageElement.addEventListener('load', function RenderImage() {
      const memeCanvas = canvasRef.current;
      if (memeCanvas) {
        const ctx = memeCanvas.getContext('2d');
        if (ctx) {
          const maxDimension = windowDimensions.width < 350 ? windowDimensions.width - 50 : 350;

          if (imageElement.width > maxDimension && imageElement.width >= imageElement.height) {
            memeCanvas.width = maxDimension;
            memeCanvas.height = maxDimension * (imageElement.height / imageElement.width);
          } else if (
            imageElement.height > maxDimension &&
            imageElement.height > imageElement.width
          ) {
            memeCanvas.height = maxDimension;
            memeCanvas.width = maxDimension * (imageElement.width / imageElement.height);
          } else {
            memeCanvas.width = imageElement.width;
            memeCanvas.height = imageElement.height;
          }

          const scale = Math.min(
            memeCanvas.width / imageElement.width,
            memeCanvas.height / imageElement.height
          );
          // get the top left position of the image
          const x = memeCanvas.width / 2 - (imageElement.width / 2) * scale;
          const y = memeCanvas.height / 2 - (imageElement.height / 2) * scale;
          ctx.drawImage(
            imageElement,
            x,
            y,
            imageElement.width * scale,
            imageElement.height * scale
          );
          const font = getFont(memeCanvas.width);

          drawText(ctx, props.memeState.toptext, memeCanvas.width / 2, memeCanvas.height / 8, font);
          drawText(
            ctx,
            props.memeState.bottomtext,
            memeCanvas.width / 2,
            memeCanvas.height - memeCanvas.height / 8,
            font
          );
        }
      }
    });
  });

  return (
    <div className={props.className}>
      <>
        <div className="Meme-canvas-container">
          <canvas ref={canvasRef} />
        </div>
        {props.children}
      </>
    </div>
  );
};
