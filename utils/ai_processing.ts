const { spawn } = require('child_process');
const path = require('path');

/**
 * Runs RAM+ inference using the venv's python executable
 * @param {string} imagePath - Absolute path to the image from the request
 */
const processImage = (imagePath: string) => {
    return new Promise((resolve, reject) => {
        const pythonExe = path.resolve(__dirname, '../recognize-anything/.venv/Scripts/python.exe');
        const scriptPath = path.resolve(__dirname, '../recognize-anything/inference_ram_plus.py');
        const modelPath = path.resolve(__dirname, '../recognize-anything/pretrained/ram_plus_swin_large_14m.pth');

        const args = [
            scriptPath,
            '--image', imagePath,
            '--pretrained', modelPath
        ];

        const pythonProcess = spawn(pythonExe, args);

        let output = '';
        let errorData = '';

        pythonProcess.stdout.on('data', (data: { toString: () => string; }) => output += data.toString());
        pythonProcess.stderr.on('data', (data: { toString: () => string; }) => errorData += data.toString());

        pythonProcess.on('close', (code: number) => {
            if (code !== 0) {
                return reject(new Error(`Python script failed (code ${code}): ${errorData}`));
            }

            const lines = output.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

            const tagLine = lines.find(l => l.toLowerCase().startsWith('image tags:'));
            if (tagLine) {
                const tagsPart = tagLine.replace(/Image Tags:\s*/i, '');
                const tags = tagsPart.split(/[\|,]/).map(s => s.trim()).filter(Boolean);
                return resolve(tags);
            }

            resolve([output.trim()]);
        });
    });
};

/**
 * Runs RAM+ inference using the venv's python executable, for the first, middle, and last frames, and puts together the tags
 * @param {string} videoPath - Absolute path to the video from the request
 */
function processVideo(videoPath: string) => {

};

module.exports = { processImage, processVideo };