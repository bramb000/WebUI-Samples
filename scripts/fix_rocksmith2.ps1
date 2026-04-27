$file = 'd:\WebUI Samples\src\views\ProjectRocksmith.vue'
$content = [System.IO.File]::ReadAllText($file)

# Fix remaining font-serif section header
$content = $content.Replace(
    'text-2xl font-serif font-bold sticky top-24">Accessibility & UI Scaling</h2>',
    'font-mono font-black text-xl uppercase tracking-wider sticky top-24" style="border-left:3px solid var(--color-accent);padding-left:10px">Accessibility &amp; UI Scaling</h2>'
)

# Fix all remaining border-t sections
$content = $content.Replace(
    'border-t border-[var(--color-text-charcoal)]/10 pt-16">',
    'border-t pt-16" style="border-color:var(--color-border)">'
)

[System.IO.File]::WriteAllText($file, $content)
Write-Host "Rocksmith final fixes complete"
