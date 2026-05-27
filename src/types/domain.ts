export type OrderStatus = 'pending'|'validated'|'processing'|'shipped'|'delivered'|'cancelled';
export interface Product { id:string; slug:string; name:string; price:number; stock:number; description:string; featured:boolean; }
export interface Collection { id:string; name:string; slug:string; description:string; featured:boolean; banner_url?:string; }
export interface HomepageSection { id:string; type:string; title:string; subtitle?:string; media_url?:string; active:boolean; sort_order:number; }
