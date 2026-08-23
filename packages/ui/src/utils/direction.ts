export function isRTL(locale:string){
 return locale.toLowerCase().startsWith("fa");
}

export function getDirection(locale:string){
 return isRTL(locale) ? "rtl" : "ltr";
}
