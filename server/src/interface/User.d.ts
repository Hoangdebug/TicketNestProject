interface User extends Document{
    firstname: string;
    lastname: string;
    email: string;
    mobile: string;
    password: string;
    role?: string;
    address?: string;
    isBlocked?: boolean;
    refreshToken?: string;
    passwordChangedAt?: string;
    passwordResetToken?: string;
    passwordResetExpire?: string;
}

export default User