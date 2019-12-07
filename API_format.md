# API Fortmat CrawlDataProject
## GET COMPANY INFOMATIONS
### URL: https://mydomain.com/personnel/get
### Method: GET

### Response
```json
{
    success:true,
    result: [
        {
            _id:string,
            Trang:number,
            LinhVuc:string,
            TenCongTy:string,
            DiaChi:string,
            SoDienThoai:string,
            Email:string,
            Website:string,
            expand:[
                HoTenNguoiLienHe:string,
                EmailNguoiLienHe:string,
                SoDiDongNguoiLienHe:string
            ]
        }
    ]
}
//TH lỗi
{
    success:false,
    message:"String"
}
```

## CREATE NEW COMPANY INFOMATION
### URL: https://mydomain.com/savedata
### Method: POST
### body:
     {
        _id:string,
        Trang:number,
        LinhVuc:string,
        TenCongTy:string,
        DiaChi:string,
        SoDienThoai:string,
        Email:string,
        Website:string,
        expand:[
            HoTenNguoiLienHe:string,
            EmailNguoiLienHe:string,
            SoDiDongNguoiLienHe:string
        ]
    }

### Response
```json
{
    success:true,
    result: 
        {
            _id:string,
            Trang:number,
            LinhVuc:string,
            TenCongTy:string,
            DiaChi:string,
            SoDienThoai:string,
            Email:string,
            Website:string,
            expand:[
                HoTenNguoiLienHe:string,
                EmailNguoiLienHe:string,
                SoDiDongNguoiLienHe:string
            ]
        }
}
//TH lỗi
{
    success:false,
    message:"String"
}
```

## UPDATE LINH VUC CHO COMPANY
### URL: https://mydomain.com/personnel/get/:linhvuc
### Method: PUT
### body:
    {
       LinhVuc:newLinhVuc;
    }

### Response
```json
{
    success:true,
    result: 
        {
            _id:string,
            Trang:number,
            LinhVuc:string,
            TenCongTy:string,
            DiaChi:string,
            SoDienThoai:string,
            Email:string,
            Website:string,
            expand:[
                HoTenNguoiLienHe:string,
                EmailNguoiLienHe:string,
                SoDiDongNguoiLienHe:string
            ]
        }
}
//TH lỗi
{
    success:false,
    message:"String"
}
```
## DELETE COMPANY THEO LINHVUC
### URL: https://mydomain.com/personnel/linhvuc/:linhvuc
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

## GET COMPANY INFOMATIONS FROM WEB
### URL: https://mydomain.com/getlink/:page
### Method: GET
### Lấy thông tin từ web với page = 1

### Response
```json
{
    success:true,
    result: [
        {
            _id:string,
            Trang:number,
            LinhVuc:string,
            TenCongTy:string,
            DiaChi:string,
            SoDienThoai:string,
            Email:string,
            Website:string,
            expand:[
                HoTenNguoiLienHe:string,
                EmailNguoiLienHe:string,
                SoDiDongNguoiLienHe:string
            ]
        }
    ]
}
//TH lỗi
{
    success:false,
    message:"String"
}
```

## GET ALL LINHVUC IN DATABASE LINHVUC
### URL: https://mydomain.com/linhvuc/linhvuc
### Method: GET
### Response
```json
{
    success:true,
    result: 
        {
            LinhVuc:string,
        }
    ]
}
//TH lỗi
{
    success:false,
    message:"String"
}
```

## GET PAGE OF LINHVUC IN DATABASE LINHVUC
### URL: https://mydomain.com/linhvuc/page/:linhvuc
### Method: GET
### Response
```json
{
    success:true,
    result: 
        {
            TongSoTrang:number,
        }
    ]
}
//TH lỗi
{
    success:false,
    message:"String"
}
```

## GET PAGE OF LATEST LINHVUC IN DATABASE LINHVUC
### URL: https://mydomain.com/linhvuc/pagelast
### Method: GET
### Response
```json
{
    success:true,
    result: 
        {
            TongSoTrang:number,
        }
    ]
}
//TH lỗi
{
    success:false,
    message:"String"
}
```

## GET LATEST LINHVUC IN DATABASE LINHVUC
### URL: https://mydomain.com/linhvuc/linhvuclast
### Method: GET
### Response
```json
{
    success:true,
    result: 
        {
            LinhVuc:string,
        }
    ]
}
//TH lỗi
{
    success:false,
    message:"String"
}
```

## GET DATA WITH LINHVUC IN DATABASE COLLECTION
### URL: https://mydomain.com/personnel/get/:linhvuc
### Method: GET
### Response
```json
{
    success:true,
    result: 
        {
            _id:string,
            Trang:number,
            LinhVuc:string,
            TenCongTy:string,
            DiaChi:string,
            SoDienThoai:string,
            Email:string,
            Website:string,
            expand:[
                HoTenNguoiLienHe:string,
                EmailNguoiLienHe:string,
                SoDiDongNguoiLienHe:string
            ]
        }
    ]
}
//TH lỗi
{
    success:false,
    message:"String"
}
```

## GET DATA WITH LINHVUC AND PAGE IN DATABASE COLLECTION
### URL: https://mydomain.com/personnel/get/:linhvuc/:page
### Method: GET
### Response
```json
{
    success:true,
    result: 
        {
            _id:string,
            Trang:number,
            LinhVuc:string,
            TenCongTy:string,
            DiaChi:string,
            SoDienThoai:string,
            Email:string,
            Website:string,
            expand:[
                HoTenNguoiLienHe:string,
                EmailNguoiLienHe:string,
                SoDiDongNguoiLienHe:string
            ]
        }
    ]
}
//TH lỗi
{
    success:false,
    message:"String"
}
```

## CREATE NEW LINHVUC
### URL: https://mydomain.com/linhvuc/get
### Method: POST
### body:
     {
        _id:string,
        link:String,
        LinhVuc:string,
        TongSoTrang:number
    }

### Response
```json
{
    success:true,
    result: 
        {
            _id:string,
            link:String,
            LinhVuc:string,
            TongSoTrang:number
        }
}
//TH lỗi
{
    success:false,
    message:"String"
}
```

## DELETE DATABASE LINHVUC THEO LINHVUC
### URL: https://mydomain.com/linhvuc/linhvuc/:linhvuc
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
### URL: https://mydomain.com/linhvuc/linhvuc/:linhvuc
### Method: PUT  
### Response
```json
{
    success:true,
    result: 
        {
            _id:string,
            link:String,
            LinhVuc:string,
            TongSoTrang:number
        }
}
//TH lỗi
{
    success:false,
    message:"String"
}
```

## CHECK LINK TRONG DATABASE LINHVUC
### URL: https://mydomain.com/linhvuc/link/:linhvuc
### Method: GET  
### Response
```json
{
    success:true,
    result: 
        if (response.length == 0)
            return true; 
        else
            return false;
}
//TH lỗi
{
    success:false,
    message:"String"
}
```