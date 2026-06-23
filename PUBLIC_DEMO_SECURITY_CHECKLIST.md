# Public Demo Security Checklist

> This file documents the security and copyright verification checklist for the BoneWise AI Public Demo.
> It is intentionally excluded from the runtime bundle (not imported by any source file).

## Prohibited File Extensions

The following file types must NOT be present in this repository:
`.pth` `.pt` `.ckpt` `.onnx` `.safetensors` `.pkl` `.pickle` `.h5` `.hdf5` `.joblib` `.dcm` `.nii` `.nii.gz`

## Prohibited Runtime Patterns

The following patterns must NOT appear in executable source files (`*.js`, `*.jsx`, `*.ts`, `*.tsx`):

```
fetch(
axios.
XMLHttpRequest
WebSocket
EventSource
FormData POST
VITE_API_BASE_URL
import.meta.env
/api/boneage/
predict-custom-roi
roi-crop
localhost:8103
localhost:8104
127.0.0.1
backend_boneage_inference_adapter
new_model_package
torch
tensorflow
fastapi
uvicorn
cuda
checkpoint
weights
C:\workspace_dl_env
```

## Atlas / Copyright Verification Keywords

The following terms must NOT appear in UI components or asset references:

```
Best Match
bestMatch
matching atlas
reference image
referenceImage
similarity
Greulich
Pyle
Tanner
Whitehouse
```

Note: These keywords are listed here for verification reference only and do not violate the above rule.

## Atlas Tab

The Atlas tab has been **fully removed** from navigation, routing, and all imports.
No atlas images, thumbnails, or reference data are included.

## Verification Commands (PowerShell)

```powershell
# 1. Check for prohibited file extensions
Get-ChildItem -Path . -Recurse -File |
  Where-Object { $_.Extension -in '.pth','.pt','.ckpt','.onnx','.safetensors','.pkl','.pickle','.h5','.hdf5','.joblib','.dcm','.nii','.gz' } |
  Select-Object FullName

# 2. Check for prohibited runtime patterns in source files
$patterns = @('fetch\(','axios\.','XMLHttpRequest','WebSocket','EventSource','VITE_API_BASE_URL','import\.meta\.env','/api/boneage/','localhost:8103','localhost:8104','127\.0\.0\.1','backend_boneage_inference_adapter','new_model_package','C:\\workspace_dl_env')
Get-ChildItem -Path .\src -Recurse -File -Include *.js,*.jsx |
  Select-String -Pattern $patterns |
  Where-Object { $_.Path -notmatch 'demoService|publicDemo|Disclosure|Checklist' }

# 3. Check Atlas-related patterns in src/
$atlasPatterns = @('Best Match','bestMatch','matching atlas','referenceImage','Greulich','Pyle','Tanner','Whitehouse')
Get-ChildItem -Path .\src -Recurse -File -Include *.js,*.jsx,*.css |
  Select-String -Pattern $atlasPatterns
```

Expected: all commands return 0 results (excluding this checklist file and documentation files).
