export default function getFilteredImageCanvas(
  blockSize: number,
  colorList: [number, number, number][],
  imageUrl: string
): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'Anonymous';
    image.src = imageUrl;

    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject("Failed to get 2D context.");
        return;
      }

      // Set canvas size
      canvas.width = image.width;
      canvas.height = image.height;

      // Draw the image onto the canvas
      ctx.drawImage(image, 0, 0, image.width, image.height);

      // Get image data
      const imageData = ctx.getImageData(0, 0, image.width, image.height);
      const data = imageData.data;

      // Loop through the image data in blockSize steps
      for (let y = 0; y < image.height; y += blockSize) {
        for (let x = 0; x < image.width; x += blockSize) {
          // Get average color of the block
          const averageColor = getBlockAverageColor(data, x, y, blockSize, image.width);

          // Find the closest color from the colorList
          const closestColor = findClosestColor(averageColor, colorList);

          // Set the block to the closest color
          setBlockColor(data, x, y, blockSize, image.width, closestColor);
        }
      }

      // Update canvas with new filtered image data
      ctx.putImageData(imageData, 0, 0);

      resolve(canvas);
    };

    image.onerror = () => reject('Failed to load the image.');
  });
}

function getBlockAverageColor(data: Uint8ClampedArray, startX: number, startY: number, blockSize: number, width: number): [number, number, number] {
  let totalR = 0, totalG = 0, totalB = 0;
  let count = 0;

  for (let y = startY; y < startY + blockSize; y++) {
    for (let x = startX; x < startX + blockSize; x++) {
      if (x < width && y < data.length / (width * 4)) { // Bounds check
        const index = (y * width + x) * 4;
        totalR += data[index];
        totalG += data[index + 1];
        totalB += data[index + 2];
        count++;
      }
    }
  }

  return [totalR / count, totalG / count, totalB / count];
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

function setBlockColor(data: Uint8ClampedArray, startX: number, startY: number, blockSize: number, width: number, color: [number, number, number]) {
  for (let y = startY; y < startY + blockSize; y++) {
    for (let x = startX; x < startX + blockSize; x++) {
      if (x < width && y < data.length / (width * 4)) { // Bounds check
        const index = (y * width + x) * 4;
        data[index] = color[0];
        data[index + 1] = color[1];
        data[index + 2] = color[2];
        data[index + 3] = 255; // Set alpha to full opacity
      }
    }
  }
}