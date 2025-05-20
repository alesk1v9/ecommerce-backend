export type PayloadProps = {
    id?: number;
    email: string;
    password?: string;
    role?: 'admin' | 'user';
}