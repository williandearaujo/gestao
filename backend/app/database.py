# backend/app/database.py

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

# ✅ 1. URL do banco – padrão = Railway
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:getvoPZEJlhMwwqIqqaDZQZzuwWSmZPN@gondola.proxy.rlwy.net:32350/railway"
)

# ✅ 2. Criar engine (PostgreSQL não usa connect_args)
engine = create_engine(DATABASE_URL)

# ✅ 3. Sessão e Base para os modelos
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ✅ 4. Função de sessão para dependência
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
