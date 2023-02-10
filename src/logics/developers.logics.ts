import { Request, Response } from "express";
import format from "pg-format";
import { developerResult, iDeveloper } from "../interfaces/developersInterface";
import { client } from "../database/config"

const createDeveloper = async (request:Request, response: Response): Promise<Response | void> => {

    try {
        const developerData: iDeveloper = request.body

        const queryString: string = format(`
        INSERT INTO 
            developers(%I)
        VALUES
            (%L)
        RETURNING *
        `,
        Object.keys(developerData),
        Object.values(developerData)
        )

        const queryResult: developerResult = await client.query(queryString)

        return response.status(201).json(queryResult.rows[0])
    } catch (error: any) {
        if(error.message.includes("duplicate key value violates unique constraint")){
            return response.status(409).json({ message: "Email already exists."})
        }
        console.log(error)
        return response.status(500).json({
            message: 'Internal server error'
        })
    }
    
}

export {createDeveloper}