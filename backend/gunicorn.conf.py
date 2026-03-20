import multiprocessing

# Bind to 0.0.0.0 on the PORT set by Railway (defaults to 8000 locally)
import os
bind = f"0.0.0.0:{os.environ.get('PORT', '8000')}"

# Use 2 workers on Railway to avoid OOM, configurable via env var
workers = int(os.environ.get('WEB_CONCURRENCY', '2'))

# Each worker gets 2 threads for handling concurrent I/O (DB queries, PayNow API calls)
threads = 2

# Timeout for slow requests (PayNow polling can take a few seconds)
timeout = 30

# Restart workers after handling this many requests (prevents memory leaks)
max_requests = 1000
max_requests_jitter = 50

# Log to stdout/stderr for Docker
accesslog = "-"
errorlog = "-"
loglevel = "info"

# Disable preload so errors show in logs instead of silent crashes
preload_app = False
