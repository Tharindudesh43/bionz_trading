import { Timestamp } from "firebase-admin/firestore";

export interface PaymentModel {
    payment_id: string; 
    details: string;
    paymentSlipUrl: string;
    status: 'approved' | 'pending' | 'rejected';
    type: string;
    uploadAt: Timestamp | null;
    userEmail: string;
    userId: string;
    courseIds?: string;
    approveAt?: Timestamp | null;
    uploadedAt?: Timestamp | null;
    payment_slip_path: string;
    bookname?: string;
    shippingAddress?: string;
}
