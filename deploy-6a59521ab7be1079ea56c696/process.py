import rembg
from PIL import Image

for i in range(1, 4):
    in_path = f"d:\\A\\New folder\\assets\\hero-slide{i}.png"
    out_path = f"d:\\A\\New folder\\assets\\hero-slide{i}.png"
    print(f"Processing {in_path}...")
    try:
        img = Image.open(in_path)
        output = rembg.remove(img)
        output.save(out_path, "PNG")
        print(f"Successfully processed {in_path}")
    except Exception as e:
        print(f"Error processing {in_path}: {e}")
