import express, { Application, Request, Response } from "express";
import { sessions } from '@clerk/clerk-sdk-node';
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

import 'dotenv/config'

const app: Application = express();
const port = process.env.PORT;

// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get(
    "/api",
    async (req: Request, res: Response) => {
        res.json({"users": ["user1", "user2", "sesd"]})
    }
);

app.post(
    "/api/validate", ClerkExpressRequireAuth(),
    async (req, res) => {
        
        
        //const sessionId = req.query._clerk_session_id;

        // const cookies = new Cookies(req, res);
        // const clientToken = cookies.get('__session');  
        
        //const session = await sessions.verifySession(sessionId, clientToken);

        res.send("validate1");
    }
);











//logging server status
try {
    app.listen(port, (): void => {
        console.log(`Backend Server running on port  ${port} 🚀`);
    });
} catch (error) {
    console.error("error");
}