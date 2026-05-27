export function formatFcfa(amount:number){return new Intl.NumberFormat('fr-FR').format(amount)+' FCFA';}
export function generateOrderNumber(sequence:number){return `DRB-${sequence}`;}
