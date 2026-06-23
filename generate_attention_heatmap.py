"""
generate_attention_heatmap.py  (v4)
────────────────────────────────────
Demo-only script: generates a static JET-colormap attention heatmap overlay
for the RSNA-DEMO-132F case (Female, 11.0 y / 132 m).

The result is saved to:
    public/references/demo_attention_132m_female.png

v4 변경사항 (v3 대비):
  [v4-1] intensity 전반 0.15~0.20 낮춤 → 과도한 red/yellow 억제
  [v4-2] gamma 1.5 → 2.2 → 낮은 heat 값은 더 파랗게, 높은 값만 따뜻한 색 유지
  [v4-3] JET overlay alpha 0.68 → 0.50 → overlay 강도 완화, 원본 뼈 구조 가시성 향상
  [v4-4] xray_base 0.72 → 0.62 → 원본 X-ray 구조가 더 잘 보이도록
  [v4-5] 손 마스크 바깥도 약한 heat (0.10) 유지 → 자연스러운 파랑 배경 표현
  [v4-6] CLAHE clipLimit 2.0 → 1.5 → 과도한 대비 완화

No real model inference is performed.
"""

import sys
import os
import numpy as np

# ── dependency check ────────────────────────────────────────────────────────
try:
    from PIL import Image
    import cv2
    from scipy.ndimage import gaussian_filter
except ImportError as e:
    sys.exit(f"Missing dependency: {e}\nActivate the required Python/conda environment (needs Pillow, opencv-python, scipy) and retry.")

# ── paths ────────────────────────────────────────────────────────────────────
SCRIPT_DIR   = os.path.dirname(os.path.abspath(__file__))
INPUT_PATH   = os.path.join(SCRIPT_DIR, "public", "references", "rsna_current_132m.png")
OUTPUT_PATH  = os.path.join(SCRIPT_DIR, "public", "references", "demo_attention_132m_female.png")

# ── load original X-ray ──────────────────────────────────────────────────────
img_pil  = Image.open(INPUT_PATH).convert("L")          # grayscale
img_np   = np.array(img_pil, dtype=np.float32)          # (H, W)
H, W     = img_np.shape
print(f"Loaded X-ray: {W}×{H} px")

# ── 손 실루엣 마스크 생성 ─────────────────────────────────────────────────────
img_uint8_for_mask = img_np.astype(np.uint8)

# Step 1: 임계값 이진화 (배경 픽셀 = 18 이하)
_, hand_mask_raw = cv2.threshold(img_uint8_for_mask, 18, 1, cv2.THRESH_BINARY)
hand_mask_raw = hand_mask_raw.astype(np.uint8)

# Step 2: 모폴로지 클로즈 → 손 내부 채우기
kernel_close = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (21, 21))
hand_mask_closed = cv2.morphologyEx(hand_mask_raw, cv2.MORPH_CLOSE, kernel_close)

# Step 3: 딜레이트 → 손 가장자리 잘림 방지
kernel_dilate = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9))
hand_mask_hard = cv2.dilate(hand_mask_closed, kernel_dilate, iterations=2).astype(np.float32)

# Step 4: 가장자리 부드럽게 (Soft mask)
hand_mask_soft = gaussian_filter(hand_mask_hard, sigma=min(H, W) * 0.007)
hand_mask_soft = np.clip(hand_mask_soft, 0.0, 1.0)

# ── anatomical attention zones ───────────────────────────────────────────────
# Each tuple: (cy_frac, cx_frac, sigma_y_frac, sigma_x_frac, intensity)
# Coordinates are fractions of image dimensions.
# Origin (0,0) = top-left; y increases downward.
#
# v4: intensity를 전반적으로 낮춰 실제 BoneWise attention 톤 재현.
# 수근골/요골만 HIGH(0.75~0.85), MCP/PIP는 MEDIUM(0.55~0.72),
# 나머지는 LOW~MEDIUM(0.30~0.55) → 파랑~초록 기조 유지

