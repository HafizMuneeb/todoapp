import { TaskController } from "@/components/TaskController";
import { Task } from "@/models/task";
import { remultNextApp } from "remult/remult-next";
import { createPostgresDataProvider } from "remult/postgres";
import { getUserOnServer } from "../auth/[...nextauth]/route";

const api = remultNextApp({
    entities: [Task],
    controllers:[TaskController],
    dataProvider:createPostgresDataProvider({
        connectionString:process.env["POSTGRES_URL"] || process.env["DATABASE_URL"],
        configuration: {
            ssl: Boolean(process.env["POSTGRES_URL"]),
        },
    }),
    getUser: getUserOnServer,
})
export const {GET, PUT, POST, DELETE} = api