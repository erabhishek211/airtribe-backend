const validateInput = (req, res, next)=>{
    const {title, description, completionStatus} = req.body;
    // if(!!(title && description && (typeof completionStatus == 'boolean'))){
    //     next();
    // }
    let validationMsg = '';
    if(!title){
        validationMsg = "Title field is required";
    }
    if(!description){
        validationMsg = "Description field is required";
    }
    if(typeof completionStatus != 'boolean'){
        validationMsg = "completionStatus must be of type boolean"
    }
    if(validationMsg){
        return res.status(400).json(validationMsg);
    }else{
        next();
    }
}

module.exports = validateInput;