#!/usr/bin/env python3
"""
THE SABBiR OS — Neural Background Removal System Agent (rembg_cutout_agent.py)
Uses SOTA ONNX neural matting (Silueta / U2Net) via /home/thesabbir/AI/cptr/.venv.
Takes base64 input from stdin, outputs clean RGBA PNG base64 to stdout.
"""

import sys
import io
import base64
import json
import time
from PIL import Image

def main():
    start_time = time.time()
    try:
        # Read payload from stdin
        raw_input = sys.stdin.read().strip()
        if not raw_input:
            print(json.dumps({"error": "Empty input"}), file=sys.stderr)
            sys.exit(1)

        try:
            data = json.loads(raw_input)
            img_b64 = data.get("image", "")
        except json.JSONDecodeError:
            img_b64 = raw_input

        # Strip data URL prefix if present
        if "," in img_b64:
            img_b64 = img_b64.split(",", 1)[1]

        img_bytes = base64.b64decode(img_b64)
        input_image = Image.open(io.BytesIO(img_bytes)).convert("RGB")
        width, height = input_image.size

        # Cap max dimensions for lightning fast edge processing (up to 1920px)
        max_dim = 1600
        if max(width, height) > max_dim:
            scale = max_dim / max(width, height)
            new_size = (int(width * scale), int(height * scale))
            input_image = input_image.resize(new_size, Image.Resampling.LANCZOS)

        import rembg
        session = rembg.new_session("silueta")
        
        buf_in = io.BytesIO()
        input_image.save(buf_in, format="PNG")
        
        # Neural cutout
        output_bytes = rembg.remove(buf_in.getvalue(), session=session)
        
        out_b64 = "data:image/png;base64," + base64.b64encode(output_bytes).decode("utf-8")
        elapsed_ms = int((time.time() - start_time) * 1000)

        response = {
            "success": True,
            "cutout": out_b64,
            "engine": "rembg-silueta-neural-v2",
            "width": width,
            "height": height,
            "elapsedMs": elapsed_ms
        }
        print(json.dumps(response))
        sys.exit(0)

    except Exception as e:
        error_resp = {
            "success": False,
            "error": str(e)
        }
        print(json.dumps(error_resp), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
