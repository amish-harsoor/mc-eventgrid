CREATE DATABASE mceg;
\c mceg;

CREATE TABLE IF NOT EXISTS courses (
    id VARCHAR(10) PRIMARY KEY,
    title TEXT NOT NULL,
    instructor TEXT NOT NULL,
    rating DECIMAL(2,1),
    reviews INTEGER,
    price DECIMAL(5,2),
    image TEXT,
    category VARCHAR(50),
    level VARCHAR(20),
    duration VARCHAR(20),
    description TEXT
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS purchases (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    course_id VARCHAR(10) REFERENCES courses(id) ON DELETE CASCADE,
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, course_id)
);

INSERT INTO courses (id, title, instructor, rating, reviews, price, image, category, level, duration, description) VALUES
('1', 'Strategic Leadership in the Modern Era', 'Dr. Sarah Chen', 4.8, 1250, 89.99, 'https://picsum.photos/seed/leadership/800/600', 'Leadership', 'Advanced', '12 hours', 'Master the art of leading high-performance teams in a rapidly changing global landscape.'),
('2', 'Financial Management for Non-Finance Managers', 'Michael Roberts', 4.7, 850, 74.99, 'https://picsum.photos/seed/finance/800/600', 'Finance', 'Beginner', '8 hours', 'Understand balance sheets, P&L statements, and financial decision-making without the jargon.'),
('3', 'Operations Excellence: Lean & Six Sigma', 'James Wilson', 4.9, 2100, 99.99, 'https://picsum.photos/seed/operations/800/600', 'Operations', 'Intermediate', '15 hours', 'Optimize your business processes for maximum efficiency and minimum waste.'),
('4', 'Agile Project Management Professional', 'Emma Thompson', 4.6, 3200, 129.99, 'https://picsum.photos/seed/project/800/600', 'Project Management', 'Intermediate', '20 hours', 'Learn the Scrum framework and Kanban methodologies to deliver projects faster.'),
('5', 'Marketing Strategy & Brand Positioning', 'David Lee', 4.8, 940, 69.99, 'https://picsum.photos/seed/marketing/800/600', 'Marketing', 'Intermediate', '10 hours', 'Build a brand that resonates and a strategy that converts in the digital age.'),
('6', 'Organizational Behavior & HR Management', 'Dr. Linda Garcia', 4.7, 1100, 79.99, 'https://picsum.photos/seed/hr/800/600', 'Human Resources', 'Beginner', '14 hours', 'Understand the human element of business and how to foster a positive culture.')
ON CONFLICT (id) DO NOTHING;
