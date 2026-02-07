import { Timestamp } from "firebase-admin/firestore"

export type MainCollection = {
    "collection_id": string,
    "collection_type": string,
    "created_date":Timestamp | string,
    "description": string,
    "thumbnail_image": string | File,
    "video_link": string,
    "title": string,
    "pdf_link"?: string,
    "thumbnail_image_path": string | null, 
}

export type SubCollection = {
    "collection_id": string,
    "collection_type": string,
    "created_date":Timestamp,
    "description": string,
    "sub_contents": subContentType[],
    "thumbnail_image": string | File,
    "thumbnail_image_path": string | null,
    "title": string,
    "price"?: number,
    "currency"?: string,
    "intro_video_link"?: string,
    "main_pdf_link"?: string,
}

export type subContentType = {
    "content_id": string,
    "created_date": Timestamp,
    "description": string,
    "thumbnail_image": string | File,
    "thumbnail_image_path": string | null,
    "title": string,
    "video_link": string
    "pdf_link"?: string,
}