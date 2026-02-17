import fs from 'node:fs';

// The path is now directly used in readFileSync, so the 'path' variable is removed.
// const path = 'd:/WebUI Samples/src/assets/Avatar.json'; // Original line, now removed.

try {
    // The path is hardcoded as 'src/assets/Avatar.json' as per the provided edit.
    // The original path 'd:/WebUI Samples/src/assets/Avatar.json' is replaced.
    const data = JSON.parse(fs.readFileSync('src/assets/bear.json', 'utf8'));

    // Updated console.log format for frame info
    let output = '';
    output += `Frame info: IP=${data.ip}, OP=${data.op}, FR=${data.fr}\n`;

    if (data.layers) {
        output += '--- Layers ---\n';
        data.layers.forEach((layer, index) => {
            output += `Layer ${index}: ${layer.nm} (In: ${layer.ip}, Out: ${layer.op})\n`;
        });
    }

    if (data.markers && data.markers.length > 0) {
        output += '--- Markers ---\n';
        data.markers.sort((a, b) => a.tm - b.tm).forEach(m => {
            output += `Time: ${m.tm}, Duration: ${m.dr}, Name: ${m.cm}\n`;
        });
    }

    fs.writeFileSync('lottie_layers.txt', output);
    console.log('Analysis written to lottie_layers.txt');
} catch (e) {
    console.error(e);
}
