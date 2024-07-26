// yeh file iss liye banayi hai bcz for better error handling ke liye agar error aaye to next error file mai pass kardo

const asyncHandler = (requestHandler) =>{
    return (req,res,next) =>{
        Promise.resolve(requestHandler(req,res,next)).catch((err) => next(err))
    }
}


export{asyncHandler}


// check node js error class on website


// const asyncHandler =(fn) => async(req,res,next)=>{
//     try{
//         await fn(req,res,next)

//     } catch(error){
//         res.status(err.code|| 500).json({
//             success:false,
//             message:error.messsage
//         })
//     }

// }