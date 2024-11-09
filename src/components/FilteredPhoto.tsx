import { CSSProperties, useLayoutEffect, useRef } from "react"

type ColorTheme = [number, number, number][]
const PrimaryTheme: ColorTheme = [
    [0.11, 0.11, 0.42],  // Dark Blue (#1D1B6B)
    [0.82, 0.13, 0.13],  // Bright Red (#D02020)
    [0.16, 0.41, 0.18],  // Dark Green (#2A682F)
    [0.97, 0.89, 0],     // Bright Yellow (#F8E300)
    [0, 0.65, 0.71],     // Cyan Blue (#00A6B5)
    [0.83, 0.83, 0.83],  // Light Gray (#D3D3D3)
    [0.96, 0.51, 0.19],  // Orange (#F58231)
    [0.42, 0.05, 0.68],  // Purple (#6A0DAD)
    [1.00, 0.41, 0.71],  // Pink (#FF69B4)
    [0.36, 0.25, 0.2],   // Dark Brown (#5C4033)
    [0.5, 1, 0],         // Bright Green (#7FFF00)
    [0.29, 0.29, 0.29],  // Dark Gray (#4B4B4B)
    [0.96, 0.8, 0.65],   // Light Skin Tone (#F5CBA7)
    [0.82, 0.65, 0.47],  // Medium Skin Tone (#D2A679)
    [0.55, 0.37, 0.24],  // Dark Skin Tone (#8C5E3C)
    [0.31, 0.2, 0.18]    // Very Dark Skin Tone (#4E342E)
  
]

export default function FilteredPhoto({ onComplete, width, height, blockSize, theme = PrimaryTheme, imageUrl, style }: {
  blockSize: number,
  theme?: ColorTheme,
  imageUrl: string,
  width: number,
  height: number,
  onComplete: (complete: boolean) => void,
  style: CSSProperties
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useLayoutEffect(() => {
    if (canvasRef.current == null) return
    getFilteredImageCanvas(blockSize, theme, imageUrl, canvasRef.current)
      .catch(console.error)
      .then(() => onCompleteRef.current(true))
  }, [blockSize, imageUrl, onComplete, theme])

  return (
    <canvas style={style} width={width} height={height} ref={canvasRef} />
  )
}

function getFilteredImageCanvas(
  blockSize: number,
  colorList: [number, number, number][],
  imageUrl: string,
  canvas: HTMLCanvasElement
): Promise<void> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'Anonymous';
    image.src = imageUrl;

    image.onload = () => {
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) {
        reject("Failed to get 2D context.");
        return;
      }

      // const totalWidth = canvas.width
      // const totalWidth = canvas.width
      // Set canvas size to match the image
      const totalWidth = canvas.width;
      const totalHeight = canvas.height;
      // canvas.width = image.width;
      // canvas.height = image.height;

      // Draw the image onto the canvas
      ctx.clearRect(0, 0, totalWidth, totalHeight)
      ctx.drawImage(image, 0, 0, totalWidth, totalHeight);

      // Get image data
      const imageData = ctx.getImageData(0, 0, totalWidth, totalHeight);
      const data = imageData.data;

      // Loop through the image data in blockSize steps
      for (let y = 0; y < totalHeight; y += blockSize) {
        for (let x = 0; x < totalWidth; x += blockSize) {
          // Get average color and alpha of the block
          const [averageColor, averageAlpha] = getBlockAverageColorAndAlpha(data, x, y, blockSize, totalWidth);

          // Find the closest color from the colorList
          const closestColor = findClosestColor(averageColor, colorList);

          // Set the block to the closest color while retaining the alpha
          setBlockColorWithAlpha(data, x, y, blockSize, totalWidth, closestColor, averageAlpha);
        }
      }

      // Update canvas with new filtered image data
      ctx.putImageData(imageData, 0, 0);

      resolve();
    };

    image.onerror = () => reject('Failed to load the image.');
  });
}

function getBlockAverageColorAndAlpha(data: Uint8ClampedArray, startX: number, startY: number, blockSize: number, width: number): [[number, number, number], number] {
  let totalR = 0, totalG = 0, totalB = 0, totalA = 0;
  let count = 0;

  for (let y = startY; y < startY + blockSize; y++) {
    for (let x = startX; x < startX + blockSize; x++) {
      if (x < width && y < data.length / (width * 4)) { // Bounds check
        const index = (y * width + x) * 4;
        totalR += data[index];
        totalG += data[index + 1];
        totalB += data[index + 2];
        totalA += data[index + 3];  // Alpha value
        count++;
      }
    }
  }

  return [
    [totalR / count, totalG / count, totalB / count],
    totalA / count
  ];
}

function findClosestColor(averageColor: [number, number, number], colorList: [number, number, number][]): [number, number, number] {
  let closestColor = colorList[0];
  let closestDistance = Infinity;

  for (const color of colorList) {
    const distance = getColorDistance(averageColor, color);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestColor = color;
    }
  }

  return closestColor.map(c => Math.round(c * 255)) as [number, number, number];
}

function getColorDistance(color1: [number, number, number], color2: [number, number, number]): number {
  return Math.sqrt(
    (color1[0] - color2[0] * 255) ** 2 +
    (color1[1] - color2[1] * 255) ** 2 +
    (color1[2] - color2[2] * 255) ** 2
  );
}

function setBlockColorWithAlpha(data: Uint8ClampedArray, startX: number, startY: number, blockSize: number, width: number, color: [number, number, number], alpha: number) {
  for (let y = startY; y < startY + blockSize; y++) {
    for (let x = startX; x < startX + blockSize; x++) {
      if (x < width && y < data.length / (width * 4)) { // Bounds check
        const index = (y * width + x) * 4;
        data[index] = color[0];
        data[index + 1] = color[1];
        data[index + 2] = color[2];
        data[index + 3] = alpha;  // Preserve the original alpha value
      }
    }
  }
}
