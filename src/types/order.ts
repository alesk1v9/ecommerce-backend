export interface OrderProps {
    id?: number;
    userId: number;
    totalPrice: number;
    status: "pending" | "completed" | "cancelled";
};