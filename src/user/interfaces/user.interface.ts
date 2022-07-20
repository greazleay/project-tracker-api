export enum Role {
    USER_ADMIN = 'e823cf07-d938-4c6d-98cd-fc5e70b774a5',
    PROJECT_ADMIN = '915e6b6d-f709-4780-b4a3-1dcf76264283',
    SYSTEM_ADMIN = '1aed5630-dd08-4ff3-8802-6aff5d450992',
    GUEST = 'ab85f528-77c2-4a01-a957-563f1e1d719a',
    USER = 'e2de9d24-38f2-4eab-b02d-fda40c76ec20',
};

export interface IResetPassword {
    code: string;
    expiresBy: Date;
};