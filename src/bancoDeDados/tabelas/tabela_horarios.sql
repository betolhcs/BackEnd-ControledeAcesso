DROP TABLE IF EXISTS "horarios" CASCADE;

CREATE TABLE "horarios"(
  "dia" VARCHAR NOT NULL,
  "entrada" INTEGER NOT NULL,
  "saida" INTEGER NOT NULL, 
  "id_membro" INTEGER PRIMARY KEY REFERENCES membros (id_membro) ON UPDATE CASCADE ON DELETE CASCADE
);