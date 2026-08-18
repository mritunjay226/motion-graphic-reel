import sys
import subprocess
import os

# Force stdout/stderr to utf-8 on Windows
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

os.environ["PYTHONIOENCODING"] = "utf-8"
os.environ["PYTHONUTF8"] = "1"

cmd = ["modal", "app", "logs", "vox-reels-renderer"]
proc = subprocess.Popen(
    cmd,
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    text=True,
    encoding="utf-8",
    errors="replace",
)

if proc.stdout:
    for line in iter(proc.stdout.readline, ""):
        print(line, end="", flush=True)
