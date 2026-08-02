import rembg
from PIL import Image

in_path = "d:\\A\\New folder\\assets\\hero-new.png"
out_path = "d:\\A\\New folder\\assets\\hero-new.png"
print(f"Processing {in_path}...")
try:
    img = Image.open(in_path)
    output = rembg.remove(img)
    output.save(out_path, "PNG")
    print(f"Successfully processed {in_path}")
except Exception as e:
    print(f"Error processing {in_path}: {e}")
