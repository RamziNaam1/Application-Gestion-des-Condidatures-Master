function validation(values){
    let error ={}
    const email_pattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const password_pattern=/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/
    const username_pattern= /^[a-zA-Z_ ]{5,}$/
    const confirm_password_pattern=/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/


    
    if(values.username ===""){
        error.username="name should not be empty"
    }
    else if(!username_pattern.test(values.username)){
        error.username ="username didn't match"
    }else{
        error.username=""
    }
    
    
    if(values.email ===""){
        error.email="email should not be empty"
    }
    else if(!email_pattern.test(values.email)){
        error.email ="email didn't match"
    }else{
        error.email=""
    }


    if(values.password ===""){
        error.password="password should not be empty"
    }
    else if(!password_pattern.test(values.password)){
        error.password ="password didn't match"
    }else{
        error.password=""
    }

    
    if(values.confirm_password ===""){
        error.confirm_password="password should not be empty"
    }
    else if(!confirm_password_pattern.test(values.confirm_password)){
        error.confirm_password ="password didn't match"
    }else{
        error.confirm_password=""
    }

    return error;

}
export default validation;