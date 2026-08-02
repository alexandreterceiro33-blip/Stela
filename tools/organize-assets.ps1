$ErrorActionPreference = "Stop"

$workspace    = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$stagingDir   = Join-Path $workspace ".asset-staging-20260802"
$assetsDir    = Join-Path $workspace "assets"
$discardedDir = Join-Path $workspace "_discarded"

Write-Host ""
Write-Host "=========================================="
Write-Host "  Stella - Asset Organization Script"
Write-Host "=========================================="
Write-Host ""

# --- 1. Create directory tree ---
Write-Host "[1/6] Creating directory tree..."

$dirs = @(
    "characters\player",
    "characters\npc",
    "characters\animals",
    "tilesets\forest",
    "tilesets\village",
    "tilesets\mountain",
    "tilesets\beach",
    "tilesets\interior",
    "objects",
    "nature",
    "buildings",
    "particles",
    "effects",
    "ui",
    "fonts",
    "music",
    "sfx"
)

foreach ($d in $dirs) {
    $path = Join-Path $assetsDir $d
    if (-not (Test-Path $path)) {
        New-Item -ItemType Directory -Path $path -Force | Out-Null
        Write-Host "  + $d"
    }
}

if (-not (Test-Path $discardedDir)) {
    New-Item -ItemType Directory -Path $discardedDir -Force | Out-Null
}
Write-Host "  Done."
Write-Host ""

# --- 2. Verify staging ---
if (-not (Test-Path $stagingDir)) {
    Write-Host "ERROR: Staging directory not found: $stagingDir"
    Write-Host "Please download the assets first."
    exit 1
}

$copied   = 0
$renamed  = 0
$skipped  = 0
$discardedN = 0

# --- Helper function ---
function SafeCopy($Source, $DestDir, $NewName) {
    $dest = Join-Path $DestDir $NewName
    if (Test-Path $dest) {
        $script:skipped++
        return
    }
    if (-not (Test-Path $DestDir)) {
        New-Item -ItemType Directory -Path $DestDir -Force | Out-Null
    }
    Copy-Item -Path $Source -Destination $dest -Force
    $script:copied++
    $origName = Split-Path $Source -Leaf
    if ($origName -ne $NewName) {
        $script:renamed++
    }
    Write-Host "  >> $NewName" -ForegroundColor Green
}

# --- 3a. SFX ---
Write-Host "[2/6] Processing SFX (Kenney RPG Audio)..."
$audioDir = Join-Path $stagingDir "kenney_rpg-audio"
if (Test-Path $audioDir) {
    $sfxDest = Join-Path $assetsDir "sfx"
    $audioFiles = Get-ChildItem -Path $audioDir -Filter "*.ogg" -Recurse
    foreach ($f in $audioFiles) {
        $clean = $f.Name.ToLower() -replace '\s+','_' -replace '-','_'
        $prefix = "sfx_misc"
        if ($clean -match "footstep")  { $prefix = "sfx_footstep" }
        elseif ($clean -match "door")  { $prefix = "sfx_door" }
        elseif ($clean -match "book")  { $prefix = "sfx_book" }
        elseif ($clean -match "coin|gem|leather|cloth") { $prefix = "sfx_item" }
        elseif ($clean -match "click|rollover|confirm|cancel") { $prefix = "sfx_ui" }
        elseif ($clean -match "chop|knife|slice") { $prefix = "sfx_action" }
        elseif ($clean -match "creak|metal|pot|latch") { $prefix = "sfx_environment" }

        if (-not $clean.StartsWith("sfx_")) {
            $clean = $prefix + "_" + $clean
        }
        SafeCopy $f.FullName $sfxDest $clean
    }
}
Write-Host ""

# --- 3b. Fonts ---
Write-Host "[3/6] Processing Fonts..."
$fontDest = Join-Path $assetsDir "fonts"

