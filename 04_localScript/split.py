from pathlib import Path

import cv2
import numpy as np

img = cv2.imread("share_news.png")

rows = 3  # 行数
cols = 3  # 列数

chunks = []
for row_img in np.array_split(img, rows, axis=0):
    for chunk in np.array_split(row_img, cols, axis=1):
        chunks.append(chunk)
print(len(chunks))

output_dir = Path("output")
output_dir.mkdir(exist_ok=True)
for i, chunk in enumerate(chunks):
    save_path = output_dir / f"{i+1}.png"
    cv2.imwrite(str(save_path), chunk)