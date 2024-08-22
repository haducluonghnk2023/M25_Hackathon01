import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET(request: NextRequest,{params}:any) {
  try {
    const idEmployee = {params};
    console.log(idEmployee);
    
    // Bước 1:Lấy ra đường dẫn của file cần đọc
    const filePath = path.join(process.cwd(), "database", "employees.json");
    // Bước 2 : Sử dụng fs để đọc file
    const data = fs.readFileSync(filePath, "utf-8");

    //Bước 3 : Ép kiểu từ dạng json sang TS
    const employees = JSON.parse(data);

    let employee = employees.find((item:any)=>{
        return item.id === +params.idEmployee;
    })
    // console.log("1111111111111111", +params.idEmployee);
    
    return NextResponse.json({
        message: "Lấy dữ liệu nhân viên thành công",employee
      });
  } catch (error) {
    return NextResponse.json({message:"Lấy dữ liệu thông tin thất bại" ,error});
  }
}

export async function PUT(
  req: NextRequest,
  { params: { idEmployee } }: { params: { idEmployee: string } }
) {
  try {
    const id = { params: { idEmployee } };
    console.log("aaaaaaaaaaaaa",idEmployee);
    
    // Bước 1 : Lấy vị trí file cần đọc
    const filePath = path.join(process.cwd(), "database", "employees.json");

    // Đọc file
    const employees = JSON.parse(fs.readFileSync(filePath, "utf8"));

    console.log("00000000000", employees);

    // Bước 2 : Tìm kiếm vị trí phần tử cần cập nhật
    const findIndex = employees.findIndex(
      (employee: any) => employee.id === +idEmployee
    );

    // Bước 3 : Gán lại giá trị cho phần tử cần cập nhật
    if (findIndex !== -1) {
      const employee = await req.json();
      console.log(employee);
      employees[findIndex] = {...employees[findIndex],...employee };
    }

    // Bước 4 : Ghi đè lại file
    fs.writeFileSync(filePath, JSON.stringify(employees), "utf8");

    // Bước 5 : Trả về message cho client
    return NextResponse.json("Cập nhật thông tin nhân viên thành công");
  } catch (error) {
    return NextResponse.json("Cập nhật không thành công");
  }
}


export async function DELETE(request: NextRequest,{params}:any) {
    try {
      const idEmployee = {params};
      console.log(idEmployee);
      
      // Bước 1:Lấy ra đường dẫn của file cần đọc
      const filePath = path.join(process.cwd(), "database", "employees.json");
      // Bước 2 : Sử dụng fs để đọc file
      const data = fs.readFileSync(filePath, "utf-8");
  
      //Bước 3 : Ép kiểu từ dạng json sang TS
      const employees = JSON.parse(data);
  
      let employee = employees.filter((item:any)=>{
          return item.id !== +params.idEmployee;
      })

          fs.writeFileSync(filePath, JSON.stringify(employee), "utf8");
      return NextResponse.json({
          message: "Xóa dữ liệu nhân viên thành công",employee
        });
    } catch (error) {
      return NextResponse.json({message:"Xóa dữ liệu thông tin thất bại" ,error});
    }
  }