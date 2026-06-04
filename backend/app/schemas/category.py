from pydantic import BaseModel, ConfigDict


class CategoryBase(BaseModel):
    name: str

    model_config = ConfigDict(from_attributes=True)


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(CategoryBase):
    pass


class CategoryRead(CategoryBase):
    id: int