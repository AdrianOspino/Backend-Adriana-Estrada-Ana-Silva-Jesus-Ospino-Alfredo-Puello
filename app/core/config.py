import os
from dotenv import load_dotenv
from pathlib import Path

env_path = Path(".") / '.env'
load_dotenv(dotenv_path=env_path)

class Settings:
    PROJECT_NAME: str = "PROYECTO-FASTAPI"
    PROJECT_VERSION: str = "1.0"
    MYSQL_DB: str = os.getenv('MYSQL_DB')
    MYSQL_USER: str = os.getenv('MYSQL_USER')
    MYSQL_PASSWORD: str = os.getenv('MYSQL_PASSWORD')
    MYSQL_SERVER: str = os.getenv('MYSQL_SERVER')
    MYSQL_PORT: str = os.getenv('MYSQL_PORT')
    SECRET_KEY: str = os.getenv('SECRET_KEY')
    ALGORITHM: str = os.getenv('ALGORITHM')
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES', 30))  # Valor por defecto si no se establece en .env
    
    @property
    def SQLALCHEMY_DATABASE_URL(self):
        return f"mysql+mysqlconnector://{self.MYSQL_USER}:{self.MYSQL_PASSWORD}@{self.MYSQL_SERVER}:{self.MYSQL_PORT}/{self.MYSQL_DB}"

settings = Settings()
