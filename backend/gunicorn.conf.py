import os

# Bind to 0.0.0.0 on the PORT set by Railway (defaults to 8000 locally)
bind = f"0.0.0.0:{os.environ.get('PORT', '8000')}"

# Hardcode 2 workers — Railway containers have limited memory (~512MB)
# Do NOT use WEB_CONCURRENCY or multiprocessing.cpu_count() as Railway
# exposes all host CPUs, leading to 30-60+ workers and OOM kills
workers = 2

# Each worker gets 2 threads for handling concurrent I/O (DB queries, PayNow API calls)
threads = 2

# Timeout for slow requests (PayNow polling can take a few seconds)
timeout = 30

# Restart workers after handling this many requests (prevents memory leaks)
max_requests = 1000
max_requests_jitter = 50

# Log to stdout/stderr for Railway
accesslog = "-"
errorlog = "-"
loglevel = "info"

# Disable preload so errors show in logs instead of silent crashes
preload_app = False
