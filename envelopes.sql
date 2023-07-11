CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "envelopes" (
  "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "category" varchar(50),
  "budget" numeric(100, 2),
);

CREATE TABLE "transactions" (
  "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "envelope_id" uuid REFERENCES envelopes(id),
  "amount" numeric (100, 2)
);