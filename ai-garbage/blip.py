import requests
from PIL import Image
import torch
import re
from transformers import Blip2Processor, Blip2ForConditionalGeneration, BitsAndBytesConfig

quant_config = BitsAndBytesConfig(load_in_8bit=False)

processor = Blip2Processor.from_pretrained(
    "Salesforce/blip2-opt-2.7b",
    use_fast=False
)

model = Blip2ForConditionalGeneration.from_pretrained(
    "Salesforce/blip2-opt-2.7b",
    device_map="auto",
    quantization_config=quant_config
)

img_url = "https://www.paralympic.org/static-assets/webp/wb_showcase.webp"
raw_image = Image.open(requests.get(img_url, stream=True).raw).convert("RGB")

# Step 1 — generate caption
prompt = "Describe this image."

inputs = processor(raw_image, prompt, return_tensors="pt")
inputs = {k: v.to(model.device) for k, v in inputs.items()}

with torch.no_grad():
    output = model.generate(
        **inputs,
        max_new_tokens=30,
        temperature=0.7
    )

caption = processor.decode(output[0], skip_special_tokens=True)
print("Caption:", caption)

# Step 2 — extract tags
words = re.findall(r"\b[a-zA-Z]+\b", caption.lower())

stopwords = {
    "a","an","the","in","on","at","with","of","and","is",
    "are","person","people","man","woman"
}

tags = []
for w in words:
    if w not in stopwords and w not in tags:
        tags.append(w)

tags = tags[:4]

print("Tags:", tags)