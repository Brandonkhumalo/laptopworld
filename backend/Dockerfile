FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies for psycopg2
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend files
COPY . .

# Create required directories
RUN mkdir -p /app/logs /app/media

# Collect static files
RUN python manage.py collectstatic --noinput 2>/dev/null || true

EXPOSE 8000

# Run with Gunicorn
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:${PORT:-8000}", "--workers", "2", "--timeout", "30", "--access-logfile", "-", "--error-logfile", "-", "--log-level", "debug"]
