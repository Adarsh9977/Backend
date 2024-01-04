const asyncHandler = (requestHandler)=>{
   return  (req,res, next)=>{
        Promise.resolve(requestHandler(req, res, next)).catch((err)=> next(err))
    }
}

export default (asyncHandler)




// only for learning purpose others methods 
// *******
// const asyncHandler =()=>{}
// const asyncHandler = (func) = () => {}
// const asyncHandler = (func)=>async()=>{}

// const asyncHandler = (fn)=> async(req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(err.code|| 500).json({
//             success : false,
//             message : err.message
//         })
//         console.log(error found);
//     }
// }

