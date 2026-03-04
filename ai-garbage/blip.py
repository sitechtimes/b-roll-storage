import requests
from PIL import Image
import torch
from transformers import Blip2Processor, Blip2ForConditionalGeneration, BitsAndBytesConfig

quant_config = BitsAndBytesConfig(load_in_8bit=False)

processor = Blip2Processor.from_pretrained("Salesforce/blip2-opt-2.7b")

model = Blip2ForConditionalGeneration.from_pretrained(
    "Salesforce/blip2-opt-2.7b",
    device_map="auto",
    quantization_config=quant_config
)

img_url = r"https://www.paralympic.org/static-assets/webp/wb_showcase.webp"
raw_image = Image.open(requests.get(img_url, stream=True).raw).convert("RGB")

question = "Generate 4 one-word tags to describe the image (in the format: \"white\", \"hand\"...): \""

inputs = processor(raw_image, question, return_tensors="pt")
inputs = {k: v.to(model.device) for k, v in inputs.items()}

with torch.no_grad():
    output = model.generate(**inputs)

print(processor.decode(output[0], skip_special_tokens=True))