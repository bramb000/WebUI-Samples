$file = 'd:\WebUI Samples\src\components\Footer.vue'
$content = [System.IO.File]::ReadAllText($file)
# Find the FIRST </style> occurrence and truncate there
$idx = $content.IndexOf('</style>')
if ($idx -ge 0) {
    $clean = $content.Substring(0, $idx + '</style>'.Length) + "`n"
    [System.IO.File]::WriteAllText($file, $clean)
    Write-Host "Footer truncated cleanly at </style>"
} else {
    Write-Host "No </style> tag found"
}
