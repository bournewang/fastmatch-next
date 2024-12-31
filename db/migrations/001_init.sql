-- Create careers table for predefined occupations
CREATE TABLE IF NOT EXISTS careers (
    id INTEGER PRIMARY KEY,  -- Using the codes directly as IDs
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    gender INTEGER NOT NULL, -- 0: male, 1: female
    location TEXT,
    about TEXT,
    avatar TEXT,
    company_type INTEGER,   -- 0: 国企, 1: 外企, 2: 私企, 3: 创业公司, 4: 其他
    career_id INTEGER,      -- Reference to predefined careers
    career_name TEXT,       -- For custom career input
    annual_income INTEGER,  -- 0: <10万, 1: 10-20万, 2: 20-30万, 3: 30-50万, 4: 50-100万, 5: >100万
    education INTEGER,      -- 0: 高中, 1: 大专, 2: 本科, 3: 硕士, 4: 博士, 5: 其他
    school TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (career_id) REFERENCES careers(id)
);

CREATE TABLE IF NOT EXISTS user_photos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS matches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user1_id INTEGER NOT NULL,
    user2_id INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user1_id) REFERENCES users(id),
    FOREIGN KEY (user2_id) REFERENCES users(id)
);
