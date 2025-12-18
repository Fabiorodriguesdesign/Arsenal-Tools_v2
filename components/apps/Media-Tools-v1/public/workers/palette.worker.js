// public/workers/palette.worker.js

function getPixels(imageBitmap) {
    const canvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imageBitmap, 0, 0);
    const imageData = ctx.getImageData(0, 0, imageBitmap.width, imageBitmap.height);
    
    const pixels = [];
    // Sample pixels for performance: process every Nth pixel
    const sampleRate = Math.max(1, Math.floor(Math.sqrt(imageData.data.length / 4) / 200)); 
    for (let i = 0; i < imageData.data.length; i += 4 * sampleRate) {
        // Ignore transparent pixels
        if (imageData.data[i + 3] > 128) {
            pixels.push([imageData.data[i], imageData.data[i + 1], imageData.data[i + 2]]);
        }
    }
    return pixels;
}

function getRandomCentroids(pixels, k) {
    const centroids = [];
    const pixelIndices = new Set();
    while (centroids.length < k && centroids.length < pixels.length) {
        const randomIndex = Math.floor(Math.random() * pixels.length);
        if (!pixelIndices.has(randomIndex)) {
            centroids.push(pixels[randomIndex]);
            pixelIndices.add(randomIndex);
        }
    }
    return centroids;
}

function colorDistance(p1, p2) {
    const r_dist = p1[0] - p2[0];
    const g_dist = p1[1] - p2[1];
    const b_dist = p1[2] - p2[2];
    return r_dist * r_dist + g_dist * g_dist + b_dist * b_dist;
}

function assignToCentroid(pixels, centroids) {
    const clusters = new Array(centroids.length).fill(0).map(() => []);
    for (const pixel of pixels) {
        let minDistance = Infinity;
        let closestCentroidIndex = 0;
        for (let i = 0; i < centroids.length; i++) {
            const distance = colorDistance(pixel, centroids[i]);
            if (distance < minDistance) {
                minDistance = distance;
                closestCentroidIndex = i;
            }
        }
        clusters[closestCentroidIndex].push(pixel);
    }
    return clusters;
}

function updateCentroids(clusters) {
    const newCentroids = [];
    for (const cluster of clusters) {
        if (cluster.length === 0) {
            // Re-initialize centroid if cluster is empty
            newCentroids.push([Math.floor(Math.random()*256), Math.floor(Math.random()*256), Math.floor(Math.random()*256)]);
            continue;
        }
        const avg = cluster.reduce((sum, pixel) => [sum[0] + pixel[0], sum[1] + pixel[1], sum[2] + pixel[2]], [0, 0, 0]);
        newCentroids.push(avg.map(c => Math.round(c / cluster.length)));
    }
    return newCentroids;
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}


self.onmessage = async (e) => {
    const { file, colorCount } = e.data;
    if (!file) return;

    try {
        const imageBitmap = await createImageBitmap(file);
        const pixels = getPixels(imageBitmap);
        imageBitmap.close();

        if (pixels.length === 0) {
            self.postMessage({ palette: [] });
            return;
        }

        let centroids = getRandomCentroids(pixels, colorCount);
        let clusters;

        // K-Means iterations
        for (let i = 0; i < 10; i++) {
            clusters = assignToCentroid(pixels, centroids);
            const newCentroids = updateCentroids(clusters);
            
            // Check for convergence
            const hasConverged = newCentroids.every((c, idx) =>
                c[0] === centroids[idx][0] && c[1] === centroids[idx][1] && c[2] === centroids[idx][2]
            );

            centroids = newCentroids;
            if (hasConverged) break;
        }

        const palette = centroids.map(c => rgbToHex(c[0], c[1], c[2]));
        self.postMessage({ palette });

    } catch (error) {
        console.error("Error in palette worker:", error);
        self.postMessage({ error: error.message });
    }
};