from typing import Annotated
from pydantic import BeforeValidator, PlainSerializer
from bson import ObjectId

# Helper for Pydantic to handle ObjectId
PyObjectId = Annotated[
    str,
    BeforeValidator(lambda x: str(x) if isinstance(x, ObjectId) else x),
    PlainSerializer(lambda x: str(x), return_type=str),
]
