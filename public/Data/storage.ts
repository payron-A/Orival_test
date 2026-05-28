export function save(key:string, value:unknown){
    try{
        localStorage.setItem(key, JSON.stringify(value));
    }catch(err){
        console.warn(`Could not save "${key}" to storage`, err);
    }
}


export function loadOrSeed(key:string, seedData:unknown){
    try{
        const saved = localStorage.getItem(key);
        if(saved) return JSON.parse(saved);
    }catch(err){
        console.warn(`Could not read "${key}" from storage`, err);
    }
    return seedData;
}