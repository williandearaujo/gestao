# backend/app/create_tables.py

from app.database import Base, engine
from app import models  # importa os modelos para registrar com a Base

print("Criando tabelas no banco de dados...")
Base.metadata.create_all(bind=engine)
print("Tabelas criadas com sucesso.")
