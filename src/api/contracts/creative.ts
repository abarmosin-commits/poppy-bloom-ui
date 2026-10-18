export type CreativeProjectType = 'content' | 'product_design' | 'print';
export type CreativeProjectStatus = 'draft' | 'queued' | 'running' | 'generated' | 'needs_review' | 'approved' | 'rejected' | 'published' | 'archived';
export interface CreativeProject { id:string; sellerId:number; name:string; projectType:CreativeProjectType; status:CreativeProjectStatus; nmId:number|null; createdAt:string; updatedAt:string; }
export interface CreativeBrief { id:string; projectId:string; version:number; title:string; body:string; status:string; createdAt:string; }
export interface CreativeAsset { id:string; projectId:string; assetType:string; name:string; status:string; currentVersion:number|null; mimeType:string|null; byteSize:number|null; createdAt:string; }
export interface CreativeProjectDetail extends CreativeProject { description:string|null; }
