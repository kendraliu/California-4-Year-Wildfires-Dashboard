--drop table if it exists
DROP TABLE fire_data;

--create the table
CREATE TABLE fire_data (
  INDEX integer,
  FIPS_NAME text,
  LATITUDE numeric,
  LONGITUDE numeric,
  FIRE_NAME text,
  FIRE_SIZE numeric,
  FIRE_SIZE_CLASS text,
  FIRE_YEAR integer,
  DISCOVERY_DATE date,
  CONTAIN_DATE date,
  CAUSE_CLASSIFICATION text,
  CAUSE text
);

--confirm the data is imported
SELECT * FROM fire_data;