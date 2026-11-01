from datetime import datetime, time, timezone
from pydantic import BaseModel, ConfigDict, EmailStr, Field, model_validator

class loginInput(BaseModel):
    email: EmailStr
    password: str

class signupInput(BaseModel):
    name: str = Field(min_length=2)
    email: EmailStr
    password: str = Field(min_length=8, max_length=50)
    confirmation_password: str

    @model_validator(mode='after')
    def validate_password(self):
        if self.password != self.confirmation_password:
            raise ValueError("Password must match")

    @model_validator(mode="after")
    def validate_content(self):
        if not any(c.isupper() for c in self.password):
            raise ValueError()
        if not any(c.islower() for c in self.password):
            raise ValueError()
        if not any(c.isdigit() for c in self.password):
            raise ValueError()

        special_chars = "!@#$%^&*?~`/\\;{}|:()<>."

        if not any(c in special_chars for c in self.password):
            raise ValueError()

class token(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    load: dict = Field(default_factory=lambda: {
        'token': 'the_generated_token',
        'token_type': 'the_token_type'
    })

class loginOutput(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    token: token

class signupOutput(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    email: str
    created_time: time = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserResponse(BaseModel):
    # retreive the response from the attributes of the object received
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    email: EmailStr