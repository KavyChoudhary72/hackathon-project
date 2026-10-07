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


async def _seed_default_users():
    """Ensures default seed accounts exist in MongoDB with hashed credentials."""
    try:
        from app.api.auth import SEED_USERS
        for email, udata in SEED_USERS.items():
            existing = await User.find_one({"email": email})
            if not existing:
                doc = User(
                    user_id=udata["user_id"],
                    role=udata["role"],
                    name=udata["name"],
                    phone=udata.get("phone", "+91-98290-00000"),
                    email=email,
                    hashed_password=udata["hashed_password"],
                    salt=udata["salt"],
                    organization_name=udata.get("organization_name", ""),
                    location_city=udata.get("location_city", "Jaipur, Rajasthan"),
                    permissions=udata.get("permissions", []),
                    avatar_url=udata.get("avatar_url"),
                    donor_type=udata.get("donor_type"),
                    fssai_licence=udata.get("fssai_licence"),
                    capacity_meals=udata.get("capacity_meals", 0),
                    vehicle_type=udata.get("vehicle_type", "motorcycle"),
                    is_active=True
                )
                await doc.insert()
                logger.info(f"Seeded default user '{email}' into MongoDB.")
    except Exception as e:
        logger.debug(f"User seed notice: {e}")


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
        await _seed_default_users()
    except Exception as exc:
        logger.warning(f"Could not connect to MongoDB database at '{settings.MONGODB_URI}': {exc}. Application will run in memory mock mode if configured.")


async def close_db():
    global mongo_client
    if mongo_client:
        mongo_client.close()
        logger.info("MongoDB client closed")
