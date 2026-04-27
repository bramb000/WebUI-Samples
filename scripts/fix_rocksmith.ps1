$file = 'd:\WebUI Samples\src\views\ProjectRocksmith.vue'
$content = [System.IO.File]::ReadAllText($file)

# Team member line
$content = $content.Replace(
    '<p class="font-serif text-lg">UX Director | 2 UX Designers | 2 UI Artists | 2 UI Engineers</p>',
    '<p class="font-mono text-sm uppercase tracking-wider opacity-75">UX Director &middot; 2 UX Designers &middot; 2 UI Artists &middot; 2 UI Engineers</p>'
)

# Executive summary section card
$content = $content.Replace(
    '<section class="bg-white dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 p-12 rounded-3xl space-y-8 shadow-sm">',
    '<section class="panel-recessed noise-overlay p-10 md:p-14 space-y-8">'
)

# Results section card
$content = $content.Replace(
    '<section class="bg-white dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 p-12 rounded-3xl space-y-8 shadow-sm">',
    '<section class="panel-recessed noise-overlay p-10 md:p-14 space-y-8">'
)

# h2 Executive Summary
$content = $content.Replace(
    '<h2 class="text-3xl font-serif font-bold">Executive Summary</h2>',
    '<h2 class="font-mono font-black text-3xl uppercase tracking-widest" style="color:var(--color-accent)">Executive Summary</h2>'
)

# h2 Result
$content = $content.Replace(
    '<h2 class="text-4xl font-serif font-bold">Result</h2>',
    '<h2 class="font-mono font-black text-4xl uppercase tracking-wide" style="color:var(--color-accent)">Result</h2>'
)

# Emerald sub-headings in exec summary
$content = $content.Replace(
    '<h4 class="text-sm font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-500 mb-2">01. The Problem</h4>',
    '<h4 class="font-mono font-black text-xs uppercase tracking-widest mb-2" style="color:var(--color-accent)">01. The Problem</h4>'
)
$content = $content.Replace(
    '<h4 class="text-sm font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-500 mb-2">02. The Solution</h4>',
    '<h4 class="font-mono font-black text-xs uppercase tracking-widest mb-2" style="color:var(--color-accent)">02. The Solution</h4>'
)

# Emerald link in results
$content = $content.Replace(
    'class="underline font-bold hover:opacity-70 transition-opacity text-emerald-700 dark:text-emerald-500"',
    'class="underline font-bold hover:opacity-70 transition-opacity" style="color:var(--color-accent)"'
)

# All section h2 headings
$content = $content.Replace(
    '<h2 class="text-2xl font-serif font-bold sticky top-24">Context</h2>',
    '<h2 class="font-mono font-black text-xl uppercase tracking-wider sticky top-24" style="border-left:3px solid var(--color-accent);padding-left:10px">Context</h2>'
)
$content = $content.Replace(
    '<h2 class="text-2xl font-serif font-bold sticky top-24">Research</h2>',
    '<h2 class="font-mono font-black text-xl uppercase tracking-wider sticky top-24" style="border-left:3px solid var(--color-accent);padding-left:10px">Research</h2>'
)
$content = $content.Replace(
    '<h2 class="text-2xl font-serif font-bold sticky top-24">Responsive UI</h2>',
    '<h2 class="font-mono font-black text-xl uppercase tracking-wider sticky top-24" style="border-left:3px solid var(--color-accent);padding-left:10px">Responsive UI</h2>'
)
$content = $content.Replace(
    '<h2 class="text-2xl font-serif font-bold sticky top-24">Accessibility &amp; UI Scaling</h2>',
    '<h2 class="font-mono font-black text-xl uppercase tracking-wider sticky top-24" style="border-left:3px solid var(--color-accent);padding-left:10px">Accessibility &amp; UI Scaling</h2>'
)
$content = $content.Replace(
    '<h2 class="text-2xl font-serif font-bold sticky top-24">Unified Input System</h2>',
    '<h2 class="font-mono font-black text-xl uppercase tracking-wider sticky top-24" style="border-left:3px solid var(--color-accent);padding-left:10px">Unified Input System</h2>'
)
$content = $content.Replace(
    '<h2 class="text-2xl font-serif font-bold sticky top-24">Platform-Specific Component Adaptations</h2>',
    '<h2 class="font-mono font-black text-xl uppercase tracking-wider sticky top-24" style="border-left:3px solid var(--color-accent);padding-left:10px">Platform-Specific Component Adaptations</h2>'
)
$content = $content.Replace(
    '<h2 class="text-2xl font-serif font-bold sticky top-24">Console Navigation Challenge</h2>',
    '<h2 class="font-mono font-black text-xl uppercase tracking-wider sticky top-24" style="border-left:3px solid var(--color-accent);padding-left:10px">Console Navigation Challenge</h2>'
)

