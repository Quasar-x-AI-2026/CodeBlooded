import {ApiError} from '../utility/index.js';
import statusCode from '../constants/statusCode.js';
import jwt from 'jsonwebtoken';

const authenticateNGO = async (req, _, next) => {
    try {
        const accessToken = req?.cookies?.accessToken;

        if (!accessToken || accessToken === 'null') {
            throw new ApiError(
                statusCode.UNAUTHORIZED,
                'Access token is missing!'
            );
        }

        const verifiedToken = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET
        );

        if (!verifiedToken) {
            throw new ApiError(
                statusCode.UNAUTHORIZED,
                'Access token validation error!'
            );
        }

        req.ngoCode = verifiedToken?.ngoCode;
        next();
    } catch (error) {
        next(new ApiError(statusCode.UNAUTHORIZED, error));
    }
};

export {authenticateNGO};
