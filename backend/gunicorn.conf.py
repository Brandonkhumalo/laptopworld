import multiprocessing

# Bind to 0.0.0.0 on the PORT set by Railway (defaults to 8000 locally)
import os
bind = f"0.0.0.0:{os.environ.get('PORT', '8000')}"

# Workers = (2 * CPU cores) + 1 — good starting point
workers = multiprocessing.cpu_count() * 2 + 1

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

# Preload app for faster worker startup and shared memory
preload_app = True
