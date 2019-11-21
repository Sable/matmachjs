

export class ErrorTestHelper {
    static throwError(func:( (...any) => any), ...args:any[]){
        try{
            console.log(args);
            console.log(func(...args));
            
        }catch(err){
            throw err;
        }
    }


}