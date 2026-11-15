import io
from PIL import Image, ImageDraw
import rembg

print("Testing rembg with briaai or u2net...")
img = Image.new("RGBA", (200, 200), (255, 255, 255, 255))
d = ImageDraw.Draw(img)
d.rectangle((50, 50, 150, 150), fill=(220, 30, 30, 255))

buf = io.BytesIO()
img.save(buf, format="PNG")
in_bytes = buf.getvalue()

try:
    # Try default or silueta/isnet-general-use
    session = rembg.new_session("silueta")
    out = rembg.remove(in_bytes, session=session)
    print("Success with silueta! Output bytes:", len(out))
except Exception as e:
    print("Silueta error:", e)
    try:
        session = rembg.new_session("u2netp")
        out = rembg.remove(in_bytes, session=session)
        print("Success with u2netp! Output bytes:", len(out))
    except Exception as e2:
        print("u2netp error:", e2)
