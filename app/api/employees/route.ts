import path from "path";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(res:any) {
    try {
        
      // Bước 1:Lấy ra đường dẫn của file cần đọc
      const filePath = path.join(process.cwd(), "database", "employees.json");
      // Bước 2 : Sử dụng fs để đọc file
      const data = fs.readFileSync(filePath, "utf-8");
  
      //Bước 3 : Ép kiểu từ dạng json sang TS
      const employees = JSON.parse(data);
     
      // Trả về dữ liệu cho phía client
      return NextResponse.json({
        employees,
        message: "Lấy dữ liệu nhân viên thành công",
      });
    } catch (error) {
      return NextResponse.json(error);
    }
  }

  export async function POST(request: NextRequest, response: NextResponse) {
    try {
      //Bước 1 : Lấy dữ liệu từ phía client
      const employeeRequest = await request.json();
  
      //Bước 2 : lấy ra đường dẫn của file cần ghi
      const filePath = path.join(process.cwd(), "database", "employees.json");
  
      //Bước 3: Đọc file cần ghi vào
      const employees = JSON.parse(fs.readFileSync(filePath, "utf8"));
      console.log(employees);
  
      //Bước 4 : push dữ liệu vào trong mảng
      employees.push(employeeRequest);
  
      // Bước 5 : ghi file
      fs.writeFileSync(filePath, JSON.stringify(employees), "utf-8");
  
      return NextResponse.json({ message: "Thêm mới nhân viên thành công" });
    } catch (error) {
      return NextResponse.json({ message: "Thêm mới thất bại" });
    }
  }
