CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "envelopes" (
  "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "category" varchar(50) NOT NULL UNIQUE,
  "budget" numeric(100, 2) NOT NULL
);

CREATE TABLE "transactions" (
  "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "envelope_id" uuid REFERENCES envelopes(id) NOT NULL,
  "date" date NOT NULL,
  "description" varchar(50) NOT NULL,
  "amount" numeric (100, 2) NOT NULL
);