from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    REDIS_HOST: str
    REDIS_KEY: str

    DB_HOST: str
    DB_PORT: int
    DB_NAME: str
    DB_USER: str
    DB_PASSWORD: str

    azure_storage_connection_string: str
    azure_container_name: str

    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )


settings = Settings()