-- Insert data into the tables

USE berties_books;

-- Insert sample books
INSERT INTO books (name, price) VALUES
('Brighton Rock', 20.25),
('Brave New World', 25.00),
('Animal Farm', 12.99);

-- Insert default user for marking:
-- username: gold
-- password: smiths
INSERT INTO users (first, last, email, username, password) VALUES
('Default', 'User', 'gold@example.com', 'gold',
'$2b$10$1DI5d2uQFz71sFqJWCY/7eUgGyDaP5yS4PbhavJA0rJpY3UJprlPe');