# Learnings + Testimonials
$content = $content.Replace(
    '<h2 class="text-3xl font-serif font-bold">Learnings</h2>',
    '<h2 class="font-mono font-black text-3xl uppercase tracking-wide">Learnings</h2>'
)
$content = $content.Replace(
    '<h2 class="text-3xl font-serif font-bold text-center mb-12">What My Colleagues Say</h2>',
    '<h2 class="font-mono font-black text-3xl uppercase tracking-wide text-center mb-12">What My Colleagues Say</h2>'
)

# Testimonial divs
$content = $content.Replace(
    '<div class="space-y-4 text-center">' + "`r`n" + '          <h4 class="font-serif italic text-sm">Hiroshi Ogawa, Lead UI Engineer, Ubisoft</h4>',
    '<div class="panel-recessed p-8 space-y-4">' + "`r`n" + '          <h4 class="font-mono font-black text-xs uppercase tracking-widest" style="color:var(--color-accent)">Hiroshi Ogawa, Lead UI Engineer, Ubisoft</h4>'
)
$content = $content.Replace(
    '<div class="space-y-4 text-center">' + "`r`n" + '          <h4 class="font-serif italic text-sm">Kaiwen Young, Director of User Experience, Ubisoft</h4>',
    '<div class="panel-recessed p-8 space-y-4">' + "`r`n" + '          <h4 class="font-mono font-black text-xs uppercase tracking-widest" style="color:var(--color-accent)">Kaiwen Young, Director of User Experience, Ubisoft</h4>'
)
$content = $content.Replace(
    '<div class="space-y-4 text-center">' + "`r`n" + '          <h4 class="font-serif italic text-sm">Rohit Suvarna, Senior Game Designer, Ubisoft</h4>',
    '<div class="panel-recessed p-8 space-y-4">' + "`r`n" + '          <h4 class="font-mono font-black text-xs uppercase tracking-widest" style="color:var(--color-accent)">Rohit Suvarna, Senior Game Designer, Ubisoft</h4>'
)
$content = $content.Replace(
    '<div class="space-y-4 text-center">' + "`r`n" + '          <h4 class="font-serif italic text-sm">Utkarsh Bagade, Senior Engineer, Ubisoft</h4>',
    '<div class="panel-recessed p-8 space-y-4">' + "`r`n" + '          <h4 class="font-mono font-black text-xs uppercase tracking-widest" style="color:var(--color-accent)">Utkarsh Bagade, Senior Engineer, Ubisoft</h4>'
)

# Section h3 headings
$content = $content.Replace(
    '<h3 class="text-xl font-sans font-bold pt-4">User Testing Gallery</h3>',
    '<h3 class="font-mono font-black text-sm uppercase tracking-widest pt-4" style="color:var(--color-accent)">User Testing Gallery</h3>'
)

# Border fixes
$content = $content -replace 'border-t border-\[var\(--color-text-charcoal\)\]/10 pt-16', 'border-t pt-16" style="border-color:var(--color-border)'

# Nested scroll images (white bg)
$content = $content.Replace(
    'imgClass="w-full h-auto rounded-xl border border-gray-200 p-4 bg-white"',
    'imgClass="w-full h-auto rounded-xl panel-recessed p-4"'
)

[System.IO.File]::WriteAllText($file, $content)
Write-Host "Rocksmith conversion complete"