$kenneyFonts = Join-Path $stagingDir "kenney_fonts"
if (Test-Path $kenneyFonts) {
    $selectedFonts = @("Kenney Pixel.ttf", "Kenney Pixel Square.ttf", "Kenney Mini.ttf", "Kenney Mini Square.ttf")
    foreach ($fname in $selectedFonts) {
        $src = Get-ChildItem -Path $kenneyFonts -Filter $fname -Recurse | Select-Object -First 1
        if ($src) {
            $clean = $fname.ToLower() -replace '\s+','_'
            SafeCopy $src.FullName $fontDest $clean
        }
    }
}

$tioFonts = Join-Path $stagingDir "tiopalada_tiny-rpg-font-kit-i"
if (Test-Path $tioFonts) {
    $ttfFiles = Get-ChildItem -Path $tioFonts -Filter "*.ttf" -Recurse
    foreach ($f in $ttfFiles) {
        $clean = $f.Name.ToLower() -replace '\s+','_' -replace '-','_'
        SafeCopy $f.FullName $fontDest $clean
    }
}
Write-Host ""

# --- 3c. Particles ---
Write-Host "[4/6] Processing Particles (selective)..."
$particleSrc = Join-Path $stagingDir "kenney_particle-pack"
$particleDest = Join-Path $assetsDir "particles"
if (Test-Path $particleSrc) {
    $allowedPatterns = @("star", "circle", "light", "smoke", "twirl", "spark", "flare", "window")
    $excludePatterns = @("slash", "muzzle", "scorch", "scratch", "trace")

    $pngDir = Join-Path $particleSrc "PNG (Transparent)"
    if (Test-Path $pngDir) {
        $pFiles = Get-ChildItem -Path $pngDir -Filter "*.png"
        foreach ($f in $pFiles) {
            $lower = $f.Name.ToLower()
            $allowed = $false
            foreach ($p in $allowedPatterns) {
                if ($lower -match $p) { $allowed = $true; break }
            }
            foreach ($p in $excludePatterns) {
                if ($lower -match $p) { $allowed = $false; break }
            }
            if ($allowed) {
                $clean = "particle_" + ($lower -replace '\s+','_' -replace '-','_')
                SafeCopy $f.FullName $particleDest $clean
            }
        }
    }
}
Write-Host ""

# --- 3d. UI ---
Write-Host "[5/6] Processing UI elements..."
$uiSrc = Join-Path $stagingDir "kenney_pixel-ui-pack"
$uiDest = Join-Path $assetsDir "ui"
if (Test-Path $uiSrc) {
    $uiFiles = Get-ChildItem -Path $uiSrc -Filter "*.png" -Recurse
    foreach ($f in $uiFiles) {
        $clean = "ui_" + ($f.Name.ToLower() -replace '\s+','_' -replace '-','_')
        SafeCopy $f.FullName $uiDest $clean
    }
}
Write-Host ""

# --- 3e. Sunnyside World (ANCHOR PACK) ---
Write-Host "[6/9] Processing Sunnyside World..."

# Try multiple possible folder names
$sunnySrc = $null
$candidates = @("sunnyside_world", "Sunnyside_World_ASSET_PACK_V2.1")
foreach ($c in $candidates) {
    $test = Join-Path $stagingDir $c
    if (Test-Path $test) { $sunnySrc = $test; break }
}

