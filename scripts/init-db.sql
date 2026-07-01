-- Create schemas
CREATE SCHEMA IF NOT EXISTS users;
CREATE SCHEMA IF NOT EXISTS wallets;
CREATE SCHEMA IF NOT EXISTS transactions;
CREATE SCHEMA IF NOT EXISTS ledger;
CREATE SCHEMA IF NOT EXISTS fraud;

-- Users table
CREATE TABLE users.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone_number VARCHAR(20) UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  date_of_birth DATE,
  bvn VARCHAR(20) UNIQUE,
  profile_picture_url TEXT,
  account_status VARCHAR(50) DEFAULT 'ACTIVE',
  email_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,
  kyc_status VARCHAR(50) DEFAULT 'PENDING',
  kyc_verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users.users(email);
CREATE INDEX idx_users_phone ON users.users(phone_number);
CREATE INDEX idx_users_bvn ON users.users(bvn);

-- Wallets table
CREATE TABLE wallets.wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users.users(id),
  account_number VARCHAR(20) UNIQUE NOT NULL,
  account_type VARCHAR(50) DEFAULT 'SAVINGS',
  currency VARCHAR(3) DEFAULT 'NGN',
  balance DECIMAL(20,2) DEFAULT 0.00,
  available_balance DECIMAL(20,2) DEFAULT 0.00,
  is_primary BOOLEAN DEFAULT FALSE,
  is_frozen BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_wallets_user_id ON wallets.wallets(user_id);
CREATE INDEX idx_wallets_account_number ON wallets.wallets(account_number);

-- Transactions table
CREATE TABLE transactions.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_wallet_id UUID REFERENCES wallets.wallets(id),
  destination_wallet_id UUID REFERENCES wallets.wallets(id),
  destination_account_number VARCHAR(20),
  destination_bank_code VARCHAR(10),
  amount DECIMAL(20,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'NGN',
  type VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'PENDING',
  reference VARCHAR(100) UNIQUE,
  idempotency_key VARCHAR(255) UNIQUE,
  description TEXT,
  metadata JSONB,
  initiated_by_user_id UUID REFERENCES users.users(id),
  failed_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  settled_at TIMESTAMP
);

CREATE INDEX idx_transactions_source ON transactions.transactions(source_wallet_id);
CREATE INDEX idx_transactions_destination ON transactions.transactions(destination_wallet_id);
CREATE INDEX idx_transactions_reference ON transactions.transactions(reference);
CREATE INDEX idx_transactions_idempotency ON transactions.transactions(idempotency_key);
CREATE INDEX idx_transactions_status ON transactions.transactions(status);
CREATE INDEX idx_transactions_created_at ON transactions.transactions(created_at);

-- Ledger entries table (double-entry bookkeeping)
CREATE TABLE ledger.ledger_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES transactions.transactions(id),
  account_id UUID NOT NULL,
  account_type VARCHAR(50),
  debit DECIMAL(20,2) DEFAULT 0.00,
  credit DECIMAL(20,2) DEFAULT 0.00,
  balance DECIMAL(20,2),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ledger_transaction ON ledger.ledger_entries(transaction_id);
CREATE INDEX idx_ledger_account ON ledger.ledger_entries(account_id);
CREATE INDEX idx_ledger_created_at ON ledger.ledger_entries(created_at);

-- Fraud rules table
CREATE TABLE fraud.fraud_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_name VARCHAR(255) NOT NULL,
  rule_type VARCHAR(50),
  threshold_amount DECIMAL(20,2),
  frequency_limit INT,
  time_window_minutes INT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fraud alerts table
CREATE TABLE fraud.fraud_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users.users(id),
  transaction_id UUID REFERENCES transactions.transactions(id),
  rule_id UUID REFERENCES fraud.fraud_rules(id),
  risk_score INT,
  alert_type VARCHAR(50),
  details JSONB,
  status VARCHAR(50) DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_fraud_alerts_user ON fraud.fraud_alerts(user_id);
CREATE INDEX idx_fraud_alerts_transaction ON fraud.fraud_alerts(transaction_id);

-- Default fraud rules
INSERT INTO fraud.fraud_rules (rule_name, rule_type, threshold_amount, is_active) VALUES
  ('High Amount Transfer', 'AMOUNT_THRESHOLD', 5000000, TRUE),
  ('Unusual Time Transfer', 'TIME_PATTERN', NULL, TRUE),
  ('Multiple Failed Attempts', 'FAILURE_PATTERN', NULL, TRUE);
