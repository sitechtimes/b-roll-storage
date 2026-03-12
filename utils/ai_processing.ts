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
            const out = output.trim();
            // Expect Python to print a JSON array as the last line. Try to parse it.
            const lines = out.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
            const last = lines[lines.length - 1] || '';
            try {
                const parsed = JSON.parse(last);
                if (Array.isArray(parsed)) return resolve(parsed.map(String));
            } catch (e) {
                // not JSON, fall through
            }
            // fallback: try to extract comma separated from the last printable line
            if (last.includes(',')) return resolve(last.replace(/[\[\]]/g, '').split(',').map(s => s.trim()).filter(Boolean));
            // final fallback: return entire stdout as single-element array
            resolve([out]);
        });
    });
};

function processVideo() {}

module.exports = { processImage, processVideo };