$file = 'd:\WebUI Samples\src\views\ProjectGuild.vue'
$content = [System.IO.File]::ReadAllText($file)

# Replace the 3 remaining old-style section headers using the raw & character in the source
$patterns = @(
    @{ old = 'text-2xl font-serif font-bold sticky top-24">Exit Screen & Anticipation</h2>'; new = 'font-mono font-black text-xl uppercase tracking-wider sticky top-24" style="border-left:3px solid var(--color-accent);padding-left:10px">Exit Screen &amp; Anticipation</h2>' },
    @{ old = 'text-2xl font-serif font-bold sticky top-24">Visual Progression & Goal Setting</h2>'; new = 'font-mono font-black text-xl uppercase tracking-wider sticky top-24" style="border-left:3px solid var(--color-accent);padding-left:10px">Visual Progression &amp; Goal Setting</h2>' },
    @{ old = 'text-2xl font-serif font-bold sticky top-24">Moments of Delight & Monetisation</h2>'; new = 'font-mono font-black text-xl uppercase tracking-wider sticky top-24" style="border-left:3px solid var(--color-accent);padding-left:10px">Moments of Delight &amp; Monetisation</h2>' }
)
foreach ($p in $patterns) {
    $before = $content.Length
    $content = $content.Replace($p.old, $p.new)
    $after = $content.Length
    Write-Host ("Replaced '{0}': changed={1}" -f $p.old, ($before -ne $after))
}

# Also fix the section border on Exit Screen and the remaining sections
$content = $content.Replace(
    'border-t border-[var(--color-text-charcoal)]/10 pt-16">',
    'border-t pt-16" style="border-color:var(--color-border)">'
)

[System.IO.File]::WriteAllText($file, $content)
Write-Host "Guild fixes complete"
