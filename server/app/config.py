from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    typhoon_api_key: str
    frontend_url: str
    roboflow_key:str
    

    class Config:
        env_file = ".env"

settings = Settings()