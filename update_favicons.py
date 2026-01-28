from PIL import Image
import os

# Paths
source_path = "/Users/extnddos/.gemini/antigravity/brain/2a8540e4-bfb1-42c0-83db-ecce51b9f3b8/favicon_opt6_minimal_e_v2_1769514651746.png"
public_dir = "/Users/extnddos/Downloads/Telegram Desktop/avant-garde-catalog-design/Web-ui/public"

def update_favicons():
    if not os.path.exists(source_path):
        print(f"Error: Source file not found at {source_path}")
        return

    try:
        img = Image.open(source_path)
        
        # 1. icon-dark-32x32.png
        icon_32 = img.resize((32, 32), Image.Resampling.LANCZOS)
        icon_32.save(os.path.join(public_dir, "icon-dark-32x32.png"))
        print("Saved icon-dark-32x32.png")

        # 2. icon-light-32x32.png (same for now)
        icon_32.save(os.path.join(public_dir, "icon-light-32x32.png"))
        print("Saved icon-light-32x32.png")

        # 3. apple-icon.png (180x180)
        apple_icon = img.resize((180, 180), Image.Resampling.LANCZOS)
        apple_icon.save(os.path.join(public_dir, "apple-icon.png"))
        print("Saved apple-icon.png")
        
        # 4. favicon.ico
        # ICO usually contains multiple sizes, but 32x32 is standard fallback
        img.save(os.path.join(public_dir, "favicon.ico"), format='ICO', sizes=[(32, 32)])
        print("Saved favicon.ico")

    except Exception as e:
        print(f"Error processing images: {e}")

if __name__ == "__main__":
    update_favicons()