ZONES = [
    # ── Distal radius / ulna growth plates (HIGH) ──────────────────────────
    (0.830, 0.440, 0.045, 0.090, 0.85),   # distal radius (radial side)
    (0.830, 0.580, 0.045, 0.065, 0.78),   # distal ulna (ulnar side)
    (0.845, 0.510, 0.040, 0.110, 0.74),   # radioulnar joint

    # ── Carpal bones — primary bone-age feature zone (HIGH) ────────────────
    (0.760, 0.385, 0.038, 0.070, 0.83),   # scaphoid / trapezium
    (0.760, 0.470, 0.042, 0.080, 0.85),   # lunate / capitate
    (0.760, 0.555, 0.038, 0.070, 0.81),   # triquetrum / hamate
    (0.775, 0.330, 0.035, 0.060, 0.75),   # trapezoid / radial carpal row
    (0.745, 0.505, 0.035, 0.130, 0.79),   # carpal arc (horizontal band)
    (0.790, 0.475, 0.040, 0.140, 0.73),   # distal carpal row

    # ── Metacarpal bases / CMC joints (MEDIUM-HIGH) ─────────────────────────
    (0.700, 0.355, 0.035, 0.060, 0.68),   # 2nd metacarpal base
    (0.700, 0.430, 0.038, 0.065, 0.72),   # 3rd metacarpal base
    (0.700, 0.505, 0.035, 0.060, 0.68),   # 4th metacarpal base
    (0.700, 0.570, 0.032, 0.055, 0.63),   # 5th metacarpal base
    (0.710, 0.280, 0.032, 0.055, 0.59),   # 1st metacarpal base / CMC

    # ── Mid-metacarpal shafts (MEDIUM) ──────────────────────────────────────
    (0.635, 0.350, 0.045, 0.048, 0.62),   # 2nd shaft
    (0.630, 0.427, 0.048, 0.050, 0.66),   # 3rd shaft
    (0.630, 0.503, 0.045, 0.048, 0.62),   # 4th shaft
    (0.635, 0.566, 0.040, 0.044, 0.57),   # 5th shaft
    (0.645, 0.270, 0.040, 0.045, 0.52),   # 1st metacarpal shaft

    # ── Metacarpal heads / MCP joints (MEDIUM) ──────────────────────────────
    (0.572, 0.345, 0.036, 0.044, 0.72),   # 2nd MCP
    (0.567, 0.423, 0.038, 0.048, 0.75),   # 3rd MCP
    (0.570, 0.500, 0.036, 0.044, 0.72),   # 4th MCP
    (0.575, 0.562, 0.032, 0.040, 0.68),   # 5th MCP
    (0.575, 0.245, 0.032, 0.040, 0.64),   # thumb MCP

    # ── Proximal phalanges (LOW-MEDIUM) ─────────────────────────────────────
    (0.502, 0.345, 0.042, 0.038, 0.58),   # 2nd proximal
    (0.497, 0.423, 0.044, 0.040, 0.62),   # 3rd proximal
    (0.502, 0.500, 0.042, 0.038, 0.58),   # 4th proximal
    (0.508, 0.558, 0.037, 0.034, 0.54),   # 5th proximal
    (0.520, 0.215, 0.040, 0.038, 0.50),   # thumb proximal

    # ── PIP joints (MEDIUM) ──────────────────────────────────────────────────
    (0.435, 0.345, 0.030, 0.034, 0.66),   # 2nd PIP
    (0.428, 0.423, 0.032, 0.036, 0.70),   # 3rd PIP
    (0.433, 0.500, 0.030, 0.034, 0.66),   # 4th PIP
    (0.440, 0.555, 0.028, 0.030, 0.61),   # 5th PIP
    (0.462, 0.182, 0.030, 0.030, 0.57),   # thumb IP

    # ── Middle phalanges (LOW-MEDIUM) ────────────────────────────────────────
    (0.380, 0.347, 0.034, 0.028, 0.52),   # 2nd middle
    (0.373, 0.424, 0.036, 0.030, 0.56),   # 3rd middle
    (0.378, 0.501, 0.034, 0.028, 0.52),   # 4th middle
    (0.385, 0.554, 0.028, 0.024, 0.47),   # 5th middle

    # ── DIP joints (LOW-MEDIUM) ──────────────────────────────────────────────
    (0.312, 0.349, 0.026, 0.028, 0.54),   # 2nd DIP
    (0.304, 0.425, 0.028, 0.030, 0.57),   # 3rd DIP
    (0.310, 0.502, 0.026, 0.028, 0.54),   # 4th DIP
    (0.316, 0.554, 0.024, 0.024, 0.49),   # 5th DIP

    # ── Distal phalanges (LOW) ────────────────────────────────────────────────
    (0.247, 0.350, 0.030, 0.024, 0.40),   # 2nd distal
    (0.238, 0.426, 0.032, 0.026, 0.43),   # 3rd distal
    (0.244, 0.503, 0.030, 0.024, 0.40),   # 4th distal
    (0.252, 0.554, 0.026, 0.020, 0.36),   # 5th distal
    (0.400, 0.148, 0.028, 0.024, 0.38),   # thumb distal

    # ── Fingertips (VERY LOW) ────────────────────────────────────────────────
    (0.183, 0.352, 0.024, 0.020, 0.30),   # 2nd tip
    (0.173, 0.428, 0.026, 0.022, 0.33),   # 3rd tip
    (0.180, 0.504, 0.024, 0.020, 0.30),   # 4th tip
    (0.188, 0.556, 0.020, 0.016, 0.27),   # 5th tip
    (0.365, 0.125, 0.024, 0.020, 0.30),   # thumb tip
]