if ($sunnySrc) {
    # Find the actual assets subfolder
    $assetsRoot = $sunnySrc
    $sub = Join-Path $sunnySrc "Sunnyside_World_Assets"
    if (Test-Path $sub) { $assetsRoot = $sub }

    # --- Characters: Human ---
    $humanSrc = Join-Path $assetsRoot "Characters\Human"
    if (Test-Path $humanSrc) {
        $playerDest = Join-Path $assetsDir "characters\player"
        $actions = Get-ChildItem $humanSrc -Directory
        foreach ($action in $actions) {
            $pngs = Get-ChildItem $action.FullName -Filter "*.png" -ErrorAction SilentlyContinue
            foreach ($f in $pngs) {
                $clean = "char_human_" + $action.Name.ToLower() + "_" + ($f.Name.ToLower() -replace '\s+','_')
                SafeCopy $f.FullName $playerDest $clean
            }
        }
    }

    # --- Characters: Goblin ---
    $goblinSrc = Join-Path $assetsRoot "Characters\Goblin\PNG"
    if (Test-Path $goblinSrc) {
        $npcDest = Join-Path $assetsDir "characters\npc"
        $pngs = Get-ChildItem $goblinSrc -Filter "*.png"
        foreach ($f in $pngs) {
            $clean = "char_goblin_" + ($f.Name.ToLower() -replace '\s+','_')
            SafeCopy $f.FullName $npcDest $clean
        }
    }

    # --- Characters: Skeleton ---
    $skelSrc = Join-Path $assetsRoot "Characters\Skeleton\PNG"
    if (Test-Path $skelSrc) {
        $npcDest = Join-Path $assetsDir "characters\npc"
        $pngs = Get-ChildItem $skelSrc -Filter "*.png"
        foreach ($f in $pngs) {
            $clean = "char_skeleton_" + ($f.Name.ToLower() -replace '\s+','_')
            SafeCopy $f.FullName $npcDest $clean
        }
    }

    # --- Tileset ---
    $tileSrc = Join-Path $assetsRoot "Tileset"
    if (Test-Path $tileSrc) {
        $tileDest = Join-Path $assetsDir "tilesets\village"
        $pngs = Get-ChildItem $tileSrc -Filter "*.png" -Recurse
        foreach ($f in $pngs) {
            $clean = "tileset_ss_" + ($f.Name.ToLower() -replace '\s+','_')
            SafeCopy $f.FullName $tileDest $clean
        }
    }

    # --- Elements: Crops ---
    $cropSrc = Join-Path $assetsRoot "Elements\Crops"
    if (Test-Path $cropSrc) {
        $objDest = Join-Path $assetsDir "objects"
        $pngs = Get-ChildItem $cropSrc -Filter "*.png" -Recurse
        foreach ($f in $pngs) {
            $clean = "obj_crop_" + ($f.Name.ToLower() -replace '\s+','_')
            SafeCopy $f.FullName $objDest $clean
        }
    }

    # --- Elements: Animals ---
    $animalSrc = Join-Path $assetsRoot "Elements\Animals"
    if (Test-Path $animalSrc) {
        $animalDest = Join-Path $assetsDir "characters\animals"
        $pngs = Get-ChildItem $animalSrc -Filter "*.png" -Recurse
        foreach ($f in $pngs) {
            $clean = "char_animal_" + ($f.Name.ToLower() -replace '\s+','_')
            SafeCopy $f.FullName $animalDest $clean
        }
    }

    # --- Elements: Plants ---
    $plantSrc = Join-Path $assetsRoot "Elements\Plants"
    if (Test-Path $plantSrc) {
        $natureDest = Join-Path $assetsDir "nature"
        $pngs = Get-ChildItem $plantSrc -Filter "*.png" -Recurse
        foreach ($f in $pngs) {
            $clean = "nature_plant_" + ($f.Name.ToLower() -replace '\s+','_')
            SafeCopy $f.FullName $natureDest $clean
        }
    }

    # --- Elements: VFX ---
    $vfxSrc = Join-Path $assetsRoot "Elements\VFX"
    if (Test-Path $vfxSrc) {
        $effectDest = Join-Path $assetsDir "effects"
        $pngs = Get-ChildItem $vfxSrc -Filter "*.png" -Recurse
        foreach ($f in $pngs) {
            $parent = $f.Directory.Name.ToLower() -replace '\s+','_'
            $clean = "vfx_" + $parent + "_" + ($f.Name.ToLower() -replace '\s+','_')
            SafeCopy $f.FullName $effectDest $clean
        }
    }

    # --- Elements: Other ---
    $otherSrc = Join-Path $assetsRoot "Elements\Other"
    if (Test-Path $otherSrc) {
        $objDest = Join-Path $assetsDir "objects"
        $pngs = Get-ChildItem $otherSrc -Filter "*.png" -Recurse
        foreach ($f in $pngs) {
            $clean = "obj_misc_" + ($f.Name.ToLower() -replace '\s+','_')
            SafeCopy $f.FullName $objDest $clean
        }
    }

    # --- UI ---
    $uiSrc = Join-Path $assetsRoot "UI"
    if (Test-Path $uiSrc) {
        $uiDest = Join-Path $assetsDir "ui"
        $pngs = Get-ChildItem $uiSrc -Filter "*.png" -Recurse
        foreach ($f in $pngs) {
            $clean = "ui_ss_" + ($f.Name.ToLower() -replace '\s+','_')
            SafeCopy $f.FullName $uiDest $clean
        }
    }

    # --- Example scene (reference only) ---
    $exScene = Join-Path $assetsRoot "Sunnyside_World_ExampleScene.png"
    if (Test-Path $exScene) {
        SafeCopy $exScene (Join-Path $assetsDir "tilesets") "reference_sunnyside_example.png"
    }

    Write-Host "  Sunnyside World processed." -ForegroundColor Green
} else {
    Write-Host "  Sunnyside World not found. Download it first." -ForegroundColor Yellow
}
Write-Host ""

