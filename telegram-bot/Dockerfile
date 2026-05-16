FROM python:3.13-slim

WORKDIR /app

RUN rm -rf /var/lib/apt/lists/* || true

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY bot/ ./bot/

ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1

CMD ["python", "-m", "bot.main"]
