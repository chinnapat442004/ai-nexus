from starlette.requests import cookie_parser
from logging import debug
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    typhoon_api_key: str
    frontend_url: str
    roboflow_key:str
    database_url:str
    gemini_api_key:str
    google_client_id: str 
    jwt_secret: str 
    jwt_algorithm: str
    access_token_expire_minutes: int 
    cookie_secure:bool
    


    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()