const { spawn } = require('child_process');
const path = require('path');

/**
 * Runs RAM+ inference using the venv's python executable
 * @param {string} imagePath - Absolute path to the image from the request
 */
const processImage = (imagePath) => {
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

        pythonProcess.stdout.on('data', (data) => output += data.toString());
        pythonProcess.stderr.on('data', (data) => errorData += data.toString());

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                return reject(new Error(`Python script failed (code ${code}): ${errorData}`));
            }
            resolve(output.trim());
        });
    });
};

function processVideo() {}

module.exports = { processImage, processVideo };