# Creates a PUBLIC repository in the authenticated GitHub account, then enables Pages.
# No tokens are requested by this script or sent to a chat. gh manages browser login.
param([ValidatePattern('^[A-Za-z0-9][A-Za-z0-9._-]{0,99}$')][string]$RepoName = 'lexi-academic')
$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot

function Read-Native([string]$Exe, [string[]]$Argv) {
    $ErrorActionPreference = 'Continue'
    $result = & $Exe @Argv 2>$null
    return [PSCustomObject]@{ Code = $LASTEXITCODE; Text = ($result -join "`n").Trim() }
}
function Run-Native([string]$Exe, [string[]]$Argv) {
    $ErrorActionPreference = 'Continue'
    & $Exe @Argv
    if ($LASTEXITCODE -ne 0) { throw "$Exe failed (exit $LASTEXITCODE). Stop and review the error above." }
}

try {
    foreach ($tool in @('git', 'gh')) {
        if (-not (Get-Command $tool -ErrorAction SilentlyContinue)) {
            Write-Host "Missing: $tool. Install it, reopen the terminal, and run this script again." -ForegroundColor Yellow
            Write-Host '  winget install --id Git.Git --exact'
            Write-Host '  winget install --id GitHub.cli --exact'
            throw 'A required program is missing. No repository has been created.'
        }
    }
    if (-not (Test-Path 'index.html') -or -not (Test-Path 'assets/words.js')) {
        throw 'Unpack the entire archive first. index.html and assets/words.js must be next to this script.'
    }
    $auth = Read-Native 'gh' @('auth', 'status', '--hostname', 'github.com')
    if ($auth.Code -ne 0) {
        Run-Native 'gh' @('auth', 'login', '--hostname', 'github.com', '--web', '--git-protocol', 'https')
    }
    $userResult = Read-Native 'gh' @('api', '--hostname', 'github.com', 'user')
    if ($userResult.Code -ne 0) { throw 'Cannot read the authenticated account. Run gh auth login and try again.' }
    $user = $userResult.Text | ConvertFrom-Json
    $owner = $user.login
    if ([string]::IsNullOrWhiteSpace($owner)) { throw 'GitHub did not return an account name.' }
    $full = "$owner/$RepoName"
    Write-Host "`nAccount: $owner" -ForegroundColor Cyan
    Write-Host "Repository: $full (PUBLIC)"
    Write-Host 'Only this trainer will be uploaded. No textbook PDF or learning progress is included.'
    $yes = Read-Host 'Create/update this project and publish it? Type Y to continue'
    if ($yes -notmatch '^[yY]$') { Write-Host 'Cancelled. No repository changed.'; exit 0 }

    if (-not (Test-Path '.git')) { Run-Native 'git' @('init', '-b', 'main') }
    $root = Read-Native 'git' @('rev-parse', '--show-toplevel')
    if ($root.Code -ne 0 -or [IO.Path]::GetFullPath($root.Text) -ne [IO.Path]::GetFullPath($PSScriptRoot)) {
        throw 'This folder is not the root of its own Git repository. Use a freshly unpacked archive.'
    }
    $branch = Read-Native 'git' @('branch', '--show-current')
    if ($branch.Text -ne 'main') { throw 'This script publishes main. Switch to main or use a freshly unpacked archive.' }
    $origin = Read-Native 'git' @('remote', 'get-url', 'origin')
    $remote = Read-Native 'gh' @('repo', 'view', $full, '--json', 'name', '--jq', '.name')
    if ($origin.Code -eq 0) {
        $url = $origin.Text.TrimEnd('/') -replace '\.git$', ''
        if ($url -notin @("https://github.com/$full", "git@github.com:$full")) {
            throw "origin points to a different repository ($url). Nothing will be overwritten."
        }
    } elseif ($remote.Code -eq 0) {
        throw "Repository $full already exists. Use another name: .\publish.ps1 -RepoName lexi-units-1-3"
    }
    # Refuse unrelated tracked/staged files instead of accidentally publishing them.
    $tracked = Read-Native 'git' @('ls-files')
    $allowed = '^(index\.html|vocabulary\.json|README\.md|SOURCES\.md|TESTING\.md|\.nojekyll|\.gitignore|publish\.(ps1|cmd)|package\.json|assets/(app\.js|style\.css|words\.js|icon\.svg)|tests/check\.mjs)$'
    foreach ($name in ($tracked.Text -split "`n")) {
        if ($name -and $name -notmatch $allowed) { throw "Unexpected tracked file: $name. Use a clean project folder." }
    }
    foreach ($setting in @('user.name','user.email')) {
        $current = Read-Native 'git' @('config', $setting)
        if ($current.Code -ne 0 -or -not $current.Text) {
            $value = if ($setting -eq 'user.name') { $owner } else { "$($user.id)+$owner@users.noreply.github.com" }
            Run-Native 'git' @('config', '--local', $setting, $value)
        }
    }
    Run-Native 'git' @('add', '--', 'index.html', 'assets/app.js', 'assets/style.css', 'assets/words.js', 'assets/icon.svg', 'vocabulary.json', 'README.md', 'SOURCES.md', 'TESTING.md', '.nojekyll', '.gitignore', 'publish.ps1', 'publish.cmd', 'package.json', 'tests/check.mjs')
    $diff = Read-Native 'git' @('diff', '--cached', '--quiet')
    if ($diff.Code -eq 1) { Run-Native 'git' @('commit', '-m', 'Build Lexi Academic vocabulary trainer') }
    elseif ($diff.Code -ne 0) { throw 'Cannot inspect staged changes.' }
    Run-Native 'gh' @('auth', 'setup-git', '--hostname', 'github.com')
    if ($origin.Code -ne 0 -and $remote.Code -ne 0) {
        Run-Native 'gh' @('repo', 'create', $full, '--public', '--source=.', '--remote=origin', '--push', '--description', 'Academic English Units 1-3: flashcards, quiz, typing and spaced review')
    } elseif ($remote.Code -eq 0 -and $origin.Code -eq 0) {
        Run-Native 'git' @('push', '-u', 'origin', 'main')
    } else { throw 'Repository/origin state is inconsistent. Check gh repo view and git remote -v.' }

    $pages = Read-Native 'gh' @('api', "repos/$full/pages")
    if ($pages.Code -ne 0) {
        Run-Native 'gh' @('api', '--method', 'POST', "repos/$full/pages", '-H', 'Accept: application/vnd.github+json', '-f', 'build_type=legacy', '-f', 'source[branch]=main', '-f', 'source[path]=/')
    } else {
        $settings = $pages.Text | ConvertFrom-Json
        if ($settings.source.branch -ne 'main' -or $settings.source.path -ne '/' -or $settings.build_type -eq 'workflow') {
            throw "Pages uses a different configuration. Review https://github.com/$full/settings/pages (main / root)."
        }
    }
    $siteResult = Read-Native 'gh' @('api', "repos/$full/pages", '--jq', '.html_url')
    if ($siteResult.Code -ne 0 -or -not $siteResult.Text.StartsWith('https://')) {
        throw "Repository pushed, but cannot read the Pages URL. Open https://github.com/$full/settings/pages"
    }
    $site = $siteResult.Text
    $null = Read-Native 'gh' @('repo', 'edit', $full, '--homepage', $site)
    $null = Read-Native 'gh' @('api', '--method', 'POST', "repos/$full/pages/builds")
    Write-Host "`nRepository: https://github.com/$full" -ForegroundColor Cyan
    Write-Host "Pages URL (waiting for deployment): $site"
    Write-Host 'Waiting up to 2 minutes for the build and HTTP check...'
    for ($i=0; $i -lt 12; $i++) {
        Start-Sleep -Seconds 10
        $build = Read-Native 'gh' @('api', "repos/$full/pages/builds/latest", '--jq', '.status')
        if ($build.Code -eq 0 -and $build.Text -eq 'errored') {
            throw "Pages build failed. Check https://github.com/$full/actions"
        }
        if ($build.Code -eq 0 -and $build.Text -eq 'built') {
            try {
                $response = Invoke-WebRequest -Uri $site -UseBasicParsing -TimeoutSec 15
                if ($response.StatusCode -eq 200 -and $response.Content -match '<title>Lexi') {
                    Write-Host "`nPublished and checked: $site" -ForegroundColor Green
                    Start-Process $site
                    exit 0
                }
            } catch { Write-Host 'Build ready; waiting for the site to become available...' }
        }
    }
    Write-Host "`nFiles are pushed and Pages is configured, but a successful live deployment has not been confirmed yet." -ForegroundColor Yellow
    Write-Host "Check: https://github.com/$full/actions"
    Write-Host "Expected site: $site"
    exit 2
} catch {
    Write-Host "`nStopped: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host 'Do not share passwords or tokens. Read the error, fix the step, then run the script again.'
    exit 1
}
