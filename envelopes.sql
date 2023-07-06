CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "envelopes" (
  "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "category" varchar(50),
  "budget" numeric(100, 2)
);

