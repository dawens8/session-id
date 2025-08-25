Checkpoint-Computer -Description "Before-WhatsApp-Hardening" -RestorePointType "MODIFY_SETTINGS"

Set-MpPreference -DisableRealtimeMonitoring $false
Set-MpPreference -MAPSReporting Advanced
Set-MpPreference -SubmitSamplesConsent SendSafeSamples

Set-MpPreference -EnableControlledFolderAccess Enabled

$waPaths = @(
  "$env:USERPROFILE\AppData\Roaming\WhatsApp",
  "$env:LOCALAPPDATA\Packages\WhatsApp.WhatsApp*\LocalState",
  "$env:LOCALAPPDATA\Packages\5319275A.WhatsAppDesktop*\LocalState"
)
foreach ($p in $waPaths) {
  try { Add-MpPreference -ControlledFolderAccessProtectedFolders $p } catch {}
}

Start-MpScan -ScanType QuickScan

Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled True

$trg = New-ScheduledTaskTrigger -Daily -At 12:00
$act = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "Start-MpScan -ScanType QuickScan"
Register-ScheduledTask -TaskName "DailyDefenderQuickScan" -Trigger $trg -Action $act -RunLevel Highest -Description "Daily quick scan via Microsoft Defender" -Force
