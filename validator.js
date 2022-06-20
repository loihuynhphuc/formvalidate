function validator(option){
    function getParent(element,Selector){
                while(element.parentElement){
                        if(element.parentElement.matches(Selector)){
                            return element.parentElement;
                        }
                        element= element.parentElement;
                    }
                }
               
        const formElement = document.querySelector(option.form);
        var ruleSelector={};
        // gắn message error,invalid vào input
        function validate(inputElement,rule){
            var elementErr= getParent(inputElement,option.formGroupSelector).querySelector(option.selectorMessage);
            var messageErr;
            // lấy ra các rule của selector
            var rules=   ruleSelector[rule.selector];
            // lặp qua từng rule ,nếu mà có lỗi thì gán lỗi
            for(var i=0;i<rules.length; i++ ){
                switch(inputElement.type){
                        case "radio":
                        case "checkbox":
                                messageErr= rules[i](formElement.querySelector(rule.selector + ":checked"))
                                break;
                                default:
                                    messageErr= rules[i](inputElement.value)
                }
                
                // nếu có lỗi thì dừng
                if(messageErr) break;
            }
            if(messageErr){
                elementErr.innerText= messageErr;
                getParent(inputElement,option.formGroupSelector).classList.add("invalid");
               }else{
                   elementErr.innerText= " ";
                   getParent(inputElement,option.formGroupSelector).classList.remove("invalid");
               }
               return !messageErr;
        }
        function removeErrInput (inputElement){
            var elementErr= getParent(inputElement,option.formGroupSelector).querySelector(option.selectorMessage);
               elementErr.innerText= " ";
                getParent(inputElement,option.formGroupSelector).classList.remove("invalid");
        }
        if(formElement){
            // dừng sự kiện mặc định của submit
            formElement.onsubmit= function(e){
                    e.preventDefault();
                // lặp qua từng rule và validate
                var isFromvalid =true;
                    option.rules.forEach((rule)=>{
                        var inputElement=formElement.querySelector(rule.selector);
                      var isvalid= validate(inputElement,rule);
                     if(!isvalid){
                         isFromvalid=false;
                     }
                    })
                   
                    if(isFromvalid){
                            if( typeof option.onSubmit ==="function"){
                                var enableInput = formElement.querySelectorAll("[name]:not([disabled])");
                                var formValue= Array.from(enableInput).reduce((values,input)=>{
                                        switch(input.type){
                                            case "radio":
                                                values[input.name]= formElement.querySelector('input[name="'+input.name+'"]:checked').value;
                                                break;
                                            case "checkbox":
                                                if(!input.matches(':checked')){
                                                    values[input.name]=" ";
                                                    return values;
                                                };
                                                if(!Array.isArray(values[input.name])){
                                                        values[input.name]=[];
                                                }
                                                values[input.name].push(input.value);
                                                
                                               break;
                                            case "file":
                                                values[input.name]= input.files;
                                                break;
                                             default:
                                                (values[input.name]= input.value) ;
                                                
                                        }
                                        return values;
                                },{})
                                option.onSubmit(formValue)
                            }
                    }
            }
           
                option.rules.forEach((rule)=>{
                    if(Array.isArray(ruleSelector[rule.selector])){
                        ruleSelector[rule.selector].push(rule.test);
                    }else{
                        ruleSelector[rule.selector]=[rule.test]
                    }
                    // ruleSelector[rule.selector] = rule.test;
                        var inputElements=formElement.querySelectorAll(rule.selector);
                        Array.from(inputElements).forEach(function(inputElement){
                            inputElement.onblur=function(){
                                validate(inputElement,rule);
                             }
                             inputElement.onchange=function(){
                                validate(inputElement,rule);
                             }
                             inputElement.oninput = function(){
                                 removeErrInput (inputElement);
                             }
                        })
                        // if(inputElement){
                           
                        // }
                })
               
               
        }
}
// check người dùng có nhập vào hay không
validator.isRequired= function(selector,message){
        return {
            selector: selector,
            test: function(value){
               
                    return value? undefined:message|| "Vui lòng nhập trường này!"
                
            }
        }
}
// check người dùng có nhập đúng hay không
validator.isEmail = function(selector,message){
return {
            selector: selector,
            test: function(value){
                var regex =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                return regex.test(value.trim())? undefined: "Trường này phải là email"
            }
        }
}
validator.isminLength = function(selector,min,message){
    return {
        selector: selector,
        test: function(value){
                return value.length>=min? undefined: `Mật khẩu phải có ${min} ký tự!`
        }
    }
}
validator.isConfired = function(selector,getComfirValue,message){
    return {
        selector: selector,
        test: function(value){
                return value=== getComfirValue()? undefined: message||"Xác nhận mật khẩu sai!"
        }
    }
}
