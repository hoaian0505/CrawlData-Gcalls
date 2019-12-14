# API Fortmat CrawlDataProject
## URL: https://mydomain.com/*


## GET COMPANY INFOMATIONS
### URL: company
### Method: GET

### Response
```json
{
    success:true,
    result: {
            _id:string,
            Page:number,
            Field:string,
            CompanyName:string,
            Adress:string,
            Tel:string,
            Email:string,
            Website:string,
            expand:[{
                NameContact:string,
                EmailContact:string,
                CellPhoneContact:string
            }]
        }
    
}
//TH lỗi
{
    success:false,
    message:"String"
}
```

## CREATE NEW COMPANY INFOMATION
### URL: company
### Method: POST
### body:
```json
     {
        _id:string,
        Page:number,
        Field:string,
        CompanyName:string,
        Adress:string,
        Tel:string,
        Email:string,
        Website:string,
        expand:[{
            NameContact:string,
            EmailContact:string,
            CellPhoneContact:string
        }]
    }

### Response
```json
{
    success:true,
    result: 
        {
            _id:string,
            Page:number,
            Field:string,
            CompanyName:string,
            Adress:string,
            Tel:string,
            Email:string,
            Website:string,
            expand:[{
                NameContact:string,
                EmailContact:string,
                CellPhoneContact:string
            }]
        }
}
//TH lỗi
{
    success:false,
    message:"String"
}
```

## UPDATE LINH VUC CHO COMPANY
### URL: company/:field
### Method: PUT
### body:
    {
       Field: newField;
    }

### Response
```json
{
    success:true,
    result: 
        {
            _id:string,
            Page:number,
            Field:string,
            CompanyName:string,
            Adress:string,
            Tel:string,
            Email:string,
            Website:string,
            expand:[{
                NameContact:string,
                EmailContact:string,
                CellPhoneContact:string
            }]
        }
}
//TH lỗi
{
    success:false,
    message:"String"
}
```

## DELETE COMPANY THEO LINHVUC
### URL: company/field/:field
### Method: DELETE  
### Response
```json
{
    success:true
}
//TH lỗi
{
    success:false,
    message:"String"
}
```


## GET DATA WITH LINHVUC IN DATABASE COLLECTION
### URL: company/:field
### Method: GET
### Response
```json
{
    success:true,
    result: {
            _id:string,
            Page:number,
            Field:string,
            CompanyName:string,
            Adress:string,
            Tel:string,
            Email:string,
            Website:string,
            expand:[{
                NameContact:string,
                EmailContact:string,
                CellPhoneContact:string
            }]
        }
}
//TH lỗi
{
    success:false,
    message:"String"
}
```

## GET DATA WITH LINHVUC AND PAGE IN DATABASE COLLECTION
### URL: company/:field/:page
### Method: GET
### Response
```json
{
    success:true,
    result: {
            _id:string,
            Page:number,
            Field:string,
            CompanyName:string,
            Adress:string,
            Tel:string,
            Email:string,
            Website:string,
            expand:[{
                NameContact:string,
                EmailContact:string,
                CellPhoneContact:string
            }]
        }
}
//TH lỗi
{
    success:false,
    message:"String"
}
```

## GET COMPANY INFOMATIONS FROM WEB
### URL: getlink/:page
### Method: GET
### Lấy thông tin từ web với pages

### Response
```json
{
    success:true,
    result: {
            _id:string,
            Page:number,
            Field:string,
            CompanyName:string,
            Adress:string,
            Tel:string,
            Email:string,
            Website:string,
            expand:[{
                NameContact:string,
                EmailContact:string,
                CellPhoneContact:string
            }]
        }
    
}
//TH lỗi
{
    success:false,
    message:"String"
}
```


## GET ALL LINHVUC IN DATABASE LINHVUC
### URL: field/allfields
### Method: GET
### Response
```json
{
    success:true,
    result:{
            Field:string,
        }
}
//TH lỗi
{
    success:false,
    message:"String"
}
```

## GET PAGE OF LINHVUC IN DATABASE LINHVUC
### URL: field/page/:field
### Method: GET
### Response
```json
{
    success:true,
    result: {
            TotalPages:number,
        }
}
//TH lỗi
{
    success:false,
    message:"String"
}
```

## GET PAGE OF LATEST LINHVUC IN DATABASE LINHVUC
### URL: field/pagelast
### Method: GET
### Response
```json
{
    success:true,
    result: {
            TotalPages:number,
        }
}
//TH lỗi
{
    success:false,
    message:"String"
}
```

## GET LATEST LINHVUC IN DATABASE LINHVUC
### URL: field/fieldlast
### Method: GET
### Response
```json
{
    success:true,
    result: {
            Field:string,
        }
}
//TH lỗi
{
    success:false,
    message:"String"
}
```

## CREATE NEW LINHVUC
### URL: field
### Method: POST
### body:
     {
        _id:string,
        link:String,
        Field:string,
        TotalPages:number
    }

### Response
```json
{
    success:true,
    result: 
        {
            _id:string,
            link:String,
            Field:string,
            TotalPages:number
        }
}
//TH lỗi
{
    success:false,
    message:"String"
}
```

## DELETE DATABASE LINHVUC THEO LINHVUC
### URL: field/:field
### Method: DELETE  
### Response
```json
{
    success:true
}
//TH lỗi
{
    success:false,
    message:"String"
}
```

## UPDATE LINHVUC CHO DATABASE LINHVUC
### URL: field/:field
### Method: PUT  
### Response
```json
{
    success:true,
    result: 
        {
            _id:string,
            link:String,
            Field:string,
            TotalPages:number
        }
}
//TH lỗi
{
    success:false,
    message:"String"
}
```

## CHECK LINK TRONG DATABASE LINHVUC
### URL: field/link/:link
### Method: GET  
### Response
```json
{
    success:true,
    result:[
        if response.length == 0
            return true
        else
            return false
    ]
}
//TH lỗi
{
    success:false,
    message:"String"
}
```