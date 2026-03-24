import { ZodError } from "zod";

const validateRequest = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            const errorMessages = error.errors.map((err) => ({
                field: err.path.join("."),
                message: err.message,
            }));
            return res.status(400).json({
                success: false,
                message: "Validation Error",
                errors: errorMessages,
            });
        }
        next(error);
    }
};

export default validateRequest;
