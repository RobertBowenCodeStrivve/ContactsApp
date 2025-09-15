import { DB } from './schema' // schema is defined after running migrations
import { Pool } from 'pg'
import { Kysely, PostgresDialect } from 'kysely'

export enum databaseType {
    POSTGRES = "POSTGRES",
}

export const db_options = {
    POSTGRES: 'POSTGRES',
}

export interface databaseConfig {
    host: string,
    port: number,
    database: string,
    user: string,
    type : databaseType,
    password: string,
    max?: number, // max number of connections in the pool
}

export default class DatabaseManager {
    private static database = new Map()
    private constructor(){}

    private static constructPostgresDB(config : databaseConfig) : Kysely<DB> | null
    {
        const pool = new Pool({
                        host: config.host,
                        port: config.port,
                        database: config.database,
                        user: config.user,
                        password: config.password,
                        max: config.max || 10, // default max connections to 10 if not provided
                    })
        const dialect = new PostgresDialect({
            pool: pool
        })
        return new Kysely<DB>({dialect})
    }

    public static addConnection(config : databaseConfig)
    {
        if(DatabaseManager.database.has(config.database))
        {
            throw new Error(`DatabaseManager : addConnection : database already exists with name: ${config.database}`)
        }
        try{
            switch(config.type)
            {
                case databaseType.POSTGRES:
                    DatabaseManager.database.set(config.database, DatabaseManager.constructPostgresDB(config))
                    break; 
                default:
                    throw new Error(`unsupported database type: ${config.type}`)
            }
        }
        catch(err)
        {
            throw new Error(`DatabaseManager : addConnection : failed to add database: ${err}`)
        }
        return DatabaseManager.getConnection(config.database)
    }

    public static getConnection(name : string)
    {
        if(DatabaseManager.database.has(name))
        {
            return DatabaseManager.database.get(name)
        }
        else
        {
            throw new Error(`DatabaseManager : getConnection : no database found with name: ${name}`)
        }
    }

}




