from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    typhoon_api_key: str
    frontend_url: str
    roboflow_key:str
    database_url:str
    gemini_api_key:str

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()