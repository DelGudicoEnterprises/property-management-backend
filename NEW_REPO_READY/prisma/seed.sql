-- Seed data for Cabot Property Management

-- Users
INSERT INTO users (email, password_hash, role, first_name, last_name) VALUES
  ('admin@cabotgroup.com', '$2a$10$uC7U9jw.Cyhl725LLJoPLu114F8nGZ4PlzyBbs6k8ZZrVSu2Ce/Jm', 'admin', 'System', 'Admin'),
  ('manager@cabotgroup.com', '$2a$10$w8j9kMeUX0DpDqG9q4CPVeY0fOkH1ZZ1xd6QbaO5jM90oCbGyF/F.', 'manager', 'Maggie', 'Manager'),
  ('tech@cabotgroup.com', '$2a$10$DInxWxirMRHkRkNvztNFVOnw1Gc7YCOUMIqFZ3VAb9/T/jGj33jjG', 'service_tech', 'Tom', 'Technician'),
  ('tenant@example.com', '$2a$10$zETr4Wr9PXgC7vRl6VwBbeQkNo4fU6Y4ZC/7gv2Fne5DE5ZTCDJMm', 'tenant', 'Tina', 'Tenant');

-- Property
INSERT INTO properties (name, address, city, state, zip_code, total_units, phone) VALUES
 ('Winton Place Apartments', '123 Winton Pl', 'Rochester', 'NY', '14623', 50, '585-555-5555');

-- Unit 101A
INSERT INTO units (property_id, unit_number, tenant_id, bedrooms, bathrooms, square_feet, monthly_rent, is_occupied)
VALUES (1, '101A', 4, 2, 1, 950, 1200.00, TRUE);

-- Sample Tickets
INSERT INTO tickets (property_id, unit_id, tenant_id, issue_type, problem_description, urgency, status)
VALUES
  (1, 1, 4, 'plumbing', 'Leaky faucet in kitchen', 'medium', 'open'),
  (1, 1, 4, 'hvac', 'Air conditioner not cooling', 'high', 'in_progress'),
  (1, 1, 4, 'appliance', 'Dishwasher not starting', 'low', 'awaiting_approval');

-- Work log for in_progress ticket (id 2)
INSERT INTO work_logs (ticket_id, technician_id, work_date, hours_worked, is_billable, work_notes)
VALUES (2, 3, CURRENT_DATE, 1.5, TRUE, 'Diagnosed issue, ordered parts');

-- Ticket costs for in_progress ticket
INSERT INTO ticket_costs (ticket_id, material_cost, pwo_contractor_cost, pwo_cabot_fee, contractor_cost, cabot_fee, miles_cost, service_cost, service_tax)
VALUES (2, 45.00, 0, 0, 0, 0, 10.00, 90.00, 7.20);
