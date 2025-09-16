import {z, ZodError} from 'zod';
import { Request, Response, NextFunction } from 'express';
 const phoneSchema = z.string().refine(
    (phone) => {
      const patterns = [
        /^\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/, // US
        /^\+[1-9]\d{1,14}$/, // International E.164
        /^[0-9]{10}$/, // 10 digits
      ];
      return patterns.some(pattern => pattern.test(phone));
    },
    {
      message: "Invalid phone number format",
    }
  );

export const contactSchema = z.object({
    first_name: z.string().min(1, "first name is required").max(50, "first name is too long"),
    last_name: z.string().min(1, "last name is required").max(50, "last name is too long"),
    email: z.string().email("Invalid email address"),
    phone: phoneSchema
});

export const validateContactCreation = (req : Request, res : Response, next : NextFunction, contact : any) => {
    try{
        console.log(`Validating contact: ${JSON.stringify(contact)}`);
        contactSchema.parse(contact);
        next();
    }
    catch(err){
        if(!(err instanceof ZodError)){
            console.error("Unexpected error during validation:", err);
            return res.status(500).json({message : "Internal Server Error"});
        }
        console.warn("Validation error:", err.issues);
        return res.status(400).json({
            message : "Validation Error",
            error : (err as ZodError).issues
      })
    }
};

export const validateContactUpdate = (req : Request, res : Response, next : NextFunction, contact : any) => {
    try{
        if(!checkValidId(req, res)) return;
        console.log(`Validating contact update: ${JSON.stringify(contact)}`);
        const partialSchema = contactSchema.partial();
        partialSchema.parse(contact);
        next();
    }
    catch(err){
        if(!(err instanceof ZodError)){
            console.error("Unexpected error during validation:", err);
            return res.status(500).json({message : "Internal Server Error"});
        }
        console.warn("Validation error:", err.issues);
        return res.status(400).json({
            message : "Validation Error",
            error : (err as ZodError).issues
      })
    }
};

export const deleteValidation = (req : Request, res : Response, next : NextFunction) => {
    if(!checkValidId(req, res)) return;
    next();
};

const checkValidId = (req : Request, res : Response) : boolean => {
    const { id } = req.params;
    if(!id || isNaN(Number(id))){
        res.status(400).json({message : "Invalid or missing contact ID"});
        return false;
    }
    return true;
}
 

