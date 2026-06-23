# BoneAGE-ALLIS- AI — Pediatric Bone Age Public Demo

> **Organization:** [bone-age-allis](https://github.com/bone-age-allis)  
> **Repository:** `bone-age-allis-public`

**This project contains no real AI inference, no backend server, no model weights, and no actual patient data.** All displayed results are pre-defined mockup values for UI demonstration purposes only.

## Development Team (For project-related inquiries, please contact the following)

박원호 - [langritspx@gmail.com](mailto:langritspx@gmail.com)
이현아 - [bun7680@gmail.com](mailto:bun7680@gmail.com)
정이랑 - [drjungyirang@gmail.com](mailto:drjungyirang@gmail.com)

---

BoneAGE-ALLIS AI — 소아 골연령 공개 데모

BoneAGE ALLIS AI 소아 골연령 평가 시스템의 화면 구성과 분석 흐름을 보여주는 정적 웹 데모입니다.

React/Vite 기반 프론트엔드 전용 시연 프로그램
Main Analysis, ROI Analysis, Comparison, Report 화면 제공
골연령 예측값, 앙상블 결과, ROI 결과는 모두 사전 정의된 Mock 데이터
실제 AI 추론, 백엔드 서버, 모델 가중치, API 연결, 환자 데이터는 포함하지 않음
일부 X-ray 이미지는 비식별화된 RSNA Pediatric Bone Age Challenge 공개 데이터셋 기반
연구·교육·비상업적 시연 목적으로만 사용 가능
의료기기 또는 임상 의사결정 지원 도구가 아니며, 진단·치료·환자 관리에 사용할 수 없음

## What This Is

A frontend-only React/Vite web application that demonstrates the user interface and simulated analysis workflow of the BoneWise AI system.

| Screen | Description |
|--------|-------------|
| **Main Analysis** | Simulated bone age prediction flow — Original / PreProcess / Attention X-ray views, 4-member ensemble mock results |
| **ROI Analysis** | Hand / Carpal / RUS region-of-interest overlay visualization with mock bone age values |
| **Comparison** | Longitudinal Previous ↔ Current study comparison and illustrative reference matching |
| **Report** | Report preview with ensemble summary and ROI summary |

### What This Demo Does NOT Include

- Real AI inference or model weight files
- Real backend, API server, or network connections
- Actual patient data or DICOM files
- Greulich–Pyle or other copyrighted atlas material
- User file upload or real-time analysis capability

---

## Quick Start

```bash
cd frontend_bone_age_allis_public_demo
npm ci
npm run dev
```

Open the Local URL shown in the terminal (default: `http://localhost:5173/bone-age-allis-public/`).

> Note: The frontend itself requires only Node.js and npm.  
> The optional `generate_attention_heatmap.py` script requires Python with Pillow, opencv-python, and scipy.

### Build

```bash
npm run build
```

`dist/` is generated. No build errors = ready for deployment.

---

## GitHub Pages Deployment

This repository is pre-configured for GitHub Pages via GitHub Actions.

1. Upload this folder's contents to the root of the `bone-age-allis/bone-age-allis-public` repository.
2. In **Settings → Pages → Source**, select **GitHub Actions**.
3. Push to `main`. The `.github/workflows/deploy-pages.yml` workflow handles build and deployment automatically.
4. Confirm `vite.config.js` `base` matches the repository name:
   ```js
   base: "/bone-age-allis-public/",
   ```

After a successful Actions run, the demo is served at:  
`https://bone-age-allis.github.io/bone-age-allis-public/`

> Before pushing, run `npm run build` locally to verify there are no build errors.

---

## Data Source, Attribution, and Permitted Use

This public demonstration includes selected de-identified sample radiographs derived from the RSNA Pediatric Bone Age Challenge dataset.

The images are used for research, education, and non-commercial demonstration purposes only. This project is not a medical device and must not be used for clinical diagnosis, treatment decisions, or patient management.

**RSNA Pediatric Bone Age Challenge dataset and annotation files:**  
https://www.rsna.org/artificial-intelligence/ai-image-challenge/rsna-pediatric-bone-age-challenge-2017

**Required citation:**

> Halabi SS, Prevedello LM, Kalpathy-Cramer J, et al.  
> The RSNA Pediatric Bone Age Machine Learning Challenge.  
> *Radiology.* 2019;290(2):498–503.  
> doi:10.1148/radiol.2018180736

The dataset is de-identified. No attempt may be made to identify or contact any individual represented in the dataset.

---

## Clinical Disclaimer

This demonstration is intended solely for research, education, and non-commercial UI visualization purposes.

**It is not a medical device, clinical decision support tool, or diagnostic aid.** Results shown are pre-defined mock values and do not represent real AI model outputs. This demo must not be used for clinical diagnosis, treatment planning, or any patient management decision.

---

## Security Notice

This repository contains:

- No API keys, tokens, passwords, or credentials
- No real backend addresses or connection strings
- No model weights (`.pth`, `.pt`, `.onnx`, etc.)
- No real patient data or DICOM files
- No personal or private information

Environment variables are not required to run this demo. No `.env` file is needed or expected.

---

## Project Structure

```
frontend_bone_age_allis_public_demo/
├── .github/
│   └── workflows/
│       └── deploy-pages.yml          # GitHub Pages auto-deployment
├── public/
│   ├── demo-assets/                  # Reserved; currently empty
│   └── references/                   # Demo X-ray images (RSNA public dataset samples)
│       ├── rsna_current_132m.png
│       ├── rsna_previous_126m.png
│       ├── rsna_patient_11461.png
│       ├── rsna_reference_120m.png
│       ├── rsna_reference_144m.png
│       └── demo_attention_132m_female.png  # Pre-generated heatmap composite
├── src/
│   ├── components/
│   │   ├── common/        # Header, DisclaimerBanner, Footer (RSNA attribution)
│   │   ├── main/          # MainAnalysisPanel, ViewerPane, SampleCaseSelector
│   │   ├── roi/           # RoiDemoPanel
│   │   ├── comparison/    # ComparisonDemoPanel
│   │   └── report/        # ReportDemoPanel
│   ├── data/
│   │   ├── mockDemoData.js         # All mock data (ensemble, ROI, references, etc.)
│   │   ├── publicDemoCases.js      # Sample case A/B definitions
│   │   └── publicDemoDisclosure.js # Disclaimer text constants
│   ├── services/
│   │   └── demoService.js          # Static demo service (zero network calls)
│   ├── styles/
│   │   ├── app.css
│   │   └── theme.css
│   ├── App.jsx
│   └── main.jsx
├── generate_attention_heatmap.py    # Helper: regenerate attention heatmap PNG
│                                    # Requires: Pillow, opencv-python, scipy
├── index.html
├── package.json
├── package-lock.json
├── PUBLIC_DEMO_SECURITY_CHECKLIST.md
├── vite.config.js                   # base: "/bone-age-allis-public/"
└── README.md
```

---

## Mock Data & Image Resources

| Resource | Location |
|----------|----------|
| Demo X-ray images (original, current, previous) | `public/references/*.png` |
| Attention heatmap image | `public/references/demo_attention_132m_female.png` |
| Reference images (120 m, 144 m) | `public/references/rsna_reference_*.png` |
| Best-match image | `public/references/rsna_patient_11461.png` |
| Main analysis mock data | `src/data/mockDemoData.js` |
| Sample case definitions | `src/data/publicDemoCases.js` |
| Disclaimer text | `src/data/publicDemoDisclosure.js` |

---

## License

This project's source code (UI components, styles, mock data) is provided for demonstration and educational purposes as part of the KDT12 Silla System project.

RSNA image samples in `public/references/` are subject to the
[RSNA Pediatric Bone Age Challenge Terms of Use](https://www.rsna.org/artificial-intelligence/ai-image-challenge/rsna-pediatric-bone-age-challenge-2017)
and may only be used for non-commercial, research, and educational purposes.

---

*BoneAGE-ALLIS- AI — Pediatric Bone Age Public Demo*
