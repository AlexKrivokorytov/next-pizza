import { PrismaClient } from '@prisma/client'; // 1.6k (gzipped: 835)  

const prismaClientSingleton = () => {  
    return new PrismaClient();  
};  

declare global {  
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;  
}  

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();  

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;  