# --- 3f. Rainy Hearts font ---
Write-Host "[7/9] Processing Rainy Hearts font..."
$rainyDir = Join-Path $stagingDir "fonts"
if (Test-Path $rainyDir) {
    $rainyFile = Get-ChildItem -Path $rainyDir -Filter "rainyhearts.ttf" -Recurse | Select-Object -First 1
    if ($rainyFile) {
        SafeCopy $rainyFile.FullName (Join-Path $assetsDir "fonts") "rainyhearts.ttf"
    }
}
# Also check root staging for rainyhearts
$rainyAlt = Get-ChildItem -Path $stagingDir -Filter "rainyhearts.ttf" -Recurse | Select-Object -First 1
if ($rainyAlt) {
    SafeCopy $rainyAlt.FullName (Join-Path $assetsDir "fonts") "rainyhearts.ttf"
}
Write-Host ""

# --- 4. Discarded packs ---
Write-Host "[8/9] Copying discarded packs..."
$discardedPacks = @(
    "ansimuz_tiny-rpg-forest",
    "ansimuz_tiny-rpg-mountain",
    "kenney_roguelike-characters",
    "kenney_roguelike-rpg-pack",
    "kenney_rpg-base",
    "kenney_animal-pack-remastered"
)
foreach ($pack in $discardedPacks) {
    $src = Join-Path $stagingDir $pack
    $dst = Join-Path $discardedDir $pack
    if ((Test-Path $src) -and (-not (Test-Path $dst))) {
        Copy-Item -Path $src -Destination $dst -Recurse -Force
        Write-Host "  X $pack (style incompatible)" -ForegroundColor Yellow
        $discardedN++
    }
}


# --- 5. Report ---
Write-Host ""
Write-Host "=========================================="
Write-Host "  Organization Report"
Write-Host "=========================================="
Write-Host "  Assets copied:       $copied"
Write-Host "  Assets renamed:      $renamed"
Write-Host "  Duplicates skipped:  $skipped"
Write-Host "  Packs discarded:     $discardedN"
Write-Host "=========================================="

# --- 6. Duplicates check ---
Write-Host ""
Write-Host "[9/9] Checking for duplicates..."
$allAssets = Get-ChildItem -Path $assetsDir -File -Recurse
$groups = $allAssets | Group-Object Name | Where-Object { $_.Count -gt 1 }
if ($groups.Count -eq 0) {
    Write-Host "  OK - No duplicates found." -ForegroundColor Green
} else {
    Write-Host "  WARNING - Duplicates found:" -ForegroundColor Red
    foreach ($g in $groups) {
        $dName = $g.Name
        $dCount = $g.Count
        Write-Host "    - $dName [$dCount copies]" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Asset organization complete!" -ForegroundColor Green
Write-Host "  Next: Download pending assets from ASSET_DOWNLOAD_GUIDE.md"
