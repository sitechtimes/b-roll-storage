
const { execFileSync } = require('child_process');
const path = require('path');

function _parseTagsFromOutput(stdout) {
	if (!stdout) return [];
	const candidates = [];
	const en = stdout.match(/Image Tags:\s*(.*)/i);
	if (en && en[1]) candidates.push(en[1].trim());
	if (candidates.length === 0) candidates.push(stdout.trim());

	for (const raw of candidates) {
		if (!raw) continue;
		if (/^\[.*\]$/.test(raw)) {
			try {
				const json = raw.replace(/'/g, '"');
				const parsed = JSON.parse(json);
				if (Array.isArray(parsed)) return parsed.map(String);
			} catch (e) {

			}
		}
		if (raw.includes(',')) {
			return raw.replace(/[\[\]]/g, '').split(',').map(s => s.trim()).filter(Boolean);
		}
		if (raw.length) return [raw];
	}
	return [];
}

function processImage(opts = {}) {
	const {
		image = 'ai-garbage/recognize-anything/images/demo/demo1.jpg',
		pretrained = 'ai-garbage/recognize-anything/pretrained/ram_plus_swin_large_14m.pth',
		pythonCmd = process.env.PYTHON || 'python',
	} = opts;

	const scriptPath = path.join(__dirname, '..', 'ai-garbage', 'recognize-anything', 'inference_ram_plus.py');
	const cwd = path.join(__dirname, '..');

	try {
		const stdout = execFileSync(pythonCmd, [scriptPath, '--image', image, '--pretrained', pretrained]);
		const tags = _parseTagsFromOutput(stdout);
		return tags;
	} catch (err) {
		return [];
	}
}

function processVideo() {}

module.exports = { processImage, processVideo };