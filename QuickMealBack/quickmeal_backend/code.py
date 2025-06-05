import os
import qrcode
from PIL import Image, ImageDraw, ImageFont

# === 配置部分 ===
base_url = "pages/food/food?table_id="
output_dir = "./media/codes"
table_count = 20  # 餐桌总数量
font_path = "C:\\Windows\\Fonts\\simhei.ttf"  # 字体路径，Windows 默认可以用 C:\Windows\Fonts\simhei.ttf 或 arial.ttf
font_size = 36            # 文本字号

# === 创建输出目录 ===
os.makedirs(output_dir, exist_ok=True)

# === 批量生成二维码 ===
for i in range(1, table_count + 1):
    table_id = f"{i}"             # 格式为 table_01
    label = f"{i}号桌"                       # 要加在图片下方的文字
    qr_data = f"{base_url}{table_id}"       # 小程序路径格式

    # 生成二维码图像
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=10,
        border=4,
    )
    qr.add_data(qr_data)
    qr.make(fit=True)
    qr_img = qr.make_image(fill_color="black", back_color="white").convert("RGB")

    # 创建带文字的新图像
    qr_width, qr_height = qr_img.size
    new_height = qr_height + 50
    new_img = Image.new("RGB", (qr_width, new_height), "white")
    new_img.paste(qr_img, (0, 0))

    # 添加文字
    draw = ImageDraw.Draw(new_img)
    try:
        font = ImageFont.truetype(font_path, font_size)
    except:
        font = ImageFont.load_default()
    bbox = font.getbbox(label)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    text_position = ((qr_width - text_width) // 2, qr_height + 5)
    draw.text(text_position, label, font=font, fill="black")

    # 保存图像
    output_path = os.path.join(output_dir, f"table_{i:02d}" + ".png")
    new_img.save(output_path)
    print(f"✅ 生成二维码：{output_path}")
