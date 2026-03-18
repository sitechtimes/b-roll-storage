const { spawn, execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');
const crypto = require('crypto');
const ffmpeg = require('ffmpeg');

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
async function processVideo(videoPath: string): Promise<string[]> {
    // helper: get duration via ffprobe or ffmpeg
    function getDuration(vpath: string): number | null {
        try {
            const out = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', vpath], { encoding: 'utf8' });
            const dur = parseFloat(out.trim());
            if (!isNaN(dur)) return dur;
        } catch (e) {
            try {
                // fallback: parse ffmpeg -i stderr
                const ff = execFileSync('ffmpeg', ['-i', videoPath], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
                const stderr = ff.toString();
                const m = stderr.match(/Duration:\s*(\d+):(\d+):(\d+\.\d+)/);
                if (m) {
                    const h = parseInt(m[1], 10), mm = parseInt(m[2], 10), s = parseFloat(m[3]);
                    return h * 3600 + mm * 60 + s;
                }
            } catch (e2) {
                return null;
            }
        }
        return null;
    }

    function tmpFramePath(): string {
        return path.join(os.tmpdir(), `frame-${Date.now()}-${crypto.randomBytes(4).toString('hex')}.jpg`);
    }

    async function extractFrameAt(timeSec: number): Promise<string> {
        const out = tmpFramePath();
        return new Promise((resolve, reject) => {
            console.log("ahreifiogjfw")
            var process = new ffmpeg(videoPath);
            process.then(function (video: any) {
                video.addCommand('-ss', timeSec)
                video.addCommand('-vframes', '1')
                video.addCommand('-q:v', '2')
                video.addCommand('-y', out)
                video.save(out, (error: Error | null, file: string) => {
                    if (error) return reject(error);
                    return resolve(out);
                });
            });
            console.log("nvreiuhgiord")
            /*
            let ferr = '';
            ff.stderr.on('data', (d: Buffer) => ferr += d.toString());
            ff.on('error', (err: Error) => reject(err));
            ff.on('close', (code: number) => {
                if (code === 0) return resolve(out);
                reject(new Error(`ffmpeg failed (${code}): ${ferr}`));
            });
            */
        });
    }

    const duration = getDuration(videoPath);
    const times: number[] = [];
    if (duration && duration > 0) {
        times.push(0);
        times.push(duration / 3);
        times.push((2 * duration) / 3);
        times.push(Math.max(0, duration - 0.001));
    } else {
        times.push(0, 1, 2, 3);
    }

    const frames: string[] = [];
    try {
        for (const t of times) {
            try {
                const f = await extractFrameAt(t);
                frames.push(f);
            } catch (e: any) {
                console.error(e);
            }
        }

        const { processImage } = require('./ai_processing');
        console.log("BLAHHH")
        const tagArrays: string[][] = [];
        for (const f of frames) {
            console.log("JUFHREIFOE")
            try {
                const tags = await processImage(f);
                if (Array.isArray(tags)) tagArrays.push(tags);
                console.log(tags);
            } catch (e) {}
        }

        const all = new Set<string>();
        for (const arr of tagArrays) for (const t of arr) all.add(t);
        return Array.from(all);
    } finally {
        for (const f of frames) {
            try { fs.unlinkSync(f); } catch (e: any) {}
        }
    }
}

module.exports = { processImage, processVideo };