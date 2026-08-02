$base = ".asset-staging-20260802\Sunnyside_World_ASSET_PACK_V2.1\Sunnyside_World_Assets"
$files = Get-ChildItem $base -Recurse -Include "*.png","*.gif","*.aseprite"
$groups = $files | Group-Object { $_.DirectoryName -replace '.*Sunnyside_World_Assets\\','' }
foreach ($g in $groups) {
    $n = $g.Name
    $c = $g.Count
    Write-Host "$n  ($c files)"
}
Write-Host ""
Write-Host "TOTAL: $($files.Count) image files"

# Also check rainy hearts
Write-Host ""
Write-Host "=== RAINY HEARTS ==="
$rh = Get-ChildItem ".asset-staging-20260802\fonts\rainyhearts" -Recurse -ErrorAction SilentlyContinue
if ($rh) {
    foreach ($f in $rh) {
        Write-Host $f.Name
    }
} else {
    Write-Host "Not found in staging/fonts/rainyhearts"
}
