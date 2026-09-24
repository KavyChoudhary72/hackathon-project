import logging
from datetime import datetime, timezone, timedelta
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from app.core.config import settings

logger = logging.getLogger("surplus2shelter.scheduler")

scheduler = AsyncIOScheduler()


def start_scheduler():
    if not scheduler.running:
        scheduler.start()
        logger.info("APScheduler background scheduler started")


def stop_scheduler():
    if scheduler.running:
        scheduler.shutdown()
        logger.info("APScheduler stopped")


def schedule_cascade_timeout(donation_id: str, rank: int, timeout_seconds: int, callback_fn, *args):
    job_id = f"cascade:{donation_id}:{rank}"
    run_time = datetime.now(timezone.utc) + timedelta(seconds=timeout_seconds)

    # Cancel existing job with same ID if present
    if scheduler.get_job(job_id):
        scheduler.remove_job(job_id)

    scheduler.add_job(
        callback_fn,
        'date',
        run_date=run_time,
        args=args,
        id=job_id,
        replace_existing=True
    )
    logger.info(f"Scheduled cascade timeout job '{job_id}' for {run_time.isoformat()}")


def cancel_cascade_timeout(donation_id: str, rank: int):
    job_id = f"cascade:{donation_id}:{rank}"
    if scheduler.get_job(job_id):
        scheduler.remove_job(job_id)
        logger.info(f"Cancelled cascade job '{job_id}'")
