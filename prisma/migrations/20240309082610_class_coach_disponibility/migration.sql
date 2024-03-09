-- CreateTable
CREATE TABLE "ClassCoachDisponibility" (
    "user_id" INTEGER NOT NULL,
    "class_id" INTEGER NOT NULL,

    PRIMARY KEY ("user_id", "class_id"),
    CONSTRAINT "ClassCoachDisponibility_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ClassCoachDisponibility_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "Class" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
