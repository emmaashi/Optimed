-- Insert sample hospitals
INSERT INTO hospitals (name, address, phone, latitude, longitude, current_wait_time, capacity, current_load, status) VALUES
('Toronto General Hospital', '200 Elizabeth St, Toronto, ON M5G 2C4', '(416) 340-4800', 43.6591, -79.3877, 45, 150, 89, 'open'),
('Mount Sinai Hospital', '600 University Ave, Toronto, ON M5G 1X5', '(416) 596-4200', 43.6566, -79.3902, 80, 120, 95, 'busy'),
('St. Michael''s Hospital', '30 Bond St, Toronto, ON M5B 1W8', '(416) 360-4000', 43.6532, -79.3776, 25, 100, 45, 'open'),
('Sunnybrook Hospital', '2075 Bayview Ave, Toronto, ON M4N 3M5', '(416) 480-6100', 43.7230, -79.3656, 35, 200, 78, 'open');

-- Insert sample user (for testing)
INSERT INTO users (email, full_name, phone, date_of_birth, health_card_number) VALUES
('john.doe@example.com', 'John Doe', '(416) 555-0123', '1990-05-15', '1234-567-890-AB');
