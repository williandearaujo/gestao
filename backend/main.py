# main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import protected  # Rotas protegidas

app = FastAPI(
    title="Backend FastAPI com Clerk",
    description="API protegida com autenticação JWT do Clerk",
    version="1.0.0"
)

# CORS – libera acesso para o frontend
origins = [
    "http://localhost:5173",
    "https://<seu-domínio>.vercel.app",  # Produção (opcional)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rotas protegidas com Clerk
app.include_router(protected.router, prefix="/api", tags=["Protegido"])
