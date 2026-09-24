import logging
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.core.config import settings

# Import all models
from app.models.user import User
from app.models.donation import Donation
from app.models.candidate import CandidateEvaluationLog
from app.models.offer import Offer
from app.models.delivery import Delivery
from app.models.status_event import StatusEvent
from app.models.ledger import PointsLedger, DonorRewards
from app.models.quality_report import QualityReport
from app.models.tier2 import Tier2Deal, Tier2Claim
from app.models.tier3 import Tier3Diversion

logger = logging.getLogger("surplus2shelter.db")

mongo_client: AsyncIOMotorClient = None


async def init_db():
    global mongo_client
    try:
        mongo_client = AsyncIOMotorClient(settings.MONGODB_URI, serverSelectionTimeoutMS=2000)
        db = mongo_client[settings.DB_NAME]

        await init_beanie(
            database=db,
            document_models=[
                User,
                Donation,
                CandidateEvaluationLog,
                Offer,
                Delivery,
                StatusEvent,
                PointsLedger,
                DonorRewards,
                QualityReport,
                Tier2Deal,
                Tier2Claim,
                Tier3Diversion
            ]
        )
        logger.info(f"Successfully connected to MongoDB Atlas / Database '{settings.DB_NAME}'")
    except Exception as exc:
        logger.warning(f"Could not connect to MongoDB database at '{settings.MONGODB_URI}': {exc}. Application will run in memory mock mode if configured.")


async def close_db():
    global mongo_client
    if mongo_client:
        mongo_client.close()
        logger.info("MongoDB client closed")
