import bcrypt from 'bcryptjs';

const SALT_ROUNDS=10;

export const hashPassword= async(plainpassword)=>{
    return await bcrypt.hash(plainpassword,SALT_ROUNDS);

};

export const comparePassword= async(plainpassword,hashPassword)=>{
    return await bcrypt.compare(plainpassword,hashPassword);
    
}