# ── build heatmap canvas ─────────────────────────────────────────────────────
heat = np.zeros((H, W), dtype=np.float32)

y_coords = np.linspace(0.0, 1.0, H, dtype=np.float32)
x_coords = np.linspace(0.0, 1.0, W, dtype=np.float32)
XX, YY = np.meshgrid(x_coords, y_coords)

for (cy, cx, sy, sx, intensity) in ZONES:
    blob = np.exp(-0.5 * (((YY - cy) / sy) ** 2 + ((XX - cx) / sx) ** 2))
    heat = np.maximum(heat, blob * intensity)

# ── global smoothing ─────────────────────────────────────────────────────────
heat = gaussian_filter(heat, sigma=min(H, W) * 0.015)

# ── [v4-5] 손 마스크 적용: 배경에 약한 heat(0.10) 남겨 자연스러운 파랑 배경 ──
# 손 내부: 계산된 heat 그대로
# 손 외부(배경): 0.10 고정 → JET에서 파랑 계열로 표현됨
BACKGROUND_HEAT = 0.10
heat = heat * hand_mask_soft + BACKGROUND_HEAT * (1.0 - hand_mask_soft)

# Renormalize (배경 heat가 생겼으므로 최대값으로 정규화)
heat_max = heat.max()
if heat_max > 1e-6:
    heat = heat / heat_max

# ── [v4-2] gamma 2.2 적용: 낮은 값은 더 차갑게, 높은 값은 유지 ──────────────
# gamma=2.2 적용 후 JET colormap 기준:
#   수근골/radius(~0.80~0.85) → ^2.2 → 0.63~0.71  → YELLOW~ORANGE
#   MCP(~0.68~0.75)           → ^2.2 → 0.44~0.54  → GREEN~YELLOW
#   PIP(~0.61~0.70)           → ^2.2 → 0.34~0.46  → BLUE-GREEN~GREEN
#   DIP(~0.49~0.57)           → ^2.2 → 0.22~0.29  → BLUE
#   손가락 몸통(~0.40~0.55)   → ^2.2 → 0.14~0.26  → BLUE
#   배경(~0.10/norm)          → ^2.2 → 0.005~      → DEEP BLUE
heat = heat ** 2.2

# 재정규화
heat_max2 = heat.max()
if heat_max2 > 1e-6:
    heat = heat / heat_max2

# ── JET colormap ─────────────────────────────────────────────────────────────
heat_u8   = np.clip(heat * 255, 0, 255).astype(np.uint8)
jet_bgr   = cv2.applyColorMap(heat_u8, cv2.COLORMAP_JET)
jet_rgb   = cv2.cvtColor(jet_bgr, cv2.COLOR_BGR2RGB).astype(np.float32)

# ── composite ────────────────────────────────────────────────────────────────
# [v4-6] CLAHE clipLimit 1.5 (과도한 대비 완화)
img_uint8   = img_np.astype(np.uint8)
clahe       = cv2.createCLAHE(clipLimit=1.5, tileGridSize=(8, 8))
img_clahe   = clahe.apply(img_uint8)

# CSS PreProcess 필터 재현: contrast(1.15) × brightness(1.05)
clahe_f     = img_clahe.astype(np.float32) / 255.0
clahe_f     = 1.15 * (clahe_f - 0.5) + 0.5         # contrast 완화 (1.3 → 1.15)
clahe_f     = clahe_f * 1.05                         # brightness 완화 (1.1 → 1.05)
clahe_f     = np.clip(clahe_f, 0.0, 1.0)
clahe_u8    = (clahe_f * 255).astype(np.uint8)

# [v4-4] xray_base 0.72 → 0.62 (원본 뼈 구조 가시성 향상)
xray_rgb    = np.stack([clahe_u8] * 3, axis=2).astype(np.float32)
xray_base   = xray_rgb * 0.62

# [v4-3] JET overlay alpha 0.68 → 0.50
jet_alpha   = heat * 0.50                            # 0.0 ~ 0.50
alpha_3d    = jet_alpha[:, :, np.newaxis]            # (H,W,1) broadcast

# 최종 합성
result_f    = xray_base * (1.0 - alpha_3d) + jet_rgb * alpha_3d
result_f    = np.clip(result_f, 0, 255).astype(np.uint8)

# ── save ─────────────────────────────────────────────────────────────────────
out_img = Image.fromarray(result_f, mode="RGB")
out_img.save(OUTPUT_PATH, format="PNG", optimize=True)

size_kb = os.path.getsize(OUTPUT_PATH) / 1024
print(f"Saved → {OUTPUT_PATH}")
print(f"Output: {W}×{H} px, {size_kb:.1f} KB")
print("Done.")
