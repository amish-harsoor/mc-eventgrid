from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from pydantic import BaseModel
from typing import Optional
from azure.eventgrid import EventGridPublisherClient
from azure.core.credentials import AzureKeyCredential

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '.env'))

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

EVENTGRID_ENDPOINT = os.getenv("EVENTGRID_ENDPOINT")
EVENTGRID_ACCESS_KEY = os.getenv("EVENTGRID_ACCESS_KEY")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

app = FastAPI()

# Initialize EventGrid client if credentials are provided
eventgrid_client = None
if EVENTGRID_ENDPOINT and EVENTGRID_ACCESS_KEY:
    eventgrid_client = EventGridPublisherClient(
        endpoint=EVENTGRID_ENDPOINT,
        credential=AzureKeyCredential(EVENTGRID_ACCESS_KEY)
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserCreate(BaseModel):
    email: str
    password: str
    name: str

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class User(BaseModel):
    id: int
    email: str
    name: str

class PurchaseCreate(BaseModel):
    course_id: str

def get_db_connection():
    return psycopg2.connect(
        host=os.getenv('DB_HOST'),
        port=os.getenv('DB_PORT'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        database=os.getenv('DB_NAME')
    )

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def authenticate_user(email: str, password: str):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cur.fetchone()
    cur.close()
    conn.close()
    if not user:
        return False
    if not verify_password(password, user['password_hash']):
        return False
    return user

def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT id, email, name FROM users WHERE email = %s", (token_data.email,))
    user = cur.fetchone()
    cur.close()
    conn.close()
    if user is None:
        raise credentials_exception
    return user

@app.get("/courses")
def get_courses():
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT * FROM courses")
    courses = cur.fetchall()
    cur.close()
    conn.close()
    return courses

@app.get("/courses/{course_id}")
def get_course(course_id: str):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT * FROM courses WHERE id = %s", (course_id,))
    course = cur.fetchone()
    cur.close()
    conn.close()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

@app.post("/auth/register", response_model=User)
def register(user: UserCreate):
    hashed_password = get_password_hash(user.password)
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "INSERT INTO users (email, password_hash, name) VALUES (%s, %s, %s) RETURNING id, email, name",
            (user.email, hashed_password, user.name)
        )
        new_user = cur.fetchone()
        conn.commit()
        return {"id": new_user[0], "email": new_user[1], "name": new_user[2]}
    except psycopg2.IntegrityError:
        raise HTTPException(status_code=400, detail="Email already registered")
    finally:
        cur.close()
        conn.close()

@app.post("/auth/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/auth/profile", response_model=User)
def get_profile(current_user: dict = Depends(get_current_user)):
    return current_user

@app.post("/purchases")
def purchase_course(purchase: PurchaseCreate, current_user: dict = Depends(get_current_user)):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        # Check if course exists
        cur.execute("SELECT id FROM courses WHERE id = %s", (purchase.course_id,))
        if not cur.fetchone():
            raise HTTPException(status_code=404, detail="Course not found")
        # Insert purchase
        cur.execute(
            "INSERT INTO purchases (user_id, course_id) VALUES (%s, %s)",
            (current_user["id"], purchase.course_id)
        )
        conn.commit()
        
        # Fetch course name for email
        cur.execute("SELECT name FROM courses WHERE id = %s", (purchase.course_id,))
        course = cur.fetchone()
        course_name = course[0] if course else "Unknown Course"
        
        # Publish event to EventGrid
        if eventgrid_client:
            from azure.eventgrid import EventGridEvent
            event = EventGridEvent(
                subject=f"user/{current_user['id']}/purchase",
                event_type="course.purchased",
                data={
                    "user_id": current_user["id"],
                    "user_email": current_user["email"],
                    "user_name": current_user["name"],
                    "course_id": purchase.course_id,
                    "course_name": course_name
                },
                data_version="1.0"
            )
            eventgrid_client.send([event])
        
        return {"message": "Purchase successful"}
    except psycopg2.IntegrityError:
        raise HTTPException(status_code=400, detail="Course already purchased")
    finally:
        cur.close()
        conn.close()

@app.get("/user/courses")
def get_user_courses(current_user: dict = Depends(get_current_user)):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("""
        SELECT c.* FROM courses c
        JOIN purchases p ON c.id = p.course_id
        WHERE p.user_id = %s
    """, (current_user["id"],))
    courses = cur.fetchall()
    cur.close()
    conn.close()
    return courses

@app.get("/categories")
def get_categories():
    return [
        'All',
        'Leadership',
        'Strategy',
        'Operations',
        'Finance',
        'Marketing',
        'Human Resources',
        'Project Management'
    ]
